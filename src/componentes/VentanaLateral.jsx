import { useState } from 'react'
import { Box, Button, Drawer, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Mensaje from './Mensaje'

// Ventana lateral de crear, editar o confirmar: 50 % en escritorio, 100 % en teléfono.
// Cancelar a la izquierda, la acción a la derecha y deshabilitada hasta que haya cambios.
// Cerrar con cambios pregunta antes de descartar.
export default function VentanaLateral({
  abierta, titulo, bajada, children, onCerrar, onGuardar, hayCambios = false, textoGuardar = 'Guardar',
  peligro = false, deshabilitado, error, arriba, pie,
}) {
  const [confirmando, setConfirmando] = useState(false)

  function pedirCierre() {
    if (hayCambios) setConfirmando(true)
    else onCerrar()
  }

  function descartar() {
    setConfirmando(false)
    onCerrar()
  }

  return (
    <Drawer
      anchor="right"
      open={abierta}
      onClose={pedirCierre}
      sx={{
        zIndex: 1300,
        '& .MuiDrawer-paper': {
          width: { xs: '100%', md: '50%' },
          bgcolor: 'background.default',
          boxShadow: (t) => `-4px 0 24px ${t.vars.palette.sombra}`,
        },
      }}
    >
      <Box
        component="form"
        noValidate
        onSubmit={(e) => { e.preventDefault(); onGuardar?.() }}
        sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: '20px 24px', bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h2" component="h2">{titulo}</Typography>
            {bajada && <Typography component="div" sx={{ mt: 0.5, color: 'text.tertiary', fontSize: 14 }}>{bajada}</Typography>}
          </Box>
          <IconButton aria-label="Cerrar" onClick={pedirCierre} sx={{ color: 'text.secondary', mt: '-4px' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Mensaje tipo="error">{error}</Mensaje>}
          {arriba}
          {children}
        </Box>

        <Box sx={{ p: '16px 24px', bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
          {confirmando ? (
            <Mensaje
              tipo="advertencia"
              titulo="¿Descartás los datos cargados?"
              acciones={(
                <>
                  <Button variant="outlined" color="inherit" onClick={() => setConfirmando(false)}>Seguir editando</Button>
                  <Button variant="contained" color="error" onClick={descartar}>Descartar</Button>
                </>
              )}
            />
          ) : (
            <>
              {pie}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button variant="outlined" color="inherit" onClick={pedirCierre} sx={{ borderColor: 'divider' }}>Cancelar</Button>
                {onGuardar && (
                  <Button type="submit" variant="contained" color={peligro ? 'error' : 'primary'} disabled={deshabilitado ?? !hayCambios}>
                    {textoGuardar}
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}
