import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Box, Button } from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import FiltroAplicado from '@/componentes/FiltroAplicado'
import VentanaLateral from '@/componentes/VentanaLateral'
import { Fila, Seleccion, Texto } from '@/componentes/formulario/Campos'
import Mapa from '@/componentes/mapa/Mapa'
import { centros, encuadreProvincia } from '@/componentes/mapa/encuadre'
import EnlaceCaso from '@/componentes/caso/EnlaceCaso'
import EstadoCaso from '@/componentes/caso/EstadoCaso'
import { especies, tamanos } from '@/componentes/caso/catalogos'
import { api, useApi } from '@/mocks'
import { hoy } from '@/mocks/datos'
import { fechaCorta, nombreCompleto } from '@/utiles/formato'

const ciudades = { Ushuaia: 'Ushuaia', 'Río Grande': 'Río Grande', Tolhuin: 'Tolhuin' }
const campos = ['anio', 'ciudad', 'especie', 'tamano', 'color', 'tipoEvento']

// «Perro mediano negro con manchas blancas · perro grande marrón»; sin descripción, solo la especie.
function animalesCorto(animales) {
  return animales.map((a, i) => {
    const partes = [especies[a.especie], a.descripcion?.tamano && tamanos[a.descripcion.tamano], a.descripcion?.color].filter(Boolean)
    const texto = partes.join(' ').toLowerCase()
    return i === 0 ? texto.replace(/^./, (c) => c.toUpperCase()) : texto
  }).join(' · ')
}

function Linea({ etiqueta, children }) {
  return (
    <Box sx={{ mb: 1.25 }}>
      <Box sx={{ fontSize: 11.5, color: 'text.tertiary' }}>{etiqueta}</Box>
      <Box sx={{ fontSize: 14 }}>{children}</Box>
    </Box>
  )
}

// Mapa de los casos vigentes (mapa.md). Cada punto lo puso una persona; no se geocodifica nada.
export default function MapaCasos() {
  const [params, setParams] = useSearchParams()
  const filtros = Object.fromEntries(campos.map((c) => [c, params.get(c) ?? (c === 'anio' ? hoy.slice(0, 4) : '')]))
  const { datos } = useApi(() => api.puntosMapa(filtros), [filtros])
  const [elegido, setElegido] = useState(null)
  const [abierta, setAbierta] = useState(false)
  const [borrador, setBorrador] = useState(filtros)
  // Qué filtros se ofrecen lo dice el servidor según quién mira.
  const { datos: ofrecidos } = useApi(() => api.filtrosMapa(), [])
  const ofrece = (c) => ofrecidos.includes(c)
  const punto = datos.puntos.find((p) => p.numero === elegido)

  const aplicar = (f) => {
    const p = new URLSearchParams()
    for (const c of campos) if (f[c]) p.set(c, f[c])
    setParams(p)
  }
  const quitar = (c) => aplicar({ ...filtros, [c]: c === 'anio' ? '' : '' })

  const chips = [
    filtros.especie && ['especie', `Especie: ${especies[filtros.especie]}`],
    ofrece('tamano') && filtros.tamano && ['tamano', `Tamaño: ${tamanos[filtros.tamano]}`],
    ofrece('color') && filtros.color && ['color', `Color: ${filtros.color}`],
    filtros.ciudad && ['ciudad', `Ciudad: ${filtros.ciudad}`],
    filtros.tipoEvento && ['tipoEvento', `Tipo de evento: ${filtros.tipoEvento}`],
    filtros.anio && ['anio', `Período: ${filtros.anio}`],
  ].filter(Boolean)
  const poner = (c) => ({ valor: borrador[c], onCambio: (v) => setBorrador((b) => ({ ...b, [c]: v ?? '' })) })
  const limites = filtros.ciudad ? [[centros[filtros.ciudad][0] - 0.02, centros[filtros.ciudad][1] - 0.04], [centros[filtros.ciudad][0] + 0.02, centros[filtros.ciudad][1] + 0.04]] : encuadreProvincia

  return (
    <>
      <EncabezadoPagina titulo="Mapa" bajada="Dónde ocurrieron los casos vigentes. Cada punto lo puso una persona en el mapa (pin + dirección + referencias)." extra={<NotaDatosEjemplo />} />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
        {chips.map(([c, t]) => <FiltroAplicado key={c} etiqueta={t} onQuitar={() => quitar(c)} />)}
        <Button variant="outlined" color="inherit" startIcon={<TuneIcon />} onClick={() => { setBorrador(filtros); setAbierta(true) }} sx={{ ml: 'auto', borderColor: 'divider', bgcolor: 'background.paper' }}>Filtros</Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 300px' } }}>
        <Mapa
          alto={520}
          limites={limites}
          puntos={datos.puntos.map((p) => ({ id: p.numero, latitud: p.latitud, longitud: p.longitud, grave: p.marcas.includes('grave') }))}
          elegido={elegido}
          onElegir={setElegido}
        />
        <Panel sx={{ p: '16px 18px' }}>
          <Box sx={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'text.tertiary', mb: 1 }}>Caso seleccionado</Box>
          {punto ? (
            <>
              <Box sx={{ mb: 1.5 }}><EnlaceCaso numero={punto.numero} /></Box>
              <Linea etiqueta="Víctima">{[nombreCompleto(punto.victima), punto.victima.edad != null && `${punto.victima.edad} años`].filter(Boolean).join(' · ')}</Linea>
              <Linea etiqueta="Fecha del hecho">{fechaCorta(punto.fechaHecho) ?? 'Sin dato'}</Linea>
              <Linea etiqueta="Lugar">
                {[punto.lugar.direccion, punto.lugar.ciudad].filter(Boolean).join(', ')}
                {punto.lugar.referencias && <Box sx={{ fontSize: 12.5, color: 'text.tertiary' }}>{punto.lugar.referencias}</Box>}
              </Linea>
              <Linea etiqueta="Animales">{animalesCorto(punto.animales)}</Linea>
              <Linea etiqueta="Tipo de evento">{punto.tipoEvento ?? 'Sin dato'}</Linea>
              <Box sx={{ mb: 2 }}><EstadoCaso estado={punto.estado} /></Box>
              <Button variant="outlined" color="inherit" component={Link} to={`/casos/${punto.numero}`} sx={{ borderColor: 'divider' }}>Abrir caso</Button>
            </>
          ) : (
            <Box sx={{ fontSize: 14, color: 'text.tertiary' }}>Elegí un punto del mapa para ver el caso.</Box>
          )}
        </Panel>
      </Box>

      <Box sx={{ mt: 1.5, fontSize: 12.5, color: 'text.tertiary' }}>
        {datos.total} casos con los filtros aplicados · en rojo, los casos graves · solo casos vigentes (sin desestimados ni unificados)
        {datos.sinUbicacion > 0 && ` · ${datos.sinUbicacion} ${datos.sinUbicacion === 1 ? 'caso sin ubicación no se muestra' : 'casos sin ubicación no se muestran'}`}.
        {ofrece('tamano') && ' El filtro de tamaño y color mira la descripción de cada animal en el caso: entra si un mismo animal cumple los dos.'}
      </Box>

      <VentanaLateral
        abierta={abierta}
        titulo="Filtros del mapa"
        onCerrar={() => setAbierta(false)}
        textoGuardar="Aplicar"
        deshabilitado={false}
        onGuardar={() => { aplicar(borrador); setAbierta(false) }}
      >
        <Fila>
          <Seleccion etiqueta="Período (año)" vacio="Todos" opciones={[['2026', '2026'], ['2025', '2025']]} {...poner('anio')} />
          <Seleccion etiqueta="Ciudad" vacio="Todas" opciones={ciudades} {...poner('ciudad')} />
          <Seleccion etiqueta="Especie" vacio="Todas" opciones={especies} {...poner('especie')} />
          {ofrece('tamano') && <Seleccion etiqueta="Tamaño" vacio="Todos" opciones={Object.entries(tamanos).filter(([k]) => k !== 'no_sabe')} {...poner('tamano')} />}
          {ofrece('color') && <Texto etiqueta="Color" ayuda="Se busca como texto contenido: «Negro» encuentra «Negro con manchas blancas»." {...poner('color')} />}
          <Seleccion etiqueta="Tipo de evento" vacio="Todos" opciones={api.tiposEventoActivos().map((t) => [t, t])} {...poner('tipoEvento')} />
        </Fila>
        <Box sx={{ fontSize: 12.5, color: 'text.tertiary' }}>Especie, tamaño y color miran cada animal del caso, y se cumplen en el mismo animal.</Box>
      </VentanaLateral>
    </>
  )
}
