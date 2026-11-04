import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Box, Button } from '@mui/material'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import CampoBusqueda from '@/componentes/CampoBusqueda'
import ChipFiltro from '@/componentes/ChipFiltro'
import Tabla, { CeldaDoble } from '@/componentes/tabla/Tabla'
import PieTabla from '@/componentes/tabla/PieTabla'
import { MarcaCaso } from '@/componentes/caso/MarcasCaso'
import EnlaceCaso from '@/componentes/caso/EnlaceCaso'
import { especies } from '@/componentes/caso/catalogos'
import { api, useApi } from '@/mocks'
import { fuentes } from '@/tema/tokens'
import { dni, fechaCorta, hora, nombreCompleto, normalizar, soloDigitos } from '@/utiles/formato'

const filtros = [
  { clave: 'pendientes', etiqueta: 'Pendientes', estado: 'pendiente' },
  { clave: 'registradas', etiqueta: 'Registradas', estado: 'registrada' },
  { clave: 'descartadas', etiqueta: 'Descartadas', estado: 'descartada' },
  { clave: 'todas', etiqueta: 'Todas', estado: null },
]

// Pendientes: la que más espera, arriba. Resueltas: por fecha de resolución. Todas: por envío.
const ordenes = {
  pendientes: (a, b) => a.enviada.localeCompare(b.enviada),
  registradas: (a, b) => b.resuelta.fecha.localeCompare(a.resuelta.fecha),
  descartadas: (a, b) => b.resuelta.fecha.localeCompare(a.resuelta.fecha),
  todas: (a, b) => b.enviada.localeCompare(a.enviada),
}

function detallado(n) {
  if (n >= 4) return 'Completo'
  return n === 0 ? 'Solo inicial' : 'Parcial'
}

function coincide(s, termino) {
  if (!termino) return true
  const texto = normalizar([s.numero, nombreCompleto(s.quienInforma), nombreCompleto(s.victima)].join(' '))
  if (texto.includes(normalizar(termino))) return true
  const d = soloDigitos(termino)
  return Boolean(d) && [s.quienInforma.dni, s.victima.dni].some((x) => x?.includes(d))
}

const columnas = [
  { clave: 'numero', titulo: 'Solicitud', celda: (s) => <CeldaDoble mono principal={<Box component={Link} to={`/casos/solicitudes/${s.numero}`} sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}>{s.numero}</Box>} secundario={s.estado} /> },
  { clave: 'enviada', titulo: 'Enviada', celda: (s) => <CeldaDoble mono principal={fechaCorta(s.enviada)} secundario={hora(s.enviada)} /> },
  { clave: 'quien', titulo: 'Quién la envía', celda: (s) => <CeldaDoble destacado principal={nombreCompleto(s.quienInforma)} secundario={s.informaLaVictima ? 'Es quien sufrió el ataque' : 'Informa por otra persona'} /> },
  { clave: 'victima', titulo: 'Víctima', celda: (s) => <CeldaDoble principal={nombreCompleto(s.victima)} secundario={<Box component="span" sx={{ fontFamily: fuentes.mono }}>DNI {dni(s.victima.dni)}</Box>} /> },
  { clave: 'hecho', titulo: 'Fecha del hecho', celda: (s) => <CeldaDoble mono principal={fechaCorta(s.fechaHecho)} secundario={s.horaHecho ?? '—'} /> },
  { clave: 'especie', titulo: 'Especie', celda: (s) => especies[s.especie] },
  { clave: 'detallado', titulo: 'Formulario detallado', celda: (s) => <CeldaDoble principal={detallado(s.seccionesCompletas)} secundario={`${s.seccionesCompletas} de 4 secciones`} /> },
  {
    clave: 'coincidencia',
    titulo: 'Coincidencia',
    celda: (s) => {
      if (s.estado === 'registrada') return <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', fontSize: 13 }}>→ <EnlaceCaso numero={s.caso} /></Box>
      if (s.estado === 'descartada') return null
      if (!s.coincidencias.length) return <Box component="span" sx={{ color: 'text.tertiary', fontSize: 13 }}>Sin coincidencias</Box>
      const [primera, ...resto] = s.coincidencias
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 13 }}>
          <MarcaCaso marca="duplicado" conTooltip={false} />
          <span>Misma víctima que <Box component="span" sx={{ fontFamily: fuentes.mono }}>{primera.numero}</Box>{resto.length > 0 && ` +${resto.length}`}</span>
        </Box>
      )
    },
  },
  {
    clave: 'accion',
    titulo: '',
    celda: (s) => (
      <Button size="small" variant="outlined" color="inherit" component={Link} to={`/casos/solicitudes/${s.numero}`} sx={{ height: 30, borderColor: 'divider' }}>
        {s.estado === 'pendiente' ? 'Revisar' : 'Ver'}
      </Button>
    ),
  },
]

// La cola de solicitudes del formulario público (solicitudes.md, «La cola»).
export default function ColaSolicitudes() {
  const [params, setParams] = useSearchParams()
  const filtro = filtros.some((f) => f.clave === params.get('filtro')) ? params.get('filtro') : 'pendientes'
  const { datos: solicitudes } = useApi(() => api.listarSolicitudes())
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState({ clave: '', n: 0 })
  const [filasPorPagina, setFilasPorPagina] = useState(10)

  const buscadas = useMemo(() => solicitudes.filter((s) => coincide(s, busqueda)), [solicitudes, busqueda])
  const cantidades = Object.fromEntries(filtros.map((f) => [f.clave, buscadas.filter((s) => !f.estado || s.estado === f.estado).length]))
  const estado = filtros.find((f) => f.clave === filtro).estado
  const filtradas = buscadas.filter((s) => !estado || s.estado === estado).sort(ordenes[filtro])
  const clave = `${filtro}|${busqueda}|${filasPorPagina}`
  const n = pagina.clave === clave ? pagina.n : 0

  return (
    <>
      <EncabezadoPagina
        titulo="Solicitudes"
        bajada="Lo que enviaron las personas por el formulario público. Un agente la descarta o la registra: crea un caso o la suma a uno existente."
        extra={<NotaDatosEjemplo />}
      />
      <Panel>
        <Box sx={{ p: 2 }}>
          <CampoBusqueda valor={busqueda} onCambio={setBusqueda} placeholder="Buscar por solicitud, nombre o DNI" etiqueta="Buscar solicitudes por número, nombre o DNI" />
        </Box>
        <Box role="group" aria-label="Filtros rápidos" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', px: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
          {filtros.map((f) => (
            <ChipFiltro key={f.clave} etiqueta={f.etiqueta} cantidad={cantidades[f.clave]} activo={filtro === f.clave} onClick={() => setParams(f.clave === 'pendientes' ? {} : { filtro: f.clave })} />
          ))}
        </Box>
        <Tabla columnas={columnas} filas={filtradas.slice(n * filasPorPagina, (n + 1) * filasPorPagina)} claveFila={(s) => s.numero} anchoMinimo={1200} vacio="No hay solicitudes que coincidan con la búsqueda." />
        <PieTabla total={filtradas.length} pagina={n} filasPorPagina={filasPorPagina} onPagina={(x) => setPagina({ clave, n: x })} onFilasPorPagina={setFilasPorPagina} />
      </Panel>
      <Box sx={{ mt: 2, fontSize: 12.5, color: 'text.tertiary' }}>
        Descartar no borra: la solicitud queda guardada para siempre, con sus datos. Ninguna solicitud escribe en un caso ni en una persona sin un agente.
      </Box>
    </>
  )
}
