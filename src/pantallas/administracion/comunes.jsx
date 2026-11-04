import { useState } from 'react'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

// Píldora Activo / Inactivo. En SIRAM nada se borra: se desactiva (RN-06b).
export function Vigencia({ activo }) {
  return (
    <Box component="span" sx={{ display: 'inline-block', px: 1.25, height: 22, lineHeight: '22px', borderRadius: 999, fontSize: 12, fontWeight: 600, bgcolor: activo ? 'success.soft' : 'neutral.soft', color: activo ? 'success.main' : 'text.secondary' }}>
      {activo ? 'Activo' : 'Inactivo'}
    </Box>
  )
}

// Menú ⋮ de una fila. `acciones`: [{ texto, onClick }].
export function MenuFila({ etiqueta, acciones }) {
  const [ancla, setAncla] = useState(null)
  return (
    <>
      <IconButton aria-label={etiqueta} aria-haspopup="menu" onClick={(e) => setAncla(e.currentTarget)} sx={{ width: 30, height: 30, color: 'text.tertiary' }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={ancla} open={Boolean(ancla)} onClose={() => setAncla(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {acciones.map((a) => <MenuItem key={a.texto} onClick={() => { setAncla(null); a.onClick() }}>{a.texto}</MenuItem>)}
      </Menu>
    </>
  )
}
