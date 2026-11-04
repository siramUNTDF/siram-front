import { Box } from '@mui/material'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { fuentes } from '@/tema/tokens'

// «Sin dato» con su estilo propio (rojo, con ícono): no es lo mismo que «No sabe» (RN-23).
export function SinDatoMarcado() {
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'error.main', fontWeight: 500 }}>
      <WarningAmberOutlinedIcon sx={{ fontSize: 15 }} />
      Sin dato
    </Box>
  )
}

// Etiqueta (con el código de la matriz si lo tiene) y el valor debajo.
export default function Dato({ etiqueta, codigo, valor, mono = false, nota, ancho }) {
  const vacio = valor == null || valor === ''
  return (
    <Box sx={{ minWidth: 0, gridColumn: ancho ? { md: `span ${ancho}` } : undefined }}>
      <Box sx={{ fontSize: 12, color: 'text.tertiary', mb: '3px' }}>
        {codigo && <Box component="span" sx={{ fontFamily: fuentes.mono, fontSize: 10.5, mr: '6px' }}>{codigo}</Box>}
        {etiqueta}
      </Box>
      <Box
        sx={{
          fontSize: 14.5,
          fontWeight: 600,
          color: 'text.primary',
          overflowWrap: 'anywhere',
          ...(mono && !vacio && { fontFamily: fuentes.mono, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }),
        }}
      >
        {vacio ? <SinDatoMarcado /> : valor}
      </Box>
      {nota && <Box sx={{ fontSize: 12, color: 'text.tertiary', mt: '2px' }}>{nota}</Box>}
    </Box>
  )
}

// Grilla de datos: tres columnas en escritorio, una en teléfono.
export function Datos({ children, columnas = 3, sx }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: `repeat(${columnas}, minmax(0, 1fr))` }, gap: '16px 24px', ...sx }}>
      {children}
    </Box>
  )
}
