import { Box } from '@mui/material'
import { fuentes } from '@/tema/tokens'

// Bloque con leyenda (fieldset), para formularios y para las fichas de solo lectura.
export default function Bloque({ titulo, bajada, children, acciones, sx }) {
  return (
    <Box
      component="fieldset"
      sx={{ m: 0, minWidth: 0, p: { xs: '4px 16px 18px', sm: '4px 20px 20px' }, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper', ...sx }}
    >
      <Box component="legend" sx={{ px: '8px', ml: '-8px', fontFamily: fuentes.titulos, fontWeight: 600, fontSize: 15.5, color: 'text.primary' }}>
        {titulo}
      </Box>
      {bajada ? <Box sx={{ fontSize: 13, color: 'text.secondary', mt: '6px', mb: '14px' }}>{bajada}</Box> : <Box sx={{ height: 12 }} />}
      {children}
      {acciones && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>{acciones}</Box>}
    </Box>
  )
}

// Rótulo chico en mayúsculas para separar secciones dentro de un bloque.
export function Rotulo({ children, sx }) {
  return (
    <Box sx={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'text.tertiary', m: '18px 0 10px', ...sx }}>
      {children}
    </Box>
  )
}
