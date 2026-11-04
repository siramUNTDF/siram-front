import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Box, Button } from '@mui/material'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import Mensaje from '@/componentes/Mensaje'
import { Casilla } from '@/componentes/formulario/Campos'
import FilaComparacion, { GrupoComparacion } from '@/componentes/comparacion/FilaComparacion'
import { estadoFila, mostrarValor } from '@/componentes/comparacion/valores'
import { useAvisar } from '@/componentes/avisos'
import { api, ErrorApi, useApi } from '@/mocks'
import NoEncontrada from '@/pantallas/NoEncontrada'

// Sumar una solicitud a un caso existente, campo por campo (RN-19). La solicitud va a la izquierda.
export default function SumarSolicitud() {
  const { numero, caso } = useParams()
  const navigate = useNavigate()
  const avisar = useAvisar()
  const { datos, error } = useApi(() => api.compararSumar(numero, caso), [numero, caso])
  const [elecciones, setElecciones] = useState({})
  const [confirmado, setConfirmado] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState(null)

  if (error) return <NoEncontrada />
  const filas = datos.filas.map((f) => ({ ...f, izq: mostrarValor(f, f.s), der: mostrarValor(f, f.c), estado: f.animalNuevo != null ? 'solo_izq' : estadoFila(f.s, f.c) }))
  const sinElegir = filas.filter((f) => f.estado === 'distinto' && !elecciones[f.campo])
  const grupos = [...new Set(filas.map((f) => f.grupo))]
  const habilitado = confirmado && sinElegir.length === 0 && datos.solicitud.estado === 'pendiente'
  const animalesTexto = datos.animalesNuevos
    ? `se ${datos.animalesNuevos === 1 ? 'agrega 1 animal nuevo' : `agregan ${datos.animalesNuevos} animales nuevos`} al caso`
    : 'sus animales son los del caso, no se agrega ninguno'

  function sumar() {
    try {
      const elegidas = Object.fromEntries(Object.entries(elecciones).map(([campo, lado]) => [campo, lado === 'izq' ? 's' : 'c']))
      api.sumarSolicitud(numero, caso, elegidas)
      avisar('exito', `${numero} sumada a ${caso}`)
      navigate(`/casos/${caso}`)
    } catch (e) {
      if (!(e instanceof ErrorApi)) throw e
      setErrorGeneral(e.message)
    }
  }

  return (
    <>
      <EncabezadoPagina
        volver={`/casos/solicitudes/${numero}`}
        titulo={`Sumar ${numero} a ${caso}`}
        bajada="Cuando un dato choca, elegí cuál queda. Si solo uno de los dos lo tiene, se conserva el que lo tiene (se guarda la mayor información)."
        extra={<NotaDatosEjemplo />}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Mensaje tipo="info" titulo="Lo declarado sobre la denuncia se copia siempre">
          «¿Hizo denuncia?» y su motivo: gana la solicitud más reciente. Ningún agente los edita.
        </Mensaje>
        {errorGeneral && <Mensaje tipo="error" onCerrar={() => setErrorGeneral(null)}>{errorGeneral}</Mensaje>}

        <Panel>
          <Box sx={{ display: { xs: 'none', sm: 'grid' }, gridTemplateColumns: '160px minmax(0,1fr) 32px minmax(0,1fr)', gap: 1, p: '10px 12px', borderBottom: 1, borderColor: 'divider', fontSize: 11, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: 'text.tertiary' }}>
            <span>Campo</span><span>En la solicitud {numero}</span><span /><span>En el caso {caso}</span>
          </Box>
          {grupos.map((g) => (
            <Box key={g}>
              <GrupoComparacion titulo={g} />
              {filas.filter((f) => f.grupo === g).map((f) => (
                <FilaComparacion key={f.campo} id={f.campo} etiqueta={f.etiqueta} mono={f.mono} izq={f.izq} der={f.der} elegido={elecciones[f.campo] ?? null} onElegir={(lado) => setElecciones((x) => ({ ...x, [f.campo]: lado }))} />
              ))}
            </Box>
          ))}
        </Panel>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Casilla etiqueta="Confirmo que la solicitud es del mismo hecho que el caso." marcada={confirmado} onCambio={setConfirmado} />
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button variant="outlined" color="inherit" onClick={() => navigate(`/casos/solicitudes/${numero}`)} sx={{ borderColor: 'divider' }}>Cancelar</Button>
            <Button variant="contained" disabled={!habilitado} onClick={sumar}>Sumar al caso</Button>
          </Box>
        </Box>
        <Box sx={{ fontSize: 12.5, color: 'text.tertiary' }}>
          {sinElegir.length > 0 && <Box sx={{ color: 'warning.main', mb: 0.5 }}>Falta elegir: {sinElegir.map((f) => `${f.etiqueta.toLowerCase()} (${f.grupo.toLowerCase()})`).join(', ')}.</Box>}
          Al sumarla, la solicitud queda «registrada» y apunta al caso; {animalesTexto}.
        </Box>
      </Box>
    </>
  )
}
