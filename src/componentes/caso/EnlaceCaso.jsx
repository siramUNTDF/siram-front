import { Link } from 'react-router'
import { Box } from '@mui/material'
import { fuentes } from '@/tema/tokens'

// Identificador de caso navegable (lleva a la ficha).
export default function EnlaceCaso({ numero }) {
  return (
    <Box
      component={Link}
      to={`/casos/${numero}`}
      sx={{
        fontFamily: fuentes.mono,
        fontVariantNumeric: 'tabular-nums',
        fontSize: 13.5,
        letterSpacing: '-.01em',
        color: 'primary.main',
        fontWeight: 600,
        textDecoration: 'none',
        borderBottom: '1px solid transparent',
        '&:hover': { borderBottomColor: 'primary.main' },
      }}
    >
      {numero}
    </Box>
  )
}
