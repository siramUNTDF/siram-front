import { useId } from 'react'
import { Box, Checkbox, InputBase, MenuItem, Radio, Select, Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'
import { fuentes } from '@/tema/tokens'

const estiloEntrada = {
  width: '100%',
  minHeight: 38,
  px: 1.5,
  bgcolor: 'background.paper',
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  color: 'text.primary',
  fontSize: 14.5,
  '& input::placeholder, & textarea::placeholder': { color: 'text.tertiary', opacity: 1 },
  '&.Mui-focused': { borderColor: 'foco', outline: (t) => `2px solid ${t.vars.palette.foco}`, outlineOffset: '-1px' },
  '&.Mui-error': { borderColor: 'error.main' },
  '&.Mui-disabled': { bgcolor: 'background.default' },
}

// Etiqueta con * si es obligatorio y la ayuda en un ícono al lado (nunca como texto debajo).
export function Etiqueta({ htmlFor, id, texto, requerido, ayuda, componente = 'label' }) {
  return (
    <Box component={componente} htmlFor={htmlFor} id={id} sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: '6px', fontSize: 13.5, fontWeight: 600, color: 'text.primary' }}>
      {texto}
      {requerido && <Box component="span" aria-hidden sx={{ color: 'error.main' }}>*</Box>}
      {ayuda && (
        <Tooltip title={ayuda}>
          <HelpOutlineIcon tabIndex={0} aria-label={`Ayuda: ${ayuda}`} sx={{ fontSize: 16, color: 'text.tertiary', ml: '2px' }} />
        </Tooltip>
      )}
    </Box>
  )
}

// 20 px reservados para el error, debajo de cada campo.
export function Error({ id, children }) {
  return (
    <Box id={id} role={children ? 'alert' : undefined} sx={{ minHeight: 20, pt: '3px', fontSize: 12, color: 'error.main', lineHeight: 1.3 }}>
      {children}
    </Box>
  )
}

export function Texto({ etiqueta, valor, onCambio, error, requerido, ayuda, tipo = 'text', placeholder, multilinea = false, mono = false, nota, deshabilitado, sx, ...props }) {
  const id = useId()
  return (
    <Box sx={{ minWidth: 0, ...sx }}>
      <Etiqueta htmlFor={id} texto={etiqueta} requerido={requerido} ayuda={ayuda} />
      <InputBase
        id={id}
        type={tipo}
        value={valor ?? ''}
        onChange={(e) => onCambio(e.target.value)}
        placeholder={placeholder}
        error={Boolean(error)}
        multiline={multilinea}
        minRows={multilinea ? 3 : undefined}
        disabled={deshabilitado}
        inputProps={{ 'aria-invalid': Boolean(error), 'aria-required': requerido, ...props.inputProps }}
        sx={{ ...estiloEntrada, py: multilinea ? 1 : 0, ...(mono && { fontFamily: fuentes.mono, fontVariantNumeric: 'tabular-nums' }) }}
      />
      {nota && <Box sx={{ fontSize: 12, color: 'text.tertiary', mt: '4px' }}>{nota}</Box>}
      <Error>{error}</Error>
    </Box>
  )
}

// `opciones`: objeto { valor: etiqueta } o lista de [valor, etiqueta].
const comoLista = (opciones) => (Array.isArray(opciones) ? opciones : Object.entries(opciones))

export function Seleccion({ etiqueta, valor, onCambio, opciones, vacio = 'Elegí una opción', error, requerido, ayuda, sx }) {
  const id = useId()
  return (
    <Box sx={{ minWidth: 0, ...sx }}>
      <Etiqueta id={id} componente="div" texto={etiqueta} requerido={requerido} ayuda={ayuda} />
      <Select
        value={valor ?? ''}
        onChange={(e) => onCambio(e.target.value === '' ? null : e.target.value)}
        displayEmpty
        input={<InputBase sx={estiloEntrada} />}
        inputProps={{ 'aria-labelledby': id }}
        error={Boolean(error)}
        renderValue={(v) => (v === '' || v == null ? <Box component="span" sx={{ color: 'text.tertiary' }}>{vacio}</Box> : comoLista(opciones).find(([k]) => String(k) === String(v))?.[1] ?? v)}
      >
        {vacio && <MenuItem value="">{vacio}</MenuItem>}
        {comoLista(opciones).map(([k, t]) => <MenuItem key={k} value={k}>{t}</MenuItem>)}
      </Select>
      <Error>{error}</Error>
    </Box>
  )
}

// Opciones de radio. `descripciones` agrega un texto debajo de cada una.
export function Opciones({ etiqueta, valor, onCambio, opciones, error, requerido, ayuda, vertical = false, descripciones, nota, sinError = false }) {
  const id = useId()
  return (
    <Box role="radiogroup" aria-labelledby={id} sx={{ minWidth: 0 }}>
      {etiqueta && <Etiqueta id={id} componente="div" texto={etiqueta} requerido={requerido} ayuda={ayuda} />}
      <Box sx={{ display: 'flex', flexDirection: vertical || descripciones ? 'column' : 'row', flexWrap: 'wrap', columnGap: 2.5, rowGap: descripciones ? 1 : 0 }}>
        {comoLista(opciones).map(([k, t]) => (
          <Box key={k} component="label" sx={{ display: 'flex', alignItems: descripciones ? 'flex-start' : 'center', gap: '2px', cursor: 'pointer', fontSize: 14.5 }}>
            <Radio checked={valor === k} onChange={() => onCambio(k)} value={k} size="small" sx={{ p: '6px', color: 'text.tertiary', '&.Mui-checked': { color: 'primary.main' } }} />
            <Box sx={{ pt: descripciones ? '5px' : 0 }}>
              <span>{t}</span>
              {descripciones?.[k] && <Box sx={{ fontSize: 12.5, color: 'text.tertiary' }}>{descripciones[k]}</Box>}
            </Box>
          </Box>
        ))}
      </Box>
      {nota && <Box sx={{ fontSize: 12, color: 'text.tertiary', mt: '4px' }}>{nota}</Box>}
      {!sinError && <Error>{error}</Error>}
    </Box>
  )
}

export function Casilla({ etiqueta, marcada, onCambio, descripcion, deshabilitada }) {
  return (
    <Box component="label" sx={{ display: 'flex', alignItems: 'flex-start', gap: '4px', cursor: deshabilitada ? 'default' : 'pointer', fontSize: 14.5 }}>
      <Checkbox checked={marcada} onChange={(e) => onCambio(e.target.checked)} disabled={deshabilitada} size="small" sx={{ p: '4px', color: 'text.tertiary', '&.Mui-checked': { color: 'primary.main' } }} />
      <Box sx={{ pt: '3px' }}>
        <span>{etiqueta}</span>
        {descripcion && <Box sx={{ fontSize: 12.5, color: 'text.tertiary' }}>{descripcion}</Box>}
      </Box>
    </Box>
  )
}

// Dos campos por fila en escritorio, uno en teléfono.
export function Fila({ children, columnas = 2 }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: `repeat(${columnas}, minmax(0, 1fr))` }, columnGap: 3 }}>
      {children}
    </Box>
  )
}

// Nota chica al pie de un bloque o de una ventana.
export function Nota({ children, sx }) {
  return <Box sx={{ fontSize: 12.5, color: 'text.tertiary', ...sx }}>{children}</Box>
}
