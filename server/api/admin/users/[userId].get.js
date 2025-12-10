// server/api/admin/users/[id].get.js
import { defineEventHandler, createError, getRouterParam } from "h3";
import { getConnection } from "../../../utils/db.config"; // adapte si ton chemin est différent

export default defineEventHandler(async (event) => {
  // Récupère l'id depuis l'URL /api/admin/users/:id
  const idParam = getRouterParam(event, "id");
  const userId = Number.parseInt(idParam, 10);

  if (!userId || Number.isNaN(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid user id",
    });
  }

  const connection = await getConnection();

  try {
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
        GROUP_CONCAT(r.role_name ORDER BY r.role_name SEPARATOR ',') AS roles
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
        statusMessage: "User not found",
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
      email_verified: !!row.email_verified,
      roles: row.roles ? row.roles.split(",") : [],
    };
  } catch (err) {
    console.error("Erreur /api/admin/users/[id].get:", err);
    if (err.statusCode) {
      throw err;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to load admin user",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
