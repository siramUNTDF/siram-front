# Vista · Consultas › Estadísticas

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Consultas y Administración**, marco **«Consultas ›
  Estadísticas»** (nodo `53:1221`).
- Piezas, en **Fundamentos**: Indicador, Gráfico/Barra (`47:270`), Gráfico/Columna (`47:283`),
  Encabezado de sección, Campo (selección), Botón.
- Ruta: `/consultas/estadisticas`.

## Para qué sirve

Indicadores epidemiológicos y de cobertura sobre los **casos vigentes**: los desestimados no cuentan
y los unificados ya están contados en el caso que los absorbió.

## Estructura

1. **Encabezado de página:** «Estadísticas» · bajada «Indicadores sobre los casos vigentes. Datos al
   25/09/2026.» · nota «Datos de ejemplo».
2. **Filtros:** Período (año; por defecto el actual) · Ciudad (Todas · Ushuaia · Río Grande · Tolhuin)
   · Organismo (Todos + los organismos) · botón secundario **«Exportar estos datos»**.
3. **Resumen:** el total («127 · casos vigentes en 2026 · No cuenta desestimados ni unificados: un
   unificado ya está contado en el caso que lo absorbió.») y tres **Indicadores**:
   - «31 · víctimas de 0 a 9 años · 24 % de los casos, en el grupo de edad más chico»
   - «58 · en la vía pública · 46 % de los casos»
   - «83 · animales sin saber si estaban vacunados · 64 % de los animales: 46 “no sabe” y 37 “sin
     dato”» (cuenta **animales**, como los gráficos del animal).
4. **Secciones**, cada una con su encabezado y sus gráficos (título, bajada «área · qué mide», gráfico,
   pie «casos vigentes en 2026», nota, «+ Ver los datos del gráfico»):

| Sección | Gráfico | Tipo | Categorías |
|---|---|---|---|
| **Cuándo** · Fecha, día y hora del hecho | Casos por mes | Columnas | Ene → mes actual; el mes en curso punteado, con proyección |
| | Día y hora | Dos grupos de columnas | Día de la semana (Lun → Dom) · Franja horaria (0–6 h, 6–12 h, 12–18 h, 18–24 h) |
| **Quién** · La persona atacada | Franja etaria de la víctima | Columnas | 0–9 · 10–19 · 20–39 · 40–59 · 60+ |
| **Dónde** · Ciudad y tipo de lugar | Ciudad | Barras | Ushuaia · Río Grande · Tolhuin. Nota fija: «El detalle por barrio y por calle va en el mapa.» |
| | Tipo de lugar | Barras | Vía pública · Casa propia · Casa ajena · Espacio público · Zona rural · No sabe · Sin dato |
| **Animal** · El animal que atacó | Especie y tamaño | Dos grupos de barras | Especie: Perro · Gato · Tamaño: Chico · Mediano · Grande · No sabe · Sin dato |
| | Tenencia del animal | Barras | Ajeno desconocido · Ajeno conocido · Propio · No sabe · Sin dato |
| | Vacunación del animal | Barras | Vacuna antirrábica: Sí · No · No sabe · Sin dato |
| **Lesión** · Zona del cuerpo y gravedad, del tratamiento | Zona del cuerpo lesionada | Barras | Piernas · Manos · Brazos · Cabeza · Tronco · Múltiples |
| | Gravedad de la lesión | Barras | Excoriación · Herida superficial · Herida profunda · Amputación · Sin dato |
| **Registro** · No son datos epidemiológicos | Origen del registro | Barras con cantidad y % | Un organismo por barra |
| | Datos sin completar | Barras con cantidad y % | Vacuna del animal · Hora · Tamaño · Tipo de lugar (casos sin ese dato) |

## Reglas de lectura

- **«No sabe» y «Sin dato» se cuentan aparte**, siempre. «Sin dato» se dibuja con la barra **Sin dato**
  (gris punteada). «No sabe» es una respuesta y va como barra normal.
- **«Datos sin completar» cuenta solo «Sin dato»** (la pregunta no se hizo o no se respondió). Nota
  fija: «Solo cuenta “sin dato”… “No sabe” es una respuesta y no entra acá.»
- **Zona del cuerpo y gravedad** salen del tratamiento que carga Salud: solo los casos con tratamiento
  tienen ese dato. El pie de esos dos gráficos dice «casos vigentes con tratamiento cargado» (y no «casos
  vigentes»).
- **Gráficos del animal** (especie, tamaño, tenencia, vacunación): un caso puede tener varios animales;
  cuentan **animales**, no casos. En los datos de ejemplo hay **129 animales** en 127 casos (C-2026-0418 tiene
  dos y otro caso más también): especie Perro 114 · Gato 15; tenencia y vacunación suman 129. El pie dice «animales de los casos vigentes en 2026». La suma puede
  superar el total de casos.
- **Categorías con 0** no se dibujan (p. ej. si no hubo amputaciones, no hay barra).
- **Destacados fijos** (no se calculan): «0–9» en la franja etaria, «Cabeza» en zona del cuerpo, «Sáb» y
  «Dom» en día de la semana, y la franja horaria con más casos.
- **Notas:** solo las fijas (qué cuenta el gráfico, aclaraciones como las de arriba). Las frases de
  Figma con cifras («Fin de semana: 47 casos (37 %)…», «Vía pública: 58 casos, casi la mitad…») son
  ejemplos de lectura: no se generan.
- **Proyección del mes en curso:** como en Inicio (casos del mes ÷ días transcurridos × días del mes).
- El **largo de cada barra** es proporcional al valor más alto **de ese gráfico**.
- **«+ Ver los datos del gráfico»** despliega una tabla con las cifras (alternativa accesible).

## Comportamiento

- Cambiar un filtro recalcula todo (no hay botón «Aplicar»). Los filtros van en la URL.
- **«Exportar estos datos»** lleva a `/consultas/exportar` con el mismo período, ciudad y organismo.
- Las cifras **llegan calculadas por la API**; el front no cuenta casos.
- Sin casos en el período: «No hay casos vigentes con estos filtros.» en lugar de las secciones.

## Datos de ejemplo

```json
{
  "datosAl": "2026-09-25",
  "filtros": { "anio": 2026, "ciudad": null, "organismo": null },
  "totalVigentes": 127,
  "indicadores": { "victimas0a9": 31, "viaPublica": 58, "animalesVacunaDesconocida": { "noSabe": 46, "sinDato": 37 }, "totalAnimales": 129 },
  "graficos": {
    "tipoDeLugar": [
      { "valor": "via_publica", "casos": 58 }, { "valor": "casa_propia", "casos": 24 }, { "valor": "casa_ajena", "casos": 21 },
      { "valor": "espacio_publico", "casos": 13 }, { "valor": "zona_rural", "casos": 7 }, { "valor": "sin_dato", "casos": 4 }
    ],
    "tenencia": [
      { "valor": "ajeno_desconocido", "animales": 52 }, { "valor": "ajeno_conocido", "animales": 22 }, { "valor": "propio", "animales": 31 },
      { "valor": "no_sabe", "animales": 14 }, { "valor": "sin_dato", "animales": 10 }
    ],
    "zonaDelCuerpo": { "conTratamiento": 118, "valores": [
      { "valor": "piernas", "casos": 41 }, { "valor": "manos", "casos": 26 }, { "valor": "brazos", "casos": 19 },
      { "valor": "cabeza", "casos": 16 }, { "valor": "tronco", "casos": 8 }, { "valor": "multiples", "casos": 8 }
    ] },
    "gravedad": { "conTratamiento": 118, "valores": [
      { "valor": "herida_superficial", "casos": 71 }, { "valor": "herida_profunda", "casos": 29 },
      { "valor": "excoriacion", "casos": 9 }, { "valor": "sin_dato", "casos": 9 }
    ] }
  }
}
```

Los valores van en `snake_case` (`via_publica`, `herida_superficial`, `sin_dato`); la etiqueta de
pantalla es aparte. Zona del cuerpo y gravedad suman lo mismo: los **118 casos vigentes con
tratamiento** (`conTratamiento`), con los mismos valores que Inicio. Tipo de lugar suma los 127 casos
vigentes. Las demás series siguen la misma forma; los valores de ejemplo están en Figma.

## Lo que depende de quién mira

Son cifras agregadas, sin datos personales: las ven **agentes y analistas**. El **administrador** no ve
casos; la vista no le aparece.

## Responsive

En teléfono, un gráfico por fila y los indicadores uno debajo del otro.

## Pendiente: no lo implementes todavía

- **Tipo de lesión:** ya no existe como dato (lo reemplazó el tipo de evento, que se clasifica en la
  ficha del caso). No hay gráfico de tipo de lesión.
- Si un **gráfico por tipo de evento** hace falta en Estadísticas, está por decidirse (no está en Figma).
