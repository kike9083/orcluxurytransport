---
name: info-blocks
description: "Trigger: bloque informativo, formatear seccion, tarifas en bloques, structured info block, seccion de la web OrcLuxuryTransport. Convert a site section paragraph into the structured info-block format (panel, includes list, booking callout) in Spanish and English."
license: Apache-2.0
metadata:
  author: kike9083
  version: "1.0"
---

# Info blocks for OrcLuxuryTransport sections

## Activation Contract

Use when converting a paragraph-style section of `sitio-para-subir/index.html` (or `en/index.html`) into the structured three-part format: data panel, "includes" checklist, booking callout. Do not use on sections that are already structured.

## Hard Rules

- Edit BOTH `sitio-para-subir/index.html` (ES) and `sitio-para-subir/en/index.html` (EN). Mirror the text; never change only one language.
- Keep the H3 question heading and a 1-2 sentence citable lead paragraph (GEO requirement).
- Never invent facts, prices, or promises. Reuse only figures already on the site: USD 32/45/25/35/120/200, 24 km, 25-45 min, 60 min free wait, +507 6802-6916.
- Adapt any mockup to the design system: use CSS vars (--oro, --oro-claro, --borde-dorado, --marfil). Never hardcode mockup colors (#f39c12, #2ecc71) or Arial.
- Insert the component CSS once per file, before the `.faq{` rule (see `assets/bloques.css`).
- Files are CRLF: match content with `\n`, write back with `\r\n`.

## Decision Gates

| Content | Block |
|---|---|
| Prices, distances, schedules | `.tarifas__panel` + `ul.tarifas__lista` (strong label left, span value right, `.tarifas__precio` for money) |
| Benefits, what is included | `.tarifas__incluye` with `<h4>✔ …</h4>` and check-mark list items |
| Call to action | `.tarifas__reserva` with `<p class="tarifas__reserva-titulo">📲 …</p>` + one short paragraph, link `#reservar` when useful |

## Execution Steps

1. Locate the section by its H3 heading in both files.
2. Extract every hard fact from the current paragraph; map each fact to one list row.
3. Build the block using the Decision Gates table; keep the lead paragraph short and citable.
4. Paste the CSS from `assets/bloques.css` if `.tarifas__panel` is not yet present.
5. Verify: both languages updated (grep the H3 in both files), CRLF intact, no leftover duplicated markup; reload the local preview.

## Output Contract

Report: sections changed, facts preserved, files touched, verification result.

## References

- `assets/bloques.css` — component CSS to paste once per file
- `assets/mockup-referencia.html` — approved mockup (structure source; colors must be adapted)
