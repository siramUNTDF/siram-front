# SIRAM — guía del front

> Entregado por el agente de diseño (repo `../proyecto`). No lo edites desde el front: si algo no
> cierra, avisá al usuario. Última actualización: 2026-11-04.

## Qué es SIRAM

**Sistema Integrado de Registro de Ataques y Mordeduras.** Registro provincial único de casos de
ataques y mordeduras de perros y gatos a personas en Tierra del Fuego. Lo usan agentes de varios
organismos (Zoonosis, Salud, CADIC…) para registrar casos, completarlos, detectar duplicados y
consultar estadísticas. **SIRAM trata casos**: para qué sirve cada pantalla y cómo se usa está en
`narrativa.md`; leelo antes de proponer un cambio. **El proyecto no arranca de cero:** las pantallas
ya están diseñadas en **Figma**, y cada vista tiene una **ficha** en `vistas/` que dice cómo se comporta.

## Cómo se trabaja una vista *(desde el 2026-11-03)*

0. **Las reglas de negocio son obligatorias** (`narrativa.md`, «Reglas de negocio»). Están por encima
   de Figma y de las fichas. Si algo las contradice, no elijas: avisale al usuario. Antes de dar una
   vista por terminada, verificá que cumple las que le tocan.
1. **Lo visual sale de Figma**: archivo `XC7e02ZzIfQwmALf1RHgiZ` («SIRAM — Diseño»), leído con el MCP
   de Figma. Cada ficha dice qué nodo mirar. Los tokens de Figma (colecciones «Tokens» y «Paleta»)
   son los de `src/tema/tokens.js`.
2. **El comportamiento y los datos salen de la ficha** (`vistas/<vista>.md`): qué cambia respecto del
   código, columnas, estados, datos de ejemplo y qué pasa según quién mira. **Si Figma y la ficha no
   coinciden, gana la ficha.**
3. **Desde que una vista está implementada, el código es la referencia** de esa vista. Figma se
   vuelve a poner al día con el código al final del proyecto.
4. **Cuando la vista está implementada, su ficha se marca «Implementada»** (lo hace el agente de
   diseño al revisar el código; el front no edita `docs/`), con la fecha, arriba de
   todo (p. ej. `> **Implementada el 2026-11-10. No se mantiene y puede estar superada: la referencia
   es el código.**`). Desde ahí la ficha no se actualiza; los cambios se hacen en el código y la ficha
   queda solo como antecedente. Lo que cambie de dominio llega como aviso en este README. Si una vista
   implementada se rediseña a fondo, se escribe una ficha nueva.

## Archivos de esta carpeta

| Archivo | Qué es |
|---|---|
| `vistas/*.md` | **Una ficha por vista** (18; lista abajo). |
| `narrativa.md` | **Para qué sirve SIRAM y cómo se usa:** la historia, el vocabulario, cómo se muestra un caso, quién ve qué y para qué sirve cada pantalla. Reescrita el 2026-11-03. |
| `lenguaje-visual-delta-a-siram.html` | El porqué del lenguaje visual (qué se hereda de Delta y qué se corrige). Los valores concretos están en Figma. |

## Fichas de vista

| Área | Fichas |
|---|---|
| Casos | `bandeja.md` · `nuevo-caso.md` · `ficha-del-caso.md` (con sus ventanas) · `historial.md` · `solicitudes.md` (cola, revisar, sumar) · `posibles-duplicados.md` (lista y comparar) · `incompletos.md` |
| Inicio | `inicio.md` |
| Consultas | `busqueda.md` · `personas.md` · `animales.md` (con reconciliar) · `mapa.md` · `estadisticas.md` · `exportar.md` |
| Administración | `usuarios.md` (con roles y permisos) · `organismos.md` · `tipos-de-evento.md` |
| Público | `formulario-publico.md` (8 pantallas, sin cáscara) |

Cada ficha tiene una sección **«Pendiente»**: lo que está ahí no se implementa todavía.

## Lenguaje visual (resumen)

- **Base:** Delta, el backoffice React de la Municipalidad de Ushuaia, módulo `modulos/servicios-publicos`
  (commit `9a4cbb6a`, en `/home/dddario/front/delta`, solo lectura; ver también `componentes/theme`,
  `componentes/base`, `componentes/modulo`). Se hereda **el lenguaje visual**. Los componentes base de Delta
  envuelven paquetes npm privados (`@municipalidadushuaia/*`: componentes, queries, formularios,
  ventanas). El equipo tiene acceso para **leerlos** (todavía no están en este entorno): son
  **referencia para escribir componentes propios** de SIRAM, no una dependencia. No se instalan ni se
  importan.
- **Versiones de Delta (referencia):** React 18.2 · MUI 7.1 · react-hook-form 7.43 · TanStack Query
  5.75 · Vite 6.2. SIRAM no está atado a ellas; elegirlas es una decisión del front.
- **Cáscara:** barra superior fija de 89 px; menú lateral de 240 px colapsable a 65 px; solo el
  contenido scrollea; sin breadcrumbs ni footer. Ítem activo = píldora `border-radius: 0 30px 30px 0`.
  **Dos niveles de menú, nunca tres.**
- **Navegación:**
  - Inicio (panel)
  - Casos: Bandeja, Nuevo caso, Solicitudes, Posibles duplicados, Incompletos
  - Consultas: Búsqueda, Personas, Animales, Mapa, Estadísticas, Exportar
  - Administración: Usuarios, Organismos, Tipos de evento
  - *(2026-11-03: salen «Eventos relacionados» e «Importar CSV»; entran Solicitudes, Personas y
    Animales.)*
- **Ventanas:** crear/editar/confirmar abren un **drawer lateral** (50 % en escritorio, 100 % en
  teléfono), Cancelar a la izquierda y Guardar a la derecha. Guardar deshabilitado hasta que haya cambios.
- **Formularios:** un fieldset con leyenda por bloque; 20 px reservados para el error bajo cada
  campo; la ayuda va en un ícono junto a la etiqueta, nunca como texto bajo el campo.
- **Mensajes:** éxito/info se autocierran; advertencia/error exigen cierre manual.
- **Tokens:** acento `#00776F`, tinta `#16211F`, fondo `#F6F7F7`; colores semánticos ok, warn, crit,
  info, dup (violeta), rel (tierra). Todo color es un token. Los valores del tema oscuro ya están en
  Figma (colección «Tokens», modo Oscuro).
- **Tema oscuro: obligatorio, en una segunda pasada.** Primero va una versión base en tema claro;
  después se agrega el oscuro revisando cada vista. Por eso, desde el primer componente, ningún color
  va escrito a mano: todo sale de un token. Al terminar, el tema arranca según el sistema operativo y
  recuerda la elección.
- **Tipografía:** Archivo (títulos), Source Sans 3 (cuerpo, **15 px base**), IBM Plex Mono (datos y
  códigos). `tabular-nums` en fechas, DNI, edades y cantidades. Todas son libres. Gotham, la de Delta,
  es una licencia comprada y no se usa.
- **Íconos:** un solo set, `@mui/icons-material`.
- **Ningún organismo domina:** el organismo aparece como dato (chip, columna, filtro), nunca como
  marca visual del sistema.

## Cómo se muestra el estado de un caso

Un caso tiene tres indicadores independientes. **No los juntes en un solo componente.**

| Indicador | Cómo se ve | Valores (de ejemplo, los definitivos vienen de la API) |
|---|---|---|
| Estado | Píldora en su propia columna | Registrado · En seguimiento · Finalizado · Desestimado · Unificado |
| Motivo de espera | Junto al estado, solo si está «En seguimiento» | Contacto · Respuesta · Certificado |
| Marcas | Íconos pegados al identificador, a la izquierda; pueden ser varias | Incompleto · Posible duplicado · Grave *(2026-11-03: sale «Posible evento relacionado»)* |

## De dónde salen los datos

- **Hoy:** no hay API. Usá datos de ejemplo con la forma que da cada ficha de vista, aislados en un
  solo lugar (`src/mocks/`) para poder reemplazarlos sin tocar las pantallas.
- **Después:** el backend (repo `../back`) publica la API REST con su esquema OpenAPI. Ese esquema es
  el contrato del front; las dudas sobre datos se resuelven con el back.

## Avisos del agente de diseño

Ajustes que el código del front todavía no refleja. **Registralos como pendientes en tu repo** (p. ej.
un change de openspec). Cuando estén hechos no hace falta avisar: el agente de diseño revisa el código
y borra el aviso de acá.

- **2026-11-06 · Ciudad en el formulario inicial y mapa sin tocar.** Actualizadas `narrativa.md` §1
  (paso 2), `vistas/formulario-publico.md` (pantallas 1 y 3, envíos de ejemplo), `vistas/nuevo-caso.md`
  (bloque «Hecho», tabla de obligatorios, validación) y `vistas/solicitudes.md` (mapa del pin en
  Revisar solicitud, datos de ejemplo). Recoge los changes `ciudad-inicial-y-mapa-sin-tocar` y
  `mapa-en-revisar-solicitud`.
- **2026-11-06 · Emparejar animales al sumar.** `vistas/solicitudes.md`, pantalla Sumar, paso 4: por
  cada animal de la solicitud, un selector «Es en el caso:» (animales del caso de la misma especie, sin
  repetir) más «Es otro animal» y «No va al caso». «Sumar al caso» se habilita con todos emparejados.
  El envío suma `animales` (`animalCaso`: número, `"nuevo"` o `null`). `vistas/ficha-del-caso.md`:
  `declaradoEnSolicitudes` llega en el animal correcto también al sumar (arregla el hueco de
  `sumarSolicitud` en el mock).
- **2026-11-06 · Hasta 2 solicitudes por caso, solo a casos abiertos.** `vistas/solicitudes.md`: solo se
  suma a un caso *Registrado* o *En seguimiento* con menos de 2 solicitudes; los demás se muestran sin
  poder elegirse, con el motivo. `vistas/ficha-del-caso.md`: `declaradoEnSolicitud` pasa a ser la lista
  `declaradoEnSolicitudes` (0 a 2, la más reciente primero), y la referencia queda siempre a la vista,
  también después de que Zoonosis confirma el dueño. Al consolidar, las solicitudes del caso absorbido se quedan en él
  (`vistas/posibles-duplicados.md`, «Pendiente»).
- **2026-11-06 · Zoonosis decide sobre los duplicados.** `vistas/posibles-duplicados.md`: Consolidar y
  No es duplicado solo para Zoonosis; Salud y CADIC ven la lista y la comparación sin acciones.
  `vistas/ficha-del-caso.md`: «No es duplicado» solo Zoonosis, y un mensaje nuevo en el caso que
  sobrevive a una consolidación («Este caso absorbió a C-…», campo `absorbio`). `vistas/nuevo-caso.md`:
  con DNI repetido, Salud y CADIC no tienen «Es otro ataque, guardar igual» y el texto del aviso cambia. `vistas/historial.md`:
  tipo de cambio nuevo, **consolidación**.
- **2026-11-06 · Solo Zoonosis ve las solicitudes.** A Salud y CADIC la API no les devuelve la cola: sin
  menú «Solicitudes», sin tarjeta en Inicio, y en la ficha del caso el número de solicitud es texto, no
  enlace. Actualizadas `narrativa.md`, `vistas/solicitudes.md`, `vistas/inicio.md` y
  `vistas/ficha-del-caso.md`. Reemplaza el recorte del dueño declarado para Salud y CADIC: ya no lo
  necesitan, porque no ven solicitudes.
