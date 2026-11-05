import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Box, Button, Popover } from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import ChipFiltro from '@/componentes/ChipFiltro'
import ChipDato from '@/componentes/ChipDato'
import Mensaje from '@/componentes/Mensaje'
import { CampoFechaHora } from '@/componentes/formulario/Campos'
import { fechaInvalida } from '@/utiles/validacion'
import { api, useApi } from '@/mocks'
import { fuentes } from '@/tema/tokens'
import { fechaHora } from '@/utiles/formato'
import NoEncontrada from '@/pantallas/NoEncontrada'

// `sobre` de cada cambio → filtro. Los documentos entran en Caso.
const filtros = [
  { clave: 'todo', etiqueta: 'Todo', sobre: null },
  { clave: 'caso', etiqueta: 'Caso', sobre: ['caso', 'documento'] },
  { clave: 'personas', etiqueta: 'Personas', sobre: ['persona'] },
  { clave: 'animales', etiqueta: 'Animales', sobre: ['animal'] },
  { clave: 'tratamiento', etiqueta: 'Tratamiento', sobre: ['tratamiento'] },
  { clave: 'denuncias', etiqueta: 'Denuncias', sobre: ['denuncia'] },
  { clave: 'solicitudes', etiqueta: 'Solicitudes', sobre: ['solicitud'] },
]

const iniciales = (nombre) => nombre.replace('.', '').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()

function Evento({ evento: e, atenuado }) {
  const sistema = e.por == null
  return (
    <Box component="li" sx={{ display: 'flex', gap: 1.5, p: '14px 0', borderBottom: 1, borderColor: 'divider', opacity: atenuado ? 0.4 : 1, '&:last-of-type': { borderBottom: 'none' } }}>
      <Box
        aria-hidden
        sx={{
          width: 28, height: 28, flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontFamily: fuentes.titulos,
          ...(sistema ? { border: 1, borderStyle: 'dashed', borderColor: 'text.tertiary', color: 'text.tertiary' } : { bgcolor: 'primary.soft', color: 'primary.main' }),
        }}
      >
        {sistema ? <SettingsOutlinedIcon sx={{ fontSize: 15 }} /> : iniciales(e.por)}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Box component="strong" sx={{ fontSize: 14 }}>{sistema ? 'Sistema' : e.por}</Box>
          {sistema ? (
            <ChipDato sx={{ fontFamily: fuentes.mono, fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase', py: '1px' }}>Automático</ChipDato>
          ) : (
            <Box component="span" sx={{ fontSize: 12, color: 'text.tertiary' }}>{e.organismo}</Box>
          )}
          <Box component="span" sx={{ fontFamily: fuentes.mono, fontSize: 12.5, color: 'text.secondary' }}>{fechaHora(e.fecha)}</Box>
        </Box>
        <Box sx={{ fontSize: 14, mt: '2px' }}>
          {e.frase}
          {e.desde && <> Desde {e.desde}.</>}
          {e.desdeCaso && <> Desde <Box component={Link} to={`/casos/${e.desdeCaso}`} sx={{ color: 'primary.main' }}>{e.desdeCaso}</Box>.</>}
        </Box>
        {e.cambios.length > 0 && (
          <Box component="ul" sx={{ listStyle: 'none', m: '8px 0 0', p: 0, fontFamily: fuentes.mono, fontSize: 12.5, color: 'text.secondary', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {e.cambios.map((c) => (
              <li key={c.campo}>
                {c.campo}: {e.tipo === 'creacion' && c.despues === 'creación' ? 'creación' : <>{c.antes ?? '—'} → {c.despues ?? '—'}</>}
                {e.sobre === 'persona' && e.desde && <> · persona compartida: el cambio se ve en todos sus casos</>}
              </li>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

// Historial del caso (historial.md): solo lectura, del cambio más nuevo al más viejo.
export default function Historial() {
  const { numero } = useParams()
  const { datos, error } = useApi(() => api.historialCaso(numero), [numero])
  const [filtro, setFiltro] = useState('todo')
  const [ancla, setAncla] = useState(null)
  const [fechaElegida, setFechaElegida] = useState('')
  const [corte, setCorte] = useState(null)

  const eventos = useMemo(() => datos?.eventos ?? [], [datos])
  const cantidades = useMemo(() => Object.fromEntries(filtros.map((f) => [f.clave, f.sobre ? eventos.filter((e) => f.sobre.includes(e.sobre)).length : eventos.length])), [eventos])
  if (error) return <NoEncontrada />

  const sobre = filtros.find((f) => f.clave === filtro).sobre
  const visibles = sobre ? eventos.filter((e) => sobre.includes(e.sobre)) : eventos
  const creacion = eventos.at(-1)?.fecha
  const corteValido = corte && corte >= creacion

  function verEnFecha() {
    setCorte(fechaElegida)
    setAncla(null)
  }

  return (
    <>
      <EncabezadoPagina
        volver={`/casos/${numero}`}
        titulo={`Historial · ${numero}`}
        bajada="Cada cambio guarda la foto completa del registro: quién, cuándo, desde qué organismo y desde qué caso se hizo."
        extra={<NotaDatosEjemplo />}
      />

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
        {filtros.map((f) => <ChipFiltro key={f.clave} etiqueta={f.etiqueta} cantidad={cantidades[f.clave]} activo={filtro === f.clave} onClick={() => setFiltro(f.clave)} />)}
        <Button variant="outlined" color="inherit" startIcon={<CalendarTodayOutlinedIcon />} onClick={(e) => setAncla(e.currentTarget)} sx={{ ml: { sm: 'auto' }, borderColor: 'divider', bgcolor: 'background.paper' }}>
          Ver cómo estaba en una fecha
        </Button>
        <Popover open={Boolean(ancla)} anchorEl={ancla} onClose={() => setAncla(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Box sx={{ p: 2, width: 280 }}>
            <CampoFechaHora etiqueta="Fecha y hora" mono valor={fechaElegida} onCambio={setFechaElegida} />
            <Button variant="contained" fullWidth disabled={!fechaElegida || fechaInvalida(fechaElegida)} onClick={verEnFecha}>Ver</Button>
          </Box>
        </Popover>
      </Box>

      {corte && (
        corteValido ? (
          <Mensaje tipo="info" sx={{ mb: 2 }} acciones={<Button variant="outlined" color="inherit" onClick={() => setCorte(null)}>Volver al presente</Button>}>
            Mostrando el caso como estaba el {fechaHora(corte)}. Los cambios posteriores se ven atenuados.
          </Mensaje>
        ) : (
          <Mensaje tipo="advertencia" sx={{ mb: 2 }} onCerrar={() => setCorte(null)}>El caso todavía no existía en esa fecha.</Mensaje>
        )
      )}

      <Panel sx={{ px: 2.5 }}>
        {visibles.length ? (
          <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {visibles.map((e) => <Evento key={`${e.fecha}-${e.orden ?? 0}-${e.frase}`} evento={e} atenuado={corteValido && e.fecha > corte} />)}
          </Box>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center', color: 'text.tertiary' }}>No hay cambios de este tipo en el caso.</Box>
        )}
      </Panel>
      <Box sx={{ mt: 2, fontSize: 12.5, color: 'text.tertiary' }}>El historial no se edita ni se borra. Las credenciales de los usuarios nunca se copian en él.</Box>
    </>
  )
}
