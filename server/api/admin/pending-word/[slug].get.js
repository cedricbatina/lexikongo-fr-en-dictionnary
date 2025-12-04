// server/api/admin/pending-word/[slug].get.js

import { getConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const params = event.context.params || {};
  const slug = params.slug;

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Paramètre 'slug' manquant.",
    });
  }

  const connection = await getConnection();

  try {
    const [rows] = await connection.execute(
      `
      SELECT
        pws.submission_id,
        pws.user_id,
        pws.status,
        pws.singular,
        pws.plural,
        pws.class_id,
        pws.phonetic,
        pws.derived_word,
        pws.derived_from_word,
        pws.derived_from_verb,
        pws.number_variability,
        pws.created_at,
        pws.updated_at,
        pws_slug.slug,
        u.username AS user_name,
        u.email AS user_email,
        GROUP_CONCAT(
          CASE WHEN pwt.language_code = 'fr' THEN pwt.meaning END
          SEPARATOR '\n'
        ) AS translation_fr,
        GROUP_CONCAT(
          CASE WHEN pwt.language_code = 'en' THEN pwt.meaning END
          SEPARATOR '\n'
        ) AS translation_en
      FROM pending_words_slugs AS pws_slug
      JOIN pending_words_submissions AS pws
        ON pws.submission_id = pws_slug.submission_id
      LEFT JOIN pending_words_translations AS pwt
        ON pwt.submission_id = pws.submission_id
      LEFT JOIN users AS u
        ON u.user_id = pws.user_id
      WHERE pws_slug.slug = ?
      GROUP BY
        pws.submission_id,
        pws_slug.slug,
        u.username,
        u.email
      LIMIT 1
      `,
      [slug]
    );

    if (!rows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Soumission introuvable pour ce slug.",
      });
    }

    const row = rows[0];

    return {
      submission: {
        submission_id: row.submission_id,
        user_id: row.user_id,
        status: row.status,
        singular: row.singular,
        plural: row.plural,
        class_id: row.class_id,
        phonetic: row.phonetic,
        derived_word: !!row.derived_word,
        derived_from_word: row.derived_from_word,
        derived_from_verb: row.derived_from_verb,
        number_variability: row.number_variability,
        created_at: row.created_at,
        updated_at: row.updated_at,
        slug: row.slug,
      },
      translation_fr: row.translation_fr || "",
      translation_en: row.translation_en || "",
      user_name: row.user_name || null,
      user_email: row.user_email || null,
      // on laisse base_word_label / base_verb_label vides pour l’instant,
      // la vue sait gérer le cas null / undefined
      base_word_label: null,
      base_verb_label: null,
    };
  } catch (err) {
    console.error("Error while reading admin pending word:", err);
    if (!err.statusCode) {
      throw createError({
        statusCode: 500,
        statusMessage:
          "Erreur lors de la récupération de la soumission (admin).",
      });
    }
    throw err;
  } finally {
    connection.release();
  }
});
