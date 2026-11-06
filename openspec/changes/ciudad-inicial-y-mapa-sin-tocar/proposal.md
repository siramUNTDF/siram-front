## Why

Decisiones del usuario del 2026-11-06, al revisar `/reportar`:

- **La ciudad es vital para una solicitud** y tiene que estar en el formulario inicial, no recién en
  la parte opcional «¿Dónde fue?». Hoy una solicitud que termina en el inicial llega sin ciudad.
- **El mapa de «¿Dónde fue?» guarda un punto aunque la persona no lo haya tocado.** El mapa arranca
  en el centro de la ciudad, y si la persona aprieta Siguiente sin moverlo, ese centro se guarda
  como el lugar del hecho. Además, cuando el mapa se recentra solo, ya propone una dirección.

## What Changes

**Ciudad en el formulario inicial, en los cuatro canales**
- Se suma la pregunta **Ciudad** (Ushuaia · Río Grande · Tolhuin, sin «Otra»). Tiene la ayuda «Si
  fue fuera de las tres ciudades, marcá la más cercana».
  - En el formulario público va en el bloque «El hecho» y es **obligatoria**.
  - En Nuevo caso va en el bloque «Hecho» y también es **obligatoria**, para Zoonosis, CADIC y
    Salud (decisión del usuario: un caso sin saber dónde fue no sirve).
  - Así se mantiene que todos los canales empiezan con el mismo formulario inicial (narrativa §2).
- En «¿Dónde fue?» se **quita** la pregunta Ciudad: ya se respondió. El mapa arranca centrado en esa
  ciudad.
- La solicitud y el caso guardan la ciudad desde que se crean.

**Mapa oscurecido hasta que la persona lo mueve**
- En «¿Dónde fue?» el mapa arranca oscurecido, con el aviso «Mové el mapa y dejá el pin donde fue el
  ataque».
- El aviso se va con el primer gesto de la persona sobre el mapa: arrastrar, pellizcar, los botones
  de zoom o las flechas del teclado. Un recentrado automático no cuenta.
- La dirección se propone recién al soltar el mapa después de ese gesto.
- Si al apretar Siguiente o Terminar acá el aviso sigue puesto, la parte se guarda **sin punto** y
  sin dirección propuesta. Lo que la persona escribió a mano (dirección, referencias, etc.) se
  guarda igual.

**Datos de ejemplo:** las solicitudes de ejemplo sin ciudad (S-2026-0031, S-2026-0035,
S-2026-0036) pasan a tenerla, porque ahora es obligatoria en el formulario público.

**Se aparta de `docs/`. Hay que avisar al agente de diseño para que actualice:**
- `narrativa.md` §2: la lista de campos del formulario inicial suma la ciudad.
- `vistas/formulario-publico.md`:
  - Pantalla 1: ciudad obligatoria y el ejemplo de envío con `ciudad`.
  - Pantalla 3: sin la pregunta Ciudad, con el mapa oscurecido.
  - El envío de «donde», con `punto` opcional.
- `vistas/nuevo-caso.md`: la ciudad en el bloque «Hecho», una fila en la tabla de obligatoriedad
  (obligatoria en Zoonosis, CADIC y Salud) y la línea 135 («le faltan ciudad…»), porque ningún caso
  nace sin ciudad.

Referencia: el prototipo (`docs/prototipo-siram.html`) ya no está en `docs/`. Las fichas citadas
son la referencia; Figma se revisa con el diseño final.

Fuera de alcance:
- Que la ubicación sea obligatoria.
- Cambiar la geocodificación (sigue siendo la simulada).
- El mapa en Revisar solicitud: es el change `mapa-en-revisar-solicitud`, que ya muestra el mapa
  solo si hay coordenadas.

## Capabilities

### New Capabilities

- `ciudad-formulario-inicial`: la ciudad del hecho como parte del formulario inicial de todos los
  canales. Dónde aparece, que es obligatoria y qué guarda.
- `mapa-formulario-publico`: cómo la persona marca el lugar en «¿Dónde fue?» y cuándo ese punto
  cuenta como respondido.

### Modified Capabilities

_Ninguna._ Las specs existentes no describen los formularios.

## Impact

- `src/pantallas/publico/FormularioInicial.jsx`: pregunta Ciudad y su validación.
- `src/pantallas/publico/sesionReporte.js`: recordar la ciudad para centrar el mapa.
- `src/pantallas/publico/Detallado.jsx` («¿Dónde fue?»): sin Ciudad, el mapa oscurecido y el punto
  solo si la persona lo movió.
- `src/componentes/mapa/Mapa.jsx`: el oscurecido con aviso y el aviso de la primera interacción de
  la persona.
- `src/pantallas/casos/nuevo/NuevoCaso.jsx`: Ciudad en el bloque «Hecho».
- `src/mocks/servidor.js`: `enviarSolicitud` y `crearCaso` guardan la ciudad.
- `src/mocks/datos.js`: ciudad en las tres solicitudes de ejemplo que no la tienen.
- Reglas de negocio: no choca con ninguna RN. RN-05 · RN-08 · RN-31 siguen igual (la solicitud no
  escribe en un caso).
