import { useCallback, useState } from 'react'
import { Box } from '@mui/material'
import Mensaje from './Mensaje'
import { cascara } from '@/tema/tokens'
import { Contexto } from './avisos'


// Avisos arriba a la derecha. Éxito e información se cierran solos; error y advertencia, a mano.
export function ProveedorNotificaciones({ children }) {
  const [avisos, setAvisos] = useState([])
  const quitar = useCallback((id) => setAvisos((lista) => lista.filter((a) => a.id !== id)), [])
  const avisar = useCallback((tipo, texto) => {
    const id = crypto.randomUUID()
    setAvisos((lista) => [...lista, { id, tipo, texto }])
    if (tipo === 'exito' || tipo === 'info') setTimeout(() => quitar(id), 4000)
  }, [quitar])

  return (
    <Contexto.Provider value={avisar}>
      {children}
      <Box
        aria-live="polite"
        sx={{ position: 'fixed', top: cascara.alturaBarra + 12, right: 16, zIndex: 1500, display: 'flex', flexDirection: 'column', gap: 1, width: 'min(380px, calc(100vw - 32px))' }}
      >
        {avisos.map((a) => (
          <Mensaje
            key={a.id}
            tipo={a.tipo}
            onCerrar={() => quitar(a.id)}
            sx={{ boxShadow: (t) => `0 4px 16px ${t.vars.palette.sombra}`, bgcolor: 'background.paper', borderColor: 'divider' }}
          >
            <Box component="span" sx={{ color: 'text.primary' }}>{a.texto}</Box>
          </Mensaje>
        ))}
      </Box>
    </Contexto.Provider>
  )
}
