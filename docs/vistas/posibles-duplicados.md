# Vista · Casos › Posibles duplicados (lista y comparar)

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Casos**:
  - **«Casos › Posibles duplicados»** (nodo `14:386`): la lista, con la tabla de la Bandeja v2.
  - **«Casos › Comparar · posible duplicado»** (nodo `75:6219`): la comparación.
  - **«Casos › Comparar · consolidar confirmado»** (nodo `76:6630`): la misma, con la confirmación
    marcada y el botón habilitado.
- Piezas, en **Fundamentos**: Tabla/*, Marca, Mensaje, Fila de comparación (`74:582`), Casilla, Botón
  (`Tipo=Consolidar` y Secundario), Enlace de caso, Estado del caso.
- Rutas: `/casos/duplicados` (lista) y `/casos/comparar/:a/:b` (comparar).

## Para qué sirve

Un **posible duplicado** son dos casos cuya **víctima tiene el mismo DNI**. Puede ser el mismo hecho
cargado dos veces (por ejemplo, por el hospital y por Zoonosis) o dos ataques distintos a la misma
persona. **Lo decide un agente**, nunca el sistema solo. Hay dos salidas:

- **Consolidar** — es el mismo hecho: los dos casos se funden en uno. **Irreversible.**
- **No es duplicado** — son casos distintos: la marca se va y el aviso no vuelve para esos dos casos.

Ya **no hay** puntaje, señales de coincidencia ni «vincular»: si los ves en algún lado, están viejos.

---

## 1. La lista (`14:386`)

- **Encabezado:** «Posibles duplicados» · bajada «Casos vigentes que el sistema marcó como posible
  duplicado de otro. Al abrir un caso se ve con cuál y se decide en la comparación.»
- **Qué casos entran:** vigentes (ni desestimados ni unificados) con la marca *posible duplicado*. Es
  una **lista de trabajo**: su cantidad es el contador del menú. Un caso llega acá cuando, al
  registrarlo, el agente eligió **«Guardar y revisar después»** en el aviso de DNI repetido (ver
  `nuevo-caso.md`).
- **Los dos casos del par tienen que estar vigentes** *(2026-11-04)*: si uno se desestima, la marca
  desaparece de los dos y el otro sale de la lista. La coincidencia queda guardada sin decisión (no se
  marca «distintos»). Solo se consolidan casos registrados, en seguimiento o finalizados.
- **Tabla:** las **mismas columnas que la Bandeja** (ver `bandeja.md`: marcas, caso, última
  modificación, fecha del hecho, víctima, lugar, animales, tipo de evento, estado, canal de origen).
  Mismo orden: última modificación, más reciente arriba. Búsqueda igual que en la Bandeja. Sin filtros
  rápidos.
- **Clic en un caso:** abre su ficha, que muestra el aviso de posible duplicado con el botón **Comparar
  casos** (ver la ficha del caso). Desde ahí se llega a comparar.
- **Vacío:** «No hay posibles duplicados para revisar.»

Los dos casos de un par aparecen los dos en la lista (cada uno tiene la marca). En el ejemplo:
C-2026-0418 (Zoonosis, con marcas incompleto y duplicado; última modificación 22/09/2026 10:15 ·
M. Acosta) y C-2026-0402 (Salud, solo duplicado; última modificación 13/09/2026 11:20 · M. Acosta, al reconciliar su animal).

---

## 2. Comparar (`75:6219`, `76:6630`)

Es una **página**, con el botón de volver a la izquierda del título.

### Estructura

1. **Encabezado:** «Comparar registros» · bajada «Mismo DNI de la víctima: decidí si es el mismo hecho
   o son casos distintos.» · nota «Datos de ejemplo».
2. **Mensaje de información:** «**Posible duplicado: la víctima tiene el mismo DNI** · 58.412.336 es
   víctima en C-2026-0418 y en C-2026-0402. Compará los dos casos y decidí si son el mismo hecho
   cargado dos veces.»
3. **Resumen:** «7 iguales · 4 distintos · 2 solo en uno» · a la derecha: «Lo marcado en violeta es lo
   que sobrevive si consolidás.»
4. **Cabeceras de los dos casos**, lado a lado: número (enlace a la ficha, en otra pestaña), organismo,
   estado y fecha de registro. **A** a la izquierda (el caso desde el que se abrió la comparación),
   **B** a la derecha.
5. **Comparación campo por campo**, por grupos: *Persona afectada* (nombre, edad, DNI, teléfono,
   correo), *Hecho* (fecha, hora, lugar, tipo de lugar), *Animal* (especie, tamaño, color), *Tipo de
   evento*. **Salud no recibe la descripción del animal**: para Salud, las filas de tamaño y color no se
   muestran (la API no las manda). Cada fila es una **Fila de comparación**:

   | Estado de la fila | Qué pasa | Cómo se ve |
   |---|---|---|
   | Igual | Nada que elegir | «=» al medio |
   | Solo en A / Solo en B | Se conserva el que lo tiene, sin preguntar | Celda en violeta · «Se conserva» |
   | Distinto | **El agente elige** cuál queda (radio en cada celda) | «≠» al medio; el elegido en violeta |

   Por defecto, en las filas distintas queda elegido el valor de **A** (el que se ve en
   `75:6219`); el agente puede cambiarlo en cada fila.
6. **Desenlace:** «Decidí qué pasa con estos dos registros» · «Cada camino deja un rastro distinto en el
   registro provincial. Elegí uno solo.»
   - **Consolidar en un registro único** (tarjeta violeta, «Irreversible»): «Es el mismo incidente,
     cargado dos veces. Queda un solo caso con los valores que elegiste arriba, y se
     conserva la trazabilidad de los dos originales…» · resultado «C-2026-0418 + C-2026-0402 →
     C-2026-0418 · el 0402 queda Unificado y apunta a este caso» · casilla **«Confirmo que los dos casos
     son el mismo incidente, cargado dos veces.»** (La víctima ya es la misma persona: es única por DNI,
     RN-20; lo que se confirma es el hecho.) · botón **Consolidar
     registros** (deshabilitado hasta marcar la casilla; al lado: «Marcá la confirmación para
     habilitar», y con la casilla marcada: «Es irreversible: revisá los valores marcados arriba.»).
   - **No es duplicado: son casos distintos** (botón secundario) · «Otro ataque a la misma persona.
     Guarda la decisión y saca la marca de posible duplicado; el aviso no vuelve a salir para estos dos
     casos.»

### Qué caso sobrevive

**A es el caso desde el que se abrió la comparación** (el que el agente estaba mirando, con «Comparar
casos» en su ficha) y **B el otro**. No importa cuál se registró antes. Al consolidar, **sobrevive A**
con los valores elegidos y **B queda *Unificado*** y apunta a A («→ C-2026-0418»). B no se borra: se ve
en la Bandeja con su estado y su enlace.

En el ejemplo, la comparación se abre desde C-2026-0418: **A = C-2026-0418** (registrado el 12/09 a las
15:02, sobrevive) y **B = C-2026-0402** (registrado antes, a las 14:50; queda unificado). Si se abriera
desde la ficha de C-2026-0402, sería al revés. La ruta lleva el orden: `/casos/comparar/:a/:b`.

### Comportamiento

- **Consolidar:** con la casilla marcada, el botón se habilita. Al hacer clic **no hay otra
  confirmación** (la casilla ya lo es). Mensaje de éxito «C-2026-0402 consolidado en C-2026-0418» y se
  abre la ficha de A. La marca de posible duplicado desaparece de los dos.
- **No es duplicado:** abre una ventana lateral corta (la misma que abre «No es duplicado» desde el
  aviso de la ficha del caso) con un campo **Observación** (opcional, texto
  libre: p. ej. «Dos mordeduras del mismo perro con un mes de diferencia») · Cancelar · **Guardar**. Al
  guardar: mensaje de éxito «Marcados como casos distintos», vuelve a la lista. Los dos casos siguen
  como estaban, sin la marca.
- **Volver** sin decidir no cambia nada.
- Si mientras tanto otro agente ya resolvió el par, la API rechaza la acción: mensaje de error «Este
  posible duplicado ya fue resuelto por otra persona» y se recarga la página.
- Solo se compara **el DNI de la víctima** (nunca el de quien informó).

### Datos de ejemplo

Lo que devuelve la API para comparar (forma de ejemplo):

```json
{
  "a": { "numero": "C-2026-0418", "organismo": "Zoonosis Ushuaia", "estado": "registrado", "registrado": "2026-09-12T15:02" },
  "b": { "numero": "C-2026-0402", "organismo": "Hospital Regional Ushuaia", "estado": "registrado", "registrado": "2026-09-12T14:50" },
  "dni": "58412336",
  "filas": [
    { "grupo": "Persona afectada", "campo": "victima.nombre", "etiqueta": "Nombre", "codigo": "P1", "a": "Micaela", "b": "Micaela" },
    { "grupo": "Persona afectada", "campo": "victima.apellido", "etiqueta": "Apellido", "codigo": "P1", "a": "Sosa", "b": "Sosa" },
    { "grupo": "Hecho", "campo": "fechaHecho", "etiqueta": "Fecha del hecho", "codigo": "H1", "a": "2026-09-12", "b": "2026-09-12" },
    { "grupo": "Hecho", "campo": "tipoLugar", "etiqueta": "Tipo de lugar", "codigo": "H5", "a": null, "b": "via_publica" }
  ]
}
```

En pantalla, nombre y apellido van en una sola fila; en los datos, separados. Los enumerados llegan en
`snake_case` (`via_publica`) y se muestran con su etiqueta («Vía pública»). El estado de cada fila
(igual, solo en uno, distinto) se calcula con `a` y `b`. Lo que se manda al consolidar:

```json
{ "coincidencia": 7, "sobrevive": "C-2026-0418", "absorbido": "C-2026-0402", "elecciones": { "horaHecho": "C-2026-0418", "lugar.direccion": "C-2026-0418" }, "confirmado": true }
```

En `elecciones` van solo las filas distintas en las que el agente cambió la elección: las que no
figuran quedan con A (el que sobrevive), que es lo elegido por defecto.

Y al marcar como distintos: `{ "coincidencia": 7, "desenlace": "distintos", "observacion": "…" }`. A y B son solo izquierda y derecha de la pantalla: **no** son los `caso_a`/`caso_b` del modelo (allá, A es el caso que ya existía). Por eso se manda la coincidencia y cuál sobrevive.

## Quién la ve

- **Agentes** (Salud, Zoonosis, CADIC): ven la lista, comparan y deciden. **Cualquier agente puede
  consolidar**: no hay un permiso propio mientras no se defina quién es la «persona autorizada» (ver
  «Pendiente»). La casilla de confirmación es lo único que se pide.
- **Analista / comité** y **administrador:** no ven esta lista.

## Pendiente: no lo implementes todavía

- **Qué pasa con lo demás de B al consolidar** (sus animales, tratamiento, denuncias, solicitudes y
  documentos): todavía no está definido si se suman a A o se eligen. La comparación solo muestra los
  datos del caso. Por ahora, implementá la comparación de los datos de la tabla.
- **Casos con varios animales:** la comparación muestra un solo animal por caso. Cómo se emparejan los
  animales de A y de B está por definirse (en el ejemplo, A tiene dos y B uno, el perro con chip que
  ya comparten).
- **Quién puede consolidar** («persona autorizada», RN-15): sin definir. Mientras tanto, cualquier
  agente.
- **Los datos de la víctima en los dos casos:** la persona es única por DNI, así que nombre, teléfono y
  correo de la víctima son los mismos en A y en B; lo que puede variar entre casos es la edad al
  momento del hecho. Por eso las filas de *Persona afectada* salen siempre iguales, salvo la edad.
  Qué hace Nuevo caso cuando el DNI ya es de una persona sigue pendiente allá.
