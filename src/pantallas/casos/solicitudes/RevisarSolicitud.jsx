import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Box, Button } from '@mui/material'
import CallMergeIcon from '@mui/icons-material/CallMerge'
import AddIcon from '@mui/icons-material/Add'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Bloque from '@/componentes/Bloque'
import Mensaje from '@/componentes/Mensaje'
import Dato, { Datos } from '@/componentes/Dato'
import { ArchivoAdjunto } from '@/componentes/ChipDato'
import VentanaLateral from '@/componentes/VentanaLateral'
import { Opciones, Texto } from '@/componentes/formulario/Campos'
import { useAvisar } from '@/componentes/avisos'
import {
  ciudades, edadesAparentes, especies, etiqueta, motivosNoDenuncia, quePaso, sexos, siNo, siNoNoSabe, tamanos, tenencias, tiposLugar,
} from '@/componentes/caso/catalogos'
import { api, ErrorApi, useApi } from '@/mocks'
import { fuentes } from '@/tema/tokens'
import { dni, fechaCorta, fechaHora, nombreCompleto } from '@/utiles/formato'
import NoEncontrada from '@/pantallas/NoEncontrada'

// «No sé» de la persona es una respuesta, no un dato faltante.
const conNoSe = (catalogo, v) => (v === 'no_sabe' ? 'No sé' : etiqueta(catalogo, v))

// Un dato que la persona no respondió no se muestra (no es «Sin dato»: no se preguntó).
function Si({ valor, ...props }) {
  if (valor == null || valor === '') return null
  return <Dato valor={valor} {...props} />
}

function EnlaceNueva({ numero }) {
  return <Box component={Link} to={`/casos/${numero}`} target="_blank" sx={{ color: 'primary.main', fontFamily: fuentes.mono }}>{numero}</Box>
}

function avisoCoincidencias(dniVictima, coincidencias) {
  const lista = coincidencias.map((c, i) => (
    <span key={c.numero}>
      {i > 0 && ' y en '}
      <EnlaceNueva numero={c.numero} /> ({c.organismo}, hecho del {fechaCorta(c.fechaHecho)})
    </span>
  ))
  return <>El DNI {dni(dniVictima)} es víctima en {lista}. Si es el mismo hecho, sumala a ese caso; si no, registrala como caso nuevo.</>
}

// Revisar una solicitud (solicitudes.md): se lee entera antes de decidir.
export default function RevisarSolicitud() {
  const { numero } = useParams()
  const navigate = useNavigate()
  const avisar = useAvisar()
  const { datos: s, error } = useApi(() => api.obtenerSolicitud(numero), [numero])
  const [ventana, setVentana] = useState(null)
  const [elegido, setElegido] = useState(null)
  const [numeroCaso, setNumeroCaso] = useState('C-2026-')
  const [errorVentana, setErrorVentana] = useState(null)

  if (error) return <NoEncontrada />
  const pendiente = s.estado === 'pendiente'
  const victima = s.informaLaVictima ? { ...s.quienInforma, ...(s.victima ?? {}) } : s.victima
  const coincidencias = s.coincidencias

  function ejecutar(accion) {
    try {
      accion()
    } catch (e) {
      if (!(e instanceof ErrorApi)) throw e
      setErrorVentana(e.message)
    }
  }

  function sumar() {
    if (coincidencias.length === 1) navigate(`/casos/solicitudes/${numero}/sumar/${coincidencias[0].numero}`)
    else if (coincidencias.length > 1) setVentana('elegir')
    else setVentana('numero')
  }

  const resumenCaso = ventana === 'numero' ? api.resumenCaso(numeroCaso.trim().toUpperCase()) : null
  const cerrar = () => { setVentana(null); setErrorVentana(null) }
  const detalle = s.seccionesCompletas >= 4 ? 'completo' : s.seccionesCompletas === 0 ? 'no completado' : 'parcial'

  return (
    <>
      <EncabezadoPagina
        volver="/casos/solicitudes"
        titulo={`Solicitud ${s.numero}`}
        bajada={`Enviada el ${fechaHora(s.enviada)} por el formulario público · ${pendiente ? 'pendiente de revisión' : s.estado} · formulario detallado ${detalle} (${s.seccionesCompletas} de 4)`}
        extra={<NotaDatosEjemplo />}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {pendiente ? (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="text" color="error" onClick={() => setVentana('descartar')}>Descartar</Button>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" color="inherit" startIcon={<CallMergeIcon />} onClick={sumar} sx={{ borderColor: 'divider', bgcolor: 'background.paper' }}>Sumar a un caso existente</Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setVentana('registrar')}>Registrar como caso nuevo</Button>
            </Box>
          </Box>
        ) : (
          <Mensaje tipo="info">
            {s.estado === 'registrada'
              ? <>Registrada el {fechaHora(s.resuelta.fecha)} por {s.resuelta.por} → <EnlaceNueva numero={s.caso} /></>
              : <>Descartada el {fechaCorta(s.resuelta.fecha)} por {s.resuelta.por}</>}
          </Mensaje>
        )}

        {pendiente && coincidencias.length > 0 && (
          <Mensaje tipo="advertencia" titulo="La víctima ya está en un caso">{avisoCoincidencias(victima.dni, coincidencias)}</Mensaje>
        )}

        <Box sx={{ fontSize: 13, color: 'text.secondary' }}>
          Lo que declaró la persona, tal cual. Al registrarla se copia al caso sin transcribir. Hasta que un agente decide, no escribe en ningún caso ni persona.
        </Box>

        <Bloque titulo="Quién la envía">
          <Datos>
            <Dato etiqueta="¿Es quien sufrió el ataque?" valor={s.informaLaVictima ? 'Sí' : 'No, informa por otra persona'} />
            <Dato etiqueta="Nombre y apellido" valor={nombreCompleto(s.quienInforma)} />
            <Dato etiqueta="DNI" valor={dni(s.quienInforma.dni)} mono />
            <Si etiqueta="Teléfono" valor={s.quienInforma.telefono} mono />
            <Si etiqueta="Correo electrónico" valor={s.quienInforma.correo} />
          </Datos>
        </Bloque>

        {!s.informaLaVictima && (
          <Bloque titulo="Víctima">
            <Datos>
              <Dato etiqueta="Nombre y apellido" valor={nombreCompleto(s.victima)} />
              <Dato etiqueta="DNI" valor={dni(s.victima.dni)} mono />
              <Si etiqueta="Edad" valor={s.victima.edad != null ? `${s.victima.edad} años` : null} />
              <Si etiqueta="Domicilio" valor={s.victima.domicilio} />
            </Datos>
          </Bloque>
        )}

        <Bloque titulo="Dónde y qué pasó">
          <Datos>
            <Dato etiqueta="Fecha del hecho" valor={fechaCorta(s.hecho.fechaHecho)} mono />
            <Si etiqueta="Hora" valor={s.hecho.horaHecho} mono />
            <Si etiqueta="Ciudad" valor={etiqueta(ciudades, s.hecho.ciudad)} />
            <Si etiqueta="Ubicación" valor={s.hecho.direccion} nota={s.hecho.latitud != null ? 'Pin en el mapa; dirección propuesta y confirmada' : null} />
            <Si etiqueta="Referencias" valor={s.hecho.referencias} />
            <Si etiqueta="Tipo de lugar" valor={conNoSe(tiposLugar, s.hecho.tipoLugar)} />
            <Si etiqueta="Qué pasó" valor={etiqueta(quePaso, s.hecho.quePaso)} nota={quePaso[s.hecho.quePaso]?.tipoEvento ? `→ ${quePaso[s.hecho.quePaso].tipoEvento}` : null} />
            <Si etiqueta="Cuántos animales atacaron" valor={s.hecho.cantidadAnimales} />
          </Datos>
        </Bloque>

        {s.animales.map((a, i) => (
          <Bloque key={i} titulo={`Animal ${i + 1} de ${s.animales.length}`}>
            <Datos>
              <Dato etiqueta="Especie" valor={especies[a.especie]} />
              {'deQuienEs' in a && <Si etiqueta="De quién es" valor={etiqueta(tenencias, a.deQuienEs)} />}
              <Si etiqueta="Dueño, según la persona" valor={a.duenoDeclarado} />
              <Si etiqueta="¿Tiene chip?" valor={conNoSe(siNoNoSabe, a.tieneChip)} />
              <Si etiqueta="Número de chip" valor={a.chip} mono />
              <Si etiqueta="Dónde vive" valor={a.zona} />
              <Si etiqueta="Vacunado contra la rabia" valor={conNoSe(siNoNoSabe, a.vacunado)} />
              <Si etiqueta="¿Podría reconocerlo?" valor={conNoSe(siNoNoSabe, a.podriaReconocerlo)} />
              {'tamano' in a && (
                <>
                  <Si etiqueta="Tamaño" valor={conNoSe(tamanos, a.tamano)} />
                  <Si etiqueta="Sexo" valor={conNoSe(sexos, a.sexo)} />
                  <Si etiqueta="Edad aparente" valor={conNoSe(edadesAparentes, a.edadAparente)} />
                  <Si etiqueta="Color" valor={a.color} />
                  <Si etiqueta="Raza" valor={a.raza} />
                </>
              )}
            </Datos>
            {a.fotos?.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {a.fotos.map((f) => <ArchivoAdjunto key={f.nombre} imagen nombre={f.nombre} url={f.url} detalle={[f.tamano, 'enviada con la solicitud'].filter(Boolean).join(' · ')} />)}
              </Box>
            )}
          </Bloque>
        ))}

        {s.denuncia.hizoDenuncia != null && (
          <Bloque titulo="La denuncia">
            <Datos>
              <Dato etiqueta="¿Hizo la denuncia en Zoonosis?" valor={etiqueta(siNo, s.denuncia.hizoDenuncia)} />
              <Si etiqueta="Motivo de no denunciar" valor={etiqueta(motivosNoDenuncia, s.denuncia.motivoNoDenuncia)} />
            </Datos>
          </Bloque>
        )}
      </Box>

      <VentanaLateral
        abierta={ventana === 'descartar'}
        titulo={`Descartar ${s.numero}`}
        onCerrar={cerrar}
        error={errorVentana}
        peligro
        textoGuardar="Descartar"
        deshabilitado={false}
        onGuardar={() => ejecutar(() => { api.descartarSolicitud(numero); avisar('exito', 'Solicitud descartada'); navigate('/casos/solicitudes') })}
      >
        <Box>¿Descartás la solicitud {s.numero}? No se borra: queda guardada con sus datos, pero no va a llegar a ningún caso.</Box>
      </VentanaLateral>

      <VentanaLateral
        abierta={ventana === 'registrar'}
        titulo="Registrar como caso nuevo"
        onCerrar={cerrar}
        error={errorVentana}
        textoGuardar={coincidencias.length ? 'Es otro ataque, registrar igual' : 'Registrar'}
        deshabilitado={false}
        arriba={coincidencias.length > 0 && <Mensaje tipo="advertencia" titulo="La víctima ya está en un caso">{avisoCoincidencias(victima.dni, coincidencias)}</Mensaje>}
        onGuardar={() => ejecutar(() => {
          const r = api.registrarSolicitud(numero)
          avisar('exito', `Caso ${r.numero} registrado`)
          navigate(`/casos/${r.numero}`)
        })}
      >
        <Box>Se crea un caso nuevo con lo que declaró la persona. El canal de origen queda como Ciudadano.</Box>
        <Box sx={{ fontSize: 13, color: 'text.tertiary' }}>
          Lo que la persona dijo del dueño y del chip de un animal no se copia a esos datos: queda en la solicitud hasta que Zoonosis lo confirme.
          {coincidencias.length > 0 && ' Si es el mismo hecho, la salida es «Sumar a un caso existente».'}
        </Box>
      </VentanaLateral>

      <VentanaLateral
        abierta={ventana === 'elegir'}
        titulo="Sumar a un caso existente"
        bajada="La víctima está en más de un caso. Elegí a cuál se suma la solicitud."
        onCerrar={cerrar}
        textoGuardar="Seguir"
        deshabilitado={!elegido}
        onGuardar={() => navigate(`/casos/solicitudes/${numero}/sumar/${elegido}`)}
      >
        <Opciones etiqueta="Caso" requerido vertical valor={elegido} onCambio={setElegido} opciones={coincidencias.map((c) => [c.numero, `${c.numero} · ${c.organismo} · hecho del ${fechaCorta(c.fechaHecho)}`])} />
      </VentanaLateral>

      <VentanaLateral
        abierta={ventana === 'numero'}
        titulo="Sumar a un caso existente"
        bajada="Escribí el número del caso y confirmá que es ese."
        onCerrar={cerrar}
        textoGuardar="Seguir"
        deshabilitado={!resumenCaso}
        onGuardar={() => navigate(`/casos/solicitudes/${numero}/sumar/${resumenCaso.numero}`)}
      >
        <Texto etiqueta="Número de caso" requerido mono valor={numeroCaso} onCambio={setNumeroCaso} placeholder="C-2026-…" />
        {resumenCaso && (
          <Mensaje tipo="info" titulo={resumenCaso.numero}>Víctima: {resumenCaso.victima ?? 'sin dato'} · hecho del {fechaCorta(resumenCaso.fechaHecho) ?? 'sin dato'}</Mensaje>
        )}
      </VentanaLateral>
    </>
  )
}
