import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Box, Button } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import HistoryIcon from '@mui/icons-material/History'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import Bloque from '@/componentes/Bloque'
import Mensaje from '@/componentes/Mensaje'
import CampoBusqueda from '@/componentes/CampoBusqueda'
import ChipFiltro from '@/componentes/ChipFiltro'
import Dato, { Datos } from '@/componentes/Dato'
import VentanaLateral from '@/componentes/VentanaLateral'
import { Fila, Texto } from '@/componentes/formulario/Campos'
import useFormulario from '@/componentes/formulario/useFormulario'
import { useAvisar } from '@/componentes/avisos'
import Tabla, { CeldaDoble } from '@/componentes/tabla/Tabla'
import PieTabla from '@/componentes/tabla/PieTabla'
import EnlaceCaso from '@/componentes/caso/EnlaceCaso'
import EstadoCaso from '@/componentes/caso/EstadoCaso'
import BotonIcono from '@/componentes/botones/BotonIcono'
import { api, ErrorApi, useApi } from '@/mocks'
import { fuentes } from '@/tema/tokens'
import { dni, fechaCorta, fechaHora, nombreCompleto, normalizar, plural, soloDigitos } from '@/utiles/formato'
import { correoValido, dniValido, mensajeDni, telefonoValido, vacio } from '@/utiles/validacion'
import NoEncontrada from '@/pantallas/NoEncontrada'

const filtros = [
  { clave: 'todas', etiqueta: 'Todas', aplica: () => true },
  { clave: 'victimas', etiqueta: 'Víctimas', aplica: (p) => p.roles.victima > 0 },
  { clave: 'contactos', etiqueta: 'Contactos responsables', aplica: (p) => p.roles.contactoResponsable > 0 },
  { clave: 'duenos', etiqueta: 'Dueños de animales', aplica: (p) => p.roles.dueno > 0 },
]

function textoRoles(r) {
  return [
    r.victima && `Víctima en ${r.victima}`,
    r.contactoResponsable && `contacto responsable en ${r.contactoResponsable}`,
    r.dueno && `dueño de un animal en ${r.dueno}`,
  ].filter(Boolean).join(' · ').replace(/^./, (c) => c.toUpperCase())
}

const nombresRol = { victima: 'Víctima', contacto_responsable: 'Contacto responsable', dueno: 'Dueño de un animal' }

// Lista de personas (personas.md): una por DNI. El DNI y el contacto no van en la lista.
export function ListaPersonas() {
  const { datos: personas } = useApi(() => api.listarPersonas())
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todas')
  const [estado, setEstado] = useState({ clave: '', pagina: 0 })
  const [filasPorPagina, setFilasPorPagina] = useState(10)
  // Si la API no manda dueños (Salud, CADIC), el chip no aparece.
  const conDuenos = personas.some((p) => p.roles.dueno > 0)
  const visiblesFiltros = filtros.filter((f) => f.clave !== 'duenos' || conDuenos)

  const buscadas = useMemo(() => personas.filter((p) => {
    if (!busqueda) return true
    if (normalizar(nombreCompleto(p)).includes(normalizar(busqueda))) return true
    const d = soloDigitos(busqueda)
    return Boolean(d) && p.dni.includes(d)
  }), [personas, busqueda])
  const filtradas = buscadas.filter(filtros.find((f) => f.clave === filtro).aplica)
  const clave = `${filtro}|${busqueda}|${filasPorPagina}`
  const pagina = estado.clave === clave ? estado.pagina : 0

  const columnas = [
    { clave: 'persona', titulo: 'Persona', celda: (p) => <Box component={Link} to={`/consultas/personas/${p.id}`} sx={{ color: 'text.primary', fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>{nombreCompleto(p)}</Box> },
    { clave: 'casos', titulo: 'Casos', celda: (p) => plural(p.casos, 'caso') },
    { clave: 'rol', titulo: 'En qué rol aparece', celda: (p) => textoRoles(p.roles) },
    { clave: 'ultimo', titulo: 'Último caso', celda: (p) => <CeldaDoble principal={<EnlaceCaso numero={p.ultimoCaso.numero} />} secundario={fechaCorta(p.ultimoCaso.fechaHecho)} mono /> },
    { clave: 'modificacion', titulo: 'Última modificación', celda: (p) => <CeldaDoble mono principal={fechaHora(p.ultimaModificacion.fecha)} secundario={p.ultimaModificacion.por} /> },
  ]

  return (
    <>
      <EncabezadoPagina titulo="Personas" bajada="Una por DNI. Se consultan, no se trabajan: lo único que SIRAM trabaja es el caso. DNI y contacto, solo en el detalle." extra={<NotaDatosEjemplo />} />
      <Panel>
        <Box sx={{ p: 2 }}><CampoBusqueda valor={busqueda} onCambio={setBusqueda} placeholder="Buscar por nombre o DNI" etiqueta="Buscar personas por nombre o DNI" /></Box>
        <Box role="group" aria-label="Filtros rápidos" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', px: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
          {visiblesFiltros.map((f) => <ChipFiltro key={f.clave} etiqueta={f.etiqueta} cantidad={buscadas.filter(f.aplica).length} activo={filtro === f.clave} onClick={() => setFiltro(f.clave)} />)}
        </Box>
        <Tabla columnas={columnas} filas={filtradas.slice(pagina * filasPorPagina, (pagina + 1) * filasPorPagina)} anchoMinimo={900} vacio="No hay personas que coincidan con la búsqueda." />
        <PieTabla total={filtradas.length} pagina={pagina} filasPorPagina={filasPorPagina} onPagina={(n) => setEstado({ clave, pagina: n })} onFilasPorPagina={setFilasPorPagina} />
      </Panel>
    </>
  )
}

function EditarPersona({ persona, onCerrar }) {
  const avisar = useAvisar()
  const f = useFormulario({ nombre: persona.nombre, apellido: persona.apellido, dni: persona.dni, telefono: persona.telefono ?? '', correo: persona.correo ?? '', domicilio: persona.domicilio ?? '' })
  const enlace = (c) => ({ valor: f.valor(c), onCambio: (x) => f.poner(c, x), error: f.errores[c] })
  function guardar() {
    const v = f.valores
    const e = {}
    if (vacio(v.nombre)) e.nombre = 'Falta el nombre'
    if (vacio(v.apellido)) e.apellido = 'Falta el apellido'
    if (!dniValido(v.dni)) e.dni = mensajeDni
    if (!vacio(v.correo) && !correoValido(v.correo)) e.correo = 'El correo no tiene un formato válido'
    if (!vacio(v.telefono) && !telefonoValido(v.telefono)) e.telefono = 'El teléfono tiene que tener al menos 6 números'
    f.setErrores(e)
    if (Object.keys(e).length) return
    try {
      api.editarPersona(persona.id, v)
      avisar('exito', 'Datos de la persona actualizados')
      onCerrar()
    } catch (err) {
      if (!(err instanceof ErrorApi)) throw err
      f.setErrores({ [err.campo?.replace('persona.', '') ?? 'dni']: err.message })
    }
  }
  return (
    <VentanaLateral abierta titulo="Editar persona" bajada={nombreCompleto(persona)} hayCambios={f.hayCambios} onCerrar={onCerrar} onGuardar={guardar}
      arriba={<Mensaje tipo="info">Esta persona está en {plural(persona.casos.length, 'caso')}. El cambio se ve en todos.</Mensaje>}
    >
      <Bloque titulo="Datos">
        <Fila>
          <Texto etiqueta="Nombre" requerido {...enlace('nombre')} />
          <Texto etiqueta="Apellido" requerido {...enlace('apellido')} />
          <Texto etiqueta="DNI" requerido ayuda="Se puede corregir un error de carga, pero no puede quedar igual al de otra persona." {...enlace('dni')} />
          <Texto etiqueta="Teléfono" tipo="tel" {...enlace('telefono')} />
          <Texto etiqueta="Correo electrónico" tipo="email" {...enlace('correo')} />
          <Texto etiqueta="Domicilio" {...enlace('domicilio')} />
        </Fila>
      </Bloque>
    </VentanaLateral>
  )
}

// Detalle de una persona: sus datos y todos sus casos, con su rol en cada uno.
export function DetallePersona() {
  const { id } = useParams()
  const { datos: p, error } = useApi(() => api.obtenerPersona(id), [id])
  const [editando, setEditando] = useState(false)
  if (error) return <NoEncontrada />

  const columnas = [
    { clave: 'caso', titulo: 'Caso', celda: (c) => <EnlaceCaso numero={c.numero} /> },
    { clave: 'rol', titulo: 'Rol en el caso', celda: (c) => nombresRol[c.rol] },
    { clave: 'fecha', titulo: 'Fecha del hecho', celda: (c) => <CeldaDoble mono principal={fechaCorta(c.fechaHecho)} secundario={c.horaHecho} /> },
    { clave: 'victima', titulo: 'Víctima', celda: (c) => <CeldaDoble destacado principal={nombreCompleto(c.victima)} secundario={c.victima.edad != null ? `${c.victima.edad} años` : null} /> },
    {
      clave: 'estado',
      titulo: 'Estado',
      celda: (c) => (
        <>
          <EstadoCaso estado={c.estado} />
          {c.estado === 'unificado' && <Box sx={{ mt: '5px', fontSize: 12, fontFamily: fuentes.mono, color: 'text.tertiary' }}>→ {c.unificadoEn}</Box>}
        </>
      ),
    },
  ]

  return (
    <>
      <EncabezadoPagina
        volver="/consultas/personas"
        titulo={nombreCompleto(p)}
        bajada="Persona única por DNI: un cambio acá se ve en todos sus casos y queda en el historial de la persona."
        extra={(
          <>
            <NotaDatosEjemplo />
            {p.puedeEditar && <Button variant="outlined" color="inherit" startIcon={<EditOutlinedIcon />} onClick={() => setEditando(true)} sx={{ borderColor: 'divider', bgcolor: 'background.paper' }}>Editar</Button>}
            <BotonIcono etiqueta="Ver historial (en diseño)" disabled><HistoryIcon fontSize="small" /></BotonIcono>
          </>
        )}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Bloque titulo="Datos">
          <Datos>
            <Dato etiqueta="Nombre y apellido" valor={nombreCompleto(p)} />
            <Dato etiqueta="DNI" valor={dni(p.dni)} mono />
            <Dato etiqueta="Teléfono" valor={p.telefono} mono />
            <Dato etiqueta="Correo electrónico" valor={p.correo} />
            <Dato etiqueta="Domicilio" valor={p.domicilio} />
          </Datos>
        </Bloque>
        <Bloque titulo={`Casos de esta persona · ${p.casos.length}`}>
          <Box sx={{ mx: { xs: -2, sm: -2.5 } }}>
            <Tabla columnas={columnas} filas={p.casos} claveFila={(c) => `${c.numero}-${c.rol}`} anchoMinimo={720} />
          </Box>
        </Bloque>
        <Box sx={{ fontSize: 12.5, color: 'text.tertiary' }}>Los roles viven en cada caso: víctima y contacto responsable son del caso; dueño, de cada animal en el caso. No se guarda la relación entre personas.</Box>
      </Box>
      {editando && <EditarPersona persona={p} onCerrar={() => setEditando(false)} />}
    </>
  )
}
