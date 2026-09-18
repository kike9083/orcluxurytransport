-- Tabla de opiniones de OrcLuxuryTransport
--
-- aprobada = 0  -> recibida, NO se muestra en la web
-- aprobada = 1  -> aprobada por el dueño, visible en la página
--
-- Nada se publica solo: una opinión ofensiva se queda aquí con aprobada = 0
-- y nunca llega al sitio.

CREATE TABLE IF NOT EXISTS resenas (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre    TEXT    NOT NULL,
  estrellas INTEGER NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
  servicio  TEXT,
  texto     TEXT    NOT NULL,
  creada    TEXT    NOT NULL,
  aprobada  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_resenas_aprobada ON resenas (aprobada, id DESC);
