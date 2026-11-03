# SIRAM: narrativa de uso

> Lo entrega el agente de diseño (repo `../proyecto`). No lo edites desde el front: si algo no
> cierra, avisá al usuario. Última actualización: 2026-11-03 (reescrita entera; reemplaza la del
> 2026-10-08).
>
> Este documento cuenta **qué hace el usuario y qué ve**. No describe el modelo de datos: los datos
> llegan por la API, y las dudas sobre su forma se resuelven con el back. Lo visual está en Figma y el
> detalle de cada pantalla, en su ficha de `vistas/`. **Si esta narrativa y una ficha no coinciden,
> gana la ficha** (es más nueva y más precisa).

---

## 1. La historia

1. Un perro o un gato ataca a una persona. Puede haber lesión o no: también se registran los
   intentos de ataque y las lesiones derivadas (p. ej. una caída al huir).
2. El hecho entra a SIRAM por uno de **cuatro canales**: Salud, Zoonosis, CADIC o el **canal
   ciudadano** (un formulario público). Todos empiezan con el mismo **formulario inicial**, corto a
   propósito: nombre, apellido, DNI, teléfono, correo, especie del animal y fecha del hecho. Qué es
   obligatorio depende del canal.
3. **Si lo carga un agente de un organismo, es un caso.** **Si lo carga un ciudadano, es una
   solicitud**: lo que declaró la persona, tal cual, a la espera de que un agente la revise.
4. Después de enviar, el ciudadano puede seguir con un **formulario detallado** opcional, en cuatro
   partes (dónde fue, qué pasó, cómo era el animal, la denuncia). Cada parte se guarda al pasar a la
   siguiente. Es **una sola oportunidad**: el enlace vence en una hora y después solo los organismos
   agregan datos.
5. Un agente revisa la solicitud: la **descarta** o la **registra**, creando un caso nuevo o
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
| **Observación del día 10** | Lo que Zoonosis registra de cada animal a los diez días: pendiente · sin novedad · murió o enfermó · no se pudo observar. | — |
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

Un caso tiene **tres indicadores independientes**. Nunca se juntan en un solo campo ni en un solo
componente.

| Indicador | Valores | En pantalla |
|---|---|---|
| **Estado** (uno solo) | Registrado · En seguimiento · Finalizado · Desestimado · Unificado | Píldora en su propia columna. Un caso nace *Registrado*. |
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
- **Agentes** (Salud, Zoonosis, CADIC): ven todos los casos y todas las solicitudes.
  - Salud **no** recibe dueño, chip, descripción ni fotos de los animales, ni el detalle de las
    denuncias (solo «tiene 1 denuncia anotada»).
  - CADIC no recibe dueño ni chip, ni el certificado médico.
- **Analista / comité** (rol «Consulta»): casos **sin datos personales**; busca, ve estadísticas y
  exporta. No edita.
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
- Los valores de **Tipo de evento** y de **tipo de lesión** (en revisión con el cliente).
- Las **reglas de permisos** concretas (las de §4 son tentativas; las aplica el back).
- **Personas sin DNI argentino** (p. ej. turistas): todavía no hay cómo cargarlas.
- **Tema oscuro**: va en una segunda pasada, vista por vista (los tokens ya están).
- Filtros avanzados y columnas visibles de las tablas (siguen «en diseño»).
