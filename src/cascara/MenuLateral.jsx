import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Box, ButtonBase, Collapse, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { fuentes } from '@/tema/tokens'

// La firma de Delta: píldora abierta a la derecha, sangrada desde el borde izquierdo.
const ItemMenu = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'colapsado' && prop !== 'sub' && prop !== 'abierto' && prop !== 'activo',
})(({ theme, colapsado, sub, abierto, activo }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: colapsado ? 'calc(100% - 12px)' : 'calc(100% - 22px)',
  minHeight: sub ? 40 : 44,
  padding: sub ? '8px 20px 8px 40px' : '8px 20px',
  borderRadius: '0 30px 30px 0',
  color: theme.vars.palette.text.secondary,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  transition: 'background .12s ease, color .12s ease',
  '&:hover': {
    background: theme.vars.palette.background.chromeHover,
    color: theme.vars.palette.text.primary,
  },
  ...(abierto && { color: theme.vars.palette.text.primary, fontWeight: 600 }),
  '&[aria-current="page"]': {
    background: theme.vars.palette.primary.soft,
    color: theme.vars.palette.primary.main,
    fontWeight: 600,
  },
  // Con el menú colapsado, el padre muestra que una de sus hojas está activa.
  ...(activo && {
    background: theme.vars.palette.primary.soft,
    color: theme.vars.palette.primary.main,
  }),
}))

const Icono = styled('span')({
  width: 20,
  height: 20,
  marginRight: 14,
  flex: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { fontSize: 21 },
})

const Etiqueta = styled('span', { shouldForwardProp: (prop) => prop !== 'sub' })(({ sub }) => ({
  flex: 1,
  fontSize: sub ? 14 : 15,
}))

const Punto = styled('span')(({ theme }) => ({
  width: 5,
  height: 5,
  borderRadius: '50%',
  background: theme.vars.palette.text.tertiary,
  marginRight: 9,
  flex: 'none',
  '[aria-current="page"] > &': { background: theme.vars.palette.primary.main },
}))

const Contador = styled('span')(({ theme }) => ({
  fontFamily: fuentes.mono,
  fontSize: 12,
  fontWeight: 400,
  color: theme.vars.palette.text.tertiary,
  fontVariantNumeric: 'tabular-nums',
  marginLeft: 8,
}))

function rutaActiva(pathname, ruta) {
  return pathname === ruta
}

function grupoContiene(grupo, pathname) {
  return grupo.hijos?.some((h) => rutaActiva(pathname, h.ruta))
}

export default function MenuLateral({ items, colapsado = false, contadores = {}, onExpandir, onNavegar }) {
  const { pathname } = useLocation()
  const [abiertos, setAbiertos] = useState(
    () => new Set(items.filter((g) => g.hijos && (g.titulo === 'Casos' || grupoContiene(g, pathname))).map((g) => g.titulo)),
  )

  function alternarGrupo(titulo) {
    if (colapsado) {
      onExpandir?.()
      setAbiertos((prev) => new Set(prev).add(titulo))
      return
    }
    setAbiertos((prev) => {
      const sig = new Set(prev)
      if (sig.has(titulo)) sig.delete(titulo)
      else sig.add(titulo)
      return sig
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%', pt: 2 }}>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {items.map((item) => {
          const IconoItem = item.icono

          if (!item.hijos) {
            const enlace = (
              <ItemMenu component={NavLink} to={item.ruta} end colapsado={colapsado} onClick={onNavegar}>
                <Icono><IconoItem /></Icono>
                {!colapsado && <Etiqueta>{item.titulo}</Etiqueta>}
              </ItemMenu>
            )
            return (
              <li key={item.titulo}>
                {colapsado ? <Tooltip title={item.titulo} placement="right">{enlace}</Tooltip> : enlace}
              </li>
            )
          }

          const abierto = abiertos.has(item.titulo) && !colapsado
          const padre = (
            <ItemMenu
              colapsado={colapsado}
              abierto={abierto}
              activo={colapsado && grupoContiene(item, pathname)}
              aria-expanded={abierto}
              onClick={() => alternarGrupo(item.titulo)}
            >
              <Icono><IconoItem /></Icono>
              {!colapsado && (
                <>
                  <Etiqueta>{item.titulo}</Etiqueta>
                  <ExpandMoreIcon
                    sx={{
                      fontSize: 18,
                      color: 'text.tertiary',
                      transition: 'transform .2s ease',
                      transform: abierto ? 'none' : 'rotate(-90deg)',
                    }}
                  />
                </>
              )}
            </ItemMenu>
          )

          return (
            <li key={item.titulo}>
              {colapsado ? <Tooltip title={item.titulo} placement="right">{padre}</Tooltip> : padre}
              <Collapse in={abierto} timeout="auto" unmountOnExit>
                <Box component="ul" sx={{ listStyle: 'none', m: '2px 0 6px', p: 0 }}>
                  {item.hijos.map((hijo) => (
                    <li key={hijo.ruta}>
                      <ItemMenu component={NavLink} to={hijo.ruta} end sub onClick={onNavegar}>
                        <Punto />
                        <Etiqueta sub>{hijo.titulo}</Etiqueta>
                        {hijo.contador && contadores[hijo.contador] != null && (
                          <Contador>{contadores[hijo.contador]}</Contador>
                        )}
                      </ItemMenu>
                    </li>
                  ))}
                </Box>
              </Collapse>
            </li>
          )
        })}
      </Box>

      <Box
        sx={{
          mt: 'auto',
          p: colapsado ? '16px 0 14px' : '16px 22px 14px 0',
          textAlign: colapsado ? 'center' : 'right',
          fontFamily: fuentes.mono,
          fontSize: 11,
          color: 'text.tertiary',
          letterSpacing: '.04em',
        }}
      >
        V{__APP_VERSION__}
      </Box>
    </Box>
  )
}
