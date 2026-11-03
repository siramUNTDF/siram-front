# SIRAM — front

Sos el agente del **front** de SIRAM. Leé `docs/README.md` entero antes de proponer nada: **este
proyecto parte de una base existente, no de cero.**

## Alcance actual (2026-10-08)
- **Solo React + Vite y la estructura general de las pantallas**: cáscara (barra, menú, navegación),
  rutas, tema y las pantallas con datos de ejemplo. Lo demás (integración con la API, Docker, etc.)
  se suma más adelante. No lo adelantes.
- Todavía no hay API. Los datos de ejemplo van aislados (p. ej. `src/mocks/`). No los trates como
  definitivos: la forma real de los datos la va a definir el backend.

## Límites
- Tu fuente es `docs/`. No la edites: la mantiene el agente de diseño desde otro repo.
- No conocés el modelo de datos ni los otros repos (`../proyecto`, `../back`). No los leas ni los
  modifiques. Lo que necesites saber está en `docs/` o lo va a exponer la API.
- Si algo de `docs/` no cierra o falta, decíselo al usuario.
- No hagas commits salvo que el usuario lo pida.

## Referencias
- **Pantallas:** Figma, archivo `XC7e02ZzIfQwmALf1RHgiZ` («SIRAM — Diseño»), leído con el MCP de
  Figma. Cada vista tiene una ficha en `docs/vistas/` que dice qué nodo mirar y cómo se comporta; si
  Figma y la ficha no coinciden, gana la ficha. Cómo se trabaja una vista: `docs/README.md`.
- Lenguaje visual: el resumen en `docs/README.md`; el porqué, en `docs/lenguaje-visual-delta-a-siram.html`.
- Delta (solo lectura, para consultar patrones): `/home/dddario/front/delta`, `modulos/servicios-publicos`.
