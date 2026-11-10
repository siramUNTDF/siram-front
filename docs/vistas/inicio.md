# Vista · Inicio

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha. Por encima de las dos están las reglas de negocio
> (`../narrativa.md`, «Reglas de negocio»): si algo las contradice, avisá al usuario.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Inicio**, componente **«Inicio · v2»** (nodo
  `108:9618`).
- Piezas, en **Fundamentos**: Pendiente (`74:305`; variantes Incompletos, Esperando contacto,
  **Graves**, **Solicitudes**, Posibles duplicados, En seguimiento), Acceso a sección, Encabezado de
  sección, Gráfico/Columna (`47:283`), Gráfico/Barra (`47:270`), Encabezado de página, Nota de datos
  de ejemplo.
- Ruta: `/` (menú Inicio). Hoy muestra «En diseño».

## Para qué sirve

El panel de quien entra a trabajar: arriba, **lo que hay que resolver hoy**, ordenado por lo que frena
el registro (no por cantidad); abajo, el **panorama epidemiológico del año**; al final, accesos a las
secciones.

## Estructura (de arriba hacia abajo)

1. **Encabezado de página:** «Registro de ataques y mordeduras» · bajada «Provincia de Tierra del
   Fuego · datos al 25 de septiembre de 2026» (la fecha es la de los datos que llegan) · nota «Datos de
   ejemplo».
2. **Para resolver hoy** — bajada «Ordenado por lo que frena el registro, no por cantidad.» Tres niveles,
   cada uno con su rótulo y una fila de tarjetas (Pendiente):

   | Nivel (rótulo · aclaración) | Tarjeta | Cifra de ejemplo | Texto | Detalle | Al hacer clic |
   |---|---|---|---|---|---|
   | Bloquea el registro · «el caso no avanza hasta que alguien lo resuelva» | Incompletos (grande, rojo) | 23 | casos incompletos | Faltan datos obligatorios | `/casos/incompletos` |
   | | Esperando contacto (grande, azul) | 17 | casos esperando contacto | Falta un teléfono: hay que buscarlo por DNI | `/casos?filtro=en_seguimiento&motivo=contacto` (Bandeja con el chip *En seguimiento* y el filtro aplicado «Motivo: Esperando contacto») |
   | | **Graves** (grande, rojo, ícono de error) | 1 | caso grave | Un animal murió o enfermó en la observación | `/casos?filtro=graves` (Bandeja con el chip *Graves*) |
   | Espera tu revisión · «solicitudes para registrar y posibles duplicados para decidir» | **Solicitudes** (compacta, azul) | 3 | solicitudes pendientes | Del formulario público | `/casos/solicitudes` (chip *Pendientes*) |
   | | Posibles duplicados (compacta, violeta) | 8 | posibles duplicados | Esperan revisión | `/casos/duplicados` |
   | En curso · «no urge, pero no se cierra solo» | En seguimiento (compacta, ámbar) | 41 | casos en seguimiento | · con acción pendiente | `/casos?filtro=en_seguimiento` |

   - Toda la tarjeta es el enlace (la flecha → es decoración).
   - Singular/plural según la cifra («1 caso grave», «3 casos graves»).
   - **Una tarjeta con cifra 0 se muestra igual**, con su 0 (así se ve que no hay nada pendiente).
3. **Panorama 2026** — bajada «Todo lo que sigue se calcula sobre los casos vigentes: sin desestimados ni
   unificados.» A la derecha, el total: «127 · casos vigentes en el año». Cuatro gráficos en dos filas,
   cada uno con título, bajada (área · qué mide), el gráfico, una **nota** y el enlace «+ Ver los datos
   del gráfico»:

   | Gráfico | Bajada | Tipo | Notas |
   |---|---|---|---|
   | Casos por mes | Epidemiología · fecha del hecho | Columnas, ene → mes actual | El mes en curso va **punteado** («parcial · al 25/09») con la proyección («≈38 · proyectado») |
   | Zona del cuerpo lesionada | Epidemiología · lesión principal | Barras horizontales | «Cabeza» destacada. Nota fija: «Sale del tratamiento que carga Salud: los casos que no pasaron por Salud no tienen este dato.» |
   | Franja etaria de la víctima | Epidemiología · edad al momento del ataque | Columnas: 0–9 · 10–19 · 20–39 · 40–59 · 60+ | «0–9» destacada |
   | Canal de origen | Cobertura · quién carga los casos | Barras con cantidad y % | Zoonosis · Salud · CADIC · Ciudadano · Histórico. Nota fija: «Por dónde entró cada caso. “Ciudadano” son las solicitudes registradas; “Histórico”, registros viejos cargados a mano.» |

4. **Secciones** — tres accesos (ícono, título, bajada, botón «Ir»): Casos («Buscar, abrir y registrar
   casos de ataque o mordedura.») → `/casos`; Consultas («Armar reportes por zona, período y organismo,
   y exportarlos.») → `/consultas/busqueda`; Administración («Usuarios, organismos adheridos y tablas
   del sistema.») → `/administracion/usuarios`.

## Comportamiento

- **Proyección del mes en curso:** casos del mes ÷ días transcurridos × días del mes, redondeado. Solo
  para el mes actual del año actual; los meses cerrados van llenos.
- **«+ Ver los datos del gráfico»** despliega, debajo del gráfico, una tabla simple con las mismas
  cifras (categoría · casos, y % donde haya). Es la alternativa accesible al gráfico. El texto pasa a
  «− Ocultar los datos».
- **Destacados:** son fijos por diseño, no se calculan: «0–9» en la franja etaria y «Cabeza» en zona del
  cuerpo (los grupos más sensibles).
- **Notas:** van solo las notas **fijas** (las que explican qué cuenta el gráfico). Las frases de Figma
  con cifras («Septiembre está incompleto: 32 casos en 25 de los 30 días…», «0 a 9 años no es la barra
  más alta…») son ejemplos de lectura: no se generan.
- **Gráficos sin datos:** «Todavía no hay casos este año.»
- Las cifras **llegan de la API**; el front no cuenta casos.

## Datos de ejemplo

```json
{
  "datosAl": "2026-09-25",
  "pendientes": {
    "incompletos": 23, "esperandoContacto": 17, "graves": 1,
    "solicitudesPendientes": 3, "posiblesDuplicados": 8, "enSeguimiento": 41
  },
  "panorama": {
    "anio": 2026,
    "totalVigentes": 127,
    "casosPorMes": [
      { "mes": "2026-01", "casos": 13 }, { "mes": "2026-02", "casos": 13 }, { "mes": "2026-03", "casos": 11 },
      { "mes": "2026-04", "casos": 9 }, { "mes": "2026-05", "casos": 8 }, { "mes": "2026-06", "casos": 8 },
      { "mes": "2026-07", "casos": 11 }, { "mes": "2026-08", "casos": 22 },
      { "mes": "2026-09", "casos": 32, "parcial": true, "proyectado": 38 }
    ],
    "zonaDelCuerpo": { "conTratamiento": 118, "valores": [
      { "valor": "piernas", "casos": 41 }, { "valor": "manos", "casos": 26 }, { "valor": "brazos", "casos": 19 },
      { "valor": "cabeza", "casos": 16 }, { "valor": "tronco", "casos": 8 }, { "valor": "multiples", "casos": 8 }
    ] },
    "franjaEtaria": [
      { "franja": "0–9", "casos": 31 }, { "franja": "10–19", "casos": 22 }, { "franja": "20–39", "casos": 34 },
      { "franja": "40–59", "casos": 26 }, { "franja": "60+", "casos": 14 }
    ],
    "canalOrigen": [
      { "canal": "zoonosis", "casos": 41 }, { "canal": "salud", "casos": 58 }, { "canal": "cadic", "casos": 9 },
      { "canal": "ciudadano", "casos": 12 }, { "canal": "historico", "casos": 7 }
    ]
  }
}
```

(En Figma, febrero, marzo, abril, junio y julio no tienen cifra visible: los valores de arriba son
inventados para completar.) Las cifras cierran entre sí: los meses, la franja etaria y el canal de
origen suman los 127 casos vigentes; la zona del cuerpo suma los **118 casos vigentes con tratamiento**
(los mismos de Estadísticas: los que no pasaron por Salud no tienen el dato). Los valores van en
`snake_case` (`piernas`, `multiples`, `historico`); la etiqueta de pantalla («Piernas», «Múltiples»,
«Histórico») es aparte.

## Qué cuenta cada tarjeta

- **Incompletos, Posibles duplicados:** casos vigentes con esa marca (como las listas de trabajo).
- **Esperando contacto:** estado *en seguimiento* con motivo *contacto*.
- **Graves:** casos con la marca *grave* en estado *registrado* o *en seguimiento*. Es **el mismo
  criterio que el chip *Graves* de la Bandeja**, así que la cifra de la tarjeta y la de la lista a la que
  lleva coinciden. Los graves finalizados conservan la marca, pero no entran acá.
- **Solicitudes pendientes:** solicitudes en estado *pendiente*.
- **En seguimiento:** todos los casos *en seguimiento* (con cualquier motivo).

## Lo que depende de quién mira

El front muestra lo que llega:
- **Agentes:** todo, salvo la tarjeta **Solicitudes**, que solo llega a Zoonosis (2026-11-06: solo
  Zoonosis ve las solicitudes). Si la API no manda `solicitudesPendientes`, la tarjeta no se muestra.
- **Analista** (rol `analista`, en pantalla «Consulta»): no trabaja casos. Si la API no manda
  `pendientes`, la sección «Para resolver hoy» **no se muestra**; ve el panorama y los accesos.
- **Administrador:** no ve casos. Sin `pendientes` ni `panorama`, el Inicio muestra solo **Secciones**
  (y Casos y Consultas no aparecen si no tiene permiso; queda Administración).

## Responsive

En teléfono, las tarjetas pasan a una columna, los gráficos a uno por fila, y los accesos uno debajo
del otro.
