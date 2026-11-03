# Vista · Casos › Solicitudes (cola, revisar y sumar a un caso)

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Casos**:
  - **«Casos › Solicitudes»** (nodo `108:5215`): la cola.
  - **«Casos › Solicitudes · Revisar solicitud»** (nodo `108:5216`): una solicitud abierta.
  - **«Casos › Solicitudes · Sumar a un caso»** (nodo `108:5217`): sumarla a un caso que ya existe.
- Piezas, en **Fundamentos**: Chip de filtro, Campo de búsqueda, Tabla/*, Pie de tabla, Marca, Dato
  (`37:208`), Archivo adjunto (`37:223`), Mensaje (`10:212`), Fila de comparación (`74:582`), Casilla
  (`9:307`), Botón (`5:53`: Primario, Secundario, Peligro).
- Rutas: `/casos/solicitudes` (cola), `/casos/solicitudes/:numero` (revisar),
  `/casos/solicitudes/:numero/sumar/:caso` (sumar).

## Para qué sirve

Lo que manda un ciudadano por el formulario público **no es un caso**: es una **solicitud**, lo que
declaró la persona, tal cual. Queda en esta cola hasta que **un agente** la revisa y decide:
**descartarla**, **registrarla como caso nuevo** o **sumarla a un caso que ya existe**. Nada de lo que
manda un ciudadano escribe en un caso ni en una persona sin un agente de por medio.

**Cualquier agente** (Salud, Zoonosis o CADIC) ve todas las solicitudes y puede resolver cualquiera.

## Estados de una solicitud

| Estado | Qué significa | Qué se puede hacer |
|---|---|---|
| Pendiente | Llegó y nadie la resolvió | Descartar · Registrar como caso nuevo · Sumar a un caso existente |
| Registrada | Se convirtió en un caso o se sumó a uno | Solo verla. Muestra el caso al que apunta (enlace) |
| Descartada | Un agente decidió que no corresponde | Solo verla |

**Descartar no borra**: la solicitud queda guardada para siempre, con sus datos. Una solicitud
resuelta (registrada o descartada) **no se puede volver a resolver**.

---

## 1. La cola (`108:5215`)

### Estructura

1. **Encabezado:** «Solicitudes» · bajada «Lo que enviaron las personas por el formulario público. Un
   agente la descarta o la registra: crea un caso o la suma a uno existente.» · nota «Datos de ejemplo».
2. **Búsqueda:** «Buscar por solicitud, nombre o DNI» (número de solicitud, nombre de quien la envía o
   de la víctima, DNI de cualquiera de los dos). Sin distinguir mayúsculas ni acentos.
3. **Filtros rápidos** (uno activo, con cantidad): **Pendientes** (activo por defecto) · Registradas ·
   Descartadas · Todas.
4. **Tabla** (columnas abajo).
5. **Pie de tabla** y, debajo del panel, la nota: «Descartar no borra: la solicitud queda guardada para
   siempre, con sus datos. Ninguna solicitud escribe en un caso ni en una persona sin un agente.»

### Orden

Pendientes: de la **más vieja a la más nueva** (la que más espera, arriba). En los demás filtros, de la
más nueva a la más vieja por fecha de resolución (Todas: por fecha de envío, más nueva arriba).

### Columnas

| Columna | Línea principal | Segunda línea | Notas |
|---|---|---|---|
| Solicitud | Número (`S-2026-0034`) | Estado (`pendiente`) | Mono |
| Enviada | Fecha (`13/09/2026`) | Hora (`21:40`) | Mono |
| Quién la envía | Nombre y apellido (destacado) | «Informa por otra persona» o «Es quien sufrió el ataque» | |
| Víctima | Nombre y apellido | DNI (`DNI 58.412.336`) | Si es la misma persona que envía, se repite |
| Fecha del hecho | Fecha | Hora o «—» si no la dijo | Mono |
| Especie | Perro · Gato | — | La del primer animal |
| Formulario detallado | Completo · Parcial · Solo inicial | `4 de 4 secciones` | Cuántas partes del detallado completó |
| Coincidencia | Marca de posible duplicado + «Misma víctima que C-2026-0418» | — | O «Sin coincidencias». Ver abajo |
| (acción) | Botón secundario **Revisar** | — | Abre la solicitud |

**Coincidencia:** la API dice si el DNI de la víctima ya es víctima en algún caso (vigente o no). Si
hay más de uno, se muestra el más reciente y «+N». Es solo un aviso para el agente: no resuelve nada.

En Registradas y Descartadas la columna de acción dice **Ver** en lugar de Revisar, y la columna
Coincidencia muestra a qué caso fue a parar (registradas) o nada (descartadas).

### Datos de ejemplo

```json
{
  "numero": "S-2026-0034",
  "estado": "pendiente",
  "enviada": "2026-09-13T21:40",
  "resuelta": null,
  "caso": null,
  "informaLaVictima": false,
  "quienEnvia": { "nombre": "Carla", "apellido": "Sosa", "dni": "32114887" },
  "victima": { "nombre": "Micaela", "apellido": "Sosa", "dni": "58412336" },
  "fechaHecho": "2026-09-12",
  "horaHecho": "14:20",
  "especie": "perro",
  "seccionesCompletas": 4,
  "coincidencias": [{ "numero": "C-2026-0418" }]
}
```

Las filas de Figma (filtro Pendientes, 3 de 22):

| Solicitud | Enviada | Quién la envía | Víctima | Hecho | Especie | Detallado | Coincidencia |
|---|---|---|---|---|---|---|---|
| S-2026-0034 | 13/09 21:40 | Carla Sosa · informa por otra persona | Micaela Sosa · 58.412.336 | 12/09 14:20 | Perro | Completo 4/4 | C-2026-0418 |
| S-2026-0035 | 14/09 08:12 | Lucía Paz · es quien sufrió el ataque | Lucía Paz · 40.221.908 | 13/09 — | Gato | Solo inicial 0/4 | — |
| S-2026-0036 | 14/09 10:47 | Pedro Gómez · es quien sufrió el ataque | Pedro Gómez · 28.904.551 | 14/09 07:50 | Perro | Parcial 2/4 | — |

Totales del ejemplo: Pendientes 3 · Registradas 14 · Descartadas 5 · Todas 22.

---

## 2. Revisar solicitud (`108:5216`)

Es una **página** (no una ventana lateral), porque se lee entera antes de decidir.

### Estructura

1. **Encabezado:** «Solicitud S-2026-0034» · bajada «Enviada el 13/09/2026 21:40 por el formulario
   público · pendiente de revisión · formulario detallado completo (4 de 4)» · volver a la cola.
2. **Acciones** (solo si está pendiente): **Descartar** (botón de peligro, a la izquierda) ·
   **Sumar a un caso existente** (secundario) · **Registrar como caso nuevo** (primario).
3. **Aviso de víctima ya en un caso** (solo si hay coincidencia), mensaje de **advertencia**:
   > **La víctima ya está en un caso**
   > El DNI 58.412.336 es víctima en C-2026-0418 (Zoonosis, hecho del 12/09/2026). Si es el mismo
   > hecho, sumala a ese caso; si no, registrala como caso nuevo.

   El número de caso es un enlace a la ficha (se abre en otra pestaña, para no perder la solicitud).
4. Bajada: «Lo que declaró la persona, tal cual. Al registrarla se copia al caso sin transcribir.
   Hasta que un agente decide, no escribe en ningún caso ni persona.»
5. **Bloques de solo lectura**, en este orden. Un bloque aparece solo si la persona respondió algo de
   él; una pregunta sin responder no se muestra (no es «Sin dato»: no se preguntó).
   - **Quién la envía:** ¿es quien sufrió el ataque?, nombre y apellido, DNI, teléfono, correo.
   - **Víctima** (si no es la misma persona): nombre y apellido, DNI, edad, domicilio.
   - **Dónde y qué pasó:** fecha y hora del hecho, ciudad, ubicación («Pin en el mapa; dirección
     propuesta y confirmada»), referencias, tipo de lugar, qué pasó (lo que eligió la persona y, al
     lado, en qué tipo de evento se traduce: «Me mordió → Ataque con mordedura»), cuántos animales.
   - **Animal 1 de N**, uno por animal: especie, de quién es, dueño **según la persona**, dónde vive,
     vacunado, ¿podría reconocerlo?, tamaño, sexo, edad aparente, color, raza, fotos (adjuntos).
   - **La denuncia:** ¿hizo la denuncia en Zoonosis?, motivo de no denunciar.
6. Si la solicitud ya está resuelta: en lugar de las acciones, una línea «Registrada el 13/09/2026 por
   M. Acosta → C-2026-0418» o «Descartada el 14/09/2026 por M. Acosta».

Las respuestas «No sé» de la persona se muestran como «No sé» (son una respuesta, no un dato faltante).

### Las tres acciones

**Descartar.** Abre una confirmación en ventana lateral: «¿Descartás la solicitud S-2026-0034? No se
borra: queda guardada con sus datos, pero no va a llegar a ningún caso.» · Cancelar · **Descartar**
(peligro). Al confirmar: mensaje de éxito «Solicitud descartada», vuelve a la cola.

**Registrar como caso nuevo.** Pide confirmación en ventana lateral: «Se crea un caso nuevo con todo lo
que declaró la persona. El canal de origen queda como Ciudadano.» · Cancelar · **Registrar**.
- Si hay coincidencia, la ventana repite el aviso y el botón dice **«Es otro ataque, registrar igual»**:
  el caso nace con la marca **posible duplicado**, y se decide después en Posibles duplicados.
- Al confirmar: mensaje de éxito «Caso C-2026-0425 registrado» y se abre **la ficha del caso nuevo**.
  La solicitud pasa a *registrada* y apunta al caso.

**Sumar a un caso existente.** Lleva a la pantalla Sumar (abajo).
- Si hay coincidencia, va directo con ese caso. Si hay varios, pregunta a cuál.
- Si no hay coincidencia, primero pide el caso: una ventana lateral con un campo «Número de caso»
  (`C-2026-…`) que muestra, al escribirlo, víctima y fecha del hecho para confirmar que es ese.

---

## 3. Sumar a un caso (`108:5217`)

### Estructura

1. **Encabezado:** «Sumar S-2026-0034 a C-2026-0418» · bajada «Cuando un dato choca, elegí cuál queda.
   Si solo uno de los dos lo tiene, se conserva el que lo tiene (se guarda la mayor información).»
2. **Mensaje de información** (fijo): «Lo declarado sobre la denuncia se copia siempre. “¿Hizo
   denuncia?” y su motivo: gana la solicitud más reciente. Ningún agente los edita.»
3. **Comparación** campo por campo: Campo · En la solicitud · En el caso. Cada fila es una **Fila de
   comparación** con uno de estos estados:

   | Estado de la fila | Qué pasa | Cómo se ve |
   |---|---|---|
   | Igual | No hay nada que elegir | «=» al medio |
   | Solo en la solicitud | Se conserva el de la solicitud, sin preguntar | Celda marcada · «Se conserva» |
   | Solo en el caso | Se conserva el del caso, sin preguntar | Celda marcada · «Se conserva» |
   | Distinto, sin elegir | **El agente elige** cuál queda (radio en cada celda) | «≠» al medio, ninguna marcada |
   | Distinto, elegido | Queda el que eligió | Celda elegida en violeta |

   Lo marcado en violeta es lo que queda en el caso. Se compara: víctima (nombre, DNI, edad), contacto
   (teléfono, correo), hecho (hora, dirección, referencias…) y los animales.
4. **Animales:** cada animal de la solicitud se compara con el animal del caso que le corresponde. Un
   animal que el caso no tiene aparece como fila «Solo en la solicitud» («Animal 2 · Perro grande,
   marrón (ajeno desconocido)») y **se agrega como animal nuevo del caso**.
5. **Confirmar:** casilla «Confirmo que la solicitud es del mismo hecho que el caso.» · Cancelar ·
   **Sumar al caso**.
6. Debajo, en texto chico, lo que falta: «Falta elegir el teléfono del contacto.» y qué va a pasar: «Al
   sumarla, la solicitud queda “registrada” y apunta al caso; el animal 2 se agrega como un animal
   nuevo del caso.»

### Comportamiento

- **«Sumar al caso» se habilita** solo con la casilla marcada **y** todas las filas distintas elegidas.
  Mientras falte algo, el texto de abajo dice qué.
- **Lo declarado sobre la denuncia** («¿Hizo denuncia?» y motivo) **no aparece como fila para
  elegir**: se copia siempre, porque gana la solicitud más reciente.
- **Lo que la persona dijo del dueño y del chip** no se copia a los datos del animal: queda en la
  solicitud, y Zoonosis lo confirma después desde la ficha del caso.
- Al sumar: mensaje de éxito «S-2026-0034 sumada a C-2026-0418», se abre la ficha del caso. El cambio
  queda en el historial del caso.
- **Cancelar** vuelve a Revisar solicitud sin cambiar nada.

### Datos de ejemplo (lo que se manda al sumar)

```json
{
  "solicitud": "S-2026-0034",
  "caso": "C-2026-0418",
  "elecciones": { "contacto.telefono": "solicitud", "lugar.direccion": "caso", "animales[0].color": "solicitud" },
  "confirmado": true
}
```

## Quién la ve

- **Agentes** (Salud, Zoonosis, CADIC): todo.
- **Analista / comité** y **administrador**: no ven la cola (la API no les devuelve solicitudes) y el
  menú no muestra «Solicitudes» si el permiso no llega.
- Como siempre: si un dato no viene en la respuesta, no se muestra.
