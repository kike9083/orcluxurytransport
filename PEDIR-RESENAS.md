# Plan de reseñas reales — OrcLuxuryTransport

Este reemplaza la idea de "crear reseñas": el sitio publica solo opiniones
reales, aprobadas por el dueño. Objetivo: 3-5 reseñas verificables.

## Paso 1 — Pedir a clientes existentes

Mandá este mensaje por WhatsApp a pasajeros de los últimos meses (adaptá el nombre):

> Hola [Nombre], gracias por viajar con OrcLuxuryTransport. Si el servicio fue
> de su agrado, le agradeceríamos mucho una reseña breve (nombre, desde dónde
> nos escribió y 2-3 líneas sobre su experiencia). Nos ayuda a crecer y la
> publicamos en orcluxurytransport.com con su permiso. Puede responder este
> mensaje directamente. ¡Saludos desde Panamá!

Con el permiso del cliente, la reseña se aprueba por D1 o se fija en el array
`RESENAS` de `index.html` (cada bloque: nombre, estrellas, servicio, texto,
fecha, foto opcional).

## Paso 2 — Reseñas en Google (más valiosas a largo plazo)

Cuando tengas el Google Business Profile verificado, activá el enlace corto de
reseñas (business.google.com → Perfil → Obtener enlace para reseñas) y mandalo
post-viaje:

> Gracias por viajar con nosotros. Si todo estuvo bien, le agradeceríamos una
> reseña en Google: [enlace corto GBP]

Las reseñas de GBP son las que Google muestra con estrellas en el mapa y en
búsqueda, y las que los motores de IA citan con más confianza.

## Paso 3 — Publicar en el sitio

1. El cliente escribe en el formulario de opiniones (queda pendiente, `aprobada=0`).
2. Revisar pendientes:
   `npx wrangler d1 execute resenas-orcluxury --remote --command "SELECT id,nombre,texto FROM resenas WHERE aprobada=0"`
3. Aprobar: `UPDATE resenas SET aprobada=1 WHERE id=N`
4. Recién cuando haya reseñas reales publicadas, agregar `aggregateRating` al
   JSON-LD (los valores deben calcularse de las reseñas visibles, nunca inventados).

## Qué NO hacer

- No publicar reseñas inventadas ni de "amigos" sin viaje real: viola políticas
  de Google, puede suspender el GBP y el sitio ya está documentado como honesto
  en este punto (ver comentario en el `<head>` de index.html).
