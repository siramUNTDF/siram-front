# Vista · Administración › Organismos

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Consultas y Administración**:
  **«Administración › Organismos»** (nodo `70:2699`) y **«… · Editar»** (nodo `70:3101`).
- Piezas: Tabla/*, Chip de filtro, Vigencia (`47:290`), Ventana lateral, Campo, Opción.
- Ruta: `/administracion/organismos`.

## Para qué sirve

Los entes que cargan y consultan casos (Zoonosis, hospitales, CAPS, CADIC…). **En cada caso aparecen
como un dato** (un chip con el nombre), **nunca como marca de SIRAM**: sin logo ni color propio. Un
organismo no se borra: se desactiva.

## Lista

1. **Encabezado:** «Organismos» · bajada «Los entes que cargan y consultan casos. En cada caso aparecen
   como un dato, nunca como marca de SIRAM.»
2. **Herramientas:** búsqueda «Buscar organismo» · botón **Nuevo organismo**.
3. **Filtros rápidos:** Todos · Salud · Municipio · Investigación (el tipo de organismo).
4. **Tabla:** Organismo (nombre) · Tipo · Usuarios activos · Casos vigentes · Estado (Activo / Inactivo)
   · acciones (`⋮`: Editar). Orden: por casos vigentes, de mayor a menor.

## Nuevo y Editar

Ventana lateral: «Editar organismo» · bajada con el nombre, usuarios activos y casos vigentes (en Nuevo,
«Nuevo organismo» sin bajada de datos).
- **Datos:** nombre * · tipo * (Salud · Municipio · Investigación). Nota: «Es el nombre que se ve en el
  chip del organismo, en cada caso que registró. No lleva logo ni color propio.»
- **Estado:** Activo («Sus usuarios entran a SIRAM y se puede elegir en los casos nuevos.») · Inactivo
  («Sus usuarios no pueden entrar. Sus casos y su historial quedan como están.»).
- Cancelar · Guardar.

- Nombre **único** (si el back lo rechaza: «Ya hay un organismo con ese nombre»).
- **Cambiar el nombre** cambia lo que se ve en todos sus casos (es el mismo organismo). En el historial
  queda el cambio.
- **Pasar a Inactivo** con usuarios activos: antes de guardar, un mensaje de advertencia en la ventana:
  «Sus N usuarios activos no van a poder entrar.» Se guarda igual; los usuarios no se desactivan uno por
  uno: dejan de poder entrar mientras el organismo esté inactivo.

## Datos de ejemplo

```json
{ "id": 2, "nombre": "Hospital Regional RG", "tipo": "salud", "activo": true, "usuariosActivos": 5, "casosVigentes": 34 }
```

`tipo` ∈ salud · municipio · investigacion.

Filas de Figma (Todos 9 · Salud 6 · Municipio 1 · Investigación 2): Zoonosis Ushuaia (Municipio, 6
usuarios, 54 casos) · Hospital Regional RG (Salud, 5, 34) · Hospital Regional Ushuaia (Salud, 4, 24) ·
CADIC (Investigación, 2, 9) · CAPS 3 (Salud, 2, 3) · CAPS 5 (Salud, 1, 2) · CAPS 4 (Salud, 1, 1) ·
Ministerio de Salud TDF (Salud, 2, 0) · UNTDF (Investigación, 1, 0). Todos activos.

## Quién la ve

- Solo el **administrador**.

## Pendiente: no lo implementes todavía

- Si el **tipo** de organismo define permisos (p. ej. «un organismo de tipo Salud carga tratamientos»)
  o es solo para filtrar: hoy es solo para filtrar. Los permisos los decide el back.
