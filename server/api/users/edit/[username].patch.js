// server/api/users/edit/[username].patch.js
import { eventHandler, readBody, createError } from "h3";
import { query, withConnection } from "../../../utils/db.config";
import { requireUser, signJwt, setAuthCookie } from "../../../utils/authSession";

// Helper pour garder la même logique de slug que sur le front
function usernameToSlug(username = "") {
  if (typeof username !== "string" || !username) return "";
  return username
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default eventHandler(async (event) => {
  // 1) Utilisateur courant (doit être connecté)
  const current = requireUser(event);
  const isAdmin =
    Array.isArray(current.roles) && current.roles.includes("admin");

  const { username: slug } = event.context.params || {};
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug utilisateur manquant.",
    });
  }

  // 2) On récupère tous les users pour matcher le slug → username
  //    (DB ne stocke pas le slug)
  const rows = await query(
    `SELECT user_id, username, email, email_verified,
            created_at, last_seen, previous_seen, updated_at
       FROM users`
  );

  const target = rows
    .map((u) => ({
      ...u,
      slug: usernameToSlug(u.username),
    }))
    .find((u) => u.slug === slug);

  if (!target) {
    throw createError({
      statusCode: 404,
      statusMessage: "Utilisateur introuvable.",
    });
  }

  // 3) Autorisation :
  //    - utilisateur normal → peut modifier SEULEMENT son propre compte
  //    - admin → peut modifier n’importe quel utilisateur
  if (!isAdmin && target.user_id !== current.id) {
    throw createError({
      statusCode: 403,
      statusMessage: "Vous ne pouvez modifier que votre propre profil.",
    });
  }

  // 4) Corps de la requête
  const body = await readBody(event);
  const nextUsername = body.username?.trim();
  const nextRoles = body.roles; // array<string> optionnel, réservé à l’admin

  // On prépare les updates
  const updates = [];
  const params = [];

  // 4.a) Changement de username (user + admin autorisés)
  if (nextUsername && nextUsername !== target.username) {
    // Unicité
    const existing = await query(
      `SELECT user_id
         FROM users
        WHERE username = ?
          AND user_id <> ?`,
      [nextUsername, target.user_id]
    );
    if (existing.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Ce nom d'utilisateur est déjà utilisé.",
      });
    }

    updates.push("username = ?");
    params.push(nextUsername);
  }

  // 5) Si admin : mise à jour éventuelle des rôles
  let finalRoles = null;

  if (isAdmin && Array.isArray(nextRoles)) {
    // Nettoyage de base
    const requestedRoleNames = nextRoles
      .map((r) => String(r).trim().toLowerCase())
      .filter(Boolean);

    await withConnection(async (conn) => {
      await conn.beginTransaction();
      try {
        if (requestedRoleNames.length) {
          // On récupère les ids de rôles correspondants
          const [roleRows] = await conn.query(
            `SELECT role_id, role_name
               FROM roles
              WHERE LOWER(role_name) IN (?)`,
            [requestedRoleNames]
          );

          const roleIds = roleRows.map((r) => r.role_id);

          // On remplace les rôles existants
          await conn.query("DELETE FROM user_roles WHERE user_id = ?", [
            target.user_id,
          ]);

          if (roleIds.length) {
            const values = roleIds.map((roleId) => [target.user_id, roleId]);
            await conn.query(
              "INSERT INTO user_roles (user_id, role_id) VALUES ?",
              [values]
            );
          }
        } else {
          // Liste vide → on supprime tous les rôles
          await conn.query("DELETE FROM user_roles WHERE user_id = ?", [
            target.user_id,
          ]);
        }

        await conn.commit();
      } catch (err) {
        await conn.rollback();
        console.error("Erreur mise à jour des rôles :", err);
        throw createError({
          statusCode: 500,
          statusMessage: "Erreur lors de la mise à jour des rôles.",
        });
      }
    });
  }

  // 6) On applique les updates sur la table users si besoin
  if (updates.length > 0) {
    updates.push("updated_at = NOW()");
    const sql = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;
    params.push(target.user_id);
    await query(sql, params);

    // On reflète les changements dans notre objet target
    if (nextUsername && nextUsername !== target.username) {
      target.username = nextUsername;
    }
    target.updated_at = new Date();
  }

  // 7) On recalcule les rôles pour la réponse (après éventuelle modif)
  const roleRows = await query(
    `SELECT r.role_name
       FROM roles r
       JOIN user_roles ur ON ur.role_id = r.role_id
      WHERE ur.user_id = ?`,
    [target.user_id]
  );
  finalRoles = roleRows.map((r) => r.role_name);

  // 8) Si l’utilisateur modifié est l’utilisateur courant,
  //    on met à jour le JWT + cookie (username / roles peuvent avoir changé)
  if (target.user_id === current.id) {
    const payload = {
      sub: String(target.user_id),
      uid: target.user_id,
      username: target.username,
      roles: finalRoles,
    };
    const token = signJwt(payload, "7d");
    setAuthCookie(event, token);
  }

  // 9) Réponse propre (sans password)
  return {
    ok: true,
    user: {
      id: target.user_id,
      username: target.username,
      email: target.email,
      email_verified: !!target.email_verified,
      created_at: target.created_at,
      last_seen: target.last_seen,
      previous_seen: target.previous_seen,
      updated_at: target.updated_at,
      roles: finalRoles,
    },
  };
});
