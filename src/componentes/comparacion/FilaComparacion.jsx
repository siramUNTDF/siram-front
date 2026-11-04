import { Box, Radio } from '@mui/material'
import ContrastIcon from '@mui/icons-material/Contrast'
import { fuentes } from '@/tema/tokens'
import { estadoFila } from './valores'

function Celda({ valor, mono, estado, lado, elegido, onElegir, nombreGrupo }) {
  const conserva = estado === `solo_${lado}`
  const elegible = estado === 'distinto'
  const marcada = conserva || (elegible && elegido === lado)
  const vacio = valor == null || valor === ''
  return (
    <Box
      component={elegible ? 'label' : 'div'}
      sx={{
        display: 'flex', alignItems: 'center', gap: '4px', minHeight: 36, p: '6px 10px', borderRadius: 1, border: 1,
        borderColor: marcada ? 'dup.main' : 'transparent', bgcolor: marcada ? 'dup.soft' : 'transparent',
        cursor: elegible ? 'pointer' : 'default', fontSize: 14, minWidth: 0,
      }}
    >
      {elegible && <Radio size="small" checked={elegido === lado} onChange={() => onElegir(lado)} name={nombreGrupo} sx={{ p: '4px', color: 'text.tertiary', '&.Mui-checked': { color: 'dup.main' } }} />}
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ color: vacio ? 'text.tertiary' : 'text.primary', ...(mono && !vacio && { fontFamily: fuentes.mono, fontSize: 13.5 }), overflowWrap: 'anywhere' }}>
          {vacio ? 'Sin dato' : valor}
        </Box>
        {conserva && <Box sx={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'dup.main' }}>Se conserva</Box>}
      </Box>
    </Box>
  )
}

// «Solo en uno»: medio círculo lleno del lado que tiene el dato.
const simbolos = { igual: '=', distinto: '≠', solo_izq: <ContrastIcon sx={{ fontSize: 14, transform: 'scaleX(-1)' }} />, solo_der: <ContrastIcon sx={{ fontSize: 14 }} /> }

// Fila de comparación: campo · valor izquierdo · símbolo · valor derecho. Lo marcado en violeta es lo que queda.
export default function FilaComparacion({ etiqueta, codigo, izq, der, mono, elegido, onElegir, id }) {
  const estado = estadoFila(izq, der)
  return (
    <Box
      sx={{
        display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '160px minmax(0,1fr) 32px minmax(0,1fr)' }, alignItems: 'center', gap: { xs: '4px', sm: 1 },
        p: '6px 12px', borderBottom: 1, borderColor: 'divider', borderLeft: 3, borderLeftColor: estado === 'distinto' ? 'warning.main' : 'transparent',
      }}
    >
      <Box sx={{ fontSize: 13 }}>
        {codigo && <Box sx={{ fontFamily: fuentes.mono, fontSize: 10.5, color: 'text.tertiary' }}>{codigo}</Box>}
        <Box sx={{ fontWeight: estado === 'distinto' ? 600 : 400 }}>{etiqueta}</Box>
      </Box>
      <Celda valor={izq} mono={mono} estado={estado} lado="izq" elegido={elegido} onElegir={onElegir} nombreGrupo={id} />
      <Box
        aria-label={{ igual: 'Iguales', distinto: 'Distintos', solo_izq: 'Solo en el primero', solo_der: 'Solo en el segundo' }[estado]}
        sx={{ display: { xs: 'none', sm: 'flex' }, width: 22, height: 22, borderRadius: '50%', border: 1, alignItems: 'center', justifyContent: 'center', fontSize: 12, justifySelf: 'center',
          borderColor: estado === 'distinto' ? 'warning.main' : 'divider', color: estado === 'distinto' ? 'warning.main' : 'text.tertiary', bgcolor: estado === 'distinto' ? 'warning.soft' : 'background.paper' }}
      >
        {simbolos[estado]}
      </Box>
      <Celda valor={der} mono={mono} estado={estado} lado="der" elegido={elegido} onElegir={onElegir} nombreGrupo={id} />
    </Box>
  )
}

export function GrupoComparacion({ titulo }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '14px 12px 6px', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'text.tertiary' }}>
      {titulo}
      <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
    </Box>
  )
}
