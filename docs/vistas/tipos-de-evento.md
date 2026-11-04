# Vista · Administración › Tipos de evento

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Consultas y Administración**: **«Administración ›
  Tipos de evento»** (nodo `70:3291`) y **«… · Editar»** (nodo `70:3579`).
- Piezas: Mensaje, Tabla/*, Vigencia (`47:290`), Ventana lateral, Campo, Opción.
- Ruta: `/administracion/tipos-evento`.

## Para qué sirve

El catálogo que **clasifica cada caso** (el «tipo de evento» que se ve en la bandeja y en la ficha). Un
caso tiene uno. Los valores **están en revisión con el cliente**: por eso es un catálogo editable y no
una lista fija en el código.

## Lista

1. **Encabezado:** «Tipos de evento» · bajada «Catálogo que clasifica cada caso (campo T1 de la ficha).»
2. **Mensaje de advertencia** (fijo en la pantalla): «Valores en revisión con el cliente. Son la
   propuesta del equipo.» El tipo de lesión ya no existe como dato: el tipo de evento lo reemplaza.
3. **Herramientas:** botón **Nuevo tipo de evento**.
4. **Tabla:** Tipo de evento (nombre destacado + descripción en segunda línea) · Casos vigentes · Estado
   (Activo / Inactivo) · acciones (`⋮`: Editar). Orden: el que define el back (hoy, el de abajo).

## Nuevo y Editar

Ventana lateral: «Editar tipo de evento» · bajada con el nombre y «N casos vigentes».
- **Datos:** nombre * · descripción (texto largo; puede incluir la equivalencia con los formularios de
  los organismos, p. ej. «En el formulario de Zoonosis: “Lesión compatible con ataque de ADC”»).
- **Estado:** Activo («Se ofrece al registrar o editar un caso.») · Inactivo («Deja de ofrecerse en los
  casos nuevos. Los N casos que ya lo tienen lo conservan.»).
- Si el tipo tiene casos, mensaje de información: «El cambio se ve en todos los casos. Si le cambiás el
  nombre, los N casos que usan este tipo pasan a mostrar el nombre nuevo.»
- Cancelar · Guardar. Nombre **único**.
- **No se borra:** se desactiva.

## Datos de ejemplo

```json
{ "id": 2, "nombre": "Lesión compatible", "descripcion": "Lesión compatible con un ataque, sin certeza de mordedura (por ejemplo, un arañazo).", "activo": true, "casosVigentes": 15 }
```

Valores de Figma (todos activos; los casos vigentes suman los 127 de Inicio):

| Tipo de evento | Descripción | Casos vigentes |
|---|---|---|
| Ataque con mordedura | El animal mordió a la persona. | 98 |
| Lesión compatible | Lesión compatible con un ataque, sin certeza de mordedura (por ejemplo, un arañazo). | 15 |
| Intento sin lesión | El animal atacó o intentó atacar sin lastimar a la persona. | 9 |
| Lesión derivada | La persona se lastimó por el ataque sin que el animal la tocara; por ejemplo, al caerse huyendo. | 5 |

## Quién la ve

- Solo el **administrador**. Los demás ven los tipos de evento como opciones en los casos (solo los
  activos).

## Pendiente: no lo implementes todavía

- Los **valores definitivos**: en revisión con el cliente.
- **Orden** de los tipos (¿manual, arrastrando?): no definido; usá el que manda la API.
