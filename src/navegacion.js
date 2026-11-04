import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

// Menú lateral según docs/README.md. Dos niveles, nunca tres.
// `permiso`: el ítem aparece solo si la API manda ese permiso para el usuario (RN-35).
// `contador`: clave de la cantidad que muestra el menú (ver Cascara.jsx).
export const navegacion = [
  { titulo: 'Inicio', ruta: '/', icono: HomeOutlinedIcon },
  {
    titulo: 'Casos',
    icono: FolderOutlinedIcon,
    hijos: [
      { titulo: 'Bandeja', ruta: '/casos', permiso: 'casos' },
      { titulo: 'Nuevo caso', ruta: '/casos/nuevo', permiso: 'nuevo_caso' },
      { titulo: 'Solicitudes', ruta: '/casos/solicitudes', permiso: 'solicitudes', contador: 'solicitudes' },
      { titulo: 'Posibles duplicados', ruta: '/casos/duplicados', permiso: 'listas_trabajo', contador: 'duplicado' },
      { titulo: 'Incompletos', ruta: '/casos/incompletos', permiso: 'listas_trabajo', contador: 'incompleto' },
    ],
  },
  {
    titulo: 'Consultas',
    icono: SearchOutlinedIcon,
    hijos: [
      { titulo: 'Búsqueda', ruta: '/consultas/busqueda', permiso: 'busqueda' },
      { titulo: 'Personas', ruta: '/consultas/personas', permiso: 'personas' },
      { titulo: 'Animales', ruta: '/consultas/animales', permiso: 'animales' },
      { titulo: 'Mapa', ruta: '/consultas/mapa', permiso: 'mapa' },
      { titulo: 'Estadísticas', ruta: '/consultas/estadisticas', permiso: 'estadisticas' },
      { titulo: 'Exportar', ruta: '/consultas/exportar', permiso: 'exportar' },
    ],
  },
  {
    titulo: 'Administración',
    icono: SettingsOutlinedIcon,
    hijos: [
      { titulo: 'Usuarios', ruta: '/administracion/usuarios', permiso: 'usuarios' },
      { titulo: 'Organismos', ruta: '/administracion/organismos', permiso: 'organismos' },
      { titulo: 'Tipos de evento', ruta: '/administracion/tipos-evento', permiso: 'tipos_evento' },
    ],
  },
]

// El menú con solo lo que el usuario puede ver; un grupo sin hojas no se muestra.
export function navegacionPara(permisos = []) {
  return navegacion
    .map((item) => (item.hijos ? { ...item, hijos: item.hijos.filter((h) => !h.permiso || permisos.includes(h.permiso)) } : item))
    .filter((item) => !item.hijos || item.hijos.length > 0)
}
