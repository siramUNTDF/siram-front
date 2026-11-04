import { Box } from '@mui/material'
import { canalesOrigen } from './catalogos'

// Por dónde entró el caso. Es un dato, nunca un color ni una marca del sistema (RN-01).
export default function CanalOrigen({ canal }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        px: '9px',
        py: '3px',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        fontSize: 12.5,
        color: 'text.secondary',
        bgcolor: 'var(--fondo-origen, var(--siram-palette-background-default))',
      }}
    >
      {canalesOrigen[canal] ?? canal}
    </Box>
  )
}
