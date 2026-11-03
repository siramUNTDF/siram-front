# Vista · Historial del caso

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Casos**, componente **«Casos › Historial del
  caso»** (nodo `108:5218`).
- Piezas, en **Fundamentos**: Evento de historial (`37:244`, variantes Persona · Sistema), Chip de
  filtro (`5:79`), Encabezado de página.
- Ruta: `/casos/:numero/historial`. Se llega desde el botón **Ver historial** de la ficha del caso. No
  tiene entrada en el menú.

## Para qué sirve

Ver **todo lo que le pasó a un caso**: quién cambió qué, cuándo, desde qué organismo, y cómo era antes
y después. Es solo lectura: **el historial no se edita ni se borra.**

## Estructura

1. **Encabezado de página:** volver (← a la ficha) · «Historial · C-2026-0418» · bajada «Cada cambio
   guarda la foto completa del registro: quién, cuándo, desde qué organismo y desde qué caso se hizo.»
   · nota «Datos de ejemplo».
2. **Filtros** (chips, uno activo a la vez, con su cantidad): Todo · Caso · Personas · Animales ·
   Tratamiento · Denuncias · Solicitudes. A la derecha, **«Ver cómo estaba en una fecha»** (ver abajo).
3. **Línea de tiempo**, del cambio más nuevo al más viejo. Cada cambio:
   - **Quién:** avatar con iniciales y nombre (`M. Acosta`) + chip del organismo **en ese momento**
     (`Zoonosis Ushuaia`). Si lo hizo el sistema: «Sistema · Automático», con la variante *Sistema*
     (sin iniciales).
   - **Cuándo:** fecha y hora (mono).
   - **Qué:** una frase («Editó el animal 1 (chip 900 123 456 789 012) en este caso.»).
   - **Cambio:** «Campo: antes → después» por cada campo que cambió (p. ej. «Color: Negro → Negro con
     manchas blancas»). Si algo no tenía valor antes, «—». En una creación: «creación».
   - **Desde otro caso** (si corresponde): cuando el cambio de una persona o un animal compartido se
     hizo desde otro caso o desde Consultas, se aclara: «Editó a Carla Sosa (contacto responsable) desde
     el caso C-2026-0411 · persona compartida: el cambio se ve en sus dos casos». El número de caso es
     un enlace a esa ficha.
4. **Pie:** «El historial no se edita ni se borra. Las credenciales de los usuarios nunca se copian en
   él.»

## Qué entra en el historial de un caso

Los cambios del caso **y de todo lo que cuelga de él**: su víctima y su contacto responsable (aunque
el cambio se haya hecho desde otro caso), sus animales (identidad, lo que se supo en este caso,
descripción, día 10), su tratamiento, sus denuncias, sus documentos y las solicitudes que se le
sumaron. También los avisos automáticos del sistema (p. ej. «Avisó una coincidencia con C-2026-0402:
mismo DNI de la víctima.»).

Tipos de cambio: **creación** · **modificación** · **baja lógica** (p. ej. un animal absorbido por otro
al reconciliar). No hay borrados.

## «Ver cómo estaba en una fecha»

Abre un selector de fecha y hora. Al elegir, la línea de tiempo se corta en ese momento (los cambios
posteriores se ven atenuados) y arriba aparece un mensaje de información: «Mostrando el caso como
estaba el 12/09/2026 16:00» con **Volver al presente**. La foto del caso en esa fecha la arma la API;
el front solo la pide y la muestra con el mismo formato de la ficha, en modo lectura.

## Datos de ejemplo

La forma real la define la API. Ejemplo para `src/mocks/` (los 7 cambios de Figma, del más nuevo al
más viejo):

```json
[
  { "fecha": "2026-09-14T10:05", "por": "M. Acosta", "organismo": "Zoonosis Ushuaia", "tipo": "creacion", "sobre": "denuncia",
    "frase": "Anotó la denuncia ZU-2026-1180.",
    "cambios": [{ "campo": "Estado de la denuncia", "antes": null, "despues": "confirmada" }] },
  { "fecha": "2026-09-14T09:12", "por": "L. Puig", "organismo": "Hospital Regional Ushuaia", "tipo": "creacion", "sobre": "tratamiento",
    "frase": "Cargó el tratamiento del caso.",
    "cambios": [{ "campo": "Tratamiento", "antes": null, "despues": "consulta 14/09/2026 · antirrábica Sí · antitetánica Sí · antibiótico Sí · sutura No" }] },
  { "fecha": "2026-09-14T08:40", "por": null, "organismo": null, "tipo": "modificacion", "sobre": "caso",
    "frase": "Avisó una coincidencia con C-2026-0402: mismo DNI de la víctima.", "cambios": [] },
  { "fecha": "2026-09-14T08:10", "por": "M. Acosta", "organismo": "Zoonosis Ushuaia", "tipo": "modificacion", "sobre": "persona",
    "frase": "Editó a Carla Sosa (contacto responsable).", "desdeCaso": "C-2026-0411",
    "cambios": [{ "campo": "Teléfono", "antes": "2901-50-1111", "despues": "2901-54-8820" }] },
  { "fecha": "2026-09-14T07:47", "por": "M. Acosta", "organismo": "Zoonosis Ushuaia", "tipo": "modificacion", "sobre": "animal",
    "frase": "Editó el animal 1 (chip 900 123 456 789 012) en este caso.",
    "cambios": [{ "campo": "Color", "antes": "Negro", "despues": "Negro con manchas blancas" }] },
  { "fecha": "2026-09-13T22:06", "por": "M. Acosta", "organismo": "Zoonosis Ushuaia", "tipo": "modificacion", "sobre": "solicitud",
    "frase": "Registró la solicitud S-2026-0034 como este caso.",
    "cambios": [{ "campo": "¿Hizo denuncia? (lo declaró la persona)", "antes": null, "despues": "No" }] },
  { "fecha": "2026-09-13T22:05", "por": "M. Acosta", "organismo": "Zoonosis Ushuaia", "tipo": "creacion", "sobre": "caso",
    "frase": "Registró el caso.", "cambios": [{ "campo": "Canal de origen", "antes": null, "despues": "Ciudadano" }] }
]
```

- `por: null` = Sistema.
- **Ojo con el ejemplo de Figma:** sus fechas no cierran con la historia (el caso aparece registrado
  antes de que llegara la solicitud, y una solicitud S-2026-0031 que no existe en el resto del
  ejemplo). Usá este JSON, que ya está corregido; ordená siempre por `fecha`, de más nueva a más vieja,
  sin confiar en el orden en que llegan.
- `sobre` es lo que usa cada filtro: caso → Caso; persona → Personas; animal → Animales; tratamiento →
  Tratamiento; denuncia → Denuncias; solicitud → Solicitudes. Los cambios de documentos entran en Caso.

## Quién lo ve

- **Agentes:** ven el historial del caso, **con los mismos recortes que la ficha**: si un agente no
  recibe un dato en la ficha (p. ej. Salud no ve el dueño del animal), tampoco ve sus cambios en el
  historial. La API manda solo lo que ese usuario puede ver; un cambio sin ningún campo visible no se
  muestra.
- **Analista:** no ve el historial (no tiene datos personales y el historial está lleno de ellos).
- **Administrador:** no ve casos.

## Vacío y errores

- Un caso siempre tiene al menos su creación. Con un filtro sin cambios: «No hay cambios de este tipo
  en el caso.»
- Si la fecha elegida en «Ver cómo estaba» es anterior a la creación del caso: «El caso todavía no
  existía en esa fecha.»

## Pendiente: no lo implementes todavía

- Historial de las **consultas** (quién vio o exportó qué): es solo una sugerencia, no se modela.
- Paginación de la línea de tiempo: con el volumen esperado (≈200 casos por año, pocos cambios cada
  uno) no hace falta por ahora.
