# Vista · Consultas › Exportar

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Consultas y Administración**:
  - **«Consultas › Exportar»** (nodo `67:1453`).
  - **«Consultas › Exportar · con datos personales»** (nodo `67:1932`): la misma, con la casilla de
    datos personales marcada.
- Piezas: Bloque de formulario/Leyenda, Campo, Casilla (`9:307`), Opción (`9:272`), Mensaje
  (advertencia), Botón.
- Ruta: `/consultas/exportar`.

## Para qué sirve

Descargar casos en **CSV o XLSX** para analizarlos fuera de SIRAM, eligiendo qué casos y qué columnas.
**El archivo lo genera el back**; el front arma el pedido y descarga lo que vuelve.

## Estructura

A la izquierda, los pasos; a la derecha, el resumen.

1. **Encabezado de página:** «Exportar» · bajada «Descargá casos en CSV o XLSX para analizarlos fuera de
   SIRAM.» · nota «Datos de ejemplo».
2. **Bloque «Casos»:** Fecha del hecho (Desde · Hasta; por defecto, 1 de enero del año actual → hoy) ·
   Ciudad (Todas) · Organismo (Todos) · Estado del caso (**Vigentes** por defecto) · Tipo de evento
   (Todos). Nota: «Desde Búsqueda, “Exportar estos resultados” abre esta página con los mismos filtros.»
3. **Bloque «Columnas»** — «Cada bloque suma sus columnas al archivo, en el mismo orden que la ficha del
   caso.» Una casilla por bloque, con su descripción y la cantidad de columnas. La tabla muestra cada
   bloque **completo**; cada rol recibe solo lo que puede ver (ver Comportamiento):

   | Bloque | Descripción | Columnas | Marcado al entrar |
   |---|---|---|---|
   | Identificación y estado | Número de caso, fecha de registro, organismo, quién lo registró, estado, motivo de espera y marcas | 7 | Sí |
   | Hecho | Fecha, hora, ciudad, dirección, referencias, latitud, longitud y tipo de lugar | 8 | Sí |
   | Tipo de evento | Ataque con mordedura, lesión compatible, intento sin lesión o lesión derivada | 1 | Sí |
   | Persona | Solo la edad de la víctima: sin nombre, DNI ni contacto | 1 | Sí |
   | Animal | Por animal: especie, chip, tenencia, vacunado, día 10, tamaño, sexo, edad aparente, color, raza y si podría reconocerlo | 11 | Sí |
   | Tratamiento · Salud | Fecha de consulta, zona del cuerpo, gravedad, antirrábica, antitetánica, antibiótico y sutura | 7 | Sí |
   | Denuncia | Lo declarado (¿hizo denuncia? y motivo) y las denuncias anotadas (fecha y estado) | 4 | Sí |
   | Documentación | Si el caso tiene certificado médico (documento adjunto al caso) y fotos de los animales (adjuntas a cada animal), sin los archivos | 2 | No |
   | *(separador)* | | | |
   | **Datos personales** | Nombre, DNI, teléfono, correo y domicilio de la persona · Datos protegidos por la Ley 25.326 | 5 | No |

4. **Bloque «Formato»:** **CSV** («Texto separado por comas. Se abre en cualquier planilla o programa de
   análisis.») · **XLSX** («Planilla de Excel, con una fila por caso.»). CSV por defecto.
5. **Resumen** (columna derecha, queda fija al scrollear en escritorio): «Resumen» · total («127 · casos
   vigentes») · filtros en texto («Fecha del hecho: 01/01/2026 – 25/09/2026», «Todas las ciudades y
   todos los organismos», «Todos los tipos de evento») · «33 columnas, en 7 bloques» (el ejemplo es un
   agente de Zoonosis) · «Formato CSV» · botón primario **«Descargar CSV»** (o «Descargar XLSX»).

## Datos personales

- **La casilla «Datos personales» solo aparece si el rol puede exportarlos.** Para el resto, esa
  opción **no existe** (no se muestra deshabilitada: no está). Lo dice la API.
- Al marcarla aparece, debajo, un mensaje de **advertencia** (no se cierra solo): «**Vas a descargar
  datos personales.** El archivo va a incluir el nombre, el DNI, el teléfono, el correo y el domicilio
  de cada persona. Son datos protegidos por la Ley 25.326.»
- El resumen suma «Incluye datos personales» y las columnas («38 columnas, en 8 bloques», en el mismo
  ejemplo).

## Comportamiento

- **Los bloques, su descripción y su cantidad de columnas los manda la API** según el rol. El front
  dibuja lo que llega y no arma bloques por su cuenta. Exportar respeta los mismos permisos por campo
  que la ficha del caso; con las reglas tentativas, eso da:

  | Bloque | Zoonosis | Salud | CADIC | Analista |
  |---|---|---|---|---|
  | Identificación y estado, Hecho, Tipo de evento, Persona | Completos | Completos | Completos | Completos |
  | Animal | 11 (completo) | 3: especie, vacunado y día 10 (sin chip, tenencia ni descripción) | 10: sin chip | 9: sin chip ni día 10 |
  | Tratamiento · Salud | 1: solo «recibió atención» (sí/no) | 7 (completo) | 1: solo «recibió atención» (sí/no) | No viene |
  | Denuncia | 4 (completo) | 3: lo declarado y «tiene denuncia» (sí/no) | 3: lo declarado y «tiene denuncia» (sí/no) | 2: solo lo declarado |
  | Documentación | 2 | 1: certificado médico (sin fotos de los animales) | 1: fotos de los animales (sin certificado médico) | No viene |
  | Datos personales | A definir | A definir | A definir | No viene |

  - «Recibió atención» y «tiene denuncia» son la versión «solo si existe» de la ficha: dicen que el
    dato está, sin el detalle. Lo declarado (¿hizo denuncia? y motivo) lo exportan todos.
  - El **analista** no recibe por caso nada del tratamiento, del día 10 ni de las denuncias anotadas:
    esos datos los ve solo en agregados, en Estadísticas.
- El **total de casos** del resumen se actualiza al cambiar los filtros de «Casos».
- El **resumen** se actualiza con cada casilla y con el formato.
- **Sin ningún bloque marcado,** el botón de descarga queda deshabilitado con la ayuda «Elegí al menos un
  bloque de columnas».
- **Sin casos,** el botón queda deshabilitado: «No hay casos con estos filtros».
- **Viniendo de Búsqueda:** los filtros llegan por la URL. Los que tienen campo acá se cargan en el
  bloque «Casos»; los que no (lugar, edad, animal, registrado por) se listan en el resumen como
  «Filtros de la búsqueda: …», y se aplican igual. Hay un enlace «Quitar los filtros de la búsqueda».
- **Al descargar:** el botón muestra que está trabajando; cuando el archivo llega, se descarga con el
  nombre `siram-casos-AAAA-MM-DD.csv` (o `.xlsx`) y aparece un mensaje de éxito que se cierra solo
  («Descargaste 127 casos»). Si falla, mensaje de error que hay que cerrar.
- **Una fila por caso.** Como un caso puede tener varios animales, el bloque Animal repite sus columnas
  por animal (`animal_1_…`, `animal_2_…`, hasta el máximo de animales del archivo).

## Datos de ejemplo

Lo que llega para armar la pantalla:

```json
{
  "bloques": [
    { "clave": "identificacion", "titulo": "Identificación y estado", "columnas": 7, "porDefecto": true },
    { "clave": "hecho", "titulo": "Hecho", "columnas": 8, "porDefecto": true },
    { "clave": "tipo_evento", "titulo": "Tipo de evento", "columnas": 1, "porDefecto": true },
    { "clave": "persona", "titulo": "Persona", "columnas": 1, "porDefecto": true },
    { "clave": "animal", "titulo": "Animal", "columnas": 11, "porDefecto": true },
    { "clave": "tratamiento", "titulo": "Tratamiento · Salud", "descripcion": "Solo si recibió atención (sí/no)", "columnas": 1, "porDefecto": true },
    { "clave": "denuncia", "titulo": "Denuncia", "columnas": 4, "porDefecto": true },
    { "clave": "documentacion", "titulo": "Documentación", "columnas": 2, "porDefecto": false },
    { "clave": "datos_personales", "titulo": "Datos personales", "columnas": 5, "porDefecto": false, "sensible": true }
  ],
  "totalCasos": 127
}
```

(Ese es el ejemplo de un agente de Zoonosis: por eso `tratamiento` trae una sola columna. A un agente
de Salud le llegan `animal` con 3 columnas, `tratamiento` con 7, `denuncia` con 3 y `documentacion` con
1. A un analista le llegan `tratamiento`, `documentacion` y `datos_personales` ausentes, `animal` con 9
columnas y `denuncia` con 2. Cada bloque trae su `descripcion` cuando difiere de la de arriba.)

Y el pedido de descarga: `{ "filtros": { … }, "bloques": ["identificacion", "hecho", …], "formato": "csv" }`.

## Lo que depende de quién mira

- **Agentes y analistas** (rol `analista`, en pantalla «Consulta») exportan, con los bloques que manda
  la API (ver Comportamiento). Los **datos personales**, solo los roles habilitados: el analista no; qué
  agentes sí, todavía no está definido (lo aplica el back).
- **Administrador:** no ve casos; la vista no le aparece.

## Responsive

En teléfono, el resumen pasa **debajo** de los pasos (no fijo), con el botón de descarga al final.
