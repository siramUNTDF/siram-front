## 1. Dependencias y proveedor

- [x] 1.1 Instalar `@mui/x-date-pickers@8.29.5` y `date-fns@4.1.0` con versión exacta
  (`npm install -E`); verificar que figuran en `package.json` sin `^` y que `npm run build` pasa
- [x] 1.2 En `src/main.jsx`, envolver la app con `LocalizationProvider` (`AdapterDateFns`,
  `adapterLocale={es}`, `localeText` de `esES`) dentro de `TemaProvider`; verificar que la app
  arranca sin errores en consola

## 2. Componentes

- [x] 2.1 En `src/utiles/validacion.js`, agregar `FECHA_INVALIDA` y `fechaInvalida(v)`, y hacer que
  `fechaFutura` devuelva `false` para ese valor; verificar con lint
- [x] 2.2 Crear `CampoFecha` en `src/componentes/formulario/Campos.jsx` (`format="dd/MM/yyyy"`,
  `sinFuturas` → `disableFuture`, valor `AAAA-MM-DD`, vacío o `FECHA_INVALIDA`), reusando
  `Etiqueta`, `Error` y `estiloEntrada`; verificar con el navegador en inglés que muestra
  `dd/mm/aaaa`, que escribir `05112026` da `05/11/2026` y que `31/02/2026` muestra el error
- [x] 2.3 Crear `CampoFechaHora` (`format="dd/MM/yyyy HH:mm"`, `ampm={false}`, valor
  `AAAA-MM-DDTHH:mm`); verificar que muestra `22/09/2026 10:15` y entrega `2026-09-22T10:15`
- [x] 2.4 Ajustar el aspecto (borde, foco, error, fondo, fuente mono, ícono, calendario en
  español y semana desde el lunes) y compararlo al lado de un `Texto` en el mismo formulario

## 3. Pantallas

- [x] 3.1 Nuevo caso: Fecha del hecho → `CampoFecha sinFuturas`, con `fechaInvalida` en la
  validación; verificar que guardar con fecha de hoy funciona, con fecha futura muestra el error y
  con `31/02/2026` muestra «La fecha no existe o está incompleta»
- [x] 3.2 Formulario público: ¿Cuándo pasó? → `CampoFecha sinFuturas`, igual que 3.1; verificar
  que la fecha de hoy se acepta
- [x] 3.3 Ficha (`Ventanas.jsx`): Fecha del hecho, Fecha de la denuncia y Fecha de la consulta →
  `CampoFecha sinFuturas`, con `fechaInvalida`; verificar que una fecha incompleta en Fecha del
  hecho (opcional) impide guardar
- [x] 3.4 Búsqueda y Exportar: desde/hasta → `CampoFecha`; una fecha inválida no se escribe en la
  URL. Verificar que filtrar desde `01/09/2026` deja `desde=2026-09-01` en la URL y que al
  recargar el campo muestra `01/09/2026`
- [x] 3.5 Historial: Fecha y hora → `CampoFechaHora`; verificar que «Ver» muestra el historial a
  esa fecha y hora como antes

## 4. Verificación

- [x] 4.1 `grep -rnE 'tipo="(date|datetime-local)"|type="(date|datetime-local)"' src` sin
  resultados
- [x] 4.2 Revisar en teléfono (< 900 px): el calendario se abre y la fecha queda en `dd/mm/aaaa`
- [x] 4.3 Revisar las reglas «no puede ser futura» de `docs/vistas/` (nuevo-caso,
  formulario-publico, ficha-del-caso) en cada campo que las tiene
- [x] 4.4 Verificar que no quedaron colores literales fuera de `src/tema/tokens.js`
  (`grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(" src/componentes/formulario/Campos.jsx` sin
  resultados nuevos)
- [x] 4.5 Verificar que `npm run lint` y `npm run build` pasan
- [ ] 4.6 (Postergada: las revisiones contra Figma se hacen con la página terminada.) Revisar los formularios afectados contra Figma: los campos de fecha se ven como los
  demás campos
