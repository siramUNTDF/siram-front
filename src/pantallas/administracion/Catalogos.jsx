import { useMemo, useState } from 'react'
import { Box } from '@mui/material'
import EncabezadoPagina from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import Bloque from '@/componentes/Bloque'
import Mensaje from '@/componentes/Mensaje'
import CampoBusqueda from '@/componentes/CampoBusqueda'
import ChipFiltro from '@/componentes/ChipFiltro'
import BotonNuevo from '@/componentes/botones/BotonNuevo'
import VentanaLateral from '@/componentes/VentanaLateral'
import { Nota, Opciones, Texto } from '@/componentes/formulario/Campos'
import useFormulario from '@/componentes/formulario/useFormulario'
import { useAvisar } from '@/componentes/avisos'
import Tabla, { CeldaDoble } from '@/componentes/tabla/Tabla'
import { tiposOrganismo } from '@/componentes/caso/catalogos'
import { api, ErrorApi, useApi } from '@/mocks'
import { fuentes } from '@/tema/tokens'
import { normalizar, plural } from '@/utiles/formato'
import { vacio } from '@/utiles/validacion'
import { MenuFila, Vigencia } from './comunes'

const mono = (n) => <Box component="span" sx={{ fontFamily: fuentes.mono }}>{n}</Box>

function useGuardarCatalogo(f, guardar, exito, onCerrar) {
  const avisar = useAvisar()
  return () => {
    if (vacio(f.valores.nombre)) {
      f.setErrores({ nombre: 'Falta el nombre' })
      return
    }
    try {
      guardar()
      avisar('exito', exito)
      onCerrar()
    } catch (e) {
      if (!(e instanceof ErrorApi)) throw e
      f.setErrores({ [e.campo ?? 'nombre']: e.message })
    }
  }
}

// ─── Organismos ──────────────────────────────────────────────────────────────────────────
function VentanaOrganismo({ organismo: o, onCerrar }) {
  const f = useFormulario({ nombre: o?.nombre ?? '', tipo: o?.tipo ?? null, activo: o?.activo ?? true })
  const v = f.valores
  const guardar = useGuardarCatalogo(f, () => {
    if (!v.tipo) throw new ErrorApi('Elegí el tipo de organismo', 'tipo')
    api.guardarOrganismo(o?.id, v)
  }, o ? 'Organismo actualizado' : 'Organismo creado', onCerrar)
  const conUso = o && (o.usuariosActivos > 0 || o.casosVigentes > 0)
  return (
    <VentanaLateral
      abierta
      titulo={o ? 'Editar organismo' : 'Nuevo organismo'}
      bajada={o ? `${o.nombre} · ${plural(o.usuariosActivos, 'usuario activo', 'usuarios activos')} · ${plural(o.casosVigentes, 'caso vigente', 'casos vigentes')}` : undefined}
      hayCambios={f.hayCambios}
      onCerrar={onCerrar}
      onGuardar={guardar}
    >
      <Bloque titulo="Datos">
        <Texto etiqueta="Nombre" requerido valor={v.nombre} onCambio={(x) => f.poner('nombre', x)} error={f.errores.nombre} nota="Es el nombre que se ve en el chip del organismo, en cada caso que registró. No lleva logo ni color propio." />
        <Opciones etiqueta="Tipo" requerido opciones={tiposOrganismo} valor={v.tipo} onCambio={(x) => f.poner('tipo', x)} error={f.errores.tipo} ayuda="El tipo define qué puede cargar cada agente: Salud, el tratamiento; Zoonosis, el seguimiento de los animales y las denuncias." />
        {conUso && o.tipo !== v.tipo && v.tipo && (
          <Mensaje tipo="advertencia">Cambiar el tipo cambia lo que pueden cargar sus {plural(o.usuariosActivos, 'usuario', 'usuarios')} en sus {plural(o.casosVigentes, 'caso', 'casos')}.</Mensaje>
        )}
      </Bloque>
      <Bloque titulo="Estado">
        <Opciones
          vertical
          opciones={[[true, 'Activo'], [false, 'Inactivo']]}
          descripciones={{ true: 'Sus agentes entran a SIRAM y registran casos a nombre del organismo.', false: 'Sus agentes no pueden entrar. Sus casos y su historial quedan como están.' }}
          valor={v.activo}
          onCambio={(x) => f.poner('activo', x)}
          sinError
        />
        {o?.activo && v.activo === false && o.usuariosActivos > 0 && (
          <Mensaje tipo="advertencia" sx={{ mt: 1.5 }}>Sus {o.usuariosActivos} usuarios activos no van a poder entrar.</Mensaje>
        )}
        <Nota sx={{ mt: 1 }}>Solo se ofrecen los organismos activos al dar de alta o editar un agente.</Nota>
      </Bloque>
    </VentanaLateral>
  )
}

const filtrosOrganismo = [
  { clave: 'todos', etiqueta: 'Todos', tipo: null },
  { clave: 'salud', etiqueta: 'Salud', tipo: 'salud' },
  { clave: 'zoonosis', etiqueta: 'Zoonosis', tipo: 'zoonosis' },
  { clave: 'cadic', etiqueta: 'CADIC', tipo: 'cadic' },
]

// Administración › Organismos (organismos.md). En cada caso aparecen como un dato, nunca como marca (RN-01).
export function Organismos() {
  const { datos: organismos } = useApi(() => api.listarOrganismos())
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [ventana, setVentana] = useState(null)
  const buscados = useMemo(() => organismos.filter((o) => !busqueda || normalizar(o.nombre).includes(normalizar(busqueda))), [organismos, busqueda])
  const tipo = filtrosOrganismo.find((f) => f.clave === filtro).tipo
  const columnas = [
    { clave: 'nombre', titulo: 'Organismo', celda: (o) => <Box component="strong">{o.nombre}</Box> },
    { clave: 'tipo', titulo: 'Tipo', celda: (o) => tiposOrganismo[o.tipo] },
    { clave: 'usuarios', titulo: 'Usuarios activos', celda: (o) => mono(o.usuariosActivos) },
    { clave: 'casos', titulo: 'Casos vigentes', celda: (o) => mono(o.casosVigentes) },
    { clave: 'estado', titulo: 'Estado', celda: (o) => <Vigencia activo={o.activo} /> },
    { clave: 'acciones', titulo: 'Acciones', acciones: true, celda: (o) => <MenuFila etiqueta={`Acciones de ${o.nombre}`} acciones={[{ texto: 'Editar', onClick: () => setVentana({ organismo: o }) }]} /> },
  ]
  return (
    <>
      <EncabezadoPagina titulo="Organismos" bajada="Los entes que cargan y consultan casos. En cada caso aparecen como un dato, nunca como marca de SIRAM." />
      <Panel>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', p: 2 }}>
          <CampoBusqueda valor={busqueda} onCambio={setBusqueda} placeholder="Buscar organismo" etiqueta="Buscar organismo" />
          <BotonNuevo texto="Nuevo organismo" onClick={() => setVentana({})} />
        </Box>
        <Box role="group" aria-label="Filtros rápidos" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', px: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
          {filtrosOrganismo.map((f) => <ChipFiltro key={f.clave} etiqueta={f.etiqueta} cantidad={buscados.filter((o) => !f.tipo || o.tipo === f.tipo).length} activo={filtro === f.clave} onClick={() => setFiltro(f.clave)} />)}
        </Box>
        <Tabla columnas={columnas} filas={buscados.filter((o) => !tipo || o.tipo === tipo)} anchoMinimo={760} vacio="No hay organismos que coincidan con la búsqueda." />
      </Panel>
      {ventana && <VentanaOrganismo organismo={ventana.organismo} onCerrar={() => setVentana(null)} />}
    </>
  )
}

// ─── Tipos de evento ─────────────────────────────────────────────────────────────────────
function VentanaTipoEvento({ tipo: t, onCerrar }) {
  const f = useFormulario({ nombre: t?.nombre ?? '', descripcion: t?.descripcion ?? '', activo: t?.activo ?? true })
  const v = f.valores
  const guardar = useGuardarCatalogo(f, () => api.guardarTipoEvento(t?.id, v), t ? 'Tipo de evento actualizado' : 'Tipo de evento creado', onCerrar)
  const casos = t?.casosVigentes ?? 0
  return (
    <VentanaLateral
      abierta
      titulo={t ? 'Editar tipo de evento' : 'Nuevo tipo de evento'}
      bajada={t ? `${t.nombre} · ${plural(casos, 'caso vigente', 'casos vigentes')}` : undefined}
      hayCambios={f.hayCambios}
      onCerrar={onCerrar}
      onGuardar={guardar}
      arriba={casos > 0 && <Mensaje tipo="info">El cambio se ve en todos los casos. Si le cambiás el nombre, los {casos} casos que usan este tipo pasan a mostrar el nombre nuevo.</Mensaje>}
    >
      <Bloque titulo="Datos">
        <Texto etiqueta="Nombre" requerido valor={v.nombre} onCambio={(x) => f.poner('nombre', x)} error={f.errores.nombre} />
        <Texto etiqueta="Descripción" multilinea valor={v.descripcion} onCambio={(x) => f.poner('descripcion', x)} placeholder="Puede incluir la equivalencia con los formularios de los organismos" />
      </Bloque>
      <Bloque titulo="Estado">
        <Opciones
          vertical
          opciones={[[true, 'Activo'], [false, 'Inactivo']]}
          descripciones={{ true: 'Se ofrece al registrar o editar un caso.', false: `Deja de ofrecerse en los casos nuevos. ${casos ? `Los ${casos} casos que ya lo tienen lo conservan.` : ''}` }}
          valor={v.activo}
          onCambio={(x) => f.poner('activo', x)}
          sinError
        />
      </Bloque>
    </VentanaLateral>
  )
}

// Administración › Tipos de evento (tipos-de-evento.md). No se borra: se desactiva.
export function TiposEvento() {
  const { datos: tipos } = useApi(() => api.listarTiposEvento())
  const [ventana, setVentana] = useState(null)
  const columnas = [
    { clave: 'nombre', titulo: 'Tipo de evento', celda: (t) => <Box sx={{ whiteSpace: 'normal', maxWidth: 520 }}><CeldaDoble destacado principal={t.nombre} secundario={t.descripcion} /></Box> },
    { clave: 'casos', titulo: 'Casos vigentes', celda: (t) => mono(t.casosVigentes) },
    { clave: 'estado', titulo: 'Estado', celda: (t) => <Vigencia activo={t.activo} /> },
    { clave: 'acciones', titulo: 'Acciones', acciones: true, celda: (t) => <MenuFila etiqueta={`Acciones de ${t.nombre}`} acciones={[{ texto: 'Editar', onClick: () => setVentana({ tipo: t }) }]} /> },
  ]
  return (
    <>
      <EncabezadoPagina titulo="Tipos de evento" bajada="Catálogo que clasifica cada caso (campo T1 de la ficha)." />
      <Mensaje tipo="advertencia" sx={{ mb: 2.5 }}>Valores en revisión con el cliente. Son la propuesta del equipo. El tipo de lesión ya no existe como dato: el tipo de evento lo reemplaza.</Mensaje>
      <Panel>
        <Box sx={{ p: 2 }}><BotonNuevo texto="Nuevo tipo de evento" onClick={() => setVentana({})} /></Box>
        <Tabla columnas={columnas} filas={tipos} anchoMinimo={720} />
      </Panel>
      {ventana && <VentanaTipoEvento tipo={ventana.tipo} onCerrar={() => setVentana(null)} />}
    </>
  )
}
