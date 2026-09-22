# Código del sitio web de OrcLuxuryTransport

Este paquete contiene todo el código del sitio **orcluxurytransport.com**.

Si usted es el propietario y no es técnico: **no necesita abrir nada de aquí.**
Lea `ENTREGA-RESUMEN.md` y guarde este archivo como respaldo. Entrégueselo a quien
le dé mantenimiento al sitio.

---

## Qué hay en cada carpeta

```
sitio-para-subir/
  index.html          El sitio completo en español
  en/index.html       El sitio completo en inglés
  escala-tocumen/     Landing del tour de escala (ES)
  en/escala-tocumen/  Landing del tour de escala (EN)
  404.html            La página que se muestra si alguien entra a una dirección que no existe
  sitemap.xml         Mapa del sitio para Google
  robots.txt          Instrucciones para los buscadores
  llms.txt            Resumen del sitio para asistentes de IA
  fotos/              Las fotos del sitio, ya optimizadas
  fotos/completas/    Las mismas fotos sin recortar (se usan al ampliar una imagen)

functions/api/resenas.js   El código que recibe y entrega las opiniones
esquema.sql                La estructura de la base de datos de opiniones
wrangler.toml              La configuración del despliegue
publicar.cmd               Publica el sitio (ver más abajo)

ENTREGA-RESUMEN.md    Documento para el propietario, en lenguaje sencillo
ENTREGA.md            Documento técnico con más detalle
```

---

## Cómo está hecho

HTML, CSS y JavaScript puro. **Sin frameworks ni dependencias:** no hay que instalar
ni compilar nada. Los archivos `index.html` se pueden abrir con doble clic y funcionan.

Cada archivo lleva una guía de edición comentada al inicio.

---

## Cómo publicar un cambio

El método principal es subir los cambios a GitHub (el sitio está conectado a
Cloudflare Pages y se despliega solo):

```
git add -A
git commit -m "cambio: descripción del cambio"
git push
```

Con eso alcanza. Cloudflare Pages detecta el `push` a la rama `main` y publica
la carpeta `sitio-para-subir/` en uno o dos minutos.

**Método manual de respaldo** (si GitHub no está disponible). Hace falta tener
instalado [Node.js](https://nodejs.org) y acceso a la cuenta de Cloudflare:

**1. Iniciar sesión** (una sola vez; la sesión caduca cada cierto tiempo):

```
npx wrangler login
```

**2. Publicar:**

```
publicar.cmd
```

---

## Dos cosas que hay que recordar

**Las dos versiones son archivos separados.** Si cambia un texto en `index.html`
(español), hay que cambiarlo también en `en/index.html` (inglés). No se sincronizan
solas.

**Para cambiar una foto,** reemplace el archivo dentro de `fotos/` conservando
exactamente el mismo nombre, y vuelva a publicar. El formato es horizontal 4:3,
1200 × 900 píxeles, en WebP.

---

## Las opiniones de clientes

El formulario del sitio guarda las opiniones en una base de datos de Cloudflare
(D1, llamada `resenas-orcluxury`).

**Ninguna opinión se publica sola.** Entra marcada como no aprobada y solo aparece en
la web cuando alguien la aprueba. Así, una opinión ofensiva o spam se queda guardada y
nunca llega al sitio.

Ver las pendientes:

```
npx wrangler d1 execute resenas-orcluxury --remote --command "SELECT id, nombre, estrellas, texto FROM resenas WHERE aprobada=0"
```

Aprobar una:

```
npx wrangler d1 execute resenas-orcluxury --remote --command "UPDATE resenas SET aprobada=1 WHERE id=3"
```

Borrar una:

```
npx wrangler d1 execute resenas-orcluxury --remote --command "DELETE FROM resenas WHERE id=3"
```

---

## Lo que no viene en este paquete

- **Las fotografías originales** sin procesar: ya están en el Google Drive del
  propietario, en su resolución completa.
- **El historial de cambios**: está en el repositorio de GitHub.
- **La carpeta `dist`**: se genera al publicar, no hace falta guardarla.

---

## Tarifas publicadas (batch SEO sep-2026)

Los precios "desde USD ..." publicados en el sitio son **promedios de mercado**
de referencia (traslado Tocumen desde 32/45, Albrook 25, por hora 35, tour de 4 h
120, día completo 200). Deben ajustarse a las tarifas reales y definitivas del
negocio:

1. Buscar "USD" en `sitio-para-subir/index.html` y `en/index.html` (tarjetas de
   servicio, sección Tarifas/FAQ, párrafo del hero, meta description, llms.txt).
2. Cambiar español e inglés a la vez para que no se contradigan.

## Plan de reseñas

Ver `PEDIR-RESENAS.md`. El sitio NO publica reseñas inventadas: solo reales y
aprobadas. Cuando existan 3 o más publicadas se puede agregar `aggregateRating`
al JSON-LD con valores calculados de las reseñas visibles.

---

## Video del hero

El hero admite un video de fondo. El archivo va en `sitio-para-subir/fotos/`:

- `hero.mp4` (H.264) — recomendado, compatible con todo
- `hero.webm` (VP9) — opcional, más liviano

Requisitos recomendados: **sin audio**, 8-12 segundos, bucle sin corte, 1920×1080 y
**menos de 4 MB**. Duración corta y buena compresión: es lo que más pesa en la carga
de la página.

Si el archivo no existe, no carga o el visitante pidió menos movimiento, el sitio
muestra automáticamente la foto `portada.webp` y no queda ningún hueco negro. No hay
que tocar código: basta con dejar el archivo con ese nombre y volver a publicar.

---

## Tarjetas de destinos

Las tarjetas de la sección Destinos y sus botones de WhatsApp son texto normal del
HTML. Para cambiar el mensaje que envía cada botón, busque `data-wa` en
`index.html`: ahí está el mensaje exacto que se abre en WhatsApp. Si cambia el
número en `CONFIG.whatsapp` (dentro del `<script>`), los botones se actualizan
solos al cargar la página.

Los precios que muestran las tarjetas (USD 120 por 4 h, USD 200 por 8 h) son los
mismos del servicio privado; si cambian las tarifas, busque "USD" y actualice
tarjetas, itinerarios y sección Tarifas a la vez, en español e inglés.
