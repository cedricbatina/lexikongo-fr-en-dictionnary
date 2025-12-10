// server/api/admin/users/index.get.js
import { createError } from "h3";
import { getConnection } from "../../../utils/db.config.js"; // adapte le chemin si besoin

export default defineEventHandler(async (event) => {
  let connection;

  try {
    connection = await getConnection();

    const [rows] = await connection.execute(
      `
      SELECT
        u.user_id,
        u.username,
        u.email,
        u.created_at,
        u.email_verified,
        GROUP_CONCAT(r.role_name ORDER BY r.role_name SEPARATOR ',') AS roles_csv
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.user_id
      LEFT JOIN roles r ON r.role_id = ur.role_id
      GROUP BY u.user_id
      ORDER BY u.created_at DESC
      `
    );

    const users = rows.map((row) => ({
      user_id: row.user_id,
      username: row.username,
      email: row.email,
      created_at: row.created_at,
      email_verified: row.email_verified,
      roles: row.roles_csv
        ? row.roles_csv
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean)
        : [],
    }));

    return users;
  } catch (err) {
    console.error("Erreur /api/admin/users :", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur serveur lors de la récupération des utilisateurs.",
    });
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch {
        // ignore
      }
    }
  }
});
