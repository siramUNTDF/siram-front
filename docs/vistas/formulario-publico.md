# Vista · Formulario público (canal ciudadano)

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03; actualizada el 2026-11-06 (ciudad en el
> inicial y mapa oscurecido en «¿Dónde fue?»; Figma todavía no lo tiene: gana la ficha).
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Formulario público** (nodo `105:945`). Ocho
  pantallas de 390 px de ancho:

  | # | Pantalla | Nodo |
  |---|---|---|
  | 1 | Formulario inicial | `108:9984` |
  | 2 | Solicitud enviada | `108:9985` |
  | 3 | Dónde fue (parte 1 de 4) | `108:9986` |
  | 4 | Qué pasó (parte 2 de 4) | `108:9987` |
  | 5 | El animal (parte 3 de 4, una vez por animal) | `108:9988` |
  | 6 | La denuncia (parte 4 de 4) | `108:9989` |
  | 7 | Gracias | `108:9990` |
  | 8 | Enlace vencido | `106:877` |

- Piezas, en **Fundamentos**: Campo (`9:255`), Opción (`9:272`), Botón (`5:53`), Mensaje (`10:212`),
  Archivo adjunto. Mismos tokens y tipografías que el backoffice.
- Rutas sugeridas, **fuera** de la cáscara del backoffice y sin login: `/reportar` (inicial) y
  `/reportar/detalle` (las cuatro partes, la confirmación y el vencido). El nombre de la ruta lo
  decide el front.

## Para qué sirve

Una persona a la que mordió o atacó un perro o un gato (o alguien que informa por ella, p. ej. una
madre por su hija) **avisa a SIRAM desde el teléfono**. Lo que manda **no es un caso: es una
solicitud**, lo que declaró la persona tal cual. Un agente la revisa después en `Casos › Solicitudes`
y la descarta o la registra. Nada de lo que se carga acá escribe en un caso sin un agente de por medio.

Público: alguien recién mordido, sin cuenta y probablemente con el teléfono en la mano. Por eso:
corto, claro, de a una cosa por vez, todo opcional salvo lo mínimo, y siempre con salida («Terminar
acá»).

## Piel y tono

- **Sin la cáscara del backoffice**: no hay barra superior de 89 px, ni menú, ni usuario. Arriba, solo
  la marca: «SIRAM» + «Registro de ataques y mordeduras · Tierra del Fuego».
- Diseñado a **390 px**. En pantallas anchas, el contenido queda centrado con ese ancho máximo (no se
  estira).
- Tuteo rioplatense («¿Te mordió…?», «Contanos», «Mové el mapa»). El backoffice no tutea; esto sí.
- Botón principal a todo el ancho, abajo; «Terminar acá» como botón de texto debajo.
- Las ayudas van en el ícono junto a la etiqueta, como en el backoffice. Los ejemplos pueden ir de
  placeholder, pero repetidos en la ayuda (el placeholder desaparece al escribir).

## Recorrido

```
1 Formulario inicial ──Enviar──▶ 2 Solicitud enviada ──Terminar acá──▶ 7 Gracias
                                       │
                                  Contar más
                                       ▼
            3 Dónde fue ▶ 4 Qué pasó ▶ 5 El animal (×N) ▶ 6 La denuncia ──Enviar y terminar──▶ 7 Gracias
                 │             │              │                  │
            Terminar acá  Terminar acá   Terminar acá      (fin = 7 Gracias)
                 └─────────────┴──────────────┴──────────────▶ 7 Gracias

  En cualquier punto de 3 a 6, si el enlace venció ──▶ 8 Enlace vencido
```

«Terminar acá» en las partes 3 a 6 **guarda lo de esa parte** (si se completó algo) y va a
**Gracias**. En la pantalla 2, «Terminar acá» no tiene nada que guardar: va directo a **Gracias**.

## Pantalla 1 · Formulario inicial

Título «¿Te mordió o te atacó un perro o un gato?» · bajada «Contanos qué pasó. Lo revisa una persona
de Salud, Zoonosis o CADIC. Te lleva dos minutos.» · aviso de **advertencia** fijo (no se cierra):
«Esto no es un canal de emergencias. Si necesitás atención médica, andá a la guardia más cercana.»

1. **«¿Sos quien sufrió el ataque? \*»** → Sí · No, informo por otra persona.
2. **Tus datos:** nombre \*, apellido \*, DNI \* (con ayuda), teléfono \*, correo electrónico \*.
3. **Quién sufrió el ataque** — solo si respondió «No»: nombre \*, apellido \*, DNI \*. Debajo: «No
   hace falta su teléfono ni su correo: te contactamos a vos.»
4. **El hecho:** «¿Cuándo pasó? \*» (fecha) · «¿Qué animal fue? \*» Perro · Gato · «Ciudad \*»
   Ushuaia · Río Grande · Tolhuin. **No hay «Otra»**; ayuda: «Si fue fuera de las tres ciudades,
   marcá la más cercana».
5. Botón **Enviar** · pie: «Usamos tus datos solo para registrar el hecho y contactarte (Ley 25.326 de
   protección de datos personales).»

Mientras no se respondió la primera pregunta, se muestra «Tus datos» y el bloque «Quién sufrió el
ataque» queda oculto.

**Obligatorio en el canal ciudadano** (es el más exigente de los cuatro canales): nombre, apellido,
DNI, teléfono, correo, especie, fecha del hecho y ciudad de **quien completa**; y nombre, apellido y DNI de la
víctima si es otra persona. La regla final la hace cumplir el back; el front valida antes de enviar.

**Validaciones** (errores en los 20 px debajo de cada campo):
- DNI: 7 u 8 números, con o sin puntos; se muestra con puntos. Error: «El DNI tiene 7 u 8 números».
- DNI de la víctima igual al de quien completa: «Es tu mismo DNI. Si fuiste vos, respondé “Sí” arriba.»
- Correo con formato de correo; teléfono con al menos 6 dígitos.
- Fecha del hecho: no puede ser futura.
- Ciudad sin elegir: «Contanos en qué ciudad fue».

**Al enviar** (crea la solicitud). Ejemplo de lo que se manda:

```json
{
  "informaLaVictima": false,
  "quienInforma": { "nombre": "Carla", "apellido": "Sosa", "dni": "32114887", "telefono": "2901-54-8820", "correo": "carla.sosa@correo.com" },
  "victima": { "nombre": "Micaela", "apellido": "Sosa", "dni": "58412336" },
  "fechaHecho": "2026-09-12",
  "especie": "perro",
  "ciudad": "ushuaia"
}
```

Respuesta de ejemplo:

```json
{ "numero": "S-2026-0034", "token": "q8V0…(aleatorio, largo)", "venceEn": "2026-09-13T22:40:00-03:00" }
```

- El **número** (`S-2026-0034`) es para mostrarle a la persona. **El token es lo único que habilita
  el formulario detallado**: nunca se usa el número para eso.
- Mientras envía: botón deshabilitado con indicador de carga. Si falla la red: mensaje de **error**
  («No pudimos enviar tu solicitud. Revisá tu conexión y probá de nuevo.») y los datos siguen en el
  formulario.

## Pantalla 2 · Solicitud enviada

Ícono de confirmación · «Recibimos tu solicitud» · «Número S-2026-0034. Una persona la va a revisar.»

**¿Nos contás un poco más?** «Son 4 partes cortas: dónde fue, qué pasó, cómo era el animal y la
denuncia. Es opcional, y cada parte se guarda al pasar a la siguiente.» Aviso de **advertencia**: «Es
una sola oportunidad. Este enlace vence en 1 hora y no se puede volver a abrir. Después, solo los
organismos agregan datos.» Botones: **Contar más** (primario) · **Terminar acá** (texto).

Desde acá **no se puede volver** al formulario inicial: la solicitud ya existe. (El botón atrás del
navegador no tiene que reenviar nada; ver «Token y navegación».)

## Las cuatro partes del detallado (pantallas 3 a 6)

Comunes a las cuatro:
- Arriba, progreso: «Parte n de 4 · se guarda al pasar a la siguiente» con una barra.
- **Todo es opcional.** Toda pregunta con escala tiene **«No sé»**; dejar algo sin responder también
  vale (no es lo mismo: «No sé» es una respuesta, vacío es «sin dato»).
- **Siguiente** guarda la parte y avanza. **Terminar acá** guarda la parte y va a Gracias.
- Cada guardado es un envío parcial que **completa la misma solicitud** (con el token). Ejemplo de la
  parte 1:

  ```json
  { "parte": "donde", "punto": { "lat": -54.8069, "lon": -68.3073 }, "direccion": "Kuanip 1240",
    "referencias": "Frente a la plaza, casa de rejas verdes",
    "tipoLugar": "via_publica", "hora": "14:20" }
  ```
  `punto` es opcional: va solo si la persona movió el mapa (ver pantalla 3). La ciudad no va: vino en
  el inicial.
- Si el guardado falla por red: mensaje de **error** con «Reintentar»; la persona no pierde lo cargado
  ni avanza hasta que se guarde (o elige «Terminar acá», que intenta guardar una vez y, si falla,
  igual muestra Gracias avisando que esa parte no llegó).
- Si el back responde que el enlace venció: pantalla 8 (ver «Si el enlace vence a mitad de camino»).

### Pantalla 3 · Dónde fue (1 de 4)

«¿Dónde fue?» · «Mové el mapa hasta dejar el pin donde pasó. Te proponemos la dirección; corregila si
hace falta.»

- **Mapa** (OpenStreetMap con Leaflet) con un pin fijo al centro: la persona mueve el mapa, no el pin.
  Arranca centrado en **la ciudad que eligió en el inicial**. Atribución **siempre visible**: «©
  OpenStreetMap».
- **Arranca oscurecido**, con el aviso «Mové el mapa y dejá el pin donde fue el ataque». El
  oscurecido no bloquea: el primer gesto ya mueve el mapa. El aviso se va con el **primer gesto de la
  persona** (arrastrar, pellizcar, botones de zoom, flechas del teclado) y no vuelve. Un recentrado
  automático **no cuenta** como gesto. Si la persona vuelve a esta parte con atrás después de
  moverlo, el mapa se ve sin oscurecer, donde lo dejó.
- **Sin gesto no hay punto:** si al apretar Siguiente o Terminar acá la persona no movió el mapa, la
  parte se guarda **sin punto** (y sin dirección propuesta). Lo que escribió a mano (dirección,
  referencias, tipo de lugar, hora) se guarda igual. Así no queda como lugar del hecho un centro de
  ciudad que nadie eligió.
- **Dirección**: al **soltar** el mapa **después de ese primer gesto** (nunca al abrir la parte ni por
  un recentrado; no mientras se arrastra, no por cada tecla) se pide **una** geocodificación inversa
  y se completa el campo, con la nota «La propuso el mapa al soltar el pin.». La persona la puede corregir a mano; si la corrige, mover el mapa de nuevo **no** la pisa sin
  preguntar. El pedido va **al back** (que tiene un proxy con caché de Nominatim),
  nunca directo a Nominatim desde el navegador. Si la geocodificación falla o tarda, el campo queda
  vacío y editable; no se muestra error.
- **Referencias** (texto libre): «casa roja», «plaza en la esquina».
- **¿Qué tipo de lugar era?**: Casa propia · Casa ajena · Vía pública · Espacio público · Zona rural ·
  No sé.
- **Hora aproximada** (texto o selector de hora).
- La **fecha** y la **ciudad** no se vuelven a preguntar: vinieron en el inicial.

### Pantalla 4 · Qué pasó (2 de 4)

- **¿Qué le pasó a la persona?**: Mordedura · Arañazo · Intentó atacar, sin lastimar · Se lastimó al
  escapar · No sé.
- **¿Cuántos animales atacaron?**: 1 · 2 · 3 · Más de 3. **Define cuántas veces se repite la parte 3**
  («Animal 1 de N»). «Más de 3» repite la parte 3 tres veces. Cuántos fueron en total no se pregunta
  todavía (ver «Pendiente»). Sin respuesta = 1 animal.
- **Edad de quien sufrió el ataque** (número, en años).
- **Domicilio de quien sufrió el ataque** (opcional).

No se pregunta nada de la atención médica: eso lo carga Salud.

### Pantalla 5 · El animal (3 de 4) — una vez por animal

Título «Animal 1 de 2» · «Contanos lo que sepas. Todo se puede dejar en “No sé”.» La especie del
animal 1 viene del inicial (no se repite la pregunta); desde el animal 2 se pregunta **Perro · Gato**
y es **obligatoria** (sin «No sé»: la especie no es una escala, solo puede ser perro o gato, y todo
animal nace con su especie, RN-30). Es la única pregunta obligatoria de esa parte: sin ella no se pasa
a la siguiente ni se guarda ese animal; «Terminar acá» guarda lo anterior y descarta ese animal.

**De quién es**
- **¿De quién es el animal?**: Es mío · De alguien que conozco · No sé de quién es.
  - *Es mío* → aparecen «¿Tiene chip?» (Sí · No · No sé) y, si es Sí, «Número de chip». La nota «Si es
    tuyo, te preguntamos si tiene chip y su número.» se ve antes de elegir.
  - *De alguien que conozco* → «Si sabés quién es el dueño: nombre y cómo contactarlo» (opcional).
  - *No sé de quién es* → nada más.
- **¿Dónde vive el animal?** (texto, si lo sabe).
- **¿Está vacunado contra la rabia?**: Sí · No · No sé.
- **¿Podrías reconocerlo?**: Sí · No · No sé.

**Cómo era**: Tamaño (Chico · Mediano · Grande · No sé) · Sexo (Macho · Hembra · No sé) · Edad aparente
(Cachorro · Adulto · Viejo · No sé) · Color (texto) · Raza (texto) · **Fotos del animal** (opcional;
«Agregar otra foto»).

- Fotos: hasta 3 por animal, JPG o PNG, hasta 5 MB cada una. Se muestran como archivo adjunto (nombre,
  tamaño, ícono para quitarla). Se suben al guardar la parte; si una falla, se avisa en esa foto y el
  resto se guarda.
- Botón principal: «Siguiente: animal 2 de 2» mientras falten animales; en el último, «Siguiente».

Lo que la persona dice del dueño y del chip **queda como declaración**: Zoonosis lo confirma después.
El front no lo trata distinto: se manda como cualquier otra respuesta.

### Pantalla 6 · La denuncia (4 de 4)

«La denuncia» · «La denuncia se hace en Zoonosis del Municipio. Nos sirve saber si la hiciste.»
- **¿Hiciste la denuncia en Zoonosis?**: Sí · No. (Sin «No sé»: es sobre algo que hizo la persona;
  dejarla sin responder vale.)
- **¿Por qué no?** — solo si respondió «No»: El animal es propio o conocido · No sabía dónde denunciar ·
  No sabía que había que denunciar · No me tomaron la denuncia · Razones económicas · No pasa nada
  después con la denuncia · Otros.
- Botón **Enviar y terminar** → guarda y va a Gracias. (Acá no hay «Terminar acá»: es lo mismo.)

## Pantalla 7 · Gracias

«¡Gracias!» · «Guardamos todo lo que nos contaste en la solicitud S-2026-0034. Una persona la va a
revisar.» · «Si hace falta, te vamos a contactar al teléfono o al correo que dejaste.» Sin botones.

Al llegar acá, el front **descarta el token** (aunque no haya vencido): el detallado ya terminó.

## Pantalla 8 · Enlace vencido

Ícono de reloj · «Este enlace ya venció» · «Para cuidar tus datos, el formulario detallado se puede
completar una sola vez y durante una hora. Lo que guardaste hasta acá ya nos llegó.» · «Si querés
agregar algo, comunicate con Zoonosis del Municipio.» Sin botones.

## Token y navegación

- El token **vence del lado del servidor** (~1 h desde que se creó la solicitud). El front **no**
  calcula el vencimiento por su cuenta: lo descubre cuando el back rechaza un guardado. (Puede usar
  `venceEn` solo para mostrar, no para decidir.)
- El token vive **solo en memoria o en `sessionStorage`** de esa pestaña: **nunca** en la URL, ni en
  `localStorage`, ni en cookies persistentes. Al cerrar la pestaña, se pierde y el detallado no se
  puede retomar. Es a propósito (una sola oportunidad).
- Con el token solo se puede **completar esa solicitud**: no se puede leer de vuelta lo que mandó otra
  persona, ni lo que mandó esta en una pestaña anterior.
- Si alguien abre `/reportar/detalle` sin token (recargó, copió la dirección, volvió otro día):
  pantalla 8.
- **Atrás del navegador** dentro del detallado vuelve a la parte anterior con lo que ya cargó (está en
  memoria) y, si lo cambia, se vuelve a guardar al avanzar. Nunca reenvía el formulario inicial.

## Si el enlace vence a mitad de camino

Lo que se guardó en las partes anteriores **ya llegó**. Lo que la persona estaba cargando en la parte
actual **se pierde** (el back lo rechaza). El front muestra la pantalla 8, cuyo texto ya lo dice («Lo
que guardaste hasta acá ya nos llegó»). No hay forma de pedir un enlace nuevo.

## Datos de ejemplo

Para el mock alcanza con simular: el envío inicial (devuelve número y token), un guardado por parte
(devuelve ok), un guardado que falla por red y un guardado con el token vencido (para ver la
pantalla 8), y la geocodificación inversa (devuelve «Kuanip 1240» para cualquier punto de Ushuaia).

Valores para mandar (la forma real la define la API): `ciudad` ∈ ushuaia · rio_grande · tolhuin ·
`tipoLugar` ∈ casa_propia · casa_ajena · via_publica · espacio_publico · zona_rural · no_sabe ·
`quePaso` ∈ mordedura · aranazo · intento_sin_lesion · lesion_al_escapar · no_sabe · `deQuienEs` ∈
propio · ajeno_conocido · ajeno_desconocido · respuestas con escala ∈ si · no · no_sabe. Una pregunta
sin responder **no se manda** (o va `null`): no es lo mismo que `no_sabe`.

## Quién la ve

Cualquiera, sin cuenta. No muestra nada de otros casos ni de otras solicitudes: no hay búsqueda ni
consulta pública.

## Pendiente: no lo implementes todavía

- **Abuso del canal** (alguien que manda miles de solicitudes): rate limiting y CAPTCHA están por
  definirse.
- **Personas sin DNI argentino** (p. ej. turistas): todavía no hay cómo cargarlas.
- **Adjuntar el certificado médico** desde acá: no se diseña por ahora (lo carga Zoonosis).
- Si el cliente acepta pedir el DNI en el formulario público: está por confirmarse. Se diseña con DNI
  obligatorio.
- **«Más de 3» animales:** cuántos fueron en total no se pregunta (la parte del animal se repite solo
  tres veces). Falta definir si se agrega esa pregunta.
