import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Box, ButtonBase, IconButton, ListSubheader, Menu, MenuItem, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CheckIcon from '@mui/icons-material/Check'
import { cascara, fuentes } from '@/tema/tokens'
import { api, perfiles } from '@/mocks'

const textoPerfil = {
  zoonosis: 'Agente de Zoonosis',
  salud: 'Agente de Salud',
  cadic: 'Agente de CADIC',
  analista: 'Consulta (analista)',
  administrador: 'Administrador',
}

// Barra fija de 89 px: identidad a la izquierda, usuario a la derecha.
// Ningún organismo aparece acá: SIRAM no lleva la marca de nadie.
export default function BarraSuperior({ usuario, onAlternarMenu, etiquetaMenu }) {
  const [ancla, setAncla] = useState(null)
  const navigate = useNavigate()

  // Solo para la demo: con la API, quién mira lo da el login. Cambia los datos que «manda» el servidor de ejemplo.
  function verComo(clave) {
    setAncla(null)
    api.cambiarPerfil(clave)
    navigate('/')
  }

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        inset: '0 0 auto 0',
        height: cascara.alturaBarra,
        bgcolor: 'background.chrome',
        boxShadow: (t) => `0 1px 2px ${t.vars.palette.sombra}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        pl: 1.5,
        pr: { xs: 1.5, sm: 2.5 },
        zIndex: 30,
      }}
    >
      <IconButton
        onClick={onAlternarMenu}
        aria-label={etiquetaMenu}
        sx={{
          width: 40,
          height: 40,
          color: 'text.secondary',
          '&:hover': { bgcolor: 'background.chromeHover', color: 'text.primary' },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Box sx={{ ml: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography
          component="span"
          sx={{
            fontFamily: fuentes.titulos,
            fontWeight: 800,
            fontSize: { xs: 20, sm: 23 },
            letterSpacing: '.14em',
            lineHeight: 1,
            color: 'text.primary',
          }}
        >
          SIRAM
        </Typography>
        <Typography component="span" sx={{ mt: '5px', fontSize: 12, color: 'text.tertiary', letterSpacing: '.01em' }}>
          Registro de Ataques y Mordeduras
        </Typography>
      </Box>

      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Typography
          component="span"
          sx={{ fontSize: 14, color: 'text.secondary', whiteSpace: 'nowrap', display: { xs: 'none', md: 'inline' } }}
        >
          {usuario.nombre}
        </Typography>
        <Box aria-hidden sx={{ width: '1px', height: 28, bgcolor: 'divider', mx: 1 }} />
        <ButtonBase
          aria-label={`Cuenta de ${usuario.nombre}`}
          aria-haspopup="menu"
          onClick={(e) => setAncla(e.currentTarget)}
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'primary.soft',
            color: 'primary.main',
            fontFamily: fuentes.titulos,
            fontWeight: 600,
            fontSize: 14,
            border: '1px solid transparent',
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          {usuario.iniciales}
        </ButtonBase>
        <Menu anchorEl={ancla} open={Boolean(ancla)} onClose={() => setAncla(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <ListSubheader sx={{ lineHeight: 1.4, py: 1, fontSize: 12, color: 'text.tertiary', maxWidth: 260 }}>
            Datos de ejemplo · ver la demo como:
          </ListSubheader>
          {Object.keys(perfiles).map((clave) => (
            <MenuItem key={clave} onClick={() => verComo(clave)} selected={usuario.clave === clave} sx={{ gap: 1, fontSize: 14 }}>
              <Box sx={{ width: 18, display: 'flex' }}>{usuario.clave === clave && <CheckIcon sx={{ fontSize: 18 }} />}</Box>
              {textoPerfil[clave]}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  )
}
