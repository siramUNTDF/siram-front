import { Box, ButtonBase } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// Filtro que vino aplicado (p. ej. desde Inicio) y se puede quitar con la ×.
export default function FiltroAplicado({ etiqueta, onQuitar }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        height: 30,
        pl: 1.5,
        pr: 0.5,
        border: 1,
        borderColor: 'primary.main',
        borderRadius: 1,
        bgcolor: 'background.paper',
        color: 'primary.main',
        fontSize: 13.5,
      }}
    >
      {etiqueta}
      <ButtonBase
        aria-label={`Quitar filtro ${etiqueta}`}
        onClick={onQuitar}
        sx={{
          width: 22,
          height: 22,
          borderRadius: 1,
          color: 'primary.main',
          '&:hover': { bgcolor: 'primary.soft' },
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </ButtonBase>
    </Box>
  )
}
