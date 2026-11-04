import { normalizar, soloDigitos } from '@/utiles/formato'

// Busca por número de caso, nombre de la víctima y DNI de la víctima, sin distinguir mayúsculas
// ni acentos. Si la API no manda nombre o DNI (p. ej. a Consulta), no se busca por ellos.
// Con la API, la búsqueda la hace el servidor.
export function coincideBusqueda(caso, termino) {
  if (!termino) return true
  const { nombre, apellido, dni } = caso.victima ?? {}
  const texto = normalizar([caso.numero, nombre, apellido].join(' '))
  if (texto.includes(normalizar(termino))) return true
  const digitos = soloDigitos(termino)
  return Boolean(dni && digitos && dni.includes(digitos))
}
