## 1. Ciudad en el formulario inicial

- [x] 1.1 `FormularioInicial.jsx`: agregar Ciudad (`catalogos.ciudades`, con ayuda, `requerido`) en
  «El hecho», con el error «Contanos en qué ciudad fue» en `validar`. Verificar que Enviar sin
  ciudad muestra el error y no envía
- [x] 1.2 `servidor.js` (`enviarSolicitud`): guardar `hecho.ciudad` con la clave elegida. Verificar
  que una solicitud enviada con Tolhuin, terminada en el inicial, muestra Ciudad «Tolhuin» en Revisar
  solicitud
- [x] 1.3 `sesionReporte.iniciar` recibe la ciudad, y `FormularioInicial` se la pasa. Verificar que
  la sesión la conserva al ir a «¿Dónde fue?»
- [x] 1.4 `NuevoCaso.jsx`: agregar Ciudad obligatoria (`*`) en «Hecho», para todos los canales,
  con el error «Elegí la ciudad del hecho», y enviarla como `lugar.ciudad` en texto (`Ushuaia`).
  Verificar con los perfiles de Zoonosis, CADIC y Salud que sin ciudad no se guarda, y que un caso
  creado con Río Grande la muestra en la ficha
- [x] 1.5 `datos.js`: completar la ciudad de S-2026-0031 (`ushuaia`, coincide con su caso
  C-2026-0418), S-2026-0035 (`ushuaia`) y S-2026-0032 (`tolhuin`); S-2026-0036 ya la tenía. Además,
  S-2026-0036 queda sin coordenadas, como dice la ficha actualizada (solo S-2026-0034 las tiene).
  Verificar que las seis solicitudes tienen ciudad

## 2. Mapa oscurecido hasta el primer gesto

- [x] 2.1 `Mapa.jsx`: props `aviso` y `onPrimerGesto`. Oscurecido con tokens y `pointer-events:
  none`, atribución por encima, y detección con `dragstart`, botones de zoom y flechas del teclado.
  Verificar que un `setView` automático no llama a `onPrimerGesto`
- [x] 2.2 `DondeFue`: quitar la pregunta Ciudad y la copia local de `ciudades`, centrar el mapa en la
  ciudad de la sesión, agregar el estado `movido`, ignorar `onMover` mientras sea falso, y armar
  `datos()` sin `punto`/`latitud`/`longitud` si no se movió. Verificar que al abrir la parte la
  Dirección queda vacía
- [ ] 2.3 Verificar en el navegador:
  - sin mover el mapa, escribir «San Martín 800» y apretar Siguiente: la solicitud queda sin
    coordenadas y con esa dirección;
  - moviendo el mapa: se propone la dirección y se guardan las coordenadas;
  - con Terminar acá: el mismo comportamiento;
  - al volver con atrás: el mapa aparece sin oscurecer.

## 3. Verificación

- [x] 3.1 Revisar contra las reglas: RN-05 · RN-08 · RN-31 (la solicitud no escribe en un caso),
  RN-32 (la ciudad en la sesión no va a la URL ni a `localStorage`), y lo que sigue vigente de
  `formulario-publico.md`: todo opcional en el detallado, atribución siempre visible, la dirección
  corregida a mano no se pisa
- [ ] 3.2 Revisar en teléfono (< 900 px): el aviso se lee entero, el primer arrastre con el dedo mueve
  el mapa, y no hay scroll horizontal
- [x] 3.3 Verificar que no quedaron colores literales fuera de `src/tema/tokens.js`
  (`grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(" src/componentes/mapa/Mapa.jsx src/pantallas/publico/*.jsx src/pantallas/casos/nuevo/NuevoCaso.jsx`
  sin resultados nuevos)
- [x] 3.4 Verificar que `npm run lint` y `npm run build` pasan
- [ ] 3.5 (Postergada: Figma se revisa y se actualiza con el diseño final.) Revisar el formulario
  público y Nuevo caso contra Figma
