// server/api/admin/users/[id].put.js
import { defineEventHandler, readBody, createError } from "h3";
import { getConnection } from "../../../utils/db.config.js"; // adapte le chemin exact si besoin

export default defineEventHandler(async (event) => {
  const rawId = event.context.params?.id;
  const userId = Number.parseInt(rawId, 10);

  if (!userId || Number.isNaN(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Paramètre id utilisateur invalide",
    });
  }

  // require-auth + require-admin sont déjà gérés par tes middlewares globaux
  const body = await readBody(event);

  const username = (body?.username || "").trim();
  const email = (body?.email || "").trim();
  const roles = Array.isArray(body?.roles) ? body.roles : [];
  const emailVerified = body?.emailVerified ? 1 : 0;

  if (!username) {
    throw createError({
      statusCode: 422,
      statusMessage: "Le nom d'utilisateur est obligatoire.",
    });
  }

  if (!email) {
    throw createError({
      statusCode: 422,
      statusMessage: "L'adresse email est obligatoire.",
    });
  }

  const emailRegex = /.+@.+\..+/;
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 422,
      statusMessage: "L'adresse email n'est pas valide.",
    });
  }

  const connection = await getConnection();

  try {
    // Vérifier l'existence de l'utilisateur
    const [existingUserRows] = await connection.execute(
      "SELECT user_id FROM users WHERE user_id = ?",
      [userId]
    );

    if (!existingUserRows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Utilisateur introuvable",
      });
    }

    // Vérifier l'unicité de l'email
    const [emailRows] = await connection.execute(
      "SELECT user_id FROM users WHERE email = ? AND user_id <> ?",
      [email, userId]
    );

    if (emailRows.length) {
      throw createError({
        statusCode: 409,
        statusMessage:
          "Cette adresse email est déjà utilisée par un autre compte.",
      });
    }

    // Mettre à jour les infos de base
    await connection.execute(
      `
        UPDATE users
        SET username = ?, email = ?, email_verified = ?, updated_at = NOW()
        WHERE user_id = ?
      `,
      [username, email, emailVerified, userId]
    );

    // Mise à jour des rôles si un tableau est fourni
    if (Array.isArray(roles)) {
      // Nettoyage des rôles vides/dupliqués
      const cleanRoles = [
        ...new Set(
          roles.map((r) => String(r || "").trim()).filter((r) => r.length > 0)
        ),
      ];

      // On supprime d'abord les rôles existants
      await connection.execute("DELETE FROM user_roles WHERE user_id = ?", [
        userId,
      ]);

      if (cleanRoles.length) {
        // Récupérer les role_id correspondant aux noms passés
        const placeholders = cleanRoles.map(() => "?").join(",");
        const [roleRows] = await connection.execute(
          `
            SELECT role_id, role_name
            FROM roles
            WHERE role_name IN (${placeholders})
          `,
          cleanRoles
        );

        const nameToId = new Map(roleRows.map((r) => [r.role_name, r.role_id]));

        // Insertions dans user_roles
        for (const roleName of cleanRoles) {
          const roleId = nameToId.get(roleName);
          if (!roleId) {
            // rôle inconnu → on ignore silencieusement
            continue;
          }
          await connection.execute(
            "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
            [userId, roleId]
          );
        }
      }
    }

    // On renvoie l'utilisateur mis à jour, au même format que GET /api/admin/users/:id
    const [rows] = await connection.execute(
      `
        SELECT
          u.user_id,
          u.username,
          u.email,
          u.created_at,
          u.updated_at,
          u.last_seen,
          u.previous_seen,
          u.email_verified,
          GROUP_CONCAT(r.role_name ORDER BY r.role_name) AS roles
        FROM users u
        LEFT JOIN user_roles ur ON ur.user_id = u.user_id
        LEFT JOIN roles r ON r.role_id = ur.role_id
        WHERE u.user_id = ?
        GROUP BY u.user_id
      `,
      [userId]
    );

    if (!rows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Utilisateur introuvable après mise à jour",
      });
    }

    const row = rows[0];

    return {
      user_id: row.user_id,
      username: row.username,
      email: row.email,
      created_at: row.created_at,
      updated_at: row.updated_at,
      last_seen: row.last_seen,
      previous_seen: row.previous_seen,
      email_verified: row.email_verified === 1 || row.email_verified === true,
      roles: row.roles ? row.roles.split(",") : [],
    };
  } catch (err) {
    // Si c'est déjà un createError, on le propage
    if (err.statusCode) {
      throw err;
    }
    console.error("Erreur PUT /api/admin/users/:id :", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la mise à jour de l'utilisateur.",
    });
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }
});
