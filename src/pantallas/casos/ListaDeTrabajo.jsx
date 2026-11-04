import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Box } from '@mui/material'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import CampoBusqueda from '@/componentes/CampoBusqueda'
import BotonNuevo from '@/componentes/botones/BotonNuevo'
import TablaCasos from '@/componentes/caso/TablaCasos'
import { api, useApi, useSesion } from '@/mocks'
import HerramientasTabla from './bandeja/HerramientasTabla'
import LeyendaMarcas from './bandeja/LeyendaMarcas'
import useDensidad from './bandeja/useDensidad'
import { coincideBusqueda } from './bandeja/busqueda'

const listas = {
  incompleto: {
    titulo: 'Incompletos',
    bajada: 'Casos vigentes a los que les falta algún dato del caso (fecha del hecho, ciudad, lugar…). Ordenados por última modificación.',
    vacio: 'No hay casos incompletos.',
    nota: 'Solo casos vigentes. Un caso finalizado con datos faltantes deja de contar como incompleto. Uno desestimado conserva la marca, pero no entra en las listas de trabajo (dónde se cuenta está pendiente).',
    conNuevo: true,
  },
  duplicado: {
    titulo: 'Posibles duplicados',
    bajada: 'Casos vigentes que el sistema marcó como posible duplicado de otro. Al abrir un caso se ve con cuál y se decide en la comparación.',
    vacio: 'No hay posibles duplicados para revisar.',
    nota: null,
    conNuevo: false,
  },
}

// Listas de trabajo (incompletos.md, posibles-duplicados.md): la tabla de la Bandeja, sin chips.
// Qué casos entran lo decide la API (vigentes con la marca); al volver de una ficha se recargan.
export default function ListaDeTrabajo({ marca }) {
  const lista = listas[marca]
  const navigate = useNavigate()
  const sesion = useSesion()
  const { datos: casos } = useApi(() => api.listaDeTrabajo(marca), [marca])
  const [busqueda, setBusqueda] = useState('')
  const [densa, alternarDensidad] = useDensidad()
  const filtrados = useMemo(() => casos.filter((c) => coincideBusqueda(c, busqueda)), [casos, busqueda])

  return (
    <>
      <EncabezadoPagina titulo={lista.titulo} bajada={lista.bajada} extra={<NotaDatosEjemplo />} />
      <Panel>
        <HerramientasTabla densa={densa} onDensidad={alternarDensidad} borde>
          <CampoBusqueda valor={busqueda} onCambio={setBusqueda} placeholder="Buscar por caso, víctima o DNI" etiqueta="Buscar casos por número, víctima o DNI" />
          {lista.conNuevo && sesion.permisos.includes('nuevo_caso') && <BotonNuevo texto="Nuevo caso" onClick={() => navigate('/casos/nuevo')} />}
        </HerramientasTabla>
        <TablaCasos filas={filtrados} densa={densa} consulta={busqueda} vacio={busqueda ? 'No hay casos que coincidan con la búsqueda.' : lista.vacio} />
      </Panel>
      {lista.nota && <Box sx={{ mt: 2, fontSize: 12.5, color: 'text.tertiary' }}>{lista.nota}</Box>}
      <LeyendaMarcas />
    </>
  )
}
