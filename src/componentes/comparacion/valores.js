import { especies, etiqueta, siNoNoSabe, tamanos, sexos, edadesAparentes, tenencias } from '@/componentes/caso/catalogos'
import { dni, fechaCorta } from '@/utiles/formato'

// Los enumerados llegan en snake_case; acá se muestran con su etiqueta de pantalla.
const porCampo = [
  [/especie$/, (v) => etiqueta(especies, v)],
  [/tamano$/, (v) => etiqueta(tamanos, v)],
  [/sexo$/, (v) => etiqueta(sexos, v)],
  [/edadAparente$/, (v) => etiqueta(edadesAparentes, v)],
  [/tenencia$/, (v) => etiqueta(tenencias, v)],
  [/vacunado$/, (v) => etiqueta(siNoNoSabe, v)],
  [/\.dni$/, (v) => dni(v)],
  [/victima\.edad$/, (v) => `${v} años`],
]

export function mostrarValor(fila, valor) {
  if (valor == null || valor === '') return null
  if (fila.catalogo) return fila.catalogo[valor] ?? valor
  if (fila.tipoDato === 'fecha') return fechaCorta(valor)
  const regla = porCampo.find(([patron]) => patron.test(fila.campo))
  return regla ? regla[1](valor) : String(valor)
}

// Estado de una fila según los dos valores: igual, solo en uno o distinto.
export function estadoFila(izq, der) {
  const vacio = (v) => v == null || v === ''
  if (vacio(izq) && vacio(der)) return 'igual'
  if (vacio(izq)) return 'solo_der'
  if (vacio(der)) return 'solo_izq'
  return String(izq) === String(der) ? 'igual' : 'distinto'
}
