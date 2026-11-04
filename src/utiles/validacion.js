import { soloDigitos } from './formato'
import { hoy } from '@/mocks/datos'

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

// La fecha de hoy es la de los datos de ejemplo; con la API, la del servidor.
export function fechaFutura(fecha) {
  return Boolean(fecha) && fecha > hoy
}

export const vacio = (v) => v == null || String(v).trim() === ''
