# Vista · Ficha del caso

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03 (corregida el mismo día tras la revisión de
> coherencia).
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Casos**:
  - **«Casos › Ficha del caso · v2»** (nodo `108:5212`): la ficha como la ve Zoonosis (todo).
  - **«Casos › Ficha del caso · v2 · vista Salud»** (nodo `108:5219`): la misma ficha con lo que la API
    no le manda a Salud recortado.
  - Ventanas laterales: **Cambiar estado · v2** (`108:5221`), **Desestimar · v2** (`108:5222`),
    **Anotar denuncia · v2** (`108:5223`), **Agregar animal** (`108:5224`), **Cargar tratamiento**
    (`108:5225`), **Adjuntar documento** (`101:10173`). **Editar** no está en Figma: se especifica acá.
- Piezas, en **Fundamentos**: Dato (`37:208`: Texto · Mono · Sin dato), Archivo adjunto (`37:223`),
  Marca (`4:13`), Estado del caso (`4:29`), Motivo de espera (`4:36`), Organismo, Mensaje (`10:212`),
  Bloque de formulario/Leyenda, Campo (`9:255`), Opción (`9:272`), Casilla (`9:307`), Ventana lateral.
- Ruta: `/casos/:numero` (p. ej. `/casos/C-2026-0418`). No tiene entrada en el menú: se llega desde
  la Bandeja, las listas de trabajo, la búsqueda, Personas, Animales o el mapa.

## Para qué sirve

Todo lo que se sabe de un caso, en una sola pantalla, y el lugar desde donde cada organismo lo
completa con lo suyo. **Es solo lectura**: cada cambio se hace en una ventana lateral.

## Qué cambia respecto de la v1

- Sale el medidor de completitud («38 de 50 campos»): la ficha muestra la **marca Incompleto**.
- Sale la línea de tiempo de auditoría al pie: el historial va en **pantalla propia** (ver
  `historial.md`) y la ficha solo tiene un acceso.
- Entran: contacto responsable, **varios animales** (cada uno con identidad, descripción,
  seguimiento y fotos), tratamiento de Salud, denuncias con estado, lo que declaró la persona,
  solicitudes sumadas, documentos y canal de origen.
- Sale el bloque «Denuncia y seguimiento» de la v1 (D1/D2 sí/no, D4, observaciones): ver los bloques
  *Denuncias* y *Lo que declaró la persona*.

## Estructura (de arriba hacia abajo)

1. **Encabezado:** volver (←) · número del caso (`C-2026-0418`) con sus **marcas** pegadas a la
   derecha del número · debajo, «Tipo de evento · Ciudad · Fecha del hecho» (p. ej. «Ataque con
   mordedura · Ushuaia · 12/09/2026») · nota «Datos de ejemplo» · acciones: **Editar** (secundario),
   **Cambiar estado** (primario), menú `⋮`.
2. **Banda de estado:** píldora de estado (+ motivo de espera si está en seguimiento; «→ C-…» si está
   unificado; motivo si está desestimado; «Un animal no se ubicó» si está finalizado y algún animal
   quedó en «No se ubicó») · chip del organismo que lo registró · «Registrado por M. Acosta ·
   12/09/2026 15:02 · canal de origen: Zoonosis».
3. **Aviso de posible duplicado** (solo si el caso tiene la marca): ver «Marcas y avisos».
4. **Víctima:** P1 nombre y apellido · P2 edad (al momento del hecho) · P6 DNI · P4 teléfono · P3
   correo · P7 domicilio.
5. **Contacto responsable** (solo si existe): «Informó el hecho por la víctima. Opcional: no existe si
   la víctima se registró sola.» Nombre y apellido · DNI · teléfono · correo.
6. **Hecho:** H1 fecha · H2 hora · H3 ciudad · H4 dirección · referencias · H5 tipo de lugar · T1 tipo
   de evento · mapa con el pin y sus coordenadas.
7. **Animales · N** (siempre hay al menos uno: el caso nace con la especie): «Cada animal tiene su
   identidad (especie, chip) y lo que se supo de él en este caso. Dueño, chip, tenencia y seguimiento
   los carga solo Zoonosis.» Un bloque por animal (ver «Animales») y el botón **Agregar animal**.
8. **Tratamiento · Salud:** quién y cuándo lo cargó · fecha de la consulta · L3 zona del cuerpo · L2
   gravedad · L7 vacuna antirrábica · antitetánica · L6 antibiótico · L5 sutura · observaciones. Botón
   **Cargar tratamiento** si no hay, **Editar tratamiento** si hay (solo Salud).
9. **Denuncias · Zoonosis:** «Denuncias anotadas · N»; cada una con número (si hay), fecha de la
   denuncia, **estado** (píldora), DNI de quien la hizo, observaciones y «Anotada por … · fecha hora».
   **No lleva ente** (siempre es Zoonosis). Botón **Anotar denuncia** (solo Zoonosis); cada denuncia
   tiene un menú `⋮` con **Corregir** (solo Zoonosis).
10. **Lo que declaró la persona:** «Lo cargó la persona en el formulario público. Ningún agente lo
    edita; si hay varias solicitudes, gana la más reciente.» D1 ¿Hizo denuncia en Zoonosis? · D3 motivo
    de no denunciar (solo si respondió No; si no, «—») · Solicitudes sumadas (número + «sumada el …» o
    «registrada el …»). Si el caso no tiene solicitudes, D1 y D3 muestran «Sin dato».
11. **Documentos:** «Solo nombre del archivo y dónde está alojado. Las fotos del animal van en cada
    animal.» Los documentos del caso (el certificado médico) · botón **Adjuntar documento**.
12. **Historial · acceso:** «13 cambios · el último, 22/09/2026 10:15 por M. Acosta (Zoonosis
    Ushuaia)» · botón **Ver historial** → `/casos/:numero/historial`.

**Cómo se muestra un dato:** etiqueta con su código de la matriz (P1, H3, A2…) cuando lo tiene; valor
debajo. «Sin dato» va **siempre** con el estilo *Sin dato* (rojo, con ícono de advertencia) y es
distinto de «No sabe», que es un valor común. Fechas, horas, DNI, teléfonos, chip y números de caso,
en mono.

**Un bloque sin datos** (p. ej. un caso sin tratamiento): se muestra el título y una línea «Todavía no
se cargó» con el botón de carga si el usuario puede cargarlo. Un bloque **que la API no manda** (por
permisos) **no se muestra**.

## Marcas y avisos

- Las marcas (Incompleto · Posible duplicado · **Grave**) van pegadas al número, como en la Bandeja.
  **Llegan calculadas por la API.** Grave = algún animal del caso tiene el día 10 en «Murió o
  enfermó»; aparece sola y queda aunque el caso se finalice. Tooltip igual que en la Bandeja.
- **Aviso de posible duplicado** (bloque entre la banda de estado y Víctima, estilo advertencia):
  «La víctima tiene el mismo DNI que en C-2026-0402 (Hospital Regional Ushuaia, registrado el
  12/09/2026 14:50). Revisá los dos casos antes de seguir.» **Sin chips de qué coincide**: la coincidencia es
  solo por el DNI de la víctima. Acciones:
  - **Comparar casos**: va a la comparación (`posibles-duplicados.md`) con **este caso como A**: si se
    consolida, sobrevive el caso desde el que se abrió. Cualquier agente puede consolidar (no hay un
    permiso propio).
  - **No es duplicado**: abre la **misma ventana lateral** que en la comparación — «Son casos
    distintos» con **observación opcional** (p. ej. «otro ataque a la misma persona») · Cancelar ·
    **Guardar**. Al guardar, la coincidencia queda resuelta como *distintos*: la marca y el aviso
    desaparecen y no vuelven para ese par.
- **Grave** no tiene aviso propio en la ficha: alcanza con la marca y con el día 10 «Murió o enfermó»
  en el animal.

## Animales

Un bloque por animal, en el orden en que se cargaron. Encabezado: «Animal 1 · Perro» y debajo
«chip 900 123 456 789 012 · **en 2 casos**» o «sin chip · …». Menú `⋮` del animal: **Editar animal**
(ver «Editar animal»).

- **«en N casos» es un enlace** (color de acento, subrayado). Lleva al **detalle del animal**
  (`Consultas › Animales`), donde están todos sus casos. Si el animal aparece solo en este caso, dice
  «en 1 caso» **sin** enlace. Es **la única forma en que se muestra que dos casos comparten un animal**:
  no hay marca ni lista de «eventos relacionados».
- Secciones del animal:
  - **Identidad y tenencia:** A1 especie · chip · A5 tenencia (Propio · Ajeno conocido · Ajeno
    desconocido · No sabe) · dueño durante el caso (nombre + DNI) · A7 domicilio o zona del animal ·
    A8 vacunado contra la rabia (Sí · No · No sabe).
  - **Descripción:** A2 tamaño · A9 sexo · edad aparente · A13 color · A4 raza · A11 ¿podría
    reconocerlo?
  - **Seguimiento · Zoonosis:** observación del día 10 (valor + fecha + quién) · observaciones.
  - **Fotos del animal:** archivos adjuntos (imagen).
  - **Lo que declaró la persona sobre el animal** (solo para Zoonosis, y solo si una solicitud lo
    trajo): «Según la solicitud S-2026-0031: dueño “Raúl, vecino de Kuanip 1260 · 2901-55-0101”.» El
    chip solo se le pregunta a quien dice que el animal es su mascota; para un ajeno conocido, como
    este, la persona declara el dueño y no el chip. Es texto de referencia: **no se copia** al dueño ni
    al chip. Zoonosis lo confirma cargándolo con **Editar animal** (RN-32: nada escribe en una persona
    sin un agente). En el ejemplo, Zoonosis ya cargó al dueño (Raúl Benítez); la referencia sigue en el
    mock para ver cómo se muestra (ver «Pendiente»).
- **Valores de la observación del día 10:** Pendiente · Sin novedad · Murió o enfermó · Ubicado, sin
  acceso · No se ubicó. «Murió o enfermó» hace que el caso tenga la marca Grave. **Ninguno** hace
  incompleto al caso. Con «Ubicado, sin acceso» o «No se ubicó» el caso se puede finalizar igual.

## Ventanas laterales

Todas: ventana desde la derecha (50 % escritorio, 100 % teléfono), Cancelar a la izquierda, botón de
acción a la derecha **deshabilitado hasta que haya cambios**, errores debajo de cada campo. Al
guardar bien: se cierra, mensaje de **éxito** arriba a la derecha (se cierra solo) y la ficha se
recarga. Si el back rechaza, el error va debajo del campo o, si es general, como mensaje de error en
la ventana (no se cierra solo). Cancelar con cambios pregunta antes de cerrar (igual que Nuevo caso).
**Qué campos trae cada ventana lo deciden los permisos que manda la API** (ver «Quién ve qué»): un
campo que el usuario no puede editar no se muestra en la ventana.

### Editar (datos comunes del caso) — no está en Figma

Se abre con **Editar** del encabezado. La pueden usar **todos los agentes** (Salud, Zoonosis, CADIC).
Mismo patrón visual que Nuevo caso (`nuevo-caso.md`): un bloque con leyenda por grupo.

- **Víctima:** nombre * · apellido * · DNI * · edad (al momento del hecho, en años) · teléfono ·
  correo · domicilio.
- **Contacto responsable:** si hay, sus datos (nombre *, apellido *, DNI *, teléfono, correo) y la
  acción **Quitar contacto responsable** (la persona no se borra: deja de estar en este caso). Si no
  hay, **Agregar contacto responsable**.
- **Hecho:** fecha del hecho · hora · ciudad (Ushuaia · Río Grande · Tolhuin) · ubicación (mapa con
  pin; al soltarlo se propone la dirección, como en el formulario público) · dirección · referencias ·
  tipo de lugar (Casa propia · Casa ajena · Vía pública · Espacio público · Zona rural · No sabe).
- **Tipo de evento** (catálogo que manda la API).
- **Persona compartida:** si la víctima o el contacto están en otros casos, arriba de su bloque va un
  mensaje de información: «Carla Sosa está en 2 casos: el cambio se ve en todos.» (RN-20; queda en el
  historial de la persona).
- Validaciones: las de Nuevo caso (DNI de 7 u 8 dígitos, víctima y contacto con DNI distinto, fecha
  no futura). El **DNI de la víctima no se puede vaciar** (RN-21). Si el DNI nuevo ya es de otra persona
  de SIRAM, el back lo rechaza y el error va debajo del DNI.
- Es la ventana que permite **completar un caso incompleto**: al guardar, la API recalcula la marca.
- No edita: estado (es Cambiar estado), animales, tratamiento, denuncias, documentos ni lo declarado.

### Cambiar estado (`108:5221`)

Encabezado: «Cambiar estado · C-2026-0418 · estado actual: Registrado».
- «Nuevo estado *»: **solo los destinos válidos desde el estado actual** (la lista la manda la API;
  ver tabla). El estado actual no se ofrece.
- Ayudas debajo: «Finalizado: se puede finalizar aunque falten datos; entonces deja de contar como
  incompleto.» · «Solo se ofrecen los estados a los que se puede pasar desde el actual: no se vuelve a
  Registrado. Grave no es un estado: es una marca que sale del día 10 de los animales.» ·
  «Desestimado: abre “Desestimar caso”, que pide el motivo. Unificado no se elige acá: resulta de
  consolidar duplicados.»
- Si se elige **En seguimiento** (o el caso ya está en seguimiento): bloque **Motivo de espera** →
  «¿Qué se está esperando? *» Contacto · Respuesta · Certificado. «Solo existe mientras el caso está en
  seguimiento.» Estando en seguimiento, cambiar solo el motivo también es un cambio válido.
- Si se elige **Desestimado**: la ventana se reemplaza por **Desestimar** (abajo).

| Estado actual | Puede pasar a |
|---|---|
| Registrado | En seguimiento (con motivo) · Finalizado · Desestimado |
| En seguimiento | En seguimiento con otro motivo · Finalizado · Desestimado |
| Finalizado · Desestimado · Unificado | Nada: **Cambiar estado no se muestra** (estados finales, no se reabren) |

Al finalizar o desestimar, el motivo de espera se borra solo. La regla la hace cumplir el back. Lo
cambia cualquier agente; el analista y el administrador no.

### Desestimar (`108:5222`)

Encabezado: «Desestimar caso · C-2026-0418. No se borra: queda desestimado, con su motivo, en el
historial.»
- «¿Por qué se desestima? *»: Fuera de alcance (no fue un ataque de perro o gato a una persona) ·
  Fuera de la provincia · Hecho inexistente o no verificable · Cargado por error. Nota: «Duplicado no
  es un motivo: se consolida. Datos insuficientes tampoco: es la marca Incompleto. Lista tentativa.»
  (La lista la manda la API.)
- Observación (texto libre, opcional).
- Aviso: «Si le faltan datos, sigue marcado como incompleto. Un caso desestimado no cuenta en las
  estadísticas.»
- Botón **Desestimar** (estilo peligro).

### Anotar denuncia (`108:5223`) — solo Zoonosis

Encabezado: «Anotar denuncia · Solo Zoonosis, y solo denuncias hechas en Zoonosis. DNI y fecha
alcanzan para ubicarla en su sistema.»
- DNI de quien la hizo * (mismo formato que en Nuevo caso) · Fecha de la denuncia * (no futura) ·
  Número de trámite (opcional, texto libre, sin validación) · **Estado de la denuncia ***: Pendiente
  de confirmación · Confirmada · Desestimada («Tentativo. P. ej., una denuncia “desglosada y
  devuelta” a las 48 h sin certificado queda desestimada.») · Observaciones (opcional).
- Nota: «El DNI de quien la hizo no se enlaza a ninguna persona de SIRAM: es solo una referencia para
  encontrarla en Zoonosis. Lo que declaró la persona sobre su denuncia es otro dato y no se toca acá.»
- **Corregir una denuncia** (menú `⋮` de la denuncia, solo Zoonosis): esta misma ventana con los datos
  cargados, título «Corregir denuncia». No se borra; la corrección queda en el historial.

### Agregar animal (`108:5224`)

Encabezado: «Agregar animal · C-2026-0418. Si el chip ya existe, se vincula ese animal: su identidad
no se duplica.»
- **Identidad:** especie * (Perro · Gato) · chip (opcional; solo Zoonosis). Si el chip ya está en
  SIRAM, aviso de información con los casos donde ya aparece. P. ej., al cargar el chip
  900 123 456 789 012 en un animal de otro caso: «Este chip ya está en SIRAM. El animal aparece en
  C-2026-0418 y C-2026-0402. Al agregarlo, ese mismo animal queda vinculado también a este caso.»
- **En este caso:** tenencia (opcional; **solo Zoonosis**: Propio · Ajeno conocido · Ajeno
  desconocido · No sabe) · dueño durante el caso (persona, con DNI; **solo Zoonosis**) · domicilio o
  zona del animal · vacunado contra la rabia (Sí · No · No sabe).
- **Descripción:** tamaño · sexo (Macho · Hembra · No sabe) · edad aparente · color · raza ·
  ¿podría reconocerlo? (Sí · No · No sabe).
- **Seguimiento · Zoonosis** (solo Zoonosis): observación del día 10 (Pendiente · Sin novedad · Murió
  o enfermó · Ubicado, sin acceso · No se ubicó; ayuda: «Si murió o enfermó, el caso queda marcado
  Grave. Si no se lo pudo observar (ubicado sin acceso, o no se ubicó), el caso se puede finalizar
  igual.») · observaciones
  (p. ej. «está en un terreno sin acceso»).
- **Fotos del animal:** adjuntar foto.
- **Qué ve cada uno** (la API manda los campos permitidos): **Zoonosis**, todo. **CADIC**: especie,
  domicilio o zona, vacunado y descripción. **Salud**: especie, domicilio o zona y vacunado (no ve la
  descripción). Nota en la ventana: «Dueño, chip, tenencia y seguimiento los carga solo Zoonosis.»

### Editar animal (menú `⋮` del animal)

La misma ventana que Agregar animal, con los datos cargados y título «Editar animal · Animal 1». Cada
organismo edita lo que la API le permite: **todos los agentes**, lo común que ven y la descripción (salvo Salud, que no la ve);
**solo Zoonosis**, además, tenencia, dueño, chip, día 10 y observaciones. Es donde Zoonosis
**confirma** lo que la persona declaró sobre el dueño y el chip, cargándolo en los campos.

### Cargar tratamiento (`108:5225`) — solo Salud

Encabezado: «Tratamiento · Solo Salud. Se liga al caso, no a la persona: así no se mezclan
tratamientos de mordeduras distintas.»
- **Consulta:** fecha de la consulta * · zona del cuerpo · gravedad (Excoriación · Herida superficial ·
  Herida profunda · Amputación).
- **Indicaciones:** vacuna antirrábica · antitetánica · antibiótico · sutura (Sí · No cada una).
  «Vacuna antirrábica: por ahora sí o no. Si registrar el esquema de dosis está por consultar con
  Salud.» · observaciones.
- Nota: «“Recibió atención médica” no se carga: se deduce de que el caso tenga un tratamiento.»
- Botón **Guardar tratamiento**. Hay **un tratamiento por caso**: si ya existe, la misma ventana lo
  edita.

### Adjuntar documento (`101:10173`)

Encabezado: «Adjuntar documento · Se guarda solo el nombre del archivo y la dirección donde está
alojado.»
- ¿A qué se adjunta? *: Al caso (certificado médico) · A un animal del caso (fotos; si se elige, se
  pide cuál). El documento no tiene «tipo»: es certificado si se adjunta al caso, y foto si se adjunta
  a un animal.
- Nombre del archivo * · Dirección donde se aloja (URL) *.
- Nota: «El certificado médico lo carga Zoonosis.»

## Quién ve qué y quién edita qué

**El front muestra lo que llega y no decide por rol.** Si un bloque o un campo no viene en la
respuesta, no se muestra. Si una acción no viene permitida, su botón no se muestra. Lo de abajo es
para orientarte y armar los mocks; las reglas (tentativas) las aplica el back.

| Dato | Salud | Zoonosis | CADIC | Analista |
|---|---|---|---|---|
| Víctima y contacto (nombre, DNI, teléfono, correo) | Ve | Ve | Ve | No |
| Hecho, tipo de evento, estado, marcas | Ve | Ve | Ve | Ve |
| Tratamiento completo | Ve | Solo si existe | Solo si existe | Solo agregados (no en la ficha) |
| Animal: descripción y tenencia | No | Ve | Ve | Ve |
| Animal: dueño y chip | No | Ve | No | No |
| Animal: observación del día 10 | Ve | Ve | Ve | Agregados (no en la ficha) |
| Denuncias | Solo si existe | Ve | Solo si existe | Agregados (no en la ficha) |
| Certificado médico | Ve | Ve | No | No |
| Lo que declaró la persona | Ve | Ve | Ve | Ve |

«Solo si existe» = ve que el dato está, sin el detalle. En pantalla: el bloque muestra una sola línea,
p. ej. *Tratamiento · Salud* → «Recibió atención en Salud» o *Denuncias · Zoonosis* → «Tiene 1
denuncia anotada en Zoonosis. El detalle (DNI de quien la hizo, número, observaciones) lo ve solo
Zoonosis.» «Agregados» = el analista lo ve solo sumado en Estadísticas: en la ficha, ese bloque o ese
dato no viene.

**Edición:**
- **Datos comunes** (hecho, víctima, contacto, estado, animales —especie, domicilio o zona, vacunado— y
  su descripción): cualquier agente, dentro de lo que ve.
- **Tratamiento:** solo Salud.
- **Seguimiento del animal** (día 10, observaciones, dueño, tenencia, chip) y **denuncias:** solo
  Zoonosis.
- **Lo que declaró la persona:** nadie (no tiene botón).
- El **administrador** no ve casos. El **analista** ve la ficha sin datos personales y sin ningún
  botón de edición.

**Vista Salud** (`108:5219`), como referencia: arriba un mensaje de información «Vista de Salud. Lo
que la API no le envía a Salud no se muestra: dueño, chip, descripción y fotos de los animales, y el
detalle de la denuncia.» (ese mensaje es **solo para Figma**: en la app no se muestra). Cada animal
lleva solo especie, A7, A8 y el seguimiento, con la nota «Salud ve la observación del día 10 porque
puede cambiar el tratamiento antirrábico de la víctima.»

## Datos de ejemplo

La forma real la define la API. Ejemplo para `src/mocks/` (C-2026-0418, como lo ve Zoonosis; es la
historia común de todas las fichas):

```json
{
  "numero": "C-2026-0418",
  "estado": "registrado",
  "motivoEspera": null,
  "unificadoEn": null,
  "motivoDesestimacion": null,
  "animalNoUbicado": false,
  "marcas": ["incompleto", "duplicado"],
  "faltantes": ["tipoLugar"],
  "coincidencia": { "numero": "C-2026-0402", "organismo": "Hospital Regional Ushuaia", "registradoEl": "2026-09-12T14:50" },
  "canalOrigen": "zoonosis",
  "registro": { "organismo": "Zoonosis Ushuaia", "por": "M. Acosta", "fecha": "2026-09-12T15:02" },
  "victima": { "nombre": "Micaela", "apellido": "Sosa", "dni": "58412336", "edad": 7, "telefono": null, "correo": null, "domicilio": "Kuanip 1240, Ushuaia", "enCasos": 2 },
  "contactoResponsable": { "nombre": "Carla", "apellido": "Sosa", "dni": "32114887", "telefono": "2901-54-8820", "correo": null, "enCasos": 2 },
  "fechaHecho": "2026-09-12",
  "horaHecho": "14:20",
  "lugar": { "ciudad": "Ushuaia", "direccion": "Kuanip 1240", "referencias": "Frente a la plaza, casa de rejas verdes", "latitud": -54.8069, "longitud": -68.3073 },
  "tipoLugar": null,
  "tipoEvento": "Ataque con mordedura",
  "animales": [
    {
      "especie": "perro", "chip": "900123456789012", "enCasos": 2,
      "tenencia": "ajeno_conocido", "dueno": { "nombre": "Raúl", "apellido": "Benítez", "dni": "25300114" },
      "zona": "Kuanip al 1200", "vacunado": "no_sabe",
      "descripcion": { "tamano": "mediano", "sexo": "macho", "edadAparente": "adulto", "color": "Negro con manchas blancas", "raza": "Mestizo", "podriaReconocerlo": "si" },
      "dia10": { "valor": "sin_novedad", "fecha": "2026-09-22", "por": "M. Acosta" },
      "observaciones": "Está dentro de un terreno con acceso limitado.",
      "declaradoEnSolicitud": { "solicitud": "S-2026-0031", "dueno": "Raúl, vecino de Kuanip 1260 · 2901-55-0101" },
      "fotos": [{ "nombre": "perro-01.jpg", "url": "https://…" }, { "nombre": "perro-02.jpg", "url": "https://…" }]
    },
    {
      "especie": "perro", "chip": null, "enCasos": 1,
      "tenencia": "ajeno_desconocido", "dueno": null, "zona": null, "vacunado": null,
      "descripcion": { "tamano": "grande", "sexo": "no_sabe", "edadAparente": "adulto", "color": "Marrón", "raza": null, "podriaReconocerlo": "no_sabe" },
      "dia10": { "valor": "no_ubicado", "fecha": "2026-09-22", "por": "M. Acosta" },
      "observaciones": "Se recorrió la zona dos veces sin ubicarlo.",
      "declaradoEnSolicitud": null,
      "fotos": []
    }
  ],
  "tratamiento": { "organismo": "Hospital Regional Ushuaia", "por": "L. Puig", "cargadoEl": "2026-09-13T09:12", "fechaConsulta": "2026-09-12", "zonaCuerpo": "piernas", "gravedad": "herida_superficial", "antirrabica": true, "antitetanica": true, "antibiotico": true, "sutura": false, "observaciones": "Se indicó el esquema antirrábico; control en 72 h." },
  "denuncias": [{ "numero": "ZU-2026-1180", "fecha": "2026-09-12", "estado": "confirmada", "dniDenunciante": "32114887", "observaciones": "Se presentó la madre con el certificado médico.", "anotadaPor": "M. Acosta", "anotadaEn": "2026-09-12T15:05" }],
  "declarado": { "hizoDenuncia": "si", "motivoNoDenuncia": null, "solicitudes": [{ "numero": "S-2026-0031", "sumadaEl": "2026-09-12T15:10" }] },
  "documentos": [{ "nombre": "certificado-medico.pdf", "url": "https://…", "cargadoPor": "Zoonosis Ushuaia", "fecha": "2026-09-13T10:00" }],
  "historial": { "cambios": 13, "ultimo": { "fecha": "2026-09-22T10:15", "por": "M. Acosta", "organismo": "Zoonosis Ushuaia" } },
  "permisos": ["editar", "cambiar_estado", "agregar_animal", "editar_animal", "anotar_denuncia", "adjuntar_documento"]
}
```

- **Por qué es incompleto:** le falta el **tipo de lugar** (`tipoLugar: null`, `faltantes`). Lo demás
  que cuenta para la marca está cargado.
- **La solicitud S-2026-0034** (pendiente, enviada el 13/09 por Carla Sosa) todavía **no** está sumada:
  no aparece en esta ficha (está en la cola de Solicitudes).
- `declaradoEnSolicitud` (por animal), cuando hay: `{ "solicitud": "S-…", "dueno": "texto libre",
  "tieneChip": "si|no|no_sabe", "chip": "…" }`; `tieneChip` y `chip` solo vienen si la persona dijo
  que el animal es su mascota. Solo lo recibe Zoonosis.
- Los datos son «al 25/09/2026»: la última modificación (22/09 10:15, M. Acosta) es la carga del día 10
  del animal 2. El certificado médico lo adjuntó Zoonosis el 13/09 a las 10:00.
- Cada valor ausente (`null`) se muestra «Sin dato». Un bloque que no viene (`tratamiento` ausente,
  no `null`) es que la API no lo manda para ese usuario: no se muestra.
- Para la vista Salud, el mismo caso sin `dueno`, `chip`, `tenencia`, `descripcion` ni `fotos` en los
  animales, y con `denuncias` reemplazado por `"denunciasCantidad": 1`.
- Los enumerados van en `snake_case` (`herida_superficial`, `no_sabe`, `no_ubicado`, `mediano`,
  `piernas`); el texto en pantalla, con mayúscula inicial y sin guiones. Color y raza son texto libre.

## Pendiente: no lo implementes todavía

- **Esquema de la vacuna antirrábica** (dosis y fechas): hoy es sí/no.
- El criterio exacto para **Finalizar** (hoy no tiene condiciones).
- **Personas sin DNI argentino** (víctima, dueño o denunciante extranjero).
- **Persona que ya existe al editar:** si el DNI que se carga en Editar ya es de otra persona, hoy el
  back lo rechaza; si en cambio hay que ofrecer «usar esa persona», está por definirse con el back.
- **Agregar animal con un chip que ya es de un animal de este mismo caso:** qué responde la ventana no
  está definido.
- **Lo declarado sobre el animal después de confirmarlo:** si la referencia «Según la solicitud S-…»
  sigue a la vista una vez que Zoonosis cargó el dueño o el chip, o deja de mostrarse.
