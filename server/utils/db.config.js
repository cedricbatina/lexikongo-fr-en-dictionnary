// lib/db.js (ou remplace ton db.config.js)
// Compatible Nuxt 4 / Nitro (SSR, Vercel serverless)
import mysql from "mysql2/promise";

// Singleton module-scoped pour éviter de recréer des pools à chaque cold start
let _pool = null;

function toInt(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function getDbConfig() {
  // En Nuxt 4, privilégier useRuntimeConfig() côté serveur.
  // Si ce fichier est utilisé hors contexte Nitro, on retombe sur process.env.
  let conf;
  try {
    // eslint-disable-next-line no-undef
    const { useRuntimeConfig } = require("#imports"); // dispo côté serveur
    const rc = useRuntimeConfig();
    conf = {
      host: rc.DB_HOST || process.env.DB_HOST,
      user: rc.DB_USER || process.env.DB_USER,
      password: rc.DB_PASSWORD || process.env.DB_PASSWORD,
      database: rc.DB_NAME || process.env.DB_NAME,
      port: toInt(rc.DB_PORT || process.env.DB_PORT, 3306),
      // SSL optionnel (ex: PlanetScale/RDS) — laisser désactivé si non requis
      ssl:
        (rc.DB_SSL && rc.DB_SSL !== "false") ||
        (process.env.DB_SSL && process.env.DB_SSL !== "false")
          ? { rejectUnauthorized: true }
          : undefined,
    };
  } catch {
    // fallback process.env si #imports pas dispo
    conf = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: toInt(process.env.DB_PORT, 3306),
      ssl:
        process.env.DB_SSL && process.env.DB_SSL !== "false"
          ? { rejectUnauthorized: true }
          : undefined,
    };
  }
  return conf;
}

export function getPool() {
  if (_pool) return _pool;

  const base = getDbConfig();

  _pool = mysql.createPool({
    ...base,
    waitForConnections: true,
    connectionLimit: toInt(process.env.DB_CONN_LIMIT, 10), // ajuste via env
    queueLimit: 0, // illimité : mieux pour serverless
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // Qualité de vie
    charset: "utf8mb4_general_ci",
    // Named placeholders si besoin: `:id` etc. (désactivé par défaut)
    // namedPlaceholders: true,
  });

  return _pool;
}

/**
 * Récupère une connexion (penser à release() manuellement si tu l'utilises).
 * Préfère withConnection() ou query() pour les cas simples.
 */
export async function getConnection() {
  const pool = getPool();
  return pool.getConnection();
}

/**
 * Exécute une requête directe sur le pool (cas le plus courant).
 */
export async function query(sql, params = []) {
  const pool = getPool();
  const [rows] = await pool.query(sql, params);
  return rows;
}

/**
 * Pattern sûr pour chaîner plusieurs requêtes et garantir le release().
 */
export async function withConnection(fn) {
  const conn = await getConnection();
  try {
    return await fn(conn);
  } finally {
    conn.release();
  }
}

/**
 * (Optionnel) Vérif de santé à utiliser dans /server/api/health/db.get.js
 */
export async function ping() {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    return true;
  } finally {
    conn.release();
  }
}
