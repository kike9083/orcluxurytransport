/**
 * OrcLuxuryTransport — pre-production server
 *
 * Serves the static site from sitio-para-subir/ and implements the reviews API:
 *
 *   GET  /api/resenas   approved reviews only
 *   POST /api/resenas   receives a new review, stores it UNAPPROVED
 *   GET  /api/admin/resenas   list every review for moderation (ADMIN_TOKEN)
 *   POST /api/admin/resenas   approve / hide / delete a review (ADMIN_TOKEN)
 *
 * The JSON contract is identical to the original Cloudflare Pages Function
 * (functions/api/resenas.js) so the frontend works unchanged. Storage is an
 * Appwrite collection accessed through its REST API; swapping the data layer
 * for D1 in production only requires replacing the ADAPTER section below.
 */

const crypto = require("crypto");
const path = require("path");
const express = require("express");
const compression = require("compression");

/* ---------- Config (fails fast on missing env) ---------- */

const REQUIRED = [
  "APPWRITE_ENDPOINT",
  "APPWRITE_PROJECT_ID",
  "APPWRITE_KEY",
  "APPWRITE_DATABASE_ID",
  "APPWRITE_COLLECTION_ID"
];

const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing environment variables: " + missing.join(", "));
  process.exit(1);
}

const PORT = Number(process.env.PORT) || 3000;
const SITE_DIR = path.join(__dirname, "sitio-para-subir");

/* ---------- Appwrite REST adapter (ADAPTER) ---------- */

const AW_BASE = process.env.APPWRITE_ENDPOINT.replace(/\/$/, "");
const AW_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID,
  "X-Appwrite-Key": process.env.APPWRITE_KEY
};
const AW_DOCS = `${AW_BASE}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_COLLECTION_ID}/documents`;

async function awRequest(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...AW_HEADERS, ...(options.headers || {}) } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Appwrite ${res.status}: ${body.message || res.statusText}`);
  }
  return body;
}

async function listApprovedReviews() {
  const params = new URLSearchParams();
  // Query strings mirror node-appwrite's Query serializer exactly
  params.append("queries[0]", JSON.stringify({ method: "equal", attribute: "aprobada", values: [1] }));
  params.append("queries[1]", JSON.stringify({ method: "orderDesc", attribute: "creada" }));
  params.append("queries[2]", JSON.stringify({ method: "limit", values: [60] }));
  const page = await awRequest(`${AW_DOCS}?${params}`);
  return page.documents || [];
}

async function createUnapprovedReview(data) {
  return awRequest(AW_DOCS, {
    method: "POST",
    body: JSON.stringify({ documentId: crypto.randomUUID().replaceAll("-", ""), data })
  });
}

/* ---------- App ---------- */

const app = express();
app.disable("x-powered-by");
app.use(compression());
app.use(express.json({ limit: "16kb" }));

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };

function json(res, status, payload) {
  res.set(JSON_HEADERS).status(status).json(payload);
}

/* ---------- API ---------- */

app.get("/api/resenas", async (req, res) => {
  try {
    const docs = await listApprovedReviews();
    const resenas = docs.map((d) => ({
      nombre: d.nombre,
      estrellas: d.estrellas,
      servicio: d.servicio == null ? null : d.servicio,
      texto: d.texto,
      creada: d.creada
    }));
    json(res, 200, { ok: true, resenas });
  } catch (e) {
    console.error("GET /api/resenas failed:", e.message);
    json(res, 500, { ok: false, error: "No se pudieron leer las opiniones" });
  }
});

app.post("/api/resenas", async (req, res) => {
  // Mirrors the original function: empty body is "Solicitud inválida"
  if (!req.body || typeof req.body !== "object" || req.headers["content-length"] === "0") {
    return json(res, 400, { ok: false, error: "Solicitud inválida" });
  }
  const datos = req.body;

  /* Honeypot: bots fill it, people don't. Answer OK but store nothing. */
  if (datos.web) return json(res, 200, { ok: true, guardada: false });

  const limpiar = (v, max) => String(v == null ? "" : v).trim().slice(0, max);

  const nombre = limpiar(datos.nombre, 60);
  const servicio = limpiar(datos.servicio, 60);
  const texto = limpiar(datos.texto, 1000);
  const estrellas = parseInt(datos.estrellas, 10);

  if (nombre.length < 2) return json(res, 400, { ok: false, error: "Escriba su nombre." });
  if (!(estrellas >= 1 && estrellas <= 5)) return json(res, 400, { ok: false, error: "Elija una puntuación de 1 a 5 estrellas." });
  if (texto.length < 10) return json(res, 400, { ok: false, error: "Cuéntenos un poco más sobre su experiencia." });

  try {
    await createUnapprovedReview({
      nombre,
      estrellas,
      servicio: servicio || undefined,
      texto,
      creada: new Date().toISOString(),
      aprobada: 0
    });
    json(res, 200, { ok: true, guardada: true });
  } catch (e) {
    console.error("POST /api/resenas failed:", e.message);
    json(res, 500, { ok: false, error: "No se pudo guardar la opinión. Intente de nuevo." });
  }
});

/* ---------- Admin moderation API (token-protected) ---------- */

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const DOCUMENT_ID_RE = /^[a-f0-9]{32}$/;

function adminAuth(req, res, next) {
  if (!ADMIN_TOKEN) return json(res, 503, { ok: false, error: "Administración no habilitada en este entorno" });
  const provided = req.get("x-admin-token") || "";
  const a = crypto.createHash("sha256").update(provided).digest();
  const b = crypto.createHash("sha256").update(ADMIN_TOKEN).digest();
  if (!crypto.timingSafeEqual(a, b)) return json(res, 401, { ok: false, error: "Token inválido" });
  next();
}

app.get("/api/admin/resenas", adminAuth, async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append("queries[0]", JSON.stringify({ method: "orderDesc", attribute: "creada" }));
    params.append("queries[1]", JSON.stringify({ method: "limit", values: [100] }));
    const page = await awRequest(`${AW_DOCS}?${params}`);
    const resenas = (page.documents || []).map((d) => ({
      id: d.$id,
      nombre: d.nombre,
      estrellas: d.estrellas,
      servicio: d.servicio == null ? null : d.servicio,
      texto: d.texto,
      creada: d.creada,
      aprobada: d.aprobada
    }));
    json(res, 200, { ok: true, resenas });
  } catch (e) {
    console.error("GET /api/admin/resenas failed:", e.message);
    json(res, 500, { ok: false, error: "No se pudieron leer las opiniones" });
  }
});

app.post("/api/admin/resenas", adminAuth, async (req, res) => {
  const { id, accion } = req.body || {};
  if (typeof id !== "string" || !DOCUMENT_ID_RE.test(id)) return json(res, 400, { ok: false, error: "Documento inválido" });
  if (accion !== "aprobar" && accion !== "ocultar" && accion !== "borrar") {
    return json(res, 400, { ok: false, error: "Acción inválida" });
  }
  try {
    if (accion === "borrar") {
      await awRequest(`${AW_DOCS}/${id}`, { method: "DELETE" });
      return json(res, 200, { ok: true, borrada: true });
    }
    const aprobada = accion === "aprobar" ? 1 : 0;
    await awRequest(`${AW_DOCS}/${id}`, { method: "PATCH", body: JSON.stringify({ data: { aprobada } }) });
    json(res, 200, { ok: true, aprobada });
  } catch (e) {
    console.error("POST /api/admin/resenas failed:", e.message);
    json(res, 500, { ok: false, error: "No se pudo ejecutar la acción" });
  }
});

/* ---------- Health probe ---------- */

app.get("/healthz", (req, res) => json(res, 200, { ok: true }));

/* ---------- Static site ---------- */

app.use(
  express.static(SITE_DIR, {
    index: "index.html",
    extensions: ["html"],
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) res.set("Cache-Control", "no-cache");
      else if (/\.(webp|png|jpe?g|svg|ico|woff2?)$/.test(filePath)) res.set("Cache-Control", "public, max-age=3600");
    }
  })
);

app.use((req, res) => {
  if (req.path.startsWith("/api/")) return json(res, 404, { ok: false, error: "Not found" });
  res.status(404).sendFile(path.join(SITE_DIR, "404.html"));
});

/* ---------- JSON body parse errors (parity with request.json() catch) ---------- */

app.use((err, req, res, next) => {
  if (err && (err.type === "entity.parse.failed" || err instanceof SyntaxError)) {
    return json(res, 400, { ok: false, error: "Solicitud inválida" });
  }
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  json(res, 500, { ok: false, error: "Error interno" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`orcluxurytransport listening on :${PORT}`);
});
