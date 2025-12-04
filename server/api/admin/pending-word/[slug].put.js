// server/api/admin/pending-word/[slug].put.js
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
    singular,
    plural,
    class_id,
    phonetic,
    number_variability,
    derived_word,
    derived_from_word,
    derived_from_verb,
    translation_fr,
    translation_en,
  } = body || {};

  // Validation minimale côté serveur
  if (!singular || !String(singular).trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le champ "singular" est obligatoire pour la soumission.',
    });
  }

  if (!class_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le champ "class_id" est obligatoire pour la soumission.',
    });
  }

  if (
    !translation_fr?.toString().trim() &&
    !translation_en?.toString().trim()
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
        FROM pending_words_slugs
        WHERE slug = ?
        LIMIT 1
      `,
      [slug]
    );

    if (!slugRows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Soumission introuvable pour ce slug.",
      });
    }

    const submissionId = slugRows[0].submission_id;

    // 2) Mettre à jour pending_words_submissions
    await connection.execute(
      `
        UPDATE pending_words_submissions
        SET
          singular = ?,
          plural = ?,
          class_id = ?,
          phonetic = ?,
          number_variability = ?,
          derived_word = ?,
          derived_from_word = ?,
          derived_from_verb = ?,
          updated_at = NOW()
        WHERE submission_id = ?
      `,
      [
        singular,
        plural || null,
        class_id,
        phonetic || null,
        number_variability || null,
        derived_word ? 1 : 0,
        derived_from_word || null,
        derived_from_verb || null,
        submissionId,
      ]
    );

    // 3) Mettre à jour les traductions
    // On supprime les anciennes FR/EN et on réinsère proprement
    await connection.execute(
      `
        DELETE FROM pending_words_translations
        WHERE submission_id = ?
          AND language_code IN ('fr', 'en')
      `,
      [submissionId]
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
          INSERT INTO pending_words_translations
            (submission_id, language_code, meaning)
          VALUES ?
        `,
        [inserts]
      );
    }

    await connection.commit();

    return {
      ok: true,
      message: "Soumission de mot mise à jour avec succès (admin).",
    };
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du pending word (admin) :",
      error
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
        "Erreur serveur lors de la mise à jour de la soumission de mot (admin).",
    });
  } finally {
    try {
      await connection.release();
    } catch {}
  }
});
