## 1. Implementación

- [x] 1.1 En `RevisarSolicitud.jsx`, debajo de `Datos` del bloque «Dónde y qué pasó», agregar el
  `Mapa` (alto 220, `centro` y un solo punto en `hecho.latitud`/`hecho.longitud`) y la línea «Pin
  del hecho (lat; lon)» en mono, solo si `s.hecho.latitud != null`. Verificar en
  `/casos/solicitudes/S-2026-0034` que aparece el punto en -54.8069; -68.3073 con ese texto

## 2. Verificación

- [ ] 2.1 Abrir `/casos/solicitudes/S-2026-0036` (con dirección y sin coordenadas) y verificar que no hay mapa ni
  coordenadas ni hueco
- [ ] 2.2 Enviar una solicitud desde `/reportar`, completar «¿Dónde fue?» moviendo el mapa y
  verificar que al revisarla el punto coincide con el que quedó bajo el pin
- [ ] 2.3 Arrastrar el mapa de la revisión, volver a abrir la solicitud y verificar que el punto, la
  dirección y las coordenadas no cambiaron (RN-05 · RN-08 · RN-31)
- [ ] 2.4 Revisar en teléfono (< 900 px) que el mapa ocupa el ancho del bloque sin scroll horizontal
- [x] 2.5 Verificar que no quedaron colores literales fuera de `src/tema/tokens.js`
  (`grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(" src/pantallas/casos/solicitudes/RevisarSolicitud.jsx`
  sin resultados nuevos)
- [x] 2.6 Verificar que `npm run lint` y `npm run build` pasan
- [ ] 2.7 (Postergada: Figma se revisa y se actualiza con el diseño final.) Revisar Revisar
  solicitud contra Figma
