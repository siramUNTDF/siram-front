import { useState } from 'react'
import { Box, ButtonBase } from '@mui/material'
import Panel from '@/componentes/Panel'
import { fuentes } from '@/tema/tokens'

// Barras horizontales. `datos`: [{ etiqueta, valor, destacado?, sinDato?, porcentaje? }].
// El largo es proporcional al valor más alto de ese gráfico; las categorías en 0 no se dibujan.
export function Barras({ datos, conPorcentaje = false, etiquetaArriba = false }) {
  const visibles = datos.filter((d) => d.valor > 0)
  const maximo = Math.max(...visibles.map((d) => d.valor), 1)
  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: etiquetaArriba ? 1.25 : '8px' }}>
      {visibles.map((d) => (
        <Box component="li" key={d.etiqueta} sx={{ display: etiquetaArriba ? 'block' : 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'center', gap: 1.25, fontSize: 13 }}>
          <Box sx={{ textAlign: etiquetaArriba ? 'left' : 'right', color: d.destacado ? 'error.main' : 'text.secondary', fontWeight: d.destacado || etiquetaArriba ? 600 : 400, mb: etiquetaArriba ? '4px' : 0 }}>{d.etiqueta}</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                height: 16, width: `${(d.valor / maximo) * 80}%`, minWidth: 4, borderRadius: '2px',
                ...(d.sinDato
                  ? { border: 1, borderStyle: 'dashed', borderColor: 'text.tertiary', bgcolor: 'neutral.soft' }
                  : { bgcolor: d.destacado ? 'error.main' : 'primary.main' }),
              }}
            />
            <Box component="span" sx={{ fontFamily: fuentes.mono, fontSize: 12.5, fontVariantNumeric: 'tabular-nums', color: d.destacado ? 'error.main' : 'text.primary' }}>{d.valor}</Box>
            {conPorcentaje && d.porcentaje != null && <Box component="span" sx={{ fontFamily: fuentes.mono, fontSize: 11.5, color: 'text.tertiary', ml: 1 }}>{d.porcentaje} %</Box>}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

// Columnas verticales. Una columna `parcial` se dibuja punteada, con su proyección encima.
export function Columnas({ datos, alto = 180, pie }) {
  const visibles = datos
  const maximo = Math.max(...visibles.map((d) => Math.max(d.valor, d.proyectado ?? 0)), 1)
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: { xs: '6px', sm: 1.5 }, height: alto, borderBottom: 1, borderColor: 'divider', pt: 3 }}>
        {visibles.map((d) => (
          <Box key={d.etiqueta} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative' }}>
            {d.proyectado && (
              <Box sx={{ position: 'absolute', bottom: `${(d.proyectado / maximo) * 100}%`, fontFamily: fuentes.mono, fontSize: 11, color: 'text.tertiary', whiteSpace: 'nowrap', mb: '2px' }}>≈{d.proyectado}</Box>
            )}
            {d.proyectado && (
              <Box aria-hidden sx={{ position: 'absolute', bottom: 0, width: '60%', maxWidth: 28, height: `${(d.proyectado / maximo) * 100}%`, border: 1, borderStyle: 'dashed', borderColor: 'text.tertiary', borderBottom: 0, borderRadius: '2px 2px 0 0' }} />
            )}
            {!d.proyectado && <Box sx={{ fontFamily: fuentes.mono, fontSize: 11.5, color: d.destacado ? 'error.main' : 'text.secondary', mb: '3px' }}>{d.valor}</Box>}
            <Box
              sx={{
                width: '60%', maxWidth: 28, height: `${(d.valor / maximo) * 100}%`, minHeight: d.valor ? 2 : 0, borderRadius: '2px 2px 0 0', position: 'relative',
                bgcolor: d.destacado ? 'error.main' : 'primary.main', opacity: d.parcial ? 0.55 : 1,
              }}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: { xs: '6px', sm: 1.5 }, mt: '6px' }}>
        {visibles.map((d) => (
          <Box key={d.etiqueta} sx={{ flex: 1, textAlign: 'center', fontSize: 12, color: d.destacado ? 'error.main' : 'text.secondary', fontWeight: d.destacado ? 600 : 400 }}>
            {d.etiqueta}
            {d.parcial && <Box sx={{ fontSize: 10.5, color: 'text.tertiary', whiteSpace: 'nowrap' }}>{d.notaParcial}</Box>}
          </Box>
        ))}
      </Box>
      {pie && <Box sx={{ mt: 1, fontSize: 12, color: 'text.tertiary' }}>{pie}</Box>}
    </Box>
  )
}

// Tarjeta de gráfico: título, bajada (área · qué mide), el gráfico, pie, nota fija y la tabla
// con las mismas cifras («+ Ver los datos del gráfico»), que es la alternativa accesible.
export function TarjetaGrafico({ titulo, area, mide, children, pie, nota, datos, conPorcentaje = false, vacio = 'Todavía no hay casos este año.', sx }) {
  const [abierta, setAbierta] = useState(false)
  const sinDatos = !datos.some((d) => d.valor > 0)
  return (
    <Panel sx={{ p: '16px 18px', display: 'flex', flexDirection: 'column', ...sx }}>
      <Box component="h3" sx={{ m: 0, fontFamily: fuentes.titulos, fontWeight: 600, fontSize: 15.5 }}>{titulo}</Box>
      <Box sx={{ fontSize: 12, color: 'text.tertiary', mb: 2 }}>
        <Box component="span" sx={{ fontFamily: fuentes.mono, fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase' }}>{area}</Box> · {mide}
      </Box>
      {sinDatos ? <Box sx={{ py: 4, textAlign: 'center', color: 'text.tertiary', fontSize: 14 }}>{vacio}</Box> : children}
      {pie && <Box sx={{ mt: 1.5, fontSize: 12, color: 'text.tertiary' }}>{pie}</Box>}
      <Box sx={{ mt: 'auto', pt: 1.5 }}>
        {nota && <Box sx={{ pt: 1.5, borderTop: 1, borderColor: 'divider', fontSize: 12.5, color: 'text.secondary' }}>{nota}</Box>}
        <ButtonBase onClick={() => setAbierta((v) => !v)} aria-expanded={abierta} sx={{ mt: 1, fontSize: 12.5, color: 'text.tertiary', '&:hover': { color: 'primary.main' } }}>
          {abierta ? '− Ocultar los datos' : '+ Ver los datos del gráfico'}
        </ButtonBase>
        {abierta && (
          <Box component="table" sx={{ mt: 1, borderCollapse: 'collapse', fontSize: 13, '& td, & th': { p: '4px 12px 4px 0', textAlign: 'left', borderBottom: 1, borderColor: 'divider' }, '& th': { fontWeight: 600, color: 'text.tertiary', fontSize: 11.5 } }}>
            <thead><tr><th scope="col">Categoría</th><th scope="col">Cantidad</th>{conPorcentaje && <th scope="col">%</th>}</tr></thead>
            <tbody>
              {datos.map((d) => (
                <tr key={d.etiqueta}>
                  <td>{d.etiqueta}{d.parcial ? ' (parcial)' : ''}</td>
                  <Box component="td" sx={{ fontFamily: fuentes.mono }}>{d.valor}{d.proyectado ? ` (≈${d.proyectado} proyectado)` : ''}</Box>
                  {conPorcentaje && <Box component="td" sx={{ fontFamily: fuentes.mono }}>{d.porcentaje ?? '—'}</Box>}
                </tr>
              ))}
            </tbody>
          </Box>
        )}
      </Box>
    </Panel>
  )
}
