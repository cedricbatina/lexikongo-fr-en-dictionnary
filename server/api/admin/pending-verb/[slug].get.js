// server/api/admin/pending-verb/[slug].get.js
import { createError } from "h3";
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
        pvs.submission_id,
        pvs.user_id,
        pvs.status,
        pvs.name,
        pvs.root,
        pvs.suffix,
        pvs.phonetic,
        pvs.active_verb,
        pvs.derived_verb,
        pvs.derived_from,
        pvs.derived_verb_type_id,
        pvs.created_at,
        pvs.updated_at,
        pvs_slug.slug,
        u.username AS user_name,
        u.email AS user_email,
        GROUP_CONCAT(
          CASE WHEN pvt.language_code = 'fr' THEN pvt.meaning END
          SEPARATOR '\n'
        ) AS translation_fr,
        GROUP_CONCAT(
          CASE WHEN pvt.language_code = 'en' THEN pvt.meaning END
          SEPARATOR '\n'
        ) AS translation_en
      FROM pending_verbs_slugs AS pvs_slug
      JOIN pending_verbs_submissions AS pvs
        ON pvs.submission_id = pvs_slug.submission_id
      LEFT JOIN pending_verbs_translations AS pvt
        ON pvt.submission_id = pvs.submission_id
      LEFT JOIN users AS u
        ON u.user_id = pvs.user_id
      WHERE pvs_slug.slug = ?
      GROUP BY
        pvs.submission_id,
        pvs_slug.slug,
        u.username,
        u.email
      LIMIT 1
      `,
      [slug],
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
        // le formulaire fait : s.infinitive || s.singular || s.name
        name: row.name,
        root: row.root,
        suffix: row.suffix,
        phonetic: row.phonetic,
        active_verb: row.active_verb,
        derived_verb: !!row.derived_verb,
        derived_from: row.derived_from,
        // on expose les deux pour que la vue puisse utiliser derived_verb_type
        derived_verb_type_id: row.derived_verb_type_id,
        derived_verb_type: row.derived_verb_type_id,
        created_at: row.created_at,
        updated_at: row.updated_at,
        slug: row.slug,
      },
      translation_fr: row.translation_fr || "",
      translation_en: row.translation_en || "",
      user_name: row.user_name || null,
      user_email: row.user_email || null,
      // pour l’instant pas de gestion de verbe de base lié
      base_verb_label: null,
    };
  } catch (err) {
    console.error("Error while reading admin pending verb:", err);
    if (!err.statusCode) {
      throw createError({
        statusCode: 500,
        statusMessage:
          "Erreur lors de la récupération de la soumission de verbe (admin).",
      });
    }
    throw err;
  } finally {
    connection.release();
  }
});
