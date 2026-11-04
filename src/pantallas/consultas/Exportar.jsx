import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Box, Button } from '@mui/material'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import Bloque from '@/componentes/Bloque'
import Mensaje from '@/componentes/Mensaje'
import { Casilla, Fila, Nota, Opciones, Seleccion, Texto } from '@/componentes/formulario/Campos'
import { useAvisar } from '@/componentes/avisos'
import { estados } from '@/componentes/caso/catalogos'
import { api, ErrorApi, useApi } from '@/mocks'
import { hoy } from '@/mocks/datos'
import { fuentes } from '@/tema/tokens'
import { fechaCorta } from '@/utiles/formato'

const ciudades = { Ushuaia: 'Ushuaia', 'Río Grande': 'Río Grande', Tolhuin: 'Tolhuin' }
const opcionesEstado = [['vigentes', 'Vigentes'], ['todos', 'Todos'], ...Object.entries(estados).map(([k, v]) => [k, v.etiqueta])]
// Filtros que vienen de Búsqueda y no tienen campo acá: se listan en el resumen y se aplican igual.
const deLaBusqueda = { lugar: 'Lugar', tipoLugar: 'Tipo de lugar', edadDesde: 'Edad desde', edadHasta: 'Edad hasta', especie: 'Especie', tamano: 'Tamaño', colorRaza: 'Color o raza', tenencia: 'Tenencia', registradoPor: 'Registrado por' }
const formatos = {
  csv: 'CSV',
  xlsx: 'XLSX',
}

// Exportar (exportar.md). Los bloques y sus columnas los manda la API según el rol;
// el archivo lo genera el back (acá, el servidor de ejemplo arma un CSV mínimo).
export default function Exportar() {
  const avisar = useAvisar()
  const [params] = useSearchParams()
  const anio = hoy.slice(0, 4)
  const [casos, setCasos] = useState({
    desde: params.get('desde') ?? `${anio}-01-01`, hasta: params.get('hasta') ?? hoy, ciudad: params.get('ciudad'), organismo: params.get('organismo'),
    estado: params.get('estado') ?? 'vigentes', tipoEvento: params.get('tipoEvento'),
  })
  const [extra, setExtra] = useState(() => Object.fromEntries(Object.keys(deLaBusqueda).filter((k) => params.get(k)).map((k) => [k, params.get(k)])))
  const { datos: bloques } = useApi(() => api.bloquesExportar())
  const [marcados, setMarcados] = useState(() => Object.fromEntries(bloques.map((b) => [b.clave, b.porDefecto])))
  const [formato, setFormato] = useState('csv')
  const [error, setError] = useState(null)
  const [trabajando, setTrabajando] = useState(false)

  const filtros = { ...casos, ...extra }
  const total = api.contarParaExportar(filtros)
  const elegidos = bloques.filter((b) => marcados[b.clave])
  const columnas = elegidos.reduce((s, b) => s + b.columnas, 0)
  const conPersonales = Boolean(marcados.datos_personales)
  const motivoDeshabilitado = !elegidos.length ? 'Elegí al menos un bloque de columnas' : total === 0 ? 'No hay casos con estos filtros' : null
  const poner = (c) => ({ valor: casos[c] ?? '', onCambio: (v) => setCasos((x) => ({ ...x, [c]: v || null })) })

  function descargar() {
    setTrabajando(true)
    setError(null)
    // Simula la espera del archivo.
    setTimeout(() => {
      try {
        const r = api.descargar(filtros, elegidos.map((b) => b.clave), formato)
        const enlace = document.createElement('a')
        enlace.href = URL.createObjectURL(new Blob([r.contenido], { type: 'text/csv;charset=utf-8' }))
        enlace.download = `siram-casos-${hoy}.${formato}`
        enlace.click()
        URL.revokeObjectURL(enlace.href)
        avisar('exito', `Descargaste ${r.cantidad} casos`)
      } catch (e) {
        if (!(e instanceof ErrorApi)) throw e
        setError(e.message)
      } finally {
        setTrabajando(false)
      }
    }, 600)
  }

  const textoFiltros = [
    `Fecha del hecho: ${fechaCorta(casos.desde) ?? '…'} – ${fechaCorta(casos.hasta) ?? '…'}`,
    casos.ciudad || casos.organismo ? [casos.ciudad ?? 'Todas las ciudades', casos.organismo ?? 'todos los organismos'].join(' · ') : 'Todas las ciudades y todos los organismos',
    casos.tipoEvento ?? 'Todos los tipos de evento',
  ]

  return (
    <>
      <EncabezadoPagina titulo="Exportar" bajada="Descargá casos en CSV o XLSX para analizarlos fuera de SIRAM." extra={<NotaDatosEjemplo />} />
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' }, alignItems: 'start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Bloque titulo="Casos">
            <Fila>
              <Texto etiqueta="Fecha del hecho: desde" tipo="date" mono {...poner('desde')} />
              <Texto etiqueta="Hasta" tipo="date" mono {...poner('hasta')} />
              <Seleccion etiqueta="Ciudad" vacio="Todas" opciones={ciudades} {...poner('ciudad')} />
              <Seleccion etiqueta="Organismo" vacio="Todos" opciones={api.nombresOrganismos().map((o) => [o, o])} {...poner('organismo')} />
              <Seleccion etiqueta="Estado del caso" vacio={null} opciones={opcionesEstado} {...poner('estado')} />
              <Seleccion etiqueta="Tipo de evento" vacio="Todos" opciones={api.tiposEventoActivos().map((t) => [t, t])} {...poner('tipoEvento')} />
            </Fila>
            <Nota>Desde Búsqueda, «Exportar estos resultados» abre esta página con los mismos filtros.</Nota>
          </Bloque>

          <Bloque titulo="Columnas" bajada="Cada bloque suma sus columnas al archivo, en el mismo orden que la ficha del caso.">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {bloques.map((b) => (
                <Box key={b.clave} sx={b.sensible ? { mt: 1, pt: 1.5, borderTop: 1, borderColor: 'divider' } : undefined}>
                  <Casilla
                    etiqueta={<><strong>{b.titulo}</strong> <Box component="span" sx={{ fontFamily: fuentes.mono, fontSize: 12, color: 'text.tertiary' }}>· {b.columnas} {b.columnas === 1 ? 'columna' : 'columnas'}</Box></>}
                    descripcion={b.descripcion}
                    marcada={Boolean(marcados[b.clave])}
                    onCambio={(v) => setMarcados((m) => ({ ...m, [b.clave]: v }))}
                  />
                </Box>
              ))}
            </Box>
            {conPersonales && (
              <Mensaje tipo="advertencia" titulo="Vas a descargar datos personales." sx={{ mt: 2 }}>
                El archivo va a incluir el nombre, el DNI, el teléfono, el correo y el domicilio de cada persona. Son datos protegidos por la Ley 25.326.
              </Mensaje>
            )}
          </Bloque>

          <Bloque titulo="Formato">
            <Opciones
              vertical
              valor={formato}
              onCambio={setFormato}
              opciones={formatos}
              descripciones={{ csv: 'Texto separado por comas. Se abre en cualquier planilla o programa de análisis.', xlsx: 'Planilla de Excel, con una fila por caso.' }}
              sinError
            />
          </Bloque>
        </Box>

        <Panel sx={{ p: '16px 18px', position: { lg: 'sticky' }, top: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ fontWeight: 600 }}>Resumen</Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Box sx={{ fontFamily: fuentes.titulos, fontSize: 32, fontWeight: 600, lineHeight: 1 }}>{total}</Box>
            <Box sx={{ fontSize: 13, color: 'text.tertiary' }}>casos {casos.estado === 'vigentes' ? 'vigentes' : ''}</Box>
          </Box>
          <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 13, color: 'text.secondary' }}>
            {textoFiltros.map((t) => <li key={t}>{t}</li>)}
          </Box>
          {Object.keys(extra).length > 0 && (
            <Box sx={{ fontSize: 13, color: 'text.secondary' }}>
              Filtros de la búsqueda: {Object.entries(extra).map(([k, v]) => `${deLaBusqueda[k]}: ${v}`).join(' · ')}.{' '}
              <Button variant="text" size="small" onClick={() => setExtra({})} sx={{ p: 0, minWidth: 0, verticalAlign: 'baseline' }}>Quitar los filtros de la búsqueda</Button>
            </Box>
          )}
          <Box sx={{ fontSize: 13 }}>{columnas} columnas, en {elegidos.length} bloques</Box>
          {conPersonales && <Box sx={{ fontSize: 13, color: 'warning.main', fontWeight: 600 }}>Incluye datos personales</Box>}
          <Box sx={{ fontSize: 13 }}>Formato {formatos[formato]}</Box>
          {error && <Mensaje tipo="error" onCerrar={() => setError(null)}>{error}</Mensaje>}
          <Button variant="contained" startIcon={<FileDownloadOutlinedIcon />} disabled={Boolean(motivoDeshabilitado) || trabajando} onClick={descargar}>
            {trabajando ? 'Preparando el archivo…' : `Descargar ${formatos[formato]}`}
          </Button>
          {motivoDeshabilitado && <Box sx={{ fontSize: 12, color: 'text.tertiary' }}>{motivoDeshabilitado}</Box>}
        </Panel>
      </Box>
    </>
  )
}
