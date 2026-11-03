# Vista · Casos › Bandeja

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ` («SIRAM — Diseño»), página **Casos**, componente
  **«Casos › Bandeja · v2»** (nodo `108:5214`). Se lee con el MCP de Figma.
- Piezas usadas, en la página **Fundamentos**: Marca (`4:13`), Estado del caso (`4:29`), Motivo de
  espera (`4:36`), Organismo (chip), Chip de filtro (`5:79`), Campo de búsqueda (`5:92`), Tabla/*,
  Pie de tabla, Leyenda de marcas, Encabezado de página.
- Ruta: `/casos` (menú Casos › Bandeja).

## Para qué sirve

Todos los casos, en cualquier estado. Es la puerta de entrada al trabajo diario: se busca un caso,
se lo abre y desde acá se registra uno nuevo. **Arriba queda lo que alguien tocó hace poco.**

## Qué cambia respecto del código actual (`src/pantallas/casos/bandeja/`)

1. **Orden:** por **última modificación**, de la más reciente a la más vieja (hoy: por número de caso).
   Bajada: «Ordenados por última modificación: arriba queda lo que alguien tocó hace poco.»
2. **Columnas nuevas o cambiadas:** se agrega *Última modificación*; *Animal* pasa a *Animales*;
   *Lesión* pasa a *Tipo de evento*; *Origen* (organismo) pasa a *Canal de origen*.
3. **Marcas:** sale «Posible evento relacionado»; entra **«Grave»**. Quedan Incompleto · Posible
   duplicado · Grave.
4. **Filtros rápidos:** sale «Eventos relacionados»; entra «Graves».
5. **Búsqueda:** el placeholder pasa a «Buscar por caso, víctima o DNI» y busca también por DNI.
6. **Motivo de espera:** el texto pasa de «Pendiente de …» a «Esperando …» (contacto, respuesta,
   certificado).
7. **Menú:** sale «Eventos relacionados» de Casos (y su contador). Ver «Navegación» en `../README.md`.

## Estructura (de arriba hacia abajo)

1. **Encabezado de página:** «Bandeja de casos» + bajada + nota «Datos de ejemplo».
2. **Herramientas:** campo de búsqueda · botón **Nuevo caso** · a la derecha, tres botones de ícono
   (filtros, densidad de filas, columnas visibles). Filtros y columnas siguen **deshabilitados**
   («en diseño»); la densidad funciona como hoy.
3. **Filtros rápidos** (chips, uno activo a la vez, con su cantidad entre paréntesis):

   | Chip | Qué casos muestra |
   |---|---|
   | Todos | Todos |
   | Incompletos | Vigentes con la marca *incompleto* |
   | Posibles duplicados | Vigentes con la marca *posible duplicado* |
   | En seguimiento | Estado *en seguimiento* |
   | Graves | Con la marca *grave*, **en cualquier estado** (un caso grave sigue siéndolo después de finalizar) |

   *Vigente* = ni desestimado ni unificado (como hoy en `criterios.js`). Las cantidades se calculan
   sobre lo que deja la búsqueda, como hoy.
4. **Tabla** (columnas abajo) con la columna de acciones clavada a la derecha.
5. **Pie de tabla:** filas por página (10 por defecto), «1–10 de N», paginación.
6. **Leyenda de marcas** debajo del panel: Incompleto · Posible duplicado · «Grave — un animal del
   caso murió o enfermó en la observación».

## Columnas

| Columna | Línea principal | Segunda línea (más chica) | Notas |
|---|---|---|---|
| Marcas | Íconos de marca, pegados, a la izquierda | — | Puede haber varias o ninguna. Orden: incompleto, posible duplicado, grave. |
| Caso | Número (`C-2026-0418`), enlace a la ficha | — | Mono. |
| Última modificación | Fecha y hora (`13/09/2026 09:12`) | Quién (`L. Puig`) | Mono. Quién puede ser «Sistema». |
| Fecha del hecho | Fecha (`12/09/2026`) | Hora (`14:20`) | Mono. Cualquiera de las dos puede faltar: se muestra «Sin dato». |
| Víctima | Nombre (destacado) | Edad (`7 años`) | Si la edad falta, sin segunda línea. |
| Lugar | Dirección | Ciudad | |
| Animales | Especie del primer animal (`Perro`) | `1 animal` si hay uno; `+N animal`/`+N animales` si hay más | Un caso puede no tener animales cargados todavía: «Sin dato». |
| Tipo de evento | Texto (`Ataque con mordedura`) | — | Catálogo administrable; el valor viene de la API. |
| Estado | Píldora de estado | Ver abajo | Nunca se junta con las marcas. |
| Canal de origen | Chip (`Zoonosis`, `Salud`, `CADIC`, `Ciudadano`, `Histórico`) | — | Es un dato, no un color del sistema. |
| (acciones) | Menú `⋮` | — | Como hoy. |

**Segunda línea de la columna Estado:**
- *En seguimiento* → el motivo de espera: «Esperando contacto», «Esperando respuesta» o «Esperando
  certificado» (color de advertencia).
- *Unificado* → «→ C-2026-0402», el caso que lo absorbió (mono).
- *Desestimado* → el motivo de desestimación (p. ej. «Hecho no verificable»).
- *Finalizado* con algún animal cuya observación del día 10 quedó «No se pudo observar» → «Un animal
  no se pudo observar (día 10)». Es una aclaración, **no** una marca: el caso no es incompleto por eso.
- *Registrado* → nada.

## Marcas

| Marca | Cuándo aparece | Cómo se ve |
|---|---|---|
| Incompleto | Le falta algún dato **del caso** | «!» rojo sobre fondo suave con borde rojo (como hoy) |
| Posible duplicado | Su víctima tiene el mismo DNI que la de otro caso y nadie decidió todavía | Dos cuadrados violetas (como hoy) |
| **Grave** (nueva) | Algún animal del caso murió o enfermó en la observación del día 10 | Cuadrado **rojo relleno** con «!» claro (color `error.main`, texto `background.paper`). Tooltip: «Grave: un animal del caso murió o enfermó en la observación» |

Las marcas **llegan calculadas por la API**: el front no decide cuándo un caso es incompleto, grave o
posible duplicado.

## Datos de ejemplo

La forma real la define la API (OpenAPI del back). Esta es una forma de ejemplo para `src/mocks/`,
pensada para que la tabla no tenga que calcular nada:

```json
{
  "numero": "C-2026-0418",
  "ultimaModificacion": { "fecha": "2026-09-13T09:12", "por": "L. Puig" },
  "fechaHecho": "2026-09-12",
  "horaHecho": "14:20",
  "victima": { "nombre": "Micaela Sosa", "edad": 7 },
  "lugar": { "direccion": "Kuanip 1240", "ciudad": "Ushuaia" },
  "animales": [{ "especie": "perro" }, { "especie": "perro" }],
  "tipoEvento": "Ataque con mordedura",
  "estado": "registrado",
  "motivoEspera": null,
  "unificadoEn": null,
  "motivoDesestimacion": null,
  "animalNoObservado": false,
  "canalOrigen": "zoonosis",
  "marcas": ["incompleto", "duplicado"]
}
```

Valores: `estado` ∈ registrado · en_seguimiento · finalizado · desestimado · unificado ·
`motivoEspera` ∈ contacto · respuesta · certificado (solo en seguimiento) · `canalOrigen` ∈
ciudadano · salud · zoonosis · cadic · historico · `marcas` ⊂ incompleto · duplicado · grave.

Las filas de Figma, para armar el mock (de más reciente a más vieja por última modificación):

| Caso | Últ. modificación | Hecho | Víctima | Lugar | Animales | Tipo de evento | Estado (2.ª línea) | Canal | Marcas |
|---|---|---|---|---|---|---|---|---|---|
| C-2026-0418 | 13/09 09:12 · L. Puig | 12/09 14:20 | Micaela Sosa, 7 | Kuanip 1240, Ushuaia | Perro +1 | Ataque con mordedura | Registrado | Zoonosis | incompleto, duplicado |
| C-2026-0421 | 13/09 08:30 · D. Marchisoney | 03/09 19:30 | Tomás Ibarra, 52 | San Martín 820, Ushuaia | Perro, 1 | Ataque con mordedura | En seguimiento (respuesta) | Salud | grave |
| C-2026-0417 | 12/09 18:02 · M. Acosta | 11/09 09:05 | Ramiro Beltrán, 34 | Gobernador Paz 845, Ushuaia | Perro, 1 | Ataque con mordedura | En seguimiento (certificado) | Zoonosis | — |
| C-2026-0420 | 12/09 16:40 · J. Valle | 10/09 18:40 | Lucía Ferreyra, 29 | Perito Moreno 320, Río Grande | Gato, 1 | Lesión compatible | Registrado | Ciudadano | — |
| C-2026-0404 | 11/09 10:15 · C. Iraola | 01/09 08:30 | Tomás Aguirre, 45 | Alem 2190, Río Grande | Perro, 1 | Intento sin lesión | En seguimiento (contacto) | Salud | incompleto |
| C-2026-0411 | 10/09 12:00 · M. Acosta | 06/09 11:15 | Joaquín Ojeda, 12 | San Martín 1502, Río Grande | Perro, 1 | Ataque con mordedura | Unificado (→ C-2026-0402) | CADIC | — |
| C-2026-0398 | 08/09 09:40 · M. Acosta | 27/08 16:55 | Valentina Núñez, 8 | Karukinká 540, Tolhuin | Perro, 1 | Lesión derivada | Finalizado (un animal no se pudo observar) | Zoonosis | — |
| C-2026-0393 | 02/09 15:20 · D. Marchisoney | 22/08 13:25 | Héctor Maldonado, 52 | Rivadavia 610, Ushuaia | Perro, 1 | Lesión compatible | Desestimado (Hecho no verificable) | Histórico | incompleto |

Todas las fechas son de 2026.

## Comportamiento

- **Búsqueda:** por número de caso, nombre de la víctima y DNI de la víctima, sin distinguir
  mayúsculas ni acentos (como hoy). El DNI **no se muestra** en la tabla (minimización de datos
  personales). Con la API, la búsqueda la hace el servidor; en el mock podés agregar `victima.dni`
  solo para simularla, sin mostrarlo.
- **Filtro + búsqueda:** se combinan; cambiar cualquiera vuelve a la página 1 (como hoy).
- **Clic en el número de caso:** abre la ficha (`/casos/:numero`).
- **Nuevo caso:** abre el formulario inicial (ficha propia, pendiente de entregar). Por ahora sigue
  navegando a `/casos/nuevo`.
- **Vacío:** «No hay casos que coincidan con la búsqueda.» (como hoy).

## Lo que depende de quién mira (las reglas viven en el servidor)

El front muestra lo que llega y no decide por rol. En esta vista:
- **Analista / comité:** la API no manda nombre ni DNI de la víctima. La columna Víctima muestra solo
  la edad, y la búsqueda no busca por nombre ni por DNI.
- **Administrador:** no ve casos. La bandeja no le aparece (la API no le devuelve casos).
- Agentes de Salud, Zoonosis y CADIC ven todas las columnas.

## Fuera de esta ficha

Filtros avanzados y columnas visibles (siguen «en diseño»), el formulario de Nuevo caso y la ficha del
caso: tienen o van a tener su propia ficha.
