import { getQuery } from "h3";
import { getConnection } from "../utils/db.config";

export default defineEventHandler(async (event) => {
  const { mode, query } = getQuery(event);
  let connection;

  try {
    connection = await getConnection();

    // ✅ 1) mode=all → liste complète des verbes (pour /verbs, verbStore, etc.)
    if (mode === "all") {
      const [rows] = await connection.execute(`
        SELECT
          'verb' AS type,
          v.verb_id AS id,
          s.slug,
          v.name AS singular,
          NULL AS plural,
          v.phonetic,
          (
            SELECT GROUP_CONCAT(DISTINCT vm.meaning SEPARATOR ', ')
            FROM verb_meanings vm
            WHERE vm.verb_id = v.verb_id AND vm.language_code = 'fr'
          ) AS translation_fr,
          (
            SELECT GROUP_CONCAT(DISTINCT vm.meaning SEPARATOR ', ')
            FROM verb_meanings vm
            WHERE vm.verb_id = v.verb_id AND vm.language_code = 'en'
          ) AS translation_en
        FROM verbs v
        JOIN slugs s ON v.verb_id = s.verb_id
        ORDER BY v.name COLLATE utf8mb4_unicode_ci ASC
      `);

      return rows;
    }

    // ✅ 2) mode "search" simple : si pas de query, on renvoie un tableau vide
    if (!query) {
      return [];
    }

    const like = `%${query}%`;

    const [rows] = await connection.execute(
      `
      SELECT
        'verb' AS type,
        v.verb_id AS id,
        s.slug,
        v.name AS singular,
        NULL AS plural,
        v.phonetic,
        (
          SELECT GROUP_CONCAT(DISTINCT vm.meaning SEPARATOR ', ')
          FROM verb_meanings vm
          WHERE vm.verb_id = v.verb_id AND vm.language_code = 'fr'
        ) AS translation_fr,
        (
          SELECT GROUP_CONCAT(DISTINCT vm.meaning SEPARATOR ', ')
          FROM verb_meanings vm
          WHERE vm.verb_id = v.verb_id AND vm.language_code = 'en'
        ) AS translation_en
      FROM verbs v
      JOIN slugs s ON v.verb_id = s.verb_id
      WHERE v.name COLLATE utf8mb4_unicode_ci LIKE ?
      ORDER BY v.name COLLATE utf8mb4_unicode_ci ASC
      LIMIT 50
    `,
      [like]
    );

    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des verbes :", error);
    return { error: "Erreur lors de la récupération des verbes." };
  } finally {
    if (connection) {
      try {
        if (typeof connection.release === "function") {
          connection.release();
        } else if (typeof connection.end === "function") {
          await connection.end();
        }
      } catch (e) {
        console.error("Erreur lors de la fermeture de la connexion :", e);
      }
    }
  }
});
