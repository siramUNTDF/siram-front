import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@mui/material'
import VentanaLateral from '@/componentes/VentanaLateral'
import Bloque from '@/componentes/Bloque'
import Mensaje from '@/componentes/Mensaje'
import { Fila, Nota, Opciones, Texto } from '@/componentes/formulario/Campos'
import useFormulario from '@/componentes/formulario/useFormulario'
import { useAvisar } from '@/componentes/avisos'
import { canalesOrigen, especies } from '@/componentes/caso/catalogos'
import { api, useSesion } from '@/mocks'
import { dni as formatoDni, fechaCorta, soloDigitos } from '@/utiles/formato'
import { correoValido, dniValido, fechaFutura, mensajeDni, telefonoValido, vacio } from '@/utiles/validacion'

const persona = { nombre: '', apellido: '', dni: '', telefono: '', correo: '' }
const inicial = { informaLaVictima: null, victima: persona, contactoResponsable: persona, fechaHecho: '', especie: null }

// Qué es obligatorio según el canal (nuevo-caso.md). El back hace cumplir la regla final.
const obligatorio = {
  telefonoDeQuienSeContacta: (canal) => canal === 'zoonosis',
  fechaHecho: (canal) => canal !== 'salud',
}

const ayudaDni = 'Solo números, 7 u 8, con o sin puntos.'

function validar(v, canal) {
  const e = {}
  const conContacto = v.informaLaVictima === false
  if (v.informaLaVictima == null) e.informaLaVictima = 'Respondé si quien informa es quien sufrió el ataque'
  const personas = conContacto ? ['victima', 'contactoResponsable'] : ['victima']
  for (const p of personas) {
    if (vacio(v[p].nombre)) e[`${p}.nombre`] = 'Falta el nombre'
    if (vacio(v[p].apellido)) e[`${p}.apellido`] = 'Falta el apellido'
    if (vacio(v[p].dni)) e[`${p}.dni`] = 'Falta el DNI'
    else if (!dniValido(v[p].dni)) e[`${p}.dni`] = mensajeDni
    if (!vacio(v[p].correo) && !correoValido(v[p].correo)) e[`${p}.correo`] = 'El correo no tiene un formato válido'
    if (!vacio(v[p].telefono) && !telefonoValido(v[p].telefono)) e[`${p}.telefono`] = 'El teléfono tiene que tener al menos 6 números'
  }
  if (conContacto && !e['contactoResponsable.dni'] && soloDigitos(v.contactoResponsable.dni) === soloDigitos(v.victima.dni)) {
    e['contactoResponsable.dni'] = 'Es el mismo DNI que la víctima. Si es la misma persona, respondé “Sí” arriba.'
  }
  const quienSeContacta = conContacto ? 'contactoResponsable' : 'victima'
  if (obligatorio.telefonoDeQuienSeContacta(canal) && vacio(v[quienSeContacta].telefono)) e[`${quienSeContacta}.telefono`] = 'Falta el teléfono'
  if (obligatorio.fechaHecho(canal) && vacio(v.fechaHecho)) e.fechaHecho = 'Falta la fecha del hecho'
  if (fechaFutura(v.fechaHecho)) e.fechaHecho = 'La fecha del hecho no puede ser futura'
  if (!v.especie) e.especie = 'Elegí la especie del animal'
  return e
}

function BloquePersona({ titulo, bajada, prefijo, f, telefonoObligatorio }) {
  const campo = (c) => ({ valor: f.valor(`${prefijo}.${c}`), onCambio: (x) => f.poner(`${prefijo}.${c}`, x), error: f.errores[`${prefijo}.${c}`] })
  return (
    <Bloque titulo={titulo} bajada={bajada}>
      <Fila>
        <Texto etiqueta="Nombre" requerido {...campo('nombre')} />
        <Texto etiqueta="Apellido" requerido {...campo('apellido')} />
        <Texto etiqueta="DNI" requerido ayuda={ayudaDni} inputMode="numeric" {...campo('dni')} />
        <Texto etiqueta="Teléfono" requerido={telefonoObligatorio} placeholder={telefonoObligatorio ? undefined : 'Opcional'} tipo="tel" {...campo('telefono')} />
        <Texto etiqueta="Correo electrónico" placeholder="Opcional" tipo="email" {...campo('correo')} />
      </Fila>
    </Bloque>
  )
}

// Formulario inicial en una ventana lateral, sobre la Bandeja.
export default function NuevoCaso({ onCerrar }) {
  const sesion = useSesion()
  const navigate = useNavigate()
  const avisar = useAvisar()
  const f = useFormulario(inicial)
  const [coincidencia, setCoincidencia] = useState(null)
  const canal = sesion.tipo
  const v = f.valores
  const conContacto = v.informaLaVictima === false

  function armar() {
    const limpiar = (p) => ({ ...p, dni: soloDigitos(p.dni) })
    return {
      informaLaVictima: v.informaLaVictima,
      victima: limpiar(v.victima),
      contactoResponsable: conContacto ? limpiar(v.contactoResponsable) : null,
      fechaHecho: v.fechaHecho || null,
      especie: v.especie,
    }
  }

  function terminar(numero) {
    avisar('exito', `Caso ${numero} registrado`)
    navigate(`/casos/${numero}`)
  }

  function guardar(decision = null) {
    const errores = validar(v, canal)
    f.setErrores(errores)
    if (Object.keys(errores).length) return
    const r = api.crearCaso(armar(), decision)
    if (r.coincidencia) setCoincidencia(r.coincidencia)
    else terminar(r.numero)
  }

  // «Abrir C-…»: va a la ficha de ese caso sin crear el nuevo. Como hay datos cargados, antes pregunta.
  const [abriendo, setAbriendo] = useState(false)

  const aviso = coincidencia && (abriendo ? (
    <Mensaje
      tipo="advertencia"
      titulo="¿Descartás los datos cargados?"
      acciones={(
        <>
          <Button variant="outlined" color="inherit" onClick={() => setAbriendo(false)}>Seguir editando</Button>
          <Button variant="contained" color="error" onClick={() => navigate(`/casos/${coincidencia.numero}`)}>Descartar y abrir {coincidencia.numero}</Button>
        </>
      )}
    />
  ) : (
    <Mensaje
      tipo="advertencia"
      titulo="La víctima ya está en un caso"
      acciones={(
        <>
          <Button variant="outlined" color="inherit" onClick={() => setAbriendo(true)}>Abrir {coincidencia.numero}</Button>
          <Button variant="text" onClick={() => guardar('distintos')}>Es otro ataque, guardar igual</Button>
          <Button variant="text" onClick={() => guardar('revisar_despues')}>Guardar y revisar después</Button>
        </>
      )}
    >
      El DNI {formatoDni(v.victima.dni)} es víctima en {coincidencia.numero} ({coincidencia.organismo}, hecho del {fechaCorta(coincidencia.fechaHecho)}). Si es el mismo hecho, completá ese caso; si es otro ataque, guardá igual. Si no estás seguro, guardalo y revisalo después en Posibles duplicados.
    </Mensaje>
  ))

  return (
    <VentanaLateral
      abierta
      titulo="Nuevo caso"
      bajada={`Formulario inicial. Lo obligatorio (*) depende del canal; el caso guarda su canal de origen. Canal: ${canalesOrigen[canal]} (tu organismo).`}
      hayCambios={f.hayCambios}
      onCerrar={onCerrar}
      onGuardar={() => guardar()}
      arriba={aviso}
    >
      <Bloque titulo="¿Quién sufrió el ataque?" bajada="Si es la misma persona, se carga una sola (la víctima). Si no, se cargan la víctima y el contacto responsable.">
        <Opciones
          etiqueta="¿La persona que informa es quien sufrió el ataque?"
          requerido
          valor={v.informaLaVictima}
          onCambio={(x) => f.poner('informaLaVictima', x)}
          opciones={[[true, 'Sí'], [false, 'No, es otra persona']]}
          error={f.errores.informaLaVictima}
        />
      </Bloque>

      <BloquePersona
        titulo="Víctima"
        bajada={conContacto ? 'De la víctima es obligatorio todo salvo el contacto (p. ej. un niño no lo tiene).' : undefined}
        prefijo="victima"
        f={f}
        telefonoObligatorio={!conContacto && obligatorio.telefonoDeQuienSeContacta(canal)}
      />

      {conContacto && (
        <BloquePersona
          titulo="Contacto responsable"
          bajada="Quien informa en nombre de la víctima y a quien se contacta. No se guarda la relación entre ambas."
          prefijo="contactoResponsable"
          f={f}
          telefonoObligatorio={obligatorio.telefonoDeQuienSeContacta(canal)}
        />
      )}

      <Bloque titulo="Hecho">
        <Fila>
          <Texto etiqueta="Fecha del hecho" tipo="date" requerido={obligatorio.fechaHecho(canal)} valor={v.fechaHecho} onCambio={(x) => f.poner('fechaHecho', x)} error={f.errores.fechaHecho} mono />
          <Opciones etiqueta="Especie del animal" requerido valor={v.especie} onCambio={(x) => f.poner('especie', x)} opciones={especies} error={f.errores.especie} />
        </Fila>
      </Bloque>

      <Nota>
        Al guardar, si el DNI coincide con otro caso se avisa antes de crear el registro. Ubicación, animales, tratamiento y denuncia se completan después en la ficha del caso.
      </Nota>

    </VentanaLateral>
  )
}
