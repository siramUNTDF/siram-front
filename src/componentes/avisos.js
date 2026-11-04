import { createContext, useContext } from 'react'

export const Contexto = createContext(() => {})

// avisar(tipo, texto): 'exito' | 'info' | 'advertencia' | 'error'. Ver Notificaciones.jsx.
export function useAvisar() {
  return useContext(Contexto)
}
