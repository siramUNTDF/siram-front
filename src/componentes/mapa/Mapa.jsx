import { useEffect } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { Box } from '@mui/material'
import { config } from '@/config'
import { encuadreProvincia } from './encuadre'

// Los colores salen de los tokens: Leaflet dibuja SVG y se pintan por clase.
const estilosPuntos = (t) => ({
  '& .punto': { fill: t.vars.palette.primary.main, stroke: t.vars.palette.background.paper, fillOpacity: 0.9 },
  '& .punto-grave': { fill: t.vars.palette.error.main },
  '& .punto-elegido': { stroke: t.vars.palette.text.primary },
  '& .leaflet-container': { fontFamily: 'inherit', bgcolor: 'background.chrome' },
  '& .leaflet-control-attribution': { fontSize: 11 },
})

// Reencuadra solo cuando cambian los límites o el centro (no en cada redibujo).
function Encuadrar({ limites, centro, zoom }) {
  const mapa = useMap()
  const clave = JSON.stringify({ limites, centro, zoom })
  useEffect(() => {
    const { limites: l, centro: c, zoom: z } = JSON.parse(clave)
    if (l) mapa.fitBounds(l, { padding: [20, 20] })
    else if (c) mapa.setView(c, z ?? mapa.getZoom())
  }, [mapa, clave])
  return null
}

function AlMover({ onMover }) {
  const mapa = useMapEvents({
    moveend: () => {
      const c = mapa.getCenter()
      onMover?.([Number(c.lat.toFixed(4)), Number(c.lng.toFixed(4))])
    },
  })
  return null
}

// Avisa una sola vez el primer gesto de la persona: arrastrar, pellizcar, los botones de zoom o el
// teclado. No usa movestart/zoomstart a secas porque también los dispara un setView automático.
const teclasDelMapa = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '-', '=']
function PrimerGesto({ onPrimerGesto }) {
  const mapa = useMap()
  useEffect(() => {
    let avisado = false
    const avisar = () => {
      if (avisado) return
      avisado = true
      onPrimerGesto()
    }
    const contenedor = mapa.getContainer()
    const alTocar = (e) => { if (e.target.closest?.('.leaflet-control-zoom')) avisar() }
    const alPellizcar = (e) => { if (e.touches?.length > 1) avisar() }
    const alTeclear = (e) => { if (teclasDelMapa.includes(e.key)) avisar() }
    mapa.on('dragstart', avisar)
    contenedor.addEventListener('pointerdown', alTocar)
    contenedor.addEventListener('touchstart', alPellizcar, { passive: true })
    contenedor.addEventListener('keydown', alTeclear)
    return () => {
      mapa.off('dragstart', avisar)
      contenedor.removeEventListener('pointerdown', alTocar)
      contenedor.removeEventListener('touchstart', alPellizcar)
      contenedor.removeEventListener('keydown', alTeclear)
    }
  }, [mapa, onPrimerGesto])
  return null
}

// Mapa con OpenStreetMap (la URL de teselas va en .env). La atribución queda siempre visible.
export default function Mapa({ alto = 320, puntos = [], elegido, onElegir, limites, centro, zoom = 15, onMover, pinFijo = false, aviso, onPrimerGesto, sx }) {
  return (
    <Box sx={(t) => ({ position: 'relative', height: alto, borderRadius: 1, overflow: 'hidden', border: 1, borderColor: 'divider', ...estilosPuntos(t), ...sx })}>
      <MapContainer bounds={limites ?? (centro ? undefined : encuadreProvincia)} center={centro} zoom={centro ? zoom : undefined} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer url={config.mapaTeselas} attribution={config.mapaAtribucion} />
        <Encuadrar limites={limites} centro={pinFijo ? undefined : centro} zoom={zoom} />
        {onMover && <AlMover onMover={onMover} />}
        {onPrimerGesto && <PrimerGesto onPrimerGesto={onPrimerGesto} />}
        {puntos.map((p) => {
          const esElegido = elegido === p.id
          const clases = ['punto', p.grave && 'punto-grave', esElegido && 'punto-elegido'].filter(Boolean).join(' ')
          return (
            <CircleMarker
              key={`${p.id}-${esElegido}`}
              center={[p.latitud, p.longitud]}
              radius={esElegido ? 11 : 7}
              pathOptions={{ className: clases, weight: esElegido ? 3 : 2 }}
              eventHandlers={onElegir ? { click: () => onElegir(p.id) } : undefined}
            />
          )
        })}
      </MapContainer>
      {aviso && (
        // Oscurecido sin capturar eventos: el primer arrastre ya mueve el mapa. Queda debajo de los
        // controles de Leaflet (z-index 1000), así la atribución y el zoom siguen visibles.
        <>
          <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: 450, bgcolor: 'text.primary', opacity: 0.45, pointerEvents: 'none' }} />
          <Box role="note" sx={{ position: 'absolute', left: 16, right: 16, top: 'calc(50% + 14px)', zIndex: 600, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <Box sx={{ px: 1.5, py: 1, borderRadius: 1, bgcolor: 'background.paper', color: 'text.primary', fontSize: 14.5, fontWeight: 600, textAlign: 'center', boxShadow: (t) => `0 2px 8px ${t.vars.palette.sombra}` }}>{aviso}</Box>
          </Box>
        </>
      )}
      {pinFijo && (
        // Pin fijo al centro: la persona mueve el mapa, no el pin.
        <Box aria-hidden sx={{ position: 'absolute', left: '50%', top: '50%', width: 22, height: 22, ml: '-11px', mt: '-22px', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', bgcolor: 'primary.main', border: 2, borderColor: 'background.paper', zIndex: 500, pointerEvents: 'none' }} />
      )}
    </Box>
  )
}
