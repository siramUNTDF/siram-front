## Purpose

Define cómo la persona marca en «¿Dónde fue?» el lugar del hecho, y cuándo ese punto cuenta como
respondido, para que no se guarde un lugar que nadie eligió.

## ADDED Requirements

### Requirement: Mapa oscurecido hasta el primer gesto
En «¿Dónde fue?», el mapa SHALL aparecer oscurecido, con el aviso «Mové el mapa y dejá el pin donde
fue el ataque», hasta que la persona lo mueva. Mientras está oscurecido, igual responde a los gestos.
Solo cuentan los gestos de la persona: arrastrar, pellizcar, los botones de zoom o las flechas del
teclado. Un recentrado automático no lo cuenta. Cuando el aviso se va, no vuelve. La atribución
«© OpenStreetMap» queda siempre visible.

#### Scenario: Al abrir la parte
- **WHEN** una persona abre «¿Dónde fue?»
- **THEN** el mapa se ve oscurecido, con el aviso en el centro y la atribución visible

#### Scenario: Primer arrastre
- **WHEN** la persona arrastra el mapa
- **THEN** el oscurecido y el aviso desaparecen, y el mapa se ve y se maneja normalmente

#### Scenario: Zoom con los botones
- **WHEN** la persona aprieta el botón «+» del mapa oscurecido
- **THEN** el mapa se acerca y el oscurecido desaparece

### Requirement: Dirección propuesta solo tras mover el mapa
El sistema SHALL proponer la dirección solo al soltar el mapa después de un gesto de la persona. Nunca
la propone al abrir la parte ni por un recentrado automático.

#### Scenario: Sin tocar el mapa
- **WHEN** la persona abre «¿Dónde fue?» y no toca el mapa
- **THEN** el campo Dirección sigue vacío y sin la nota «La propuso el mapa al soltar el pin.»

#### Scenario: Después de mover
- **WHEN** la persona arrastra el mapa y lo suelta
- **THEN** el campo Dirección se completa con la dirección propuesta y la nota

### Requirement: Sin gesto no hay punto
Si la persona no movió el mapa, la parte «¿Dónde fue?» SHALL guardarse sin coordenadas, tanto con
Siguiente como con Terminar acá. Los demás datos que la persona completó (dirección escrita a mano,
referencias, tipo de lugar, hora) se guardan igual. Si lo movió, se guarda el punto que quedó bajo el
pin.

#### Scenario: Siguiente sin mover
- **WHEN** la persona escribe a mano la dirección «San Martín 800», no toca el mapa y aprieta
  Siguiente
- **THEN** la solicitud guarda la dirección «San Martín 800» y no tiene coordenadas, y Revisar
  solicitud no muestra la nota «Pin en el mapa…»

#### Scenario: Siguiente después de mover
- **WHEN** la persona arrastra el mapa, lo suelta y aprieta Siguiente
- **THEN** la solicitud guarda las coordenadas del punto bajo el pin

#### Scenario: Volver a la parte
- **WHEN** la persona movió el mapa, avanzó y vuelve con el botón atrás del navegador a «¿Dónde fue?»
- **THEN** el mapa se ve sin oscurecer, en el punto que había dejado
