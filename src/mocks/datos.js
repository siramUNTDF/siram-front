// Datos de ejemplo: la historia común de las fichas de docs/vistas/, al 25/09/2026.
// No son definitivos: la forma real la define la API del backend. Lo que una ficha no fija
// está marcado como «provisorio».
//
// Esto es lo que guardaría el servidor (casos, personas, animales…). Las pantallas no lo leen
// directo: lo piden a ./servidor.js, que arma cada respuesta como la mandaría la API.

export const hoy = '2026-09-25'

// ─── Personas: una por DNI ───────────────────────────────────────────────────────────────
export const personas = [
  { id: 16, nombre: 'Micaela', apellido: 'Sosa', dni: '58412336', telefono: null, correo: null, domicilio: 'Kuanip 1240, Ushuaia', ultimaModificacion: { fecha: '2026-09-12T14:50', por: 'J. Benitez' } },
  { id: 17, nombre: 'Carla', apellido: 'Sosa', dni: '32114887', telefono: '2901-54-8820', correo: null, domicilio: 'Kuanip 1240, Ushuaia', ultimaModificacion: { fecha: '2026-09-12T16:10', por: 'H. Quiroga' } },
  { id: 18, nombre: 'Raúl', apellido: 'Benítez', dni: '25300114', telefono: '2901-55-0101', correo: null, domicilio: 'Kuanip 1260, Ushuaia', ultimaModificacion: { fecha: '2026-09-12T15:04', por: 'H. Quiroga' } },
  { id: 19, nombre: 'Ramiro', apellido: 'Beltrán', dni: '30556981', telefono: '2901-44-1290', correo: 'ramiro.beltran@correo.com', domicilio: 'Gobernador Paz 845, Ushuaia', ultimaModificacion: { fecha: '2026-09-12T18:02', por: 'H. Quiroga' } },
  { id: 20, nombre: 'Tomás', apellido: 'Ibarra', dni: '17885203', telefono: '2901-48-3321', correo: null, domicilio: 'San Martín 820, Ushuaia', ultimaModificacion: { fecha: '2026-09-13T08:30', por: 'D. Marchisoney' } },
  { id: 21, nombre: 'Lucía', apellido: 'Ferreyra', dni: '35201447', telefono: '2964-41-7781', correo: 'lucia.ferreyra@correo.com', domicilio: 'Perito Moreno 320, Río Grande', ultimaModificacion: { fecha: '2026-09-12T16:40', por: 'M. Acosta' } },
  // Esperando contacto: no tiene ni teléfono ni correo.
  { id: 22, nombre: 'Tomás', apellido: 'Aguirre', dni: '24903318', telefono: null, correo: null, domicilio: null, ultimaModificacion: { fecha: '2026-09-11T10:15', por: 'C. Ledesma' } },
  { id: 23, nombre: 'Joaquín', apellido: 'Ojeda', dni: '54107762', telefono: null, correo: null, domicilio: 'San Martín 1502, Río Grande', ultimaModificacion: { fecha: '2026-09-10T12:00', por: 'H. Quiroga' } },
  { id: 24, nombre: 'Valentina', apellido: 'Núñez', dni: '56330914', telefono: null, correo: null, domicilio: 'Karukinká 540, Tolhuin', ultimaModificacion: { fecha: '2026-09-08T09:40', por: 'H. Quiroga' } },
  { id: 25, nombre: 'Héctor', apellido: 'Maldonado', dni: '16447025', telefono: null, correo: null, domicilio: null, ultimaModificacion: { fecha: '2026-09-02T15:20', por: 'D. Marchisoney' } },
  // Contactos responsables provisorios de casos de menores.
  { id: 26, nombre: 'Andrea', apellido: 'Núñez', dni: '31877402', telefono: '2901-47-2203', correo: null, domicilio: 'Karukinká 540, Tolhuin', ultimaModificacion: { fecha: '2026-08-28T10:00', por: 'H. Quiroga' } },
]

// ─── Animales: la identidad (especie y chip). Lo que se supo de cada uno vive en cada caso ─
export const animales = [
  { id: 41, especie: 'perro', chip: '900123456789012', vigente: true, absorbidoPor: null, absorbio: [{ id: 58, fecha: '2026-09-13' }], registrado: '2026-09-12T15:02' },
  { id: 42, especie: 'perro', chip: null, vigente: true, absorbidoPor: null, absorbio: [], registrado: '2026-09-12T15:04' },
  { id: 43, especie: 'perro', chip: '900554210337001', vigente: true, absorbidoPor: null, absorbio: [], registrado: '2026-09-04T09:10' },
  { id: 44, especie: 'gato', chip: null, vigente: true, absorbidoPor: null, absorbio: [], registrado: '2026-09-11T08:00' },
  { id: 45, especie: 'perro', chip: null, vigente: true, absorbidoPor: null, absorbio: [], registrado: '2026-09-11T10:30' },
  { id: 46, especie: 'perro', chip: null, vigente: true, absorbidoPor: null, absorbio: [], registrado: '2026-09-01T11:00' },
  { id: 47, especie: 'perro', chip: null, vigente: true, absorbidoPor: null, absorbio: [], registrado: '2026-09-06T13:00' },
  { id: 48, especie: 'perro', chip: null, vigente: true, absorbidoPor: null, absorbio: [], registrado: '2026-08-27T18:00' },
  { id: 49, especie: 'perro', chip: null, vigente: true, absorbidoPor: null, absorbio: [], registrado: '2026-08-23T09:00' },
  // El perro sin chip que cargó Salud en C-2026-0402: Zoonosis lo reconcilió con el 41 el 13/09.
  { id: 58, especie: 'perro', chip: null, vigente: false, absorbidoPor: 41, absorbio: [], registrado: '2026-09-12T14:50' },
]

// ─── Coincidencias por DNI de la víctima (posibles duplicados) ───────────────────────────
export const coincidencias = [
  { id: 7, casos: ['C-2026-0402', 'C-2026-0418'], estado: 'pendiente', observacion: null },
  // C-2026-0411 se consolidó en C-2026-0408.
  { id: 5, casos: ['C-2026-0408', 'C-2026-0411'], estado: 'consolidada', observacion: null },
]

const sinDia10 = { valor: 'pendiente', fecha: null, por: null }
const vacio = { tamano: null, sexo: null, edadAparente: null, color: null, raza: null, podriaReconocerlo: null }

// Animal tal como se supo en un caso.
function enCaso(animal, extra = {}) {
  return {
    animal,
    tenencia: null,
    dueno: null,
    zona: null,
    vacunado: null,
    descripcion: { ...vacio },
    dia10: { ...sinDia10 },
    observaciones: null,
    declaradoEnSolicitud: null,
    fotos: [],
    ...extra,
  }
}

// ─── Casos ───────────────────────────────────────────────────────────────────────────────
// Las marcas no se guardan: las calcula el servidor (ver servidor.js), como lo hará la API.
export const casos = [
  {
    numero: 'C-2026-0418',
    estado: 'registrado', motivoEspera: null, unificadoEn: null, motivoDesestimacion: null, observacionDesestimacion: null,
    canalOrigen: 'zoonosis',
    registro: { organismo: 'Zoonosis Ushuaia', por: 'H. Quiroga', fecha: '2026-09-12T15:02' },
    victima: { persona: 16, edad: 7 },
    contactoResponsable: { persona: 17 },
    fechaHecho: '2026-09-12', horaHecho: '14:20',
    lugar: { ciudad: 'Ushuaia', direccion: 'Kuanip 1240', referencias: 'Frente a la plaza, casa de rejas verdes', latitud: -54.8069, longitud: -68.3073 },
    tipoLugar: null,
    tipoEvento: 'Ataque con mordedura',
    animales: [
      enCaso(41, {
        tenencia: 'ajeno_conocido', dueno: 18, zona: 'Kuanip al 1200', vacunado: 'no_sabe',
        descripcion: { tamano: 'mediano', sexo: 'macho', edadAparente: 'adulto', color: 'Negro con manchas blancas', raza: 'Mestizo', podriaReconocerlo: 'si' },
        dia10: { valor: 'sin_novedad', fecha: '2026-09-22', por: 'H. Quiroga' },
        observaciones: 'Está dentro de un terreno con acceso limitado.',
        declaradoEnSolicitud: { solicitud: 'S-2026-0031', dueno: 'Raúl, vecino de Kuanip 1260 · 2901-55-0101' },
        fotos: [{ nombre: 'perro-01.jpg', url: 'https://archivos.ejemplo.org/siram/perro-01.jpg' }, { nombre: 'perro-02.jpg', url: 'https://archivos.ejemplo.org/siram/perro-02.jpg' }],
      }),
      enCaso(42, {
        tenencia: 'ajeno_desconocido',
        descripcion: { tamano: 'grande', sexo: 'no_sabe', edadAparente: 'adulto', color: 'Marrón', raza: null, podriaReconocerlo: 'no_sabe' },
        dia10: { valor: 'no_ubicado', fecha: '2026-09-22', por: 'H. Quiroga' },
        observaciones: 'Se recorrió la zona dos veces sin ubicarlo.',
      }),
    ],
    tratamiento: { organismo: 'Hospital Regional Ushuaia', por: 'R. Iraola', cargadoEl: '2026-09-13T09:12', fechaConsulta: '2026-09-12', zonaCuerpo: 'piernas', gravedad: 'herida_superficial', antirrabica: true, antitetanica: true, antibiotico: true, sutura: false, observaciones: 'Se indicó el esquema antirrábico; control en 72 h.' },
    denuncias: [{ id: 1, numero: 'ZU-2026-1180', fecha: '2026-09-12', estado: 'confirmada', dniDenunciante: '32114887', observaciones: 'Se presentó la madre con el certificado médico.', anotadaPor: 'H. Quiroga', anotadaEn: '2026-09-12T15:05' }],
    declarado: { hizoDenuncia: 'si', motivoNoDenuncia: null, solicitudes: [{ numero: 'S-2026-0031', sumadaEl: '2026-09-12T15:10' }] },
    documentos: [{ nombre: 'certificado-medico.pdf', url: 'https://archivos.ejemplo.org/siram/certificado-medico.pdf', cargadoPor: 'Zoonosis Ushuaia', fecha: '2026-09-13T10:00' }],
  },
  {
    numero: 'C-2026-0421',
    estado: 'en_seguimiento', motivoEspera: 'respuesta', unificadoEn: null, motivoDesestimacion: null, observacionDesestimacion: null,
    canalOrigen: 'salud',
    registro: { organismo: 'Hospital Regional Ushuaia', por: 'R. Iraola', fecha: '2026-09-04T09:10' },
    victima: { persona: 20, edad: 52 },
    contactoResponsable: null,
    fechaHecho: '2026-09-03', horaHecho: '19:30',
    lugar: { ciudad: 'Ushuaia', direccion: 'San Martín 820', referencias: null, latitud: -54.8079, longitud: -68.3051 },
    tipoLugar: 'via_publica',
    tipoEvento: 'Ataque con mordedura',
    animales: [
      enCaso(43, {
        tenencia: 'propio', zona: 'San Martín al 800', vacunado: 'no',
        descripcion: { tamano: 'grande', sexo: 'hembra', edadAparente: 'adulto', color: 'Atigrado', raza: null, podriaReconocerlo: 'si' },
        dia10: { valor: 'murio_o_enfermo', fecha: '2026-09-13', por: 'D. Marchisoney' },
        observaciones: 'Presentó síntomas compatibles; se tomó muestra.',
      }),
    ],
    tratamiento: { organismo: 'Hospital Regional Ushuaia', por: 'R. Iraola', cargadoEl: '2026-09-04T09:20', fechaConsulta: '2026-09-03', zonaCuerpo: 'manos', gravedad: 'herida_profunda', antirrabica: true, antitetanica: true, antibiotico: true, sutura: true, observaciones: null },
    denuncias: [],
    declarado: { hizoDenuncia: null, motivoNoDenuncia: null, solicitudes: [] },
    documentos: [],
  },
  {
    numero: 'C-2026-0402',
    estado: 'registrado', motivoEspera: null, unificadoEn: null, motivoDesestimacion: null, observacionDesestimacion: null,
    canalOrigen: 'salud',
    registro: { organismo: 'Hospital Regional Ushuaia', por: 'J. Benitez', fecha: '2026-09-12T14:50' },
    victima: { persona: 16, edad: 7 },
    contactoResponsable: { persona: 17 },
    // Provisorio: mismo día que C-2026-0418, otra hora y otra dirección (posibles-duplicados.md).
    fechaHecho: '2026-09-12', horaHecho: '14:00',
    lugar: { ciudad: 'Ushuaia', direccion: 'Kuanip 1200', referencias: null, latitud: -54.8072, longitud: -68.3060 },
    tipoLugar: 'via_publica',
    tipoEvento: 'Ataque con mordedura',
    animales: [
      // Vino del animal absorbido (58). Tenencia, dueño y descripción los cargó Zoonosis al reconciliar.
      enCaso(41, {
        tenencia: 'ajeno_conocido', dueno: 18,
        descripcion: { tamano: 'mediano', sexo: 'macho', edadAparente: 'adulto', color: 'Negro', raza: null, podriaReconocerlo: null },
        vinoDeAbsorbido: true,
      }),
    ],
    tratamiento: null,
    denuncias: [],
    declarado: { hizoDenuncia: null, motivoNoDenuncia: null, solicitudes: [] },
    documentos: [],
  },
  {
    numero: 'C-2026-0417',
    estado: 'en_seguimiento', motivoEspera: 'certificado', unificadoEn: null, motivoDesestimacion: null, observacionDesestimacion: null,
    canalOrigen: 'zoonosis',
    registro: { organismo: 'Zoonosis Ushuaia', por: 'H. Quiroga', fecha: '2026-09-11T10:30' },
    victima: { persona: 19, edad: 34 },
    contactoResponsable: null,
    fechaHecho: '2026-09-11', horaHecho: '09:05',
    lugar: { ciudad: 'Ushuaia', direccion: 'Gobernador Paz 845', referencias: null, latitud: -54.8051, longitud: -68.3092 },
    tipoLugar: 'via_publica',
    tipoEvento: 'Ataque con mordedura',
    animales: [enCaso(45, { tenencia: 'ajeno_desconocido', vacunado: 'no_sabe', descripcion: { ...vacio, tamano: 'grande', color: 'Negro' } })],
    tratamiento: null,
    denuncias: [],
    declarado: { hizoDenuncia: null, motivoNoDenuncia: null, solicitudes: [] },
    documentos: [],
  },
  {
    numero: 'C-2026-0420',
    estado: 'registrado', motivoEspera: null, unificadoEn: null, motivoDesestimacion: null, observacionDesestimacion: null,
    canalOrigen: 'ciudadano',
    registro: { organismo: 'CADIC', por: 'M. Acosta', fecha: '2026-09-11T08:00' },
    victima: { persona: 21, edad: 29 },
    contactoResponsable: null,
    fechaHecho: '2026-09-10', horaHecho: '18:40',
    lugar: { ciudad: 'Río Grande', direccion: 'Perito Moreno 320', referencias: null, latitud: -53.7890, longitud: -67.7020 },
    tipoLugar: 'casa_ajena',
    tipoEvento: 'Lesión compatible',
    animales: [enCaso(44, { tenencia: 'ajeno_conocido', vacunado: 'si', descripcion: { ...vacio, tamano: 'chico', sexo: 'macho', color: 'Gris' }, dia10: { valor: 'sin_novedad', fecha: '2026-09-20', por: 'H. Quiroga' } })],
    tratamiento: null,
    denuncias: [],
    declarado: { hizoDenuncia: 'no', motivoNoDenuncia: 'animal_propio_o_conocido', solicitudes: [{ numero: 'S-2026-0033', registradaEl: '2026-09-11T08:00' }] },
    documentos: [],
  },
  {
    numero: 'C-2026-0404',
    estado: 'en_seguimiento', motivoEspera: 'contacto', unificadoEn: null, motivoDesestimacion: null, observacionDesestimacion: null,
    canalOrigen: 'salud',
    registro: { organismo: 'Hospital Regional RG', por: 'C. Paz', fecha: '2026-09-01T11:00' },
    victima: { persona: 22, edad: 45 },
    contactoResponsable: null,
    fechaHecho: '2026-09-01', horaHecho: '08:30',
    // Sin ubicación en el mapa (el pin no se marcó).
    lugar: { ciudad: 'Río Grande', direccion: 'Alem 2190', referencias: null, latitud: null, longitud: null },
    tipoLugar: null,
    tipoEvento: 'Intento sin lesión',
    animales: [enCaso(46)],
    tratamiento: null,
    denuncias: [],
    declarado: { hizoDenuncia: null, motivoNoDenuncia: null, solicitudes: [] },
    documentos: [],
  },
  {
    numero: 'C-2026-0411',
    estado: 'unificado', motivoEspera: null, unificadoEn: 'C-2026-0408', motivoDesestimacion: null, observacionDesestimacion: null,
    canalOrigen: 'cadic',
    registro: { organismo: 'CADIC', por: 'M. Acosta', fecha: '2026-09-07T10:00' },
    victima: { persona: 23, edad: 12 },
    contactoResponsable: { persona: 17 },
    fechaHecho: '2026-09-06', horaHecho: '11:15',
    lugar: { ciudad: 'Río Grande', direccion: 'San Martín 1502', referencias: null, latitud: -53.7861, longitud: -67.7105 },
    tipoLugar: 'via_publica',
    tipoEvento: 'Ataque con mordedura',
    animales: [enCaso(47)],
    tratamiento: null,
    denuncias: [],
    declarado: { hizoDenuncia: null, motivoNoDenuncia: null, solicitudes: [] },
    documentos: [],
  },
  {
    // Provisorio: la ficha fija víctima, organismo (Hospital Regional RG) y que es vigente.
    numero: 'C-2026-0408',
    estado: 'registrado', motivoEspera: null, unificadoEn: null, motivoDesestimacion: null, observacionDesestimacion: null,
    canalOrigen: 'salud',
    registro: { organismo: 'Hospital Regional RG', por: 'C. Paz', fecha: '2026-09-06T13:00' },
    victima: { persona: 23, edad: 12 },
    contactoResponsable: null,
    fechaHecho: '2026-09-06', horaHecho: '11:15',
    lugar: { ciudad: 'Río Grande', direccion: 'San Martín 1502', referencias: null, latitud: -53.7861, longitud: -67.7105 },
    tipoLugar: 'via_publica',
    tipoEvento: 'Ataque con mordedura',
    animales: [enCaso(47)],
    tratamiento: { organismo: 'Hospital Regional RG', por: 'C. Paz', cargadoEl: '2026-09-06T13:10', fechaConsulta: '2026-09-06', zonaCuerpo: 'piernas', gravedad: 'excoriacion', antirrabica: true, antitetanica: false, antibiotico: false, sutura: false, observaciones: null },
    denuncias: [],
    declarado: { hizoDenuncia: null, motivoNoDenuncia: null, solicitudes: [] },
    documentos: [],
  },
  {
    numero: 'C-2026-0398',
    estado: 'finalizado', motivoEspera: null, unificadoEn: null, motivoDesestimacion: null, observacionDesestimacion: null,
    canalOrigen: 'zoonosis',
    registro: { organismo: 'Zoonosis Ushuaia', por: 'H. Quiroga', fecha: '2026-08-28T10:00' },
    victima: { persona: 24, edad: 8 },
    contactoResponsable: { persona: 26 },
    fechaHecho: '2026-08-27', horaHecho: '16:55',
    lugar: { ciudad: 'Tolhuin', direccion: 'Karukinká 540', referencias: null, latitud: -54.5108, longitud: -67.1955 },
    tipoLugar: 'espacio_publico',
    tipoEvento: 'Lesión derivada',
    animales: [enCaso(48, { tenencia: 'ajeno_desconocido', dia10: { valor: 'no_ubicado', fecha: '2026-09-06', por: 'H. Quiroga' } })],
    tratamiento: null,
    denuncias: [],
    declarado: { hizoDenuncia: null, motivoNoDenuncia: null, solicitudes: [] },
    documentos: [],
  },
  {
    numero: 'C-2026-0393',
    estado: 'desestimado', motivoEspera: null, unificadoEn: null, motivoDesestimacion: 'Hecho no verificable', observacionDesestimacion: null,
    canalOrigen: 'historico',
    registro: { organismo: 'Zoonosis Ushuaia', por: 'D. Marchisoney', fecha: '2026-08-23T09:00' },
    victima: { persona: 25, edad: 52 },
    contactoResponsable: null,
    fechaHecho: '2026-08-22', horaHecho: '13:25',
    lugar: { ciudad: 'Ushuaia', direccion: 'Rivadavia 610', referencias: null, latitud: -54.8020, longitud: -68.3150 },
    tipoLugar: null,
    tipoEvento: 'Lesión compatible',
    animales: [enCaso(49)],
    tratamiento: null,
    denuncias: [],
    declarado: { hizoDenuncia: null, motivoNoDenuncia: null, solicitudes: [] },
    documentos: [],
  },
]

// ─── Historial de cada caso (del más viejo al más nuevo; el servidor lo ordena) ───────────
const quiroga = { por: 'H. Quiroga', organismo: 'Zoonosis Ushuaia' }
const sistema = { por: null, organismo: null }

export const historial = {
  'C-2026-0418': [
    { fecha: '2026-09-12T15:02', orden: 1, ...quiroga, tipo: 'creacion', sobre: 'caso', frase: 'Registró el caso.', cambios: [{ campo: 'Canal de origen', antes: null, despues: 'Zoonosis' }] },
    { fecha: '2026-09-12T15:02', orden: 2, ...sistema, tipo: 'modificacion', sobre: 'caso', frase: 'Avisó una coincidencia con C-2026-0402: mismo DNI de la víctima.', cambios: [] },
    { fecha: '2026-09-12T15:03', ...quiroga, tipo: 'modificacion', sobre: 'caso', frase: 'Editó el caso.', cambios: [{ campo: 'Edad de la víctima', antes: null, despues: '7' }, { campo: 'Ciudad', antes: null, despues: 'Ushuaia' }, { campo: 'Dirección', antes: null, despues: 'Kuanip 1240' }, { campo: 'Tipo de evento', antes: null, despues: 'Ataque con mordedura' }] },
    { fecha: '2026-09-12T15:04', orden: 1, ...quiroga, tipo: 'modificacion', sobre: 'animal', frase: 'Completó el animal 1 (chip 900 123 456 789 012).', cambios: [{ campo: 'Chip', antes: null, despues: '900 123 456 789 012' }, { campo: 'Dueño', antes: null, despues: 'Raúl Benítez' }, { campo: 'Tenencia', antes: null, despues: 'Ajeno conocido' }] },
    { fecha: '2026-09-12T15:04', orden: 2, ...quiroga, tipo: 'creacion', sobre: 'animal', frase: 'Agregó el animal 2 (perro, sin chip, ajeno desconocido).', cambios: [{ campo: 'Animal 2', antes: null, despues: 'creación' }] },
    { fecha: '2026-09-12T15:05', ...quiroga, tipo: 'creacion', sobre: 'denuncia', frase: 'Anotó la denuncia ZU-2026-1180.', cambios: [{ campo: 'Estado de la denuncia', antes: null, despues: 'Confirmada' }] },
    { fecha: '2026-09-12T15:10', ...quiroga, tipo: 'modificacion', sobre: 'solicitud', frase: 'Sumó la solicitud S-2026-0031 al caso.', cambios: [{ campo: '¿Hizo denuncia? (lo declaró la persona)', antes: null, despues: 'Sí' }, { campo: 'Animal 1 · color', antes: null, despues: 'Negro' }, { campo: 'Domicilio de la víctima', antes: null, despues: 'Kuanip 1240, Ushuaia' }] },
    { fecha: '2026-09-12T15:47', ...quiroga, tipo: 'modificacion', sobre: 'animal', frase: 'Editó el animal 1 (chip 900 123 456 789 012) en este caso.', cambios: [{ campo: 'Color', antes: 'Negro', despues: 'Negro con manchas blancas' }] },
    { fecha: '2026-09-12T16:10', ...quiroga, tipo: 'modificacion', sobre: 'persona', frase: 'Editó a Carla Sosa (contacto responsable).', desde: 'Consultas › Personas', cambios: [{ campo: 'Domicilio', antes: null, despues: 'Kuanip 1240, Ushuaia' }] },
    { fecha: '2026-09-13T09:12', por: 'R. Iraola', organismo: 'Hospital Regional Ushuaia', tipo: 'creacion', sobre: 'tratamiento', frase: 'Cargó el tratamiento del caso.', cambios: [{ campo: 'Tratamiento', antes: null, despues: 'consulta 12/09/2026 · antirrábica Sí · antitetánica Sí · antibiótico Sí · sutura No' }] },
    { fecha: '2026-09-13T10:00', ...quiroga, tipo: 'creacion', sobre: 'documento', frase: 'Adjuntó el certificado médico.', cambios: [{ campo: 'Documento', antes: null, despues: 'certificado-medico.pdf' }] },
    { fecha: '2026-09-22T10:12', ...quiroga, tipo: 'modificacion', sobre: 'animal', frase: 'Cargó la observación del día 10 del animal 1 (chip 900 123 456 789 012) en este caso.', cambios: [{ campo: 'Observación del día 10', antes: 'Pendiente', despues: 'Sin novedad' }] },
    { fecha: '2026-09-22T10:15', ...quiroga, tipo: 'modificacion', sobre: 'animal', frase: 'Cargó la observación del día 10 del animal 2 (sin chip) en este caso.', cambios: [{ campo: 'Observación del día 10', antes: 'Pendiente', despues: 'No se ubicó' }] },
  ],
  // Provisorio: del resto de los casos solo se fijó la última modificación (bandeja.md).
  'C-2026-0421': [
    { fecha: '2026-09-04T09:10', por: 'R. Iraola', organismo: 'Hospital Regional Ushuaia', tipo: 'creacion', sobre: 'caso', frase: 'Registró el caso.', cambios: [{ campo: 'Canal de origen', antes: null, despues: 'Salud' }] },
    { fecha: '2026-09-04T09:20', por: 'R. Iraola', organismo: 'Hospital Regional Ushuaia', tipo: 'creacion', sobre: 'tratamiento', frase: 'Cargó el tratamiento del caso.', cambios: [{ campo: 'Tratamiento', antes: null, despues: 'consulta 03/09/2026 · antirrábica Sí · antitetánica Sí · antibiótico Sí · sutura Sí' }] },
    { fecha: '2026-09-13T08:20', por: 'D. Marchisoney', organismo: 'Zoonosis Ushuaia', tipo: 'modificacion', sobre: 'animal', frase: 'Cargó la observación del día 10 del animal 1 (chip 900 554 210 337 001) en este caso.', cambios: [{ campo: 'Observación del día 10', antes: 'Pendiente', despues: 'Murió o enfermó' }] },
    { fecha: '2026-09-13T08:30', por: 'D. Marchisoney', organismo: 'Zoonosis Ushuaia', tipo: 'modificacion', sobre: 'caso', frase: 'Cambió el estado del caso.', cambios: [{ campo: 'Estado', antes: 'Registrado', despues: 'En seguimiento' }, { campo: 'Motivo de espera', antes: null, despues: 'Esperando respuesta' }] },
  ],
  'C-2026-0402': [
    { fecha: '2026-09-12T14:50', por: 'J. Benitez', organismo: 'Hospital Regional Ushuaia', tipo: 'creacion', sobre: 'caso', frase: 'Registró el caso.', cambios: [{ campo: 'Canal de origen', antes: null, despues: 'Salud' }] },
    { fecha: '2026-09-12T15:02', ...sistema, tipo: 'modificacion', sobre: 'caso', frase: 'Avisó una coincidencia con C-2026-0418: mismo DNI de la víctima.', cambios: [] },
    { fecha: '2026-09-13T11:20', ...quiroga, tipo: 'baja_logica', sobre: 'animal', frase: 'Reconcilió el animal 1 con el perro chip 900 123 456 789 012: el animal sin chip quedó absorbido.', cambios: [{ campo: 'Animal 1', antes: 'Perro, sin chip', despues: 'Perro, chip 900 123 456 789 012' }, { campo: 'Tenencia', antes: null, despues: 'Ajeno conocido' }, { campo: 'Dueño', antes: null, despues: 'Raúl Benítez' }] },
  ],
  'C-2026-0417': [
    { fecha: '2026-09-11T10:30', ...quiroga, tipo: 'creacion', sobre: 'caso', frase: 'Registró el caso.', cambios: [{ campo: 'Canal de origen', antes: null, despues: 'Zoonosis' }] },
    { fecha: '2026-09-12T18:02', ...quiroga, tipo: 'modificacion', sobre: 'caso', frase: 'Cambió el estado del caso.', cambios: [{ campo: 'Estado', antes: 'Registrado', despues: 'En seguimiento' }, { campo: 'Motivo de espera', antes: null, despues: 'Esperando certificado' }] },
  ],
  'C-2026-0420': [
    { fecha: '2026-09-11T08:00', por: 'M. Acosta', organismo: 'CADIC', tipo: 'creacion', sobre: 'solicitud', frase: 'Registró la solicitud S-2026-0033 como caso nuevo.', cambios: [{ campo: 'Canal de origen', antes: null, despues: 'Ciudadano' }] },
    { fecha: '2026-09-12T16:40', por: 'M. Acosta', organismo: 'CADIC', tipo: 'modificacion', sobre: 'caso', frase: 'Editó el caso.', cambios: [{ campo: 'Tipo de lugar', antes: null, despues: 'Casa ajena' }] },
  ],
  'C-2026-0404': [
    { fecha: '2026-09-01T11:00', por: 'C. Paz', organismo: 'Hospital Regional RG', tipo: 'creacion', sobre: 'caso', frase: 'Registró el caso.', cambios: [{ campo: 'Canal de origen', antes: null, despues: 'Salud' }] },
    { fecha: '2026-09-11T10:15', por: 'C. Ledesma', organismo: 'Hospital Regional RG', tipo: 'modificacion', sobre: 'caso', frase: 'Cambió el estado del caso.', cambios: [{ campo: 'Estado', antes: 'Registrado', despues: 'En seguimiento' }, { campo: 'Motivo de espera', antes: null, despues: 'Esperando contacto' }] },
  ],
  'C-2026-0411': [
    { fecha: '2026-09-07T10:00', por: 'M. Acosta', organismo: 'CADIC', tipo: 'creacion', sobre: 'caso', frase: 'Registró el caso.', cambios: [{ campo: 'Canal de origen', antes: null, despues: 'CADIC' }] },
    { fecha: '2026-09-10T12:00', ...quiroga, tipo: 'modificacion', sobre: 'caso', frase: 'Consolidó el caso en C-2026-0408.', cambios: [{ campo: 'Estado', antes: 'Registrado', despues: 'Unificado en otro caso' }] },
  ],
  'C-2026-0408': [
    { fecha: '2026-09-06T13:00', por: 'C. Paz', organismo: 'Hospital Regional RG', tipo: 'creacion', sobre: 'caso', frase: 'Registró el caso.', cambios: [{ campo: 'Canal de origen', antes: null, despues: 'Salud' }] },
    { fecha: '2026-09-06T13:10', por: 'C. Paz', organismo: 'Hospital Regional RG', tipo: 'creacion', sobre: 'tratamiento', frase: 'Cargó el tratamiento del caso.', cambios: [{ campo: 'Tratamiento', antes: null, despues: 'consulta 06/09/2026 · antirrábica Sí' }] },
    { fecha: '2026-09-10T12:00', ...quiroga, tipo: 'modificacion', sobre: 'caso', frase: 'Absorbió a C-2026-0411 al consolidar el posible duplicado.', cambios: [] },
  ],
  'C-2026-0398': [
    { fecha: '2026-08-28T10:00', ...quiroga, tipo: 'creacion', sobre: 'caso', frase: 'Registró el caso.', cambios: [{ campo: 'Canal de origen', antes: null, despues: 'Zoonosis' }] },
    { fecha: '2026-09-06T09:00', ...quiroga, tipo: 'modificacion', sobre: 'animal', frase: 'Cargó la observación del día 10 del animal 1 (sin chip) en este caso.', cambios: [{ campo: 'Observación del día 10', antes: 'Pendiente', despues: 'No se ubicó' }] },
    { fecha: '2026-09-08T09:40', ...quiroga, tipo: 'modificacion', sobre: 'caso', frase: 'Cambió el estado del caso.', cambios: [{ campo: 'Estado', antes: 'Registrado', despues: 'Finalizado' }] },
  ],
  'C-2026-0393': [
    { fecha: '2026-08-23T09:00', por: 'D. Marchisoney', organismo: 'Zoonosis Ushuaia', tipo: 'creacion', sobre: 'caso', frase: 'Cargó el registro histórico.', cambios: [{ campo: 'Canal de origen', antes: null, despues: 'Histórico' }] },
    { fecha: '2026-09-02T15:20', por: 'D. Marchisoney', organismo: 'Zoonosis Ushuaia', tipo: 'modificacion', sobre: 'caso', frase: 'Desestimó el caso.', cambios: [{ campo: 'Estado', antes: 'Registrado', despues: 'Desestimado' }, { campo: 'Motivo', antes: null, despues: 'Hecho no verificable' }] },
  ],
}

// ─── Solicitudes del formulario público ──────────────────────────────────────────────────
const animalSolicitud = (extra) => ({
  especie: 'perro', deQuienEs: null, duenoDeclarado: null, tieneChip: null, chip: null, zona: null, vacunado: null,
  podriaReconocerlo: null, tamano: null, sexo: null, edadAparente: null, color: null, raza: null, fotos: [], ...extra,
})

export const solicitudes = [
  {
    numero: 'S-2026-0031', estado: 'registrada', enviada: '2026-09-12T14:50',
    resuelta: { fecha: '2026-09-12T15:10', por: 'H. Quiroga' }, caso: 'C-2026-0418',
    informaLaVictima: false,
    quienInforma: { nombre: 'Carla', apellido: 'Sosa', dni: '32114887', telefono: '2901-54-8820', correo: 'carla.sosa@correo.com' },
    victima: { nombre: 'Micaela', apellido: 'Sosa', dni: '58412336', edad: 7, domicilio: 'Kuanip 1240, Ushuaia' },
    hecho: { fechaHecho: '2026-09-12', horaHecho: null, ciudad: 'ushuaia', direccion: null, referencias: null, tipoLugar: null, quePaso: 'mordedura', cantidadAnimales: 1 },
    animales: [animalSolicitud({ deQuienEs: 'ajeno_conocido', duenoDeclarado: 'Raúl, vecino de Kuanip 1260 · 2901-55-0101', color: 'Negro' })],
    denuncia: { hizoDenuncia: 'si', motivoNoDenuncia: null },
    seccionesCompletas: 2,
  },
  {
    numero: 'S-2026-0033', estado: 'registrada', enviada: '2026-09-10T21:15',
    resuelta: { fecha: '2026-09-11T08:00', por: 'M. Acosta' }, caso: 'C-2026-0420',
    informaLaVictima: true,
    quienInforma: { nombre: 'Lucía', apellido: 'Ferreyra', dni: '35201447', telefono: '2964-41-7781', correo: 'lucia.ferreyra@correo.com' },
    victima: null,
    hecho: { fechaHecho: '2026-09-10', horaHecho: '18:40', ciudad: 'rio_grande', direccion: 'Perito Moreno 320', referencias: null, tipoLugar: null, quePaso: 'aranazo', cantidadAnimales: 1 },
    animales: [animalSolicitud({ especie: 'gato', deQuienEs: 'ajeno_conocido', tamano: 'chico', color: 'Gris' })],
    denuncia: { hizoDenuncia: 'no', motivoNoDenuncia: 'animal_propio_o_conocido' },
    seccionesCompletas: 4,
  },
  {
    numero: 'S-2026-0034', estado: 'pendiente', enviada: '2026-09-13T21:40', resuelta: null, caso: null,
    informaLaVictima: false,
    quienInforma: { nombre: 'Carla', apellido: 'Sosa', dni: '32114887', telefono: '2901-54-8820', correo: 'carla.sosa@correo.com' },
    victima: { nombre: 'Micaela', apellido: 'Sosa', dni: '58412336', edad: 7, domicilio: 'Kuanip 1240, Ushuaia' },
    hecho: { fechaHecho: '2026-09-12', horaHecho: '14:20', ciudad: 'ushuaia', direccion: 'Kuanip 1240', referencias: 'Frente a la plaza, casa de rejas verdes', tipoLugar: 'via_publica', quePaso: 'mordedura', cantidadAnimales: 2, latitud: -54.8069, longitud: -68.3073 },
    animales: [
      animalSolicitud({
        deQuienEs: 'ajeno_conocido', duenoDeclarado: 'Raúl, vecino de Kuanip 1260 · Tel. 2901-55-0101', zona: 'Kuanip al 1200', vacunado: 'no_sabe',
        podriaReconocerlo: 'si', tamano: 'mediano', sexo: 'macho', edadAparente: 'adulto', color: 'Negro con manchas blancas', raza: 'Mestizo',
        fotos: [{ nombre: 'perro-01.jpg', tamano: '1,2 MB', url: 'https://archivos.ejemplo.org/siram/perro-01.jpg' }],
      }),
      animalSolicitud({ deQuienEs: 'ajeno_desconocido', podriaReconocerlo: 'no_sabe', tamano: 'grande', sexo: 'no_sabe', edadAparente: 'adulto', color: 'Marrón' }),
    ],
    // Los animales de la solicitud ya vienen emparejados con los del caso (pendiente en la ficha).
    emparejamiento: { 'C-2026-0418': [0, 1] },
    denuncia: { hizoDenuncia: 'no', motivoNoDenuncia: 'no_sabia_donde' },
    seccionesCompletas: 4,
  },
  {
    numero: 'S-2026-0035', estado: 'pendiente', enviada: '2026-09-14T08:12', resuelta: null, caso: null,
    informaLaVictima: true,
    quienInforma: { nombre: 'Lucía', apellido: 'Paz', dni: '40221908', telefono: '2901-50-4412', correo: 'lucia.paz@correo.com' },
    victima: null,
    hecho: { fechaHecho: '2026-09-13', horaHecho: null, ciudad: 'ushuaia', direccion: null, referencias: null, tipoLugar: null, quePaso: null, cantidadAnimales: null },
    animales: [animalSolicitud({ especie: 'gato' })],
    denuncia: { hizoDenuncia: null, motivoNoDenuncia: null },
    seccionesCompletas: 0,
  },
  {
    numero: 'S-2026-0036', estado: 'pendiente', enviada: '2026-09-14T10:47', resuelta: null, caso: null,
    informaLaVictima: true,
    quienInforma: { nombre: 'Pedro', apellido: 'Gómez', dni: '28904551', telefono: '2964-45-9031', correo: 'pedro.gomez@correo.com' },
    victima: null,
    hecho: { fechaHecho: '2026-09-14', horaHecho: '07:50', ciudad: 'rio_grande', direccion: 'Belgrano 455', referencias: 'Parada del colectivo', tipoLugar: 'via_publica', quePaso: 'mordedura', cantidadAnimales: 1 },
    animales: [animalSolicitud({})],
    denuncia: { hizoDenuncia: null, motivoNoDenuncia: null },
    seccionesCompletas: 2,
  },
  {
    numero: 'S-2026-0032', estado: 'descartada', enviada: '2026-09-13T23:05',
    resuelta: { fecha: '2026-09-14T09:30', por: 'H. Quiroga' }, caso: null,
    informaLaVictima: true,
    quienInforma: { nombre: 'Prueba', apellido: 'Prueba', dni: '11111111', telefono: '1111111', correo: 'prueba@correo.com' },
    victima: null,
    hecho: { fechaHecho: '2026-09-13', horaHecho: null, ciudad: 'tolhuin', direccion: null, referencias: null, tipoLugar: null, quePaso: null, cantidadAnimales: null },
    animales: [animalSolicitud({})],
    denuncia: { hizoDenuncia: null, motivoNoDenuncia: null },
    seccionesCompletas: 0,
  },
]

// ─── Administración ──────────────────────────────────────────────────────────────────────
export const organismos = [
  { id: 1, nombre: 'Zoonosis Ushuaia', tipo: 'zoonosis', activo: true, usuariosActivos: 6, casosVigentes: 54 },
  { id: 2, nombre: 'Hospital Regional RG', tipo: 'salud', activo: true, usuariosActivos: 4, casosVigentes: 34 },
  { id: 3, nombre: 'Hospital Regional Ushuaia', tipo: 'salud', activo: true, usuariosActivos: 4, casosVigentes: 24 },
  { id: 4, nombre: 'CADIC', tipo: 'cadic', activo: true, usuariosActivos: 2, casosVigentes: 9 },
  { id: 5, nombre: 'CAPS 3', tipo: 'salud', activo: true, usuariosActivos: 1, casosVigentes: 3 },
  { id: 6, nombre: 'CAPS 5', tipo: 'salud', activo: true, usuariosActivos: 1, casosVigentes: 2 },
  { id: 7, nombre: 'CAPS 4', tipo: 'salud', activo: true, usuariosActivos: 1, casosVigentes: 1 },
]

const usuario = (id, nombre, apellido, rol, organismo, ultimoAcceso, extra = {}) => ({
  id, nombre: `${nombre} ${apellido}`,
  correo: `${nombre}.${apellido}`.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s/g, '') + '@ejemplo.org',
  rol, organismo, activo: true, ultimoAcceso, alta: '2026-08-20', desactivado: null, ...extra,
})

export const usuarios = [
  usuario(1, 'Antonella', 'Valle', 'administrador', null, '2026-09-24T11:20', { alta: '2026-08-01' }),
  usuario(2, 'Carolina', 'Paz', 'agente', 2, '2026-09-12T16:40'),
  usuario(3, 'Daniela', 'Marchisoney', 'agente', 1, '2026-09-13T08:30'),
  usuario(4, 'Dario', 'Cabrera', 'analista', null, '2026-09-08T10:12'),
  usuario(5, 'Gabriel', 'Sanchez', 'agente', 5, '2026-09-11T09:30'),
  usuario(6, 'Hernan', 'Quiroga', 'agente', 1, '2026-09-22T10:15'),
  usuario(7, 'Jorge', 'Benitez', 'agente', 3, '2026-09-12T14:50'),
  usuario(8, 'Lucia', 'Godoy', 'analista', null, '2026-09-05T14:20'),
  usuario(9, 'Martin', 'Acosta', 'agente', 4, '2026-09-12T16:40'),
  usuario(10, 'Paula', 'Iriarte', 'agente', 1, null, { alta: '2026-09-10' }),
  usuario(11, 'Ricardo', 'Iraola', 'agente', 3, '2026-09-13T09:12'),
  usuario(12, 'Romina', 'Duarte', 'agente', 6, '2026-07-02T11:03', { activo: false, desactivado: { fecha: '2026-09-02', por: 'A. Valle (administración)' } }),
]

export const tiposEvento = [
  { id: 1, nombre: 'Ataque con mordedura', descripcion: 'El animal mordió a la persona.', activo: true, casosVigentes: 98 },
  { id: 2, nombre: 'Lesión compatible', descripcion: 'Lesión compatible con un ataque, sin certeza de mordedura (por ejemplo, un arañazo).', activo: true, casosVigentes: 15 },
  { id: 3, nombre: 'Intento sin lesión', descripcion: 'El animal atacó o intentó atacar sin lastimar a la persona.', activo: true, casosVigentes: 9 },
  { id: 4, nombre: 'Lesión derivada', descripcion: 'La persona se lastimó por el ataque sin que el animal la tocara; por ejemplo, al caerse huyendo.', activo: true, casosVigentes: 5 },
]

// ─── Cifras agregadas (las calcula la API; inicio.md y estadisticas.md) ──────────────────
// Las series que las fichas no fijan son provisorias, inventadas para que sumen lo mismo.
export const panorama = {
  datosAl: '2026-09-25',
  pendientes: { incompletos: 23, esperandoContacto: 17, graves: 1, solicitudesPendientes: 3, posiblesDuplicados: 8, enSeguimiento: 41 },
  anio: 2026,
  totalVigentes: 127,
  casosPorMes: [
    { mes: '2026-01', casos: 13 }, { mes: '2026-02', casos: 13 }, { mes: '2026-03', casos: 11 },
    { mes: '2026-04', casos: 9 }, { mes: '2026-05', casos: 8 }, { mes: '2026-06', casos: 8 },
    { mes: '2026-07', casos: 11 }, { mes: '2026-08', casos: 22 },
    { mes: '2026-09', casos: 32, parcial: true, proyectado: 38 },
  ],
  zonaDelCuerpo: { conTratamiento: 118, valores: [
    { valor: 'piernas', casos: 41 }, { valor: 'manos', casos: 26 }, { valor: 'brazos', casos: 19 },
    { valor: 'cabeza', casos: 16 }, { valor: 'tronco', casos: 8 }, { valor: 'multiples', casos: 8 },
  ] },
  franjaEtaria: [
    { valor: '0–9', casos: 31 }, { valor: '10–19', casos: 22 }, { valor: '20–39', casos: 34 },
    { valor: '40–59', casos: 26 }, { valor: '60+', casos: 14 },
  ],
  canalOrigen: [
    { valor: 'zoonosis', casos: 41 }, { valor: 'salud', casos: 58 }, { valor: 'cadic', casos: 9 },
    { valor: 'ciudadano', casos: 12 }, { valor: 'historico', casos: 7 },
  ],
  // Solo Estadísticas.
  indicadores: { victimas0a9: 31, viaPublica: 58, animalesVacunaDesconocida: { noSabe: 46, sinDato: 37 }, totalAnimales: 129 },
  diaSemana: [ // provisorio
    { valor: 'Lun', casos: 15 }, { valor: 'Mar', casos: 14 }, { valor: 'Mié', casos: 16 }, { valor: 'Jue', casos: 17 },
    { valor: 'Vie', casos: 18 }, { valor: 'Sáb', casos: 24 }, { valor: 'Dom', casos: 23 },
  ],
  franjaHoraria: [ // provisorio
    { valor: '0–6 h', casos: 6 }, { valor: '6–12 h', casos: 34 }, { valor: '12–18 h', casos: 52 }, { valor: '18–24 h', casos: 35 },
  ],
  ciudad: [ // provisorio
    { valor: 'Ushuaia', casos: 74 }, { valor: 'Río Grande', casos: 45 }, { valor: 'Tolhuin', casos: 8 },
  ],
  tipoDeLugar: [
    { valor: 'via_publica', casos: 58 }, { valor: 'casa_propia', casos: 24 }, { valor: 'casa_ajena', casos: 21 },
    { valor: 'espacio_publico', casos: 13 }, { valor: 'zona_rural', casos: 7 }, { valor: 'sin_dato', casos: 4 },
  ],
  especie: [{ valor: 'perro', casos: 114 }, { valor: 'gato', casos: 15 }],
  tamano: [ // provisorio
    { valor: 'chico', casos: 21 }, { valor: 'mediano', casos: 48 }, { valor: 'grande', casos: 39 },
    { valor: 'no_sabe', casos: 12 }, { valor: 'sin_dato', casos: 9 },
  ],
  tenencia: [
    { valor: 'ajeno_desconocido', casos: 52 }, { valor: 'ajeno_conocido', casos: 22 }, { valor: 'propio', casos: 31 },
    { valor: 'no_sabe', casos: 14 }, { valor: 'sin_dato', casos: 10 },
  ],
  vacunacion: [ // provisorio salvo «no sabe» y «sin dato»
    { valor: 'si', casos: 29 }, { valor: 'no', casos: 17 }, { valor: 'no_sabe', casos: 46 }, { valor: 'sin_dato', casos: 37 },
  ],
  gravedad: { conTratamiento: 118, valores: [
    { valor: 'herida_superficial', casos: 71 }, { valor: 'herida_profunda', casos: 29 },
    { valor: 'excoriacion', casos: 9 }, { valor: 'sin_dato', casos: 9 },
  ] },
  origenRegistro: organismos.map((o) => ({ valor: o.nombre, casos: o.casosVigentes })),
  sinCompletar: [ // provisorio salvo tipo de lugar
    { valor: 'Vacuna del animal', casos: 37 }, { valor: 'Hora', casos: 11 }, { valor: 'Tamaño', casos: 9 }, { valor: 'Tipo de lugar', casos: 4 },
  ],
}

// Bloques de columnas de Exportar, según el rol (exportar.md).
export const bloquesExportar = {
  identificacion: { titulo: 'Identificación y estado', descripcion: 'Número de caso, fecha de registro, organismo, quién lo registró, estado, motivo de espera y marcas', columnas: 7, porDefecto: true },
  hecho: { titulo: 'Hecho', descripcion: 'Fecha, hora, ciudad, dirección, referencias, latitud, longitud y tipo de lugar', columnas: 8, porDefecto: true },
  tipo_evento: { titulo: 'Tipo de evento', descripcion: 'Ataque con mordedura, lesión compatible, intento sin lesión o lesión derivada', columnas: 1, porDefecto: true },
  persona: { titulo: 'Persona', descripcion: 'Solo la edad de la víctima: sin nombre, DNI ni contacto', columnas: 1, porDefecto: true },
  animal: { titulo: 'Animal', descripcion: 'Por animal: especie, chip, tenencia, vacunado, día 10, tamaño, sexo, edad aparente, color, raza y si podría reconocerlo', columnas: 11, porDefecto: true },
  tratamiento: { titulo: 'Tratamiento · Salud', descripcion: 'Fecha de consulta, zona del cuerpo, gravedad, antirrábica, antitetánica, antibiótico y sutura', columnas: 7, porDefecto: true },
  denuncia: { titulo: 'Denuncia', descripcion: 'Lo declarado (¿hizo denuncia? y motivo) y las denuncias anotadas (fecha y estado)', columnas: 4, porDefecto: true },
  documentacion: { titulo: 'Documentación', descripcion: 'Si el caso tiene certificado médico (documento adjunto al caso) y fotos de los animales (adjuntas a cada animal), sin los archivos', columnas: 2, porDefecto: false },
  datos_personales: { titulo: 'Datos personales', descripcion: 'Nombre, DNI, teléfono, correo y domicilio de la persona · Datos protegidos por la Ley 25.326', columnas: 5, porDefecto: false, sensible: true },
}
