import { createElement } from 'react'
import { Link } from 'react-router'
import { Box, Button } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import EncabezadoPagina, { EncabezadoSeccion, NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import { Barras, Columnas, TarjetaGrafico } from '@/componentes/graficos/Graficos'
import { serie, serieMeses } from '@/componentes/graficos/series'
import { api, useApi, useSesion } from '@/mocks'
import { fuentes } from '@/tema/tokens'
import { fechaLarga } from '@/utiles/formato'

// Las tarjetas de «Para resolver hoy», por nivel (inicio.md). Las cifras llegan de la API.
const niveles = [
  {
    rotulo: 'Bloquea el registro', aclaracion: 'el caso no avanza hasta que alguien lo resuelva', grande: true,
    tarjetas: [
      { clave: 'incompletos', color: 'error', Icono: AssignmentLateOutlinedIcon, texto: ['caso incompleto', 'casos incompletos'], detalle: 'Faltan datos obligatorios', a: '/casos/incompletos' },
      { clave: 'esperandoContacto', color: 'info', Icono: ScheduleIcon, texto: ['caso esperando contacto', 'casos esperando contacto'], detalle: 'Falta un teléfono: hay que buscarlo por DNI', a: '/casos?filtro=en_seguimiento&motivo=contacto' },
      { clave: 'graves', color: 'error', Icono: ErrorOutlineIcon, texto: ['caso grave', 'casos graves'], detalle: 'Un animal murió o enfermó en la observación', a: '/casos?filtro=graves' },
    ],
  },
  {
    rotulo: 'Espera tu revisión', aclaracion: 'solicitudes para registrar y posibles duplicados para decidir',
    tarjetas: [
      { clave: 'solicitudesPendientes', color: 'info', Icono: DescriptionOutlinedIcon, texto: ['solicitud pendiente', 'solicitudes pendientes'], detalle: 'Del formulario público', a: '/casos/solicitudes' },
      { clave: 'posiblesDuplicados', color: 'dup', Icono: ContentCopyOutlinedIcon, texto: ['posible duplicado', 'posibles duplicados'], detalle: 'Esperan revisión', a: '/casos/duplicados' },
    ],
  },
  {
    rotulo: 'En curso', aclaracion: 'no urge, pero no se cierra solo',
    tarjetas: [
      { clave: 'enSeguimiento', color: 'warning', Icono: FlagOutlinedIcon, texto: ['caso en seguimiento', 'casos en seguimiento'], detalle: '· con acción pendiente', a: '/casos?filtro=en_seguimiento', enLinea: true },
    ],
  },
]

// Toda la tarjeta es el enlace; la flecha es decoración. Una cifra 0 se muestra igual.
function Pendiente({ cifra, color, Icono: icono, texto, detalle, a, grande, enLinea }) {
  const Icono = icono
  return (
    <Box
      component={Link}
      to={a}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, p: grande ? '18px 16px' : '12px 16px', borderRadius: 1, border: 1, borderLeft: 4,
        borderColor: grande ? `${color}.soft` : 'divider', borderLeftColor: `${color}.main`, bgcolor: grande ? `${color}.soft` : 'background.paper',
        color: 'text.primary', textDecoration: 'none', '&:hover': { borderColor: `${color}.main` }, '&:hover .flecha': { color: `${color}.main` },
      }}
    >
      <Icono sx={{ color: `${color}.main`, fontSize: 20 }} />
      <Box sx={{ display: 'flex', alignItems: grande ? 'flex-start' : 'center', flexDirection: grande ? 'column' : 'row', gap: grande ? 0 : 1.5, flex: 1, minWidth: 0 }}>
        <Box sx={{ fontFamily: fuentes.titulos, fontWeight: 700, fontSize: grande ? 36 : 22, lineHeight: 1, color: `${color}.main`, fontVariantNumeric: 'tabular-nums' }}>{cifra}</Box>
        <Box sx={{ display: enLinea ? 'flex' : 'block', gap: 1, alignItems: 'baseline', mt: grande ? '6px' : 0 }}>
          <Box sx={{ fontWeight: 600, fontSize: 14 }}>{cifra === 1 ? texto[0] : texto[1]}</Box>
          <Box sx={{ fontSize: 12, color: 'text.tertiary' }}>{detalle}</Box>
        </Box>
      </Box>
      <ArrowForwardIcon className="flecha" sx={{ fontSize: 18, color: 'text.tertiary' }} />
    </Box>
  )
}

const secciones = [
  { permiso: 'casos', titulo: 'Casos', bajada: 'Buscar, abrir y registrar casos de ataque o mordedura.', a: '/casos', Icono: FolderOutlinedIcon },
  { permiso: 'busqueda', titulo: 'Consultas', bajada: 'Armar reportes por zona, período y organismo, y exportarlos.', a: '/consultas/busqueda', Icono: SearchOutlinedIcon },
  { permiso: 'usuarios', titulo: 'Administración', bajada: 'Usuarios, organismos adheridos y tablas del sistema.', a: '/administracion/usuarios', Icono: SettingsOutlinedIcon },
]

// Inicio (inicio.md): lo que hay que resolver hoy, el panorama del año y los accesos.
// Lo que la API no manda (p. ej. `pendientes` a Consulta) no se muestra.
export default function Inicio() {
  const sesion = useSesion()
  const { datos } = useApi(() => api.inicio())
  const { pendientes, panorama } = datos
  const pie = `casos vigentes en ${panorama?.anio}`

  return (
    <>
      <EncabezadoPagina titulo="Registro de ataques y mordeduras" bajada={`Provincia de Tierra del Fuego · datos al ${fechaLarga(datos.datosAl)}`} extra={<NotaDatosEjemplo />} />

      {pendientes && (
        <Box component="section" sx={{ mb: 5 }}>
          <EncabezadoSeccion titulo="Para resolver hoy" bajada="Ordenado por lo que frena el registro, no por cantidad." />
          {niveles.map((n) => (
            <Box key={n.rotulo} sx={{ mb: 2 }}>
              <Box sx={{ fontSize: 13, mb: 1 }}>
                <Box component="strong" sx={{ fontWeight: 600 }}>{n.rotulo}</Box>
                <Box component="span" sx={{ color: 'text.tertiary', ml: 1, fontSize: 12 }}>{n.aclaracion}</Box>
              </Box>
              <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: n.grande ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)' } }}>
                {n.tarjetas.map((t) => <Pendiente key={t.clave} cifra={pendientes[t.clave]} grande={n.grande} {...t} />)}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {panorama && (
        <Box component="section" sx={{ mb: 5 }}>
          <EncabezadoSeccion
            titulo={`Panorama ${panorama.anio}`}
            bajada="Todo lo que sigue se calcula sobre los casos vigentes: sin desestimados ni unificados."
            extra={(
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Box sx={{ fontFamily: fuentes.titulos, fontSize: 38, fontWeight: 600, lineHeight: 1 }}>{panorama.totalVigentes}</Box>
                <Box sx={{ fontSize: 12.5, color: 'text.tertiary', maxWidth: 110 }}>casos vigentes en el año</Box>
              </Box>
            )}
          />
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' } }}>
            <TarjetaGrafico titulo="Casos por mes" area="Epidemiología" mide="fecha del hecho" datos={serieMeses(panorama.casosPorMes, datos.datosAl)}>
              <Columnas datos={serieMeses(panorama.casosPorMes, datos.datosAl)} pie={`mes del hecho, ${panorama.anio}`} />
            </TarjetaGrafico>
            <TarjetaGrafico
              titulo="Zona del cuerpo lesionada" area="Epidemiología" mide="lesión principal" pie="casos vigentes con tratamiento cargado"
              nota="Sale del tratamiento que carga Salud: los casos que no pasaron por Salud no tienen este dato."
              datos={serie(panorama.zonaDelCuerpo.valores, 'zona', { destacados: ['cabeza'] })}
            >
              <Barras datos={serie(panorama.zonaDelCuerpo.valores, 'zona', { destacados: ['cabeza'] })} />
            </TarjetaGrafico>
            <TarjetaGrafico titulo="Franja etaria de la víctima" area="Epidemiología" mide="edad al momento del ataque" datos={serie(panorama.franjaEtaria, null, { destacados: ['0–9'] })}>
              <Columnas datos={serie(panorama.franjaEtaria, null, { destacados: ['0–9'] })} pie="edad de la víctima, en años" />
            </TarjetaGrafico>
            <TarjetaGrafico
              titulo="Canal de origen" area="Cobertura" mide="quién carga los casos" pie={pie} conPorcentaje
              nota="Por dónde entró cada caso. «Ciudadano» son las solicitudes registradas; «Histórico», registros viejos cargados a mano."
              datos={serie(panorama.canalOrigen, 'canal', { total: panorama.totalVigentes })}
            >
              <Barras etiquetaArriba conPorcentaje datos={serie(panorama.canalOrigen, 'canal', { total: panorama.totalVigentes })} />
            </TarjetaGrafico>
          </Box>
        </Box>
      )}

      <Box component="section">
        <EncabezadoSeccion titulo="Secciones" />
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          {secciones.filter((s) => sesion.permisos.includes(s.permiso)).map(({ titulo, bajada, a, Icono: icono }) => (
            <Panel key={titulo} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '14px 16px' }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: 'primary.soft', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                {createElement(icono, { fontSize: 'small' })}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ fontWeight: 600 }}>{titulo}</Box>
                <Box sx={{ fontSize: 13, color: 'text.tertiary' }}>{bajada}</Box>
              </Box>
              <Button variant="contained" component={Link} to={a} sx={{ minWidth: 0 }}>Ir</Button>
            </Panel>
          ))}
        </Box>
      </Box>
    </>
  )
}
