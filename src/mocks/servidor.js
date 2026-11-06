// Servidor de ejemplo: hace de API mientras no exista la del backend.
// Guarda los datos en memoria (se reinician al recargar la página), arma cada respuesta como
// la mandaría la API y aplica lo que en el back aplica el servidor: los recortes de «quién ve
// qué» (narrativa §4, tentativos), las marcas calculadas y las transiciones válidas de estado.
// Las pantallas no deciden nada de esto: muestran lo que les llega.

import * as datos from './datos'
import { motivosEspera, estados, tiposLugar, tenencias, dia10 as valoresDia10, quePaso, ciudades, canalesOrigen } from '@/componentes/caso/catalogos'

const clonar = (x) => structuredClone(x)
const bd = clonar({
  personas: datos.personas,
  animales: datos.animales,
  coincidencias: datos.coincidencias,
  casos: datos.casos,
  historial: datos.historial,
  solicitudes: datos.solicitudes,
  organismos: datos.organismos,
  usuarios: datos.usuarios,
  tiposEvento: datos.tiposEvento,
})

// ─── Suscripción: las pantallas se vuelven a dibujar cuando algo cambia ──────────────────
let version = 0
const oyentes = new Set()
export function suscribir(oyente) {
  oyentes.add(oyente)
  return () => oyentes.delete(oyente)
}
export const obtenerVersion = () => version
function avisar() {
  version += 1
  oyentes.forEach((o) => o())
}

export class ErrorApi extends Error {
  constructor(mensaje, campo = null) {
    super(mensaje)
    this.campo = campo
  }
}

// ─── Sesión (quién mira). Solo para la demo: con la API, el usuario lo da el login ────────
export const perfiles = {
  zoonosis: { nombre: 'Daniela Marchisoney', corto: 'D. Marchisoney', iniciales: 'DM', rol: 'agente', organismo: 'Zoonosis Ushuaia', tipo: 'zoonosis' },
  salud: { nombre: 'Ricardo Iraola', corto: 'R. Iraola', iniciales: 'RI', rol: 'agente', organismo: 'Hospital Regional Ushuaia', tipo: 'salud' },
  cadic: { nombre: 'Martin Acosta', corto: 'M. Acosta', iniciales: 'MA', rol: 'agente', organismo: 'CADIC', tipo: 'cadic' },
  analista: { nombre: 'Dario Cabrera', corto: 'D. Cabrera', iniciales: 'DC', rol: 'analista', organismo: null, tipo: null },
  administrador: { nombre: 'Antonella Valle', corto: 'A. Valle', iniciales: 'AV', rol: 'administrador', organismo: null, tipo: null },
}
let perfilActual = 'zoonosis'
const perfil = () => perfiles[perfilActual]
const esAgente = () => perfil().rol === 'agente'
const tipo = () => perfil().tipo

export function cambiarPerfil(clave) {
  perfilActual = clave
  avisar()
}

const permisosPorRol = {
  agente: ['casos', 'nuevo_caso', 'solicitudes', 'listas_trabajo', 'busqueda', 'personas', 'animales', 'mapa', 'estadisticas', 'exportar'],
  analista: ['casos', 'busqueda', 'animales', 'mapa', 'estadisticas', 'exportar'],
  administrador: ['usuarios', 'organismos', 'tipos_evento'],
}

export function sesion() {
  return { clave: perfilActual, ...perfil(), permisos: permisosPorRol[perfil().rol] }
}

// ─── Utilidades ──────────────────────────────────────────────────────────────────────────
// Los datos son «al 25/09/2026»: lo que se haga en la demo queda con esa fecha y la hora real.
function ahora() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${datos.hoy}T${p(d.getHours())}:${p(d.getMinutes())}`
}
const persona = (id) => bd.personas.find((p) => p.id === id)
const animal = (id) => bd.animales.find((a) => a.id === id)
const buscarCaso = (numero) => {
  const caso = bd.casos.find((c) => c.numero === numero)
  if (!caso) throw new ErrorApi('No existe el caso')
  return caso
}
const vigente = (c) => c.estado !== 'desestimado' && c.estado !== 'unificado'
const quien = () => ({ por: perfil().corto, organismo: perfil().organismo })
const nombre = (p) => (p ? `${p.nombre} ${p.apellido}` : null)
const soloDigitos = (t) => String(t ?? '').replace(/\D/g, '')
const chipLegible = (chip) => chip?.replace(/(\d{3})(?=\d)/g, '$1 ')
const vacioANulo = (v) => (v === '' || v === undefined ? null : v)

function registrar(numero, evento) {
  const lista = (bd.historial[numero] ??= [])
  const mismoMomento = lista.filter((e) => e.fecha === evento.fecha).length
  lista.push({ cambios: [], ...quien(), ...evento, orden: mismoMomento + 1 })
}

function ordenarEventos(lista) {
  return [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha) || (b.orden ?? 0) - (a.orden ?? 0))
}

function ultimaModificacion(numero) {
  const [ultimo] = ordenarEventos(bd.historial[numero] ?? [])
  return ultimo ? { fecha: ultimo.fecha, por: ultimo.por ?? 'Sistema' } : null
}

// ─── Marcas y faltantes: las calcula el servidor ─────────────────────────────────────────
const camposQueCuentan = [
  ['fechaHecho', (c) => c.fechaHecho],
  ['lugar.ciudad', (c) => c.lugar.ciudad],
  ['lugar.direccion', (c) => c.lugar.direccion],
  ['tipoLugar', (c) => c.tipoLugar],
  ['victima.edad', (c) => c.victima.edad],
  ['tipoEvento', (c) => c.tipoEvento],
]

function faltantes(c) {
  return camposQueCuentan.filter(([, valor]) => valor(c) == null).map(([campo]) => campo)
}

function coincidenciaPendiente(numero) {
  return bd.coincidencias.find((x) => x.estado === 'pendiente' && x.casos.includes(numero))
}

// La marca y el aviso de posible duplicado solo cuentan si los dos casos del par están vigentes
// (posibles-duplicados.md, 2026-11-04). Si uno se desestima, la coincidencia sigue pendiente, sin
// decisión, pero no se muestra en ninguno de los dos.
function coincidenciaVigente(numero) {
  const x = coincidenciaPendiente(numero)
  return x && x.casos.every((n) => vigente(buscarCaso(n))) ? x : null
}

function marcas(c) {
  const lista = []
  // Al finalizar deja de contar como incompleto; un desestimado conserva la marca.
  if (faltantes(c).length > 0 && c.estado !== 'finalizado') lista.push('incompleto')
  if (coincidenciaVigente(c.numero)) lista.push('duplicado')
  if (c.animales.some((a) => a.dia10.valor === 'murio_o_enfermo')) lista.push('grave')
  return lista
}

// ─── Recortes por perfil (narrativa §4; los aplica el back) ──────────────────────────────
const ve = {
  datosPersonales: () => esAgente(),
  duenoYChip: () => tipo() === 'zoonosis',
  descripcionYTenencia: () => tipo() !== 'salud',
  dia10: () => esAgente(),
  tratamientoCompleto: () => tipo() === 'salud',
  tratamientoExiste: () => esAgente(),
  denunciasCompletas: () => tipo() === 'zoonosis',
  denunciasExisten: () => esAgente(),
  certificado: () => tipo() === 'salud' || tipo() === 'zoonosis',
  fotos: () => tipo() !== 'salud' && esAgente(),
  historial: () => esAgente(),
}

function victimaVisible(c) {
  const p = persona(c.victima.persona)
  if (!ve.datosPersonales()) return { edad: c.victima.edad }
  return { id: p.id, nombre: p.nombre, apellido: p.apellido, dni: p.dni, edad: c.victima.edad, telefono: p.telefono, correo: p.correo, domicilio: p.domicilio, enCasos: casosDePersona(p.id).length }
}

function casosDePersona(id) {
  return bd.casos.filter((c) => c.victima.persona === id || c.contactoResponsable?.persona === id || c.animales.some((a) => a.dueno === id))
}

function animalesVisibles(c, { resumen = false } = {}) {
  return c.animales.map((a, i) => {
    const identidad = animal(a.animal)
    const salida = { indice: i, id: identidad.id, especie: identidad.especie, zona: a.zona, vacunado: a.vacunado }
    if (resumen) {
      if (ve.descripcionYTenencia()) salida.descripcion = a.descripcion
      return salida
    }
    salida.enCasos = bd.casos.filter((x) => x.animales.some((y) => y.animal === identidad.id)).length
    if (ve.duenoYChip()) {
      salida.chip = identidad.chip
      const d = persona(a.dueno)
      salida.dueno = d ? { id: d.id, nombre: d.nombre, apellido: d.apellido, dni: d.dni } : null
      salida.declaradoEnSolicitud = a.declaradoEnSolicitud
    }
    if (ve.descripcionYTenencia()) {
      salida.tenencia = a.tenencia
      salida.descripcion = a.descripcion
    }
    if (ve.dia10()) {
      salida.dia10 = a.dia10
      salida.observaciones = a.observaciones
    }
    if (ve.fotos()) salida.fotos = a.fotos
    return salida
  })
}

// Fila de las tablas de casos (Bandeja, listas de trabajo, Búsqueda).
function filaCaso(c) {
  const v = victimaVisible(c)
  return {
    numero: c.numero,
    ultimaModificacion: ultimaModificacion(c.numero),
    fechaHecho: c.fechaHecho,
    horaHecho: c.horaHecho,
    victima: ve.datosPersonales() ? { nombre: v.nombre, apellido: v.apellido, edad: v.edad, dni: v.dni } : { edad: v.edad },
    lugar: { direccion: c.lugar.direccion, ciudad: c.lugar.ciudad },
    animales: c.animales.map((a) => ({ especie: animal(a.animal).especie })),
    tipoEvento: c.tipoEvento,
    estado: c.estado,
    motivoEspera: c.motivoEspera,
    unificadoEn: c.unificadoEn,
    motivoDesestimacion: c.motivoDesestimacion,
    animalNoUbicado: c.animales.some((a) => a.dia10.valor === 'no_ubicado'),
    canalOrigen: c.canalOrigen,
    marcas: marcas(c),
    faltantes: faltantes(c),
  }
}

const ordenarPorModificacion = (filas) => filas.sort((a, b) => b.ultimaModificacion.fecha.localeCompare(a.ultimaModificacion.fecha))

function exigirCasos() {
  if (!sesion().permisos.includes('casos')) throw new ErrorApi('No tenés permiso para ver casos')
}

// ─── Casos ───────────────────────────────────────────────────────────────────────────────
export function listarCasos() {
  if (!sesion().permisos.includes('casos')) return []
  return ordenarPorModificacion(bd.casos.map(filaCaso))
}

export function listaDeTrabajo(marca) {
  return listarCasos().filter((c) => vigente(c) && c.marcas.includes(marca))
}

export function transicionesValidas(c) {
  if (c.estado === 'registrado') return ['en_seguimiento', 'finalizado', 'desestimado']
  if (c.estado === 'en_seguimiento') return ['en_seguimiento', 'finalizado', 'desestimado']
  return []
}

function permisosCaso(c) {
  if (!esAgente()) return []
  const lista = ['editar', 'agregar_animal', 'editar_animal']
  // El certificado lo carga Zoonosis; las fotos, quien ve la descripción del animal (no Salud).
  if (tipo() !== 'salud') lista.push('adjuntar_documento')
  if (transicionesValidas(c).length) lista.push('cambiar_estado')
  if (tipo() === 'salud') lista.push('cargar_tratamiento')
  if (tipo() === 'zoonosis') lista.push('anotar_denuncia', 'corregir_denuncia', 'adjuntar_certificado')
  if (duplicadoResoluble(c.numero)) lista.push('resolver_duplicado')
  return lista
}

// RN-36: solo se consolidan casos registrados, en seguimiento o finalizados.
const consolidable = (c) => ['registrado', 'en_seguimiento', 'finalizado'].includes(c.estado)

function duplicadoResoluble(numero) {
  const x = coincidenciaVigente(numero)
  return Boolean(x) && x.casos.every((n) => consolidable(buscarCaso(n)))
}

// Qué campos de un animal puede cargar quien mira (animales.md, ficha-del-caso.md).
function camposAnimal() {
  if (tipo() === 'zoonosis') return ['especie', 'chip', 'tenencia', 'dueno', 'zona', 'vacunado', 'descripcion', 'dia10', 'observaciones', 'fotos']
  if (tipo() === 'cadic') return ['especie', 'zona', 'vacunado', 'descripcion', 'fotos']
  if (tipo() === 'salud') return ['especie', 'zona', 'vacunado']
  return []
}

export function obtenerCaso(numero) {
  exigirCasos()
  const c = buscarCaso(numero)
  const salida = {
    ...filaCaso(c),
    registro: c.registro,
    observacionDesestimacion: c.observacionDesestimacion,
    victima: victimaVisible(c),
    lugar: c.lugar,
    tipoLugar: c.tipoLugar,
    animales: animalesVisibles(c),
    declarado: c.declarado,
    transiciones: transicionesValidas(c),
    permisos: permisosCaso(c),
    camposAnimal: camposAnimal(),
  }
  if (ve.datosPersonales() && c.contactoResponsable) {
    const p = persona(c.contactoResponsable.persona)
    salida.contactoResponsable = { id: p.id, nombre: p.nombre, apellido: p.apellido, dni: p.dni, telefono: p.telefono, correo: p.correo, enCasos: casosDePersona(p.id).length }
  } else if (ve.datosPersonales()) {
    salida.contactoResponsable = null
  }
  const pendiente = coincidenciaVigente(numero)
  if (pendiente) {
    const otro = buscarCaso(pendiente.casos.find((n) => n !== numero))
    salida.coincidencia = { id: pendiente.id, numero: otro.numero, organismo: otro.registro.organismo, registradoEl: otro.registro.fecha }
  }
  if (ve.tratamientoCompleto()) salida.tratamiento = c.tratamiento
  else if (ve.tratamientoExiste()) salida.tratamientoExiste = Boolean(c.tratamiento)
  if (ve.denunciasCompletas()) salida.denuncias = c.denuncias
  else if (ve.denunciasExisten()) salida.denunciasCantidad = c.denuncias.length
  if (ve.certificado()) salida.documentos = c.documentos
  if (ve.historial()) {
    const lista = historialVisible(numero)
    salida.historial = { cambios: lista.length, ultimo: lista[0] ? { fecha: lista[0].fecha, por: lista[0].por ?? 'Sistema', organismo: lista[0].organismo } : null }
  }
  return salida
}

// Personas con el mismo DNI que la víctima en otro caso: «La víctima ya está en un caso».
function casosConVictima(dni) {
  const p = bd.personas.find((x) => x.dni === dni)
  if (!p) return []
  return bd.casos.filter((c) => c.victima.persona === p.id)
}

function personaPorDni(datosPersona) {
  const dni = soloDigitos(datosPersona.dni)
  let p = bd.personas.find((x) => x.dni === dni)
  if (!p) {
    p = { id: Math.max(...bd.personas.map((x) => x.id)) + 1, nombre: datosPersona.nombre, apellido: datosPersona.apellido, dni, telefono: vacioANulo(datosPersona.telefono), correo: vacioANulo(datosPersona.correo), domicilio: vacioANulo(datosPersona.domicilio), ultimaModificacion: { fecha: ahora(), por: perfil().corto } }
    bd.personas.push(p)
  }
  return p
}

let ultimoNumeroCaso = 424
function nuevoNumeroCaso() {
  ultimoNumeroCaso += 1
  return `C-2026-${String(ultimoNumeroCaso).padStart(4, '0')}`
}

function nuevoAnimal(especie) {
  const a = { id: Math.max(...bd.animales.map((x) => x.id)) + 1, especie, chip: null, vigente: true, absorbidoPor: null, absorbio: [], registrado: ahora() }
  bd.animales.push(a)
  return a
}

const animalEnCaso = (id, extra = {}) => ({
  animal: id, tenencia: null, dueno: null, zona: null, vacunado: null,
  descripcion: { tamano: null, sexo: null, edadAparente: null, color: null, raza: null, podriaReconocerlo: null },
  dia10: { valor: 'pendiente', fecha: null, por: null }, observaciones: null, declaradoEnSolicitud: null, fotos: [], ...extra,
})

// Nuevo caso (nuevo-caso.md). Si el DNI de la víctima ya es víctima en otro caso, no crea nada
// todavía: responde la coincidencia, y el front vuelve a mandar con la decisión.
export function crearCaso(form, decision = null) {
  const dni = soloDigitos(form.victima.dni)
  const previos = casosConVictima(dni)
  if (previos.length && !decision) {
    const [c] = [...previos].sort((a, b) => b.registro.fecha.localeCompare(a.registro.fecha))
    return { coincidencia: { numero: c.numero, organismo: c.registro.organismo, fechaHecho: c.fechaHecho } }
  }
  const fecha = ahora()
  const victima = personaPorDni(form.victima)
  const contacto = form.informaLaVictima ? null : personaPorDni(form.contactoResponsable)
  const numero = nuevoNumeroCaso()
  const caso = {
    numero, estado: 'registrado', motivoEspera: null, unificadoEn: null, motivoDesestimacion: null, observacionDesestimacion: null,
    canalOrigen: form.canalOrigen ?? tipo(),
    registro: { organismo: perfil().organismo, por: perfil().corto, fecha },
    victima: { persona: victima.id, edad: vacioANulo(form.victima.edad) },
    contactoResponsable: contacto ? { persona: contacto.id } : null,
    fechaHecho: vacioANulo(form.fechaHecho), horaHecho: vacioANulo(form.horaHecho),
    lugar: { ciudad: null, direccion: null, referencias: null, latitud: null, longitud: null, ...form.lugar },
    tipoLugar: vacioANulo(form.tipoLugar), tipoEvento: vacioANulo(form.tipoEvento),
    animales: form.animales ?? [animalEnCaso(nuevoAnimal(form.especie).id)],
    tratamiento: null, denuncias: [],
    declarado: form.declarado ?? { hizoDenuncia: null, motivoNoDenuncia: null, solicitudes: [] },
    documentos: [],
  }
  bd.casos.push(caso)
  registrar(numero, { fecha, tipo: 'creacion', sobre: form.desdeSolicitud ? 'solicitud' : 'caso', frase: form.desdeSolicitud ? `Registró la solicitud ${form.desdeSolicitud} como caso nuevo.` : 'Registró el caso.', cambios: [{ campo: 'Canal de origen', antes: null, despues: canalesOrigen[caso.canalOrigen] }] })
  if (previos.length) {
    const otro = previos[0].numero
    const estado = decision === 'distintos' ? 'distintos' : 'pendiente'
    bd.coincidencias.push({ id: Math.max(...bd.coincidencias.map((x) => x.id)) + 1, casos: [otro, numero], estado, observacion: null })
    if (estado === 'pendiente') {
      registrar(numero, { fecha, por: null, organismo: null, tipo: 'modificacion', sobre: 'caso', frase: `Avisó una coincidencia con ${otro}: mismo DNI de la víctima.` })
    }
  }
  avisar()
  return { numero }
}

const textoCampo = {
  'victima.nombre': 'Nombre de la víctima', 'victima.apellido': 'Apellido de la víctima', 'victima.dni': 'DNI de la víctima',
  'victima.edad': 'Edad de la víctima', 'victima.telefono': 'Teléfono de la víctima', 'victima.correo': 'Correo de la víctima',
  'victima.domicilio': 'Domicilio de la víctima', fechaHecho: 'Fecha del hecho', horaHecho: 'Hora', 'lugar.ciudad': 'Ciudad',
  'lugar.direccion': 'Dirección', 'lugar.referencias': 'Referencias', tipoLugar: 'Tipo de lugar', tipoEvento: 'Tipo de evento',
}
const mostrar = (campo, v) => {
  if (v == null || v === '') return null
  if (campo === 'tipoLugar') return tiposLugar[v] ?? v
  return String(v)
}

function aplicarPersona(p, cambios, lista, prefijo) {
  for (const campo of ['nombre', 'apellido', 'dni', 'telefono', 'correo', 'domicilio']) {
    if (!(campo in cambios)) continue
    const nuevo = campo === 'dni' ? soloDigitos(cambios[campo]) : vacioANulo(cambios[campo])
    if (nuevo === p[campo]) continue
    if (campo === 'dni') {
      if (!nuevo) throw new ErrorApi('El DNI no se puede vaciar', `${prefijo}.dni`)
      if (bd.personas.some((x) => x.dni === nuevo && x.id !== p.id)) throw new ErrorApi('Ese DNI ya es de otra persona', `${prefijo}.dni`)
    }
    lista.push({ campo: textoCampo[`victima.${campo}`]?.replace('de la víctima', prefijo === 'victima' ? 'de la víctima' : 'del contacto') ?? campo, antes: p[campo], despues: nuevo })
    p[campo] = nuevo
  }
  if (lista.length) p.ultimaModificacion = { fecha: ahora(), por: perfil().corto }
}

// Editar (datos comunes del caso).
export function editarCaso(numero, form) {
  const c = buscarCaso(numero)
  const cambios = []
  aplicarPersona(persona(c.victima.persona), form.victima, cambios, 'victima')
  const edad = vacioANulo(form.victima.edad)
  const edadNum = edad == null ? null : Number(edad)
  if (edadNum !== c.victima.edad) {
    cambios.push({ campo: 'Edad de la víctima', antes: mostrar('', c.victima.edad), despues: mostrar('', edadNum) })
    c.victima.edad = edadNum
  }
  if (form.contactoResponsable === null && c.contactoResponsable) {
    cambios.push({ campo: 'Contacto responsable', antes: nombre(persona(c.contactoResponsable.persona)), despues: null })
    c.contactoResponsable = null
  } else if (form.contactoResponsable) {
    if (c.contactoResponsable) {
      aplicarPersona(persona(c.contactoResponsable.persona), form.contactoResponsable, cambios, 'contacto')
    } else {
      const p = personaPorDni(form.contactoResponsable)
      c.contactoResponsable = { persona: p.id }
      cambios.push({ campo: 'Contacto responsable', antes: null, despues: nombre(p) })
    }
  }
  const simples = [['fechaHecho', (x) => x.fechaHecho, (x, v) => { x.fechaHecho = v }], ['horaHecho', (x) => x.horaHecho, (x, v) => { x.horaHecho = v }],
    ['lugar.ciudad', (x) => x.lugar.ciudad, (x, v) => { x.lugar.ciudad = v }], ['lugar.direccion', (x) => x.lugar.direccion, (x, v) => { x.lugar.direccion = v }],
    ['lugar.referencias', (x) => x.lugar.referencias, (x, v) => { x.lugar.referencias = v }], ['tipoLugar', (x) => x.tipoLugar, (x, v) => { x.tipoLugar = v }],
    ['tipoEvento', (x) => x.tipoEvento, (x, v) => { x.tipoEvento = v }]]
  const enForm = (ruta) => ruta.split('.').reduce((o, k) => o?.[k], form.hecho)
  for (const [campo, leer, escribir] of simples) {
    const nuevo = vacioANulo(enForm(campo))
    if (nuevo !== undefined && nuevo !== leer(c)) {
      cambios.push({ campo: textoCampo[campo], antes: mostrar(campo, leer(c)), despues: mostrar(campo, nuevo) })
      escribir(c, nuevo)
    }
  }
  if (form.hecho.latitud !== undefined && (form.hecho.latitud !== c.lugar.latitud || form.hecho.longitud !== c.lugar.longitud)) {
    cambios.push({ campo: 'Ubicación', antes: c.lugar.latitud == null ? null : `${c.lugar.latitud}, ${c.lugar.longitud}`, despues: form.hecho.latitud == null ? null : `${form.hecho.latitud}, ${form.hecho.longitud}` })
    c.lugar.latitud = form.hecho.latitud
    c.lugar.longitud = form.hecho.longitud
  }
  if (cambios.length) registrar(numero, { fecha: ahora(), tipo: 'modificacion', sobre: 'caso', frase: 'Editó el caso.', cambios })
  avisar()
}

export function cambiarEstado(numero, { estado, motivoEspera }) {
  const c = buscarCaso(numero)
  if (!transicionesValidas(c).includes(estado)) throw new ErrorApi('Ese cambio de estado no es válido')
  if (estado === 'en_seguimiento' && !motivoEspera) throw new ErrorApi('Elegí qué se está esperando', 'motivoEspera')
  const cambios = []
  if (estado !== c.estado) cambios.push({ campo: 'Estado', antes: estados[c.estado].etiqueta, despues: estados[estado].etiqueta })
  const motivo = estado === 'en_seguimiento' ? motivoEspera : null
  if (motivo !== c.motivoEspera) cambios.push({ campo: 'Motivo de espera', antes: motivosEspera[c.motivoEspera] ?? null, despues: motivosEspera[motivo] ?? null })
  c.estado = estado
  c.motivoEspera = motivo
  registrar(numero, { fecha: ahora(), tipo: 'modificacion', sobre: 'caso', frase: 'Cambió el estado del caso.', cambios })
  avisar()
}

export function desestimar(numero, { motivo, observacion }) {
  const c = buscarCaso(numero)
  if (!transicionesValidas(c).includes('desestimado')) throw new ErrorApi('Este caso ya no se puede desestimar')
  registrar(numero, { fecha: ahora(), tipo: 'modificacion', sobre: 'caso', frase: 'Desestimó el caso.', cambios: [{ campo: 'Estado', antes: estados[c.estado].etiqueta, despues: 'Desestimado' }, { campo: 'Motivo', antes: null, despues: motivo }] })
  c.estado = 'desestimado'
  c.motivoEspera = null
  c.motivoDesestimacion = motivo
  c.observacionDesestimacion = vacioANulo(observacion)
  avisar()
}

export function guardarDenuncia(numero, form, id = null) {
  if (tipo() !== 'zoonosis') throw new ErrorApi('Solo Zoonosis anota denuncias')
  const c = buscarCaso(numero)
  const valores = { numero: vacioANulo(form.numero), fecha: form.fecha, estado: form.estado, dniDenunciante: soloDigitos(form.dniDenunciante), observaciones: vacioANulo(form.observaciones) }
  if (id) {
    const d = c.denuncias.find((x) => x.id === id)
    const cambios = Object.entries(valores).filter(([k, v]) => d[k] !== v).map(([k, v]) => ({ campo: k, antes: d[k], despues: v }))
    Object.assign(d, valores)
    registrar(numero, { fecha: ahora(), tipo: 'modificacion', sobre: 'denuncia', frase: `Corrigió la denuncia ${d.numero ?? 'sin número'}.`, cambios })
  } else {
    const fecha = ahora()
    c.denuncias.push({ id: c.denuncias.length + 1, ...valores, anotadaPor: perfil().corto, anotadaEn: fecha })
    registrar(numero, { fecha, tipo: 'creacion', sobre: 'denuncia', frase: `Anotó la denuncia ${valores.numero ?? 'sin número'}.`, cambios: [{ campo: 'Estado de la denuncia', antes: null, despues: form.estadoTexto }] })
  }
  avisar()
}

// Agregar o editar un animal. Solo se aplican los campos que quien mira puede cargar.
export function guardarAnimal(numero, indice, form) {
  const c = buscarCaso(numero)
  const permitidos = camposAnimal()
  const chip = permitidos.includes('chip') ? soloDigitos(form.chip) || null : undefined
  let enCaso = indice == null ? null : c.animales[indice]
  const fecha = ahora()
  if (!enCaso) {
    const existente = chip ? bd.animales.find((a) => a.chip === chip) : null
    if (existente && c.animales.some((a) => a.animal === existente.id)) throw new ErrorApi('Ese chip ya es de un animal de este caso', 'chip')
    const identidad = existente ?? nuevoAnimal(form.especie)
    if (chip && !existente) identidad.chip = chip
    enCaso = animalEnCaso(identidad.id)
    c.animales.push(enCaso)
    registrar(numero, { fecha, tipo: 'creacion', sobre: 'animal', frase: `Agregó el animal ${c.animales.length} (${identidad.especie}, ${identidad.chip ? `chip ${chipLegible(identidad.chip)}` : 'sin chip'}).`, cambios: [{ campo: `Animal ${c.animales.length}`, antes: null, despues: 'creación' }] })
  } else {
    const identidad = animal(enCaso.animal)
    if (chip !== undefined && chip !== identidad.chip) {
      const otro = bd.animales.find((a) => a.chip === chip && a.id !== identidad.id)
      if (otro) {
        const donde = bd.casos.find((x) => x.animales.some((y) => y.animal === otro.id))
        const error = new ErrorApi(`Ese chip ya está en otro animal (${donde?.numero ?? 'sin casos'})`, 'chip')
        error.reconciliar = [identidad.id, otro.id]
        throw error
      }
    }
  }
  const identidad = animal(enCaso.animal)
  const cambios = []
  const poner = (campo, etiquetaCampo, actual, nuevo, escribir, aTexto = (v) => v) => {
    if (nuevo === undefined || nuevo === actual) return
    cambios.push({ campo: etiquetaCampo, antes: aTexto(actual), despues: aTexto(nuevo) })
    escribir(nuevo)
  }
  if (indice != null) {
    poner('especie', 'Especie', identidad.especie, form.especie, (v) => { identidad.especie = v })
    if (chip !== undefined) poner('chip', 'Chip', identidad.chip, chip, (v) => { identidad.chip = v }, chipLegible)
  }
  if (permitidos.includes('tenencia')) poner('tenencia', 'Tenencia', enCaso.tenencia, vacioANulo(form.tenencia), (v) => { enCaso.tenencia = v }, (v) => tenencias[v] ?? v)
  if (permitidos.includes('dueno') && form.dueno) {
    const tiene = form.dueno.dni && soloDigitos(form.dueno.dni)
    const p = tiene ? personaPorDni(form.dueno) : null
    poner('dueno', 'Dueño', enCaso.dueno, p?.id ?? null, (v) => { enCaso.dueno = v }, (v) => nombre(persona(v)))
  }
  if (permitidos.includes('zona')) poner('zona', 'Domicilio o zona', enCaso.zona, vacioANulo(form.zona), (v) => { enCaso.zona = v })
  if (permitidos.includes('vacunado')) poner('vacunado', 'Vacunado contra la rabia', enCaso.vacunado, vacioANulo(form.vacunado), (v) => { enCaso.vacunado = v })
  if (permitidos.includes('descripcion') && form.descripcion) {
    for (const [k, t] of [['tamano', 'Tamaño'], ['sexo', 'Sexo'], ['edadAparente', 'Edad aparente'], ['color', 'Color'], ['raza', 'Raza'], ['podriaReconocerlo', '¿Podría reconocerlo?']]) {
      poner(k, t, enCaso.descripcion[k], vacioANulo(form.descripcion[k]), (v) => { enCaso.descripcion[k] = v })
    }
  }
  if (permitidos.includes('dia10') && form.dia10 && form.dia10 !== enCaso.dia10.valor) {
    cambios.push({ campo: 'Observación del día 10', antes: valoresDia10[enCaso.dia10.valor], despues: valoresDia10[form.dia10] })
    enCaso.dia10 = form.dia10 === 'pendiente' ? { valor: 'pendiente', fecha: null, por: null } : { valor: form.dia10, fecha: datos.hoy, por: perfil().corto }
  }
  if (permitidos.includes('observaciones')) poner('observaciones', 'Observaciones', enCaso.observaciones, vacioANulo(form.observaciones), (v) => { enCaso.observaciones = v })
  if (cambios.length && indice != null) {
    const n = indice + 1
    registrar(numero, { fecha, tipo: 'modificacion', sobre: 'animal', frase: `Editó el animal ${n} (${identidad.chip ? `chip ${chipLegible(identidad.chip)}` : 'sin chip'}) en este caso.`, cambios })
  }
  avisar()
}

export function guardarTratamiento(numero, form) {
  if (tipo() !== 'salud') throw new ErrorApi('Solo Salud carga el tratamiento')
  const c = buscarCaso(numero)
  const nuevo = !c.tratamiento
  c.tratamiento = { organismo: perfil().organismo, por: perfil().corto, cargadoEl: ahora(), ...form }
  const si = (v) => (v ? 'Sí' : 'No')
  registrar(numero, { fecha: ahora(), tipo: nuevo ? 'creacion' : 'modificacion', sobre: 'tratamiento', frase: nuevo ? 'Cargó el tratamiento del caso.' : 'Editó el tratamiento del caso.', cambios: [{ campo: 'Tratamiento', antes: null, despues: `consulta ${form.fechaConsulta.split('-').reverse().join('/')} · antirrábica ${si(form.antirrabica)} · antitetánica ${si(form.antitetanica)} · antibiótico ${si(form.antibiotico)} · sutura ${si(form.sutura)}` }] })
  avisar()
}

export function adjuntarDocumento(numero, { destino, animalIndice, nombre: archivo, url }) {
  const c = buscarCaso(numero)
  const fecha = ahora()
  if (destino === 'caso') {
    c.documentos.push({ nombre: archivo, url, cargadoPor: perfil().organismo, fecha })
    registrar(numero, { fecha, tipo: 'creacion', sobre: 'documento', frase: 'Adjuntó el certificado médico.', cambios: [{ campo: 'Documento', antes: null, despues: archivo }] })
  } else {
    c.animales[animalIndice].fotos.push({ nombre: archivo, url })
    registrar(numero, { fecha, tipo: 'creacion', sobre: 'animal', frase: `Adjuntó una foto del animal ${animalIndice + 1}.`, cambios: [{ campo: 'Foto', antes: null, despues: archivo }] })
  }
  avisar()
}

// Para el aviso de Agregar animal: si el chip ya está en SIRAM, en qué casos aparece.
export function casosConChip(valor) {
  const chip = soloDigitos(valor)
  const a = chip ? bd.animales.find((x) => x.chip === chip) : null
  return a ? bd.casos.filter((c) => c.animales.some((y) => y.animal === a.id)).map((c) => c.numero) : []
}

// ─── Posibles duplicados ─────────────────────────────────────────────────────────────────
export function marcarDistintos(numeroA, numeroB, observacion) {
  const x = bd.coincidencias.find((k) => k.estado === 'pendiente' && k.casos.includes(numeroA) && k.casos.includes(numeroB))
  if (!x) throw new ErrorApi('Este posible duplicado ya fue resuelto por otra persona')
  x.estado = 'distintos'
  x.observacion = vacioANulo(observacion)
  const fecha = ahora()
  for (const n of x.casos) {
    const otro = x.casos.find((m) => m !== n)
    registrar(n, { fecha, tipo: 'modificacion', sobre: 'caso', frase: `Marcó que no es duplicado de ${otro}: son casos distintos.`, cambios: observacion ? [{ campo: 'Observación', antes: null, despues: observacion }] : [] })
  }
  avisar()
}

const filasComparacion = [
  { grupo: 'Persona afectada', campo: 'victima.nombre', etiqueta: 'Nombre y apellido', codigo: 'P1', leer: (c) => nombre(persona(c.victima.persona)) },
  { grupo: 'Persona afectada', campo: 'victima.edad', etiqueta: 'Edad', codigo: 'P2', leer: (c) => c.victima.edad, aplicar: (c, v) => { c.victima.edad = v } },
  { grupo: 'Persona afectada', campo: 'victima.dni', etiqueta: 'DNI', codigo: 'P6', mono: true, leer: (c) => persona(c.victima.persona).dni },
  { grupo: 'Persona afectada', campo: 'victima.telefono', etiqueta: 'Teléfono', codigo: 'P4', mono: true, leer: (c) => persona(c.victima.persona).telefono },
  { grupo: 'Persona afectada', campo: 'victima.correo', etiqueta: 'Correo', codigo: 'P3', leer: (c) => persona(c.victima.persona).correo },
  { grupo: 'Hecho', campo: 'fechaHecho', etiqueta: 'Fecha del hecho', codigo: 'H1', tipoDato: 'fecha', leer: (c) => c.fechaHecho, aplicar: (c, v) => { c.fechaHecho = v } },
  { grupo: 'Hecho', campo: 'horaHecho', etiqueta: 'Hora', codigo: 'H2', mono: true, leer: (c) => c.horaHecho, aplicar: (c, v) => { c.horaHecho = v } },
  { grupo: 'Hecho', campo: 'lugar.direccion', etiqueta: 'Lugar', codigo: 'H4', leer: (c) => c.lugar.direccion, aplicar: (c, v) => { c.lugar.direccion = v } },
  { grupo: 'Hecho', campo: 'tipoLugar', etiqueta: 'Tipo de lugar', codigo: 'H5', catalogo: tiposLugar, leer: (c) => c.tipoLugar, aplicar: (c, v) => { c.tipoLugar = v } },
  { grupo: 'Animal', campo: 'animal.especie', etiqueta: 'Especie', codigo: 'A1', leer: (c) => animal(c.animales[0].animal).especie },
  { grupo: 'Animal', campo: 'animal.tamano', etiqueta: 'Tamaño', codigo: 'A2', descripcion: true, leer: (c) => c.animales[0].descripcion.tamano, aplicar: (c, v) => { c.animales[0].descripcion.tamano = v } },
  { grupo: 'Animal', campo: 'animal.color', etiqueta: 'Color', codigo: 'A13', descripcion: true, leer: (c) => c.animales[0].descripcion.color, aplicar: (c, v) => { c.animales[0].descripcion.color = v } },
  { grupo: 'Tipo de evento', campo: 'tipoEvento', etiqueta: 'Tipo de evento', codigo: 'T1', leer: (c) => c.tipoEvento, aplicar: (c, v) => { c.tipoEvento = v } },
]

export function comparar(numeroA, numeroB) {
  const a = buscarCaso(numeroA)
  const b = buscarCaso(numeroB)
  const x = bd.coincidencias.find((k) => k.casos.includes(numeroA) && k.casos.includes(numeroB))
  const cabecera = (c) => ({ numero: c.numero, organismo: c.registro.organismo, estado: c.estado, registrado: c.registro.fecha })
  const noConsolidable = [a, b].find((c) => !consolidable(c))
  return {
    coincidencia: x ? { id: x.id, estado: x.estado } : null,
    // Qué desenlaces se ofrecen: lo decide el servidor (RN-36), no el front.
    acciones: x?.estado === 'pendiente' && esAgente() && !noConsolidable ? ['consolidar', 'marcar_distintos'] : [],
    noConsolidable: x?.estado === 'pendiente' && noConsolidable ? { numero: noConsolidable.numero, estado: estados[noConsolidable.estado].etiqueta } : null,
    a: cabecera(a),
    b: cabecera(b),
    dni: persona(a.victima.persona).dni,
    filas: filasComparacion
      .filter((f) => !f.descripcion || ve.descripcionYTenencia())
      .map((f) => ({ grupo: f.grupo, campo: f.campo, etiqueta: f.etiqueta, codigo: f.codigo, mono: f.mono, tipoDato: f.tipoDato, catalogo: f.catalogo, a: f.leer(a) ?? null, b: f.leer(b) ?? null })),
  }
}

export function consolidar(numeroA, numeroB, elecciones) {
  const a = buscarCaso(numeroA)
  const b = buscarCaso(numeroB)
  const x = bd.coincidencias.find((k) => k.estado === 'pendiente' && k.casos.includes(numeroA) && k.casos.includes(numeroB))
  if (!x) throw new ErrorApi('Este posible duplicado ya fue resuelto por otra persona')
  const otro = [a, b].find((c) => !consolidable(c))
  if (otro) throw new ErrorApi(`No se puede consolidar: ${otro.numero} está ${estados[otro.estado].etiqueta.toLowerCase()}. Solo se consolidan casos registrados, en seguimiento o finalizados.`)
  const cambios = []
  for (const f of filasComparacion) {
    if (!f.aplicar) continue
    const va = f.leer(a)
    const vb = f.leer(b)
    // Solo en B: se conserva el que lo tiene. Distintos: el elegido (por defecto, A).
    const usarB = (va == null && vb != null) || (va != null && vb != null && va !== vb && elecciones[f.campo] === 'b')
    if (usarB) {
      cambios.push({ campo: f.etiqueta, antes: f.catalogo ? f.catalogo[va] ?? va : va, despues: f.catalogo ? f.catalogo[vb] ?? vb : vb })
      f.aplicar(a, vb)
    }
  }
  x.estado = 'consolidada'
  const estadoAnterior = estados[b.estado].etiqueta
  b.estado = 'unificado'
  b.motivoEspera = null
  b.unificadoEn = numeroA
  const fecha = ahora()
  registrar(numeroA, { fecha, tipo: 'modificacion', sobre: 'caso', frase: `Consolidó ${numeroB} en este caso.`, cambios })
  registrar(numeroB, { fecha, tipo: 'modificacion', sobre: 'caso', frase: `Se consolidó en ${numeroA}.`, cambios: [{ campo: 'Estado', antes: estadoAnterior, despues: 'Unificado en otro caso' }] })
  avisar()
}

// ─── Historial ───────────────────────────────────────────────────────────────────────────
const camposOcultos = () => {
  if (tipo() === 'salud') return ['Chip', 'Dueño', 'Tenencia', 'Color', 'Tamaño', 'Sexo', 'Raza', 'Edad aparente', 'Animal 1 · color', 'Foto']
  if (tipo() === 'cadic') return ['Chip', 'Dueño']
  return []
}

// Lo que la ficha muestra solo como «existe» (tratamiento, denuncias) llega sin detalle: queda que
// alguien lo cargó o lo modificó, sin los valores ni el número de denuncia.
function recortarEvento(e) {
  const accion = e.tipo === 'creacion' ? 'Cargó' : 'Modificó'
  if (e.sobre === 'tratamiento' && !ve.tratamientoCompleto()) return ve.tratamientoExiste() ? { ...e, frase: `${accion} el tratamiento del caso.`, cambios: [] } : null
  if (e.sobre === 'denuncia' && !ve.denunciasCompletas()) {
    return ve.denunciasExisten() ? { ...e, frase: e.tipo === 'creacion' ? 'Anotó una denuncia.' : 'Corrigió una denuncia.', cambios: [] } : null
  }
  // Los documentos del caso son el certificado médico: los ve quien ve el certificado en la ficha.
  if (e.sobre === 'documento' && !ve.certificado()) return null
  const ocultos = camposOcultos()
  const visibles = e.cambios.filter((x) => !ocultos.includes(x.campo))
  // Un cambio sin ningún campo visible no se muestra (historial.md).
  if (e.cambios.length > 0 && visibles.length === 0) return null
  return { ...e, cambios: visibles }
}

function historialVisible(numero) {
  return ordenarEventos(bd.historial[numero] ?? []).map(recortarEvento).filter(Boolean)
}

export function historialCaso(numero) {
  exigirCasos()
  if (!ve.historial()) throw new ErrorApi('No tenés permiso para ver el historial')
  return { numero, eventos: historialVisible(numero) }
}

// ─── Solicitudes ─────────────────────────────────────────────────────────────────────────
const buscarSolicitud = (numero) => {
  const s = bd.solicitudes.find((x) => x.numero === numero)
  if (!s) throw new ErrorApi('No existe la solicitud')
  return s
}

function coincidenciasDeSolicitud(s) {
  const dni = s.informaLaVictima ? s.quienInforma.dni : s.victima.dni
  return casosConVictima(dni)
    .sort((a, b) => b.registro.fecha.localeCompare(a.registro.fecha))
    .map((c) => ({ numero: c.numero, organismo: c.registro.organismo, fechaHecho: c.fechaHecho }))
}

function victimaDeSolicitud(s) {
  return s.informaLaVictima ? { ...s.quienInforma, edad: s.victima?.edad ?? null, domicilio: s.victima?.domicilio ?? null } : s.victima
}

export function listarSolicitudes() {
  if (!sesion().permisos.includes('solicitudes')) return []
  return bd.solicitudes.map((s) => ({
    numero: s.numero, estado: s.estado, enviada: s.enviada, resuelta: s.resuelta, caso: s.caso,
    informaLaVictima: s.informaLaVictima,
    quienInforma: { nombre: s.quienInforma.nombre, apellido: s.quienInforma.apellido, dni: s.quienInforma.dni },
    victima: (({ nombre: n, apellido, dni }) => ({ nombre: n, apellido, dni }))(victimaDeSolicitud(s)),
    fechaHecho: s.hecho.fechaHecho, horaHecho: s.hecho.horaHecho, especie: s.animales[0].especie,
    seccionesCompletas: s.seccionesCompletas,
    coincidencias: s.estado === 'pendiente' ? coincidenciasDeSolicitud(s).map(({ numero }) => ({ numero })) : [],
  }))
}

export function obtenerSolicitud(numero) {
  const s = clonar(buscarSolicitud(numero))
  if (!ve.descripcionYTenencia()) {
    s.animales = s.animales.map(({ tamano, sexo, edadAparente, color, raza, deQuienEs, ...resto }) => (void [tamano, sexo, edadAparente, color, raza, deQuienEs], resto))
  }
  s.coincidencias = s.estado === 'pendiente' ? coincidenciasDeSolicitud(s) : []
  return s
}

export function descartarSolicitud(numero) {
  const s = buscarSolicitud(numero)
  if (s.estado !== 'pendiente') throw new ErrorApi('La solicitud ya fue resuelta')
  s.estado = 'descartada'
  s.resuelta = { fecha: ahora(), por: perfil().corto }
  avisar()
}

const ciudadTexto = (v) => (v ? ciudades[v] ?? v : null)

// Un animal de la solicitud que entra al caso, al registrarla o al sumarla. Lo declarado sobre el
// dueño y el chip no se copia: queda como referencia para Zoonosis.
const datosAnimalDeSolicitud = (s, a) => ({
  tenencia: a.deQuienEs, zona: a.zona, vacunado: a.vacunado,
  descripcion: { tamano: a.tamano, sexo: a.sexo, edadAparente: a.edadAparente, color: a.color, raza: a.raza, podriaReconocerlo: a.podriaReconocerlo },
  declaradoEnSolicitud: a.duenoDeclarado || a.chip ? { solicitud: s.numero, dueno: a.duenoDeclarado, tieneChip: a.tieneChip, chip: a.chip } : null,
  fotos: (a.fotos ?? []).map(({ nombre: n, url }) => ({ nombre: n, url })),
})

export function registrarSolicitud(numero) {
  const s = buscarSolicitud(numero)
  if (s.estado !== 'pendiente') throw new ErrorApi('La solicitud ya fue resuelta')
  const v = victimaDeSolicitud(s)
  const fecha = ahora()
  const animalesCaso = s.animales.map((a) => animalEnCaso(nuevoAnimal(a.especie).id, datosAnimalDeSolicitud(s, a)))
  const r = crearCaso({
    canalOrigen: 'ciudadano',
    desdeSolicitud: s.numero,
    informaLaVictima: s.informaLaVictima,
    victima: { ...v, edad: v.edad },
    contactoResponsable: s.informaLaVictima ? null : s.quienInforma,
    fechaHecho: s.hecho.fechaHecho, horaHecho: s.hecho.horaHecho,
    lugar: { ciudad: ciudadTexto(s.hecho.ciudad), direccion: s.hecho.direccion, referencias: s.hecho.referencias, latitud: s.hecho.latitud ?? null, longitud: s.hecho.longitud ?? null },
    tipoLugar: s.hecho.tipoLugar,
    tipoEvento: quePaso[s.hecho.quePaso]?.tipoEvento ?? null,
    animales: animalesCaso,
    declarado: { hizoDenuncia: s.denuncia.hizoDenuncia, motivoNoDenuncia: s.denuncia.motivoNoDenuncia, solicitudes: [{ numero: s.numero, registradaEl: fecha }] },
  }, 'distintos')
  s.estado = 'registrada'
  s.resuelta = { fecha, por: perfil().corto }
  s.caso = r.numero
  avisar()
  return r
}

// Filas para sumar una solicitud a un caso (solicitudes.md, «Sumar a un caso»).
function filasSumar(s, c) {
  const v = victimaDeSolicitud(s)
  const pv = persona(c.victima.persona)
  const contacto = c.contactoResponsable ? persona(c.contactoResponsable.persona) : pv
  const informante = s.quienInforma
  const filas = [
    { grupo: 'Víctima', campo: 'victima.nombre', etiqueta: 'Nombre y apellido', s: `${v.nombre} ${v.apellido}`, c: nombre(pv) },
    { grupo: 'Víctima', campo: 'victima.dni', etiqueta: 'DNI', mono: true, s: soloDigitos(v.dni), c: pv.dni },
    { grupo: 'Víctima', campo: 'victima.edad', etiqueta: 'Edad', s: v.edad ?? null, c: c.victima.edad, aplicar: (val) => { c.victima.edad = val } },
    { grupo: 'Contacto', campo: 'contacto.telefono', etiqueta: 'Teléfono', mono: true, s: informante.telefono, c: contacto.telefono, aplicar: (val) => { contacto.telefono = val } },
    { grupo: 'Contacto', campo: 'contacto.correo', etiqueta: 'Correo', s: informante.correo, c: contacto.correo, aplicar: (val) => { contacto.correo = val } },
    { grupo: 'Hecho', campo: 'fechaHecho', etiqueta: 'Fecha del hecho', tipoDato: 'fecha', s: s.hecho.fechaHecho, c: c.fechaHecho, aplicar: (val) => { c.fechaHecho = val } },
    { grupo: 'Hecho', campo: 'horaHecho', etiqueta: 'Hora', mono: true, s: s.hecho.horaHecho, c: c.horaHecho, aplicar: (val) => { c.horaHecho = val } },
    { grupo: 'Hecho', campo: 'lugar.ciudad', etiqueta: 'Ciudad', s: ciudadTexto(s.hecho.ciudad), c: c.lugar.ciudad, aplicar: (val) => { c.lugar.ciudad = val } },
    { grupo: 'Hecho', campo: 'lugar.direccion', etiqueta: 'Dirección', s: s.hecho.direccion, c: c.lugar.direccion, aplicar: (val) => { c.lugar.direccion = val } },
    { grupo: 'Hecho', campo: 'lugar.referencias', etiqueta: 'Referencias', s: s.hecho.referencias, c: c.lugar.referencias, aplicar: (val) => { c.lugar.referencias = val } },
    { grupo: 'Hecho', campo: 'tipoLugar', etiqueta: 'Tipo de lugar', catalogo: tiposLugar, s: s.hecho.tipoLugar, c: c.tipoLugar, aplicar: (val) => { c.tipoLugar = val } },
    { grupo: 'Hecho', campo: 'tipoEvento', etiqueta: 'Tipo de evento', s: quePaso[s.hecho.quePaso]?.tipoEvento ?? null, c: c.tipoEvento, aplicar: (val) => { c.tipoEvento = val } },
  ]
  const pares = s.emparejamiento?.[c.numero] ?? s.animales.map((_, i) => (i < c.animales.length ? i : null))
  s.animales.forEach((a, i) => {
    const j = pares[i]
    const g = `Animal ${i + 1}`
    if (j == null) {
      filas.push({ grupo: g, campo: `animal.${i}.nuevo`, etiqueta: 'Animal', s: `${a.especie === 'gato' ? 'Gato' : 'Perro'} (se agrega al caso)`, c: null, animalNuevo: i })
      return
    }
    const ac = c.animales[j]
    filas.push({ grupo: g, campo: `animal.${i}.especie`, etiqueta: 'Especie', s: a.especie, c: animal(ac.animal).especie })
    if (ve.descripcionYTenencia()) {
      filas.push({ grupo: g, campo: `animal.${i}.tenencia`, etiqueta: 'De quién es', catalogo: tenencias, s: a.deQuienEs, c: ac.tenencia, aplicar: (val) => { ac.tenencia = val } })
      for (const [k, t] of [['tamano', 'Tamaño'], ['sexo', 'Sexo'], ['edadAparente', 'Edad aparente'], ['color', 'Color'], ['raza', 'Raza']]) {
        filas.push({ grupo: g, campo: `animal.${i}.${k}`, etiqueta: t, s: a[k], c: ac.descripcion[k], aplicar: (val) => { ac.descripcion[k] = val } })
      }
    }
    filas.push({ grupo: g, campo: `animal.${i}.zona`, etiqueta: 'Dónde vive', s: a.zona, c: ac.zona, aplicar: (val) => { ac.zona = val } })
    filas.push({ grupo: g, campo: `animal.${i}.vacunado`, etiqueta: 'Vacunado contra la rabia', s: a.vacunado, c: ac.vacunado, aplicar: (val) => { ac.vacunado = val } })
  })
  return { filas, pares }
}

export function compararSumar(numeroS, numeroC) {
  const s = buscarSolicitud(numeroS)
  const c = buscarCaso(numeroC)
  const { filas, pares } = filasSumar(s, c)
  return {
    solicitud: { numero: s.numero, estado: s.estado },
    caso: { numero: c.numero, organismo: c.registro.organismo },
    filas: filas.map(({ aplicar, ...f }) => (void aplicar, f)),
    animalesNuevos: pares.filter((p) => p == null).length,
  }
}

export function sumarSolicitud(numeroS, numeroC, elecciones) {
  const s = buscarSolicitud(numeroS)
  const c = buscarCaso(numeroC)
  if (s.estado !== 'pendiente') throw new ErrorApi('La solicitud ya fue resuelta')
  const { filas } = filasSumar(s, c)
  const cambios = []
  for (const f of filas) {
    if (f.animalNuevo != null) {
      const a = s.animales[f.animalNuevo]
      c.animales.push(animalEnCaso(nuevoAnimal(a.especie).id, datosAnimalDeSolicitud(s, a)))
      cambios.push({ campo: `Animal ${c.animales.length}`, antes: null, despues: 'creación' })
      continue
    }
    if (!f.aplicar || f.s == null || f.s === f.c) continue
    const usarS = f.c == null || elecciones[f.campo] === 's'
    if (usarS) {
      cambios.push({ campo: f.etiqueta, antes: f.catalogo ? f.catalogo[f.c] ?? f.c : f.c, despues: f.catalogo ? f.catalogo[f.s] ?? f.s : f.s })
      f.aplicar(f.s)
    }
  }
  // Lo declarado sobre la denuncia se copia siempre: gana la solicitud más reciente.
  const fecha = ahora()
  if (s.denuncia.hizoDenuncia != null) {
    cambios.push({ campo: '¿Hizo denuncia? (lo declaró la persona)', antes: c.declarado.hizoDenuncia === 'si' ? 'Sí' : c.declarado.hizoDenuncia === 'no' ? 'No' : null, despues: s.denuncia.hizoDenuncia === 'si' ? 'Sí' : 'No' })
    c.declarado.hizoDenuncia = s.denuncia.hizoDenuncia
    c.declarado.motivoNoDenuncia = s.denuncia.motivoNoDenuncia
  }
  c.declarado.solicitudes.push({ numero: s.numero, sumadaEl: fecha })
  s.estado = 'registrada'
  s.resuelta = { fecha, por: perfil().corto }
  s.caso = c.numero
  registrar(c.numero, { fecha, tipo: 'modificacion', sobre: 'solicitud', frase: `Sumó la solicitud ${s.numero} al caso.`, cambios })
  avisar()
}

export function resumenCaso(numero) {
  const c = bd.casos.find((x) => x.numero === numero)
  if (!c) return null
  const v = victimaVisible(c)
  return { numero: c.numero, victima: v.nombre ? `${v.nombre} ${v.apellido}` : null, fechaHecho: c.fechaHecho }
}

// ─── Personas ────────────────────────────────────────────────────────────────────────────
function rolesDePersona(id) {
  const lista = []
  for (const c of bd.casos) {
    if (c.victima.persona === id) lista.push({ caso: c, rol: 'victima' })
    if (c.contactoResponsable?.persona === id) lista.push({ caso: c, rol: 'contacto_responsable' })
    if (ve.duenoYChip() && c.animales.some((a) => a.dueno === id)) lista.push({ caso: c, rol: 'dueno' })
  }
  return lista
}

export function listarPersonas() {
  if (!sesion().permisos.includes('personas')) return []
  return bd.personas
    .map((p) => {
      const roles = rolesDePersona(p.id)
      if (!roles.length) return null
      const casosUnicos = [...new Set(roles.map((r) => r.caso))]
      const ultimo = [...casosUnicos].sort((a, b) => (b.fechaHecho ?? '').localeCompare(a.fechaHecho ?? ''))[0]
      const contar = (rol) => roles.filter((r) => r.rol === rol).length
      return {
        id: p.id, nombre: p.nombre, apellido: p.apellido, dni: p.dni,
        casos: casosUnicos.length,
        roles: { victima: contar('victima'), contactoResponsable: contar('contacto_responsable'), dueno: contar('dueno') },
        ultimoCaso: { numero: ultimo.numero, fechaHecho: ultimo.fechaHecho },
        ultimaModificacion: p.ultimaModificacion,
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.ultimaModificacion.fecha.localeCompare(a.ultimaModificacion.fecha))
}

export function obtenerPersona(id) {
  const p = persona(Number(id))
  if (!p || !sesion().permisos.includes('personas')) throw new ErrorApi('No existe la persona')
  const roles = rolesDePersona(p.id)
  const esDueno = roles.some((r) => r.rol === 'dueno')
  return {
    id: p.id, nombre: p.nombre, apellido: p.apellido, dni: p.dni, telefono: p.telefono, correo: p.correo, domicilio: p.domicilio,
    puedeEditar: esAgente() && (!esDueno || tipo() === 'zoonosis'),
    casos: roles.map(({ caso: c, rol }) => {
      const v = persona(c.victima.persona)
      return { numero: c.numero, rol, fechaHecho: c.fechaHecho, horaHecho: c.horaHecho, victima: { nombre: v.nombre, apellido: v.apellido, edad: c.victima.edad }, estado: c.estado, unificadoEn: c.unificadoEn }
    }),
  }
}

export function editarPersona(id, form) {
  const p = persona(Number(id))
  const cambios = []
  aplicarPersona(p, form, cambios, 'persona')
  const fecha = ahora()
  if (cambios.length) {
    for (const { caso } of rolesDePersona(p.id)) {
      registrar(caso.numero, { fecha, tipo: 'modificacion', sobre: 'persona', frase: `Editó a ${nombre(p)}.`, desde: 'Consultas › Personas', cambios })
    }
  }
  avisar()
}

// ─── Animales ────────────────────────────────────────────────────────────────────────────
function casosDeAnimal(id) {
  return bd.casos.filter((c) => c.animales.some((a) => a.animal === id))
}

function filaAnimal(a) {
  const casos = casosDeAnimal(a.id).sort((x, y) => (y.fechaHecho ?? '').localeCompare(x.fechaHecho ?? ''))
  const ultimo = casos[0]
  const enUltimo = ultimo?.animales.find((x) => x.animal === a.id)
  const fila = { id: a.id, especie: a.especie, casos: casos.length, ultimoCaso: ultimo ? { numero: ultimo.numero, fechaHecho: ultimo.fechaHecho } : null, vigente: a.vigente }
  if (ve.duenoYChip()) {
    fila.chip = a.chip
    fila.absorbidoPor = a.absorbidoPor ? { id: a.absorbidoPor, chip: animal(a.absorbidoPor).chip } : null
  } else {
    fila.absorbidoPor = a.absorbidoPor ? { id: a.absorbidoPor } : null
  }
  if (ve.descripcionYTenencia()) fila.descripcion = enUltimo?.descripcion ?? null
  if (ve.dia10()) fila.dia10 = enUltimo?.dia10 ?? null
  return fila
}

export function listarAnimales() {
  if (!sesion().permisos.includes('animales')) return []
  return bd.animales.map(filaAnimal).sort((a, b) => (b.ultimoCaso?.fechaHecho ?? '').localeCompare(a.ultimoCaso?.fechaHecho ?? ''))
}

export function obtenerAnimal(id) {
  const a = animal(Number(id))
  if (!a || !sesion().permisos.includes('animales')) throw new ErrorApi('No existe el animal')
  const salida = {
    ...filaAnimal(a),
    absorbio: a.absorbio,
    registrado: a.registrado,
    puedeEditar: tipo() === 'zoonosis' && a.vigente,
    casos: casosDeAnimal(a.id).map((c) => {
      const en = c.animales.find((x) => x.animal === a.id)
      const fila = { numero: c.numero, estado: c.estado, vinoDeAbsorbido: Boolean(en.vinoDeAbsorbido) }
      if (ve.descripcionYTenencia()) {
        fila.tenencia = en.tenencia
        fila.descripcion = en.descripcion
      }
      if (ve.duenoYChip()) {
        const d = persona(en.dueno)
        fila.dueno = d ? { nombre: d.nombre, apellido: d.apellido, dni: d.dni } : null
      }
      if (ve.dia10()) fila.dia10 = en.dia10
      return fila
    }),
  }
  return salida
}

export function editarIdentidad(id, { especie, chip }) {
  const a = animal(Number(id))
  const nuevoChip = soloDigitos(chip) || null
  if (nuevoChip && nuevoChip !== a.chip) {
    const otro = bd.animales.find((x) => x.chip === nuevoChip && x.id !== a.id)
    if (otro) {
      const donde = casosDeAnimal(otro.id)[0]
      const error = new ErrorApi(`Ese chip ya está en otro animal (${donde?.numero ?? 'sin casos'})`, 'chip')
      error.reconciliarCon = otro.id
      throw error
    }
  }
  const cambios = []
  if (especie !== a.especie) cambios.push({ campo: 'Especie', antes: a.especie, despues: especie })
  if (nuevoChip !== a.chip) cambios.push({ campo: 'Chip', antes: chipLegible(a.chip), despues: chipLegible(nuevoChip) })
  a.especie = especie
  a.chip = nuevoChip
  if (cambios.length) for (const c of casosDeAnimal(a.id)) registrar(c.numero, { fecha: ahora(), tipo: 'modificacion', sobre: 'animal', frase: 'Editó la identidad del animal.', desde: 'Consultas › Animales', cambios })
  avisar()
}

// Quién sobrevive lo decide la regla: el que tiene chip; si ninguno, el más viejo.
export function reconciliacion(idX, idY) {
  const x = animal(Number(idX))
  const y = animal(Number(idY))
  if (x.chip && y.chip) throw new ErrorApi('Los dos tienen chip: son animales distintos')
  const [a, b] = x.chip ? [x, y] : y.chip ? [y, x] : x.registrado <= y.registrado ? [x, y] : [y, x]
  const resumen = (z) => ({ id: z.id, especie: z.especie, chip: z.chip, registrado: z.registrado, casos: casosDeAnimal(z.id).map((c) => c.numero) })
  return { a: resumen(a), b: resumen(b) }
}

export function reconciliar(idX, idY) {
  const { a, b } = reconciliacion(idX, idY)
  const fecha = ahora()
  const fuente = animal(b.id)
  for (const c of casosDeAnimal(b.id)) {
    for (const en of c.animales) {
      if (en.animal === b.id) {
        en.animal = a.id
        en.vinoDeAbsorbido = true
      }
    }
    registrar(c.numero, { fecha, tipo: 'baja_logica', sobre: 'animal', frase: `Reconcilió el animal con el ${a.especie} ${a.chip ? `chip ${chipLegible(a.chip)}` : 'sin chip'}: el otro registro quedó absorbido.`, cambios: [{ campo: 'Animal', antes: `${fuente.especie}, ${fuente.chip ? chipLegible(fuente.chip) : 'sin chip'}`, despues: `${a.especie}, ${a.chip ? chipLegible(a.chip) : 'sin chip'}` }] })
  }
  fuente.vigente = false
  fuente.absorbidoPor = a.id
  animal(a.id).absorbio.push({ id: b.id, fecha: datos.hoy })
  avisar()
  return { a, b }
}

// ─── Mapa ────────────────────────────────────────────────────────────────────────────────
// Qué filtros se ofrecen: los de la descripción del animal solo a quien la ve (mapa.md, busqueda.md).
export function filtrosMapa() {
  return ['anio', 'ciudad', 'especie', ...(ve.descripcionYTenencia() ? ['tamano', 'color'] : []), 'tipoEvento']
}

export function puntosMapa(filtros = {}) {
  const coincide = (c) => {
    if (!vigente(c)) return false
    if (filtros.anio && !(c.fechaHecho ?? '').startsWith(filtros.anio)) return false
    if (filtros.ciudad && c.lugar.ciudad !== filtros.ciudad) return false
    if (filtros.tipoEvento && c.tipoEvento !== filtros.tipoEvento) return false
    return c.animales.some((a) => {
      if (filtros.especie && animal(a.animal).especie !== filtros.especie) return false
      if (ve.descripcionYTenencia()) {
        if (filtros.tamano && a.descripcion.tamano !== filtros.tamano) return false
        if (filtros.color && !(a.descripcion.color ?? '').toLowerCase().includes(filtros.color.toLowerCase())) return false
      }
      return true
    })
  }
  const elegidos = bd.casos.filter(coincide)
  const conUbicacion = elegidos.filter((c) => c.lugar.latitud != null)
  return {
    total: conUbicacion.length,
    sinUbicacion: elegidos.length - conUbicacion.length,
    puntos: conUbicacion.map((c) => {
      const v = victimaVisible(c)
      return {
        numero: c.numero, latitud: c.lugar.latitud, longitud: c.lugar.longitud, marcas: marcas(c),
        victima: ve.datosPersonales() ? { nombre: v.nombre, apellido: v.apellido, edad: v.edad } : { edad: v.edad },
        fechaHecho: c.fechaHecho, lugar: { direccion: c.lugar.direccion, ciudad: c.lugar.ciudad, referencias: c.lugar.referencias },
        animales: animalesVisibles(c, { resumen: true }), tipoEvento: c.tipoEvento, estado: c.estado,
      }
    }),
  }
}

// ─── Búsqueda ────────────────────────────────────────────────────────────────────────────
export function filtrosBusqueda() {
  return [
    'desde', 'hasta', 'ciudad', 'tipoLugar', 'lugar', 'edadDesde', 'edadHasta', 'especie',
    ...(ve.descripcionYTenencia() ? ['tamano', 'colorRaza', 'tenencia'] : []),
    'organismo', 'tipoEvento', 'registradoPor', 'estado',
  ]
}

export function buscarCasos(filtros) {
  exigirCasos()
  // Un filtro que no se ofrece a quien busca se ignora.
  const ofrecidos = filtrosBusqueda()
  const f = Object.fromEntries(Object.entries(filtros).filter(([k]) => ofrecidos.includes(k)))
  const texto = (t) => String(t ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
  const filas = bd.casos.filter((c) => {
    if (f.estado === 'vigentes' && !vigente(c)) return false
    if (f.estado && f.estado !== 'vigentes' && f.estado !== 'todos' && c.estado !== f.estado) return false
    if (f.desde && (!c.fechaHecho || c.fechaHecho < f.desde)) return false
    if (f.hasta && (!c.fechaHecho || c.fechaHecho > f.hasta)) return false
    if (f.ciudad && c.lugar.ciudad !== f.ciudad) return false
    if (f.lugar && !texto(`${c.lugar.direccion} ${c.lugar.referencias}`).includes(texto(f.lugar))) return false
    if (f.tipoLugar && c.tipoLugar !== f.tipoLugar) return false
    if (f.edadDesde && (c.victima.edad == null || c.victima.edad < Number(f.edadDesde))) return false
    if (f.edadHasta && (c.victima.edad == null || c.victima.edad > Number(f.edadHasta))) return false
    if (f.organismo && c.registro.organismo !== f.organismo) return false
    if (f.tipoEvento && c.tipoEvento !== f.tipoEvento) return false
    if (f.registradoPor && !texto(c.registro.por).includes(texto(f.registradoPor))) return false
    const porAnimal = f.especie || f.tamano || f.colorRaza || f.tenencia
    if (porAnimal) {
      const alguno = c.animales.some((a) => {
        if (f.especie && animal(a.animal).especie !== f.especie) return false
        if (f.tamano && a.descripcion.tamano !== f.tamano) return false
        if (f.colorRaza && !texto(`${a.descripcion.color} ${a.descripcion.raza}`).includes(texto(f.colorRaza))) return false
        if (f.tenencia && a.tenencia !== f.tenencia) return false
        return true
      })
      if (!alguno) return false
    }
    return true
  })
  return { total: filas.length, casos: ordenarPorModificacion(filas.map(filaCaso)) }
}

// ─── Inicio y Estadísticas: cifras agregadas que manda la API ────────────────────────────
export function inicio() {
  const p = sesion()
  const salida = { datosAl: datos.panorama.datosAl }
  if (p.rol === 'agente') salida.pendientes = datos.panorama.pendientes
  if (p.rol !== 'administrador') {
    const { anio, totalVigentes, casosPorMes, zonaDelCuerpo, franjaEtaria, canalOrigen } = datos.panorama
    salida.panorama = { anio, totalVigentes, casosPorMes, zonaDelCuerpo, franjaEtaria, canalOrigen }
  }
  return clonar(salida)
}

export function estadisticas() {
  if (!sesion().permisos.includes('estadisticas')) throw new ErrorApi('No tenés permiso')
  return clonar(datos.panorama)
}

// ─── Exportar ────────────────────────────────────────────────────────────────────────────
export function bloquesExportar() {
  const b = clonar(datos.bloquesExportar)
  const salida = {}
  const con = (clave, cambios = {}) => { salida[clave] = { clave, ...b[clave], ...cambios } }
  con('identificacion'); con('hecho'); con('tipo_evento'); con('persona')
  if (tipo() === 'zoonosis') {
    con('animal'); con('tratamiento', { descripcion: 'Solo si recibió atención (sí/no)', columnas: 1 }); con('denuncia'); con('documentacion'); con('datos_personales')
  } else if (tipo() === 'salud') {
    con('animal', { descripcion: 'Por animal: especie, vacunado y día 10', columnas: 3 }); con('tratamiento')
    con('denuncia', { descripcion: 'Lo declarado (¿hizo denuncia? y motivo) y si tiene denuncia (sí/no)', columnas: 3 })
    con('documentacion', { descripcion: 'Si el caso tiene certificado médico, sin el archivo', columnas: 1 })
  } else if (tipo() === 'cadic') {
    con('animal', { descripcion: 'Por animal: especie, tenencia, vacunado, día 10, tamaño, sexo, edad aparente, color, raza y si podría reconocerlo', columnas: 10 })
    con('tratamiento', { descripcion: 'Solo si recibió atención (sí/no)', columnas: 1 })
    con('denuncia', { descripcion: 'Lo declarado (¿hizo denuncia? y motivo) y si tiene denuncia (sí/no)', columnas: 3 })
    con('documentacion', { descripcion: 'Si los animales tienen fotos, sin los archivos', columnas: 1 })
  } else if (perfil().rol === 'analista') {
    con('animal', { descripcion: 'Por animal: especie, tenencia, vacunado, tamaño, sexo, edad aparente, color, raza y si podría reconocerlo', columnas: 9 })
    con('denuncia', { descripcion: 'Solo lo declarado (¿hizo denuncia? y motivo)', columnas: 2 })
  }
  return Object.values(salida)
}

export function contarParaExportar(f) {
  return buscarCasos(f).total
}

// El archivo lo genera el back. Acá se arma un CSV mínimo con los casos que entran.
export function descargar(f, bloques, formato) {
  if (formato === 'xlsx') throw new ErrorApi('La descarga en XLSX la genera la API: con los datos de ejemplo solo funciona CSV.')
  const { casos } = buscarCasos(f)
  const columnas = [['numero', (c) => c.numero], ['estado', (c) => estados[c.estado].etiqueta], ['fecha_hecho', (c) => c.fechaHecho ?? ''], ['ciudad', (c) => c.lugar.ciudad ?? ''], ['tipo_evento', (c) => c.tipoEvento ?? ''], ['edad_victima', (c) => c.victima.edad ?? '']]
  const filas = [columnas.map(([n]) => n).join(','), ...casos.map((c) => columnas.map(([, v]) => `"${String(v(c)).replace(/"/g, '""')}"`).join(','))]
  return { contenido: filas.join('\n'), cantidad: casos.length, bloques }
}

// ─── Administración ──────────────────────────────────────────────────────────────────────
const organismo = (id) => bd.organismos.find((o) => o.id === id)

export function listarUsuarios() {
  return bd.usuarios
    .map((u) => ({ ...u, organismo: u.organismo ? { id: u.organismo, nombre: organismo(u.organismo).nombre } : null }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
}

export function guardarUsuario(id, form) {
  const correo = form.correo.trim().toLowerCase()
  if (bd.usuarios.some((u) => u.correo === correo && u.id !== id)) throw new ErrorApi('Ya hay una cuenta con ese correo', 'correo')
  const valores = { nombre: form.nombre.trim(), correo, rol: form.rol, organismo: form.rol === 'agente' ? Number(form.organismo) : null }
  if (id) Object.assign(bd.usuarios.find((u) => u.id === id), valores)
  else bd.usuarios.push({ id: Math.max(...bd.usuarios.map((u) => u.id)) + 1, ...valores, activo: true, ultimoAcceso: null, alta: datos.hoy, desactivado: null })
  avisar()
}

export function desactivarUsuario(id) {
  const u = bd.usuarios.find((x) => x.id === id)
  u.activo = false
  u.desactivado = { fecha: datos.hoy, por: `${perfil().corto} (administración)` }
  avisar()
}

export function reactivarUsuario(id) {
  const u = bd.usuarios.find((x) => x.id === id)
  if (u.organismo && !organismo(u.organismo).activo) throw new ErrorApi('Primero hay que reactivar el organismo')
  u.activo = true
  u.desactivado = null
  avisar()
}

export function listarOrganismos() {
  return [...bd.organismos].sort((a, b) => b.casosVigentes - a.casosVigentes)
}

export function guardarOrganismo(id, form) {
  const nombreNuevo = form.nombre.trim()
  if (bd.organismos.some((o) => o.nombre.toLowerCase() === nombreNuevo.toLowerCase() && o.id !== id)) throw new ErrorApi('Ya hay un organismo con ese nombre', 'nombre')
  const valores = { nombre: nombreNuevo, tipo: form.tipo, activo: form.activo }
  if (id) {
    const o = organismo(id)
    const anterior = o.nombre
    Object.assign(o, valores)
    // El nombre es el mismo organismo: cambia en todos sus casos.
    for (const c of bd.casos) if (c.registro.organismo === anterior) c.registro.organismo = nombreNuevo
  } else {
    bd.organismos.push({ id: Math.max(...bd.organismos.map((o) => o.id)) + 1, ...valores, usuariosActivos: 0, casosVigentes: 0 })
  }
  avisar()
}

export function organismosActivos() {
  return bd.organismos.filter((o) => o.activo).map((o) => ({ id: o.id, nombre: o.nombre }))
}

export function nombresOrganismos() {
  return bd.organismos.map((o) => o.nombre)
}

export function listarTiposEvento() {
  return clonar(bd.tiposEvento)
}

export function tiposEventoActivos() {
  return bd.tiposEvento.filter((t) => t.activo).map((t) => t.nombre)
}

export function guardarTipoEvento(id, form) {
  const nombreNuevo = form.nombre.trim()
  if (bd.tiposEvento.some((t) => t.nombre.toLowerCase() === nombreNuevo.toLowerCase() && t.id !== id)) throw new ErrorApi('Ya hay un tipo de evento con ese nombre', 'nombre')
  const valores = { nombre: nombreNuevo, descripcion: vacioANulo(form.descripcion), activo: form.activo }
  if (id) {
    const t = bd.tiposEvento.find((x) => x.id === id)
    const anterior = t.nombre
    Object.assign(t, valores)
    for (const c of bd.casos) if (c.tipoEvento === anterior) c.tipoEvento = nombreNuevo
  } else {
    bd.tiposEvento.push({ id: Math.max(...bd.tiposEvento.map((t) => t.id)) + 1, ...valores, casosVigentes: 0 })
  }
  avisar()
}

// ─── Formulario público ──────────────────────────────────────────────────────────────────
// El token vive en el servidor y vence a la hora. Para la demo, una parte se puede guardar
// mal a propósito (simularFalla) y el token se puede vencer a mano (vencerToken).
const tokens = new Map()
let ultimaSolicitud = 36
export const simulacion = { proximoGuardadoFalla: false, tokenVencido: false }

export function enviarSolicitud(form) {
  ultimaSolicitud += 1
  const numero = `S-2026-${String(ultimaSolicitud).padStart(4, '0')}`
  const token = crypto.randomUUID() + crypto.randomUUID()
  bd.solicitudes.push({
    numero, estado: 'pendiente', enviada: ahora(), resuelta: null, caso: null,
    informaLaVictima: form.informaLaVictima,
    quienInforma: { ...form.quienInforma, dni: soloDigitos(form.quienInforma.dni) },
    victima: form.informaLaVictima ? null : { ...form.victima, dni: soloDigitos(form.victima.dni), edad: null, domicilio: null },
    hecho: { fechaHecho: form.fechaHecho, horaHecho: null, ciudad: form.ciudad, direccion: null, referencias: null, tipoLugar: null, quePaso: null, cantidadAnimales: null },
    animales: [{ especie: form.especie, deQuienEs: null, duenoDeclarado: null, tieneChip: null, chip: null, zona: null, vacunado: null, podriaReconocerlo: null, tamano: null, sexo: null, edadAparente: null, color: null, raza: null, fotos: [] }],
    denuncia: { hizoDenuncia: null, motivoNoDenuncia: null },
    seccionesCompletas: 0,
  })
  tokens.set(token, numero)
  avisar()
  return { numero, token }
}

export class ErrorRed extends Error {}
export class ErrorTokenVencido extends Error {}

export function guardarParte(token, parte, valores) {
  if (simulacion.proximoGuardadoFalla) {
    simulacion.proximoGuardadoFalla = false
    throw new ErrorRed('Sin conexión')
  }
  if (simulacion.tokenVencido || !tokens.has(token)) throw new ErrorTokenVencido('El enlace venció')
  const s = buscarSolicitud(tokens.get(token))
  if (parte === 'donde') Object.assign(s.hecho, valores)
  if (parte === 'que_paso') {
    s.hecho.quePaso = valores.quePaso ?? null
    s.hecho.cantidadAnimales = valores.cantidadAnimales ?? null
    const v = s.informaLaVictima ? (s.victima ??= { edad: null, domicilio: null }) : s.victima
    v.edad = valores.edad ? Number(valores.edad) : null
    v.domicilio = valores.domicilio || null
  }
  if (parte === 'animal') s.animales[valores.indice] = { ...(s.animales[valores.indice] ?? {}), ...valores.animal }
  if (parte === 'denuncia') s.denuncia = valores
  if (['donde', 'que_paso', 'denuncia'].includes(parte) || (parte === 'animal' && valores.indice === 0)) s.seccionesCompletas = Math.min(4, s.seccionesCompletas + 1)
  avisar()
  return { ok: true }
}

export function descartarToken(token) {
  tokens.delete(token)
}

// Geocodificación inversa: con la API pasa por el proxy del back (Nominatim con caché).
export function geocodificar(latitud) {
  if (latitud < -54.6) return 'Kuanip 1240'
  if (latitud > -54) return 'Belgrano 455'
  return 'Av. de los Shelknam 200'
}
