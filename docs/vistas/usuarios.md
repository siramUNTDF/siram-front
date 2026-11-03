# Vista · Administración › Usuarios

> Ficha de vista entregada por el agente de diseño (repo `../proyecto`). No la edites desde el front:
> si algo no cierra, avisá al usuario. Fecha: 2026-11-03.
> **Lo visual está en Figma; esta ficha dice lo que Figma no dice** (comportamiento, datos, estados).
> Si Figma y esta ficha no coinciden, gana la ficha.

## Dónde verla

- Figma: archivo `XC7e02ZzIfQwmALf1RHgiZ`, página **Consultas y Administración**:
  - **«Administración › Usuarios»** (nodo `68:1808`): la lista.
  - **«… · Nuevo usuario»** (nodo `69:2180`), **«… · Desactivar»** (nodo `69:2411`) y **«Administración ›
    Usuarios · Reactivar»** (nodo `104:4802`): ventanas laterales.
  - **«Administración › Usuarios · Roles y permisos · v2»** (nodo `108:9371`): la segunda pestaña.
- Piezas, en **Fundamentos**: Pestaña (`65:259`), Tabla/*, Chip de filtro, Vigencia (`47:290`), Ventana
  lateral, Campo, Opción, Mensaje, Permiso (`65:268`).
- Rutas: `/administracion/usuarios` y `/administracion/usuarios/roles`.

## Para qué sirve

Las cuentas de las personas que usan SIRAM, cada una asociada a **un organismo** y **un rol**. Solo la
usa el **administrador**. **Un usuario no se borra: se desactiva**, porque los casos y el historial
dicen quién hizo cada cosa.

## Pestaña «Usuarios»

1. **Encabezado:** «Usuarios» · bajada «Cuentas de las personas que usan SIRAM en cada organismo. No se
   borran: se desactivan.»
2. **Pestañas:** Usuarios · Roles y permisos.
3. **Herramientas:** búsqueda «Buscar por nombre o correo» · botón **Nuevo usuario**.
4. **Filtros rápidos:** Todos · Administración · Agentes · Consulta · Inactivos. «Todos» y los de rol
   muestran solo **activos**; los inactivos, solo con su chip.
5. **Tabla:**

   | Columna | Línea principal | Segunda línea |
   |---|---|---|
   | Nombre | Nombre y apellido (destacado) | Correo |
   | Organismo | Nombre del organismo | — |
   | Rol | Administrador · Agente · Consulta | — |
   | Estado | Píldora Activo / Inactivo | — |
   | Último acceso | Fecha | Hora; o «Todavía no entró» + «Alta: 10/09/2026» |
   | (acciones) | Menú `⋮`: Editar · Desactivar (si está activo) · Reactivar (si está inactivo) | — |

   Orden: alfabético por nombre.

## Nuevo usuario (y Editar)

Ventana lateral: «Nuevo usuario» · bajada «Una cuenta por persona. El rol decide qué puede hacer en
SIRAM.»
- **Persona:** nombre y apellido * · correo electrónico *.
- **Acceso:** organismo * (lista de organismos **activos**) · rol * (opción con descripción):
  - **Administrador** — «Da de alta usuarios y organismos y mantiene los catálogos. No trabaja casos.»
  - **Agente** — «Registra casos, los completa, les da seguimiento y resuelve los posibles duplicados.»
  - **Consulta** — «Busca casos, ve estadísticas y exporta datos, sin editar. Para analistas y el comité.»
- Botón de texto «Ver qué puede hacer cada rol» → va a la pestaña Roles y permisos.
- Cancelar · Guardar.

Validaciones: correo con formato válido y **único** (si el back dice que ya existe: «Ya hay una cuenta
con ese correo», debajo del campo).

Al guardar: mensaje de éxito («Usuario creado. Le llega un correo para elegir su contraseña.») y vuelve
a la lista. Cómo recibe la contraseña la persona lo define el back; el front no pide contraseña.

**Editar** usa la misma ventana con los datos cargados (título «Editar usuario»). Cambiar el organismo o
el rol queda en el historial del usuario. Si alguien se edita a sí mismo, **no puede cambiarse su propio
rol** ni desactivarse (el back lo rechaza; el front no ofrece la opción).

## Desactivar

Ventana lateral: «Desactivar usuario» · nombre y organismo en la bajada.
- Mensaje de información: «No se borra nada. [Nombre] no va a poder entrar a SIRAM. Los casos que
  registró y su historial quedan como están, y la cuenta se puede volver a activar.»
- Motivo (opcional, texto libre).
- Cancelar · **Desactivar** (botón de peligro).

## Reactivar

Ventana lateral: «Reactivar usuario» · «Un usuario no se borra: se desactiva y se puede reactivar.»
- Datos de solo lectura: nombre, usuario, organismo, rol, «Desactivado: 02/10/2026 · por S. Valle
  (administración)».
- Mensaje de información: «Vuelve a poder entrar. Con el mismo rol y organismo. Sigue apareciendo donde
  actuó; la reactivación queda en el historial del usuario (sin credenciales).»
- Cancelar · **Reactivar**. Si su organismo está **inactivo**, el back lo rechaza: «Primero hay que
  reactivar el organismo».

## Pestaña «Roles y permisos»

**Solo lectura.** Documenta las reglas; no se configuran desde acá. Bajada: «Tentativa sacada de la
narrativa y aprobada por el equipo; falta validarla con los organismos. Se aplica en el servidor: el
front muestra solo lo que le llega.»

Tres tablas, con las celdas como el componente Permiso (Sí · No · A definir):

1. **Qué casos ve cada uno:** Agentes (Salud, Zoonosis, CADIC) — todos los casos y todas las
   solicitudes · Analista / Comité — los casos, sin datos personales · Administrador — no ve casos.
2. **Quién edita:** datos comunes (hecho, víctima, contacto, estado, animales y su descripción) —
   cualquier agente · tratamiento — solo Salud · seguimiento del animal (día 10, observaciones, dueño,
   tenencia, chip) — solo Zoonosis · denuncias y certificado médico — solo Zoonosis · lo que declaró la
   persona — nadie.
3. **Qué datos ve cada uno** (Salud · Zoonosis · CADIC · Analista):

   | Dato | Salud | Zoonosis | CADIC | Analista |
   |---|---|---|---|---|
   | Víctima y contacto (nombre, DNI, teléfono, correo) | Ve | Ve | Ve | No |
   | Hecho, tipo de evento, estado, marcas | Ve | Ve | Ve | Ve |
   | Tratamiento completo | Ve | Solo si existe | Solo si existe | Agregados |
   | Animal: descripción y tenencia | No | Ve | Ve | Ve |
   | Animal: dueño y chip | No | Ve | No | No |
   | Animal: observación del día 10 | Ve | Ve | Ve | Agregados |
   | Denuncia | Solo si existe | Ve | Solo si existe | Agregados |
   | Certificado médico | Ve | Ve | No | No |
   | Lo declarado (¿hizo denuncia? y motivo) | Ve | Ve | Ve | Ve |

   Nota: «“Solo si existe”: ve que el dato está (p. ej. “recibió atención”, “tiene denuncia”) sin el
   detalle. Salud ve el día 10 porque puede cambiar el tratamiento antirrábico de la víctima.»

Esta tabla es **texto fijo** de la pantalla (no viene de la API) y no cambia nada del comportamiento:
las reglas reales las aplica el back.

## Datos de ejemplo

```json
{
  "id": 8,
  "nombre": "Martín Acosta",
  "correo": "martin.acosta@ejemplo.org",
  "organismo": { "id": 1, "nombre": "Zoonosis Ushuaia" },
  "rol": "agente",
  "activo": true,
  "ultimoAcceso": "2026-09-12T15:47",
  "alta": "2026-08-20"
}
```

`rol` ∈ administrador · agente · consulta. `ultimoAcceso: null` = «Todavía no entró».

Filas de Figma (Todos 25 · Administración 2 · Agentes 19 · Consulta 4 · Inactivos 1): Carolina Paz
(Hospital Regional RG, Agente, 12/09 16:40) · Daniela Marchisoney (Ministerio de Salud TDF,
Administrador, 12/09 17:05) · Federico Luna (UNTDF, Consulta, 08/09 10:12) · Gabriel Sánchez (CAPS 3,
Agente, 11/09 09:30) · Jorge Benítez (Hospital Regional RG, Agente, 12/09 08:55) · Laura Puig (Hospital
Regional Ushuaia, Agente, 13/09 09:12) · Lucía Godoy (CADIC, Consulta, 05/09 14:20) · Martín Acosta
(Zoonosis Ushuaia, Agente, 12/09 15:47) · Paula Iriarte (Zoonosis Ushuaia, Agente, todavía no entró,
alta 10/09) · Romina Duarte (CAPS 5, Agente, **Inactivo**, 02/07 11:03). Correos `nombre.apellido@ejemplo.org`.

## Quién la ve

- Solo el **administrador**. Para el resto, Administración › Usuarios no aparece en el menú (la API no
  da el permiso).

## Pendiente: no lo implementes todavía

- **2FA y políticas de contraseña:** para más adelante. Por ahora el acceso es usuario y contraseña.
- **Cómo recibe la contraseña un usuario nuevo** (correo de invitación u otra cosa): lo define el back.
