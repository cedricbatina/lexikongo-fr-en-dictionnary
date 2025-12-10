// server/api/admin/users/[userId].delete.js
import { defineEventHandler, createError } from "h3";
import { getConnection } from "../../../utils/db.config"; // adapte l’extension/chemin si besoin

export default defineEventHandler(async (event) => {
  const params = event.context.params || {};
  const rawId = params.userId;

  const id = Number.parseInt(rawId, 10);
  if (!rawId || Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Paramètre userId invalide",
    });
  }

  // On récupère l'utilisateur courant depuis le middleware auth-context
  const currentUser = event.context.user;
  if (
    !currentUser ||
    !Array.isArray(currentUser.roles) ||
    !currentUser.roles.includes("admin")
  ) {
    // Normalement déjà filtré par require-admin, mais on double-check
    throw createError({
      statusCode: 403,
      statusMessage: "Accès interdit",
    });
  }

  // Optionnel : on empêche un admin de se supprimer lui-même
  if (currentUser.id === id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Vous ne pouvez pas supprimer votre propre compte.",
    });
  }

  const connection = await getConnection();

  try {
    // On tente de faire ça proprement (au cas où tu as des contraintes FK)
    await connection.beginTransaction();

    // Supprimer les rôles liés
    await connection.execute("DELETE FROM user_roles WHERE user_id = ?", [id]);

    // Supprimer l'utilisateur
    const [result] = await connection.execute(
      "DELETE FROM users WHERE user_id = ?",
      [id]
    );

    if (!result.affectedRows) {
      // Rien supprimé -> user inexistant
      await connection.rollback();
      throw createError({
        statusCode: 404,
        statusMessage: "Utilisateur introuvable",
      });
    }

    await connection.commit();

    return {
      success: true,
      deletedUserId: id,
    };
  } catch (err) {
    console.error("Erreur lors de la suppression utilisateur admin :", err);
    try {
      await connection.rollback();
    } catch (e) {
      // ignore
    }

    if (err.statusCode) {
      throw err;
    }

    throw createError({
      statusCode: 500,
      statusMessage:
        "Une erreur est survenue lors de la suppression de l'utilisateur.",
    });
  } finally {
    if (typeof connection.release === "function") {
      connection.release();
    }
  }
});
