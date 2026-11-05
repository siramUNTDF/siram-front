import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { esES } from '@mui/x-date-pickers/locales'
import { es } from 'date-fns/locale/es'
import TemaProvider from '@/tema/TemaProvider'
import { ProveedorNotificaciones } from '@/componentes/Notificaciones'
import 'leaflet/dist/leaflet.css'
import { router } from '@/rutas'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TemaProvider>
      {/* Campos de fecha: en español y con date-fns; el formato dd/mm/aaaa lo fija cada campo. */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}>
        <ProveedorNotificaciones>
          <RouterProvider router={router} />
        </ProveedorNotificaciones>
      </LocalizationProvider>
    </TemaProvider>
  </StrictMode>,
)
