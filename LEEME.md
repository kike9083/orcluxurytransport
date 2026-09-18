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
  404.html            La página que se muestra si alguien entra a una dirección que no existe
  fotos/              Las fotos del sitio, ya optimizadas
  fotos/completas/    Las mismas fotos sin recortar (se usan al ampliar una imagen)
  fotos/resenas/      Fotos de quienes dejan opiniones (vacía por ahora)

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

Hace falta tener instalado [Node.js](https://nodejs.org) y acceso a la cuenta de
Cloudflare del propietario.

**1. Iniciar sesión** (una sola vez; la sesión caduca cada cierto tiempo):

```
npx wrangler login
```

**2. Publicar:**

```
publicar.cmd
```

Ese archivo copia lo necesario a la carpeta `dist` y lo sube. En Mac o Linux, los
mismos pasos a mano:

```
cp sitio-para-subir/index.html sitio-para-subir/404.html dist/
cp sitio-para-subir/en/index.html dist/en/
cp -r sitio-para-subir/fotos dist/fotos
npx wrangler pages deploy
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
