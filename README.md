<p align="center">
  <img src="https://orcluxurytransport.com/fotos/social.webp" alt="OrcLuxuryTransport" width="100%">
</p>

<h1 align="center">OrcLuxuryTransport</h1>

<p align="center">
  Sitio web de transporte turístico y ejecutivo en Panamá<br>
  <a href="https://orcluxurytransport.com">orcluxurytransport.com</a> ·
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

Página web de una sola página para **OrcLuxuryTransport**, servicio de traslados al aeropuerto, recorridos turísticos y transporte corporativo en Panamá. Diseñada para turistas internacionales y clientes ejecutivos, con contenido bilingüe (ES/EN) y reserva directa por WhatsApp.

**Stack:** HTML5, CSS3, JavaScript vanilla — sin frameworks, sin dependencias, sin compilation step.

## Características principales

| Feature | Detalle |
|---|---|
| **Bilingüe** | Español (`/`) e Inglés (`/en/`) con `hreflang` para SEO |
| **Galería** | 20 fotos WebP con CSS scroll snap + lightbox modal, lazy loading |
| **Reservas** | Formulario → WhatsApp (sin backend, el mensaje se arma en el navegador) |
| **Opiniones** | API serverless con moderación previa — nada se publica sin aprobación |
| **Mobile-first** | Diseño responsive, Carrusel nativo sin dependencias JS |
| **SEO** | Schema.org LocalBusiness, Open Graph, meta description, canonical URLs |
| **Performance** | Fotos WebP optimizadas (~4:3, 1200×900), carga diferida, sin librerías externas |

## Arquitectura

```
orcluxurytransport/
├── sitio-para-subir/            ← Código fuente del sitio
│   ├── index.html               ← Página principal (ES, ~1850 líneas)
│   ├── en/index.html            ← Versión inglesa (EN)
│   ├── 404.html                 ← Página de error bilingüe
│   └── fotos/                   ← Galería WebP optimizada
│       ├── completas/           ← Versiones sin recorte (lightbox)
│       └── resenas/             ← Fotos de clientes (pendiente)
│
├── functions/                   ← Cloudflare Pages Functions (serverless)
│   └── api/resenas.js           ← API de opiniones (GET/POST)
│
├── esquema.sql                  ← Schema de la base de datos D1
├── wrangler.toml                ← Configuración de Cloudflare Pages
├── publicar.cmd                 ← Script de deploy (Windows)
├── LEEME.md                     ← Documentación para el propietario
├── ENTREGA.md                   ← Documento técnico de entrega
└── ENTREGA-RESUMEN.md           ← Resumen ejecutivo (no-técnico)
```

## API de opiniones

Backend serverless en **Cloudflare Pages Functions** con base de datos **D1**.

### `GET /api/resenas`

Devuelve las opiniones aprobadas (máximo 60).

```json
{
  "ok": true,
  "resenas": [
    {
      "nombre": "María G.",
      "estrellas": 5,
      "servicio": "Tour Canal de Panamá",
      "texto": "Excelente servicio, muy puntual...",
      "creada": "2026-09-01T14:30:00.000Z"
    }
  ]
}
```

### `POST /api/resenas`

Registra una opinión nueva (queda pendiente de aprobación).

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
- Validación de longitud en servidor
- Sanitización contra XSS
- Moderación obligatoria (`aprobada = 0` por defecto)

### Gestión de opiniones

```bash
# Ver opiniones pendientes
npx wrangler d1 execute resenas-orcluxury --remote \
  --command "SELECT id, nombre, estrellas, texto FROM resenas WHERE aprobada=0"

# Aprobar una opinión
npx wrangler d1 execute resenas-orcluxury --remote \
  --command "UPDATE resenas SET aprobada=1 WHERE id=3"

# Eliminar una opinión
npx wrangler d1 execute resenas-orcluxury --remote \
  --command "DELETE FROM resenas WHERE id=3"
```

## Deploy

### Requisitos

- [Node.js](https://nodejs.org) (v18+)
- Cuenta de Cloudflare con Pages habilitado

### Publicar

```bash
# 1. Autenticarse (una vez, la sesión caduca)
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
├── /                          → dist/index.html
├── /en/                       → dist/en/index.html
├── /404.html                  → dist/404.html
├── /fotos/*                   → dist/fotos/*
└── /api/resenas               → functions/api/resenas.js (serverless)
                                    ↕ Cloudflare D1 (resenas-orcluxury)
```

## Costs

| Concepto | Costo |
|---|---|
| Dominio `orcluxurytransport.com` | ~US$10.44/año |
| Cloudflare Pages (hosting) | US$0 |
| Cloudflare D1 (base de datos) | US$0 (plan gratuito) |
| Certificado SSL | US$0 |
| **Total** | **~US$10.44/año** |

## Edición de contenido

| Qué cambiar | Dónde | Notas |
|---|---|---|
| Textos principales | `sitio-para-subir/index.html` | Buscar las secciones comentadas al inicio |
| Textos en inglés | `sitio-para-subir/en/index.html` | Mantener sincronizado con la versión ES |
| Fotos de destinos | `sitio-para-subir/fotos/` | Mantener nombre, formato WebP, 4:3 |
| Número de WhatsApp | `CONFIG.whatsapp` en `<script>` | Formato: código país + número |
| Opinioness | `functions/api/resenas.js` + D1 | Solo se publican tras aprobación |

## SEO y Analytics

- **Schema.org** `LocalBusiness` con datos estructurados
- **Open Graph** + Twitter Cards para compartición en redes
- **hreflang** ES/EN para motores de búsquedainternacionales
- **Cloudflare Web Analytics** (disponible desde el panel, sin cookies)

## Licencia

Propietario: [OrcLuxuryTransport](https://orcluxurytransport.com) — Panamá
