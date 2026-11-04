# Vista · Consultas › Mapa

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Consultas y Administración**, marco **«Consultas ›
  Mapa · v2»** (nodo `103:4465`). El mapa de Figma es un dibujo: el real es un mapa interactivo.
- Piezas: Filtro aplicado (chip), Enlace de caso, Dato (`37:208`), Estado del caso, Botón.
- Ruta: `/consultas/mapa`.

## Para qué sirve

Ver **dónde ocurrieron los casos vigentes**. Cada punto lo puso una persona (un agente o el ciudadano)
al marcar el pin del hecho; el mapa no geocodifica nada.

## Tecnología

- **Leaflet** con teselas de **OpenStreetMap**. La **atribución es obligatoria y visible**: «©
  colaboradores de OpenStreetMap» (esquina inferior).
- La **URL del servidor de teselas va en configuración**, no escrita en el código.
- No hay búsqueda de direcciones en esta vista (eso es del pin del formulario).

## Estructura

1. **Encabezado de página:** «Mapa» · bajada «Dónde ocurrieron los casos vigentes. Cada punto lo puso
   una persona en el mapa (pin + dirección + referencias).» · nota «Datos de ejemplo».
2. **Filtros:** chips de los filtros aplicados («Especie: Perro», «Tamaño: Mediano», «Color: Negro»,
   «Período: 2026»), cada uno con ×, y un botón **«Filtros»** que abre la ventana lateral de filtros.
3. **Mapa y detalle:** el mapa ocupa el ancho; a la derecha, el panel **«Caso seleccionado»**.
4. **Pie:** «9 casos con los filtros aplicados · en rojo, los casos graves · solo casos vigentes (sin
   desestimados ni unificados). El filtro de tamaño y color mira la descripción de cada animal en el
   caso: entra si un mismo animal cumple los dos.»

## Puntos

- **Un punto por caso vigente** que tenga ubicación.
- Color: **acento** (verde agua) para todos; **rojo** (`error.main`) si el caso tiene la marca *grave*
  (`"grave"` dentro de `marcas`).
  El seleccionado se agranda y lleva borde.
- **Casos sin ubicación:** no se dibujan. El pie lo dice: «… · 2 casos sin ubicación no se muestran».
- Sin agrupamiento de puntos (son pocos: unos 200 casos por año).
- Encuadre inicial: Tierra del Fuego (Ushuaia, Río Grande y Tolhuin a la vista). Si hay filtro de
  ciudad, encuadra esa ciudad.

## Caso seleccionado

Al hacer clic en un punto, el panel muestra:
- **«CASO SELECCIONADO»** (rótulo) · número (enlace a la ficha).
- Víctima: nombre · edad.
- Fecha del hecho.
- Lugar: dirección, ciudad · referencias debajo.
- Animales: una descripción corta por animal, armada con la especie y, si llega, el tamaño y el color
  («Perro mediano negro con manchas blancas · perro grande marrón»). Si no llega la descripción (Salud),
  solo la especie («Perro · perro»).
- Tipo de evento.
- Estado (píldora).
- Botón secundario **«Abrir caso»**.

Sin selección, el panel dice: «Elegí un punto del mapa para ver el caso.»

## Filtros

Ventana lateral con: Período (año, o desde/hasta) · Ciudad · Especie · Tamaño · Color · Tipo de evento.
Por defecto: el año actual, todo lo demás vacío. **Especie, tamaño y color miran cada animal del caso, y se
cumplen en el mismo animal**: con «Tamaño: Mediano» y «Color: Negro» (el color se busca como texto contenido), el caso entra si
alguno de sus animales es mediano **y** negro (no alcanza con un perro mediano marrón y otro grande negro). En el ejemplo, C-2026-0418 entra por su animal 1: mediano, «Negro con manchas blancas».
Los filtros van en la URL.

## Datos de ejemplo

```json
{
  "total": 9,
  "sinUbicacion": 2,
  "puntos": [
    {
      "numero": "C-2026-0418",
      "latitud": -54.8069, "longitud": -68.3073,
      "marcas": ["incompleto", "duplicado"],
      "victima": { "nombre": "Micaela", "apellido": "Sosa", "edad": 7 },
      "fechaHecho": "2026-09-12",
      "lugar": { "direccion": "Kuanip 1240", "ciudad": "Ushuaia", "referencias": "Frente a la plaza, casa de rejas verdes" },
      "animales": [
        { "especie": "perro", "descripcion": { "tamano": "mediano", "color": "Negro con manchas blancas" } },
        { "especie": "perro", "descripcion": { "tamano": "grande", "color": "Marrón" } }
      ],
      "tipoEvento": "Ataque con mordedura",
      "estado": "registrado"
    }
  ]
}
```

## Lo que depende de quién mira

- **Agentes de Zoonosis y CADIC:** todo.
- **Agentes de Salud:** la API no les manda la **descripción del animal**. El panel muestra solo la
  especie de cada animal, y los filtros **Tamaño** y **Color** no se muestran (ni sus chips).
- **Analista** (rol `analista`, en pantalla «Consulta»): la API no manda el nombre de la víctima: el
  panel muestra solo la edad.
- **Administrador:** no ve casos; el Mapa no le aparece.

## Responsive

En teléfono, el mapa ocupa todo el ancho y el panel del caso seleccionado aparece **debajo del mapa**
(no al costado).
