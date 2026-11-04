import { Link } from 'react-router'
import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { fuentes } from '@/tema/tokens'

// Título de la página, bajada opcional y, a la derecha, lo que se pase en `extra`.
// Sin breadcrumbs: la jerarquía la carga el menú. `volver` pone la flecha a la izquierda.
export default function EncabezadoPagina({ titulo, bajada, extra, volver, junto }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      {volver && (
        <IconButton component={Link} to={volver} aria-label="Volver" sx={{ mt: '-2px', border: 1, borderColor: 'divider', bgcolor: 'background.paper', width: 36, height: 36 }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      )}
      <Box sx={{ minWidth: 0, flex: '1 1 320px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h1" sx={{ mb: 0.5 }}>{titulo}</Typography>
          {junto}
        </Box>
        {bajada && <Typography component="div" sx={{ m: 0, color: 'text.tertiary', fontSize: 14 }}>{bajada}</Typography>}
      </Box>
      {extra && <Box sx={{ ml: { xs: 0, sm: 'auto' }, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>{extra}</Box>}
    </Box>
  )
}

// Rótulo que avisa que la pantalla muestra datos de ejemplo.
export function NotaDatosEjemplo() {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        fontFamily: fuentes.mono,
        fontSize: 10.5,
        letterSpacing: '.09em',
        textTransform: 'uppercase',
        color: 'text.tertiary',
        border: 1,
        borderStyle: 'dashed',
        borderColor: 'divider',
        borderRadius: 1,
        px: '9px',
        py: '5px',
        whiteSpace: 'nowrap',
      }}
    >
      Datos de ejemplo
    </Box>
  )
}

// Encabezado de una sección dentro de la página («Para resolver hoy», «Panorama 2026»…).
export function EncabezadoSeccion({ titulo, bajada, extra }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap', mb: 2 }}>
      <div>
        <Box component="h2" sx={{ m: 0, fontSize: 12.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'text.primary' }}>{titulo}</Box>
        {bajada && <Box sx={{ fontSize: 13.5, color: 'text.tertiary', mt: '4px' }}>{bajada}</Box>}
      </div>
      {extra && <Box sx={{ ml: 'auto' }}>{extra}</Box>}
    </Box>
  )
}
