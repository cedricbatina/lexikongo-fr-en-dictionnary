// server/api/auth/reset-password.post.js
import { defineEventHandler, readBody, createError } from "h3";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { query, withConnection } from "~/lib/db";

function sha256Hex(str) {
  return crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const rawToken = String(body?.token || "");
  const newPassword = String(body?.password || "");

  if (!rawToken || !newPassword) {
    throw createError({ statusCode: 422, statusMessage: "Token et mot de passe requis." });
  }
  if (newPassword.length < 8) {
    throw createError({ statusCode: 422, statusMessage: "Mot de passe trop court (min 8 caractères)." });
  }

  const tokenHash = sha256Hex(rawToken);

  // On encapsule dans withConnection pour être sûr de marquer le token utilisé
  return withConnection(async (conn) => {
    // Trouver token valide (non expiré, non utilisé)
    const [rows] = await conn.query(
      `SELECT pr.id, pr.user_id, u.user_id AS uid
         FROM password_resets pr
         INNER JOIN users u ON u.user_id = pr.user_id
        WHERE pr.token_hash = ?
          AND pr.used_at IS NULL
          AND pr.expires_at >= NOW()
        LIMIT 1`,
      [tokenHash]
    );

    const rec = rows?.[0];
    if (!rec) {
      throw createError({ statusCode: 400, statusMessage: "Token invalide ou expiré." });
    }

    // Met à jour le mot de passe + invalide le token
    const hashed = await bcrypt.hash(newPassword, 10);

    await conn.query(
      `UPDATE users SET password = ? WHERE user_id = ?`,
      [hashed, rec.user_id]
    );

    await conn.query(
      `UPDATE password_resets SET used_at = NOW() WHERE id = ?`,
      [rec.id]
    );

    return { success: true };
  });
});
