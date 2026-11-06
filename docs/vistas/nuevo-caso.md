# Vista · Casos › Nuevo caso

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03; actualizada el 2026-11-06 (ciudad en el
> bloque «Hecho»; Figma todavía no la tiene: gana la ficha).
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Casos**, componente **«Casos › Nuevo caso ·
  formulario inicial · v2»** (nodo `108:5213`). Es solo la ventana lateral.
- Piezas, en **Fundamentos**: Ventana lateral/Encabezado y /Pie (`9:345`), Bloque de formulario/Leyenda,
  Campo (`9:255`), Opción (`9:272`), Mensaje (`10:212`).
- Para el aviso de DNI repetido, el mensaje a imitar es el de **«Casos › Solicitudes · Revisar
  solicitud»** (nodo `108:5216`): «La víctima ya está en un caso».
- Ruta: `/casos/nuevo` (menú Casos › Nuevo caso, y el botón «Nuevo caso» de la Bandeja).

## Para qué sirve

Un agente de un organismo (Salud, Zoonosis o CADIC) da de alta un caso con el **formulario
inicial**: corto a propósito, solo lo necesario para que el caso exista y se pueda contactar a
alguien. **Todo lo demás** (ubicación, animales, tratamiento, denuncia, edad de la víctima…) **se
completa después, en la ficha del caso.**

## Qué cambia respecto de lo anterior

- El formulario completo de la v1 (bloques Persona, Hecho, Tipo de evento, Animal, Lesión y atención,
  Documentación, Denuncia y seguimiento, con códigos P/H/A/L/X/D) **ya no va**. Se reemplaza por el
  formulario inicial de esta ficha.
- Hoy `/casos/nuevo` muestra «En diseño». Pasa a ser esta ventana.

## Estructura

Se abre como **ventana lateral** desde la derecha (50 % en escritorio, 100 % en teléfono) **sobre la
Bandeja**: la ruta `/casos/nuevo` muestra la Bandeja con la ventana abierta, y al cerrarla se vuelve a
`/casos`.

1. **Encabezado:** «Nuevo caso» · bajada «Formulario inicial. Lo obligatorio (*) depende del canal; el
   caso guarda su canal de origen. Canal: Zoonosis (tu organismo).» (el canal es el organismo del
   usuario) · botón cerrar.
2. **Bloque «¿Quién sufrió el ataque?»** — bajada: «Si es la misma persona, se carga una sola (la
   víctima). Si no, se cargan la víctima y el contacto responsable.» Pregunta obligatoria: «¿La persona
   que informa es quien sufrió el ataque? *» → **Sí** · **No, es otra persona**.
3. **Bloque «Víctima»** — nombre, apellido, DNI, teléfono, correo electrónico.
4. **Bloque «Contacto responsable»** — **solo si se respondió «No, es otra persona»**. Bajada: «Quien
   informa en nombre de la víctima y a quien se contacta. No se guarda la relación entre ambas.»
   Nombre, apellido, DNI, teléfono, correo electrónico.
5. **Bloque «Hecho»** — fecha del hecho; especie del animal (Perro · Gato); **ciudad** (Ushuaia · Río
   Grande · Tolhuin, sin «Otra»; ayuda: «Si fue fuera de las tres ciudades, marcá la más cercana»).
6. **Nota al pie del cuerpo:** «Al guardar, si el DNI de la víctima coincide con otro caso se avisa antes
   de crear el registro. Ubicación, animales, tratamiento y denuncia se completan después en la ficha
   del caso.»
7. **Pie:** Cancelar (izquierda) · Guardar (derecha, deshabilitado hasta que haya cambios).

Mientras no se respondió la primera pregunta, se muestra solo el bloque Víctima (como si fuera «Sí»).

## Qué es obligatorio

Depende del **canal**, que es el organismo de quien carga. El front lo sabe por el usuario conectado.

| Campo | Zoonosis | CADIC | Salud |
|---|---|---|---|
| ¿Es quien sufrió el ataque? | ✔ | ✔ | ✔ |
| Víctima: nombre, apellido, DNI | ✔ | ✔ | ✔ |
| Contacto responsable (si lo hay): nombre, apellido, DNI | ✔ | ✔ | ✔ |
| **Teléfono de quien se contacta** | ✔ | — | — |
| Correo | — | — | — |
| Fecha del hecho | ✔ | ✔ | — (en la guardia no se suele saber) |
| Especie del animal | ✔ | ✔ | ✔ |
| Ciudad | ✔ | ✔ | ✔ |

- **«Quien se contacta»** es la víctima si respondió «Sí», y el contacto responsable si respondió
  «No». El teléfono y el correo **de la víctima** nunca son obligatorios cuando hay contacto
  responsable (un niño no los tiene).
- **La regla final la hace cumplir el back**; el front marca con `*` y valida antes de enviar para no
  hacer esperar a la persona. Si el back rechaza un campo, el error se muestra debajo de ese campo.

## Validaciones

- **DNI:** solo dígitos, 7 u 8, con o sin puntos. Se muestra con puntos (`58.412.336`). Si no cumple:
  «El DNI tiene 7 u 8 números». (Personas sin DNI argentino: pendiente, ver abajo.)
- **Víctima y contacto con el mismo DNI:** error en el DNI del contacto: «Es el mismo DNI que la
  víctima. Si es la misma persona, respondé “Sí” arriba.»
- **Correo:** formato de correo. **Teléfono:** texto libre, al menos 6 dígitos.
- **Fecha del hecho:** no puede ser futura.
- **Ciudad** sin elegir: «Elegí la ciudad del hecho».
- Los errores van en el espacio reservado de 20 px debajo de cada campo (no en un mensaje arriba).

## Al guardar

1. El front envía el formulario. Ejemplo de lo que se manda (la forma real la define la API):

   ```json
   {
     "informaLaVictima": false,
     "victima": { "nombre": "Micaela", "apellido": "Sosa", "dni": "58412336", "telefono": null, "correo": null },
     "contactoResponsable": { "nombre": "Carla", "apellido": "Sosa", "dni": "32114887", "telefono": "2901-54-8820", "correo": null },
     "fechaHecho": "2026-09-12",
     "especie": "perro",
     "ciudad": "ushuaia"
   }
   ```
   El canal de origen no se manda: lo pone el back según el organismo del usuario.

2. **Si el DNI de la víctima ya es víctima en otro caso**, el back **no crea el caso todavía** y
   responde con el caso que coincide. Ejemplo (M. Acosta registra a Micaela Sosa el 12/09 a las 15:02;
   Salud ya la había registrado a las 14:50):
   ```json
   { "coincidencia": { "numero": "C-2026-0402", "organismo": "Hospital Regional Ushuaia", "fechaHecho": "2026-09-12" } }
   ```
   El front muestra, **arriba del cuerpo de la ventana**, un mensaje de **advertencia** (no se cierra
   solo), con los datos tal cual llegan:
   > **La víctima ya está en un caso**
   > El DNI 58.412.336 es víctima en C-2026-0402 (Hospital Regional Ushuaia, hecho del 12/09/2026). Si
   > es el mismo hecho, completá ese caso; si es otro ataque, guardá igual. Si no estás seguro, guardalo
   > y revisalo después en Posibles duplicados.

   Para **Salud y CADIC** el texto termina distinto, porque la decisión sobre duplicados es de Zoonosis
   (2026-11-06): «Si es el mismo hecho, completá ese caso; si no, guardalo y Zoonosis lo revisa en
   Posibles duplicados.»

   Con **tres** acciones en el mensaje (para Salud y CADIC, solo la primera y la tercera):
   - **«Abrir C-2026-0402»** (secundario): va a la ficha de ese caso **sin crear** el nuevo. Si había
     cambios, antes pregunta si se descartan.
   - **«Es otro ataque, guardar igual»** (texto; **solo Zoonosis**): vuelve a enviar confirmando que
     **son casos distintos**. El back crea el caso **sin** la marca de posible duplicado y deja la coincidencia
     resuelta como «distintos» (el aviso no vuelve a salir para ese par). Es el mismo desenlace que
     «No es duplicado» en Posibles duplicados.
   - **«Guardar y revisar después»** (texto): vuelve a enviar pidiendo que se cree igual, **con** la
     marca de posible duplicado. La coincidencia queda **pendiente** y el Sistema la anota en el
     historial del caso en el mismo momento del alta. Se decide después, en Posibles duplicados
     (`posibles-duplicados.md`). Es lo que eligió M. Acosta con C-2026-0418.

   Lo que se vuelve a enviar es el mismo formulario más la decisión (forma de ejemplo):
   `"coincidencia": { "caso": "C-2026-0402", "decision": "distintos" }` o
   `"decision": "revisar_despues"`.

   El aviso compara **solo el DNI de la víctima**: nunca el de quien informa. Los casos históricos sin
   DNI no generan aviso.
3. **Si sale bien:** se cierra la ventana, aparece un mensaje de **éxito** arriba a la derecha (se cierra
   solo): «Caso C-2026-0425 registrado» y se abre **la ficha del caso nuevo** para seguir completándolo.
   El caso nace *Registrado* y, casi siempre, con la marca *Incompleto* (le faltan el lugar, el tipo de lugar, etc.).
   Si se eligió «Guardar y revisar después», nace además con la marca *Posible duplicado* y la ficha
   muestra el aviso con el caso que coincide.

## Cancelar

- **Sin cambios:** cierra y vuelve a la Bandeja.
- **Con cambios:** pregunta antes de cerrar («¿Descartás los datos cargados?» · Seguir editando ·
  Descartar).

## Datos de ejemplo

Para el mock, alcanza con: el organismo del usuario conectado (para el canal y la obligatoriedad) y
una lista de DNI de víctimas existentes para simular el aviso. En la historia de ejemplo, al momento de
registrar C-2026-0418 (12/09/2026 15:02) el DNI `58412336` (Micaela Sosa) solo era víctima en
C-2026-0402. Con los datos al 25/09/2026 es víctima en dos casos (C-2026-0418 y C-2026-0402): ver
«Pendiente».

## Quién la ve

- Solo **agentes** (Salud, Zoonosis, CADIC). El analista y el administrador no registran casos: la API
  no les da ese permiso, y el front no muestra «Nuevo caso» (ni en el menú ni en la Bandeja) si el
  permiso no llega. Mientras no haya API, se muestra siempre.

## Pendiente: no lo implementes todavía

- **Personas sin DNI argentino** (p. ej. turistas): todavía no hay cómo cargarlas.
- **Registros históricos** (casos viejos cargados a mano, que pueden no tener DNI): todavía no está
  definido cómo los marca el agente al cargarlos.
- **Persona que ya existe:** cada persona es única por DNI. Si el DNI ya es de alguien en SIRAM (como
  víctima o contacto en otro caso), qué muestra el formulario (¿autocompleta nombre y apellido? ¿avisa
  si no coinciden?) está por definirse con el back. Por ahora, el formulario no hace nada especial.
- **DNI que ya es víctima en más de un caso** (en los datos de ejemplo, 58.412.336 está en C-2026-0418
  y en C-2026-0402): qué casos nombra el aviso, cuál abre «Abrir C-…» y con cuál queda la coincidencia
  al elegir «Guardar y revisar después» o «Es otro ataque». Lo define el back.
