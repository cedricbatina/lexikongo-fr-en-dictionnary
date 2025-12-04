import { getConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const user_id = query.user_id ? Number(query.user_id) : null;

  if (!user_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Paramètre 'user_id' requis.",
    });
  }

  const connection = await getConnection();

  try {
    const [rows] = await connection.execute(
      `
      SELECT 
        ws.*,
        sl.slug,
        wt.id AS translation_id,
        wt.language_code,
        wt.meaning
      FROM pending_words_submissions ws
      JOIN pending_words_slugs sl 
        ON ws.submission_id = sl.submission_id
      LEFT JOIN pending_words_translations wt 
        ON ws.submission_id = wt.submission_id
      WHERE ws.user_id = ?
      ORDER BY ws.created_at DESC
      `,
      [user_id]
    );

    const map = new Map();

    for (const row of rows) {
      if (!map.has(row.submission_id)) {
        map.set(row.submission_id, {
          submission_id: row.submission_id,
          slug: row.slug,
          singular: row.singular,
          plural: row.plural,
          phonetic: row.phonetic,
          class_id: row.class_id,
          user_id: row.user_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          translations: [],
        });
      }

      if (row.translation_id && row.language_code) {
        map.get(row.submission_id).translations.push({
          id: row.translation_id,
          language_code: row.language_code,
          meaning: row.meaning,
        });
      }
    }

    return Array.from(map.values());
  } catch (error) {
    console.error("Erreur lors du listing des soumissions de mots :", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne lors du listing des soumissions de mots.",
    });
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    } else if (connection && typeof connection.end === "function") {
      // fallback au cas où, pour ne rien casser
      await connection.end();
    }
  }
});
