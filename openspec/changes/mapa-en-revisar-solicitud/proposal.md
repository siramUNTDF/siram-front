## Why

En el formulario público la persona marca en un mapa dónde fue el hecho, y la solicitud guarda esas
coordenadas. Pero al revisarla (`/casos/solicitudes/:numero`) el agente solo ve la dirección en
texto, que la propuso el mapa y la persona pudo cambiar. El punto que marcó la persona no se ve
hasta que la solicitud se registra como caso. El usuario pidió verlo al revisar
(2026-11-06): para decidir si registrar o sumar la solicitud ayuda ver dónde fue sobre el mapa,
no solo una dirección.

## What Changes

- En Revisar solicitud, el bloque «Dónde y qué pasó» suma, debajo de los datos, un mapa de solo
  lectura con el punto que dejó la persona y sus coordenadas en texto. Es igual al que ya muestra
  la ficha del caso en el bloque «Hecho».
- El mapa aparece solo si la solicitud tiene coordenadas. Si no las tiene, no se muestra nada en
  su lugar, porque un dato que la persona no respondió no se muestra.
- Ver el mapa no cambia nada: la solicitud sigue sin escribir en casos ni personas hasta que un
  agente la registra (RN-05 · RN-08 · RN-31).

Referencia: el prototipo (`docs/prototipo-siram.html`) ya no está en `docs/`. La ficha
`docs/vistas/solicitudes.md` (paso 5, «Dónde y qué pasó») pide la ubicación solo como texto, con la
nota «Pin en el mapa; dirección propuesta y confirmada». **El mapa es un agregado pedido por el
usuario que la ficha no contempla.** Hay que avisarle al agente de diseño para que actualice la
ficha. Figma es una base, no el modelo final: se actualiza cuando el diseño esté terminado.

Fuera de alcance:
- Mostrar la ubicación en la tabla de Solicitudes.
- Editar o mover el punto desde la revisión.
- Cambiar cómo el formulario público toma el punto. Eso lo resuelve el change
  `ciudad-inicial-y-mapa-sin-tocar`: el mapa arranca oscurecido y, si la persona no lo mueve, la
  solicitud se guarda sin coordenadas. En ese caso este mapa no se muestra.

## Capabilities

### New Capabilities

- `ubicacion-solicitud`: cómo se muestra, al revisar una solicitud, la ubicación del hecho que
  declaró la persona en el formulario público.

### Modified Capabilities

_Ninguna._ Ninguna spec existente describe la revisión de solicitudes.

## Impact

- `src/pantallas/casos/solicitudes/RevisarSolicitud.jsx`: el bloque «Dónde y qué pasó» suma el mapa.
- Reusa `src/componentes/mapa/Mapa.jsx` sin cambiarlo.
- No toca mocks: la solicitud de ejemplo S-2026-0034 ya trae coordenadas, y las que se envían desde
  `/reportar` las guardan al completar «¿Dónde fue?».
- No toca reglas de negocio. Salud ve la ubicación igual que el resto: RN-34 solo le oculta la
  descripción del animal y la tenencia.
