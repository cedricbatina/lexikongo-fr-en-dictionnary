// server/api/auth/me.get.js
import { defineEventHandler, sendError, createError } from "h3";
import { getUserFromCookie } from "../../utils/authSession";
import { query } from "../../utils/db.config";

export default defineEventHandler(async (event) => {
  try {
    // 1) Lire l’utilisateur depuis le cookie JWT
    const payload = getUserFromCookie(event);

    if (!payload || !payload.id) {
      return {
        authenticated: false,
        user: null,
      };
    }

    // 2) Récupérer les infos à jour en base
    const rows = await query(
      `
      SELECT
        user_id,
        username,
        email,
        email_verified,
        created_at,
        last_seen,
        previous_seen
      FROM users
      WHERE user_id = ?
      LIMIT 1
    `,
      [payload.id]
    );

    if (!rows || rows.length === 0) {
      return {
        authenticated: false,
        user: null,
      };
    }

    const user = rows[0];
    const roles = Array.isArray(payload.roles) ? payload.roles : [];

    return {
      authenticated: true,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        roles,
        email_verified: !!user.email_verified,
        created_at: user.created_at,
        last_seen: user.last_seen,
        previous_seen: user.previous_seen,
      },
    };
  } catch (err) {
    console.error("Erreur /api/auth/me :", err);
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la récupération du profil.",
      })
    );
  }
});
