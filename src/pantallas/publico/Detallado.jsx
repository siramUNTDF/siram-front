import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Box, Button, IconButton } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CloseIcon from '@mui/icons-material/Close'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import Bloque from '@/componentes/Bloque'
import Mensaje from '@/componentes/Mensaje'
import { ArchivoAdjunto } from '@/componentes/ChipDato'
import { Nota, Opciones, Texto } from '@/componentes/formulario/Campos'
import Mapa from '@/componentes/mapa/Mapa'
import { centros } from '@/componentes/mapa/encuadre'
import { api, ErrorRed, ErrorTokenVencido } from '@/mocks'
import { Acciones, PielPublica, Progreso, SimularFallas, Titulo } from './piezas'
import { sesionReporte } from './sesionReporte'

const noSe = { no_sabe: 'No sé' }
const siNoNoSe = { si: 'Sí', no: 'No', ...noSe }
const centroCiudad = { ushuaia: centros.Ushuaia, rio_grande: centros['Río Grande'], tolhuin: centros.Tolhuin }
const motivos = {
  animal_propio_o_conocido: 'El animal es propio o conocido', no_sabia_donde: 'No sabía dónde denunciar', no_sabia_que_habia: 'No sabía que había que denunciar',
  no_tomaron: 'No me tomaron la denuncia', economicas: 'Razones económicas', no_pasa_nada: 'No pasa nada después con la denuncia', otros: 'Otros',
}
const cantidades = { 1: '1', 2: '2', 3: '3', mas_3: 'Más de 3' }

// Guarda una parte con el token. Red caída: error con «Reintentar». Token vencido: pantalla 8.
function useParte(parte, inicial) {
  const navigate = useNavigate()
  const sesion = sesionReporte.obtener()
  const [valores, setValores] = useState(sesion?.partes[parte] ?? inicial)
  const [error, setError] = useState(null)
  const [ocupado, setOcupado] = useState(false)
  const poner = (c) => ({ valor: valores[c], onCambio: (x) => setValores((v) => ({ ...v, [c]: x })) })

  function guardar(datos, siguiente, { terminando = false } = {}) {
    setOcupado(true)
    setError(null)
    setTimeout(() => {
      try {
        sesionReporte.guardarLocal(parte, valores)
        if (datos) api.guardarParte(sesion.token, parte.startsWith('animal') ? 'animal' : parte, datos)
        navigate(`/reportar/detalle?paso=${siguiente}`)
      } catch (e) {
        if (e instanceof ErrorTokenVencido) navigate('/reportar/detalle?paso=vencido', { replace: true })
        else if (e instanceof ErrorRed && terminando) navigate('/reportar/detalle?paso=gracias&falta=1')
        else if (e instanceof ErrorRed) setError('No pudimos guardar esta parte. Revisá tu conexión.')
        else throw e
      } finally {
        setOcupado(false)
      }
    }, 400)
  }
  return { valores, poner, setValores, error, setError, ocupado, guardar }
}

function ErrorGuardado({ error, onReintentar }) {
  if (!error) return null
  return <Mensaje tipo="error" sx={{ mt: 2 }} acciones={<Button variant="outlined" color="inherit" onClick={onReintentar}>Reintentar</Button>}>{error}</Mensaje>
}

// Pantalla 2 · Solicitud enviada.
function Enviada({ numero }) {
  const navigate = useNavigate()
  return (
    <>
      <Box sx={{ color: 'success.main', mb: 1 }}><CheckCircleOutlineIcon sx={{ fontSize: 40 }} /></Box>
      <Titulo bajada={`Número ${numero}. Una persona la va a revisar.`}>Recibimos tu solicitud</Titulo>
      <Bloque titulo="¿Nos contás un poco más?" bajada="Son 4 partes cortas: dónde fue, qué pasó, cómo era el animal y la denuncia. Es opcional, y cada parte se guarda al pasar a la siguiente.">
        <Mensaje tipo="advertencia">Es una sola oportunidad. Este enlace vence en 1 hora y no se puede volver a abrir. Después, solo los organismos agregan datos.</Mensaje>
      </Bloque>
      <Acciones principal="Contar más" onPrincipal={() => navigate('/reportar/detalle?paso=donde')} onTerminar={() => navigate('/reportar/detalle?paso=gracias')} />
    </>
  )
}

// Pantalla 3 · Dónde fue.
// La ciudad ya vino en el inicial: el mapa arranca ahí. El punto cuenta solo si la persona movió el
// mapa; si no, la parte se guarda sin coordenadas (no es un lugar que alguien eligió).
function DondeFue() {
  const ciudad = sesionReporte.obtener()?.ciudad
  const p = useParte('donde', { direccion: '', referencias: '', tipoLugar: null, hora: '', punto: null, movido: false, aMano: false, propuesta: false })
  const { valores: v, setValores } = p
  const alPrimerGesto = useCallback(() => setValores((x) => ({ ...x, movido: true })), [setValores])
  function mover([lat, lon]) {
    p.setValores((x) => {
      if (!x.movido) return x
      return x.aMano ? { ...x, punto: [lat, lon] } : { ...x, punto: [lat, lon], direccion: api.geocodificar(lat, lon), propuesta: true }
    })
  }
  const conPunto = v.movido && v.punto
  const datos = () => ({
    ...(conPunto ? { punto: { lat: v.punto[0], lon: v.punto[1] }, latitud: v.punto[0], longitud: v.punto[1] } : {}),
    direccion: v.direccion || null, referencias: v.referencias || null, tipoLugar: v.tipoLugar, horaHecho: v.hora || null,
  })
  return (
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); p.guardar(datos(), 'que') }}>
      <Progreso parte={1} />
      <Titulo bajada="Mové el mapa hasta dejar el pin donde pasó. Te proponemos la dirección; corregila si hace falta.">¿Dónde fue?</Titulo>
      <Mapa
        alto={260}
        pinFijo
        centro={v.punto ?? centroCiudad[ciudad] ?? centros.Ushuaia}
        onMover={mover}
        aviso={v.movido ? null : 'Mové el mapa y dejá el pin donde fue el ataque'}
        onPrimerGesto={v.movido ? undefined : alPrimerGesto}
      />
      <Box sx={{ mt: 2 }}>
        <Texto etiqueta="Dirección" nota={v.propuesta && !v.aMano ? 'La propuso el mapa al soltar el pin.' : null} valor={v.direccion} onCambio={(x) => p.setValores((y) => ({ ...y, direccion: x, aMano: true }))} />
        <Texto etiqueta="Referencias" ayuda="Por ejemplo: casa roja, plaza en la esquina." placeholder="casa roja, plaza en la esquina" {...p.poner('referencias')} />
        <Opciones etiqueta="¿Qué tipo de lugar era?" vertical opciones={{ casa_propia: 'Casa propia', casa_ajena: 'Casa ajena', via_publica: 'Vía pública', espacio_publico: 'Espacio público', zona_rural: 'Zona rural', ...noSe }} {...p.poner('tipoLugar')} />
        <Texto etiqueta="Hora aproximada" tipo="time" {...p.poner('hora')} />
      </Box>
      <ErrorGuardado error={p.error} onReintentar={() => p.guardar(datos(), 'que')} />
      <Acciones principal="Siguiente" ocupado={p.ocupado} onTerminar={() => p.guardar(datos(), 'gracias', { terminando: true })} />
    </Box>
  )
}

// Pantalla 4 · Qué pasó.
function QuePaso() {
  const p = useParte('que_paso', { quePaso: null, cantidad: null, edad: '', domicilio: '' })
  const { valores: v } = p
  const datos = () => ({ quePaso: v.quePaso, cantidadAnimales: v.cantidad === 'mas_3' ? 'mas_3' : v.cantidad ? Number(v.cantidad) : null, edad: v.edad, domicilio: v.domicilio })
  function siguiente() {
    // «Más de 3» repite la parte del animal tres veces; sin respuesta, un animal.
    const sesion = sesionReporte.obtener()
    sesion.animales = v.cantidad === 'mas_3' ? 3 : Number(v.cantidad ?? 1)
    p.guardar(datos(), 'animal-1')
  }
  return (
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); siguiente() }}>
      <Progreso parte={2} />
      <Titulo>¿Qué pasó?</Titulo>
      <Opciones etiqueta="¿Qué le pasó a la persona?" vertical opciones={{ mordedura: 'Mordedura', aranazo: 'Arañazo', intento_sin_lesion: 'Intentó atacar, sin lastimar', lesion_al_escapar: 'Se lastimó al escapar', ...noSe }} {...p.poner('quePaso')} />
      <Opciones etiqueta="¿Cuántos animales atacaron?" opciones={cantidades} {...p.poner('cantidad')} />
      <Texto etiqueta="Edad de quien sufrió el ataque" placeholder="En años" inputMode="numeric" {...p.poner('edad')} />
      <Texto etiqueta="Domicilio de quien sufrió el ataque" placeholder="Opcional" {...p.poner('domicilio')} />
      <ErrorGuardado error={p.error} onReintentar={siguiente} />
      <Acciones principal="Siguiente" ocupado={p.ocupado} onTerminar={() => p.guardar(datos(), 'gracias', { terminando: true })} />
    </Box>
  )
}

// Pantalla 5 · El animal (una vez por animal).
function Animal({ n }) {
  const sesion = sesionReporte.obtener()
  const total = sesion.animales
  const p = useParte(`animal-${n}`, {
    especie: n === 1 ? sesion.especie : null, deQuienEs: null, tieneChip: null, chip: '', duenoDeclarado: '', zona: '', vacunado: null, podriaReconocerlo: null,
    tamano: null, sexo: null, edadAparente: null, color: '', raza: '', fotos: [],
  })
  const { valores: v } = p
  const [errorEspecie, setErrorEspecie] = useState(null)
  const [errorFoto, setErrorFoto] = useState(null)
  const siguientePaso = n < total ? `animal-${n + 1}` : 'denuncia'
  const datos = () => ({ indice: n - 1, animal: { ...v, chip: v.tieneChip === 'si' ? v.chip || null : null, duenoDeclarado: v.duenoDeclarado || null, zona: v.zona || null, color: v.color || null, raza: v.raza || null } })

  function siguiente() {
    // La especie es la única obligatoria de esta parte, desde el animal 2 (todo animal nace con su especie).
    if (!v.especie) { setErrorEspecie('Elegí si es perro o gato'); return }
    p.guardar(datos(), siguientePaso)
  }
  function terminar() {
    // Sin especie, «Terminar acá» descarta este animal (lo anterior ya está guardado).
    p.guardar(v.especie ? datos() : null, 'gracias', { terminando: true })
  }
  function agregarFoto(archivo) {
    setErrorFoto(null)
    if (!archivo) return
    if (!/image\/(jpeg|png)/.test(archivo.type)) { setErrorFoto('La foto tiene que ser JPG o PNG.'); return }
    if (archivo.size > 5 * 1024 * 1024) { setErrorFoto('La foto pesa más de 5 MB.'); return }
    p.setValores((x) => ({ ...x, fotos: [...x.fotos, { nombre: archivo.name, tamano: `${(archivo.size / 1024 / 1024).toFixed(1).replace('.', ',')} MB` }] }))
  }

  return (
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); siguiente() }}>
      <Progreso parte={3} />
      <Titulo bajada="Contanos lo que sepas. Todo se puede dejar en «No sé».">Animal {n} de {total}</Titulo>
      {n > 1 && <Opciones etiqueta="¿Qué animal era?" requerido opciones={{ perro: 'Perro', gato: 'Gato' }} valor={v.especie} onCambio={(x) => { setErrorEspecie(null); p.setValores((y) => ({ ...y, especie: x })) }} error={errorEspecie} />}
      <Bloque titulo="De quién es">
        <Opciones etiqueta="¿De quién es el animal?" vertical opciones={{ propio: 'Es mío', ajeno_conocido: 'De alguien que conozco', ajeno_desconocido: 'No sé de quién es' }} nota={!v.deQuienEs ? 'Si es tuyo, te preguntamos si tiene chip y su número.' : null} {...p.poner('deQuienEs')} />
        {v.deQuienEs === 'propio' && <Opciones etiqueta="¿Tiene chip?" opciones={siNoNoSe} {...p.poner('tieneChip')} />}
        {v.deQuienEs === 'propio' && v.tieneChip === 'si' && <Texto etiqueta="Número de chip" inputMode="numeric" {...p.poner('chip')} />}
        {v.deQuienEs === 'ajeno_conocido' && <Texto etiqueta="Si sabés quién es el dueño: nombre y cómo contactarlo" placeholder="Opcional" {...p.poner('duenoDeclarado')} />}
        <Texto etiqueta="¿Dónde vive el animal?" placeholder="Si lo sabés" {...p.poner('zona')} />
        <Opciones etiqueta="¿Está vacunado contra la rabia?" opciones={siNoNoSe} {...p.poner('vacunado')} />
        <Opciones etiqueta="¿Podrías reconocerlo?" opciones={siNoNoSe} {...p.poner('podriaReconocerlo')} />
      </Bloque>
      <Bloque titulo="Cómo era" sx={{ mt: 2 }}>
        <Opciones etiqueta="Tamaño" opciones={{ chico: 'Chico', mediano: 'Mediano', grande: 'Grande', ...noSe }} {...p.poner('tamano')} />
        <Opciones etiqueta="Sexo" opciones={{ macho: 'Macho', hembra: 'Hembra', ...noSe }} {...p.poner('sexo')} />
        <Opciones etiqueta="Edad aparente" opciones={{ cachorro: 'Cachorro', adulto: 'Adulto', viejo: 'Viejo', ...noSe }} {...p.poner('edadAparente')} />
        <Texto etiqueta="Color" {...p.poner('color')} />
        <Texto etiqueta="Raza" {...p.poner('raza')} />
        <Box sx={{ fontSize: 13.5, fontWeight: 600, mb: 1 }}>Fotos del animal</Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {v.fotos.map((f, i) => (
            <Box key={f.nombre + i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ArchivoAdjunto imagen nombre={f.nombre} detalle={f.tamano} />
              <IconButton aria-label={`Quitar ${f.nombre}`} onClick={() => p.setValores((x) => ({ ...x, fotos: x.fotos.filter((_, j) => j !== i) }))}><CloseIcon fontSize="small" /></IconButton>
            </Box>
          ))}
        </Box>
        {v.fotos.length < 3 && (
          <Button component="label" variant="outlined" color="inherit" startIcon={<AddPhotoAlternateOutlinedIcon />} sx={{ mt: 1, borderColor: 'divider' }}>
            {v.fotos.length ? 'Agregar otra foto' : 'Agregar una foto'}
            <input hidden type="file" accept="image/jpeg,image/png" onChange={(e) => { agregarFoto(e.target.files[0]); e.target.value = '' }} />
          </Button>
        )}
        <Nota sx={{ mt: 1 }}>Hasta 3 fotos, JPG o PNG, de hasta 5 MB cada una.</Nota>
        {errorFoto && <Box sx={{ mt: 1, fontSize: 12.5, color: 'error.main' }}>{errorFoto}</Box>}
      </Bloque>
      <ErrorGuardado error={p.error} onReintentar={siguiente} />
      <Acciones principal={n < total ? `Siguiente: animal ${n + 1} de ${total}` : 'Siguiente'} ocupado={p.ocupado} onTerminar={terminar} />
    </Box>
  )
}

// Pantalla 6 · La denuncia.
function Denuncia() {
  const p = useParte('denuncia', { hizoDenuncia: null, motivoNoDenuncia: null })
  const { valores: v } = p
  const datos = () => ({ hizoDenuncia: v.hizoDenuncia, motivoNoDenuncia: v.hizoDenuncia === 'no' ? v.motivoNoDenuncia : null })
  return (
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); p.guardar(datos(), 'gracias', { terminando: true }) }}>
      <Progreso parte={4} />
      <Titulo bajada="La denuncia se hace en Zoonosis del Municipio. Nos sirve saber si la hiciste.">La denuncia</Titulo>
      <Opciones etiqueta="¿Hiciste la denuncia en Zoonosis?" opciones={{ si: 'Sí', no: 'No' }} {...p.poner('hizoDenuncia')} />
      {v.hizoDenuncia === 'no' && <Opciones etiqueta="¿Por qué no?" vertical opciones={motivos} {...p.poner('motivoNoDenuncia')} />}
      <ErrorGuardado error={p.error} onReintentar={() => p.guardar(datos(), 'gracias', { terminando: true })} />
      <Acciones principal="Enviar y terminar" ocupado={p.ocupado} />
    </Box>
  )
}

// Pantalla 7 · Gracias. Al llegar se descarta el token: el detallado ya terminó.
function Gracias({ numero, faltaUnaParte }) {
  useEffect(() => {
    const sesion = sesionReporte.obtener()
    if (sesion?.token) {
      api.descartarToken(sesion.token)
      sesion.token = null
    }
  }, [])
  return (
    <>
      <Box sx={{ color: 'success.main', mb: 1 }}><CheckCircleOutlineIcon sx={{ fontSize: 40 }} /></Box>
      <Titulo bajada={`Guardamos todo lo que nos contaste en la solicitud ${numero}. Una persona la va a revisar.`}>¡Gracias!</Titulo>
      {faltaUnaParte && <Mensaje tipo="advertencia" sx={{ mb: 2 }}>La última parte que completaste no llegó por un problema de conexión. Lo anterior sí nos llegó.</Mensaje>}
      <Box sx={{ color: 'text.secondary' }}>Si hace falta, te vamos a contactar al teléfono o al correo que dejaste.</Box>
    </>
  )
}

// Pantalla 8 · Enlace vencido.
function Vencido() {
  return (
    <>
      <Box sx={{ color: 'text.tertiary', mb: 1 }}><ScheduleIcon sx={{ fontSize: 40 }} /></Box>
      <Titulo bajada="Para cuidar tus datos, el formulario detallado se puede completar una sola vez y durante una hora. Lo que guardaste hasta acá ya nos llegó.">Este enlace ya venció</Titulo>
      <Box sx={{ color: 'text.secondary' }}>Si querés agregar algo, comunicate con Zoonosis del Municipio.</Box>
    </>
  )
}

// Pantallas 2 a 8 del formulario público (formulario-publico.md). El paso va en la URL para que
// «atrás» vuelva a la parte anterior; el token, nunca: vive en memoria (sesionReporte).
export default function Detallado() {
  const [params] = useSearchParams()
  const paso = params.get('paso') ?? 'enviada'
  const sesion = sesionReporte.obtener()
  let pantalla
  if (paso === 'gracias' && sesion) {
    pantalla = <Gracias numero={sesion.numero} faltaUnaParte={params.get('falta') === '1'} />
  } else if (paso === 'vencido' || !sesion?.token) {
    pantalla = <Vencido />
  } else if (paso === 'enviada') pantalla = <Enviada numero={sesion.numero} />
  else if (paso === 'donde') pantalla = <DondeFue />
  else if (paso === 'que') pantalla = <QuePaso />
  else if (paso.startsWith('animal-')) pantalla = <Animal key={paso} n={Number(paso.split('-')[1])} />
  else if (paso === 'denuncia') pantalla = <Denuncia />
  else pantalla = <Vencido />
  const conSimulacion = sesion?.token && !['enviada', 'gracias', 'vencido'].includes(paso)
  return (
    <PielPublica>
      {pantalla}
      {conSimulacion && <SimularFallas />}
    </PielPublica>
  )
}
