import { Box } from '@mui/material'
import { MarcaCaso } from '@/componentes/caso/MarcasCaso'
import { marcas } from '@/componentes/caso/catalogos'

export default function LeyendaMarcas() {
  return (
    <Box sx={{ display: 'flex', gap: 2.25, flexWrap: 'wrap', mt: 2, fontSize: 12.5, color: 'text.tertiary' }}>
      {Object.entries(marcas).map(([clave, { etiqueta }]) => (
        <Box key={clave} component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
          <MarcaCaso marca={clave} conTooltip={false} />
          {etiqueta}
          {clave === 'grave' && <span>— un animal del caso murió o enfermó en la observación</span>}
        </Box>
      ))}
    </Box>
  )
}
