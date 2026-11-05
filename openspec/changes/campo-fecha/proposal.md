## Why

Regla del usuario (2026-11-05): **todas las fechas se ingresan y se muestran como dd/mm/aaaa**,
nunca mes/día/año. Las fechas que se muestran ya la cumplen (`fechaCorta`, `fechaHora`). Pero los
campos donde se **ingresa** una fecha usan el selector nativo del navegador (`type="date"` y
`datetime-local`), que decide el formato según el idioma del navegador o del sistema. En un
navegador en inglés muestra mm/dd/aaaa, y una fecha como 05/11 se puede cargar al revés sin que nadie
lo note. `docs/` no define el formato; la regla es del usuario.

## What Changes

- Nuevos componentes `CampoFecha` y `CampoFechaHora`, basados en el DatePicker y el
  DateTimePicker de MUI X. Siempre muestran y piden dd/mm/aaaa (y HH:mm en 24 h), con el
  calendario en español, sin importar el idioma del navegador.
- Se pueden escribir con el teclado o elegir en el calendario.
- Una fecha incompleta o inexistente (31/02/2026) se marca como error y el formulario no se
  guarda.
- En los campos donde la fecha no puede ser futura, el calendario no ofrece días futuros. La
  validación del formulario («no puede ser futura») se mantiene.
- Reemplazan los 10 campos nativos actuales:
  - Nuevo caso: fecha del hecho.
  - Formulario público: ¿Cuándo pasó?
  - Ficha:
    - Editar hecho: fecha del hecho.
    - Anotar denuncia: fecha de la denuncia.
    - Tratamiento: fecha de la consulta.
  - Búsqueda: desde y hasta.
  - Exportar: desde y hasta.
  - Historial: fecha y hora.
- El valor que reciben los formularios no cambia: `AAAA-MM-DD`, y `AAAA-MM-DDTHH:mm` para fecha y
  hora.
- Dependencias nuevas: `@mui/x-date-pickers` y `date-fns`.

Referencia: el prototipo (`docs/prototipo-siram.html`) ya no está en `docs/`. Figma muestra los
campos de fecha como un campo más del formulario, y las fichas de `docs/vistas/` solo fijan
«no puede ser futura». Fuera de alcance: cambiar qué fechas son obligatorias, sus reglas o el
formato en que se muestran las fechas fuera de los campos.

## Capabilities

### New Capabilities

- `campos-fecha`: cómo se ingresa una fecha o una fecha y hora en cualquier formulario o filtro
  del front: formato, calendario, validación de fechas inexistentes y valor que entrega.

### Modified Capabilities

_Ninguna._ Ninguna spec existente describe los campos de los formularios.

## Impact

- `package.json`: `@mui/x-date-pickers` 8.29.5 y `date-fns` 4.x, con versiones exactas.
- `src/main.jsx`: proveedor de localización (español, date-fns).
- `src/componentes/formulario/Campos.jsx`: `CampoFecha` y `CampoFechaHora`.
- `src/utiles/validacion.js`: reconocer el valor «fecha inválida».
- Pantallas con campos de fecha:
  - `NuevoCaso.jsx`, `FormularioInicial.jsx`, `Ventanas.jsx`: reemplazan el campo y su
    validación.
  - `Busqueda.jsx`, `Exportar.jsx`: ignoran una fecha inválida en el filtro.
  - `Historial.jsx`: reemplaza el campo de fecha y hora.
- No toca mocks ni reglas de negocio (RN-xx). Las reglas «no puede ser futura» de las fichas se
  siguen cumpliendo.
