import { createBrowserRouter } from 'react-router'
import Cascara from '@/cascara/Cascara'
import NoEncontrada from '@/pantallas/NoEncontrada'
import ConPermiso from '@/pantallas/ConPermiso'
import Bandeja from '@/pantallas/casos/bandeja/Bandeja'
import FichaCaso from '@/pantallas/casos/ficha/FichaCaso'
import Historial from '@/pantallas/casos/historial/Historial'
import ListaDeTrabajo from '@/pantallas/casos/ListaDeTrabajo'
import Comparar from '@/pantallas/casos/duplicados/Comparar'
import ColaSolicitudes from '@/pantallas/casos/solicitudes/ColaSolicitudes'
import RevisarSolicitud from '@/pantallas/casos/solicitudes/RevisarSolicitud'
import SumarSolicitud from '@/pantallas/casos/solicitudes/SumarSolicitud'
import Inicio from '@/pantallas/inicio/Inicio'
import Busqueda from '@/pantallas/consultas/Busqueda'
import { DetallePersona, ListaPersonas } from '@/pantallas/consultas/Personas'
import { DetalleAnimal, ListaAnimales, Reconciliar } from '@/pantallas/consultas/Animales'
import MapaCasos from '@/pantallas/consultas/MapaCasos'
import Estadisticas from '@/pantallas/consultas/Estadisticas'
import Exportar from '@/pantallas/consultas/Exportar'
import Usuarios from '@/pantallas/administracion/Usuarios'
import { Organismos, TiposEvento } from '@/pantallas/administracion/Catalogos'
import FormularioInicial from '@/pantallas/publico/FormularioInicial'
import Detallado from '@/pantallas/publico/Detallado'

// Rutas de docs/vistas/*. Las rutas fijas ganan a las de parámetro (/casos/nuevo antes que /casos/:numero).
export const router = createBrowserRouter([
  {
    element: <Cascara />,
    children: [
      { path: '/', element: <Inicio /> },
      { path: '/casos', element: <ConPermiso permiso="casos"><Bandeja /></ConPermiso> },
      // Nuevo caso: la ventana del formulario inicial sobre la Bandeja.
      { path: '/casos/nuevo', element: <ConPermiso permiso="nuevo_caso"><Bandeja nuevo /></ConPermiso> },
      { path: '/casos/solicitudes', element: <ConPermiso permiso="solicitudes"><ColaSolicitudes /></ConPermiso> },
      { path: '/casos/solicitudes/:numero', element: <ConPermiso permiso="solicitudes"><RevisarSolicitud /></ConPermiso> },
      { path: '/casos/solicitudes/:numero/sumar/:caso', element: <ConPermiso permiso="solicitudes"><SumarSolicitud /></ConPermiso> },
      { path: '/casos/duplicados', element: <ConPermiso permiso="listas_trabajo"><ListaDeTrabajo key="duplicado" marca="duplicado" /></ConPermiso> },
      { path: '/casos/comparar/:a/:b', element: <ConPermiso permiso="listas_trabajo"><Comparar /></ConPermiso> },
      { path: '/casos/incompletos', element: <ConPermiso permiso="listas_trabajo"><ListaDeTrabajo key="incompleto" marca="incompleto" /></ConPermiso> },
      // Ficha del caso: no tiene entrada en el menú.
      { path: '/casos/:numero', element: <ConPermiso permiso="casos"><FichaCaso /></ConPermiso> },
      { path: '/casos/:numero/historial', element: <ConPermiso permiso="casos"><Historial /></ConPermiso> },
      { path: '/consultas/busqueda', element: <ConPermiso permiso="busqueda"><Busqueda /></ConPermiso> },
      { path: '/consultas/personas', element: <ConPermiso permiso="personas"><ListaPersonas /></ConPermiso> },
      { path: '/consultas/personas/:id', element: <ConPermiso permiso="personas"><DetallePersona /></ConPermiso> },
      { path: '/consultas/animales', element: <ConPermiso permiso="animales"><ListaAnimales /></ConPermiso> },
      { path: '/consultas/animales/:id', element: <ConPermiso permiso="animales"><DetalleAnimal /></ConPermiso> },
      { path: '/consultas/animales/:id/reconciliar', element: <ConPermiso permiso="animales"><Reconciliar /></ConPermiso> },
      { path: '/consultas/mapa', element: <ConPermiso permiso="mapa"><MapaCasos /></ConPermiso> },
      { path: '/consultas/estadisticas', element: <ConPermiso permiso="estadisticas"><Estadisticas /></ConPermiso> },
      { path: '/consultas/exportar', element: <ConPermiso permiso="exportar"><Exportar /></ConPermiso> },
      { path: '/administracion/usuarios', element: <ConPermiso permiso="usuarios"><Usuarios /></ConPermiso> },
      { path: '/administracion/usuarios/roles', element: <ConPermiso permiso="usuarios"><Usuarios /></ConPermiso> },
      { path: '/administracion/organismos', element: <ConPermiso permiso="organismos"><Organismos /></ConPermiso> },
      { path: '/administracion/tipos-evento', element: <ConPermiso permiso="tipos_evento"><TiposEvento /></ConPermiso> },
      { path: '*', element: <NoEncontrada /> },
    ],
  },
  // Formulario público: otra piel, sin la cáscara del backoffice y sin login.
  { path: '/reportar', element: <FormularioInicial /> },
  { path: '/reportar/detalle', element: <Detallado /> },
])
