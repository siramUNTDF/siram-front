import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Box } from '@mui/material'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import CampoBusqueda from '@/componentes/CampoBusqueda'
import ChipFiltro from '@/componentes/ChipFiltro'
import FiltroAplicado from '@/componentes/FiltroAplicado'
import BotonNuevo from '@/componentes/botones/BotonNuevo'
import TablaCasos from '@/componentes/caso/TablaCasos'
import { motivosEspera } from '@/componentes/caso/catalogos'
import { criterios } from '@/componentes/caso/criterios'
import { api, useApi, useSesion } from '@/mocks'
import HerramientasTabla from './HerramientasTabla'
import useDensidad from './useDensidad'
import LeyendaMarcas from './LeyendaMarcas'
import { coincideBusqueda } from './busqueda'
import NuevoCaso from '../nuevo/NuevoCaso'

// `clave` es también el valor de `?filtro=` en la URL (lo usa Inicio para llegar ya filtrado).
const filtros = [
  { clave: 'todos', etiqueta: 'Todos', aplica: () => true },
  { clave: 'incompletos', etiqueta: 'Incompletos', aplica: criterios.incompleto },
  { clave: 'duplicados', etiqueta: 'Posibles duplicados', aplica: criterios.duplicado },
  { clave: 'en_seguimiento', etiqueta: 'En seguimiento', aplica: criterios.enSeguimiento },
  { clave: 'graves', etiqueta: 'Graves', aplica: criterios.grave },
]

// `?filtro=` elige el chip; `?motivo=` fuerza «En seguimiento» y agrega el filtro de motivo, quitable.
function leerFiltros(params) {
  const motivo = motivosEspera[params.get('motivo')] ? params.get('motivo') : null
  const pedido = params.get('filtro')
  const chip = motivo ? 'en_seguimiento' : filtros.some((f) => f.clave === pedido) ? pedido : 'todos'
  return { chip, motivo }
}

// Con `nuevo`, la ruta /casos/nuevo: la Bandeja con la ventana del formulario inicial abierta.
export default function Bandeja({ nuevo = false }) {
  const navigate = useNavigate()
  const sesion = useSesion()
  const [params, setParams] = useSearchParams()
  const { chip, motivo } = leerFiltros(params)
  const { datos: casos } = useApi(() => api.listarCasos())
  const [busqueda, setBusqueda] = useState('')
  const [densa, alternarDensidad] = useDensidad()

  const buscados = useMemo(() => casos.filter((c) => coincideBusqueda(c, busqueda)), [casos, busqueda])
  const cantidades = useMemo(() => Object.fromEntries(filtros.map((f) => [f.clave, buscados.filter(f.aplica).length])), [buscados])
  const filtrados = useMemo(() => {
    const aplica = filtros.find((f) => f.clave === chip).aplica
    return buscados.filter((c) => aplica(c) && (!motivo || c.motivoEspera === motivo))
  }, [buscados, chip, motivo])

  // Cambiar de chip borra el filtro de motivo y deja la URL lista para compartir.
  function elegirChip(clave) {
    setParams(clave === 'todos' ? {} : { filtro: clave })
  }

  return (
    <>
      <EncabezadoPagina
        titulo="Bandeja de casos"
        bajada="Ordenados por última modificación: arriba queda lo que alguien tocó hace poco."
        extra={<NotaDatosEjemplo />}
      />

      <Panel>
        <HerramientasTabla densa={densa} onDensidad={alternarDensidad}>
          <CampoBusqueda valor={busqueda} onCambio={setBusqueda} placeholder="Buscar por caso, víctima o DNI" etiqueta="Buscar casos por número, víctima o DNI" />
          {sesion.permisos.includes('nuevo_caso') && <BotonNuevo texto="Nuevo caso" onClick={() => navigate('/casos/nuevo')} />}
        </HerramientasTabla>

        <Box
          role="group"
          aria-label="Filtros rápidos"
          sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', px: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          {filtros.map((f) => (
            <ChipFiltro key={f.clave} etiqueta={f.etiqueta} cantidad={cantidades[f.clave]} activo={chip === f.clave} onClick={() => elegirChip(f.clave)} />
          ))}
          {motivo && <FiltroAplicado etiqueta={`Motivo: ${motivosEspera[motivo]}`} onQuitar={() => setParams({ filtro: 'en_seguimiento' })} />}
        </Box>

        <TablaCasos filas={filtrados} densa={densa} consulta={`${busqueda}|${chip}|${motivo}`} vacio="No hay casos que coincidan con la búsqueda." />
      </Panel>

      <LeyendaMarcas />

      {nuevo && sesion.permisos.includes('nuevo_caso') && <NuevoCaso onCerrar={() => navigate('/casos')} />}
    </>
  )
}
