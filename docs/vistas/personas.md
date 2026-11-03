# Vista · Consultas › Personas

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Consultas y Administración**:
  - **«Consultas › Personas»** (nodo `102:3518`): la lista.
  - **«Consultas › Personas · Detalle»** (nodo `102:3771`): el detalle de una persona.
- Piezas, en **Fundamentos**: Encabezado de página, Campo de búsqueda, Chip de filtro, Tabla/*, Pie de
  tabla, Bloque de formulario/Leyenda, Dato (`37:208`), Enlace de caso, Estado del caso.
- Rutas: `/consultas/personas` (lista) y `/consultas/personas/:id` (detalle).

## Para qué sirve

Cada persona aparece **una sola vez** (una por DNI), con **todos los casos** en que aparece y su rol en
cada uno. Las personas **se consultan, no se trabajan**: lo único que SIRAM trabaja es el caso. Sirve
para ver si alguien ya estuvo en otros casos y para corregir sus datos en un solo lugar.

## Lista

1. **Encabezado:** «Personas» · bajada «Una por DNI. Se consultan, no se trabajan: lo único que SIRAM
   trabaja es el caso. DNI y contacto, solo en el detalle.» · nota «Datos de ejemplo».
2. **Herramientas:** búsqueda «Buscar por nombre o DNI».
3. **Filtros rápidos** (uno activo a la vez, con cantidad): Todas · Víctimas · Contactos responsables ·
   Dueños de animales. Una persona puede entrar en más de uno (p. ej. víctima en un caso y contacto en
   otro), así que las cantidades **no suman** el total.
4. **Tabla:**

   | Columna | Línea principal | Segunda línea |
   |---|---|---|
   | Persona | Nombre y apellido (destacado) | Edad (`47 años`); sin segunda línea si no hay edad |
   | Casos | `2 casos` / `1 caso` | — |
   | En qué rol aparece | `Víctima en 1 · contacto responsable en 1` | — |
   | Último caso | Número del caso más reciente (enlace a la ficha del caso) | Fecha del hecho de ese caso |
   | Última modificación | Fecha y hora de la última modificación de la persona | Quién |

   Orden: por última modificación, de la más reciente a la más vieja.
5. **Pie de tabla** como en la Bandeja.

**No van en la lista** el DNI, el teléfono, el correo ni el domicilio (minimización de datos
personales). Se puede **buscar** por DNI, pero no se muestra.

**Clic en el nombre:** abre el detalle.

## Detalle

1. **Encabezado:** el nombre de la persona · bajada «Persona única por DNI: un cambio acá se ve en todos
   sus casos y queda en el historial de la persona.»
2. **Acciones:** **Editar** (abre una ventana lateral con los datos de la persona) · **Ver historial**
   (el historial de la persona: quién cambió qué y desde qué caso).
3. **Bloque «Datos»:** nombre y apellido, DNI, edad · teléfono, correo electrónico, domicilio. Lo que
   falta se muestra «Sin dato», en rojo.
4. **Bloque «Casos de esta persona · N»:** tabla con Caso (enlace) · Rol en el caso (Víctima / Contacto
   responsable / Dueño de un animal) · Fecha del hecho (+ hora) · Víctima (nombre + edad) · Estado
   (píldora; si está unificado, «→ C-…» debajo).
5. **Nota al pie:** «Los roles viven en cada caso: víctima y contacto responsable son del caso; dueño,
   de cada animal en el caso. No se guarda la relación entre personas.»

## Editar una persona

- Ventana lateral (como todas): nombre, apellido, DNI, teléfono, correo, domicilio. Cancelar · Guardar
  (deshabilitado hasta que haya cambios).
- Arriba del cuerpo, un mensaje de **información**: «Esta persona está en N casos. El cambio se ve en
  todos.»
- **El DNI se puede corregir** (un error de carga), pero no puede quedar igual al de otra persona: si el
  back lo rechaza, el error va debajo del campo («Ese DNI ya es de otra persona»).
- La edad no se edita acá: la edad que cuenta es **la de la víctima en cada caso** (al momento del
  hecho), y se carga en el caso.
- Al guardar: mensaje de éxito que se cierra solo («Datos de la persona actualizados») y se vuelve al
  detalle. El cambio queda en el historial de la persona, sin caso de contexto (se hizo desde acá).

## Datos de ejemplo

Fila de la lista:

```json
{
  "id": 17,
  "nombre": "Carla Sosa",
  "edad": 47,
  "casos": 2,
  "roles": { "victima": 0, "contactoResponsable": 2, "duenio": 0 },
  "ultimoCaso": { "numero": "C-2026-0418", "fechaHecho": "2026-09-12" },
  "ultimaModificacion": { "fecha": "2026-09-12T16:10", "por": "M. Acosta" }
}
```

Detalle:

```json
{
  "id": 17,
  "nombre": "Carla", "apellido": "Sosa",
  "dni": "32114887", "edad": 47,
  "telefono": "2901-54-8820", "correo": "carla.sosa@correo.com", "domicilio": "Kuanip 1240, Ushuaia",
  "casos": [
    { "numero": "C-2026-0418", "rol": "contacto_responsable", "fechaHecho": "2026-09-12", "horaHecho": "14:20",
      "victima": { "nombre": "Micaela Sosa", "edad": 7 }, "estado": "registrado" },
    { "numero": "C-2026-0411", "rol": "contacto_responsable", "fechaHecho": "2026-09-06", "horaHecho": "11:15",
      "victima": { "nombre": "Joaquín Ojeda", "edad": 12 }, "estado": "unificado", "unificadoEn": "C-2026-0402" }
  ]
}
```

Filas de Figma para el mock (Todas 148 · Víctimas 131 · Contactos responsables 24 · Dueños 17):

| Persona | Casos | Rol | Último caso | Últ. modificación |
|---|---|---|---|---|
| Carla Sosa, 47 | 2 | Contacto responsable en 2 | C-2026-0418 · 12/09 | 12/09 16:10 · M. Acosta |
| Micaela Sosa, 7 | 1 | Víctima en 1 | C-2026-0418 · 12/09 | 12/09 15:02 · M. Acosta |
| Raúl Benítez, 51 | 2 | Dueño de un animal en 2 | C-2026-0418 · 12/09 | 12/09 15:47 · M. Acosta |
| Ramiro Beltrán, 34 | 2 | Víctima en 1 · contacto responsable en 1 | C-2026-0417 · 11/09 | 12/09 18:02 · M. Acosta |
| Tomás Ibarra, 52 | 1 | Víctima en 1 | C-2026-0421 · 03/09 | 13/09 08:30 · D. Marchisoney |
| Lucía Ferreyra, 29 | 1 | Víctima en 1 | C-2026-0420 · 10/09 | 12/09 16:40 · J. Valle |

## Quién la ve (las reglas viven en el servidor)

- **Agentes** (Salud, Zoonosis, CADIC): ven la lista y el detalle. Zoonosis ve **todas** las personas
  (busca víctimas para completar el contacto).
- **Salud y CADIC no reciben los dueños de animales**: si la API no los manda, el chip «Dueños de
  animales» no aparece y esas filas no llegan.
- **Analista / comité:** no ve datos personales. La vista no le aparece (la API no le devuelve
  personas).
- **Administrador:** no ve personas.
- **Editar:** cualquier agente puede editar los datos de una víctima o de un contacto responsable;
  los de un **dueño**, solo Zoonosis. La API dice si se puede editar; si no, el botón no aparece.

## Pendiente: no lo implementes todavía

- **Personas sin DNI argentino:** todavía no hay cómo cargarlas.
- **Fusionar dos personas** que resultaron ser la misma (p. ej. un DNI mal cargado): no está diseñado.
