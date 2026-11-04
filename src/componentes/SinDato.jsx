import { Box } from '@mui/material'

// «Sin dato»: no se preguntó o no se respondió. Va en rojo y nunca se confunde con «No sabe» (RN-23).
export default function SinDato() {
  return (
    <Box component="span" sx={{ color: 'error.main', fontFamily: 'inherit' }}>
      Sin dato
    </Box>
  )
}
