// server/api/nominal-classes.get.js
import { withConnection } from "../utils/db.config"; // ⬅️ même helper que /details

export default defineEventHandler(async (event) => {
  try {
    const rows = await withConnection(async (connection) => {
      const [results] = await connection.execute(
        `SELECT class_id, class_name
         FROM nominal_classes
         ORDER BY class_name`
      );
      return results;
    });

    // On renvoie un simple tableau [{ class_id, class_name }, ...]
    return rows;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des classes nominales :",
      error
    );
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des classes nominales.",
    });
  }
});
