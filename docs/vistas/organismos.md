# Vista · Administración › Organismos

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Consultas y Administración**:
  **«Administración › Organismos»** (nodo `70:2699`) y **«… · Editar»** (nodo `70:3101`).
- Piezas: Tabla/*, Chip de filtro, Vigencia (`47:290`), Ventana lateral, Campo, Opción.
- Ruta: `/administracion/organismos`.

## Para qué sirve

Los entes cuyos **agentes** cargan y completan casos (Zoonosis, hospitales, CAPS, CADIC). Los
administradores y los analistas no pertenecen a un organismo. **En cada caso aparecen
como un dato** (un chip con el nombre), **nunca como marca de SIRAM**: sin logo ni color propio. Un
organismo no se borra: se desactiva.

**El organismo de un caso sale del usuario que lo registra** (el organismo del agente en ese momento).
**Nunca se elige** al cargar un caso nuevo: no hay un campo «organismo» en ningún formulario de caso.

## Lista

1. **Encabezado:** «Organismos» · bajada «Los entes que cargan y consultan casos. En cada caso aparecen
   como un dato, nunca como marca de SIRAM.»
2. **Herramientas:** búsqueda «Buscar organismo» · botón **Nuevo organismo**.
3. **Filtros rápidos:** Todos · Salud · Zoonosis · CADIC (el tipo de organismo).
4. **Tabla:** Organismo (nombre) · Tipo · Usuarios activos · Casos vigentes · Estado (Activo / Inactivo)
   · acciones (`⋮`: Editar). Orden: por casos vigentes, de mayor a menor.

## Nuevo y Editar

Ventana lateral: «Editar organismo» · bajada con el nombre, usuarios activos y casos vigentes (en Nuevo,
«Nuevo organismo» sin bajada de datos).
- **Datos:** nombre * · tipo * (Salud · Zoonosis · CADIC). El tipo **define qué puede cargar** cada
  agente del organismo: Salud, el tratamiento; Zoonosis, el seguimiento de los animales y las denuncias
  (lo aplica el back). Cambiar el tipo de un organismo con casos o usuarios cambia esos permisos: antes
  de guardar, un mensaje de advertencia lo dice. Nota: «Es el nombre que se ve en el
  chip del organismo, en cada caso que registró. No lleva logo ni color propio.»
- **Estado:** Activo («Sus agentes entran a SIRAM y registran casos a nombre del organismo.») ·
  Inactivo («Sus agentes no pueden entrar. Sus casos y su historial quedan como están.»). Solo se
  ofrecen los organismos activos al dar de alta o editar un agente (ver `usuarios.md`).
- Cancelar · Guardar.

- Nombre **único** (si el back lo rechaza: «Ya hay un organismo con ese nombre»).
- **Cambiar el nombre** cambia lo que se ve en todos sus casos (es el mismo organismo). En el historial
  queda el cambio.
- **Pasar a Inactivo** con usuarios activos: antes de guardar, un mensaje de advertencia en la ventana:
  «Sus N usuarios activos no van a poder entrar.» Se guarda igual; los usuarios no se desactivan uno por
  uno: dejan de poder entrar mientras el organismo esté inactivo.

## Datos de ejemplo

```json
{ "id": 2, "nombre": "Hospital Regional RG", "tipo": "salud", "activo": true, "usuariosActivos": 4, "casosVigentes": 34 }
```

`tipo` ∈ salud · zoonosis · cadic.

Filas para el mock (Todos 7 · Salud 5 · Zoonosis 1 · CADIC 1): Zoonosis Ushuaia (Zoonosis, 6 usuarios,
54 casos) · Hospital Regional RG (Salud, 4, 34) · Hospital Regional Ushuaia (Salud, 4, 24) · CADIC
(CADIC, 2, 9) · CAPS 3 (Salud, 1, 3) · CAPS 5 (Salud, 1, 2) · CAPS 4 (Salud, 1, 1). Todos activos.
Los usuarios activos suman **19**, los mismos agentes activos de Usuarios (administradores y analistas
no cuentan: no tienen organismo); los casos vigentes suman **127**. Ministerio de Salud TDF y UNTDF no
son organismos de carga: sus usuarios son administradores o analistas, sin organismo.

## Quién la ve

- Solo el **administrador**.

## Pendiente: no lo implementes todavía

- **Desactivar un organismo con usuarios activos:** el efecto propuesto (sus usuarios dejan de poder
  entrar mientras el organismo esté inactivo) está por confirmar.
