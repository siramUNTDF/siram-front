# Vista · Ficha del caso

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Casos**:
  - **«Casos › Ficha del caso · v2»** (nodo `108:5212`): la ficha como la ve Zoonosis (todo).
  - **«Casos › Ficha del caso · v2 · vista Salud»** (nodo `108:5219`): la misma ficha con lo que la API
    no le manda a Salud recortado.
  - Ventanas laterales: **Cambiar estado · v2** (`108:5221`), **Desestimar · v2** (`108:5222`),
    **Anotar denuncia · v2** (`108:5223`), **Agregar animal** (`108:5224`), **Cargar tratamiento**
    (`108:5225`), **Adjuntar documento** (`101:10173`).
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
  solicitudes vinculadas, documentos y canal de origen.
- Sale el bloque «Denuncia y seguimiento» de la v1 (D1/D2 sí/no, D4, observaciones): ver los bloques
  *Denuncias* y *Lo que declaró la persona*.

## Estructura (de arriba hacia abajo)

1. **Encabezado:** volver (←) · número del caso (`C-2026-0418`) con sus **marcas** pegadas a la
   derecha del número · debajo, «Tipo de evento · Ciudad · Fecha del hecho» (p. ej. «Ataque con
   mordedura · Ushuaia · 12/09/2026») · nota «Datos de ejemplo» · acciones: **Editar** (secundario),
   **Cambiar estado** (primario), menú `⋮`.
2. **Banda de estado:** píldora de estado (+ motivo de espera si está en seguimiento; «→ C-…» si está
   unificado) · chip del organismo que lo registró · «Registrado por M. Acosta · 12/09/2026 15:02 ·
   canal de origen: Zoonosis».
3. **Aviso de posible duplicado** (solo si el caso tiene la marca): ver «Avisos».
4. **Víctima:** P1 nombre y apellido · P2 edad · P6 DNI · P4 teléfono · P3 correo · P7 domicilio.
5. **Contacto responsable** (solo si existe): «Informó el hecho por la víctima. Opcional: no existe si
   la víctima se registró sola.» Nombre y apellido · DNI · teléfono · correo.
6. **Hecho:** H1 fecha · H2 hora · H3 ciudad · H4 dirección · referencias · H5 tipo de lugar · T1 tipo
   de evento · mapa con el pin y sus coordenadas.
7. **Animales · N:** «Cada animal tiene su identidad (especie, chip) y lo que se supo de él en este
   caso. Dueño, chip y seguimiento los carga solo Zoonosis.» Un bloque por animal (ver «Animales») y
   el botón **Agregar animal**.
8. **Tratamiento · Salud:** quién y cuándo lo cargó · fecha de la consulta · L3 zona del cuerpo · L2
   gravedad · L7 vacuna antirrábica · antitetánica · L6 antibiótico · L5 sutura · observaciones. Botón
   **Cargar tratamiento** si no hay, **Editar tratamiento** si hay (solo Salud).
9. **Denuncias · Zoonosis:** «Denuncias anotadas · N»; cada una con ente, número (si hay), fecha,
   **estado** (píldora), DNI de quien la hizo, observaciones y «Anotada por … · fecha hora». Botón
   **Anotar denuncia** (solo Zoonosis).
10. **Lo que declaró la persona:** «Lo cargó la persona en el formulario público. Ningún agente lo
    edita; si hay varias solicitudes, gana la más reciente.» D1 ¿Hizo denuncia en Zoonosis? · D3 motivo
    de no denunciar («Solo si respondió No») · Solicitudes (números, con «Registrada el …»).
11. **Documentos:** «Solo nombre del archivo y dónde está alojado. Las fotos del animal van en cada
    animal.» X1 certificado médico (archivo adjunto) · botón **Adjuntar documento**.
12. **Historial · acceso:** «5 cambios · el último, 13/09/2026 09:12 por L. Puig (Hospital Regional
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
- **Aviso de posible duplicado** (bloque entre la banda de estado y Víctima, estilo advertencia): «Se
  detectó un caso con datos coincidentes. El caso C-2026-0402 (Hospital Regional Ushuaia, 13/09/2026)
  comparte datos con este. Revisá ambos antes de seguir.» Chips con lo que coincide (DNI de la
  víctima; si coinciden, también teléfono y fecha del hecho) · **Comparar casos** (va a la comparación
  en Posibles duplicados) · **No es duplicado** (resuelve la coincidencia como «casos distintos» sin
  pasar por la comparación; pide confirmar en un diálogo corto; la marca y el aviso desaparecen).
- **Grave** no tiene aviso propio en la ficha: alcanza con la marca y con el día 10 «Murió o enfermó»
  en el animal.

## Animales

Un bloque por animal, en el orden en que se cargaron. Encabezado: «Animal 1 · Perro» y debajo
«chip 900 123 456 789 012 · **en 2 casos**» o «sin chip · …».

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
- **Valores de la observación del día 10:** Pendiente · Sin novedad · Murió o enfermó · No se pudo
  observar. «Murió o enfermó» hace que el caso tenga la marca Grave. «No se pudo observar» (nunca se
  ubicó) **no** hace incompleto al caso.
- Editar un animal ya cargado: mismo formulario que **Agregar animal**, con los datos cargados (se abre
  desde el menú `⋮` del bloque del animal).

## Ventanas laterales

Todas: ventana desde la derecha (50 % escritorio, 100 % teléfono), Cancelar a la izquierda, botón de
acción a la derecha **deshabilitado hasta que haya cambios**, errores debajo de cada campo. Al
guardar bien: se cierra, mensaje de **éxito** arriba a la derecha (se cierra solo) y la ficha se
recarga. Si el back rechaza, el error va debajo del campo o, si es general, como mensaje de error en
la ventana (no se cierra solo). Cancelar con cambios pregunta antes de cerrar (igual que Nuevo caso).

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

Al finalizar o desestimar, el motivo de espera se borra solo. La regla la hace cumplir el back.

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
- Una denuncia ya anotada se **corrige** desde el menú `⋮` de la denuncia con este mismo formulario
  (no se borra).

### Agregar animal (`108:5224`)

Encabezado: «Agregar animal · C-2026-0418. Si el chip ya existe, se vincula ese animal: su identidad
no se duplica.»
- **Identidad:** especie * (Perro · Gato) · chip (opcional). Si el chip ya está en SIRAM, aviso de
  información: «Este chip ya está en SIRAM. El animal aparece en C-2026-0402. Al agregarlo, ese mismo
  animal queda vinculado también a este caso.»
- **En este caso:** tenencia * (Propio · Ajeno conocido · Ajeno desconocido · No sabe) · dueño durante
  el caso (persona, con DNI) · domicilio o zona del animal · vacunado contra la rabia (Sí · No · No sabe).
- **Descripción:** tamaño · sexo (Macho · Hembra · No sabe) · edad aparente · color · raza ·
  ¿podría reconocerlo? (Sí · No · No sabe).
- **Seguimiento · Zoonosis:** observación del día 10 (Pendiente · Sin novedad · Murió o enfermó · No
  se pudo observar; ayuda: «Si murió o enfermó, el caso queda marcado Grave. Si nunca se ubica, queda
  “No se pudo observar” y el caso se puede finalizar igual.» — **Figma todavía dice “puede finalizar
  incompleto”: usá este texto**) · observaciones (p. ej. «está en un terreno sin acceso»).
- **Fotos del animal:** adjuntar foto.
- Nota: «Dueño, chip y seguimiento los carga solo Zoonosis. Cualquier agente puede agregar el animal y
  su descripción.» Para quien no es Zoonosis, esos campos **no se muestran** (la API no los permite).

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
  pide cuál).
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
| Tratamiento completo | Ve | Solo si existe | Solo si existe | No (solo agregados en estadísticas) |
| Animal: descripción y tenencia | No | Ve | Ve | Ve |
| Animal: dueño y chip | No | Ve | No | No |
| Animal: observación del día 10 | Ve | Ve | Ve | No |
| Denuncias | Solo si existe | Ve | Solo si existe | No |
| Certificado médico | Ve | Ve | No | No |
| Lo que declaró la persona | Ve | Ve | Ve | Ve |

«Solo si existe» = ve que el dato está, sin el detalle. En pantalla: el bloque muestra una sola línea,
p. ej. *Tratamiento · Salud* → «Recibió atención en Salud» o *Denuncias · Zoonosis* → «Tiene 1
denuncia anotada en Zoonosis. El detalle (DNI de quien la hizo, número, observaciones) lo ve solo
Zoonosis.»

**Edición:**
- **Datos comunes** (hecho, víctima, contacto, estado, animales y su descripción): cualquier agente.
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

La forma real la define la API. Ejemplo para `src/mocks/` (C-2026-0418, como lo ve Zoonosis):

```json
{
  "numero": "C-2026-0418",
  "estado": "registrado",
  "motivoEspera": null,
  "unificadoEn": null,
  "motivoDesestimacion": null,
  "marcas": ["incompleto", "duplicado"],
  "coincidencia": { "numero": "C-2026-0402", "organismo": "Hospital Regional Ushuaia", "fecha": "2026-09-13", "coinciden": ["dni", "telefono", "fechaHecho"] },
  "canalOrigen": "ciudadano",
  "registro": { "organismo": "Zoonosis Ushuaia", "por": "M. Acosta", "fecha": "2026-09-13T22:05" },
  "victima": { "nombre": "Micaela Sosa", "edad": 7, "dni": "58412336", "telefono": null, "correo": null, "domicilio": "Kuanip 1240, Ushuaia" },
  "contactoResponsable": { "nombre": "Carla Sosa", "dni": "32114887", "telefono": "2901-54-8820", "correo": null },
  "hecho": { "fecha": "2026-09-12", "hora": "14:20", "ciudad": "Ushuaia", "direccion": "Kuanip 1240", "referencias": "Frente a la plaza, casa de rejas verdes", "tipoLugar": "Vía pública", "tipoEvento": "Ataque con mordedura", "latitud": -54.8069, "longitud": -68.3073 },
  "animales": [
    {
      "especie": "perro", "chip": "900123456789012", "enCasos": 2,
      "tenencia": "ajeno_conocido", "dueno": { "nombre": "Raúl Benítez", "dni": "25300114" },
      "zona": "Kuanip al 1200", "vacunado": "no_sabe",
      "descripcion": { "tamano": "Mediano", "sexo": "Macho", "edadAparente": "Adulto", "color": "Negro con manchas blancas", "raza": "Mestizo", "podriaReconocerlo": "si" },
      "dia10": { "valor": "sin_novedad", "fecha": "2026-09-22", "por": "M. Acosta" },
      "observaciones": "Está dentro de un terreno con acceso limitado.",
      "fotos": [{ "nombre": "perro-01.jpg", "url": "https://…" }]
    },
    {
      "especie": "perro", "chip": null, "enCasos": 1,
      "tenencia": "ajeno_desconocido", "dueno": null, "zona": null, "vacunado": null,
      "descripcion": { "tamano": "Grande", "sexo": "no_sabe", "edadAparente": "Adulto", "color": "Marrón", "raza": null, "podriaReconocerlo": "no_sabe" },
      "dia10": { "valor": "no_se_pudo_observar", "fecha": "2026-09-22", "por": "M. Acosta" },
      "observaciones": "Se recorrió la zona dos veces sin ubicarlo.",
      "fotos": []
    }
  ],
  "tratamiento": { "organismo": "Hospital Regional Ushuaia", "por": "L. Puig", "fechaConsulta": "2026-09-14", "zonaCuerpo": "Pierna izquierda", "gravedad": "Herida superficial", "antirrabica": true, "antitetanica": true, "antibiotico": true, "sutura": false, "observaciones": "Se indicó el esquema antirrábico; control en 72 h." },
  "denuncias": [{ "ente": "Zoonosis Ushuaia", "numero": "ZU-2026-1180", "fecha": "2026-09-14", "estado": "confirmada", "dniDenunciante": "32114887", "observaciones": "Se presentó la madre con el certificado médico.", "anotadaPor": "M. Acosta", "anotadaEn": "2026-09-14T10:05" }],
  "declarado": { "hizoDenuncia": "no", "motivoNoDenuncia": "No sabía dónde denunciar", "solicitudes": [{ "numero": "S-2026-0034", "registradaEl": "2026-09-13" }] },
  "documentos": [{ "tipo": "certificado_medico", "nombre": "certificado-medico.pdf", "url": "https://…", "cargadoPor": "Zoonosis Ushuaia", "fecha": "2026-09-14" }],
  "historial": { "cambios": 5, "ultimo": { "fecha": "2026-09-14T09:12", "por": "L. Puig", "organismo": "Hospital Regional Ushuaia" } },
  "permisos": ["editar", "cambiar_estado", "agregar_animal", "anotar_denuncia", "adjuntar_documento", "editar_seguimiento"]
}
```

- **Ojo con el ejemplo de Figma:** tiene fechas que no cierran entre sí (el caso dice «registrado el
  12/09 15:02» pero nace de una solicitud enviada el 13/09 21:40, y el tratamiento y la denuncia son
  del 12/09). El JSON de arriba ya las corrige: usá esas.
- Cada valor ausente (`null`) se muestra «Sin dato». Un bloque que no viene (`tratamiento` ausente,
  no `null`) es que la API no lo manda para ese usuario: no se muestra.
- Para la vista Salud, el mismo caso sin `dueno`, `chip`, `descripcion` ni `fotos` en los animales,
  y con `denuncias` reemplazado por `"denunciasCantidad": 1`.

## Pendiente: no lo implementes todavía

- **Editar** los datos comunes del caso: la ventana no está diseñada en la v2. El botón se muestra
  deshabilitado con tooltip «En diseño».
- **Esquema de la vacuna antirrábica** (dosis y fechas): hoy es sí/no.
- El criterio exacto para **Finalizar** (hoy no tiene condiciones).
- **Personas sin DNI argentino** (dueño o denunciante extranjero).
