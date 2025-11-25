// server/api/users/delete-account.delete.js
import { eventHandler, createError, getQuery } from "h3";
import { withConnection, query } from "../../utils/db.config";
import { requireUser, clearAuthCookie } from "../../utils/authSession";

export default eventHandler(async (event) => {
  const sessionUser = requireUser(event);
  const isAdmin =
    Array.isArray(sessionUser.roles) && sessionUser.roles.includes("admin");

  const q = getQuery(event) || {};
  const rawTargetUserId = q.userId;

  // Mode "moi" par défaut
  let targetUserId = sessionUser.id;
  let deletingSelf = true;

  // Mode admin : suppression d'un autre compte
  if (isAdmin && rawTargetUserId != null) {
    const parsed = Number(rawTargetUserId);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Identifiant utilisateur cible invalide.",
      });
    }
    targetUserId = parsed;
    deletingSelf = parsed === sessionUser.id;
  }

  // Vérifier existence de l'utilisateur cible
  const [target] = await query(
    `SELECT user_id FROM users WHERE user_id = ? LIMIT 1`,
    [targetUserId]
  );

  if (!target) {
    throw createError({
      statusCode: 404,
      statusMessage: "Utilisateur introuvable.",
    });
  }

  await withConnection(async (conn) => {
    await conn.beginTransaction();
    try {
      // Supprimer les rôles associés
      await conn.query(`DELETE FROM user_roles WHERE user_id = ?`, [
        targetUserId,
      ]);

      // TODO: gérer ici les contributions éventuelles (mots, verbes, etc.)

      // Supprimer l'utilisateur
      await conn.query(`DELETE FROM users WHERE user_id = ?`, [targetUserId]);

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      console.error("Erreur suppression compte utilisateur :", e);
      throw createError({
        statusCode: 500,
        statusMessage: "Impossible de supprimer le compte.",
      });
    }
  });

  // Si l'utilisateur supprime SON propre compte → on efface le cookie
  if (deletingSelf) {
    clearAuthCookie(event);
  }

  return {
    success: true,
    message: deletingSelf
      ? "Votre compte a été supprimé avec succès."
      : "Compte utilisateur supprimé avec succès.",
    userId: targetUserId,
  };
});
