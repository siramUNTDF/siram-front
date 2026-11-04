import { Box } from '@mui/material'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'

// Un dato como chip neutro (p. ej. el organismo). Nunca un color ni una marca del sistema (RN-01).
export default function ChipDato({ children, sx }) {
  return (
    <Box
      component="span"
      sx={{ display: 'inline-block', px: '9px', py: '3px', border: 1, borderColor: 'divider', borderRadius: 1, fontSize: 12.5, color: 'text.secondary', bgcolor: 'background.default', whiteSpace: 'nowrap', ...sx }}
    >
      {children}
    </Box>
  )
}

// Archivo adjunto: solo nombre y dónde está alojado (no se guardan los archivos).
export function ArchivoAdjunto({ nombre, detalle, url, imagen = false }) {
  const Icono = imagen ? ImageOutlinedIcon : DescriptionOutlinedIcon
  return (
    <Box
      component={url ? 'a' : 'div'}
      href={url}
      target="_blank"
      rel="noreferrer"
      sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: '8px 12px', border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.default', color: 'text.primary', textDecoration: 'none', maxWidth: 360, '&:hover': url ? { borderColor: 'primary.main' } : undefined }}
    >
      <Box sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: 'primary.soft', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <Icono sx={{ fontSize: 17 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</Box>
        {detalle && <Box sx={{ fontSize: 12, color: 'text.tertiary' }}>{detalle}</Box>}
      </Box>
    </Box>
  )
}
