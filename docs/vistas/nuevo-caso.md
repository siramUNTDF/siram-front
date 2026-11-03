# Vista · Casos › Nuevo caso

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha.

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
5. **Bloque «Hecho»** — fecha del hecho; especie del animal (Perro · Gato).
6. **Nota al pie del cuerpo:** «Al guardar, si el DNI coincide con otro caso se avisa antes de crear el
   registro. Ubicación, animales, tratamiento y denuncia se completan después en la ficha del caso.»
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
- Los errores van en el espacio reservado de 20 px debajo de cada campo (no en un mensaje arriba).

## Al guardar

1. El front envía el formulario. Ejemplo de lo que se manda (la forma real la define la API):

   ```json
   {
     "informaLaVictima": false,
     "victima": { "nombre": "Micaela", "apellido": "Sosa", "dni": "58412336", "telefono": null, "correo": null },
     "contactoResponsable": { "nombre": "Carla", "apellido": "Sosa", "dni": "32114887", "telefono": "2901-54-8820", "correo": null },
     "fechaHecho": "2026-09-12",
     "especie": "perro"
   }
   ```
   El canal de origen no se manda: lo pone el back según el organismo del usuario.

2. **Si el DNI de la víctima ya es víctima en otro caso**, el back **no crea el caso todavía** y
   responde con el caso que coincide. Ejemplo:
   ```json
   { "coincidencia": { "numero": "C-2026-0418", "organismo": "Zoonosis Ushuaia", "fechaHecho": "2026-09-12" } }
   ```
   El front muestra, **arriba del cuerpo de la ventana**, un mensaje de **advertencia** (no se cierra
   solo), con los datos tal cual llegan:
   > **La víctima ya está en un caso**
   > El DNI 58.412.336 es víctima en C-2026-0418 (Zoonosis Ushuaia, hecho del 12/09/2026). Si es el
   > mismo hecho, completá ese caso; si es otro ataque, guardá igual.

   Con dos acciones en el mensaje:
   - **«Abrir C-2026-0418»** (secundario): va a la ficha de ese caso. Si había cambios, antes pregunta
     si se descartan.
   - **«Es otro ataque, guardar igual»** (texto): vuelve a enviar confirmando. El back crea el caso con
     la marca **posible duplicado**; la decisión final (consolidar o no) se toma después en Posibles
     duplicados.

   El aviso compara **solo el DNI de la víctima**: nunca el de quien informa. Los casos históricos sin
   DNI no generan aviso.
3. **Si sale bien:** se cierra la ventana, aparece un mensaje de **éxito** arriba a la derecha (se cierra
   solo): «Caso C-2026-0425 registrado» y se abre **la ficha del caso nuevo** para seguir completándolo.
   El caso nace *Registrado* y, casi siempre, con la marca *Incompleto* (le faltan ciudad, lugar, etc.).

## Cancelar

- **Sin cambios:** cierra y vuelve a la Bandeja.
- **Con cambios:** pregunta antes de cerrar («¿Descartás los datos cargados?» · Seguir editando ·
  Descartar).

## Datos de ejemplo

Para el mock, alcanza con: el organismo del usuario conectado (para el canal y la obligatoriedad) y
una lista de DNI de víctimas existentes para simular el aviso. Con los datos de la Bandeja: el DNI
`58412336` (Micaela Sosa) es víctima en C-2026-0418.

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
