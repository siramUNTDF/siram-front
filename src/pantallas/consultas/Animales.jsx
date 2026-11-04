import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { Box, Button } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CallMergeIcon from '@mui/icons-material/CallMerge'
import HistoryIcon from '@mui/icons-material/History'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import Bloque from '@/componentes/Bloque'
import Mensaje from '@/componentes/Mensaje'
import CampoBusqueda from '@/componentes/CampoBusqueda'
import ChipFiltro from '@/componentes/ChipFiltro'
import Dato, { Datos } from '@/componentes/Dato'
import VentanaLateral from '@/componentes/VentanaLateral'
import { Casilla, Opciones, Texto } from '@/componentes/formulario/Campos'
import useFormulario from '@/componentes/formulario/useFormulario'
import { useAvisar } from '@/componentes/avisos'
import Tabla, { CeldaDoble } from '@/componentes/tabla/Tabla'
import PieTabla from '@/componentes/tabla/PieTabla'
import EnlaceCaso from '@/componentes/caso/EnlaceCaso'
import EstadoCaso from '@/componentes/caso/EstadoCaso'
import BotonIcono from '@/componentes/botones/BotonIcono'
import FilaComparacion from '@/componentes/comparacion/FilaComparacion'
import { dia10, edadesAparentes, especies, etiqueta, sexos, tamanos, tenencias } from '@/componentes/caso/catalogos'
import { api, ErrorApi, useApi } from '@/mocks'
import { fuentes } from '@/tema/tokens'
import { chip, dni, fechaCorta, nombreCompleto, plural, soloDigitos } from '@/utiles/formato'
import NoEncontrada from '@/pantallas/NoEncontrada'

const filtros = [
  { clave: 'todos', etiqueta: 'Todos', aplica: (a) => a.vigente },
  { clave: 'perros', etiqueta: 'Perros', aplica: (a) => a.vigente && a.especie === 'perro' },
  { clave: 'gatos', etiqueta: 'Gatos', aplica: (a) => a.vigente && a.especie === 'gato' },
  { clave: 'con_chip', etiqueta: 'Con chip', aplica: (a) => a.vigente && Boolean(a.chip), requiereChip: true },
  { clave: 'sin_chip', etiqueta: 'Sin chip', aplica: (a) => a.vigente && !a.chip, requiereChip: true },
  { clave: 'absorbidos', etiqueta: 'Absorbidos', aplica: (a) => Boolean(a.absorbidoPor) },
]

function Vigencia({ animal: a }) {
  return (
    <>
      <Box component="span" sx={{ display: 'inline-block', px: 1.25, height: 22, lineHeight: '22px', borderRadius: 999, fontSize: 12, fontWeight: 600, bgcolor: a.vigente ? 'success.soft' : 'neutral.soft', color: a.vigente ? 'success.main' : 'text.secondary' }}>
        {a.vigente ? 'Activo' : 'Inactivo'}
      </Box>
      {a.absorbidoPor && <Box sx={{ mt: '4px', fontSize: 12, color: 'text.tertiary' }}>Absorbido por {a.absorbidoPor.chip ? `chip ${chip(a.absorbidoPor.chip)}` : 'otro animal'}</Box>}
    </>
  )
}

const descripcionCorta = (d) => (d ? [etiqueta(tamanos, d.tamano), etiqueta(sexos, d.sexo)?.toLowerCase(), etiqueta(edadesAparentes, d.edadAparente)?.toLowerCase()].filter(Boolean).join(' · ') || null : null)
const identidad = (a) => `${especies[a.especie]} · ${'chip' in a ? (a.chip ? `chip ${chip(a.chip)}` : 'sin chip') : ''}`.replace(/ · $/, '')

function coincide(a, termino) {
  if (!termino) return true
  const d = soloDigitos(termino)
  return (a.ultimoCaso?.numero ?? '').toLowerCase().includes(termino.toLowerCase()) || (Boolean(d) && (a.chip ?? '').includes(d))
}

// Lista de animales (animales.md). «Todos» no muestra los absorbidos: tienen su propio chip.
export function ListaAnimales() {
  const navigate = useNavigate()
  const { datos: animales } = useApi(() => api.listarAnimales())
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [estado, setEstado] = useState({ clave: '', pagina: 0 })
  const [filasPorPagina, setFilasPorPagina] = useState(10)
  const conChip = animales.some((a) => 'chip' in a)
  const conDescripcion = animales.some((a) => 'descripcion' in a)
  const conDia10 = animales.some((a) => 'dia10' in a)
  const buscados = useMemo(() => animales.filter((a) => coincide(a, busqueda)), [animales, busqueda])
  const visiblesFiltros = filtros.filter((f) => !f.requiereChip || conChip)
  const filtrados = buscados.filter(filtros.find((f) => f.clave === filtro).aplica)
  const clave = `${filtro}|${busqueda}|${filasPorPagina}`
  const pagina = estado.clave === clave ? estado.pagina : 0

  // Lo que la API no manda (chip, descripción, día 10) no tiene columna.
  const columnas = [
    { clave: 'animal', titulo: 'Animal', celda: (a) => <CeldaDoble destacado principal={<Box component={Link} to={`/consultas/animales/${a.id}`} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>{especies[a.especie]}</Box>} secundario={'chip' in a ? <Box component="span" sx={{ fontFamily: fuentes.mono }}>{a.chip ? `chip ${chip(a.chip)}` : 'sin chip'}</Box> : null} /> },
    { clave: 'casos', titulo: 'Casos', celda: (a) => plural(a.casos, 'caso') },
    { clave: 'ultimo', titulo: 'Último caso', celda: (a) => (a.ultimoCaso ? <EnlaceCaso numero={a.ultimoCaso.numero} /> : '—') },
    conDescripcion && { clave: 'descripcion', titulo: 'Descripción en el último caso', celda: (a) => <CeldaDoble principal={descripcionCorta(a.descripcion) ?? '—'} secundario={a.descripcion?.color} /> },
    conDia10 && { clave: 'dia10', titulo: 'Día 10 del último caso', celda: (a) => (a.dia10 ? dia10[a.dia10.valor] : '—') },
    { clave: 'vigencia', titulo: 'Vigencia', celda: (a) => <Vigencia animal={a} /> },
  ].filter(Boolean)

  return (
    <>
      <EncabezadoPagina titulo="Animales" bajada="La identidad de cada animal (especie y chip) y todos los casos en que apareció. Lo que se supo de él vive en cada caso." extra={<NotaDatosEjemplo />} />
      <Panel>
        <Box sx={{ p: 2 }}><CampoBusqueda valor={busqueda} onCambio={setBusqueda} placeholder={conChip ? 'Buscar por chip o por caso' : 'Buscar por caso'} etiqueta="Buscar animales" /></Box>
        <Box role="group" aria-label="Filtros rápidos" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', px: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
          {visiblesFiltros.map((f) => <ChipFiltro key={f.clave} etiqueta={f.etiqueta} cantidad={buscados.filter(f.aplica).length} activo={filtro === f.clave} onClick={() => setFiltro(f.clave)} />)}
        </Box>
        <Box sx={{ '& tbody tr': { cursor: 'pointer' } }} onClick={(e) => { const fila = e.target.closest('tr[data-id]'); if (fila && !e.target.closest('a')) navigate(`/consultas/animales/${fila.dataset.id}`) }}>
          <Tabla columnas={columnas} filas={filtrados.slice(pagina * filasPorPagina, (pagina + 1) * filasPorPagina)} anchoMinimo={900} vacio="No hay animales que coincidan con la búsqueda." atributosFila={(a) => ({ 'data-id': a.id })} />
        </Box>
        <PieTabla total={filtrados.length} pagina={pagina} filasPorPagina={filasPorPagina} onPagina={(n) => setEstado({ clave, pagina: n })} onFilasPorPagina={setFilasPorPagina} />
      </Panel>
    </>
  )
}

function EditarIdentidad({ animal, onCerrar }) {
  const navigate = useNavigate()
  const avisar = useAvisar()
  const f = useFormulario({ especie: animal.especie, chip: animal.chip ?? '' })
  const [reconciliarCon, setReconciliarCon] = useState(null)
  function guardar() {
    try {
      api.editarIdentidad(animal.id, f.valores)
      avisar('exito', 'Identidad del animal actualizada')
      onCerrar()
    } catch (e) {
      if (!(e instanceof ErrorApi)) throw e
      f.setErrores({ [e.campo ?? 'chip']: e.message })
      setReconciliarCon(e.reconciliarCon ?? null)
    }
  }
  return (
    <VentanaLateral abierta titulo="Editar identidad" bajada={identidad(animal)} hayCambios={f.hayCambios} onCerrar={onCerrar} onGuardar={guardar}>
      <Bloque titulo="Identidad">
        <Opciones etiqueta="Especie" requerido opciones={especies} valor={f.valores.especie} onCambio={(v) => f.poner('especie', v)} />
        <Texto etiqueta="Chip" mono valor={f.valores.chip} onCambio={(v) => { setReconciliarCon(null); f.poner('chip', v) }} error={f.errores.chip} />
        {reconciliarCon && <Button variant="text" onClick={() => navigate(`/consultas/animales/${animal.id}/reconciliar?con=${reconciliarCon}&chip=${soloDigitos(f.valores.chip)}`)}>Reconciliar</Button>}
      </Bloque>
    </VentanaLateral>
  )
}

// Detalle de un animal: su identidad y todos los casos en que apareció (la reincidencia).
export function DetalleAnimal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { datos: a, error } = useApi(() => api.obtenerAnimal(id), [id])
  const [editando, setEditando] = useState(false)
  if (error) return <NoEncontrada />

  const columnas = [
    {
      clave: 'caso',
      titulo: 'Caso',
      celda: (c) => (
        <>
          <EnlaceCaso numero={c.numero} />
          {c.vinoDeAbsorbido && <Box sx={{ fontSize: 12, color: 'text.tertiary', mt: '4px' }}>Vino del animal absorbido</Box>}
        </>
      ),
    },
    'tenencia' in (a.casos[0] ?? {}) && { clave: 'tenencia', titulo: 'Tenencia', celda: (c) => etiqueta(tenencias, c.tenencia) ?? '—' },
    'dueno' in (a.casos[0] ?? {}) && { clave: 'dueno', titulo: 'Dueño durante el caso', celda: (c) => (c.dueno ? <CeldaDoble principal={nombreCompleto(c.dueno)} secundario={<Box component="span" sx={{ fontFamily: fuentes.mono }}>DNI {dni(c.dueno.dni)}</Box>} /> : '—') },
    'descripcion' in (a.casos[0] ?? {}) && { clave: 'descripcion', titulo: 'Descripción en el caso', celda: (c) => <CeldaDoble principal={descripcionCorta(c.descripcion) ?? '—'} secundario={c.descripcion?.color} /> },
    'dia10' in (a.casos[0] ?? {}) && { clave: 'dia10', titulo: 'Día 10', celda: (c) => dia10[c.dia10.valor] },
    { clave: 'estado', titulo: 'Estado', celda: (c) => <EstadoCaso estado={c.estado} /> },
  ].filter(Boolean)

  return (
    <>
      <EncabezadoPagina
        volver="/consultas/animales"
        titulo={identidad(a)}
        bajada="La identidad del animal. Lo que se supo de él (dueño, tenencia, descripción, día 10) vive en cada caso."
        extra={(
          <>
            <NotaDatosEjemplo />
            {a.puedeEditar && <Button variant="outlined" color="inherit" startIcon={<EditOutlinedIcon />} onClick={() => setEditando(true)} sx={{ borderColor: 'divider', bgcolor: 'background.paper' }}>Editar identidad</Button>}
            {a.puedeEditar && <Button variant="outlined" color="inherit" startIcon={<CallMergeIcon />} onClick={() => navigate(`/consultas/animales/${a.id}/reconciliar`)} sx={{ borderColor: 'divider', bgcolor: 'background.paper' }}>Reconciliar con otro animal</Button>}
            <BotonIcono etiqueta="Ver historial (en diseño)" disabled><HistoryIcon fontSize="small" /></BotonIcono>
          </>
        )}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Bloque titulo="Identidad">
          <Datos>
            <Dato etiqueta="Especie" valor={especies[a.especie]} />
            {'chip' in a && <Dato etiqueta="Chip" valor={chip(a.chip)} mono />}
            <Box>
              <Box sx={{ fontSize: 12, color: 'text.tertiary', mb: '3px' }}>Vigencia</Box>
              <Vigencia animal={a} />
            </Box>
          </Datos>
          {a.absorbio.map((x) => <Box key={x.id} sx={{ mt: 1.5, fontSize: 13.5, color: 'text.secondary' }}>Absorbió a un animal sin chip el {fechaCorta(x.fecha)}.</Box>)}
          {a.absorbidoPor && <Box sx={{ mt: 1.5, fontSize: 13.5 }}>Absorbido por <Box component={Link} to={`/consultas/animales/${a.absorbidoPor.id}`} sx={{ color: 'primary.main' }}>{a.absorbidoPor.chip ? `el perro chip ${chip(a.absorbidoPor.chip)}` : 'otro animal'}</Box>.</Box>}
        </Bloque>
        <Bloque titulo={`Casos de este animal · ${a.casos.length}`}>
          {a.casos.length ? (
            <Box sx={{ mx: { xs: -2, sm: -2.5 } }}>
              <Tabla columnas={columnas} filas={a.casos} claveFila={(c) => c.numero} anchoMinimo={760} />
            </Box>
          ) : <Box sx={{ color: 'text.tertiary', fontSize: 14 }}>No aparece en ningún caso: sus casos pasaron al animal que lo absorbió.</Box>}
        </Bloque>
        <Box sx={{ fontSize: 12.5, color: 'text.tertiary' }}>La reincidencia se ve acá: los casos en que apareció el mismo animal. No se le pregunta a la persona.</Box>
      </Box>
      {editando && <EditarIdentidad animal={a} onCerrar={() => setEditando(false)} />}
    </>
  )
}

// Reconciliar dos registros del mismo animal. Quién sobrevive lo decide la regla (el que tiene
// chip; si ninguno, el más viejo), no el agente. Irreversible: pide la casilla marcada.
export function Reconciliar() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const avisar = useAvisar()
  const [otro, setOtro] = useState(params.get('con'))
  const [busqueda, setBusqueda] = useState('')
  const [confirmado, setConfirmado] = useState(false)
  const { datos: candidatos } = useApi(() => api.listarAnimales().filter((a) => a.vigente && String(a.id) !== id))
  const par = useApi(() => (otro ? api.reconciliacion(id, otro) : null), [id, otro])
  const chipCargado = params.get('chip')

  function reconciliar() {
    const r = api.reconciliar(id, otro)
    avisar('exito', `Animales reconciliados: ${r.b.casos.join(', ') || 'el absorbido'} ahora apunta al ${especies[r.a.especie].toLowerCase()} ${r.a.chip ? `chip ${chip(r.a.chip)}` : 'sin chip'}`)
    navigate(`/consultas/animales/${r.a.id}`)
  }

  const filas = par.datos && [
    { campo: 'especie', etiqueta: 'Especie', a: especies[par.datos.a.especie], b: especies[par.datos.b.especie] },
    { campo: 'chip', etiqueta: 'Chip', a: chip(par.datos.a.chip), b: chip(par.datos.b.chip), mono: true },
    { campo: 'registrado', etiqueta: 'Registrado el', a: fechaCorta(par.datos.a.registrado), b: fechaCorta(par.datos.b.registrado), mono: true },
    { campo: 'casos', etiqueta: 'Casos', a: par.datos.a.casos.join(', ') || '—', b: par.datos.b.casos.join(', ') || '—' },
  ]

  return (
    <>
      <EncabezadoPagina volver={`/consultas/animales/${id}`} titulo="Reconciliar animales" bajada="Zoonosis descubrió que dos registros son el mismo animal. Uno absorbe al otro; nada se borra." extra={<NotaDatosEjemplo />} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {!otro && (
          <Bloque titulo="¿Con qué animal?" bajada="Buscá por chip o por número de caso y elegí uno.">
            <CampoBusqueda valor={busqueda} onCambio={setBusqueda} placeholder="Buscar por chip o por caso" etiqueta="Buscar el otro animal" sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {candidatos.filter((a) => coincide(a, busqueda)).map((a) => (
                <Button key={a.id} variant="outlined" color="inherit" onClick={() => setOtro(String(a.id))} sx={{ justifyContent: 'flex-start', borderColor: 'divider' }}>
                  {identidad(a)} · {a.ultimoCaso?.numero ?? 'sin casos'}
                </Button>
              ))}
            </Box>
          </Bloque>
        )}

        {par.error && <Mensaje tipo="error" acciones={<Button variant="outlined" color="inherit" onClick={() => setOtro(null)}>Elegir otro</Button>}>{par.error.message}</Mensaje>}

        {par.datos && (
          <>
            {chipCargado && (
              <Mensaje tipo="advertencia" titulo="Este chip ya está cargado en otro animal">
                Al cargar el chip {chip(chipCargado)}, la base lo rechazó: ya lo tiene el animal de {par.datos.a.casos[0] ?? 'otro registro'}. Compará los dos registros.
              </Mensaje>
            )}
            <Panel>
              <Box sx={{ display: { xs: 'none', sm: 'grid' }, gridTemplateColumns: '160px minmax(0,1fr) 32px minmax(0,1fr)', gap: 1, p: '10px 12px', borderBottom: 1, borderColor: 'divider', fontSize: 11, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: 'text.tertiary' }}>
                <span /><span>Animal A · sobrevive</span><span /><span>Animal B · se absorbe</span>
              </Box>
              {filas.map((f) => <FilaComparacion key={f.campo} id={f.campo} etiqueta={f.etiqueta} izq={f.a} der={f.b} mono={f.mono} elegido="izq" onElegir={() => {}} />)}
            </Panel>
            <Bloque titulo="Qué pasa al confirmar">
              <Box component="ul" sx={{ m: 0, pl: 2.5, fontSize: 14, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <li>Los casos de B pasan a apuntar a A (queda en el historial de cada caso).</li>
                <li>B no se borra ni se vacía: deja de estar vigente y queda «absorbido por» A.</li>
                <li>Las descripciones no se pierden, porque viven en cada caso.</li>
              </Box>
            </Bloque>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Casilla etiqueta="Confirmo que A y B son el mismo animal." marcada={confirmado} onCambio={setConfirmado} />
              <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={() => navigate(`/consultas/animales/${id}`)} sx={{ borderColor: 'divider' }}>Cancelar</Button>
                <Button variant="contained" disabled={!confirmado} onClick={reconciliar}>Reconciliar</Button>
              </Box>
            </Box>
            <Box sx={{ fontSize: 12.5, color: 'text.tertiary' }}>Es irreversible.</Box>
          </>
        )}
      </Box>
    </>
  )
}
