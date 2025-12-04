// server/api/contributor/pending-verb/[slug].get.js
import { getConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params || {};
  const query = getQuery(event);
  const userId = query.user_id ? Number.parseInt(query.user_id, 10) : null;

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Paramètre slug manquant.",
    });
  }

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Paramètre user_id requis.",
    });
  }

  const connection = await getConnection();

  try {
    const [rows] = await connection.query(
      `
      SELECT
        s.submission_id,
        s.user_id,
        s.status,
        s.name,
        s.root,
        s.suffix,
        s.phonetic,
        s.active_verb,
        s.derived_verb,
        s.derived_from,
        s.derived_verb_type_id,
        s.created_at,
        s.updated_at,
        MAX(CASE WHEN t.language_code = 'fr' THEN t.meaning END) AS translation_fr,
        MAX(CASE WHEN t.language_code = 'en' THEN t.meaning END) AS translation_en
      FROM pending_verbs_slugs sl
      JOIN pending_verbs_submissions s
        ON s.submission_id = sl.submission_id
      LEFT JOIN pending_verbs_translations t
        ON t.submission_id = s.submission_id
      WHERE sl.slug = ?
        AND s.user_id = ?
      GROUP BY
        s.submission_id,
        s.user_id,
        s.status,
        s.name,
        s.root,
        s.suffix,
        s.phonetic,
        s.active_verb,
        s.derived_verb,
        s.derived_from,
        s.derived_verb_type_id,
        s.created_at,
        s.updated_at
      LIMIT 1
      `,
      [slug, userId]
    );

    if (!rows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Soumission introuvable.",
      });
    }

    const row = rows[0];

    if (row.status !== "pending") {
      throw createError({
        statusCode: 409,
        statusMessage: "Cette soumission n’est plus modifiable.",
      });
    }

    return {
      slug,
      submission_id: row.submission_id,
      user_id: row.user_id,
      status: row.status,
      name: row.name,
      root: row.root,
      suffix: row.suffix,
      phonetic: row.phonetic,
      active_verb: !!row.active_verb,
      derived_verb: !!row.derived_verb,
      derived_from: row.derived_from,
      derived_verb_type_id: row.derived_verb_type_id,
      translation_fr: row.translation_fr || "",
      translation_en: row.translation_en || "",
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch (err) {
    console.error("Erreur GET pending-verb par slug :", err);
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur serveur lors du chargement de la soumission.",
    });
  } finally {
    connection.release();
  }
});
