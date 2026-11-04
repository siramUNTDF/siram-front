import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Box, Button, Tab, Tabs } from '@mui/material'
import EncabezadoPagina from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import Bloque from '@/componentes/Bloque'
import Mensaje from '@/componentes/Mensaje'
import CampoBusqueda from '@/componentes/CampoBusqueda'
import ChipFiltro from '@/componentes/ChipFiltro'
import BotonNuevo from '@/componentes/botones/BotonNuevo'
import Dato, { Datos } from '@/componentes/Dato'
import VentanaLateral from '@/componentes/VentanaLateral'
import { Opciones, Seleccion, Texto } from '@/componentes/formulario/Campos'
import useFormulario from '@/componentes/formulario/useFormulario'
import { useAvisar } from '@/componentes/avisos'
import Tabla, { CeldaDoble } from '@/componentes/tabla/Tabla'
import { roles } from '@/componentes/caso/catalogos'
import { api, ErrorApi, useApi, useSesion } from '@/mocks'
import { fechaCorta, hora, normalizar } from '@/utiles/formato'
import { correoValido, vacio } from '@/utiles/validacion'
import { MenuFila, Vigencia } from './comunes'

const filtros = [
  { clave: 'todos', etiqueta: 'Todos', aplica: (u) => u.activo },
  { clave: 'administracion', etiqueta: 'Administración', aplica: (u) => u.activo && u.rol === 'administrador' },
  { clave: 'agentes', etiqueta: 'Agentes', aplica: (u) => u.activo && u.rol === 'agente' },
  { clave: 'consulta', etiqueta: 'Consulta', aplica: (u) => u.activo && u.rol === 'analista' },
  { clave: 'inactivos', etiqueta: 'Inactivos', aplica: (u) => !u.activo },
]

const descripcionesRol = {
  administrador: 'Da de alta usuarios y organismos y mantiene los catálogos. No trabaja casos.',
  agente: 'Registra casos, los completa, les da seguimiento y resuelve los posibles duplicados.',
  analista: 'Busca casos, ve estadísticas y exporta datos, sin editar. Para analistas y el comité.',
}

function Pestanas({ actual }) {
  return (
    <Tabs value={actual} sx={{ mb: 2.5, borderBottom: 1, borderColor: 'divider', '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}>
      <Tab label="Usuarios" value="usuarios" component={Link} to="/administracion/usuarios" />
      <Tab label="Roles y permisos" value="roles" component={Link} to="/administracion/usuarios/roles" />
    </Tabs>
  )
}

function VentanaUsuario({ usuario, esUnoMismo, onCerrar }) {
  const navigate = useNavigate()
  const avisar = useAvisar()
  const f = useFormulario({ nombre: usuario?.nombre ?? '', correo: usuario?.correo ?? '', rol: usuario?.rol ?? null, organismo: usuario?.organismo?.id ?? null })
  const v = f.valores
  const organismos = api.organismosActivos()
  const enlace = (c) => ({ valor: f.valor(c), onCambio: (x) => f.poner(c, x), error: f.errores[c] })

  function cambiarRol(rol) {
    f.poner('rol', rol)
    // Si deja de ser agente, el organismo se borra.
    if (rol !== 'agente') f.poner('organismo', null)
  }

  function guardar() {
    const e = {}
    if (vacio(v.nombre)) e.nombre = 'Falta el nombre y apellido'
    if (vacio(v.correo)) e.correo = 'Falta el correo'
    else if (!correoValido(v.correo)) e.correo = 'El correo no tiene un formato válido'
    if (!v.rol) e.rol = 'Elegí un rol'
    if (v.rol === 'agente' && !v.organismo) e.organismo = 'Elegí el organismo del agente'
    f.setErrores(e)
    if (Object.keys(e).length) return
    try {
      api.guardarUsuario(usuario?.id, v)
      avisar('exito', usuario ? 'Usuario actualizado' : 'Usuario creado. Le llega un correo para elegir su contraseña.')
      onCerrar()
    } catch (err) {
      if (!(err instanceof ErrorApi)) throw err
      f.setErrores({ [err.campo]: err.message })
    }
  }

  return (
    <VentanaLateral abierta titulo={usuario ? 'Editar usuario' : 'Nuevo usuario'} bajada="Una cuenta por persona. El rol decide qué puede hacer en SIRAM." hayCambios={f.hayCambios} onCerrar={onCerrar} onGuardar={guardar}>
      <Bloque titulo="Persona">
        <Texto etiqueta="Nombre y apellido" requerido {...enlace('nombre')} />
        <Texto etiqueta="Correo electrónico" requerido tipo="email" {...enlace('correo')} />
      </Bloque>
      <Bloque titulo="Acceso">
        {esUnoMismo ? (
          <Dato etiqueta="Rol" valor={`${roles[v.rol]} · no podés cambiar tu propio rol`} />
        ) : (
          <Opciones etiqueta="Rol" requerido opciones={roles} descripciones={descripcionesRol} valor={v.rol} onCambio={cambiarRol} error={f.errores.rol} />
        )}
        {v.rol === 'agente' && <Seleccion etiqueta="Organismo" requerido opciones={organismos.map((o) => [o.id, o.nombre])} {...enlace('organismo')} />}
        <Button variant="text" onClick={() => navigate('/administracion/usuarios/roles')}>Ver qué puede hacer cada rol</Button>
      </Bloque>
    </VentanaLateral>
  )
}

function VentanaDesactivar({ usuario, onCerrar }) {
  const avisar = useAvisar()
  const [motivo, setMotivo] = useState('')
  return (
    <VentanaLateral
      abierta titulo="Desactivar usuario" bajada={[usuario.nombre, roles[usuario.rol], usuario.organismo?.nombre].filter(Boolean).join(' · ')}
      onCerrar={onCerrar} peligro textoGuardar="Desactivar" deshabilitado={false} hayCambios={Boolean(motivo)}
      onGuardar={() => { api.desactivarUsuario(usuario.id); avisar('exito', 'Usuario desactivado'); onCerrar() }}
    >
      <Mensaje tipo="info">No se borra nada. {usuario.nombre} no va a poder entrar a SIRAM. Los casos que registró y su historial quedan como están, y la cuenta se puede volver a activar.</Mensaje>
      <Texto etiqueta="Motivo" multilinea placeholder="Opcional" valor={motivo} onCambio={setMotivo} />
    </VentanaLateral>
  )
}

function VentanaReactivar({ usuario, onCerrar }) {
  const avisar = useAvisar()
  const [error, setError] = useState(null)
  function reactivar() {
    try {
      api.reactivarUsuario(usuario.id)
      avisar('exito', 'Usuario reactivado')
      onCerrar()
    } catch (e) {
      if (!(e instanceof ErrorApi)) throw e
      setError(e.message)
    }
  }
  return (
    <VentanaLateral abierta titulo="Reactivar usuario" bajada="Un usuario no se borra: se desactiva y se puede reactivar." onCerrar={onCerrar} textoGuardar="Reactivar" deshabilitado={false} error={error} onGuardar={reactivar}>
      <Datos columnas={2}>
        <Dato etiqueta="Nombre" valor={usuario.nombre} />
        <Dato etiqueta="Usuario" valor={usuario.correo} />
        <Dato etiqueta="Rol" valor={roles[usuario.rol]} />
        {usuario.organismo && <Dato etiqueta="Organismo" valor={usuario.organismo.nombre} />}
        <Dato etiqueta="Desactivado" valor={usuario.desactivado ? `${fechaCorta(usuario.desactivado.fecha)} · por ${usuario.desactivado.por}` : null} ancho={2} />
      </Datos>
      <Mensaje tipo="info">Vuelve a poder entrar. Con el mismo rol y organismo. Sigue apareciendo donde actuó; la reactivación queda en el historial del usuario (sin credenciales).</Mensaje>
    </VentanaLateral>
  )
}

function ListaUsuarios() {
  const sesion = useSesion()
  const { datos: usuarios } = useApi(() => api.listarUsuarios())
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [ventana, setVentana] = useState(null)
  const buscados = useMemo(() => usuarios.filter((u) => !busqueda || normalizar(`${u.nombre} ${u.correo}`).includes(normalizar(busqueda))), [usuarios, busqueda])
  const filtrados = buscados.filter(filtros.find((f) => f.clave === filtro).aplica)
  const esUnoMismo = (u) => u.nombre === sesion.nombre

  const columnas = [
    { clave: 'nombre', titulo: 'Nombre', celda: (u) => <CeldaDoble destacado principal={u.nombre} secundario={u.correo} /> },
    { clave: 'rol', titulo: 'Rol', celda: (u) => roles[u.rol] },
    { clave: 'organismo', titulo: 'Organismo', celda: (u) => u.organismo?.nombre ?? '—' },
    { clave: 'estado', titulo: 'Estado', celda: (u) => <Vigencia activo={u.activo} /> },
    { clave: 'acceso', titulo: 'Último acceso', celda: (u) => (u.ultimoAcceso ? <CeldaDoble mono principal={fechaCorta(u.ultimoAcceso)} secundario={hora(u.ultimoAcceso)} /> : <CeldaDoble principal="Todavía no entró" secundario={`Alta: ${fechaCorta(u.alta)}`} />) },
    {
      clave: 'acciones', titulo: 'Acciones', acciones: true,
      celda: (u) => (
        <MenuFila
          etiqueta={`Acciones de ${u.nombre}`}
          acciones={[
            { texto: 'Editar', onClick: () => setVentana({ tipo: 'editar', usuario: u }) },
            // Nadie se desactiva a sí mismo.
            ...(u.activo ? (esUnoMismo(u) ? [] : [{ texto: 'Desactivar', onClick: () => setVentana({ tipo: 'desactivar', usuario: u }) }]) : [{ texto: 'Reactivar', onClick: () => setVentana({ tipo: 'reactivar', usuario: u }) }]),
          ]}
        />
      ),
    },
  ]

  return (
    <>
      <Panel>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', p: 2 }}>
          <CampoBusqueda valor={busqueda} onCambio={setBusqueda} placeholder="Buscar por nombre o correo" etiqueta="Buscar usuarios" />
          <BotonNuevo texto="Nuevo usuario" onClick={() => setVentana({ tipo: 'nuevo' })} />
        </Box>
        <Box role="group" aria-label="Filtros rápidos" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', px: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
          {filtros.map((f) => <ChipFiltro key={f.clave} etiqueta={f.etiqueta} cantidad={buscados.filter(f.aplica).length} activo={filtro === f.clave} onClick={() => setFiltro(f.clave)} />)}
        </Box>
        <Tabla columnas={columnas} filas={filtrados} anchoMinimo={900} vacio="No hay usuarios que coincidan con la búsqueda." />
      </Panel>
      {ventana?.tipo === 'nuevo' && <VentanaUsuario onCerrar={() => setVentana(null)} />}
      {ventana?.tipo === 'editar' && <VentanaUsuario usuario={ventana.usuario} esUnoMismo={esUnoMismo(ventana.usuario)} onCerrar={() => setVentana(null)} />}
      {ventana?.tipo === 'desactivar' && <VentanaDesactivar usuario={ventana.usuario} onCerrar={() => setVentana(null)} />}
      {ventana?.tipo === 'reactivar' && <VentanaReactivar usuario={ventana.usuario} onCerrar={() => setVentana(null)} />}
    </>
  )
}

// Celdas como el componente Permiso: Sí · No · A definir, y los matices («Solo si existe»).
function Permiso({ valor }) {
  const colores = { Ve: 'success', Sí: 'success', No: 'neutral', 'A definir': 'warning' }
  const color = colores[valor] ?? 'info'
  return (
    <Box component="span" sx={{ display: 'inline-block', px: 1, py: '1px', borderRadius: 1, fontSize: 12.5, fontWeight: 600, bgcolor: `${color}.soft`, color: color === 'neutral' ? 'text.secondary' : `${color}.main` }}>{valor}</Box>
  )
}

function TablaPermisos({ titulo, encabezados, filas }) {
  const columnas = encabezados.map((t, i) => ({ clave: String(i), titulo: t, celda: (f) => (i === 0 ? f[0] : <Permiso valor={f[i]} />) }))
  return (
    <Bloque titulo={titulo}>
      <Box sx={{ mx: { xs: -2, sm: -2.5 } }}>
        <Tabla columnas={columnas} filas={filas} claveFila={(f) => f[0]} anchoMinimo={640} />
      </Box>
    </Bloque>
  )
}

// Texto fijo de la pantalla (usuarios.md): documenta las reglas; las aplica el servidor.
function RolesYPermisos() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Mensaje tipo="info">Tentativa sacada de la narrativa y aprobada por el equipo; falta validarla con los organismos. Se aplica en el servidor: el front muestra solo lo que le llega.</Mensaje>
      <TablaPermisos
        titulo="Qué casos ve cada uno"
        encabezados={['Rol', 'Casos', 'Detalle']}
        filas={[
          ['Agentes (Salud, Zoonosis, CADIC)', 'Sí', 'Todos los casos y todas las solicitudes'],
          ['Analista / Comité', 'Sí', 'Los casos, sin datos personales'],
          ['Administrador', 'No', 'No ve casos'],
        ]}
      />
      <TablaPermisos
        titulo="Quién edita"
        encabezados={['Dato', 'Quién']}
        filas={[
          ['Datos comunes (hecho, víctima, contacto, estado, animales y su descripción)', 'Cualquier agente'],
          ['Tratamiento', 'Solo Salud'],
          ['Seguimiento del animal (día 10, observaciones, dueño, tenencia, chip)', 'Solo Zoonosis'],
          ['Denuncias y certificado médico', 'Solo Zoonosis'],
          ['Lo que declaró la persona', 'No'],
        ]}
      />
      <TablaPermisos
        titulo="Qué datos ve cada uno"
        encabezados={['Dato', 'Salud', 'Zoonosis', 'CADIC', 'Analista']}
        filas={[
          ['Víctima y contacto (nombre, DNI, teléfono, correo)', 'Ve', 'Ve', 'Ve', 'No'],
          ['Hecho, tipo de evento, estado, marcas', 'Ve', 'Ve', 'Ve', 'Ve'],
          ['Tratamiento completo', 'Ve', 'Solo si existe', 'Solo si existe', 'Agregados'],
          ['Animal: descripción y tenencia', 'No', 'Ve', 'Ve', 'Ve'],
          ['Animal: dueño y chip', 'No', 'Ve', 'No', 'No'],
          ['Animal: observación del día 10', 'Ve', 'Ve', 'Ve', 'Agregados'],
          ['Denuncia', 'Solo si existe', 'Ve', 'Solo si existe', 'Agregados'],
          ['Certificado médico', 'Ve', 'Ve', 'No', 'No'],
          ['Lo declarado (¿hizo denuncia? y motivo)', 'Ve', 'Ve', 'Ve', 'Ve'],
        ]}
      />
      <Box sx={{ fontSize: 12.5, color: 'text.tertiary' }}>
        «Solo si existe»: ve que el dato está (p. ej. «recibió atención», «tiene denuncia») sin el detalle. Salud ve el día 10 porque puede cambiar el tratamiento antirrábico de la víctima.
      </Box>
    </Box>
  )
}

// Administración › Usuarios (usuarios.md). Un usuario no se borra: se desactiva.
export default function Usuarios() {
  const { pathname } = useLocation()
  const pestana = pathname.endsWith('/roles') ? 'roles' : 'usuarios'
  return (
    <>
      <EncabezadoPagina titulo="Usuarios" bajada="Cuentas de las personas que usan SIRAM. No se borran: se desactivan." />
      <Pestanas actual={pestana} />
      {pestana === 'roles' ? <RolesYPermisos /> : <ListaUsuarios />}
    </>
  )
}
