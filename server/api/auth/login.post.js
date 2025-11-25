// server/api/auth/login.post.js
import { defineEventHandler, readBody, createError } from "h3";
import bcrypt from "bcrypt"; // ou "bcrypt" si c'est ce que tu utilises
import { withConnection } from "../../utils/db.config.js";
import { signJwt, setAuthCookie } from "../../utils/authSession.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const identifier = body?.identifier?.trim();
  const password = body?.password;

  if (!identifier || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Identifiants manquants.",
    });
  }

  return withConnection(async (conn) => {
    // 1) Récupérer l’utilisateur par email OU username
    const [rows] = await conn.execute(
      `
      SELECT 
        user_id,
        username,
        email,
        password,
        email_verified,
        created_at,
        last_seen,
        previous_seen
      FROM users
      WHERE email = ? OR username = ?
      LIMIT 1
    `,
      [identifier, identifier]
    );

    const row = rows?.[0];
    if (!row) {
      throw createError({
        statusCode: 401,
        statusMessage: "Identifiants invalides.",
      });
    }

    // 2) Vérifier le mot de passe
    const match = await bcrypt.compare(password, row.password);
    if (!match) {
      throw createError({
        statusCode: 401,
        statusMessage: "Identifiants invalides.",
      });
    }

    // 3) Bloquer si email non vérifié (si c’est ce que tu veux)
    if (!row.email_verified) {
      throw createError({
        statusCode: 403,
        statusMessage:
          "Votre adresse e-mail n’est pas encore vérifiée. Veuillez cliquer sur le lien reçu par e-mail.",
      });
    }

    // 4) Charger TOUS les rôles via user_roles + roles
    const [roleRows] = await conn.execute(
      `
      SELECT r.role_name
      FROM user_roles ur
      JOIN roles r ON r.role_id = ur.role_id
      WHERE ur.user_id = ?
    `,
      [row.user_id]
    );

    const roles = Array.isArray(roleRows)
      ? roleRows.map((r) => r.role_name)
      : [];

    // ⚠️ pas de rôle "user" forcé ici : tout vient de la DB
    // → c'est ton registre / admin qui donnent les rôles.

    // 5) Mettre à jour last_seen / previous_seen / updated_at
    const now = new Date();
    await conn.execute(
      `
      UPDATE users
      SET
        previous_seen = last_seen,
        last_seen = ?,
        updated_at = ?
      WHERE user_id = ?
    `,
      [now, now, row.user_id]
    );

    // 6) Signer le JWT avec les infos minimales
    const token = signJwt({
      sub: String(row.user_id),
      uid: row.user_id,
      username: row.username,
      roles,
    });

    setAuthCookie(event, token);

    // 7) Réponse JSON (authStore ne lit que le fait que ça ne throw pas,
    //    puis appelle /api/auth/me, mais on renvoie quand même un payload propre)
    return {
      success: true,
      user: {
        id: row.user_id,
        username: row.username,
        email: row.email,
        email_verified: !!row.email_verified,
        roles,
        created_at: row.created_at,
        last_seen: row.last_seen,
        previous_seen: row.previous_seen,
      },
    };
  });
});
