import { useState } from 'react'

// Densidad de filas de las tablas de casos (normal o compacta).
export default function useDensidad() {
  const [densa, setDensa] = useState(false)
  return [densa, () => setDensa((v) => !v)]
}
