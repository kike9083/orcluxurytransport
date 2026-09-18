/**
 * API de opiniones — Cloudflare Pages Function
 *
 *   GET  /api/resenas   devuelve solo las opiniones aprobadas
 *   POST /api/resenas   recibe una opinión nueva y la guarda SIN aprobar
 *
 * Nada de lo que se envía aparece en la web hasta que el dueño lo aprueba.
 * Así una opinión ofensiva o spam se queda guardada y nunca se publica.
 */

const CABECERAS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

function json(datos, estado) {
  return new Response(JSON.stringify(datos), { status: estado || 200, headers: CABECERAS });
}

/* ---------- Leer las opiniones aprobadas ---------- */
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB
      .prepare("SELECT nombre, estrellas, servicio, texto, creada FROM resenas WHERE aprobada = 1 ORDER BY id DESC LIMIT 60")
      .all();
    return json({ ok: true, resenas: results || [] });
  } catch (e) {
    return json({ ok: false, error: "No se pudieron leer las opiniones" }, 500);
  }
}

/* ---------- Recibir una opinión nueva ---------- */
export async function onRequestPost({ request, env }) {
  let datos;
  try {
    datos = await request.json();
  } catch {
    return json({ ok: false, error: "Solicitud inválida" }, 400);
  }

  /* Campo trampa: los formularios automáticos lo rellenan, las personas no.
     Se responde bien para que el robot no reintente, pero no se guarda nada. */
  if (datos.web) return json({ ok: true, guardada: false });

  const limpiar = (v, max) => String(v == null ? "" : v).trim().slice(0, max);

  const nombre    = limpiar(datos.nombre, 60);
  const servicio  = limpiar(datos.servicio, 60);
  const texto     = limpiar(datos.texto, 1000);
  const estrellas = parseInt(datos.estrellas, 10);

  if (nombre.length < 2)                       return json({ ok:false, error:"Escriba su nombre." }, 400);
  if (!(estrellas >= 1 && estrellas <= 5))     return json({ ok:false, error:"Elija una puntuación de 1 a 5 estrellas." }, 400);
  if (texto.length < 10)                       return json({ ok:false, error:"Cuéntenos un poco más sobre su experiencia." }, 400);

  try {
    await env.DB
      .prepare("INSERT INTO resenas (nombre, estrellas, servicio, texto, creada, aprobada) VALUES (?, ?, ?, ?, ?, 0)")
      .bind(nombre, estrellas, servicio || null, texto, new Date().toISOString())
      .run();
    return json({ ok: true, guardada: true });
  } catch (e) {
    return json({ ok: false, error: "No se pudo guardar la opinión. Intente de nuevo." }, 500);
  }
}
