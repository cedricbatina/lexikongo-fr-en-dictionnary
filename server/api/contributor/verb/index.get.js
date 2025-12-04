// server/api/contributor/verb/index.get.js

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
        vs.*,
        sl.slug,
        vt.id AS translation_id,
        vt.language_code,
        vt.meaning
      FROM pending_verbs_submissions vs
      JOIN pending_verbs_slugs sl 
        ON vs.submission_id = sl.submission_id
      LEFT JOIN pending_verbs_translations vt 
        ON vs.submission_id = vt.submission_id
      WHERE vs.user_id = ?
      ORDER BY vs.created_at DESC
      `,
      [user_id]
    );

    // Regrouper par submission_id
    const map = new Map();

    for (const row of rows) {
      if (!map.has(row.submission_id)) {
        map.set(row.submission_id, {
          submission_id: row.submission_id,
          slug: row.slug,
          name: row.name,
          root: row.root,
          suffix: row.suffix,
          phonetic: row.phonetic,
          active_verb: row.active_verb,
          derived_verb: row.derived_verb,
          derived_from: row.derived_from,
          user_id: row.user_id,
          derived_verb_type_id: row.derived_verb_type_id,
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
    console.error("Erreur lors du listing des soumissions de verbes :", error);
    throw createError({
      statusCode: 500,
      statusMessage:
        "Erreur interne lors du listing des soumissions de verbes.",
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
