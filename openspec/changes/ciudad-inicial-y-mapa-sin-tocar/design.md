## Context

- `FormularioInicial.jsx` valida y llama a `api.enviarSolicitud(v)`, y después a
  `sesionReporte.iniciar(numero, token, especie)`. La sesión vive solo en memoria (RN-32).
- `DondeFue` (en `Detallado.jsx`) arranca con `punto: centros.Ushuaia` y centra el mapa en la ciudad
  si la eligen ahí. `onMover` reacciona a `moveend`, que Leaflet también dispara con `setView`. Por
  eso un recentrado automático hoy propone una dirección.
- `Mapa.jsx` ya tiene `pinFijo` (el pin del formulario) y `onMover`.
- Las solicitudes guardan la ciudad como clave (`ushuaia`). Los casos la guardan como texto
  (`Ushuaia`), y al registrar una solicitud se convierte con `ciudadTexto`.
- `catalogos.js` ya exporta `ciudades`. `Detallado.jsx` tiene una copia local.

## Goals / Non-Goals

**Goals:**
- Distinguir «la persona movió el mapa» de «el mapa se movió solo», sin depender de comparar
  coordenadas.

**Non-Goals:**
- Cambiar cómo se ve el pin, la geocodificación simulada o el formato del caso.

## Decisions

- **Aviso y detección dentro de `Mapa`.** Se suman dos props: `aviso` (texto del oscurecido) y
  `onPrimerGesto`. Así la detección queda junto a Leaflet, y el formulario solo guarda un booleano
  `movido`. La alternativa era detectar en `DondeFue` con un `div` encima, pero eso tapa los gestos o
  obliga a un primer toque que no hace nada.
- **Qué cuenta como gesto.** Se escucha `dragstart` de Leaflet (solo lo dispara el usuario), el
  `pointerdown` en los botones de zoom y el `keydown` de las flechas en el contenedor. Un pellizco
  dispara `dragstart` o `zoomstart` con origen táctil. No se usa `movestart`/`zoomstart` a secas,
  porque también los dispara `setView`.
- **El oscurecido no captura eventos** (`pointer-events: none`), así el primer arrastre ya mueve el
  mapa. El color es `background.default` con opacidad, desde los tokens. El aviso usa la tipografía
  del cuerpo. La atribución queda por encima del oscurecido (`z-index`).
- **`onMover` solo después del gesto.** `DondeFue` ignora `onMover` mientras `movido` es falso, así
  que el recentrado inicial no propone dirección ni cambia el punto.
- **Lo que se envía.** `datos()` incluye `punto`, `latitud` y `longitud` solo si `movido`. El estado
  local (`sesionReporte.guardarLocal`) guarda `movido` y el `punto`, así al volver atrás el mapa se ve
  como lo dejó la persona.
- **Ciudad en la sesión.** `sesionReporte.iniciar` recibe la ciudad para centrar el mapa. Se quita la
  copia local de `ciudades` en `Detallado.jsx` y se usa la de `catalogos.js`.
- **Mocks.** `enviarSolicitud` guarda `hecho.ciudad` con la clave del formulario. `crearCaso` recibe
  `lugar.ciudad` como texto, igual que el resto de los casos: Nuevo caso convierte la clave con el
  catálogo antes de enviar.

Componentes: se reusan `Opciones`, `Bloque`, `Mapa` (extendido) y `catalogos.ciudades`. No se crea
ningún componente. No hacen falta tokens nuevos: el oscurecido y el aviso salen de los que ya existen
(`background.default`, `text.primary`, `background.paper`).

## Risks / Trade-offs

- [Un gesto que Leaflet no avisa] Por ejemplo, una rueda del mouse con `scrollWheelZoom` apagado, que
  no mueve el mapa. → No cuenta como gesto, y está bien: el mapa no se movió.
- [Una persona que no entiende que tiene que mover el mapa] Se guarda sin punto. → Es lo buscado: un
  dato no respondido. La dirección escrita a mano y la ciudad del inicial siguen ubicando el hecho.
- [Las fichas quedan desactualizadas hasta que el agente de diseño las corrija] → La lista de
  cambios para las fichas está en `proposal.md`.
