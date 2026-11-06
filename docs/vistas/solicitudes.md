# Vista · Casos › Solicitudes (cola, revisar y sumar a un caso)

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03; actualizada el 2026-11-06 (mapa del pin en
> Revisar solicitud, emparejamiento de animales al sumar, solo Zoonosis ve las solicitudes; Figma todavía
> no lo tiene: gana la ficha).
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

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

**Solo los agentes de Zoonosis** ven las solicitudes y las resuelven *(2026-11-06)*. Salud y CADIC no:
la API no se las devuelve y el menú no muestra «Solicitudes». Los casos que nacen de una solicitud sí
los ven todos, en la Bandeja, como cualquier caso.

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
  "quienInforma": { "nombre": "Carla", "apellido": "Sosa", "dni": "32114887" },
  "victima": { "nombre": "Micaela", "apellido": "Sosa", "dni": "58412336" },
  "fechaHecho": "2026-09-12",
  "horaHecho": "14:20",
  "especie": "perro",
  "ciudad": "ushuaia",
  "seccionesCompletas": 4,
  "coincidencias": [{ "numero": "C-2026-0418" }, { "numero": "C-2026-0402" }]
}
```

Filas para el mock (filtro Pendientes, 3 de 22):

| Solicitud | Enviada | Quién la envía | Víctima | Hecho | Especie | Detallado | Coincidencia |
|---|---|---|---|---|---|---|---|
| S-2026-0034 | 13/09 21:40 | Carla Sosa · informa por otra persona | Micaela Sosa · 58.412.336 | 12/09 14:20 | Perro | Completo 4/4 | C-2026-0418 +1 |
| S-2026-0035 | 14/09 08:12 | Lucía Paz · es quien sufrió el ataque | Lucía Paz · 40.221.908 | 13/09 — | Gato | Solo inicial 0/4 | — |
| S-2026-0036 | 14/09 10:47 | Pedro Gómez · es quien sufrió el ataque | Pedro Gómez · 28.904.551 | 14/09 07:50 | Perro | Parcial 2/4 | — |

Las tres tienen ciudad (es obligatoria en el inicial, también en S-2026-0035, que no siguió al
detallado). Solo S-2026-0034 tiene coordenadas del hecho (-54.8069; -68.3073).

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
   > El DNI 58.412.336 es víctima en C-2026-0418 (Zoonosis Ushuaia, hecho del 12/09/2026) y en
   > C-2026-0402 (Hospital Regional Ushuaia, hecho del 12/09/2026). Si es el mismo hecho, sumala a ese
   > caso; si no, registrala como caso nuevo.

   Cada número de caso es un enlace a la ficha (se abre en otra pestaña, para no perder la solicitud).
   En el ejemplo, los dos casos son a su vez un posible duplicado sin resolver entre ellos.
4. Bajada: «Lo que declaró la persona, tal cual. Al registrarla se copia al caso sin transcribir.
   Hasta que un agente decide, no escribe en ningún caso ni persona.»
5. **Bloques de solo lectura**, en este orden. Un bloque aparece solo si la persona respondió algo de
   él; una pregunta sin responder no se muestra (no es «Sin dato»: no se preguntó).
   - **Quién la envía:** ¿es quien sufrió el ataque?, nombre y apellido, DNI, teléfono, correo.
   - **Víctima** (si no es la misma persona): nombre y apellido, DNI, edad, domicilio.
   - **Dónde y qué pasó:** fecha y hora del hecho, ciudad, ubicación («Pin en el mapa; dirección
     propuesta y confirmada»), referencias, tipo de lugar, qué pasó (lo que eligió la persona y, al
     lado, en qué tipo de evento se traduce: «Me mordió → Ataque con mordedura»), cuántos animales.
     La ciudad viene siempre (es obligatoria en el inicial). **Debajo de los datos, si la solicitud
     tiene coordenadas**, un mapa **de solo lectura** con el punto que dejó la persona y la línea
     «Pin del hecho (lat; lon)», igual que en el bloque «Hecho» de la ficha del caso. Mover o acercar
     el mapa no cambia nada. **Sin coordenadas no se muestra nada** (ni mapa, ni hueco, ni «Sin
     dato»): la persona no movió el mapa o no completó esa parte.
   - **Animal 1 de N**, uno por animal: especie, de quién es, dueño **según la persona**, dónde vive,
     vacunado, ¿podría reconocerlo?, tamaño, sexo, edad aparente, color, raza, fotos (adjuntos).
   - **La denuncia:** ¿hizo la denuncia en Zoonosis?, motivo de no denunciar.
6. Si la solicitud ya está resuelta: en lugar de las acciones, una línea «Registrada el 12/09/2026 15:10
   por M. Acosta → C-2026-0418» (es S-2026-0031, enviada el 12/09 a las 14:50 y sumada a ese caso) o
   «Descartada el 14/09/2026 por M. Acosta».

Las respuestas «No sé» de la persona se muestran como «No sé» (son una respuesta, no un dato faltante).

### Las tres acciones

**Descartar.** Abre una confirmación en ventana lateral: «¿Descartás la solicitud S-2026-0034? No se
borra: queda guardada con sus datos, pero no va a llegar a ningún caso.» · Cancelar · **Descartar**
(peligro). Al confirmar: mensaje de éxito «Solicitud descartada», vuelve a la cola.

**Registrar como caso nuevo.** Pide confirmación en ventana lateral: «Se crea un caso nuevo con lo que
declaró la persona. El canal de origen queda como Ciudadano.» · Cancelar · **Registrar**.
- Lo que la persona dijo del **dueño y del chip** de un animal **no se copia** a esos datos: queda en la
  solicitud hasta que Zoonosis lo confirme (igual que al sumar, ver abajo).
- Si hay coincidencia, la ventana repite el aviso y el botón dice **«Es otro ataque, registrar igual»**:
  confirma que **son casos distintos**. El caso nace **sin** la marca de posible duplicado y la
  coincidencia queda resuelta como «distintos» (mismo desenlace que «No es duplicado»). Si es el mismo
  hecho, la salida es **Sumar a un caso existente**.
- **No hay «Guardar y revisar después»** (la tercera salida de Nuevo caso): una solicitud no crea un
  caso marcado como posible duplicado. Si es el mismo hecho, se suma; si no, se registra igual.
- Al confirmar: mensaje de éxito «Caso C-2026-0425 registrado» y se abre **la ficha del caso nuevo**.
  La solicitud pasa a *registrada* y apunta al caso.

**Sumar a un caso existente.** Lleva a la pantalla Sumar (abajo).
- **Solo se puede sumar a un caso *Registrado* o *En seguimiento* que tenga menos de 2 solicitudes**
  *(2026-11-06)*. Un caso *Finalizado*, *Desestimado* o *Unificado* no se reabre, y una tercera
  solicitud sobre el mismo caso se descarta. Si el caso no admite la solicitud, se muestra igual (para
  que el agente sepa que existe) pero no se puede elegir, con el motivo al lado: «Finalizado: no recibe
  solicitudes» o «Ya tiene 2 solicitudes». Lo hace cumplir el back; si rechaza al sumar, el mensaje de
  error dice lo mismo. Si ningún caso la admite, quedan Registrar como caso nuevo o Descartar.
- Si hay coincidencia, va directo con ese caso. Si hay varios, pregunta a cuál (en el ejemplo, entre
  C-2026-0418 y C-2026-0402; el agente elige C-2026-0418).
- Si no hay coincidencia, primero pide el caso: una ventana lateral con un campo «Número de caso»
  (`C-2026-…`) que muestra, al escribirlo, víctima y fecha del hecho para confirmar que es ese (y, si
  no admite la solicitud, el motivo, sin dejar continuar).

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
4. **Animales: primero se emparejan, después se comparan.**
   - **Emparejar:** cada animal de la solicitud tiene un selector **«Es en el caso:»** con los animales
     del caso (*Animal 1 · Animal 2 · …*, con su especie y descripción corta, p. ej. «Animal 2 · Perro
     grande, marrón») y dos opciones más: **«Es otro animal»** (se agrega al caso) y **«No va al
     caso»** (Zoonosis verificó que ese animal no existe o no corresponde, p. ej. la persona contó tres
     perros y eran dos). Reglas:
     - Solo se ofrecen animales del caso **de la misma especie** (un gato no puede ser un perro).
     - **Dos animales de la solicitud no pueden ser el mismo del caso**: el que ya se eligió para uno
       aparece deshabilitado en los demás selectores.
     - **Viene preelegido solo si es obvio:** un animal en la solicitud y uno en el caso, de la misma
       especie. En cualquier otro caso arranca sin elegir y lo decide el agente.
     - El sistema **no adivina** el emparejamiento comparando descripciones (RN-22: la descripción no
       es parte de ningún motor).
   - **Comparar:** cuando un animal está emparejado, debajo aparecen sus filas de comparación con el
     animal elegido (de quién es, vacunado, tamaño, color…), con los mismos estados de arriba. Si es
     «Es otro animal», sus datos aparecen como «Solo en la solicitud» y **se agrega como animal nuevo
     del caso**. Si es «No va al caso», no se compara nada: ese animal **no se crea en el caso** y lo
     que la persona dijo de él (dueño, chip, descripción) queda solo en la solicitud, tal cual. Si sirve,
     Zoonosis lo carga a mano después con Editar animal.
   - En el ejemplo, S-2026-0034 y C-2026-0418 tienen dos perros cada uno: no hay preelección. El agente
     elige animal 1 → Animal 1 y animal 2 → Animal 2 («Perro grande, marrón (ajeno desconocido)»), así
     que **no se agrega ninguno**.
5. **Confirmar:** casilla «Confirmo que la solicitud es del mismo hecho que el caso.» · Cancelar ·
   **Sumar al caso**.
6. Debajo, en texto chico, lo que falta elegir (p. ej. «Falta elegir el color del animal 1.»; en el
   ejemplo no falta nada) y qué va a pasar: «Al sumarla, la solicitud queda “registrada” y apunta al
   caso; sus dos animales son los del caso, no se agrega ninguno.»
   En el ejemplo, todas las filas son **iguales** salvo dos que están solo en la solicitud y se
   conservan: el **correo del contacto** (Carla Sosa pasa a tener correo en SIRAM) y el **tipo de lugar**
   («Vía pública»). Como el tipo de lugar era lo único que le faltaba a C-2026-0418, **al sumar la
   solicitud el caso deja de ser incompleto**.

### Comportamiento

- **«Sumar al caso» se habilita** solo con la casilla marcada, **todos los animales emparejados** (con un
  animal del caso, «Es otro animal» o «No va al caso»: las tres cuentan como decisión tomada) **y**
  todas las filas distintas elegidas. Mientras falte algo, el texto de abajo dice qué (p. ej. «Falta decidir qué animal del caso es el animal 2.»).
- **Lo declarado sobre la denuncia** («¿Hizo denuncia?» y motivo) **no aparece como fila para
  elegir**: se copia siempre, porque gana la solicitud más reciente.
- **Lo que la persona dijo del dueño y del chip** no se copia a los datos del animal: queda en la
  solicitud. En la ficha del caso, Zoonosis lo ve en ese animal como «Según la solicitud S-…: dueño …,
  chip …» y lo pasa a los datos con **Editar animal**.
- Al sumar: mensaje de éxito «S-2026-0034 sumada a C-2026-0418», se abre la ficha del caso. El cambio
  queda en el historial del caso.
- **Cancelar** vuelve a Revisar solicitud sin cambiar nada.

### Datos de ejemplo (lo que se manda al sumar)

```json
{
  "solicitud": "S-2026-0034",
  "caso": "C-2026-0418",
  "elecciones": {},
  "animales": [
    { "animalSolicitud": 1, "animalCaso": 1 },
    { "animalSolicitud": 2, "animalCaso": 2 }
  ],
  "confirmado": true
}
```

`animales` es el **emparejamiento**: por cada animal de la solicitud, con qué animal del caso se
corresponde, `"animalCaso": "nuevo"` si el caso no lo tenía (se agrega) o `"animalCaso": null` si
no va al caso. Es obligatorio al sumar:
el back lo guarda para poder mostrar, en el animal correcto de la ficha del caso, lo que la persona
dijo del dueño y del chip. Al **registrar como caso nuevo** no se manda: cada animal de la solicitud
crea el suyo y el back los relaciona solo. (En el mock, los números son el orden del animal; la forma
real la define la API.)

## Quién la ve

- **Agentes de Zoonosis:** todo, incluido lo que la persona dijo del dueño y del chip.
- **Agentes de Salud y CADIC**, **analista / comité** y **administrador**: no ven la cola (la API no
  les devuelve solicitudes) y el menú no muestra «Solicitudes» si el permiso no llega.
- Como siempre: si un dato no viene en la respuesta, no se muestra.

## Pendiente: no lo implementes todavía

- **Emparejar aunque la especie no coincida** (la persona dijo «gato» y es el perro del caso): queda
  para después de la alfa. Por ahora ese animal se marca «No va al caso».
