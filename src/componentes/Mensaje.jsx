import { Box, IconButton } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CloseIcon from '@mui/icons-material/Close'

const tipos = {
  info: { color: 'info', Icono: InfoOutlinedIcon },
  advertencia: { color: 'warning', Icono: WarningAmberOutlinedIcon },
  error: { color: 'error', Icono: ErrorOutlineIcon },
  exito: { color: 'success', Icono: CheckCircleOutlineIcon },
  duplicado: { color: 'dup', Icono: InfoOutlinedIcon },
}

// Mensaje en la página o en una ventana. Advertencia y error no se cierran solos.
export default function Mensaje({ tipo = 'info', titulo, children, acciones, onCerrar, icono, sx }) {
  const { color, Icono } = tipos[tipo]
  return (
    <Box
      role={tipo === 'error' || tipo === 'advertencia' ? 'alert' : 'status'}
      sx={{
        display: 'flex',
        gap: 1.25,
        alignItems: 'flex-start',
        p: '12px 14px',
        borderRadius: 1,
        bgcolor: `${color}.soft`,
        border: 1,
        borderColor: tipo === 'duplicado' ? `${color}.main` : `${color}.soft`,
        color: 'text.primary',
        fontSize: 13.5,
        ...sx,
      }}
    >
      <Box sx={{ color: `${color}.main`, display: 'flex', mt: '1px' }}>{icono ?? <Icono fontSize="small" />}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {titulo && <Box sx={{ fontWeight: 600, mb: children ? '2px' : 0 }}>{titulo}</Box>}
        {children && <Box sx={{ color: 'text.secondary' }}>{children}</Box>}
        {acciones && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.25 }}>{acciones}</Box>}
      </Box>
      {onCerrar && (
        <IconButton aria-label="Cerrar mensaje" onClick={onCerrar} size="small" sx={{ color: 'text.tertiary', m: '-4px -6px 0 0' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  )
}
