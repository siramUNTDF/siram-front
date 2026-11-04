import { useState } from 'react'
import { Outlet } from 'react-router'
import { Box, Drawer, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import BarraSuperior from './BarraSuperior'
import MenuLateral from './MenuLateral'
import { cascara } from '@/tema/tokens'
import { navegacionPara } from '@/navegacion'
import { api, useApi, useSesion } from '@/mocks'

const { alturaBarra, anchoMenu, anchoMenuColapsado } = cascara
const transicion = 'width .5s ease, left .5s ease'

// Cantidades del menú: las mismas listas de trabajo a las que lleva cada ítem.
function calcularContadores() {
  return {
    duplicado: api.listaDeTrabajo('duplicado').length,
    incompleto: api.listaDeTrabajo('incompleto').length,
    solicitudes: api.listarSolicitudes().filter((s) => s.estado === 'pendiente').length,
  }
}

// Barra y menú quedan clavados; el contenido es la única zona que scrollea.
// En teléfono (< 900 px) el menú se abre como cajón desde la hamburguesa.
export default function Cascara() {
  const theme = useTheme()
  const esTelefono = useMediaQuery(theme.breakpoints.down('md'))
  const [colapsado, setColapsado] = useState(false)
  const [cajonAbierto, setCajonAbierto] = useState(false)
  const sesion = useSesion()
  const { datos: contadores } = useApi(calcularContadores)
  const items = navegacionPara(sesion.permisos)

  const anchoActual = colapsado ? anchoMenuColapsado : anchoMenu

  function alternarMenu() {
    if (esTelefono) setCajonAbierto((v) => !v)
    else setColapsado((v) => !v)
  }

  const etiquetaMenu = esTelefono
    ? cajonAbierto ? 'Cerrar menú' : 'Abrir menú'
    : colapsado ? 'Expandir menú' : 'Contraer menú'

  return (
    <>
      <BarraSuperior usuario={sesion} onAlternarMenu={alternarMenu} etiquetaMenu={etiquetaMenu} />

      {esTelefono ? (
        <Drawer
          open={cajonAbierto}
          onClose={() => setCajonAbierto(false)}
          sx={{
            top: alturaBarra,
            '& .MuiBackdrop-root': { top: alturaBarra },
            '& .MuiDrawer-paper': {
              top: alturaBarra,
              height: `calc(100% - ${alturaBarra}px)`,
              width: anchoMenu,
              bgcolor: 'background.chrome',
              borderRight: 1,
              borderColor: 'divider',
              boxShadow: 'none',
            },
          }}
        >
          <Box component="nav" aria-label="Navegación principal" sx={{ height: '100%' }}>
            <MenuLateral items={items} contadores={contadores} onNavegar={() => setCajonAbierto(false)} />
          </Box>
        </Drawer>
      ) : (
        <Box
          component="nav"
          aria-label="Navegación principal"
          sx={{
            position: 'fixed',
            top: alturaBarra,
            left: 0,
            bottom: 0,
            width: anchoActual,
            bgcolor: 'background.chrome',
            borderRight: 1,
            borderColor: 'divider',
            overflowY: 'auto',
            overflowX: 'hidden',
            zIndex: 20,
            transition: transicion,
          }}
        >
          <MenuLateral items={items} colapsado={colapsado} contadores={contadores} onExpandir={() => setColapsado(false)} />
        </Box>
      )}

      <Box
        component="main"
        sx={{
          position: 'fixed',
          top: alturaBarra,
          left: esTelefono ? 0 : anchoActual,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          bgcolor: 'background.default',
          transition: transicion,
        }}
      >
        <Box sx={{ p: { xs: '20px 16px 28px', sm: '24px 20px 32px', md: '28px 32px 40px' } }}>
          <Outlet />
        </Box>
      </Box>
    </>
  )
}
