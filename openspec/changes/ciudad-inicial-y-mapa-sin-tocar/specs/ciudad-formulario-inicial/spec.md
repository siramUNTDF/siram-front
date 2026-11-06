## Purpose

Define la ciudad del hecho como parte del formulario inicial común a los cuatro canales: dónde se
pregunta, que es obligatoria y qué guarda la solicitud o el caso.

## ADDED Requirements

### Requirement: Ciudad en el formulario inicial de todos los canales
El formulario inicial SHALL preguntar la ciudad del hecho, con las opciones Ushuaia, Río Grande y
Tolhuin, sin «Otra», y la ayuda «Si fue fuera de las tres ciudades, marcá la más cercana». La
pregunta aparece en el formulario público, en el bloque «El hecho», y en Nuevo caso, en el bloque
«Hecho».

#### Scenario: Formulario público
- **WHEN** una persona abre `/reportar`
- **THEN** el bloque «El hecho» muestra «¿Cuándo pasó?», «¿Qué animal fue?» y Ciudad con las tres
  opciones

#### Scenario: Nuevo caso
- **WHEN** un agente de cualquier organismo abre Nuevo caso
- **THEN** el bloque «Hecho» muestra Ciudad con las mismas tres opciones

### Requirement: Obligatoria en todos los canales
La ciudad SHALL ser obligatoria en los cuatro canales. Sin ella no se envía la solicitud del formulario
público ni se crea el caso en Nuevo caso, sea el agente de Zoonosis, CADIC o Salud. Ningún caso ni
solicitud nace sin ciudad.

#### Scenario: Enviar sin ciudad
- **WHEN** una persona completa el formulario público sin elegir la ciudad y aprieta Enviar
- **THEN** la solicitud no se envía y la pregunta muestra el error «Contanos en qué ciudad fue»

#### Scenario: Caso sin ciudad
- **WHEN** un agente de Salud guarda Nuevo caso sin elegir la ciudad
- **THEN** el caso no se crea y la pregunta muestra el error «Elegí la ciudad del hecho»

#### Scenario: Marca de obligatoria en Nuevo caso
- **WHEN** un agente de Zoonosis, CADIC o Salud abre Nuevo caso
- **THEN** Ciudad aparece marcada con `*`

### Requirement: La ciudad se guarda al crear
La solicitud SHALL guardar la ciudad desde que se envía el formulario inicial, y el caso desde que se
crea. La ciudad se muestra en Revisar solicitud y en la ficha del caso sin necesidad del formulario
detallado.

#### Scenario: Solicitud que termina en el inicial
- **WHEN** una persona envía el formulario público eligiendo Tolhuin y aprieta Terminar acá
- **THEN** al revisar esa solicitud, el bloque «Dónde y qué pasó» muestra Ciudad «Tolhuin»

#### Scenario: Caso nuevo con ciudad
- **WHEN** un agente guarda Nuevo caso eligiendo Río Grande
- **THEN** la ficha del caso muestra Ciudad «Río Grande» en el bloque «Hecho»

### Requirement: «¿Dónde fue?» no vuelve a preguntar la ciudad
La parte «¿Dónde fue?» del formulario detallado SHALL omitir la pregunta Ciudad y centrar el mapa en la
ciudad elegida en el inicial.

#### Scenario: Mapa centrado en la ciudad del inicial
- **WHEN** una persona eligió Río Grande en el inicial y abre «¿Dónde fue?»
- **THEN** no aparece la pregunta Ciudad y el mapa está centrado en Río Grande
