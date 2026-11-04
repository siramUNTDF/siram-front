// Fechas con forma 'AAAA-MM-DD' o 'AAAA-MM-DDTHH:mm' (hora local).
// Se separan a mano para no depender de la zona horaria. Sin fecha, devuelven null.
export function fechaCorta(iso) {
  if (!iso) return null
  const [fecha] = iso.split('T')
  const [a, m, d] = fecha.split('-')
  return `${d}/${m}/${a}`
}

export function hora(iso) {
  return iso?.split('T')[1]?.slice(0, 5) ?? null
}

// 'AAAA-MM-DDTHH:mm' → '22/09/2026 10:15'.
export function fechaHora(iso) {
  if (!iso) return null
  return [fechaCorta(iso), hora(iso)].filter(Boolean).join(' ')
}

const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
export const mesesCortos = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// '2026-09-25' → '25 de septiembre de 2026'.
export function fechaLarga(iso) {
  const [a, m, d] = iso.split('-')
  return `${Number(d)} de ${meses[Number(m) - 1]} de ${a}`
}

// Para buscar sin distinguir mayúsculas ni tildes.
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

// Para buscar un DNI escrito con o sin puntos.
export function soloDigitos(texto) {
  return String(texto ?? '').replace(/\D/g, '')
}

// '58412336' → '58.412.336'.
export function dni(valor) {
  const d = soloDigitos(valor)
  if (!d) return null
  return d.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// '900123456789012' → '900 123 456 789 012'.
export function chip(valor) {
  return valor ? valor.replace(/(\d{3})(?=\d)/g, '$1 ') : null
}

export function nombreCompleto(p) {
  return p ? [p.nombre, p.apellido].filter(Boolean).join(' ') || null : null
}

// «1 caso», «3 casos».
export function plural(n, singular, pluralTexto = `${singular}s`) {
  return `${n} ${n === 1 ? singular : pluralTexto}`
}
