import { Box } from '@mui/material'
import { fuentes } from '@/tema/tokens'

// Tabla densa con encabezado fijo, hover de fila y columna de acciones clavada a la derecha.
// Las columnas se describen con { clave, titulo, celda(fila), acciones? }.
export default function Tabla({ columnas, filas, claveFila = (f) => f.id, densa = false, anchoMinimo = 1180, vacio = 'Sin resultados.', atributosFila }) {
  const padding = densa ? '6px 14px' : '12px 14px'
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box
        component="table"
        sx={{
          borderCollapse: 'collapse',
          width: '100%',
          minWidth: anchoMinimo,
          '& thead th': {
            position: 'sticky',
            top: 0,
            bgcolor: 'background.paper',
            textAlign: 'left',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '.07em',
            textTransform: 'uppercase',
            color: 'text.tertiary',
            p: '12px 14px',
            borderBottom: 1,
            borderColor: 'divider',
            whiteSpace: 'nowrap',
            zIndex: 2,
          },
          '& tbody td': {
            p: padding,
            borderBottom: 1,
            borderColor: 'divider',
            verticalAlign: 'top',
            whiteSpace: 'nowrap',
            bgcolor: 'background.paper',
          },
          '& tbody tr:last-of-type td': { borderBottom: 'none' },
          '& tbody tr td': { transition: 'background .1s ease' },
          '& tbody tr:hover td': { bgcolor: 'background.rowHover' },
          // Variables que leen las piezas que pintan su propio fondo (marcas, chips).
          '& tbody tr:hover': {
            '--fondo-marca': 'var(--siram-palette-background-rowHover)',
            '--fondo-origen': 'var(--siram-palette-background-paper)',
          },
          '& .col-acc': {
            position: 'sticky',
            right: 0,
            borderLeft: 1,
            borderLeftColor: 'divider',
            borderLeftStyle: 'solid',
            width: 52,
            px: 1,
            textAlign: 'center',
          },
          '& thead th.col-acc': { zIndex: 3 },
        }}
      >
        <thead>
          <tr>
            {columnas.map((c) => (
              <th key={c.clave} scope="col" className={c.acciones ? 'col-acc' : undefined} aria-label={c.acciones ? c.titulo : undefined}>
                {c.acciones ? null : c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr>
              <Box component="td" colSpan={columnas.length} sx={{ textAlign: 'center', color: 'text.tertiary', py: '32px !important' }}>
                {vacio}
              </Box>
            </tr>
          ) : (
            filas.map((fila) => (
              <tr key={claveFila(fila)} {...atributosFila?.(fila)}>
                {columnas.map((c) => (
                  <td key={c.clave} className={c.acciones ? 'col-acc' : undefined}>{c.celda(fila)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Box>
    </Box>
  )
}

// Texto principal de una celda con una segunda línea más chica debajo.
export function CeldaDoble({ principal, secundario, mono = false, destacado = false }) {
  const tipoMono = { fontFamily: fuentes.mono, fontVariantNumeric: 'tabular-nums', letterSpacing: '-.01em' }
  return (
    <>
      <Box component="span" sx={{ ...(mono && { ...tipoMono, fontSize: 13.5 }), ...(destacado && { color: 'text.primary', fontWeight: 600 }) }}>
        {principal}
      </Box>
      {secundario != null && (
        <Box
          component="span"
          sx={{ display: 'block', mt: '2px', fontSize: mono ? 12 : 12.5, color: 'text.tertiary', fontWeight: 400, ...(mono && tipoMono) }}
        >
          {secundario}
        </Box>
      )}
    </>
  )
}
