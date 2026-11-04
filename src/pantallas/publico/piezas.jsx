import { Box, Button, LinearProgress } from '@mui/material'
import { fuentes } from '@/tema/tokens'
import { api } from '@/mocks'

// Piel del formulario público: sin la cáscara del backoffice, 390 px de ancho máximo, centrado.
export function PielPublica({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', overflowY: 'auto', height: '100vh' }}>
      <Box sx={{ maxWidth: 390, mx: 'auto', px: 2, pb: 5 }}>
        <Box component="header" sx={{ py: 2.5, borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Box sx={{ fontFamily: fuentes.titulos, fontWeight: 800, fontSize: 20, letterSpacing: '.14em' }}>SIRAM</Box>
          <Box sx={{ fontSize: 12, color: 'text.tertiary' }}>Registro de ataques y mordeduras · Tierra del Fuego</Box>
        </Box>
        {children}
      </Box>
    </Box>
  )
}

export function Titulo({ children, bajada }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box component="h1" sx={{ m: 0, fontFamily: fuentes.titulos, fontWeight: 800, fontSize: 24, lineHeight: 1.2 }}>{children}</Box>
      {bajada && <Box sx={{ mt: 1, fontSize: 15, color: 'text.secondary' }}>{bajada}</Box>}
    </Box>
  )
}

// Botón principal a todo el ancho y «Terminar acá» como texto debajo.
export function Acciones({ principal, onPrincipal, ocupado, terminar, onTerminar }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
      <Button type="submit" variant="contained" size="large" fullWidth disabled={ocupado} onClick={onPrincipal} sx={{ height: 46 }}>
        {ocupado ? 'Enviando…' : principal}
      </Button>
      {onTerminar && <Button variant="text" fullWidth onClick={onTerminar} disabled={ocupado}>{terminar ?? 'Terminar acá'}</Button>}
    </Box>
  )
}

export function Progreso({ parte }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ fontSize: 12.5, color: 'text.tertiary', mb: '6px' }}>Parte {parte} de 4 · se guarda al pasar a la siguiente</Box>
      <LinearProgress variant="determinate" value={(parte / 4) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: 'neutral.soft', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} />
    </Box>
  )
}

// Solo para la demo: simula los casos que con la API llegan del servidor (corte de red, enlace vencido).
export function SimularFallas() {
  return (
    <Box sx={{ mt: 5, p: 1.5, border: 1, borderStyle: 'dashed', borderColor: 'divider', borderRadius: 1, fontSize: 12, color: 'text.tertiary' }}>
      <Box sx={{ fontFamily: fuentes.mono, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: 10.5, mb: 0.5 }}>Datos de ejemplo</Box>
      <Button size="small" variant="text" onClick={() => { api.simulacion.proximoGuardadoFalla = true }}>Cortar la red en el próximo guardado</Button>
      <Button size="small" variant="text" onClick={() => { api.simulacion.tokenVencido = true }}>Vencer el enlace</Button>
    </Box>
  )
}
