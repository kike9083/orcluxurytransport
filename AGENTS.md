# AGENTS.md — orcluxurytransport

Sitio estático (HTML/CSS/JS puro, sin build) en `sitio-para-subir/`. Dos archivos espejo:
`sitio-para-subir/index.html` (ES) y `sitio-para-subir/en/index.html` (EN): todo cambio de
contenido o estilo se aplica en AMBOS. Publicar: commit + `git push` a `main` (Cloudflare
Pages está conectado al repo de GitHub y despliega solo, con output dir `sitio-para-subir/`
según `wrangler.toml`). `publicar.cmd` queda como método manual de respaldo (requiere
`npx wrangler login`).

## Skills del proyecto

- `.opencode/skill/info-blocks/` — convierte secciones de párrafo en bloques informativos
  estructurados (panel de datos + lista "incluye" + llamado a la acción) en español e inglés.
  Triggers: "bloque informativo", "formatear sección", "structured info block".
