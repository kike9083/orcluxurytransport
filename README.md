<p align="center">
  <img src="https://orcluxurytransport.com/fotos/social.webp" alt="OrcLuxuryTransport" width="100%">
</p>

<h1 align="center">OrcLuxuryTransport</h1>

<p align="center">
  Sitio web de transporte turÃ­stico y ejecutivo en PanamÃ¡<br>
  <a href="https://orcluxurytransport.com">orcluxurytransport.com</a> Â·
  <a href="https://orcluxurytransport.com/en">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/html5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/css3-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/cloudflare_pages-F48120?style=flat&logo=cloudflarepages&logoColor=white" alt="Cloudflare Pages">
  <img src="https://img.shields.io/badge/cloudflare_d1-404289?style=flat&logo=cloudflare&logoColor=white" alt="Cloudflare D1">
</p>

---

## Sobre el proyecto

PÃ¡gina web de una sola pÃ¡gina para **OrcLuxuryTransport**, servicio de traslados al aeropuerto, recorridos turÃ­sticos y transporte corporativo en PanamÃ¡. DiseÃ±ada para turistas internacionales y clientes ejecutivos, con contenido bilingÃ¼e (ES/EN) y reserva directa por WhatsApp.

**Stack:** HTML5, CSS3, JavaScript vanilla â€” sin frameworks, sin dependencias, sin compilation step.

## CaracterÃ­sticas principales

| Feature | Detalle |
|---|---|
| **BilingÃ¼e** | EspaÃ±ol (`/`) e InglÃ©s (`/en/`) con `hreflang` para SEO |
| **GalerÃ­a** | 20 fotos WebP con CSS scroll snap + lightbox modal, lazy loading |
| **Reservas** | Formulario â†’ WhatsApp (sin backend, el mensaje se arma en el navegador) |
| **Opiniones** | API serverless con moderaciÃ³n previa â€” nada se publica sin aprobaciÃ³n |
| **Mobile-first** | DiseÃ±o responsive, Carrusel nativo sin dependencias JS |
| **SEO** | Schema.org LocalBusiness, Open Graph, meta description, canonical URLs |
| **Performance** | Fotos WebP optimizadas (~4:3, 1200Ã—900), carga diferida, sin librerÃ­as externas |

## Arquitectura

```
orcluxurytransport/
â”œâ”€â”€ sitio-para-subir/            â† CÃ³digo fuente del sitio
â”‚   â”œâ”€â”€ index.html               â† PÃ¡gina principal (ES, ~1850 lÃ­neas)
â”‚   â”œâ”€â”€ en/index.html            â† VersiÃ³n inglesa (EN)
â”‚   â”œâ”€â”€ 404.html                 â† PÃ¡gina de error bilingÃ¼e
â”‚   â””â”€â”€ fotos/                   â† GalerÃ­a WebP optimizada
â”‚       â”œâ”€â”€ completas/           â† Versiones sin recorte (lightbox)
â”‚       â””â”€â”€ resenas/             â† Fotos de clientes (pendiente)
â”‚
â”œâ”€â”€ functions/                   â† Cloudflare Pages Functions (serverless)
â”‚   â””â”€â”€ api/resenas.js           â† API de opiniones (GET/POST)
â”‚
â”œâ”€â”€ esquema.sql                  â† Schema de la base de datos D1
â”œâ”€â”€ wrangler.toml                â† ConfiguraciÃ³n de Cloudflare Pages
â”œâ”€â”€ publicar.cmd                 â† Script de deploy (Windows)
â”œâ”€â”€ LEEME.md                     â† DocumentaciÃ³n para el propietario
â”œâ”€â”€ ENTREGA.md                   â† Documento tÃ©cnico de entrega
â””â”€â”€ ENTREGA-RESUMEN.md           â† Resumen ejecutivo (no-tÃ©cnico)
```

## API de opiniones

Backend serverless en **Cloudflare Pages Functions** con base de datos **D1**.

### `GET /api/resenas`

Devuelve las opiniones aprobadas (mÃ¡ximo 60).

```json
{
  "ok": true,
  "resenas": [
    {
      "nombre": "MarÃ­a G.",
      "estrellas": 5,
      "servicio": "Tour Canal de PanamÃ¡",
      "texto": "Excelente servicio, muy puntual...",
      "creada": "2026-09-01T14:30:00.000Z"
    }
  ]
}
```

### `POST /api/resenas`

Registra una opiniÃ³n nueva (queda pendiente de aprobaciÃ³n).

```json
{
  "nombre": "Juan P.",
  "estrellas": 5,
  "servicio": "Traslado aeropuerto",
  "texto": "Muy profesional, lo recomiendo."
}
```

**Seguridad:**
- Campo trampa `web` contra bots (honeypot)
- ValidaciÃ³n de longitud en servidor
- SanitizaciÃ³n contra XSS
- ModeraciÃ³n obligatoria (`aprobada = 0` por defecto)

### GestiÃ³n de opiniones

```bash
# Ver opiniones pendientes
npx wrangler d1 execute resenas-orcluxury --remote \
  --command "SELECT id, nombre, estrellas, texto FROM resenas WHERE aprobada=0"

# Aprobar una opiniÃ³n
npx wrangler d1 execute resenas-orcluxury --remote \
  --command "UPDATE resenas SET aprobada=1 WHERE id=3"

# Eliminar una opiniÃ³n
npx wrangler d1 execute resenas-orcluxury --remote \
  --command "DELETE FROM resenas WHERE id=3"
```

## Deploy

### Requisitos

- [Node.js](https://nodejs.org) (v18+)
- Cuenta de Cloudflare con Pages habilitado

### Publicar

```bash
# 1. Autenticarse (una vez, la sesiÃ³n caduca)
npx wrangler login

# 2. Ejecutar el script de deploy
publicar.cmd          # Windows
```

El script (`publicar.cmd`) copia los archivos a `dist/` y ejecuta `wrangler pages deploy`.

En **Linux/macOS**:

```bash
mkdir -p dist/en
cp sitio-para-subir/index.html sitio-para-subir/404.html dist/
cp sitio-para-subir/en/index.html dist/en/
cp -r sitio-para-subir/fotos dist/fotos
npx wrangler pages deploy
```

### Estructura de deploy

```
Cloudflare Pages (orcluxurytransport.pages.dev)
â”œâ”€â”€ /                          â†’ dist/index.html
â”œâ”€â”€ /en/                       â†’ dist/en/index.html
â”œâ”€â”€ /404.html                  â†’ dist/404.html
â”œâ”€â”€ /fotos/*                   â†’ dist/fotos/*
â””â”€â”€ /api/resenas               â†’ functions/api/resenas.js (serverless)
                                    â†• Cloudflare D1 (resenas-orcluxury)
```

## Costs

| Concepto | Costo |
|---|---|
| Dominio `orcluxurytransport.com` | ~US$10.44/aÃ±o |
| Cloudflare Pages (hosting) | US$0 |
| Cloudflare D1 (base de datos) | US$0 (plan gratuito) |
| Certificado SSL | US$0 |
| **Total** | **~US$10.44/aÃ±o** |

## EdiciÃ³n de contenido

| QuÃ© cambiar | DÃ³nde | Notas |
|---|---|---|
| Textos principales | `sitio-para-subir/index.html` | Buscar las secciones comentadas al inicio |
| Textos en inglÃ©s | `sitio-para-subir/en/index.html` | Mantener sincronizado con la versiÃ³n ES |
| Fotos de destinos | `sitio-para-subir/fotos/` | Mantener nombre, formato WebP, 4:3 |
| NÃºmero de WhatsApp | `CONFIG.whatsapp` en `<script>` | Formato: cÃ³digo paÃ­s + nÃºmero |
| Opinioness | `functions/api/resenas.js` + D1 | Solo se publican tras aprobaciÃ³n |

## SEO y Analytics

- **Schema.org** `LocalBusiness` con datos estructurados
- **Open Graph** + Twitter Cards para comparticiÃ³n en redes
- **hreflang** ES/EN para motores de bÃºsquedainternacionales
- **Cloudflare Web Analytics** (disponible desde el panel, sin cookies)

## Licencia

Propietario: [OrcLuxuryTransport](https://orcluxurytransport.com) â€” PanamÃ¡
