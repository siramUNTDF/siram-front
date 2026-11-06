## Purpose

Define cómo ve el agente, al revisar una solicitud del formulario público, el lugar del hecho que
marcó la persona en el mapa, antes de registrarla o sumarla a un caso.

## ADDED Requirements

### Requirement: Mapa con el punto declarado en la revisión
Al revisar una solicitud que tiene coordenadas del hecho, el sistema SHALL mostrar en el bloque
«Dónde y qué pasó», debajo de sus datos, un mapa centrado en ese punto con un único punto marcado.
Debajo del mapa se muestran las coordenadas en texto: «Pin del hecho (latitud; longitud)». El mapa
SHALL verse igual que el del bloque «Hecho» de la ficha del caso.

#### Scenario: Solicitud con ubicación
- **WHEN** el agente abre `/casos/solicitudes/S-2026-0034`
- **THEN** el bloque «Dónde y qué pasó» muestra la Ubicación «Kuanip 1240» con su nota y, debajo, un
  mapa con un punto en -54.8069; -68.3073 y el texto «Pin del hecho (-54.8069; -68.3073)»

#### Scenario: Solicitud enviada desde el formulario público
- **WHEN** una persona completa «¿Dónde fue?» en `/reportar` y el agente abre esa solicitud
- **THEN** el mapa muestra el punto que quedó bajo el pin al guardar esa parte

### Requirement: Sin coordenadas no hay mapa
Si la solicitud no tiene coordenadas del hecho, el sistema SHALL omitir el mapa y las coordenadas, sin
mostrar «Sin dato» ni un espacio vacío en su lugar. Un dato que la persona no respondió no se
muestra.

#### Scenario: Solicitud sin coordenadas
- **WHEN** el agente abre `/casos/solicitudes/S-2026-0036`, que tiene dirección pero no coordenadas
- **THEN** el bloque «Dónde y qué pasó» muestra la Ubicación «Belgrano 455» sin la nota del pin, y no
  muestra mapa ni coordenadas

### Requirement: El mapa no modifica la solicitud
El mapa de la revisión SHALL ser solo de lectura. Se puede desplazar y acercar para mirar, pero no
cambia el punto ni la dirección de la solicitud, y no escribe en ningún caso ni persona.

#### Scenario: Mover el mapa
- **WHEN** el agente arrastra el mapa en la revisión y vuelve a abrir la solicitud
- **THEN** el punto, la dirección y las coordenadas son los mismos que antes
