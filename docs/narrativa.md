# SIRAM: narrativa de uso

> Lo entrega el agente de diseño (repo `../proyecto`). No lo edites desde el front: si algo no
> cierra, avisá al usuario. Última actualización: 2026-11-10 (§7, qué significa cada valor). Reescrita entera el
> 2026-11-03; reemplaza la del 2026-10-08.
>
> Este documento cuenta **qué hace el usuario y qué ve**. No describe el modelo de datos: los datos
> llegan por la API, y las dudas sobre su forma se resuelven con el back. Lo visual está en Figma y el
> detalle de cada pantalla, en su ficha de `vistas/`. Si la historia o el vocabulario de esta narrativa
> no coinciden con una ficha, gana la ficha. **Las reglas de negocio de abajo no las pisa nadie:** ni
> una ficha ni Figma.

---

## Reglas de negocio (obligatorias)

Estas reglas salen de `CONTEXTO.md` del repo de diseño (los números RN-xx son los de ese documento).
**Toda pantalla las cumple.** Una ficha de vista puede detallarlas, pero nunca contradecirlas: si una
ficha (o Figma) parece ir contra una de estas reglas, **no elijas vos: avisale al usuario.** Antes de
dar una vista por terminada, revisá que cumple todas las que le tocan.

| RN | Regla | Qué significa en pantalla |
|---|---|---|
| RN-01 | Ningún organismo domina | El organismo es un dato (chip, columna, filtro). Nunca un color, un logo ni una marca del sistema. |
| RN-05 · RN-08 · RN-31 | Caso ≠ solicitud ≠ denuncia | Lo que manda un ciudadano es una **solicitud**, nunca un caso. Una solicitud no escribe en un caso ni en una persona sin que un agente la registre. |
| RN-06 | La denuncia solo la anota Zoonosis, en un caso que ya existe | No hay denuncias sueltas ni pantalla de denuncias. Solo Zoonosis ve el botón de anotar. |
| RN-06b | En SIRAM no se borra nada | No hay botón de borrar casos, solicitudes, denuncias, personas, animales ni usuarios. La baja de un caso es *Desestimado*; un usuario se *desactiva*; una solicitud se *descarta* (y queda guardada). |
| RN-07 | Lo declarado por la persona no se edita | «¿Hizo denuncia?» y su motivo vienen de la solicitud. Ningún formulario de agente los carga ni los cambia. |
| RN-09 · RN-36 | Estados y transiciones | Estados: registrado · en seguimiento · finalizado · desestimado · unificado. Finalizado, desestimado y unificado **no se reabren**; no se vuelve a registrado; unificado solo resulta de consolidar; desestimar pide motivo. Se ofrecen solo los cambios válidos. |
| RN-10 | Motivo de espera solo en *En seguimiento* | Pasar a *En seguimiento* exige elegir motivo; en cualquier otro estado no se muestra. |
| RN-11 · RN-12 | Tres indicadores separados | Estado (píldora), motivo de espera y marcas (incompleto · posible duplicado · grave) **nunca** van juntos en un mismo campo ni componente. Las marcas llegan calculadas: el front no las deduce. |
| RN-14 · RN-15 | Consolidar es irreversible y nunca automático | Exige una confirmación explícita marcada por la persona antes de habilitar el botón. Nada se fusiona solo. |
| RN-19 | Al consolidar o sumar una solicitud, campo por campo | Si un lado tiene el dato y el otro no, se conserva el que lo tiene; si chocan, elige el agente. |
| RN-20 | Una víctima por caso; la persona es única por DNI | Dos víctimas del mismo ataque son dos casos. Editar una persona cambia todos sus casos (y hay que decirlo). |
| RN-21 · RN-30 | DNI obligatorio; lo demás según el canal | Todo formulario de alta exige DNI. Qué más es obligatorio depende del canal (tabla en `vistas/nuevo-caso.md` y `vistas/formulario-publico.md`). |
| RN-23 | «No sabe» ≠ «Sin dato» | Se muestran distinto y se cuentan aparte. «Sin dato» va en rojo. Toda pregunta con escala ofrece «No sé»/«No sabe». |
| RN-28 | Estadísticas y listas de trabajo: solo casos vigentes | Ni desestimados ni unificados en Inicio, Estadísticas, Mapa, Incompletos ni Posibles duplicados. La Bandeja («Todos») sí muestra todo. |
| RN-29 | Datos sensibles al mínimo | DNI y contacto solo donde hacen falta (detalle, no listas). Exportar datos personales, solo los roles que pueden, con aviso. |
| RN-32 | Formulario detallado del ciudadano: una sola vez | Token aleatorio que vence en el servidor; nunca en la URL; nunca el número de solicitud o de caso como llave. |
| RN-34 · RN-22 | Cada organismo carga lo suyo | Tratamiento: solo Salud. Seguimiento del animal (día 10, observaciones, dueño, tenencia, chip) y denuncias: solo Zoonosis. Cualquier agente agrega un animal con su especie y su descripción, dentro de lo que ve (Salud no ve la descripción). |
| RN-35 | Los permisos los aplica el servidor | El front muestra lo que llega y no decide por rol: si un dato o una acción no vienen, no se muestran. Esconder algo solo en pantalla no lo protege. |

## 1. La historia

1. Un perro o un gato ataca a una persona. Puede haber lesión o no: también se registran los
   intentos de ataque y las lesiones derivadas (p. ej. una caída al huir).
2. El hecho entra a SIRAM por uno de **cuatro canales**: Salud, Zoonosis, CADIC o el **canal
   ciudadano** (un formulario público). Todos empiezan con el mismo **formulario inicial**, corto a
   propósito: nombre, apellido, DNI, teléfono, correo, especie del animal, fecha del hecho y
   **ciudad** (Ushuaia · Río Grande · Tolhuin, sin «Otra»). Qué es obligatorio depende del canal,
   salvo la ciudad, que es obligatoria en los cuatro: ningún caso ni solicitud nace sin ciudad.
3. **Si lo carga un agente de un organismo, es un caso.** **Si lo carga un ciudadano, es una
   solicitud**: lo que declaró la persona, tal cual, a la espera de que un agente la revise.
4. Después de enviar, el ciudadano puede seguir con un **formulario detallado** opcional, en cuatro
   partes (dónde fue, qué pasó, cómo era el animal, la denuncia). Cada parte se guarda al pasar a la
   siguiente. Es **una sola oportunidad**: el enlace vence en una hora y después solo los organismos
   agregan datos.
5. Un agente **de Zoonosis** revisa la solicitud: la **descarta** o la **registra**, creando un caso nuevo o
   **sumándola a un caso que ya existe**. Nada de lo que manda un ciudadano llega a un caso sin un
   agente de por medio.
6. Cada organismo completa el caso con lo suyo: **Salud** carga la atención de la víctima
   (tratamiento); **Zoonosis**, el seguimiento de cada animal (la observación del día 10) y las
   denuncias; **CADIC** completa los datos comunes. Si faltan datos de contacto, alguien busca a la
   persona por DNI y el caso queda **En seguimiento · Esperando contacto** mientras tanto.
7. La **denuncia** es un trámite oficial ante Zoonosis, fuera de SIRAM. Si existe, **Zoonosis la
   anota en el caso**. Aparte, el caso guarda lo que la persona declaró en su solicitud: si hizo la
   denuncia y, si no, por qué.
8. Con los casos se arman el panel de inicio, las estadísticas, el mapa y las exportaciones.

## 2. Vocabulario de pantalla

| Término | Qué es | Lo que no es |
|---|---|---|
| **Caso** (`C-2026-0418`) | El incidente: un ataque a **una** persona (dos víctimas del mismo ataque son dos casos). Es lo único que SIRAM gestiona: se registra, se sigue, se completa y se cuenta. | No es una denuncia ni una solicitud. |
| **Solicitud** (`S-2026-0034`) | Lo que mandó un ciudadano por el formulario público, tal cual. Estados: pendiente · registrada · descartada. | No es un caso. Nunca se borra (descartar no borra). |
| **Canal de origen** | Por dónde entró el caso: ciudadano · salud · zoonosis · cadic · histórico (registros viejos cargados a mano). | No es el organismo que lo registró (ese es otro dato). |
| **Víctima** | La persona atacada. Una por caso. | — |
| **Contacto responsable** | Quien informó por la víctima (p. ej. la madre por su hija) y a quien se llama. Opcional. | No se guarda la relación entre los dos. |
| **Animal** | Un perro o un gato con identidad propia (especie y, si tiene, chip). **Un caso puede tener varios animales**, y un mismo animal puede aparecer en varios casos. | — |
| **Observación del día 10** | Lo que Zoonosis registra de cada animal a los diez días: pendiente · sin novedad · murió o enfermó · ubicado, sin acceso · no se ubicó. Ninguno hace incompleto al caso; «murió o enfermó» lo marca Grave. | — |
| **Tratamiento** | La atención de la víctima que carga Salud. «Recibió atención médica» **no se pregunta**: se deduce de que exista. | — |
| **Denuncia** | Un trámite hecho en Zoonosis, anotado en el caso por Zoonosis: DNI de quien la hizo, fecha, número (si lo hay) y estado. | No tiene pantalla propia ni existe fuera de un caso. |
| **Lo que declaró la persona** | «¿Hizo denuncia?» y «motivo de no denunciar», tal como los respondió en su solicitud. | Nadie los edita, y no es lo mismo que una denuncia anotada. |
| **Posible duplicado** | Dos casos cuya víctima tiene **el mismo DNI**. Un agente decide si son el mismo hecho cargado dos veces o dos ataques distintos. | — |
| **Consolidar** | Fundir dos casos duplicados en uno, eligiendo campo por campo. **Irreversible.** El absorbido queda *Unificado* y apunta al que sobrevive. | — |
| **No sabe / Sin dato** | «No sabe»: la persona respondió que no sabe. «Sin dato»: no se preguntó o no se respondió. «Sin dato» se muestra en rojo. | Nunca se muestran igual. |

Términos que **ya no existen** (si los ves en algún lado, están viejos): *evento relacionado* como
marca o lista, *vincular*, *motor de coincidencias* con puntaje y señales, *pendientes de
validación*, *sin confirmar*, *confirmado*, *grave* como estado, *auditoría* (ahora es *historial*).

## 3. Cómo se muestra un caso

> Qué significa cada estado, motivo y marca: §7.

Un caso tiene **tres indicadores independientes**. Nunca se juntan en un solo campo ni en un solo
componente.

| Indicador | Valores | En pantalla |
|---|---|---|
| **Estado** (uno solo) | Registrado · En seguimiento · Finalizado · Desestimado · Unificado en otro caso | Píldora en su propia columna. Un caso nace *Registrado*. |
| **Motivo de espera** (solo en *En seguimiento*) | Esperando contacto · respuesta · certificado | Debajo del estado. |
| **Marcas** (pueden ser varias) | Incompleto · Posible duplicado · **Grave** | Íconos pegados al número de caso, a la izquierda. |

- **Las marcas llegan calculadas por la API.** El front no decide cuándo un caso es incompleto,
  grave o posible duplicado.
- **Grave**: algún animal del caso murió o enfermó en la observación del día 10. Nadie la pone a mano
  y **sigue aunque el caso se finalice**. Pide atención especial al tratamiento de la víctima.
- **Incompleto**: le falta algún dato del caso. Los datos de los animales **no** cuentan: un perro que
  nunca se ubicó no hace incompleto al caso.
- **Cambios de estado posibles**: Registrado → En seguimiento, Finalizado o Desestimado · En
  seguimiento → (otro motivo de espera), Finalizado o Desestimado. **Finalizado, Desestimado y
  Unificado no se reabren.** Unificado no se elige: resulta de consolidar. Desestimar pide un motivo.
  La regla la hace cumplir el back; el front ofrece solo lo que vale.
- **En SIRAM no se borra nada.** La «baja» de un caso es *Desestimado*; un usuario se desactiva.

## 4. Quién ve qué

**Las reglas viven en el servidor. El front muestra lo que llega y no decide por rol:** si un dato
no vino, la sección o la columna no se muestra (o muestra solo lo que llegó). Esconder algo solo en
pantalla no lo protege.

Para orientarte (las reglas son tentativas y las aplica el back):
- **Agentes** (Salud, Zoonosis, CADIC): ven todos los casos. **Las solicitudes, solo Zoonosis**
  (2026-11-06): a Salud y CADIC la API no se las devuelve.
  - Salud **no** recibe dueño, chip, tenencia, descripción ni fotos de los animales, ni el detalle de
    las denuncias (solo «tiene 1 denuncia anotada»).
  - CADIC no recibe dueño ni chip, ni el certificado médico, ni el detalle del tratamiento ni el de
    las denuncias (solo que existen).
  - Zoonosis no recibe el detalle del tratamiento (solo que existe).
- **Analista / comité** (rol `analista`, que en pantalla se llama «Consulta»; no tiene organismo):
  casos **sin datos personales**; busca, ve estadísticas y exporta. No edita.
- **Administrador**: no ve casos; solo usuarios, organismos y tipos de evento.

Lo mismo con **editar**: los datos comunes los edita cualquier agente; el tratamiento, solo Salud;
el seguimiento de los animales y las denuncias, solo Zoonosis; lo declarado por la persona, nadie.
La API va a decir qué puede editar cada uno; el front no lo deduce.

## 5. Pantallas

Cada una tiene su ficha en `vistas/` (la lista está en `README.md`). Acá va solo para qué sirve.

**Inicio.** El panel de quien entra a trabajar. Arriba, «Para resolver hoy», ordenado por lo que
frena el registro: casos incompletos, esperando contacto y graves; después solicitudes pendientes y
posibles duplicados; después los casos en seguimiento. Debajo, el panorama del año (casos por mes,
zona del cuerpo, franja etaria, canal de origen). Todo sobre casos **vigentes**.

**Casos**
- **Bandeja** — todos los casos, en cualquier estado, ordenados por última modificación. Ficha:
  `vistas/bandeja.md`.
- **Nuevo caso** — el formulario inicial en una ventana lateral. Si el DNI de la víctima ya está en
  otro caso, **avisa antes de guardar**. Ubicación, animales, tratamiento y denuncia se completan
  después, en la ficha del caso. Ficha: `vistas/nuevo-caso.md`.
- **Solicitudes** — la cola de lo que mandaron los ciudadanos. Al revisar una: descartar, registrar
  como caso nuevo o sumar a un caso existente (eligiendo campo por campo cuando los datos chocan).
- **Posibles duplicados** — lista de trabajo. Al abrir uno se comparan los dos casos lado a lado y se
  decide: **consolidar** (con confirmación explícita) o **no es duplicado** (son dos ataques
  distintos; la marca se va y el aviso no vuelve).
- **Incompletos** — lista de trabajo de los casos a los que les falta algún dato del caso.
- **Ficha del caso** (sin entrada en el menú) — todo el caso: víctima, contacto responsable, hecho
  (con el mapa), animales (cada uno con su identidad, descripción, seguimiento y fotos; «en N casos»
  lleva al detalle del animal, con todos sus casos), tratamiento, denuncias, lo declarado, documentos y un
  acceso al **historial**. Acciones: editar, cambiar estado, desestimar, agregar animal, cargar
  tratamiento, anotar denuncia, adjuntar documento; cada una en una ventana lateral.
- **Historial** (desde la ficha) — línea de tiempo de cambios: quién, cuándo, desde qué organismo,
  antes → después, con filtros por tipo de dato. No se edita ni se borra.

**Listas de trabajo** (Incompletos, Posibles duplicados) y sus contadores del menú: muestran solo
casos **vigentes** (ni desestimados ni unificados).

**Consultas**
- **Búsqueda** — filtros por cuándo y dónde, persona (edad), animal (especie, tamaño, color o raza,
  tenencia) y registro (organismo, tipo de evento, estado, quién lo registró). Desde los resultados
  se puede exportar.
- **Personas** — una por DNI; lista y detalle con todos sus casos y su rol en cada uno. DNI y
  contacto, solo en el detalle.
- **Animales** — la identidad de cada animal y todos los casos en que apareció (así se ve la
  reincidencia). Desde el detalle, **reconciliar** dos registros que resultaron ser el mismo animal.
- **Mapa** — dónde ocurrieron los casos vigentes (cada punto lo puso una persona).
- **Estadísticas** — indicadores sobre casos vigentes. «No sabe» y «Sin dato» se cuentan aparte.
- **Exportar** — CSV o XLSX, eligiendo bloques de columnas. Los datos personales solo para los roles
  que pueden exportarlos.

**Administración** — Usuarios (con la pestaña de roles y permisos, de solo lectura), Organismos y
Tipos de evento. **No hay importación CSV.**

**Formulario público** — otra piel, sin la cáscara del backoffice, pensada para teléfono: formulario
inicial, confirmación con el número de solicitud, las cuatro partes del detallado (con el pin en el
mapa), agradecimiento y «enlace vencido».

## 6. Pendiente: no lo implementes todavía

- El criterio exacto para que un caso pase a **Finalizado** (hoy no tiene condiciones).
- Los valores de **Tipo de evento** (en revisión con el cliente). El tipo de lesión ya no existe como
  dato: lo reemplaza el tipo de evento.
- Las **reglas de permisos** concretas (las de §4 son tentativas; las aplica el back).
- **Personas sin DNI argentino** (p. ej. turistas): todavía no hay cómo cargarlas.
- **Tema oscuro**: va en una segunda pasada, vista por vista (los tokens ya están).
- Filtros avanzados y columnas visibles de las tablas (siguen «en diseño»).

## 7. Qué significa cada valor

Lo que el usuario ve como una etiqueta, explicado. **Es la base de toda ayuda en pantalla** (el ícono
junto a una etiqueta, el texto al pasar el mouse) **y de un futuro manual**: no se escriben otras
definiciones. Si un valor no está acá o la definición no alcanza, avisá al usuario; no la completes vos.
Los marcados *tentativo* pueden cambiar.

### «No sabe» y «Sin dato» (valen para todas las preguntas)

- **No sabe** (en el formulario público, «No sé»): la persona **respondió** que no sabe. Es una
  respuesta: se muestra como un valor más y se cuenta en las estadísticas.
- **Sin dato**: la pregunta **no se hizo o no se respondió**. Se muestra en rojo y se cuenta aparte.
- Aparece en tenencia, tipo de lugar, tamaño, sexo, edad aparente, vacunado, «¿Podría reconocerlo?»
  y «¿Tiene chip?». En las tablas de abajo no se repite.

### Estado del caso (uno solo)

| Valor | Significa |
|---|---|
| **Registrado** | El caso se dio de alta y todavía nadie lo puso en seguimiento. Todo caso nace así. |
| **En seguimiento** | Alguien está trabajando el caso y está detenido esperando algo. Siempre tiene un motivo de espera. |
| **Finalizado** | Se terminó de trabajar el caso. *Tentativo:* todavía no hay un criterio para finalizar (§6); hoy lo decide el agente. Puede finalizarse aunque falten datos (p. ej. nunca se ubicó a la víctima), y entonces no cuenta como incompleto. No se reabre. |
| **Desestimado** | El caso no debía estar en el registro (ver los motivos abajo). Es la «baja»: no se borra, sale de las estadísticas y de las listas de trabajo. No se reabre. |
| **Unificado en otro caso** (con «→ C-…» en la segunda línea) | Era un duplicado y se consolidó en otro caso, al que apunta («→ C-…»). Sus datos se cuentan en ese otro caso. No se elige: resulta de consolidar. No se reabre. |

### Motivo de espera (solo en *En seguimiento*)

| Valor | Significa |
|---|---|
| **Esperando contacto** | No hay un teléfono para comunicarse con la víctima ni con su contacto responsable, y alguien lo busca por DNI en las bases de su organismo. Que falte solo el correo no detiene el caso. |
| **Esperando respuesta** | Hay teléfono, pero la persona no atiende o no contesta. |
| **Esperando certificado** | Se espera que la persona presente el certificado médico de la mordedura; Zoonosis lo adjunta al caso. |

Los tres son *tentativos*: más adelante el caso va a poder esperar varias cosas a la vez, y este campo
probablemente cambie.

### Marcas (pueden ser varias; llegan calculadas)

| Valor | Significa |
|---|---|
| **Incompleto** | Le falta algún dato del caso: fecha del hecho, ciudad, lugar, tipo de lugar, edad de la víctima o tipo de evento (aprobada de momento, puede cambiar). Los datos de los animales, del tratamiento y de la denuncia no cuentan. |
| **Posible duplicado** | La víctima tiene el mismo DNI que la de otro caso vigente. Puede ser el mismo hecho cargado dos veces o dos ataques distintos a la misma persona; lo decide Zoonosis. |
| **Grave** | Algún animal del caso murió o enfermó en la observación del día 10. Pide atención especial al tratamiento de la víctima. Nadie la pone a mano y sigue aunque el caso se finalice. |

### Observación del día 10 (por animal; la carga Zoonosis) · *tentativo*

Los animales que muerden se observan durante 10 días para descartar la rabia.

| Valor | Significa |
|---|---|
| **Pendiente** | Todavía no se cargó la observación (no pasaron los 10 días o Zoonosis aún no la registró). |
| **Sin novedad** | A los 10 días el animal estaba vivo y sano. |
| **Murió o enfermó** | El animal murió o enfermó dentro de los 10 días. Marca el caso como Grave. |
| **Ubicado, sin acceso** | Se sabe dónde está, pero no se lo pudo observar (p. ej. está en un terreno cerrado). |
| **No se ubicó** | Nunca se encontró al animal. |

«Ubicado, sin acceso» y «No se ubicó» no hacen incompleto al caso: se puede finalizar igual.

### Tenencia del animal (en ese caso)

| Valor | Significa |
|---|---|
| **Propio** | Es de la víctima o de quien informó por ella (p. ej. el perro de la familia). |
| **Ajeno conocido** | Es de otra persona y se sabe de quién (p. ej. el perro del vecino). |
| **Ajeno desconocido** | Es de otra persona o de nadie, y no se sabe de quién (p. ej. un perro suelto que no se conoce). |
| **No sabe** | La persona respondió que no sabe. Distinto de *sin dato* (no se preguntó o no se respondió). |

### Motivos para desestimar un caso · *tentativo*

| Valor | Significa |
|---|---|
| **Fuera de alcance** | No fue un ataque de perro o gato a una persona (p. ej. una mordedura entre animales o de fauna silvestre). |
| **Fuera de la provincia** | El hecho ocurrió fuera de Tierra del Fuego. |
| **Hecho inexistente o no verificable** | Al verificarlo, no ocurrió o los datos eran falsos. |
| **Cargado por error** | Se registró por accidente o de prueba. |

No son motivos: un **duplicado** (se consolida y queda *Unificado*) ni **faltan datos** (es la marca
Incompleto; desestimarlo haría que el caso no se cuente).

### Posible duplicado: qué decide Zoonosis

| Decisión | Significa |
|---|---|
| **Consolidar** | Los dos casos son el mismo hecho cargado dos veces: quedan en uno, eligiendo campo por campo. El otro queda *Unificado*. Irreversible. |
| **No es duplicado** | Son dos ataques distintos a la misma persona. La marca se quita y el aviso no vuelve. |

### Tipo de evento · *tentativo* (los valores se revisan con el cliente)

| Valor | Significa |
|---|---|
| **Ataque con mordedura** | El animal mordió a la persona. |
| **Lesión compatible** | Una lesión compatible con un ataque, sin certeza de mordedura (p. ej. un arañazo). |
| **Intento sin lesión** | El animal atacó o intentó atacar sin lastimar a la persona. |
| **Lesión derivada** | La persona se lastimó por el ataque sin que el animal la tocara (p. ej. al caerse huyendo). |

### Tipo de lugar (dónde fue el ataque)

| Valor | Significa |
|---|---|
| **Casa propia** | La casa de la víctima, incluido el patio o el jardín. |
| **Casa ajena** | La casa de otra persona. |
| **Vía pública** | La calle o la vereda. |
| **Espacio público** | Un lugar público que no es la calle: plaza, parque, playa, sendero. |
| **Zona rural** | Fuera de la zona urbana. |

### Zona del cuerpo (tratamiento; la carga Salud) · *tentativo*

Agrupa en 6 las 10 zonas del formulario de Schiavini (F1), para que la lista sea corta.

| Valor | Significa |
|---|---|
| **Piernas** | Desde la cadera hasta los pies, incluidos los pies. |
| **Manos** | Manos y dedos. |
| **Brazos** | Desde el hombro hasta la muñeca. |
| **Cabeza** | Cabeza, cara o cuello. |
| **Tronco** | Pecho, espalda, abdomen, glúteos o genitales. |
| **Múltiples** | Lesiones en más de una zona. |

### Gravedad de la lesión (tratamiento; la carga Salud) · *tentativo, a validar con Salud*

| Valor | Significa |
|---|---|
| **Excoriación** | Raspón: la piel quedó raspada, sin corte. |
| **Herida superficial** | Corte o perforación que no pasa de la piel. |
| **Herida profunda** | Corte o perforación que llega por debajo de la piel (músculo, tendón o hueso). |
| **Amputación** | Se perdió una parte del cuerpo (p. ej. un dedo o parte de una oreja). |

### Cómo era el animal (descripción)

A ojo de quien lo vio: no es una medición.

| Valor | Significa |
|---|---|
| **Tamaño: Chico** | Le llega por debajo de la rodilla a un adulto (p. ej. un caniche). |
| **Tamaño: Mediano** | Le llega más o menos a la rodilla (p. ej. un beagle). |
| **Tamaño: Grande** | Le pasa la rodilla (p. ej. un ovejero alemán). En gatos, se compara con un gato común. |
| **Edad aparente: Cachorro** | Una cría: parece tener menos de un año. |
| **Edad aparente: Adulto** | Ni cachorro ni viejo. |
| **Edad aparente: Viejo** | Muestra la edad: hocico canoso, se mueve lento. |
| **¿Podría reconocerlo?** | Si la persona cree que lo reconocería al volver a verlo. Le sirve a Zoonosis para identificarlo. |

### Formulario público: cómo se traduce lo que eligió la persona

| La persona eligió | Queda como |
|---|---|
| ¿Qué pasó? · Me mordió | Tipo de evento: Ataque con mordedura |
| ¿Qué pasó? · Arañazo | Tipo de evento: Lesión compatible |
| ¿Qué pasó? · Intentó atacar, sin lastimar | Tipo de evento: Intento sin lesión |
| ¿Qué pasó? · Se lastimó al escapar | Tipo de evento: Lesión derivada |
| ¿Qué pasó? · No sé | Sin tipo de evento: el caso queda Incompleto hasta que un agente lo cargue. |
| ¿De quién es? · Es mío | Tenencia: Propio |
| ¿De quién es? · De alguien que conozco | Tenencia: Ajeno conocido |
| ¿De quién es? · No sé de quién es | Tenencia: Ajeno desconocido (la persona sabe que no es suyo; lo que no sabe es de quién) |

### Motivo por el que no hizo la denuncia (lo declaró la persona)

| Valor | Significa |
|---|---|
| **El animal es propio o conocido** | No quiso denunciar a su propio animal o al de alguien cercano. |
| **No sabía dónde denunciar** | Quería, pero no sabía a dónde ir. |
| **No sabía que había que denunciar** | No sabía que correspondía hacerlo. |
| **No me tomaron la denuncia** | Fue a denunciar y no se la recibieron. |
| **Razones económicas** | Hacerlo le costaba dinero. |
| **No pasa nada después con la denuncia** | Cree que denunciar no sirve. |
| **Otros** | Otro motivo. |

Miden por qué los casos no llegan a Zoonosis (el subregistro).

### Roles de usuario y tipos de organismo

| Valor | Significa |
|---|---|
| **Administrador** | Gestiona usuarios, organismos y tipos de evento. No ve casos. |
| **Agente** | Personal de un organismo: registra y trabaja casos. Lo que ve y lo que edita depende del tipo de su organismo. |
| **Consulta** | Ve casos sin datos personales, busca, mira estadísticas y exporta. No edita y no pertenece a un organismo. |
| **Tipo Salud** | Hospitales y centros de salud: cargan el tratamiento de la víctima. |
| **Tipo Zoonosis** | Direcciones de zoonosis: siguen al animal, anotan denuncias, revisan solicitudes y deciden los duplicados. |
| **Tipo CADIC** | Completa los datos comunes del caso; no tiene datos propios. |

### Canal de origen

| Valor | Significa |
|---|---|
| **Ciudadano** | Nació de una solicitud del formulario público que registró Zoonosis. |
| **Salud · Zoonosis · CADIC** | Lo cargó directamente un agente de ese organismo. |
| **Histórico** | Un registro viejo cargado a mano. Es el único que puede no tener DNI. |

### Solicitud

| Valor | Significa |
|---|---|
| **Pendiente** | La mandó un ciudadano y Zoonosis todavía no la revisó. |
| **Registrada** | Zoonosis la pasó a un caso: creó uno nuevo o la sumó a uno que ya existía. Muestra a qué caso fue. |
| **Descartada** | Zoonosis decidió que no corresponde (p. ej. basura, o una tercera solicitud del mismo hecho). Queda guardada, no se borra. |

### Denuncia anotada · *tentativo*

| Valor | Significa |
|---|---|
| **Pendiente de confirmación** | Zoonosis tomó la denuncia y espera que la persona presente el certificado médico (tiene 48 h hábiles). |
| **Confirmada** | Se presentó el certificado y la denuncia sigue su curso. |
| **Desestimada** | No llegó el certificado a tiempo: Zoonosis la desglosó y la devolvió. Queda anotada igual. |

Una denuncia anotada siempre tiene el DNI de quien la hizo y la fecha. Lo que la persona **declaró**
(«¿Hizo denuncia?» y por qué no) es otra cosa: es su respuesta en la solicitud, no la denuncia.

