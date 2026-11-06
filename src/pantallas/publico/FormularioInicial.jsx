import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Box } from '@mui/material'
import Bloque from '@/componentes/Bloque'
import Mensaje from '@/componentes/Mensaje'
import { CampoFecha, Opciones, Texto } from '@/componentes/formulario/Campos'
import useFormulario from '@/componentes/formulario/useFormulario'
import { ciudades, especies } from '@/componentes/caso/catalogos'
import { api } from '@/mocks'
import { soloDigitos } from '@/utiles/formato'
import { correoValido, dniValido, fechaFutura, fechaInvalida, mensajeDni, mensajeFechaInvalida, telefonoValido, vacio } from '@/utiles/validacion'
import { Acciones, PielPublica, SimularFallas, Titulo } from './piezas'
import { sesionReporte } from './sesionReporte'

const ayudaDni = 'Solo números, 7 u 8, con o sin puntos. Por ejemplo: 32.114.887'
const ayudaCiudad = 'Si fue fuera de las tres ciudades, marcá la más cercana.'

// En el canal ciudadano es obligatorio todo lo de quien completa (formulario-publico.md).
function validar(v) {
  const e = {}
  if (v.informaLaVictima == null) e.informaLaVictima = 'Contanos si fuiste vos'
  const p = v.quienInforma
  if (vacio(p.nombre)) e['quienInforma.nombre'] = 'Falta tu nombre'
  if (vacio(p.apellido)) e['quienInforma.apellido'] = 'Falta tu apellido'
  if (vacio(p.dni)) e['quienInforma.dni'] = 'Falta tu DNI'
  else if (!dniValido(p.dni)) e['quienInforma.dni'] = mensajeDni
  if (vacio(p.telefono)) e['quienInforma.telefono'] = 'Falta tu teléfono'
  else if (!telefonoValido(p.telefono)) e['quienInforma.telefono'] = 'El teléfono tiene que tener al menos 6 números'
  if (vacio(p.correo)) e['quienInforma.correo'] = 'Falta tu correo'
  else if (!correoValido(p.correo)) e['quienInforma.correo'] = 'El correo no tiene un formato válido'
  if (v.informaLaVictima === false) {
    const vi = v.victima
    if (vacio(vi.nombre)) e['victima.nombre'] = 'Falta el nombre'
    if (vacio(vi.apellido)) e['victima.apellido'] = 'Falta el apellido'
    if (vacio(vi.dni)) e['victima.dni'] = 'Falta el DNI'
    else if (!dniValido(vi.dni)) e['victima.dni'] = mensajeDni
    else if (soloDigitos(vi.dni) === soloDigitos(p.dni)) e['victima.dni'] = 'Es tu mismo DNI. Si fuiste vos, respondé “Sí” arriba.'
  }
  if (vacio(v.fechaHecho)) e.fechaHecho = 'Falta cuándo pasó'
  else if (fechaInvalida(v.fechaHecho)) e.fechaHecho = mensajeFechaInvalida
  else if (fechaFutura(v.fechaHecho)) e.fechaHecho = 'La fecha no puede ser futura'
  if (!v.especie) e.especie = 'Contanos qué animal fue'
  if (!v.ciudad) e.ciudad = 'Contanos en qué ciudad fue'
  return e
}

// Pantalla 1 · Formulario inicial del canal ciudadano. Lo que se manda es una solicitud, no un caso.
export default function FormularioInicial() {
  const navigate = useNavigate()
  const vacioPersona = { nombre: '', apellido: '', dni: '' }
  const f = useFormulario({ informaLaVictima: null, quienInforma: { ...vacioPersona, telefono: '', correo: '' }, victima: vacioPersona, fechaHecho: '', especie: null, ciudad: null })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const v = f.valores
  const campo = (r) => ({ valor: f.valor(r), onCambio: (x) => f.poner(r, x), error: f.errores[r] })

  function enviar(e) {
    e.preventDefault()
    const errores = validar(v)
    f.setErrores(errores)
    if (Object.keys(errores).length) return
    setEnviando(true)
    setError(null)
    setTimeout(() => {
      try {
        if (api.simulacion.proximoGuardadoFalla) {
          api.simulacion.proximoGuardadoFalla = false
          throw new Error('red')
        }
        const r = api.enviarSolicitud(v)
        sesionReporte.iniciar(r.numero, r.token, v.especie, v.ciudad)
        // `replace`: el botón atrás no vuelve al formulario ni reenvía nada.
        navigate('/reportar/detalle', { replace: true })
      } catch {
        setError('No pudimos enviar tu solicitud. Revisá tu conexión y probá de nuevo.')
        setEnviando(false)
      }
    }, 500)
  }

  return (
    <PielPublica>
      <Box component="form" noValidate onSubmit={enviar}>
        <Titulo bajada="Contanos qué pasó. Lo revisa una persona de Salud, Zoonosis o CADIC. Te lleva dos minutos.">¿Te mordió o te atacó un perro o un gato?</Titulo>
        <Mensaje tipo="advertencia" sx={{ mb: 2.5 }}>Esto no es un canal de emergencias. Si necesitás atención médica, andá a la guardia más cercana.</Mensaje>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Opciones etiqueta="¿Sos quien sufrió el ataque?" requerido vertical opciones={[[true, 'Sí'], [false, 'No, informo por otra persona']]} {...campo('informaLaVictima')} />
          <Bloque titulo="Tus datos">
            <Texto etiqueta="Nombre" requerido {...campo('quienInforma.nombre')} />
            <Texto etiqueta="Apellido" requerido {...campo('quienInforma.apellido')} />
            <Texto etiqueta="DNI" requerido ayuda={ayudaDni} inputMode="numeric" {...campo('quienInforma.dni')} />
            <Texto etiqueta="Teléfono" requerido tipo="tel" {...campo('quienInforma.telefono')} />
            <Texto etiqueta="Correo electrónico" requerido tipo="email" {...campo('quienInforma.correo')} />
          </Bloque>
          {v.informaLaVictima === false && (
            <Bloque titulo="Quién sufrió el ataque" bajada="No hace falta su teléfono ni su correo: te contactamos a vos.">
              <Texto etiqueta="Nombre" requerido {...campo('victima.nombre')} />
              <Texto etiqueta="Apellido" requerido {...campo('victima.apellido')} />
              <Texto etiqueta="DNI" requerido ayuda={ayudaDni} inputMode="numeric" {...campo('victima.dni')} />
            </Bloque>
          )}
          <Bloque titulo="El hecho">
            <CampoFecha etiqueta="¿Cuándo pasó?" requerido sinFuturas {...campo('fechaHecho')} />
            <Opciones etiqueta="¿Qué animal fue?" requerido opciones={especies} {...campo('especie')} />
            <Opciones etiqueta="Ciudad" requerido ayuda={ayudaCiudad} opciones={ciudades} {...campo('ciudad')} />
          </Bloque>
        </Box>
        {error && <Mensaje tipo="error" sx={{ mt: 2 }} onCerrar={() => setError(null)}>{error}</Mensaje>}
        <Acciones principal="Enviar" ocupado={enviando} />
        <Box sx={{ mt: 2, fontSize: 12.5, color: 'text.tertiary' }}>Usamos tus datos solo para registrar el hecho y contactarte (Ley 25.326 de protección de datos personales).</Box>
      </Box>
      <SimularFallas />
    </PielPublica>
  )
}
