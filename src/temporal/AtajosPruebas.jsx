// ╔══════════════════════════════════════════════════════════════════════════════════════════╗
// ║  ⚠️  TEMPORAL — SOLO PARA PRUEBAS — ELIMINAR ANTES DE CUALQUIER ENTREGA  ⚠️                 ║
// ║                                                                                          ║
// ║  Atajos entre el formulario público (/reportar) y el panel, para probar a mano el        ║
// ║  recorrido «crear solicitud → revisarla» sin recargar la página. Al recargar, los datos  ║
// ║  de ejemplo (en memoria) se pierden. No son parte del diseño ni de ninguna ficha.        ║
// ║                                                                                          ║
// ║  Para quitarlo: borrar esta carpeta (src/temporal/) y las líneas marcadas con            ║
// ║  TEMPORAL-PRUEBAS. Encontrarlas con:   grep -rn "TEMPORAL-PRUEBAS" src                   ║
// ║  Pedido por el usuario el 2026-11-06.                                                    ║
// ╚══════════════════════════════════════════════════════════════════════════════════════════╝
import { useNavigate } from 'react-router'
import { Box, Button } from '@mui/material'
import { api } from '@/mocks'
import { sesionReporte } from '@/pantallas/publico/sesionReporte'

const estiloTemporal = {
  border: 2,
  borderStyle: 'dashed',
  borderColor: 'warning.main',
  bgcolor: 'warning.soft',
  color: 'text.primary',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  '&:hover': { bgcolor: 'warning.soft', borderColor: 'warning.main', borderStyle: 'solid' },
}

// En la barra del panel: va al formulario público sin recargar.
export function AtajoIrAReportar() {
  const navigate = useNavigate()
  return (
    <Button size="small" onClick={() => navigate('/reportar')} sx={estiloTemporal} title="TEMPORAL, solo para pruebas: eliminar">
      ⚠ PRUEBAS · Ir a /reportar
    </Button>
  )
}

// Flotante en el formulario público: vuelve al panel, a la solicitud recién creada si la hay.
// Pasa al perfil de Zoonosis: es el único que ve las solicitudes (aviso del 2026-11-06).
export function AtajoVolverAlPanel() {
  const navigate = useNavigate()
  const numero = sesionReporte.obtener()?.numero
  function ir() {
    api.cambiarPerfil('zoonosis')
    navigate(numero ? `/casos/solicitudes/${numero}` : '/casos/solicitudes')
  }
  return (
    <Box sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1500 }}>
      <Button
        size="small"
        onClick={ir}
        sx={estiloTemporal}
        title="TEMPORAL, solo para pruebas: eliminar"
      >
        ⚠ PRUEBAS · {numero ? `Ver ${numero} en el panel` : 'Ir a Solicitudes'} (como Zoonosis)
      </Button>
    </Box>
  )
}
