## Purpose

Define cómo se ingresa una fecha, o una fecha y hora, en los formularios y filtros del front, para
que siempre sea dd/mm/aaaa sin importar el idioma del navegador.

## ADDED Requirements

### Requirement: Formato día/mes/año en todo campo de fecha
El sistema SHALL mostrar y pedir toda fecha que se ingresa como `dd/mm/aaaa`, y toda fecha y hora
como `dd/mm/aaaa HH:mm` en 24 horas. El formato NO DEBE depender del idioma del navegador ni del
sistema operativo. NO DEBE haber en el front ningún campo de fecha que use el selector nativo del
navegador.

#### Scenario: Navegador en inglés
- **WHEN** el navegador está configurado en inglés (Estados Unidos) y el usuario abre Nuevo caso
- **THEN** el campo Fecha del hecho muestra `dd/mm/aaaa` como guía, y al cargar el 5 de noviembre de
  2026 se lee `05/11/2026`

#### Scenario: Fecha y hora
- **WHEN** el usuario elige en el Historial el 22 de septiembre de 2026 a las 10:15
- **THEN** el campo muestra `22/09/2026 10:15`

#### Scenario: Sin campos nativos
- **WHEN** se buscan en el código campos con `type="date"` o `type="datetime-local"`
- **THEN** no hay ninguno

### Requirement: Escribir o elegir en el calendario
El sistema SHALL permitir cargar la fecha escribiéndola con el teclado o eligiéndola en un
calendario en español. El calendario muestra los meses y los días en español y las semanas
empiezan el lunes.

#### Scenario: Escribir la fecha
- **WHEN** el usuario escribe `05112026` en un campo de fecha vacío
- **THEN** el campo muestra `05/11/2026`

#### Scenario: Elegir en el calendario
- **WHEN** el usuario abre el calendario y elige un día
- **THEN** el campo muestra ese día en formato `dd/mm/aaaa`, y el calendario está en español con
  la semana empezando el lunes

### Requirement: Fechas incompletas o inexistentes
El sistema SHALL tratar como error una fecha incompleta o que no existe. Un formulario con una
fecha así NO DEBE poder guardarse, aunque el campo no sea obligatorio. En un filtro, una fecha así
NO DEBE aplicarse.

#### Scenario: Fecha que no existe
- **WHEN** el usuario escribe `31/02/2026` en Fecha de la denuncia e intenta guardar
- **THEN** no se guarda y el campo muestra el error «La fecha no existe o está incompleta»

#### Scenario: Fecha incompleta en un campo opcional
- **WHEN** el usuario escribe solo `05/11` en la Fecha del hecho de la ficha (opcional) e intenta
  guardar
- **THEN** no se guarda y el campo muestra el error «La fecha no existe o está incompleta»

#### Scenario: Fecha incompleta en un filtro
- **WHEN** el usuario escribe solo `05/11` en «Fecha del hecho: desde» de la Búsqueda
- **THEN** el filtro de fecha no se aplica hasta que la fecha esté completa

### Requirement: Fechas futuras
En los campos cuya fecha no puede ser futura (Fecha del hecho, Fecha de la denuncia, Fecha de la
consulta y ¿Cuándo pasó?), el sistema SHALL impedir elegir en el calendario días posteriores al día real de hoy. Si
se escribe una fecha futura, el formulario DEBE seguir mostrando su error «no puede ser futura» y
no guardarse.

#### Scenario: Calendario sin días futuros
- **WHEN** el usuario abre el calendario de Fecha del hecho en Nuevo caso
- **THEN** los días posteriores a hoy aparecen deshabilitados

#### Scenario: Fecha de hoy
- **WHEN** el usuario carga la fecha real de hoy en ¿Cuándo pasó? del formulario público
- **THEN** la fecha se acepta

#### Scenario: Fecha futura escrita
- **WHEN** el usuario escribe una fecha posterior a hoy en Fecha del hecho e intenta guardar
- **THEN** no se guarda y el campo muestra que la fecha no puede ser futura

### Requirement: Valor que recibe el formulario
El campo SHALL entregar al formulario la fecha como `AAAA-MM-DD`, y la fecha y hora como
`AAAA-MM-DDTHH:mm`, en hora local. Un campo vacío entrega un valor vacío. Una fecha incompleta o
inexistente entrega un valor que el formulario reconoce como inválido. Los datos guardados y los
filtros de la URL DEBEN seguir usando el mismo formato que antes.

#### Scenario: Valor guardado
- **WHEN** el usuario carga `05/11/2026` como Fecha del hecho y guarda el caso
- **THEN** el caso queda con la fecha del hecho `2026-11-05` y la ficha la muestra como
  `05/11/2026`

#### Scenario: Filtro en la URL
- **WHEN** el usuario filtra la Búsqueda desde el `01/09/2026`
- **THEN** la URL lleva `desde=2026-09-01`, y al abrir esa URL el campo muestra `01/09/2026`
