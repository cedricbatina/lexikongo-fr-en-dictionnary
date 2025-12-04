// server/api/admin/pending-verb/[slug].put.js
import { createError, readBody } from "h3";
import { getConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params || {};
  const body = await readBody(event);

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug de soumission manquant.",
    });
  }

  const {
    infinitive,
    root,
    suffix,
    phonetic,
    derived_verb,
    derived_from,
    derived_verb_type,
    translation_fr,
    translation_en,
  } = body || {};

  // Validation minimale côté serveur
  if (!infinitive || !String(infinitive).trim()) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Le champ "infinitive" est obligatoire pour la soumission.',
    });
  }

  if (
    !translation_fr?.toString().trim()
    && !translation_en?.toString().trim()
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Merci de fournir au moins une traduction (FR ou EN).",
    });
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // 1) Récupérer submission_id à partir du slug
    const [slugRows] = await connection.execute(
      `
      SELECT submission_id
      FROM pending_verbs_slugs
      WHERE slug = ?
      LIMIT 1
      `,
      [slug],
    );

    if (!slugRows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Soumission introuvable pour ce slug.",
      });
    }

    const submissionId = slugRows[0].submission_id;

    // 2) Mettre à jour pending_verbs_submissions
    await connection.execute(
      `
      UPDATE pending_verbs_submissions
      SET
        name = ?,
        root = ?,
        suffix = ?,
        phonetic = ?,
        derived_verb = ?,
        derived_from = ?,
        derived_verb_type_id = ?,
        updated_at = NOW()
      WHERE submission_id = ?
      `,
      [
        infinitive,
        root || null,
        suffix || null,
        phonetic || null,
        derived_verb ? 1 : 0,
        derived_from || null,
        derived_verb_type || null,
        submissionId,
      ],
    );

    // 3) Mettre à jour les traductions FR/EN
    await connection.execute(
      `
      DELETE FROM pending_verbs_translations
      WHERE submission_id = ?
        AND language_code IN ('fr', 'en')
      `,
      [submissionId],
    );

    const inserts = [];
    if (translation_fr?.toString().trim()) {
      inserts.push([submissionId, "fr", translation_fr.toString().trim()]);
    }
    if (translation_en?.toString().trim()) {
      inserts.push([submissionId, "en", translation_en.toString().trim()]);
    }

    if (inserts.length) {
      await connection.query(
        `
        INSERT INTO pending_verbs_translations
          (submission_id, language_code, meaning)
        VALUES ?
        `,
        [inserts],
      );
    }

    await connection.commit();

    return {
      ok: true,
      message: "Soumission de verbe mise à jour avec succès (admin).",
    };
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du pending verb (admin) :",
      error,
    );
    try {
      await connection.rollback();
    } catch (rollbackErr) {
      console.error("Erreur lors du rollback transaction :", rollbackErr);
    }

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage:
        "Erreur serveur lors de la mise à jour de la soumission de verbe (admin).",
    });
  } finally {
    try {
      await connection.release();
    } catch {}
  }
});
