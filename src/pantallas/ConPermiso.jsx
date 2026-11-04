import { Link } from 'react-router'
import { Button, Typography } from '@mui/material'
import EncabezadoPagina from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import { useSesion } from '@/mocks'

// Muestra la pantalla solo si la API mandó el permiso (RN-35). Esconderla no la protege:
// la regla real la aplica el servidor, que tampoco manda los datos.
export default function ConPermiso({ permiso, children }) {
  const sesion = useSesion()
  if (sesion.permisos.includes(permiso)) return children
  return (
    <>
      <EncabezadoPagina titulo="Sin acceso" />
      <Panel sx={{ py: 6, px: 3, textAlign: 'center' }}>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>Tu usuario no tiene acceso a esta pantalla.</Typography>
        <Button component={Link} to="/" variant="outlined">Ir al inicio</Button>
      </Panel>
    </>
  )
}
