// server/api/auth/reset-password.verify.get.js
import { defineEventHandler, getQuery } from "h3";
import crypto from "crypto";
import { query } from "~/lib/db";

function sha256Hex(str) {
  return crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);
  if (!token || typeof token !== "string") {
    return { valid: false };
  }

  const tokenHash = sha256Hex(token);

  const rows = await query(
    `SELECT id
       FROM password_resets
      WHERE token_hash = ?
        AND used_at IS NULL
        AND expires_at >= NOW()
      LIMIT 1`,
    [tokenHash]
  );

  return { valid: rows.length > 0 };
});
