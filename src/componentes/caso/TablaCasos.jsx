import { useState } from 'react'
import { Box } from '@mui/material'
import Tabla, { CeldaDoble } from '@/componentes/tabla/Tabla'
import PieTabla from '@/componentes/tabla/PieTabla'
import SinDato from '@/componentes/SinDato'
import { fuentes } from '@/tema/tokens'
import { fechaCorta, fechaHora } from '@/utiles/formato'
import EstadoCaso from './EstadoCaso'
import MotivoEspera from './MotivoEspera'
import MarcasCaso from './MarcasCaso'
import CanalOrigen from './CanalOrigen'
import EnlaceCaso from './EnlaceCaso'
import MenuAccionesCaso from './MenuAccionesCaso'
import { especies } from './catalogos'

const segundaLinea = { display: 'block', mt: '5px', fontSize: 12 }

// Segunda línea del estado (bandeja.md): motivo, a quién se unificó, por qué se desestimó…
export function DetalleEstado({ caso }) {
  switch (caso.estado) {
    case 'en_seguimiento':
      return <MotivoEspera motivo={caso.motivoEspera} />
    case 'unificado':
      return caso.unificadoEn ? (
        <Box component="span" sx={{ ...segundaLinea, color: 'text.tertiary', fontFamily: fuentes.mono }}>→ {caso.unificadoEn}</Box>
      ) : null
    case 'desestimado':
      return caso.motivoDesestimacion ? <Box component="span" sx={{ ...segundaLinea, color: 'text.tertiary' }}>{caso.motivoDesestimacion}</Box> : null
    case 'finalizado':
      // Aclaración, no marca: que un animal no se ubicó no hace incompleto al caso.
      return caso.animalNoUbicado ? <Box component="span" sx={{ ...segundaLinea, color: 'text.tertiary' }}>Un animal no se ubicó</Box> : null
    default:
      return null
  }
}

function Victima({ victima = {} }) {
  const nombre = [victima.nombre, victima.apellido].filter(Boolean).join(' ')
  const edad = victima.edad != null ? `${victima.edad} años` : null
  // Sin nombre (no vino de la API, p. ej. a Consulta), la celda muestra solo la edad.
  if (!nombre) return edad ?? <SinDato />
  return <CeldaDoble destacado principal={nombre} secundario={edad} />
}

function Animales({ animales = [] }) {
  const [primero] = animales
  const resto = animales.length - 1
  const secundario = resto === 0 ? '1 animal' : `+${resto} ${resto === 1 ? 'animal' : 'animales'}`
  return <CeldaDoble principal={especies[primero?.especie] ?? primero?.especie} secundario={secundario} />
}

const columnasCasos = [
  { clave: 'marcas', titulo: 'Marcas', celda: (c) => <MarcasCaso marcas={c.marcas} faltantes={c.faltantes} /> },
  { clave: 'caso', titulo: 'Caso', celda: (c) => <EnlaceCaso numero={c.numero} /> },
  {
    clave: 'ultimaModificacion',
    titulo: 'Última modificación',
    celda: (c) => <CeldaDoble mono principal={fechaHora(c.ultimaModificacion?.fecha)} secundario={c.ultimaModificacion?.por} />,
  },
  {
    clave: 'fechaHecho',
    titulo: 'Fecha del hecho',
    celda: (c) => <CeldaDoble mono principal={fechaCorta(c.fechaHecho) ?? <SinDato />} secundario={c.horaHecho ?? <SinDato />} />,
  },
  { clave: 'victima', titulo: 'Víctima', celda: (c) => <Victima victima={c.victima} /> },
  { clave: 'lugar', titulo: 'Lugar', celda: (c) => <CeldaDoble principal={c.lugar.direccion ?? <SinDato />} secundario={c.lugar.ciudad ?? <SinDato />} /> },
  { clave: 'animales', titulo: 'Animales', celda: (c) => <Animales animales={c.animales} /> },
  { clave: 'tipoEvento', titulo: 'Tipo de evento', celda: (c) => c.tipoEvento ?? <SinDato /> },
  {
    clave: 'estado',
    titulo: 'Estado',
    celda: (c) => (
      <>
        <EstadoCaso estado={c.estado} />
        <DetalleEstado caso={c} />
      </>
    ),
  },
  { clave: 'canalOrigen', titulo: 'Canal de origen', celda: (c) => <CanalOrigen canal={c.canalOrigen} /> },
  { clave: 'acciones', titulo: 'Acciones', acciones: true, celda: (c) => <MenuAccionesCaso numero={c.numero} /> },
]

// La tabla de la Bandeja v2 con su pie. La usan la Bandeja, las listas de trabajo y la Búsqueda.
// La página vuelve a 1 cuando cambia `consulta` (búsqueda, filtros…).
export default function TablaCasos({ filas, densa = false, vacio, consulta = '' }) {
  const [filasPorPagina, setFilasPorPagina] = useState(10)
  const clave = `${consulta}|${filasPorPagina}`
  const [estado, setEstado] = useState({ clave, pagina: 0 })
  const pagina = estado.clave === clave ? estado.pagina : 0
  const visibles = filas.slice(pagina * filasPorPagina, (pagina + 1) * filasPorPagina)

  return (
    <>
      <Tabla columnas={columnasCasos} filas={visibles} claveFila={(c) => c.numero} densa={densa} vacio={vacio} anchoMinimo={1320} />
      <PieTabla
        total={filas.length}
        pagina={pagina}
        filasPorPagina={filasPorPagina}
        onPagina={(n) => setEstado({ clave, pagina: n })}
        onFilasPorPagina={setFilasPorPagina}
      />
    </>
  )
}
