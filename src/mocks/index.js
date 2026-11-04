// Único punto de acceso a los datos de ejemplo. Cuando exista la API, las pantallas dejan de
// importar de acá y pasan a consumirla; no deberían tener que cambiar más que eso.
import { useMemo, useSyncExternalStore } from 'react'
import * as servidor from './servidor'

export const api = servidor
export { ErrorApi, ErrorRed, ErrorTokenVencido, perfiles } from './servidor'

// Pide un dato y lo vuelve a pedir cuando algo cambia en el servidor de ejemplo.
// Devuelve { datos, error }: un error de la API (p. ej. un caso que no existe) no rompe la pantalla.
export function useApi(pedido, dependencias = []) {
  const version = useSyncExternalStore(servidor.suscribir, servidor.obtenerVersion)
  const clave = JSON.stringify(dependencias)
  return useMemo(() => {
    try {
      return { datos: pedido(), error: null }
    } catch (error) {
      return { datos: null, error }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, clave])
}

export function useSesion() {
  return useApi(() => servidor.sesion()).datos
}
