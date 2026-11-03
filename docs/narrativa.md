# SIRAM: narrativa de uso

> Lo entrega el agente de diseño (repo `../proyecto`). No lo edites desde el front: si algo no
> cierra, avisá al usuario. Última actualización: 2026-10-08.
>
> Este documento cuenta **qué hace el usuario y qué ve**. No describe el modelo de datos: los datos
> llegan por la API, y las dudas sobre su forma se resuelven con el back.

> **⚠ Desactualizada (aviso del 2026-11-03).** La narrativa cambió desde el 2026-10-23 y este archivo
> todavía no lo refleja; se reescribe pronto. Mientras tanto, **donde choque con una ficha de
> `vistas/`, gana la ficha.** Lo que ya no vale:
> - **Hay formulario público.** Lo que envía un ciudadano es una **solicitud** (no un caso): va a la
>   cola `Casos › Solicitudes` y un agente la descarta o la registra (crea un caso o la suma a uno).
> - **Marcas:** incompleto · posible duplicado · **grave** (un animal murió o enfermó en la
>   observación del día 10). «Posible evento relacionado» ya no existe: que dos casos compartan un
>   animal se ve en la ficha del caso («en N casos»), no con una marca.
> - **No se vincula.** Los posibles duplicados se detectan por el DNI de la víctima y el agente
>   decide «consolidar» o «no es duplicado». Desaparecen el puntaje, las señales y «vincular».
> - **Un caso puede tener varios animales**, y lleva **canal de origen** (ciudadano, salud,
>   zoonosis, cadic, histórico).
> - **La bandeja se ordena por última modificación.**
> - **La denuncia la anota solo Zoonosis** (DNI de quien la hizo, fecha, número, estado). «¿Hizo
>   denuncia?» y su motivo son lo que declaró la persona en su solicitud: ningún agente los carga.

---

## 1. La historia

1. Un perro o un gato ataca a una persona. Puede haber lesión o no: también se registran los
   intentos de ataque y las lesiones derivadas (p. ej. una caída al huir).
2. Un **agente** de un organismo (Salud, Zoonosis…) **registra el caso** en SIRAM y carga los
   datos por la persona, DNI y contacto incluidos. Caso típico: el encargado del lugar donde la
   atienden. Otro: Zoonosis atiende a alguien que va a hacer una denuncia, toma los datos, registra
   el caso y le anota esa denuncia.
3. **SIRAM trata casos, y nada más.** Un caso siempre lo registra personal interno. No hay
   formulario público, ni cola de entrada, ni nada que «llegue solo».
4. La **denuncia** es otra cosa: un trámite oficial que la persona (o alguien vinculado, p. ej. el
   padre de un menor) hizo ante un ente (Zoonosis, policía…). SIRAM no la recibe: si existe, **se
   anota dentro del caso** como un dato más.
5. Al registrar el caso, muchas veces no se sabe si la persona hizo una denuncia. Más tarde un
   agente la llama con los datos de contacto, lo verifica y completa lo que falte. Mientras tanto el
   caso queda **En seguimiento**, con el motivo **Pendiente de contacto**.
6. SIRAM compara los casos entre sí y avisa cuando dos se parecen: puede ser el mismo incidente
   registrado dos veces (p. ej. por el hospital y por Zoonosis) o dos víctimas del mismo animal. Un
   agente decide qué son.
7. Con los casos se arman el panel de inicio, las estadísticas y el mapa.

## 2. Vocabulario de pantalla

| Término | Qué es | Lo que no es |
|---|---|---|
| **Caso** (`C-2026-0418`) | El incidente. Es lo único que SIRAM gestiona: se registra, se sigue, se completa y se cuenta. | No es una denuncia. |
| **Denuncia** | Un trámite oficial hecho en un ente, anotado dentro de un caso (ente, número, fecha). SIRAM no guarda quién la hizo. | No tiene pantalla propia, ni estados, ni identificador `D-…`. Nunca existe fuera de un caso. |
| **Posible duplicado** | Dos casos que parecen el **mismo incidente con la misma persona**. | — |
| **Evento relacionado** | Dos casos con **personas distintas** y el mismo animal, lugar y fecha. | No es un duplicado. |
| **Consolidar** | Fundir dos casos duplicados en uno. **Irreversible.** | — |
| **Vincular** | Enlazar dos casos relacionados sin fundirlos. **Reversible.** | — |
| **No sabe / Sin dato** | «No sabe»: la persona respondió que no sabe. «Sin dato»: no se preguntó o no se respondió. | Nunca se muestran igual. |
| **No evaluable** | Una señal de comparación que no se puede evaluar porque falta el dato en un caso. | No es «no coincide». |

## 3. Cómo se muestra un caso

Un caso tiene **tres indicadores independientes**. Nunca se juntan en un solo campo ni en un solo
componente.

| Indicador | Valores | En pantalla |
|---|---|---|
| **Estado** (uno solo) | Registrado · En seguimiento · Finalizado · Desestimado · Unificado | Píldora en su propia columna. Un caso nace *Registrado*. *Unificado* muestra a qué caso fue a parar (`→ C-2026-0402`). |
| **Motivo de espera** (solo en *En seguimiento*) | Pendiente de contacto · de respuesta · de certificado | Junto al estado. |
| **Marcas** (pueden ser varias) | Incompleto · Posible duplicado · Posible evento relacionado | Íconos pegados al identificador, a la izquierda. |

Los valores definitivos vienen de la API. Los de esta tabla sirven para los datos de ejemplo.

## 4. Pantallas

### Inicio
El panel de quien entra a trabajar. Arriba aparece **lo que bloquea**: los casos incompletos y los
que esperan un contacto. Debajo están los indicadores epidemiológicos. El gráfico «Origen del
registro» muestra qué organismos cargan casos. Es un dato de cobertura, no epidemiológico.

### Casos › Bandeja
Todos los casos, en cualquier estado. Se filtra por cada eje por separado (estado, motivo, marcas),
por organismo y por fechas. El organismo es una columna o un chip, nunca un color del sistema. Hoy
la bandeja se ordena por número de caso. Más adelante se va a ordenar por «último movimiento», que
todavía no está definido.

### Casos › Nuevo caso
Lo carga un agente, en un drawer lateral, con un fieldset por bloque (Persona, Hecho, Animal,
Lesión, Denuncia y seguimiento…).
- **El DNI es obligatorio.**
- Al guardar, si el sistema detecta un caso muy parecido (mismo DNI o teléfono), **avisa antes de
  crear el registro** y deja comparar. Si el parecido es menor (lugar y fecha), solo lo marca para
  revisarlo después.
- Bloque **Denuncia**: «¿Hizo denuncia?» con las respuestas *Sí*, *No* y *Sin dato*. Si es *Sí*,
  se anota una o más denuncias (ente, número, fecha). Si es *No*, se puede anotar el
  motivo. Lo normal es que quede *Sin dato* y se complete en el seguimiento.

### Ficha del caso
Muestra el caso completo: los tres indicadores, la completitud (p. ej. «38 de 50 campos»), los
bloques de datos, las denuncias anotadas y la **línea de tiempo de auditoría** (quién hizo qué y
cuándo, incluido «Sistema»).
- Acciones: **Editar** y **Cambiar estado**. Al pasar a *En seguimiento* se elige el motivo de
  espera.
- **Desestimar** es la única forma de «dar de baja» un caso. En SIRAM no se borra nada. Pide un
  motivo obligatorio, y la lista de motivos todavía no está definida (ver §6).
- Si el caso tiene una marca de posible duplicado o de evento relacionado, la ficha lo avisa con un
  enlace a la comparación.

### Casos › Posibles duplicados / Eventos relacionados (comparar)
Dos casos lado a lado, con las señales que los acercan, su peso y las que son *no evaluables*. La
decisión tiene tres salidas:
- **Son el mismo incidente → Consolidar.** Se elige **campo por campo** qué valor sobrevive. Si un
  caso tiene el dato y el otro no, se conserva el que lo tiene. Exige marcar una confirmación
  explícita («Confirmo que X e Y son la misma persona…») antes de habilitar el botón. Es
  irreversible: el caso absorbido queda *Unificado* y apunta al que sobrevive.
- **Son dos víctimas del mismo animal → Vincular.** Los dos casos siguen vivos y el vínculo se puede
  deshacer. **Nunca se ofrece consolidar un evento relacionado**: borraría una víctima de las
  estadísticas.
- **No están relacionados → Descartar.** Se quita la marca.

Nunca hay fusión automática.

### Listas de trabajo y contadores del menú
Incompletos, Posibles duplicados y Eventos relacionados son **listas de trabajo**: muestran, y
cuentan en el menú, solo casos **vigentes**. Los *desestimados* y los *unificados* no entran, porque
no queda nada por hacer con ellos. Un caso *unificado* tampoco conserva la marca de posible
duplicado: consolidar resolvió esa sospecha. La Bandeja con «Todos» sí muestra todos los casos.

### Casos › Incompletos
Los casos con la marca *Incompleto*: les falta algún dato obligatorio (fecha del hecho, ciudad,
lugar, situación de la persona, animal propio o ajeno). Es la lista de trabajo para completar.

### Consultas (Búsqueda, Mapa, Estadísticas, Exportar)
Las estadísticas cuentan los casos vigentes: los *desestimados* no cuentan, y los *unificados* ya
están contados en el caso que los absorbió. El mapa está pendiente de diseño.

### Administración
Usuarios, Organismos, Tipos de evento (los valores están en revisión, ver §6) e Importar CSV
(futuro, no implementar).

## 5. Respuestas a las preguntas del front (2026-10-08)

**A. Definiciones**
1. **Caso:** el incidente (un ataque de perro o gato a una persona) que un agente registra y SIRAM
   gestiona. **Denuncia:** un trámite oficial que la persona hizo en un ente, anotado dentro de un
   caso.
2. Son dos cosas distintas, pero la denuncia **vive dentro del caso**: un caso tiene cero, una o
   varias. No hay denuncias sueltas.
3. Hoy un ciudadano no carga nada: el formulario público está en suspenso. Un organismo registra
   **casos**.
4. Caso: `C-2026-0418`. La denuncia **no** tiene un identificador `D-…` propio. Los `D-2026-…` del
   prototipo pertenecían a la cola de validación, que quedó sin efecto.

**B. Validación**

5–8. **«Pendientes de validación» se elimina.** Pertenecía a la narrativa del formulario público,
cuando cualquiera podía cargar un caso y había que verificarlo. Hoy los casos los registra siempre
un agente y no hay nada que validar. Se saca del menú y del inicio, y no hay contador. Las salidas
«incorporar / vincular / desestimar» de esa pantalla no aplican.

**C. Estados**

9. Quedan cinco: Registrado · En seguimiento · Finalizado · Desestimado · Unificado. **Sin
   confirmar** y **Confirmado** se eliminan por la misma razón que la validación.
10. Ya no existe ninguno de los dos.
11. La denuncia no tiene estados.

**D. Bandeja y contadores**

12. La bandeja muestra todos los casos, en cualquier estado.
13. Las tres marcas son **solo de casos**. Las coincidencias se buscan siempre entre casos.

**E. Vocabulario**

14. **D1 «Denuncia en Zoonosis» y D2 «Denuncia policial»** ya no son dos campos sueltos: son
    denuncias anotadas en el caso con su ente (Zoonosis, policía), bajo la pregunta «¿Hizo
    denuncia?». **T1 «Tipo de denuncia»** pasa a llamarse **«Tipo de evento»**, también el catálogo de
    Administración: clasifica al caso (ataque con mordedura, lesión compatible…). Los valores
    todavía no están cerrados: usá los del prototipo como ejemplo.
15. **«Origen ciudadano sin verificar» se descarta.**

**F. `docs/` corregido.** Se actualizaron el prototipo, el lenguaje visual y el README: cola de
validación fuera del menú, estados nuevos, sin marca de origen ciudadano. La vista de validación
sigue en el HTML del prototipo, oculta y sin acceso. No la implementes.

## 6. Pendiente: no lo implementes todavía

- La lista de **motivos para desestimar** un caso (hay una propuesta sin aprobar).
- Los valores de **«Tipo de evento»** (T1).
- La lista de **entes** donde se puede haber hecho una denuncia.
- El **formulario público** (R.17), en suspenso, y la **importación CSV** (R.25), futura.
- El **mapa**.
- La **«fecha de novedad»** (último movimiento) de la bandeja.
- El criterio para que un caso pase a **Finalizado** (se está confirmando con el cliente).
