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

// Mapa con OpenStreetMap (la URL de teselas va en .env). La atribución queda siempre visible.
export default function Mapa({ alto = 320, puntos = [], elegido, onElegir, limites, centro, zoom = 15, onMover, pinFijo = false, sx }) {
  return (
    <Box sx={(t) => ({ position: 'relative', height: alto, borderRadius: 1, overflow: 'hidden', border: 1, borderColor: 'divider', ...estilosPuntos(t), ...sx })}>
      <MapContainer bounds={limites ?? (centro ? undefined : encuadreProvincia)} center={centro} zoom={centro ? zoom : undefined} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer url={config.mapaTeselas} attribution={config.mapaAtribucion} />
        <Encuadrar limites={limites} centro={pinFijo ? undefined : centro} zoom={zoom} />
        {onMover && <AlMover onMover={onMover} />}
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
      {pinFijo && (
        // Pin fijo al centro: la persona mueve el mapa, no el pin.
        <Box aria-hidden sx={{ position: 'absolute', left: '50%', top: '50%', width: 22, height: 22, ml: '-11px', mt: '-22px', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', bgcolor: 'primary.main', border: 2, borderColor: 'background.paper', zIndex: 500, pointerEvents: 'none' }} />
      )}
    </Box>
  )
}
