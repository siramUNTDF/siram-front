# Vista · Consultas › Búsqueda

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Consultas y Administración**:
  - **«Consultas › Búsqueda»** (nodo `48:246`): filtros desplegados + resultados.
  - **«Consultas › Búsqueda · filtros plegados»** (nodo `49:660`): después de buscar.
- Piezas: Bloque de formulario/Leyenda, Campo (`9:255`), Filtro aplicado (chip con ×), Botón, y la misma
  tabla, pie y leyenda de marcas que la Bandeja (`vistas/bandeja.md`).
- Ruta: `/consultas/busqueda`.

## Para qué sirve

Buscar casos por **cuándo y dónde pasó, la persona, el animal y el registro**, y llevarse el resultado
a Exportar. La Bandeja es para trabajar; la Búsqueda, para consultar con varios criterios a la vez.

## Estructura

1. **Encabezado de página:** «Búsqueda» · bajada «Casos según cuándo y dónde pasó, la persona, el
   animal y la lesión.» (dice «lesión» por la zona del cuerpo, que hoy no se filtra; ver Pendiente) ·
   nota «Datos de ejemplo».
2. **Panel de filtros** — cabecera «Filtros · completá solo lo que quieras usar» · botón texto «Ocultar
   filtros». Cuatro bloques:

   | Bloque | Campo | Tipo | Valores |
   |---|---|---|---|
   | Cuándo y dónde | Fecha del hecho: Desde · Hasta | Fechas | — |
   | | Ciudad | Selección | Cualquiera · Ushuaia · Río Grande · Tolhuin |
   | | Lugar | Texto («Calle, altura o barrio») | Busca en la dirección y las referencias |
   | | Tipo de lugar | Selección | Cualquiera · Casa propia · Casa ajena · Vía pública · Espacio público · Zona rural |
   | Persona | Edad: Desde · Hasta | Números («años») | Edad de la víctima al momento del hecho |
   | Animal | Especie | Selección | Cualquiera · Perro · Gato |
   | | Tamaño | Selección | Cualquiera · Chico · Mediano · Grande |
   | | Color o raza | Texto | Busca en color y raza |
   | | Tenencia | Selección | Cualquiera · Propio · Ajeno conocido · Ajeno desconocido |
   | Registro | Organismo | Selección | Cualquiera + los organismos (vienen de la API) |
   | | Tipo de evento | Selección | Cualquiera + el catálogo (viene de la API) |
   | | Estado del caso | Selección | **Vigentes** (por defecto) · Todos · Registrado · En seguimiento · Finalizado · Desestimado · Unificado |
   | | Registrado por | Texto («Nombre del agente») | |

   Pie del panel: **Limpiar** (texto) · **Buscar** (primario, con lupa).
3. **Resultados** — herramientas: «6 casos · vigentes, con los filtros de arriba» (la cifra y el
   «vigentes» cambian con los filtros) · botón secundario **«Exportar estos resultados»** · los tres
   botones de ícono de la Bandeja (filtros y columnas deshabilitados, densidad funciona). Debajo, la
   **tabla de la Bandeja v2** (mismas columnas y celdas), el pie y la leyenda de marcas.

## Filtros plegados

Después de **Buscar**, el panel de filtros se pliega a una línea: ícono · «Filtros» · un **chip por
filtro usado** («Fecha del hecho: 01/08/2026 – 30/09/2026», «Especie: Perro», «Tipo de evento: Ataque
con mordedura») · Limpiar · **Modificar filtros** (secundario, vuelve a desplegar).
- La **×** de un chip saca ese filtro y **vuelve a buscar** en el acto.
- «Ocultar filtros» pliega sin buscar.
- La bajada del resultado pasa a «vigentes, con los filtros aplicados».

## Comportamiento

- **Al entrar** se busca con los valores por defecto (estado *Vigentes*, lo demás vacío): se ven todos
  los casos vigentes y los filtros quedan desplegados.
- **La búsqueda corre al tocar Buscar** (o Enter en un campo de texto), no mientras se escribe.
- **Los filtros se combinan** (todos a la vez). Los del animal se cumplen si **algún** animal del caso
  los cumple.
- **Fechas:** si «Desde» es posterior a «Hasta», error en «Hasta»: «Tiene que ser igual o posterior a
  Desde». Lo mismo con la edad.
- **Limpiar** vuelve a los valores por defecto y busca.
- **Los filtros van en la URL** (`/consultas/busqueda?especie=perro&desde=2026-08-01…`): se puede volver
  atrás o compartir la búsqueda.
- **«Exportar estos resultados»** lleva a `/consultas/exportar` con los **mismos filtros** en la URL.
- Orden de los resultados: por última modificación, como la Bandeja. Clic en el número → la ficha.
- **Sin resultados:** «No hay casos con estos filtros.» en la tabla.

## Datos de ejemplo

Los filtros se mandan como parámetros; la respuesta es una página de filas con la **misma forma que la
Bandeja** (ver el JSON en `vistas/bandeja.md`) y el total:

```json
{
  "filtros": { "fechaDesde": "2026-08-01", "fechaHasta": "2026-09-30", "especie": "perro", "tipoEvento": "Ataque con mordedura", "estado": "vigentes" },
  "total": 3,
  "casos": [ "… C-2026-0418, C-2026-0421, C-2026-0417 con la forma de la Bandeja …" ]
}
```

Con esos filtros, los resultados de Figma son **C-2026-0418, C-2026-0421 y C-2026-0417** («3 casos»).

## Lo que depende de quién mira

- **Agentes:** todo.
- **Analista / comité:** busca y exporta. La API no le manda nombre ni DNI de la víctima: la columna
  Víctima muestra solo la edad.
- **Administrador:** no ve casos; la Búsqueda no le aparece.

## Responsive

En teléfono, los bloques de filtros van uno debajo del otro y los campos de cada bloque en una
columna; la tabla scrollea en horizontal con la columna de acciones clavada.

## Pendiente: no lo implementes todavía

- **Filtros por datos del tratamiento** (zona del cuerpo, gravedad) y por **tipo de lesión**: hoy no
  existen (el tipo de lesión espera su lista de valores). Pueden volver más adelante.
