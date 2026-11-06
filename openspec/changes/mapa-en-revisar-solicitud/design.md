## Context

`RevisarSolicitud.jsx` arma el bloque «Dónde y qué pasó» con `Bloque` + `Datos` y oculta con `Si`
las filas que la persona no respondió. La solicitud trae `hecho.latitud` y `hecho.longitud` cuando
la persona completó «¿Dónde fue?». La ficha del caso (`FichaCaso.jsx`, bloque «Hecho») ya resuelve
lo mismo para un caso: `Mapa` debajo de `Datos` y una línea mono con las coordenadas.

## Goals / Non-Goals

**Goals:**
- Mismo aspecto que el mapa de la ficha del caso, para que el agente lo reconozca.

**Non-Goals:**
- Crear un componente compartido entre la ficha y la revisión. Son dos usos de cuatro líneas cada
  uno. Si aparece un tercero, se extrae.
- Cambiar `Mapa.jsx` o el formulario público.

## Decisions

- **Reusar `Mapa` con `centro` y `puntos`, sin `onMover` ni `pinFijo`.** Sin `onMover` no hay manera
  de devolver un punto nuevo, así que el mapa queda de solo lectura sin tocar el componente. Se
  descartó usar `pinFijo` (el pin del formulario): ese pin significa «mové el mapa para elegir» y
  confundiría en una vista de solo lectura.
- **Punto con el estilo base (`punto`), sin `grave`.** Una solicitud no tiene marcas: las marcas son
  del caso.
- **Debajo de `Datos`, no como una fila más.** `Datos` es una grilla de 3 columnas y un mapa
  adentro rompe la grilla. Se copia la ubicación de la ficha (`mt: 2.5`, alto 220) y la línea de
  coordenadas (`fuentes.mono`, 12 px, `text.tertiary`).
- **Condición: `s.hecho.latitud != null`**, la misma que ya usa la nota de la fila «Ubicación».

Componentes: se reusan `Mapa`, `Bloque`, `Datos` y `Dato`. No se crea ninguno. No hacen falta tokens
nuevos: los colores del punto ya salen del tema dentro de `Mapa`.

## Risks / Trade-offs

- [Un punto que la persona no eligió] Ya no pasa con el change `ciudad-inicial-y-mapa-sin-tocar`:
  si la persona no mueve el mapa, la solicitud queda sin coordenadas y este mapa no se muestra. →
  Aplicar ese change antes que este. Mientras tanto, la demo todavía guarda el centro de la ciudad.
- [La ficha no pide el mapa] → Avisar al agente de diseño para que actualice
  `docs/vistas/solicitudes.md`.
