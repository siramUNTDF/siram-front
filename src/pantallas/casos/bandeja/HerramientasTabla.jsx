import { Box } from '@mui/material'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import DensityMediumOutlinedIcon from '@mui/icons-material/DensityMediumOutlined'
import DensitySmallOutlinedIcon from '@mui/icons-material/DensitySmallOutlined'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import BotonIcono from '@/componentes/botones/BotonIcono'

// Barra de herramientas de las tablas de casos: lo que se pase a la izquierda y, a la derecha,
// filtros y columnas (deshabilitados, «en diseño») y la densidad de filas, que funciona.
export default function HerramientasTabla({ children, densa, onDensidad, borde = false }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', p: 2, ...(borde && { borderBottom: 1, borderColor: 'divider' }) }}>
      {children}
      <Box sx={{ ml: { xs: 0, sm: 'auto' }, display: 'flex', gap: '2px' }}>
        <BotonIcono etiqueta="Filtros (en diseño)" disabled>
          <FilterAltOutlinedIcon fontSize="small" />
        </BotonIcono>
        <BotonIcono etiqueta={densa ? 'Filas normales' : 'Filas compactas'} aria-pressed={densa} onClick={onDensidad}>
          {densa ? <DensityMediumOutlinedIcon fontSize="small" /> : <DensitySmallOutlinedIcon fontSize="small" />}
        </BotonIcono>
        <BotonIcono etiqueta="Columnas visibles (en diseño)" disabled>
          <ViewColumnOutlinedIcon fontSize="small" />
        </BotonIcono>
      </Box>
    </Box>
  )
}
