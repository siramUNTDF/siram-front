import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import TemaProvider from '@/tema/TemaProvider'
import { ProveedorNotificaciones } from '@/componentes/Notificaciones'
import 'leaflet/dist/leaflet.css'
import { router } from '@/rutas'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TemaProvider>
      <ProveedorNotificaciones>
        <RouterProvider router={router} />
      </ProveedorNotificaciones>
    </TemaProvider>
  </StrictMode>,
)
