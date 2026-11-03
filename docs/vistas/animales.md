# Vista · Consultas › Animales

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Consultas y Administración**:
  - **«Consultas › Animales»** (nodo `102:4009`): la lista.
  - **«Consultas › Animales · Detalle»** (nodo `108:9370`): el detalle de un animal.
  - **«Consultas › Animales · Reconciliar»** (nodo `108:9369`): unir dos registros del mismo animal.
- Piezas, en **Fundamentos**: Tabla/*, Chip de filtro, Vigencia (`47:290`), Fila de comparación
  (`74:582`), Casilla (`9:307`), Mensaje, Dato.
- Rutas: `/consultas/animales`, `/consultas/animales/:id` y `/consultas/animales/:id/reconciliar`.

## Para qué sirve

Cada animal tiene **identidad propia**: especie y, si lo tiene, chip. Puede aparecer en **varios
casos**. Lo que se supo de él en cada caso (dueño, tenencia, descripción, día 10) vive **en cada
caso**, no acá. Esta vista sirve para ver **todos los casos de un animal** (así se ve la
**reincidencia**, sin preguntarle a nadie) y para **reconciliar** dos registros que resultaron ser el
mismo animal.

## Lista

1. **Encabezado:** «Animales» · bajada «La identidad de cada animal (especie y chip) y todos los casos
   en que apareció. Lo que se supo de él vive en cada caso.»
2. **Búsqueda:** «Buscar por chip o por caso».
3. **Filtros rápidos:** Todos · Perros · Gatos · Con chip · Sin chip · Absorbidos.
4. **Tabla:**

   | Columna | Contenido |
   |---|---|
   | Animal | Especie (destacado) · segunda línea: `chip 900 123 456 789 012` o `sin chip` (mono) |
   | Casos | `2 casos` / `1 caso` |
   | Último caso | Número del caso más reciente en que apareció (enlace a la ficha del caso) |
   | Descripción en el último caso | Tamaño · sexo · edad aparente; segunda línea: color |
   | Día 10 del último caso | Sin novedad · Murió o enfermó · No se ubicó · Pendiente · `—` si no hay dato |
   | Vigencia | Píldora Activo / Inactivo; si está absorbido, debajo: «Absorbido por chip …» |

   Orden: por el último caso, del más reciente al más viejo. «Todos» **no** muestra los absorbidos;
   aparecen solo con el chip «Absorbidos».
5. **Pie de tabla.** Clic en la fila: abre el detalle.

## Detalle

1. **Encabezado:** «Perro · chip 900 123 456 789 012» (o «Perro · sin chip») · bajada «La identidad del
   animal. Lo que se supo de él (dueño, tenencia, descripción, día 10) vive en cada caso.»
2. **Acciones:** Editar identidad · Reconciliar con otro animal · Ver historial.
3. **Bloque «Identidad»:** especie · chip · vigencia (Activo / Inactivo). Si absorbió a otro: «Absorbió a
   un animal sin chip el 13/09/2026». Si fue absorbido: «Absorbido por …» con enlace al que sobrevivió, y
   las acciones de editar y reconciliar no aparecen.
4. **Bloque «Casos de este animal · N»:** Caso (enlace) · Tenencia · Dueño durante el caso (nombre +
   DNI) · Descripción en el caso · Día 10 · Estado. Si el caso vino de un animal absorbido, debajo: «Vino
   del animal absorbido».
5. **Nota:** «La reincidencia se ve acá: los casos en que apareció el mismo animal. No se le pregunta a
   la persona.»

**Editar identidad:** ventana lateral con especie y chip. Si el chip **ya lo tiene otro animal**, el
back lo rechaza y el error lleva a reconciliar: debajo del campo, «Ese chip ya está en otro animal
(C-2026-0418)» y un enlace «Reconciliar».

## Reconciliar

Lo hace **Zoonosis**, a mano, cuando descubre que dos registros son el mismo animal. El disparador
típico es el de arriba: cargar un chip que ya tiene otro.

1. **Encabezado:** «Reconciliar animales» · bajada «Zoonosis descubrió que dos registros son el mismo
   animal. Uno absorbe al otro; nada se borra.»
2. **Aviso** (advertencia, cuando se llega por el chip repetido): «Este chip ya está cargado en otro
   animal. Al cargar el chip … al animal de C-2026-0402, la base lo rechazó: ya lo tiene el animal de
   C-2026-0418. Compará los dos registros.»
3. **Comparación** de dos columnas: **Animal A · sobrevive** y **Animal B · se absorbe**. Filas:
   especie, chip, registrado el, casos. **Quién sobrevive lo decide la regla, no el agente:**
   - sobrevive **el que tiene chip**;
   - si ninguno tiene, **el más viejo**.
   (Si los dos tienen chip, no se reconcilian: son animales distintos.) El front muestra lo que manda la
   API; no elige.
4. **«Qué pasa al confirmar»:** los casos de B pasan a apuntar a A (queda en el historial de cada
   caso); B **no se borra ni se vacía**: deja de estar vigente y queda «absorbido por» A; las
   descripciones no se pierden, porque viven en cada caso.
5. **Confirmar:** casilla «Confirmo que A y B son el mismo animal.» · Cancelar · **Reconciliar**
   (deshabilitado hasta marcar la casilla). Es **irreversible**.
6. **Al terminar:** mensaje de éxito («Animales reconciliados: C-2026-0402 ahora apunta al perro chip
   …») y se abre el **detalle del que sobrevivió**, que ya muestra todos los casos.

Cómo se elige el otro animal cuando se entra desde «Reconciliar con otro animal» (sin chip repetido):
se busca por chip o por número de caso y se elige uno de la lista. Figma no lo muestra; usá la misma
búsqueda de la lista de Animales.

## Datos de ejemplo

```json
{
  "id": 41,
  "especie": "perro",
  "chip": "900123456789012",
  "vigente": true,
  "absorbidoPor": null,
  "absorbio": [{ "id": 58, "fecha": "2026-09-13" }],
  "casos": [
    { "numero": "C-2026-0418", "tenencia": "ajeno_conocido",
      "duenio": { "nombre": "Raúl Benítez", "dni": "25300114" },
      "descripcion": { "tamanio": "mediano", "sexo": "macho", "edadAparente": "adulto", "color": "Negro con manchas blancas" },
      "dia10": "sin_novedad", "estado": "registrado", "vinoDeAbsorbido": false },
    { "numero": "C-2026-0402", "tenencia": "ajeno_conocido",
      "duenio": { "nombre": "Raúl Benítez", "dni": "25300114" },
      "descripcion": { "tamanio": "mediano", "sexo": "macho", "edadAparente": "adulto", "color": "Negro" },
      "dia10": "sin_novedad", "estado": "registrado", "vinoDeAbsorbido": true }
  ]
}
```

Valores: `especie` ∈ perro · gato · `tenencia` ∈ propio · ajeno_conocido · ajeno_desconocido · no_sabe ·
`dia10` ∈ pendiente · sin_novedad · murio_o_enfermo · no_se_pudo_observar.

Filas de Figma para el mock (Todos 96 · Perros 88 · Gatos 8 · Con chip 21 · Sin chip 75 · Absorbidos 2):

| Animal | Casos | Último caso | Descripción | Día 10 | Vigencia |
|---|---|---|---|---|---|
| Perro · chip 900 123 456 789 012 | 2 | C-2026-0418 | Mediano · macho · adulto / Negro con manchas blancas | Sin novedad | Activo |
| Perro · sin chip | 1 | C-2026-0418 | Grande · adulto / Marrón | No se ubicó | Activo |
| Perro · chip 900 554 210 337 001 | 1 | C-2026-0421 | Grande · hembra · adulto / Atigrado | Murió o enfermó | Activo |
| Gato · sin chip | 1 | C-2026-0420 | Chico · macho / Gris | Sin novedad | Activo |
| Perro · sin chip | 1 | C-2026-0402 | Mediano · macho · adulto / Negro | — | Inactivo · Absorbido por chip 900 123 456 789 012 |

## Quién la ve (las reglas viven en el servidor)

- **Zoonosis:** todo, y es el único que **reconcilia** y edita la identidad (chip).
- **CADIC:** ve la lista y el detalle **sin chip ni dueño**.
- **Salud:** no recibe chip, dueño ni descripción: la lista solo muestra especie, casos y día 10.
- **Analista:** ve descripción, tenencia y especie; no ve chip ni dueño.
- Lo que la API no manda, no se muestra (la columna o el dato desaparecen). Los botones Editar identidad
  y Reconciliar aparecen solo si la API dice que se puede.

## Pendiente: no lo implementes todavía

- **Deshacer una reconciliación** hecha por error: no está diseñado (hoy es irreversible).
- **Ícono «en alerta»** en la lista para animales con un caso grave: queda para después de la alfa.
