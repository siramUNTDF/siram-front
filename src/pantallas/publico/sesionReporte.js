// El token del formulario detallado vive solo en memoria de esta pestaña (RN-32): nunca en la URL,
// ni en localStorage, ni en cookies. Al recargar o cerrar la pestaña se pierde, a propósito.
let actual = null

export const sesionReporte = {
  iniciar(numero, token, especie, ciudad) {
    actual = { numero, token, especie, ciudad, partes: {}, animales: 1 }
  },
  obtener: () => actual,
  guardarLocal(parte, valores) {
    if (actual) actual.partes[parte] = valores
  },
  descartar() {
    actual = null
  },
}
