import { Box, Tooltip } from '@mui/material'
import { fuentes } from '@/tema/tokens'
import { marcas as catalogo } from './catalogos'

const base = {
  width: 17,
  height: 17,
  flex: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid currentColor',
  borderRadius: '3px',
  fontFamily: fuentes.titulos,
  fontWeight: 800,
  fontSize: 11,
  lineHeight: 1,
  position: 'relative',
}

const estilos = {
  incompleto: { color: 'error.main', bgcolor: 'error.soft' },
  // Dos cuadrados superpuestos: el de atrás asoma arriba a la derecha.
  duplicado: {
    color: 'dup.main',
    bgcolor: 'dup.soft',
    width: 14,
    height: 14,
    m: '3px 3px 0 0',
    '&::after': {
      content: '""',
      position: 'absolute',
      right: -4,
      top: -4,
      width: 13,
      height: 13,
      border: '1px solid currentColor',
      borderRadius: '3px',
      bgcolor: 'var(--fondo-marca, var(--siram-palette-background-paper))',
    },
  },
  // Rojo relleno con "!" claro: lo distingue de Incompleto (rojo suave con borde).
  grave: { color: 'background.paper', bgcolor: 'error.main', borderColor: 'error.main' },
}

const simbolos = { incompleto: '!', duplicado: null, grave: '!' }
const orden = Object.keys(catalogo)

const nombresFaltantes = {
  fechaHecho: 'fecha del hecho',
  'lugar.ciudad': 'ciudad',
  'lugar.direccion': 'lugar',
  tipoLugar: 'tipo de lugar',
  'victima.edad': 'edad de la víctima',
  tipoEvento: 'tipo de evento',
}

// Si la API manda qué datos faltan, el tooltip de Incompleto los nombra (incompletos.md).
function descripcion(marca, faltantes) {
  if (marca !== 'incompleto' || !faltantes?.length) return catalogo[marca]?.descripcion ?? marca
  const nombres = faltantes.map((f) => nombresFaltantes[f] ?? f)
  const lista = nombres.length > 1 ? `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}` : nombres[0]
  return `Incompleto: ${nombres.length > 1 ? 'faltan' : 'falta'} ${lista}`
}

export function MarcaCaso({ marca, conTooltip = true, faltantes }) {
  const texto = descripcion(marca, faltantes)
  const icono = (
    <Box component="span" role="img" aria-label={texto} sx={{ ...base, ...estilos[marca] }}>
      {simbolos[marca]}
    </Box>
  )
  return conTooltip ? <Tooltip title={texto}>{icono}</Tooltip> : icono
}

// Marcas paralelas del caso (pueden ser varias). Van pegadas al identificador, a la izquierda,
// siempre en el mismo orden: incompleto, posible duplicado, grave. Llegan calculadas por la API.
export default function MarcasCaso({ marcas = [], faltantes }) {
  const ordenadas = [...marcas].sort((a, b) => orden.indexOf(a) - orden.indexOf(b))
  return (
    <Box component="span" sx={{ display: 'flex', gap: '5px', alignItems: 'center', minHeight: 20 }}>
      {ordenadas.map((m) => <MarcaCaso key={m} marca={m} faltantes={faltantes} />)}
    </Box>
  )
}
