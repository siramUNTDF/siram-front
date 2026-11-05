## Context

Los campos de fecha son el componente `Texto` (`src/componentes/formulario/Campos.jsx`) con
`tipo="date"` o `tipo="datetime-local"`. `Texto` arma la etiqueta (`Etiqueta`, con * y ayuda), un
`InputBase` con `estiloEntrada` y la línea de error de 20 px (`Error`). Los formularios guardan el
valor como texto `AAAA-MM-DD` y lo validan en su función de validación, con `fechaFutura`
(`src/utiles/validacion.js`), que compara contra la fecha real del equipo. Los filtros de
Búsqueda y Exportar viajan en la URL con ese mismo formato.

## Goals / Non-Goals

**Goals:**
- Un único `CampoFecha` y un único `CampoFechaHora` con la misma interfaz que `Texto`, para que
  reemplazarlos en cada pantalla sea cambiar el componente.
- Aspecto igual al de los demás campos: etiqueta, borde, foco, error y fuente mono.

**Non-Goals:**
- Rangos de fechas en un solo campo (DateRangePicker es de la versión paga de MUI X).
- Cambiar cómo se muestran las fechas fuera de los campos.

## Decisions

- **`@mui/x-date-pickers` 8.29.5 (MIT), no la 9.x.** La 9.17.0 salió el 30/10/2026, hace menos
  de una semana. La 8.x es la misma línea que usa Delta (8.1.0), está madura y declara
  compatibilidad con MUI 7.3 y React 19. Versión exacta, como el resto del `package.json`.
- **`date-fns` 4.1.0 con `AdapterDateFns` y el locale `es`**, no dayjs. Delta usa date-fns, y su
  locale `es` ya trae los nombres en español y la semana que empieza el lunes. Delta tiene la 2.30,
  pero SIRAM no está atado a sus versiones (`docs/README.md`).
- **`LocalizationProvider` en `src/main.jsx`**, envolviendo la app dentro de `TemaProvider`, con
  `adapterLocale={es}` y los textos `esES` de `@mui/x-date-pickers/locales`. Así cada campo
  solo fija su `format`.
- **Formato fijo por prop:** `format="dd/MM/yyyy"` y `format="dd/MM/yyyy HH:mm"` con `ampm={false}`.
  Es lo que garantiza el formato, sin importar el idioma del navegador.
- **Interfaz:** `CampoFecha({ etiqueta, valor, onCambio, error, requerido, ayuda, sinFuturas,
  mono, sx })`. `CampoFechaHora` tiene la misma, sin `sinFuturas`. Por dentro, la cadena se
  convierte a `Date` y de vuelta a cadena con `format`/`parse` de date-fns, en hora local.
- **Valor inválido = la constante `FECHA_INVALIDA`** (`'invalida'`), exportada desde
  `validacion.js` junto con `fechaInvalida(v)`. Se eligió así porque, si un valor inválido se
  entregara como vacío, un campo opcional se guardaría en silencio sin la fecha que la persona
  escribió a medias. Cada validación de formulario agrega
  `if (fechaInvalida(v.x)) e.x = 'La fecha no existe o está incompleta'`, antes de las demás
  comprobaciones de ese campo. `fechaFutura` devuelve `false` para ese valor, para no mostrar dos
  errores. En Búsqueda y Exportar, el valor inválido no se escribe en la URL.
  Alternativa descartada: que el campo muestre su propio error sin avisarle al formulario; no
  impide guardar.
- **Mostrar el error:** cuando la fecha es inválida y el formulario todavía no pasó un error, el
  campo muestra el suyo **al salir del campo** (no mientras se escribe, para no marcar error a
  mitad de una fecha). El error que pasa el formulario tiene prioridad.
- **Fecha a medio escribir (detectado al implementar):** si el campo estaba vacío, MUI no informa
  nada hasta que la fecha está completa. Por eso, al salir del campo, si quedó algo escrito y no
  hay fecha, el campo entrega `FECHA_INVALIDA`; si se borró todo, entrega vacío. Con un valor
  inválido se le devuelve al selector lo último que él mismo informó, para que no redibuje el campo
  y borre lo escrito. Limitación: si la persona aprieta Enter en Búsqueda sin salir del campo, la
  fecha a medio escribir cuenta como vacía.
- **`sinFuturas` → `disableFuture`** del picker, que usa la fecha real, igual que `fechaFutura`.
  Los campos con `sinFuturas`: Fecha del hecho (Nuevo caso y ficha), ¿Cuándo pasó?, Fecha de la
  denuncia y Fecha de la consulta.
- **Etiqueta:** el campo de MUI va sin etiqueta propia (con etiqueta, MUI oculta la guía
  `dd/mm/aaaa` del campo vacío) y se asocia a nuestra `Etiqueta` con `aria-labelledby`.
- **Aspecto:** se reusan `Etiqueta` y `Error` de `Campos.jsx`, y se lleva `estiloEntrada` al
  campo del picker por `slotProps.textField` (borde, foco con `foco`, error, fondo), con la fuente
  mono si corresponde. El ícono del calendario va con el color `text.tertiary`. La ventana del
  calendario toma colores y tipografía del tema. Componentes que se crean: `CampoFecha` y
  `CampoFechaHora`. Se reusan `Etiqueta`, `Error` y `estiloEntrada`. Tokens nuevos: ninguno.
- **Teléfono:** `DatePicker` usa la versión de escritorio o la móvil según el dispositivo
  (`pointer: fine`). En el teléfono abre el calendario en una ventana; se acepta así.

## Risks / Trade-offs

- [Los estilos internos del campo de MUI X (secciones dd/mm/aaaa) no aceptan todo lo de
  `estiloEntrada` tal cual] → Ajustarlo en la tarea de aspecto y revisarlo al lado de un `Texto`.
  Sin colores literales.
- [La persona escribe `05-11-2026` con guiones] → El campo avanza por secciones y muestra siempre
  `/`. Se verifica que escribir los dígitos, con o sin separador, termine en `05/11/2026`. Si pegar
  `05-11-2026` no funciona, se anota como limitación.
- [Peso del bundle: MUI X y date-fns suman decenas de kB] → Es aceptable para un panel interno.
  El build ya avisa por tamaño de chunk; no se separa el código ahora.
- [`'invalida'` es un valor mágico] → Queda centralizado en `FECHA_INVALIDA` y `fechaInvalida`.
  Ningún formulario compara el texto a mano.
