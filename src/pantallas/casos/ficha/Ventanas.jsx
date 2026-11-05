import { useState } from 'react'
import { Box, Button } from '@mui/material'
import VentanaLateral from '@/componentes/VentanaLateral'
import Bloque from '@/componentes/Bloque'
import Mensaje from '@/componentes/Mensaje'
import { CampoFecha, Fila, Nota, Opciones, Seleccion, Texto } from '@/componentes/formulario/Campos'
import useFormulario from '@/componentes/formulario/useFormulario'
import { useAvisar } from '@/componentes/avisos'
import Mapa from '@/componentes/mapa/Mapa'
import {
  dia10, edadesAparentes, especies, estados, estadosDenuncia, gravedades, motivosDesestimacion, motivosEspera,
  sexos, siNoNoSabe, tamanos, tenencias, tiposLugar, zonasCuerpo,
} from '@/componentes/caso/catalogos'
import { api, ErrorApi } from '@/mocks'
import { soloDigitos } from '@/utiles/formato'
import { correoValido, dniValido, fechaFutura, fechaInvalida, mensajeDni, mensajeFechaInvalida, telefonoValido, vacio } from '@/utiles/validacion'

const ciudades = { Ushuaia: 'Ushuaia', 'Río Grande': 'Río Grande', Tolhuin: 'Tolhuin' }
const siNo = { si: 'Sí', no: 'No' }
const aSiNo = (b) => (b == null ? null : b ? 'si' : 'no')

// Guarda con la API: un error de campo va debajo del campo; uno general, como mensaje en la ventana.
function useGuardar(f, onListo) {
  const [error, setError] = useState(null)
  const avisar = useAvisar()
  function guardar(validar, accion, exito) {
    const errores = validar ? validar(f.valores) : {}
    f.setErrores(errores)
    if (Object.keys(errores).length) return
    try {
      accion()
      avisar('exito', exito)
      onListo()
    } catch (e) {
      if (!(e instanceof ErrorApi)) throw e
      if (e.campo) f.setErrores({ [e.campo]: e.message })
      else setError(e.message)
    }
  }
  return { error, guardar }
}

const enlace = (f, ruta) => ({ valor: f.valor(ruta), onCambio: (x) => f.poner(ruta, x), error: f.errores[ruta] })

function validarPersona(v, prefijo, e) {
  if (vacio(v.nombre)) e[`${prefijo}.nombre`] = 'Falta el nombre'
  if (vacio(v.apellido)) e[`${prefijo}.apellido`] = 'Falta el apellido'
  if (vacio(v.dni)) e[`${prefijo}.dni`] = prefijo === 'victima' ? 'El DNI de la víctima no se puede vaciar' : 'Falta el DNI'
  else if (!dniValido(v.dni)) e[`${prefijo}.dni`] = mensajeDni
  if (!vacio(v.correo) && !correoValido(v.correo)) e[`${prefijo}.correo`] = 'El correo no tiene un formato válido'
  if (!vacio(v.telefono) && !telefonoValido(v.telefono)) e[`${prefijo}.telefono`] = 'El teléfono tiene que tener al menos 6 números'
}

// ─── Editar (datos comunes del caso) ─────────────────────────────────────────────────────
function Editar({ caso, onCerrar }) {
  const p = caso.victima
  const c = caso.contactoResponsable
  const f = useFormulario({
    victima: { nombre: p.nombre, apellido: p.apellido, dni: p.dni, edad: p.edad ?? '', telefono: p.telefono ?? '', correo: p.correo ?? '', domicilio: p.domicilio ?? '' },
    contactoResponsable: c ? { nombre: c.nombre, apellido: c.apellido, dni: c.dni, telefono: c.telefono ?? '', correo: c.correo ?? '' } : null,
    hecho: {
      fechaHecho: caso.fechaHecho ?? '', horaHecho: caso.horaHecho ?? '',
      lugar: { ciudad: caso.lugar.ciudad, direccion: caso.lugar.direccion ?? '', referencias: caso.lugar.referencias ?? '' },
      tipoLugar: caso.tipoLugar, tipoEvento: caso.tipoEvento, latitud: caso.lugar.latitud, longitud: caso.lugar.longitud,
    },
  })
  const { error, guardar } = useGuardar(f, onCerrar)
  const v = f.valores
  const tiposEvento = api.tiposEventoActivos()
  const [direccionAMano, setDireccionAMano] = useState(false)

  function validar(x) {
    const e = {}
    validarPersona(x.victima, 'victima', e)
    if (x.contactoResponsable) {
      validarPersona(x.contactoResponsable, 'contactoResponsable', e)
      if (!e['contactoResponsable.dni'] && soloDigitos(x.contactoResponsable.dni) === soloDigitos(x.victima.dni)) e['contactoResponsable.dni'] = 'Es el mismo DNI que la víctima.'
    }
    if (x.victima.edad !== '' && !/^\d{1,3}$/.test(String(x.victima.edad))) e['victima.edad'] = 'La edad va en años, solo números'
    if (fechaInvalida(x.hecho.fechaHecho)) e['hecho.fechaHecho'] = mensajeFechaInvalida
    else if (fechaFutura(x.hecho.fechaHecho)) e['hecho.fechaHecho'] = 'La fecha del hecho no puede ser futura'
    return e
  }

  // Al soltar el pin se propone la dirección, salvo que la persona la haya escrito a mano.
  function moverPin([lat, lon]) {
    f.poner('hecho.latitud', lat)
    f.poner('hecho.longitud', lon)
    if (!direccionAMano) f.poner('hecho.lugar.direccion', api.geocodificar(lat, lon))
  }

  const hecho = (campo) => enlace(f, `hecho.${campo}`)
  const compartida = (persona) => persona?.enCasos > 1 && (
    <Mensaje tipo="info">{persona.nombre} {persona.apellido} está en {persona.enCasos} casos: el cambio se ve en todos.</Mensaje>
  )

  return (
    <VentanaLateral
      abierta
      titulo="Editar caso"
      bajada={`${caso.numero} · datos comunes. El estado, los animales, el tratamiento y las denuncias se cambian en su propia ventana.`}
      hayCambios={f.hayCambios}
      onCerrar={onCerrar}
      error={error}
      onGuardar={() => guardar(validar, () => api.editarCaso(caso.numero, v), 'Caso actualizado')}
    >
      {compartida(p)}
      <Bloque titulo="Víctima">
        <Fila>
          <Texto etiqueta="Nombre" requerido {...enlace(f, 'victima.nombre')} />
          <Texto etiqueta="Apellido" requerido {...enlace(f, 'victima.apellido')} />
          <Texto etiqueta="DNI" requerido ayuda="Solo números, 7 u 8, con o sin puntos." {...enlace(f, 'victima.dni')} />
          <Texto etiqueta="Edad (al momento del hecho)" ayuda="En años." inputMode="numeric" {...enlace(f, 'victima.edad')} />
          <Texto etiqueta="Teléfono" tipo="tel" {...enlace(f, 'victima.telefono')} />
          <Texto etiqueta="Correo electrónico" tipo="email" {...enlace(f, 'victima.correo')} />
          <Texto etiqueta="Domicilio" {...enlace(f, 'victima.domicilio')} />
        </Fila>
      </Bloque>

      {compartida(c)}
      <Bloque titulo="Contacto responsable">
        {v.contactoResponsable ? (
          <>
            <Fila>
              <Texto etiqueta="Nombre" requerido {...enlace(f, 'contactoResponsable.nombre')} />
              <Texto etiqueta="Apellido" requerido {...enlace(f, 'contactoResponsable.apellido')} />
              <Texto etiqueta="DNI" requerido {...enlace(f, 'contactoResponsable.dni')} />
              <Texto etiqueta="Teléfono" tipo="tel" {...enlace(f, 'contactoResponsable.telefono')} />
              <Texto etiqueta="Correo electrónico" tipo="email" {...enlace(f, 'contactoResponsable.correo')} />
            </Fila>
            <Button variant="text" color="error" onClick={() => f.poner('contactoResponsable', null)}>Quitar contacto responsable</Button>
            <Nota>La persona no se borra: deja de estar en este caso.</Nota>
          </>
        ) : (
          <Button variant="outlined" color="inherit" sx={{ borderColor: 'divider' }} onClick={() => f.poner('contactoResponsable', { nombre: '', apellido: '', dni: '', telefono: '', correo: '' })}>
            Agregar contacto responsable
          </Button>
        )}
      </Bloque>

      <Bloque titulo="Hecho">
        <Fila>
          <CampoFecha etiqueta="Fecha del hecho" sinFuturas mono {...hecho('fechaHecho')} />
          <Texto etiqueta="Hora" tipo="time" mono {...hecho('horaHecho')} />
          <Seleccion etiqueta="Ciudad" opciones={ciudades} {...hecho('lugar.ciudad')} />
          <Seleccion etiqueta="Tipo de lugar" opciones={tiposLugar} {...hecho('tipoLugar')} />
        </Fila>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ fontSize: 13.5, fontWeight: 600, mb: '6px' }}>Ubicación</Box>
          <Mapa alto={220} pinFijo centro={v.hecho.latitud != null ? [v.hecho.latitud, v.hecho.longitud] : [-54.8069, -68.3073]} onMover={moverPin} />
          <Nota sx={{ mt: '4px' }}>Mové el mapa hasta dejar el pin donde pasó. Al soltarlo se propone la dirección.</Nota>
        </Box>
        <Fila>
          <Texto etiqueta="Dirección" {...hecho('lugar.direccion')} onCambio={(x) => { setDireccionAMano(true); f.poner('hecho.lugar.direccion', x) }} />
          <Texto etiqueta="Referencias" {...hecho('lugar.referencias')} />
        </Fila>
      </Bloque>

      <Bloque titulo="Tipo de evento">
        <Seleccion etiqueta="Tipo de evento" opciones={tiposEvento.map((t) => [t, t])} {...hecho('tipoEvento')} />
      </Bloque>
    </VentanaLateral>
  )
}

// ─── Cambiar estado ──────────────────────────────────────────────────────────────────────
function CambiarEstado({ caso, onCerrar, onCambiar }) {
  const enSeguimiento = caso.estado === 'en_seguimiento'
  const f = useFormulario({ estado: null, motivoEspera: caso.motivoEspera })
  const { error, guardar } = useGuardar(f, onCerrar)
  const destinos = caso.transiciones.filter((t) => t !== caso.estado)
  const elegido = f.valores.estado
  const conMotivo = elegido === 'en_seguimiento' || (enSeguimiento && !elegido)
  const hayCambios = Boolean(elegido) || (enSeguimiento && f.valores.motivoEspera !== caso.motivoEspera)

  function elegir(estado) {
    // Desestimado tiene su propia ventana, que pide el motivo.
    if (estado === 'desestimado') onCambiar({ tipo: 'desestimar' })
    else f.poner('estado', estado)
  }

  const estadoFinal = elegido ?? caso.estado
  return (
    <VentanaLateral
      abierta
      titulo="Cambiar estado"
      bajada={`${caso.numero} · estado actual: ${estados[caso.estado].etiqueta}${enSeguimiento ? ` (${motivosEspera[caso.motivoEspera]})` : ''}`}
      hayCambios={hayCambios}
      onCerrar={onCerrar}
      error={error}
      onGuardar={() => guardar(
        (x) => (estadoFinal === 'en_seguimiento' && !x.motivoEspera ? { motivoEspera: 'Elegí qué se está esperando' } : {}),
        () => api.cambiarEstado(caso.numero, { estado: estadoFinal, motivoEspera: f.valores.motivoEspera }),
        'Estado actualizado',
      )}
    >
      <Bloque titulo="Estado">
        <Opciones
          etiqueta="Nuevo estado"
          requerido={!enSeguimiento}
          vertical
          valor={elegido}
          onCambio={elegir}
          opciones={destinos.map((d) => [d, estados[d].etiqueta])}
          sinError
        />
        <Nota sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
          <span>Finalizado: se puede finalizar aunque falten datos; entonces deja de contar como incompleto.</span>
          <span>Solo se ofrecen los estados a los que se puede pasar desde el actual: no se vuelve a Registrado. Grave no es un estado: es una marca que sale del día 10 de los animales.</span>
          <span>Desestimado: abre «Desestimar caso», que pide el motivo. Unificado no se elige acá: resulta de consolidar duplicados.</span>
        </Nota>
      </Bloque>
      {conMotivo && (
        <Bloque titulo="Motivo de espera">
          <Opciones etiqueta="¿Qué se está esperando?" requerido opciones={{ contacto: 'Contacto', respuesta: 'Respuesta', certificado: 'Certificado' }} {...enlace(f, 'motivoEspera')} nota="Solo existe mientras el caso está en seguimiento." />
        </Bloque>
      )}
    </VentanaLateral>
  )
}

// ─── Desestimar ──────────────────────────────────────────────────────────────────────────
// El motivo se guarda con su texto corto (sin la aclaración entre paréntesis).
const motivoCorto = (clave) => motivosDesestimacion[clave].replace(/\s*\(.*\)$/, '').replace('Hecho inexistente o no verificable', 'Hecho no verificable')

function Desestimar({ caso, onCerrar }) {
  const f = useFormulario({ motivo: null, observacion: '' })
  const { error, guardar } = useGuardar(f, onCerrar)
  return (
    <VentanaLateral
      abierta
      titulo="Desestimar caso"
      bajada={`${caso.numero}. No se borra: queda desestimado, con su motivo, en el historial.`}
      hayCambios={f.hayCambios}
      onCerrar={onCerrar}
      error={error}
      peligro
      textoGuardar="Desestimar"
      onGuardar={() => guardar(
        (x) => (x.motivo ? {} : { motivo: 'Elegí por qué se desestima' }),
        () => api.desestimar(caso.numero, { motivo: motivoCorto(f.valores.motivo), observacion: f.valores.observacion }),
        `Caso ${caso.numero} desestimado`,
      )}
    >
      <Bloque titulo="Motivo">
        <Opciones etiqueta="¿Por qué se desestima?" requerido vertical opciones={motivosDesestimacion} {...enlace(f, 'motivo')} nota="Duplicado no es un motivo: se consolida. Datos insuficientes tampoco: es la marca Incompleto. Lista tentativa." />
        <Texto etiqueta="Observación" multilinea placeholder="Opcional" {...enlace(f, 'observacion')} />
      </Bloque>
      <Mensaje tipo="advertencia">Si le faltan datos, sigue marcado como incompleto. Un caso desestimado no cuenta en las estadísticas.</Mensaje>
    </VentanaLateral>
  )
}

// ─── No es duplicado (la misma ventana que en la comparación) ────────────────────────────
export function NoEsDuplicado({ numeroA, numeroB, onCerrar, onListo = onCerrar }) {
  const f = useFormulario({ observacion: '' })
  const { error, guardar } = useGuardar(f, onListo)
  return (
    <VentanaLateral
      abierta
      titulo="Son casos distintos"
      bajada={`${numeroA} y ${numeroB}: otro ataque a la misma persona. La marca de posible duplicado se va y el aviso no vuelve para estos dos casos.`}
      onCerrar={onCerrar}
      hayCambios={f.hayCambios}
      deshabilitado={false}
      error={error}
      onGuardar={() => guardar(null, () => api.marcarDistintos(numeroA, numeroB, f.valores.observacion), 'Marcados como casos distintos')}
    >
      <Texto etiqueta="Observación" multilinea placeholder="Opcional. P. ej.: otro ataque a la misma persona" {...enlace(f, 'observacion')} />
    </VentanaLateral>
  )
}

// ─── Anotar o corregir denuncia (solo Zoonosis) ──────────────────────────────────────────
function Denuncia({ caso, denuncia, onCerrar }) {
  const f = useFormulario({
    dniDenunciante: denuncia?.dniDenunciante ?? '', fecha: denuncia?.fecha ?? '', numero: denuncia?.numero ?? '',
    estado: denuncia?.estado ?? null, observaciones: denuncia?.observaciones ?? '',
  })
  const { error, guardar } = useGuardar(f, onCerrar)
  function validar(x) {
    const e = {}
    if (vacio(x.dniDenunciante)) e.dniDenunciante = 'Falta el DNI de quien la hizo'
    else if (!dniValido(x.dniDenunciante)) e.dniDenunciante = mensajeDni
    if (vacio(x.fecha)) e.fecha = 'Falta la fecha de la denuncia'
    else if (fechaInvalida(x.fecha)) e.fecha = mensajeFechaInvalida
    else if (fechaFutura(x.fecha)) e.fecha = 'La fecha no puede ser futura'
    if (!x.estado) e.estado = 'Elegí el estado de la denuncia'
    return e
  }
  return (
    <VentanaLateral
      abierta
      titulo={denuncia ? 'Corregir denuncia' : 'Anotar denuncia'}
      bajada="Solo Zoonosis, y solo denuncias hechas en Zoonosis. DNI y fecha alcanzan para ubicarla en su sistema."
      hayCambios={f.hayCambios}
      onCerrar={onCerrar}
      error={error}
      onGuardar={() => guardar(validar, () => api.guardarDenuncia(caso.numero, { ...f.valores, estadoTexto: estadosDenuncia[f.valores.estado] }, denuncia?.id), denuncia ? 'Denuncia corregida' : 'Denuncia anotada')}
    >
      <Bloque titulo="Denuncia">
        <Fila>
          <Texto etiqueta="DNI de quien la hizo" requerido ayuda="Solo números, 7 u 8, con o sin puntos." {...enlace(f, 'dniDenunciante')} />
          <CampoFecha etiqueta="Fecha de la denuncia" requerido sinFuturas mono {...enlace(f, 'fecha')} />
          <Texto etiqueta="Número de trámite" placeholder="Opcional" {...enlace(f, 'numero')} />
        </Fila>
        <Opciones etiqueta="Estado de la denuncia" requerido opciones={estadosDenuncia} ayuda="Tentativo. P. ej., una denuncia «desglosada y devuelta» a las 48 h sin certificado queda desestimada." {...enlace(f, 'estado')} />
        <Texto etiqueta="Observaciones" multilinea placeholder="Opcional" {...enlace(f, 'observaciones')} />
      </Bloque>
      <Nota>El DNI de quien la hizo no se enlaza a ninguna persona de SIRAM: es solo una referencia para encontrarla en Zoonosis. Lo que declaró la persona sobre su denuncia es otro dato y no se toca acá.</Nota>
    </VentanaLateral>
  )
}

// ─── Agregar o editar animal ─────────────────────────────────────────────────────────────
function Animal({ caso, indice, onCerrar }) {
  const a = indice != null ? caso.animales[indice] : null
  const campos = caso.camposAnimal
  const permite = (c) => campos.includes(c)
  const d = a?.descripcion ?? {}
  const f = useFormulario({
    especie: a?.especie ?? null, chip: a?.chip ?? '', tenencia: a?.tenencia ?? null,
    dueno: { nombre: a?.dueno?.nombre ?? '', apellido: a?.dueno?.apellido ?? '', dni: a?.dueno?.dni ?? '' },
    zona: a?.zona ?? '', vacunado: a?.vacunado ?? null,
    descripcion: { tamano: d.tamano ?? null, sexo: d.sexo ?? null, edadAparente: d.edadAparente ?? null, color: d.color ?? '', raza: d.raza ?? '', podriaReconocerlo: d.podriaReconocerlo ?? null },
    dia10: a?.dia10?.valor ?? 'pendiente', observaciones: a?.observaciones ?? '',
    foto: { nombre: '', url: '' },
  })
  const { error, guardar } = useGuardar(f, onCerrar)
  const v = f.valores
  const chipEnOtros = permite('chip') && soloDigitos(v.chip).length >= 10 && soloDigitos(v.chip) !== a?.chip ? api.casosConChip(v.chip) : []

  function validar(x) {
    const e = {}
    if (!x.especie) e.especie = 'Elegí la especie'
    const conDueno = !vacio(x.dueno.nombre) || !vacio(x.dueno.apellido) || !vacio(x.dueno.dni)
    if (permite('dueno') && conDueno && !dniValido(x.dueno.dni)) e['dueno.dni'] = mensajeDni
    if (!vacio(x.foto.nombre) && vacio(x.foto.url)) e['foto.url'] = 'Falta la dirección donde está alojada'
    return e
  }

  function accion() {
    const sinDueno = vacio(v.dueno.nombre) && vacio(v.dueno.dni)
    api.guardarAnimal(caso.numero, indice, { ...v, dueno: sinDueno ? { dni: '' } : v.dueno })
    if (!vacio(v.foto.nombre)) {
      const i = indice ?? caso.animales.length
      api.adjuntarDocumento(caso.numero, { destino: 'animal', animalIndice: i, nombre: v.foto.nombre, url: v.foto.url })
    }
  }

  return (
    <VentanaLateral
      abierta
      titulo={a ? `Editar animal · Animal ${indice + 1}` : 'Agregar animal'}
      bajada={a ? `${caso.numero}. Cada organismo edita lo que puede: dueño, chip, tenencia y seguimiento, solo Zoonosis.` : `${caso.numero}. Si el chip ya existe, se vincula ese animal: su identidad no se duplica.`}
      hayCambios={f.hayCambios}
      onCerrar={onCerrar}
      error={error}
      onGuardar={() => guardar(validar, accion, a ? 'Animal actualizado' : 'Animal agregado')}
    >
      <Bloque titulo="Identidad">
        <Fila>
          <Opciones etiqueta="Especie" requerido opciones={especies} {...enlace(f, 'especie')} />
          {permite('chip') && <Texto etiqueta="Chip" placeholder="Opcional" mono inputMode="numeric" {...enlace(f, 'chip')} />}
        </Fila>
        {chipEnOtros.length > 0 && (
          <Mensaje tipo="info">
            Este chip ya está en SIRAM. El animal aparece en {chipEnOtros.join(' y ')}. Al {a ? 'guardarlo' : 'agregarlo'}, ese mismo animal queda vinculado también a este caso.
          </Mensaje>
        )}
      </Bloque>

      <Bloque titulo="En este caso">
        <Fila>
          {permite('tenencia') && <Seleccion etiqueta="Tenencia" vacio="Sin dato" opciones={tenencias} {...enlace(f, 'tenencia')} />}
          {permite('zona') && <Texto etiqueta="Domicilio o zona del animal" {...enlace(f, 'zona')} />}
          {permite('vacunado') && <Opciones etiqueta="Vacunado contra la rabia" opciones={siNoNoSabe} {...enlace(f, 'vacunado')} />}
        </Fila>
        {permite('dueno') && (
          <>
            <Box sx={{ fontSize: 13.5, fontWeight: 600, mb: 1 }}>Dueño durante el caso</Box>
            <Fila columnas={3}>
              <Texto etiqueta="Nombre" {...enlace(f, 'dueno.nombre')} />
              <Texto etiqueta="Apellido" {...enlace(f, 'dueno.apellido')} />
              <Texto etiqueta="DNI" {...enlace(f, 'dueno.dni')} />
            </Fila>
            {a?.declaradoEnSolicitud && (
              <Mensaje tipo="info">Según la solicitud {a.declaradoEnSolicitud.solicitud}: dueño “{a.declaradoEnSolicitud.dueno}”. Cargalo arriba para confirmarlo.</Mensaje>
            )}
          </>
        )}
      </Bloque>

      {permite('descripcion') && (
        <Bloque titulo="Descripción">
          <Fila>
            <Opciones etiqueta="Tamaño" opciones={tamanos} {...enlace(f, 'descripcion.tamano')} />
            <Opciones etiqueta="Sexo" opciones={sexos} {...enlace(f, 'descripcion.sexo')} />
            <Opciones etiqueta="Edad aparente" opciones={edadesAparentes} {...enlace(f, 'descripcion.edadAparente')} />
            <Opciones etiqueta="¿Podría reconocerlo?" opciones={siNoNoSabe} {...enlace(f, 'descripcion.podriaReconocerlo')} />
            <Texto etiqueta="Color" {...enlace(f, 'descripcion.color')} />
            <Texto etiqueta="Raza" {...enlace(f, 'descripcion.raza')} />
          </Fila>
        </Bloque>
      )}

      {permite('dia10') && (
        <Bloque titulo="Seguimiento · Zoonosis">
          <Seleccion etiqueta="Observación del día 10" vacio={null} opciones={dia10} ayuda="Si murió o enfermó, el caso queda marcado Grave. Si no se lo pudo observar (ubicado sin acceso, o no se ubicó), el caso se puede finalizar igual." {...enlace(f, 'dia10')} />
          <Texto etiqueta="Observaciones" multilinea placeholder="P. ej.: está en un terreno sin acceso" {...enlace(f, 'observaciones')} />
        </Bloque>
      )}

      {permite('fotos') && (
        <Bloque titulo="Fotos del animal" bajada="Se guarda solo el nombre del archivo y la dirección donde está alojado.">
          <Fila>
            <Texto etiqueta="Nombre del archivo" placeholder="Opcional" {...enlace(f, 'foto.nombre')} />
            <Texto etiqueta="Dirección donde se aloja (URL)" tipo="url" {...enlace(f, 'foto.url')} />
          </Fila>
        </Bloque>
      )}

      <Nota>Dueño, chip, tenencia y seguimiento los carga solo Zoonosis.</Nota>
    </VentanaLateral>
  )
}

// ─── Cargar tratamiento (solo Salud) ─────────────────────────────────────────────────────
function Tratamiento({ caso, onCerrar }) {
  const t = caso.tratamiento ?? {}
  const f = useFormulario({
    fechaConsulta: t.fechaConsulta ?? '', zonaCuerpo: t.zonaCuerpo ?? null, gravedad: t.gravedad ?? null,
    antirrabica: aSiNo(t.antirrabica), antitetanica: aSiNo(t.antitetanica), antibiotico: aSiNo(t.antibiotico), sutura: aSiNo(t.sutura),
    observaciones: t.observaciones ?? '',
  })
  const { error, guardar } = useGuardar(f, onCerrar)
  const v = f.valores
  const aBool = (x) => (x == null ? null : x === 'si')
  function validar(x) {
    const e = {}
    if (vacio(x.fechaConsulta)) e.fechaConsulta = 'Falta la fecha de la consulta'
    else if (fechaInvalida(x.fechaConsulta)) e.fechaConsulta = mensajeFechaInvalida
    else if (fechaFutura(x.fechaConsulta)) e.fechaConsulta = 'La fecha no puede ser futura'
    return e
  }
  return (
    <VentanaLateral
      abierta
      titulo="Tratamiento"
      bajada="Solo Salud. Se liga al caso, no a la persona: así no se mezclan tratamientos de mordeduras distintas."
      hayCambios={f.hayCambios}
      onCerrar={onCerrar}
      error={error}
      textoGuardar="Guardar tratamiento"
      onGuardar={() => guardar(validar, () => api.guardarTratamiento(caso.numero, {
        ...v, antirrabica: aBool(v.antirrabica), antitetanica: aBool(v.antitetanica), antibiotico: aBool(v.antibiotico), sutura: aBool(v.sutura), observaciones: v.observaciones || null,
      }), 'Tratamiento guardado')}
    >
      <Bloque titulo="Consulta">
        <Fila>
          <CampoFecha etiqueta="Fecha de la consulta" requerido sinFuturas mono {...enlace(f, 'fechaConsulta')} />
          <Seleccion etiqueta="Zona del cuerpo" vacio="Sin dato" opciones={zonasCuerpo} {...enlace(f, 'zonaCuerpo')} />
        </Fila>
        <Opciones etiqueta="Gravedad" opciones={gravedades} {...enlace(f, 'gravedad')} />
      </Bloque>
      <Bloque titulo="Indicaciones">
        <Fila>
          <Opciones etiqueta="Vacuna antirrábica" opciones={siNo} ayuda="Por ahora sí o no. Si registrar el esquema de dosis está por consultar con Salud." {...enlace(f, 'antirrabica')} />
          <Opciones etiqueta="Antitetánica" opciones={siNo} {...enlace(f, 'antitetanica')} />
          <Opciones etiqueta="Antibiótico" opciones={siNo} {...enlace(f, 'antibiotico')} />
          <Opciones etiqueta="Sutura" opciones={siNo} {...enlace(f, 'sutura')} />
        </Fila>
        <Texto etiqueta="Observaciones" multilinea placeholder="Opcional" {...enlace(f, 'observaciones')} />
      </Bloque>
      <Nota>«Recibió atención médica» no se carga: se deduce de que el caso tenga un tratamiento.</Nota>
    </VentanaLateral>
  )
}

// ─── Adjuntar documento ──────────────────────────────────────────────────────────────────
function Documento({ caso, onCerrar }) {
  const alCaso = caso.permisos.includes('adjuntar_certificado')
  const conFotos = caso.camposAnimal.includes('fotos')
  const destinos = [alCaso && ['caso', 'Al caso (certificado médico)'], conFotos && ['animal', 'A un animal del caso (fotos)']].filter(Boolean)
  const f = useFormulario({ destino: destinos.length === 1 ? destinos[0][0] : null, animal: null, nombre: '', url: '' })
  const { error, guardar } = useGuardar(f, onCerrar)
  function validar(x) {
    const e = {}
    if (!x.destino) e.destino = 'Elegí a qué se adjunta'
    if (x.destino === 'animal' && x.animal == null) e.animal = 'Elegí el animal'
    if (vacio(x.nombre)) e.nombre = 'Falta el nombre del archivo'
    if (vacio(x.url)) e.url = 'Falta la dirección donde está alojado'
    return e
  }
  return (
    <VentanaLateral
      abierta
      titulo="Adjuntar documento"
      bajada="Se guarda solo el nombre del archivo y la dirección donde está alojado."
      hayCambios={f.hayCambios}
      onCerrar={onCerrar}
      error={error}
      onGuardar={() => guardar(validar, () => api.adjuntarDocumento(caso.numero, { destino: f.valores.destino, animalIndice: Number(f.valores.animal), nombre: f.valores.nombre, url: f.valores.url }), 'Documento adjuntado')}
    >
      <Bloque titulo="Documento">
        <Opciones etiqueta="¿A qué se adjunta?" requerido vertical opciones={destinos} {...enlace(f, 'destino')} />
        {f.valores.destino === 'animal' && (
          <Seleccion etiqueta="Animal" requerido opciones={caso.animales.map((a) => [a.indice, `Animal ${a.indice + 1} · ${especies[a.especie]}`])} {...enlace(f, 'animal')} />
        )}
        <Fila>
          <Texto etiqueta="Nombre del archivo" requerido {...enlace(f, 'nombre')} />
          <Texto etiqueta="Dirección donde se aloja (URL)" requerido tipo="url" {...enlace(f, 'url')} />
        </Fila>
      </Bloque>
      <Nota>El certificado médico lo carga Zoonosis.</Nota>
    </VentanaLateral>
  )
}

// La ventana abierta de la ficha. `ventana` es { tipo, …datos } o null.
export default function Ventanas({ caso, ventana, onCerrar, onCambiar }) {
  if (!ventana) return null
  const props = { caso, onCerrar, key: ventana.tipo }
  switch (ventana.tipo) {
    case 'editar': return <Editar {...props} />
    case 'estado': return <CambiarEstado {...props} onCambiar={onCambiar} />
    case 'desestimar': return <Desestimar {...props} />
    case 'distintos': return <NoEsDuplicado key="distintos" numeroA={caso.numero} numeroB={caso.coincidencia.numero} onCerrar={onCerrar} />
    case 'denuncia': return <Denuncia {...props} denuncia={ventana.denuncia} />
    case 'animal': return <Animal {...props} indice={ventana.indice} />
    case 'tratamiento': return <Tratamiento {...props} />
    case 'documento': return <Documento {...props} />
    default: return null
  }
}
