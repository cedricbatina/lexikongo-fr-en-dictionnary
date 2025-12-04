// server/api/contributor/verb/[slug].get.js

import { getConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params;
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
      WHERE sl.slug = ? AND vs.user_id = ?
      `,
      [slug, user_id]
    );

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Soumission de verbe introuvable pour cet utilisateur.",
      });
    }

    const base = rows[0];

    const verbSubmission = {
      submission_id: base.submission_id,
      name: base.name,
      root: base.root,
      suffix: base.suffix,
      phonetic: base.phonetic,
      active_verb: base.active_verb,
      derived_verb: base.derived_verb,
      derived_from: base.derived_from,
      user_id: base.user_id,
      derived_verb_type_id: base.derived_verb_type_id,
      slug: base.slug,
      created_at: base.created_at,
      updated_at: base.updated_at,
      translations: rows
        .map((row) => ({
          id: row.translation_id,
          language_code: row.language_code,
          meaning: row.meaning,
        }))
        .filter((t) => t.language_code),
    };

    return verbSubmission;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la soumission de verbe :",
      error
    );
    throw createError({
      statusCode: 500,
      statusMessage:
        "Erreur interne lors de la récupération de la soumission de verbe.",
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
