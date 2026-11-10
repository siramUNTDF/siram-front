// Valores de ejemplo (docs/README.md, docs/vistas/*). Los definitivos vienen de la API.
// En los datos van en snake_case; acá está el texto de pantalla.
// En `estados`, `color` es una clave de la paleta del tema; `neutral` es el de "Registrado".

export const estados = {
  registrado: { etiqueta: 'Registrado', color: 'neutral' },
  en_seguimiento: { etiqueta: 'En seguimiento', color: 'warning' },
  finalizado: { etiqueta: 'Finalizado', color: 'success' },
  desestimado: { etiqueta: 'Desestimado', color: 'error' },
  unificado: { etiqueta: 'Unificado en otro caso', color: 'dup' },
}

export const motivosEspera = {
  contacto: 'Esperando contacto',
  respuesta: 'Esperando respuesta',
  certificado: 'Esperando certificado',
}

// El orden de las claves es el orden en que se dibujan las marcas.
export const marcas = {
  incompleto: {
    etiqueta: 'Incompleto',
    descripcion: 'Incompleto: faltan datos obligatorios',
  },
  duplicado: {
    etiqueta: 'Posible duplicado',
    descripcion: 'Posible duplicado: la víctima tiene el mismo DNI que en otro caso vigente',
  },
  grave: {
    etiqueta: 'Grave',
    descripcion: 'Grave: un animal del caso murió o enfermó en la observación',
  },
}

export const canalesOrigen = {
  ciudadano: 'Ciudadano',
  salud: 'Salud',
  zoonosis: 'Zoonosis',
  cadic: 'CADIC',
  historico: 'Histórico',
}

export const especies = { perro: 'Perro', gato: 'Gato' }

export const ciudades = { ushuaia: 'Ushuaia', rio_grande: 'Río Grande', tolhuin: 'Tolhuin' }

export const tiposLugar = {
  casa_propia: 'Casa propia',
  casa_ajena: 'Casa ajena',
  via_publica: 'Vía pública',
  espacio_publico: 'Espacio público',
  zona_rural: 'Zona rural',
  no_sabe: 'No sabe',
}

export const tenencias = {
  propio: 'Propio',
  ajeno_conocido: 'Ajeno conocido',
  ajeno_desconocido: 'Ajeno desconocido',
  no_sabe: 'No sabe',
}

export const siNoNoSabe = { si: 'Sí', no: 'No', no_sabe: 'No sabe' }
export const siNo = { si: 'Sí', no: 'No' }

export const tamanos = { chico: 'Chico', mediano: 'Mediano', grande: 'Grande', no_sabe: 'No sabe' }
export const sexos = { macho: 'Macho', hembra: 'Hembra', no_sabe: 'No sabe' }
export const edadesAparentes = { cachorro: 'Cachorro', adulto: 'Adulto', viejo: 'Viejo', no_sabe: 'No sabe' }

export const dia10 = {
  pendiente: 'Pendiente',
  sin_novedad: 'Sin novedad',
  murio_o_enfermo: 'Murió o enfermó',
  ubicado_sin_acceso: 'Ubicado, sin acceso',
  no_ubicado: 'No se ubicó',
}

export const zonasCuerpo = {
  piernas: 'Piernas', manos: 'Manos', brazos: 'Brazos', cabeza: 'Cabeza', tronco: 'Tronco', multiples: 'Múltiples',
}

export const gravedades = {
  excoriacion: 'Excoriación',
  herida_superficial: 'Herida superficial',
  herida_profunda: 'Herida profunda',
  amputacion: 'Amputación',
}

export const estadosDenuncia = {
  pendiente_confirmacion: 'Pendiente de confirmación',
  confirmada: 'Confirmada',
  desestimada: 'Desestimada',
}

export const motivosDesestimacion = {
  fuera_de_alcance: 'Fuera de alcance (no fue un ataque de perro o gato a una persona)',
  fuera_de_provincia: 'Fuera de la provincia',
  no_verificable: 'Hecho inexistente o no verificable',
  error_de_carga: 'Cargado por error',
}

export const motivosNoDenuncia = {
  animal_propio_o_conocido: 'El animal es propio o conocido',
  no_sabia_donde: 'No sabía dónde denunciar',
  no_sabia_que_habia: 'No sabía que había que denunciar',
  no_tomaron: 'No me tomaron la denuncia',
  economicas: 'Razones económicas',
  no_pasa_nada: 'No pasa nada después con la denuncia',
  otros: 'Otros',
}

// Lo que eligió la persona en el formulario público, y en qué tipo de evento se traduce.
export const quePaso = {
  mordedura: { etiqueta: 'Me mordió', tipoEvento: 'Ataque con mordedura' },
  aranazo: { etiqueta: 'Arañazo', tipoEvento: 'Lesión compatible' },
  intento_sin_lesion: { etiqueta: 'Intentó atacar, sin lastimar', tipoEvento: 'Intento sin lesión' },
  lesion_al_escapar: { etiqueta: 'Se lastimó al escapar', tipoEvento: 'Lesión derivada' },
  no_sabe: { etiqueta: 'No sé', tipoEvento: null },
}

export const deQuienEs = { propio: 'Es mío', ajeno_conocido: 'De alguien que conozco', ajeno_desconocido: 'No sé de quién es' }

export const estadosSolicitud = { pendiente: 'pendiente', registrada: 'registrada', descartada: 'descartada' }

export const roles = { administrador: 'Administrador', agente: 'Agente', analista: 'Consulta' }

export const tiposOrganismo = { salud: 'Salud', zoonosis: 'Zoonosis', cadic: 'CADIC' }

// Texto de pantalla de un enumerado, o el valor tal cual si no está en el catálogo.
export function etiqueta(catalogo, valor) {
  if (valor == null) return null
  const v = catalogo[valor]
  return typeof v === 'object' ? v.etiqueta : v ?? valor
}
