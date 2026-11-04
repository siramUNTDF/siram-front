import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Box, Button } from '@mui/material'
import MergeTypeIcon from '@mui/icons-material/MergeType'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import Mensaje from '@/componentes/Mensaje'
import EstadoCaso from '@/componentes/caso/EstadoCaso'
import { Casilla } from '@/componentes/formulario/Campos'
import FilaComparacion, { GrupoComparacion } from '@/componentes/comparacion/FilaComparacion'
import { estadoFila, mostrarValor } from '@/componentes/comparacion/valores'
import { useAvisar } from '@/componentes/avisos'
import { api, ErrorApi, useApi } from '@/mocks'
import { fuentes } from '@/tema/tokens'
import { dni, fechaCorta } from '@/utiles/formato'
import NoEncontrada from '@/pantallas/NoEncontrada'
import { NoEsDuplicado } from '../ficha/Ventanas'

function Cabecera({ caso }) {
  return (
    <Box sx={{ p: '10px 12px' }}>
      <Box component={Link} to={`/casos/${caso.numero}`} target="_blank" sx={{ fontFamily: fuentes.mono, fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}>{caso.numero}</Box>
      <Box sx={{ fontSize: 12.5, color: 'text.secondary' }}>{caso.organismo}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '6px', flexWrap: 'wrap' }}>
        <EstadoCaso estado={caso.estado} />
        <Box component="span" sx={{ fontFamily: fuentes.mono, fontSize: 12, color: 'text.tertiary' }}>Registrado {fechaCorta(caso.registrado)}</Box>
      </Box>
    </Box>
  )
}

// Comparar dos posibles duplicados (posibles-duplicados.md). A es el caso desde el que se abrió:
// si se consolida, sobrevive A. Consolidar es irreversible y pide la casilla marcada (RN-14, RN-15).
export default function Comparar() {
  const { a, b } = useParams()
  const navigate = useNavigate()
  const avisar = useAvisar()
  const { datos, error } = useApi(() => api.comparar(a, b), [a, b])
  const [elecciones, setElecciones] = useState({})
  const [confirmado, setConfirmado] = useState(false)
  const [distintos, setDistintos] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState(null)

  if (error) return <NoEncontrada />
  const resuelta = datos.coincidencia?.estado !== 'pendiente'
  const filas = datos.filas.map((f) => ({ ...f, izq: mostrarValor(f, f.a), der: mostrarValor(f, f.b), estado: estadoFila(f.a, f.b) }))
  const cuenta = (e) => filas.filter((f) => (e === 'solo' ? f.estado.startsWith('solo') : f.estado === e)).length
  const grupos = [...new Set(filas.map((f) => f.grupo))]

  function consolidar() {
    try {
      // Por defecto queda A: solo se mandan las filas distintas en que el agente eligió B.
      const elegidasB = Object.fromEntries(Object.entries(elecciones).filter(([, lado]) => lado === 'der').map(([campo]) => [campo, 'b']))
      api.consolidar(a, b, elegidasB)
      avisar('exito', `${b} consolidado en ${a}`)
      navigate(`/casos/${a}`)
    } catch (e) {
      if (!(e instanceof ErrorApi)) throw e
      setErrorGeneral(e.message)
    }
  }

  return (
    <>
      <EncabezadoPagina volver={`/casos/${a}`} titulo="Comparar registros" bajada="Mismo DNI de la víctima: decidí si es el mismo hecho o son casos distintos." extra={<NotaDatosEjemplo />} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Mensaje tipo="info" titulo="Posible duplicado: la víctima tiene el mismo DNI">
          {dni(datos.dni)} es víctima en {a} y en {b}. Compará los dos casos y decidí si son el mismo hecho cargado dos veces.
        </Mensaje>
        {errorGeneral && <Mensaje tipo="error" onCerrar={() => setErrorGeneral(null)}>{errorGeneral}</Mensaje>}
        {resuelta && <Mensaje tipo="advertencia">Este posible duplicado ya fue resuelto. La comparación queda solo para consulta.</Mensaje>}
        {datos.noConsolidable && (
          <Mensaje tipo="advertencia">
            {datos.noConsolidable.numero} está {datos.noConsolidable.estado.toLowerCase()}: no se puede consolidar ni resolver este posible duplicado. Solo se consolidan casos registrados, en seguimiento o finalizados.
          </Mensaje>
        )}

        <Panel>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: '10px 12px', borderBottom: 1, borderColor: 'divider', fontSize: 12.5 }}>
            <Box component="span" sx={{ fontFamily: fuentes.mono, color: 'text.secondary' }}>{cuenta('igual')} iguales · {cuenta('distinto')} distintos · {cuenta('solo')} solo en uno</Box>
            <Box component="span" sx={{ ml: 'auto', color: 'text.tertiary', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Box component="span" sx={{ width: 10, height: 10, border: 1, borderColor: 'dup.main', bgcolor: 'dup.soft', borderRadius: '2px' }} />
              Lo marcado en violeta es lo que sobrevive si consolidás.
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '160px minmax(0,1fr) 32px minmax(0,1fr)' }, gap: 1, px: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Cabecera caso={datos.a} />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Cabecera caso={datos.b} />
          </Box>
          {grupos.map((g) => (
            <Box key={g}>
              <GrupoComparacion titulo={g} />
              {filas.filter((f) => f.grupo === g).map((f) => (
                <FilaComparacion
                  key={f.campo}
                  id={f.campo}
                  etiqueta={f.etiqueta}
                  codigo={f.codigo}
                  mono={f.mono}
                  izq={f.izq}
                  der={f.der}
                  elegido={elecciones[f.campo] ?? 'izq'}
                  onElegir={(lado) => setElecciones((x) => ({ ...x, [f.campo]: lado }))}
                />
              ))}
            </Box>
          ))}
        </Panel>

        {datos.acciones.includes('consolidar') && (
          <Panel sx={{ p: { xs: 2, sm: '16px 20px' } }}>
            <Box sx={{ fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'text.tertiary', fontFamily: fuentes.mono }}>Desenlace</Box>
            <Box component="h2" sx={{ m: '4px 0 2px', fontFamily: fuentes.titulos, fontSize: 17, fontWeight: 600 }}>Decidí qué pasa con estos dos registros</Box>
            <Box sx={{ fontSize: 13.5, color: 'text.tertiary', mb: 2 }}>Cada camino deja un rastro distinto en el registro provincial. Elegí uno solo.</Box>

            <Box sx={{ border: 1, borderColor: 'dup.main', borderLeft: 4, borderLeftColor: 'dup.main', borderRadius: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '10px 14px', bgcolor: 'dup.soft', color: 'dup.main' }}>
                <MergeTypeIcon />
                <Box component="strong" sx={{ fontFamily: fuentes.titulos, fontSize: 15.5 }}>Consolidar en un registro único</Box>
                <Box component="span" sx={{ ml: 'auto', fontFamily: fuentes.mono, fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase' }}>Irreversible</Box>
              </Box>
              <Box sx={{ p: '12px 14px', fontSize: 13.5 }}>
                Es el mismo incidente, cargado dos veces. Queda un solo caso con los valores que elegiste arriba, y se conserva la trazabilidad de los dos originales: quién cargó cada uno, cuándo y con qué datos.
                <Box sx={{ display: 'inline-block', mt: 1.5, p: '6px 10px', border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.default', fontFamily: fuentes.mono, fontSize: 12.5 }}>
                  {a} + {b} → {a} <Box component="span" sx={{ fontFamily: 'inherit', color: 'text.tertiary' }}>· el {b.slice(-4)} queda Unificado y apunta a este caso</Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
                  <Casilla etiqueta="Confirmo que los dos casos son el mismo incidente, cargado dos veces." marcada={confirmado} onCambio={setConfirmado} />
                  <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button variant="contained" disabled={!confirmado} onClick={consolidar} startIcon={<MergeTypeIcon />} sx={{ bgcolor: 'dup.main', color: 'dup.contrastText', '&:hover': { bgcolor: 'dup.main' } }}>
                      Consolidar registros
                    </Button>
                    <Box sx={{ fontSize: 12, color: 'text.tertiary', maxWidth: 220 }}>{confirmado ? 'Es irreversible: revisá los valores marcados arriba.' : 'Marcá la confirmación para habilitar'}</Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Button variant="outlined" color="inherit" onClick={() => setDistintos(true)} sx={{ borderColor: 'divider' }}>No es duplicado: son casos distintos</Button>
              <Box sx={{ fontSize: 12.5, color: 'text.tertiary' }}>Otro ataque a la misma persona. Guarda la decisión y saca la marca de posible duplicado; el aviso no vuelve a salir para estos dos casos.</Box>
            </Box>
          </Panel>
        )}
      </Box>

      {distintos && <NoEsDuplicado numeroA={a} numeroB={b} onCerrar={() => setDistintos(false)} onListo={() => navigate('/casos/duplicados')} />}
    </>
  )
}
