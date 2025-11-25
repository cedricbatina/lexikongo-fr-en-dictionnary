// server/lib/db.js
import mysql from "mysql2/promise";

let _pool = null;

function toInt(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function getDbConfig() {
  let conf;

  try {
    // dispo côté serveur Nuxt
    const { useRuntimeConfig } = require("#imports");
    const rc = useRuntimeConfig();

    conf = {
      host: rc.DB_HOST || process.env.DB_HOST,
      user: rc.DB_USER || process.env.DB_USER,
      password: rc.DB_PASSWORD || process.env.DB_PASSWORD,
      database: rc.DB_NAME || process.env.DB_NAME,
      port: toInt(rc.DB_PORT || process.env.DB_PORT, 3306),
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
    connectionLimit: toInt(process.env.DB_CONN_LIMIT, 10),
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: "utf8mb4_general_ci",
  });

  return _pool;
}

export async function getConnection() {
  const pool = getPool();
  return pool.getConnection();
}

export async function query(sql, params = []) {
  const pool = getPool();
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function withConnection(fn) {
  const conn = await getConnection();
  try {
    return await fn(conn);
  } finally {
    conn.release();
  }
}

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
