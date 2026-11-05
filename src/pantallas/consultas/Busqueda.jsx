import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Box, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import Bloque from '@/componentes/Bloque'
import FiltroAplicado from '@/componentes/FiltroAplicado'
import { CampoFecha, Fila, Seleccion, Texto } from '@/componentes/formulario/Campos'
import TablaCasos from '@/componentes/caso/TablaCasos'
import { especies, estados, tamanos, tenencias, tiposLugar } from '@/componentes/caso/catalogos'
import { api, useApi } from '@/mocks'
import { fechaCorta } from '@/utiles/formato'
import { fechaInvalida, mensajeFechaInvalida } from '@/utiles/validacion'
import HerramientasTabla from '../casos/bandeja/HerramientasTabla'
import LeyendaMarcas from '../casos/bandeja/LeyendaMarcas'
import useDensidad from '../casos/bandeja/useDensidad'

const ciudades = { Ushuaia: 'Ushuaia', 'Río Grande': 'Río Grande', Tolhuin: 'Tolhuin' }
const opcionesEstado = [['vigentes', 'Vigentes'], ['todos', 'Todos'], ...Object.entries(estados).map(([k, v]) => [k, v.etiqueta])]
// En la búsqueda no se filtra por «No sabe».
const sinNoSabe = (catalogo) => Object.entries(catalogo).filter(([k]) => k !== 'no_sabe')
const lugaresBusqueda = sinNoSabe(tiposLugar)
const tenenciasBusqueda = sinNoSabe(tenencias)
const tamanosBusqueda = sinNoSabe(tamanos)

const camposBusqueda = ['desde', 'hasta', 'ciudad', 'lugar', 'tipoLugar', 'edadDesde', 'edadHasta', 'especie', 'tamano', 'colorRaza', 'tenencia', 'organismo', 'tipoEvento', 'estado', 'registradoPor']
const porDefecto = { estado: 'vigentes' }

function leer(params) {
  const f = Object.fromEntries(camposBusqueda.map((c) => [c, params.get(c) ?? '']))
  if (!f.estado) f.estado = porDefecto.estado
  return f
}

// Texto de cada chip de filtro aplicado.
function chips(f) {
  const lista = []
  if (f.desde || f.hasta) lista.push({ campos: ['desde', 'hasta'], texto: `Fecha del hecho: ${fechaCorta(f.desde) ?? '…'} – ${fechaCorta(f.hasta) ?? '…'}` })
  if (f.ciudad) lista.push({ campos: ['ciudad'], texto: `Ciudad: ${f.ciudad}` })
  if (f.lugar) lista.push({ campos: ['lugar'], texto: `Lugar: ${f.lugar}` })
  if (f.tipoLugar) lista.push({ campos: ['tipoLugar'], texto: `Tipo de lugar: ${tiposLugar[f.tipoLugar]}` })
  if (f.edadDesde || f.edadHasta) lista.push({ campos: ['edadDesde', 'edadHasta'], texto: `Edad: ${f.edadDesde || '…'} – ${f.edadHasta || '…'} años` })
  if (f.especie) lista.push({ campos: ['especie'], texto: `Especie: ${especies[f.especie]}` })
  if (f.tamano) lista.push({ campos: ['tamano'], texto: `Tamaño: ${tamanos[f.tamano]}` })
  if (f.colorRaza) lista.push({ campos: ['colorRaza'], texto: `Color o raza: ${f.colorRaza}` })
  if (f.tenencia) lista.push({ campos: ['tenencia'], texto: `Tenencia: ${tenencias[f.tenencia]}` })
  if (f.organismo) lista.push({ campos: ['organismo'], texto: `Organismo: ${f.organismo}` })
  if (f.tipoEvento) lista.push({ campos: ['tipoEvento'], texto: `Tipo de evento: ${f.tipoEvento}` })
  if (f.estado && f.estado !== 'vigentes') lista.push({ campos: ['estado'], texto: `Estado: ${f.estado === 'todos' ? 'Todos' : estados[f.estado].etiqueta}` })
  if (f.registradoPor) lista.push({ campos: ['registradoPor'], texto: `Registrado por: ${f.registradoPor}` })
  return lista
}

function aParams(f) {
  const p = new URLSearchParams()
  for (const c of camposBusqueda) if (f[c] && !(c === 'estado' && f[c] === porDefecto.estado)) p.set(c, f[c])
  return p
}

// Búsqueda (busqueda.md). Los filtros van en la URL; la búsqueda corre al tocar Buscar.
export default function Busqueda() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const aplicados = leer(params)
  const [borrador, setBorrador] = useState(aplicados)
  const [desplegados, setDesplegados] = useState(!params.toString())
  const [errores, setErrores] = useState({})
  const [densa, alternarDensidad] = useDensidad()
  const { datos: resultado } = useApi(() => api.buscarCasos(aplicados), [aplicados])
  // Qué filtros se ofrecen lo dice el servidor según quién busca.
  const { datos: ofrecidos } = useApi(() => api.filtrosBusqueda(), [])
  const ofrece = (c) => ofrecidos.includes(c)

  const poner = (c) => ({ valor: borrador[c], onCambio: (v) => setBorrador((b) => ({ ...b, [c]: v ?? '' })), error: errores[c] })

  function buscar(f = borrador) {
    const e = {}
    // Una fecha a medio escribir no se aplica ni llega a la URL.
    if (fechaInvalida(f.desde)) e.desde = mensajeFechaInvalida
    if (fechaInvalida(f.hasta)) e.hasta = mensajeFechaInvalida
    else if (f.desde && f.hasta && !e.desde && f.desde > f.hasta) e.hasta = 'Tiene que ser igual o posterior a Desde'
    if (f.edadDesde && f.edadHasta && Number(f.edadDesde) > Number(f.edadHasta)) e.edadHasta = 'Tiene que ser igual o mayor a Desde'
    setErrores(e)
    if (Object.keys(e).length) return
    setParams(aParams(f))
    setDesplegados(false)
  }

  function limpiar() {
    setBorrador(leer(new URLSearchParams()))
    setErrores({})
    setParams({})
  }

  function quitar(campos) {
    const f = { ...aplicados }
    for (const c of campos) f[c] = c === 'estado' ? porDefecto.estado : ''
    setBorrador(f)
    setParams(aParams(f))
  }

  const listaChips = chips(aplicados).filter((ch) => ch.campos.every(ofrece))
  const vigentes = aplicados.estado === 'vigentes' ? 'vigentes' : aplicados.estado === 'todos' ? 'en cualquier estado' : estados[aplicados.estado]?.etiqueta.toLowerCase()
  const usados = params.toString() ? 'con los filtros aplicados' : 'con los filtros de arriba'

  return (
    <>
      <EncabezadoPagina titulo="Búsqueda" bajada="Casos según cuándo y dónde pasó, la persona, el animal y el registro." extra={<NotaDatosEjemplo />} />

      {desplegados ? (
        <Panel component="form" onSubmit={(e) => { e.preventDefault(); buscar() }} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '12px 16px', borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ fontWeight: 600 }}>Filtros</Box>
            <Box sx={{ fontSize: 13, color: 'text.tertiary' }}>· completá solo lo que quieras usar</Box>
            <Button variant="text" onClick={() => setDesplegados(false)} sx={{ ml: 'auto' }}>Ocultar filtros</Button>
          </Box>
          <Box sx={{ p: 2, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' } }}>
            <Bloque titulo="Cuándo y dónde">
              <Fila>
                <CampoFecha etiqueta="Fecha del hecho: desde" mono {...poner('desde')} />
                <CampoFecha etiqueta="Hasta" mono {...poner('hasta')} />
                <Seleccion etiqueta="Ciudad" vacio="Cualquiera" opciones={ciudades} {...poner('ciudad')} />
                <Seleccion etiqueta="Tipo de lugar" vacio="Cualquiera" opciones={lugaresBusqueda} {...poner('tipoLugar')} />
              </Fila>
              <Texto etiqueta="Lugar" placeholder="Calle, altura o barrio" {...poner('lugar')} />
            </Bloque>
            <Bloque titulo="Persona">
              <Fila>
                <Texto etiqueta="Edad: desde" placeholder="años" inputMode="numeric" {...poner('edadDesde')} />
                <Texto etiqueta="Hasta" placeholder="años" inputMode="numeric" {...poner('edadHasta')} />
              </Fila>
            </Bloque>
            <Bloque titulo="Animal">
              <Fila>
                <Seleccion etiqueta="Especie" vacio="Cualquiera" opciones={especies} {...poner('especie')} />
                {ofrece('tamano') && <Seleccion etiqueta="Tamaño" vacio="Cualquiera" opciones={tamanosBusqueda} {...poner('tamano')} />}
                {ofrece('colorRaza') && <Texto etiqueta="Color o raza" {...poner('colorRaza')} />}
                {ofrece('tenencia') && <Seleccion etiqueta="Tenencia" vacio="Cualquiera" opciones={tenenciasBusqueda} {...poner('tenencia')} />}
              </Fila>
            </Bloque>
            <Bloque titulo="Registro">
              <Fila>
                <Seleccion etiqueta="Organismo" vacio="Cualquiera" opciones={api.nombresOrganismos().map((o) => [o, o])} {...poner('organismo')} />
                <Seleccion etiqueta="Tipo de evento" vacio="Cualquiera" opciones={api.tiposEventoActivos().map((t) => [t, t])} {...poner('tipoEvento')} />
                <Seleccion etiqueta="Estado del caso" vacio={null} opciones={opcionesEstado} {...poner('estado')} />
                <Texto etiqueta="Registrado por" placeholder="Nombre del agente" {...poner('registradoPor')} />
              </Fila>
            </Bloque>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: '12px 16px', borderTop: 1, borderColor: 'divider' }}>
            <Button variant="text" onClick={limpiar}>Limpiar</Button>
            <Button type="submit" variant="contained" startIcon={<SearchIcon />}>Buscar</Button>
          </Box>
        </Panel>
      ) : (
        <Panel sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', p: '10px 16px', mb: 3 }}>
          <TuneIcon fontSize="small" sx={{ color: 'text.tertiary' }} />
          <Box sx={{ fontWeight: 600, mr: 1 }}>Filtros</Box>
          {listaChips.map((c) => <FiltroAplicado key={c.texto} etiqueta={c.texto} onQuitar={() => quitar(c.campos)} />)}
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button variant="text" onClick={limpiar}>Limpiar</Button>
            <Button variant="outlined" color="inherit" onClick={() => setDesplegados(true)} sx={{ borderColor: 'divider' }}>Modificar filtros</Button>
          </Box>
        </Panel>
      )}

      <Panel>
        <HerramientasTabla densa={densa} onDensidad={alternarDensidad} borde>
          <Box sx={{ fontSize: 14 }}>
            <Box component="strong">{resultado.total} {resultado.total === 1 ? 'caso' : 'casos'}</Box>
            <Box component="span" sx={{ color: 'text.tertiary' }}> · {vigentes}, {usados}</Box>
          </Box>
          <Button variant="outlined" color="inherit" startIcon={<FileDownloadOutlinedIcon />} onClick={() => navigate(`/consultas/exportar?${aParams(aplicados)}`)} sx={{ borderColor: 'divider' }}>
            Exportar estos resultados
          </Button>
        </HerramientasTabla>
        <TablaCasos filas={resultado.casos} densa={densa} consulta={params.toString()} vacio="No hay casos con estos filtros." />
      </Panel>
      <LeyendaMarcas />
    </>
  )
}
