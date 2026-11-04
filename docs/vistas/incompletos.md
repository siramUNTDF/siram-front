# Vista · Casos › Incompletos

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Casos**, componente **«Casos › Incompletos ·
  v2»** (nodo `108:5220`).
- Piezas: las mismas de la Bandeja (ver `bandeja.md`).
- Ruta: `/casos/incompletos` (menú Casos › Incompletos, con su contador).

## Para qué sirve

La **lista de trabajo para completar casos**: los casos abiertos a los que les falta algún dato del
caso. Un agente entra, abre uno, lo completa desde la ficha con **Editar** (ver `ficha-del-caso.md`) y
el caso sale solo de la lista cuando deja de estar incompleto.

## Qué casos entran

- Casos **vigentes** (ni *desestimados* ni *unificados*) con la marca **incompleto**.
- **Un caso *finalizado* con datos faltantes no entra**: al finalizarlo deja de contar como
  incompleto (pasa cuando la falta de datos es justamente lo que impidió resolverlo, p. ej. nunca se
  ubicó a la víctima).
- **Un caso *desestimado* conserva la marca**, pero no entra en esta lista ni en su contador (dónde se
  cuenta todavía no está definido).
- La marca **la calcula la API**; el front no decide qué caso es incompleto. Esta lista muestra lo que
  la API devuelve para ese criterio.

**Qué datos cuentan** (para que entiendas la marca; el cálculo es del back):
- Seguros (regla del dominio): **fecha del hecho, ciudad y lugar**.
- Supuestos, todavía en revisión con el equipo: **tipo de lugar, edad de la víctima y tipo de
  evento**.
- **No cuentan**: los datos de los animales (ningún valor del día 10, tampoco «No se ubicó», hace
  incompleto al caso), el tratamiento ni la falta de contacto (eso es *En seguimiento · Esperando
  contacto*, no incompleto).

## Estructura

1. **Encabezado:** «Incompletos» · bajada «Casos vigentes a los que les falta algún dato del caso
   (fecha del hecho, ciudad, lugar…). Ordenados por última modificación.» · nota «Datos de ejemplo».
2. **Herramientas:** búsqueda («Buscar por caso, víctima o DNI», igual que en la Bandeja) · botón
   **Nuevo caso**. Sin filtros rápidos.
3. **Tabla:** las **mismas columnas que la Bandeja** (marcas, caso, última modificación, fecha del
   hecho, víctima, lugar, animales, tipo de evento, estado, canal de origen). Orden: última
   modificación, más reciente arriba.
4. **Pie de tabla.**
5. **Nota** debajo del panel: «Solo casos vigentes. Un caso finalizado con datos faltantes deja de
   contar como incompleto. Uno desestimado conserva la marca, pero no entra en las listas de trabajo
   (dónde se cuenta está pendiente).»
6. **Leyenda de marcas.**

## Comportamiento

- **Tooltip de la marca Incompleto:** si la API manda qué datos faltan, el tooltip los nombra
  («Incompleto: faltan ciudad y lugar»). Si no los manda, queda el texto genérico «Incompleto: faltan
  datos obligatorios».
- **Clic en el caso:** abre la ficha. Al volver, la lista se recarga (el caso puede haber salido).
- **Vacío:** «No hay casos incompletos.»
- Las celdas con un dato faltante muestran «Sin dato» como en la Bandeja.

## Datos de ejemplo

Las filas tienen la misma forma que en `bandeja.md`, más (opcional) la lista de datos que faltan:

```json
{ "numero": "C-2026-0418", "marcas": ["incompleto", "duplicado"], "faltantes": ["tipoLugar"], "…": "resto igual que en la Bandeja" }
```

`faltantes` usa los nombres de campo de los JSON de ejemplo: `fechaHecho`, `lugar.ciudad`,
`lugar.direccion`, `tipoLugar`, `victima.edad`, `tipoEvento`.

Las filas para el mock (datos al 25/09/2026; la última modificación de C-2026-0418 es la carga del día
10 de sus dos animales, el 22/09 por M. Acosta):

| Caso | Le falta | … |
|---|---|---|
| C-2026-0418 | tipo de lugar | 22/09 10:15 · M. Acosta · 12/09 14:20 · Micaela Sosa, 7 · Kuanip 1240, Ushuaia · Perro +1 · Ataque con mordedura · Registrado · Zoonosis |
| C-2026-0404 | tipo de lugar | 11/09 10:15 · C. Iraola · 01/09 08:30 · Tomás Aguirre, 45 · Alem 2190, Río Grande · Perro, 1 · Intento sin lesión · En seguimiento (Esperando contacto) · Salud |

## Quién la ve

- **Agentes:** todo.
- **Analista / comité** y **administrador:** no es una lista de trabajo para ellos; el menú no muestra
  «Incompletos» si la API no da el permiso.
