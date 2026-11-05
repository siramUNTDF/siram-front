import { soloDigitos } from './formato'

export function dniValido(dni) {
  return /^\d{7,8}$/.test(soloDigitos(dni)) && /^[\d.\s]*$/.test(String(dni ?? '').trim())
}

export const mensajeDni = 'El DNI tiene 7 u 8 números'

export function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo ?? '').trim())
}

export function telefonoValido(telefono) {
  return soloDigitos(telefono).length >= 6
}

// 'AAAA-MM-DD' del día real, en hora local (no UTC: a la noche, toISOString ya da mañana).
function hoyReal() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// Compara contra el día real, no contra el «hoy» fijo de los datos de ejemplo (mocks/datos.js),
// para que se pueda cargar la fecha de hoy. Con la API, lo valida también el servidor.
export function fechaFutura(fecha) {
  return Boolean(fecha) && !fechaInvalida(fecha) && fecha > hoyReal()
}

// Lo que entrega CampoFecha cuando la fecha está incompleta o no existe (31/02/2026).
// No se entrega vacío: un campo opcional se guardaría sin la fecha que la persona escribió a medias.
export const FECHA_INVALIDA = 'invalida'
export const mensajeFechaInvalida = 'La fecha no existe o está incompleta'

export function fechaInvalida(fecha) {
  return fecha === FECHA_INVALIDA
}

export const vacio = (v) => v == null || String(v).trim() === ''
