// Criterios de los chips de la Bandeja, sobre las marcas y el estado que llegan de la API.
// Son los mismos que usa el servidor para las listas de trabajo y los contadores del menú.

// Las listas de trabajo solo muestran casos vigentes (RN-28).
export function esVigente(caso) {
  return caso.estado !== 'desestimado' && caso.estado !== 'unificado'
}

const vigenteConMarca = (marca) => (caso) => esVigente(caso) && caso.marcas.includes(marca)

export const criterios = {
  incompleto: vigenteConMarca('incompleto'),
  duplicado: vigenteConMarca('duplicado'),
  enSeguimiento: (caso) => caso.estado === 'en_seguimiento',
  // Un grave finalizado conserva la marca, pero ya no pide atención: solo registrados y en seguimiento.
  grave: (caso) => caso.marcas.includes('grave') && (caso.estado === 'registrado' || caso.estado === 'en_seguimiento'),
}
