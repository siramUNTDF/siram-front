import { useState } from 'react'

function leer(objeto, ruta) {
  return ruta.split('.').reduce((o, k) => (o == null ? undefined : o[k]), objeto)
}

function escribir(objeto, ruta, valor) {
  const [k, ...resto] = ruta.split('.')
  const copia = Array.isArray(objeto) ? [...objeto] : { ...objeto }
  copia[k] = resto.length ? escribir(objeto?.[k] ?? {}, resto.join('.'), valor) : valor
  return copia
}

// Valores de un formulario, con rutas tipo 'victima.dni', y si cambió respecto del inicio.
// Los errores se muestran cuando la persona intentó guardar (o cuando los manda el back).
export default function useFormulario(inicial) {
  const [base, setBase] = useState(inicial)
  const [valores, setValores] = useState(inicial)
  const [errores, setErrores] = useState({})
  const [intentado, setIntentado] = useState(false)

  return {
    valores,
    valor: (ruta) => leer(valores, ruta),
    poner: (ruta, valor) => {
      setValores((v) => escribir(v, ruta, valor))
      setErrores((e) => (e[ruta] ? { ...e, [ruta]: undefined } : e))
    },
    hayCambios: JSON.stringify(valores) !== JSON.stringify(base),
    errores,
    setErrores,
    intentado,
    setIntentado,
    reiniciar: (nuevo = inicial) => {
      setBase(nuevo)
      setValores(nuevo)
      setErrores({})
      setIntentado(false)
    },
  }
}
