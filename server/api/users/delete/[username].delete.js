// server/api/users/delete/[username].delete.js
import { eventHandler, createError } from "h3";
import { withConnection, query } from "../../../utils/db.config";
import { requireUser, clearAuthCookie } from "../../../utils/authSession";

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

  // On retrouve l’utilisateur cible à partir du slug
  const rows = await query(
    `SELECT user_id, username, email
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

  // Autorisation
  if (!isAdmin && target.user_id !== current.id) {
    throw createError({
      statusCode: 403,
      statusMessage: "Vous ne pouvez supprimer que votre propre compte.",
    });
  }

  // Suppression en transaction (roles + user)
  await withConnection(async (conn) => {
    await conn.beginTransaction();
    try {
      await conn.query("DELETE FROM user_roles WHERE user_id = ?", [
        target.user_id,
      ]);
      const [res] = await conn.query(
        "DELETE FROM users WHERE user_id = ? LIMIT 1",
        [target.user_id]
      );
      if (res.affectedRows === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: "Utilisateur déjà supprimé.",
        });
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      console.error("Erreur suppression utilisateur :", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la suppression de l’utilisateur.",
      });
    }
  });

  // Si l’utilisateur supprimé est l’utilisateur courant → on efface le cookie
  if (target.user_id === current.id) {
    clearAuthCookie(event);
  }

  return {
    ok: true,
    deletedUserId: target.user_id,
  };
});
