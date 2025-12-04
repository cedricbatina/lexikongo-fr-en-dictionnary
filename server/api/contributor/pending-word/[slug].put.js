// server/api/contributor/pending-word/[slug].put.js
import { getConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params || {};
  const body = await readBody(event);

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Paramètre slug manquant.",
    });
  }

  const userId = body.user_id ? Number.parseInt(body.user_id, 10) : null;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Champ user_id requis dans le body.",
    });
  }

  const singular = body.singular?.trim();
  const classId = body.class_id ? Number.parseInt(body.class_id, 10) : null;

  if (!singular || !classId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Singulier et classe nominale sont obligatoires.",
    });
  }

  const plural = body.plural?.trim() || null;
  const phonetic = body.phonetic?.trim() || null;
  const numberVariability = body.number_variability || null;

  const derivedFlag = !!body.derived_word;
  const derivedFromWordId =
    derivedFlag && body.derived_from_word
      ? Number.parseInt(body.derived_from_word, 10) || null
      : null;
  const derivedFromVerbId =
    derivedFlag && body.derived_from_verb
      ? Number.parseInt(body.derived_from_verb, 10) || null
      : null;

  const translationFr = body.translation_fr?.trim() || "";
  const translationEn = body.translation_en?.trim() || "";

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // 1) On récupère la soumission à partir du slug
    const [rows] = await connection.query(
      `
      SELECT
        s.submission_id,
        s.user_id,
        s.status
      FROM pending_words_slugs sl
      JOIN pending_words_submissions s
        ON s.submission_id = sl.submission_id
      WHERE sl.slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (!rows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Soumission introuvable.",
      });
    }

    const submission = rows[0];

    if (submission.user_id !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Vous ne pouvez pas modifier cette soumission.",
      });
    }

    if (submission.status !== "pending") {
      throw createError({
        statusCode: 409,
        statusMessage: "Cette soumission n’est plus modifiable.",
      });
    }

    const submissionId = submission.submission_id;

    // 2) Mise à jour des champs principaux
    await connection.query(
      `
      UPDATE pending_words_submissions
      SET
        singular = ?,
        plural = ?,
        class_id = ?,
        phonetic = ?,
        derived_word = ?,
        derived_from_word = ?,
        derived_from_verb = ?,
        number_variability = ?,
        updated_at = NOW()
      WHERE submission_id = ?
      `,
      [
        singular,
        plural,
        classId,
        phonetic,
        derivedFlag ? 1 : 0,
        derivedFromWordId,
        derivedFromVerbId,
        numberVariability,
        submissionId,
      ]
    );

    // 3) On remplace les traductions (simple / robuste)
    await connection.query(
      `DELETE FROM pending_words_translations WHERE submission_id = ?`,
      [submissionId]
    );

    const inserts = [];

    if (translationFr) {
      inserts.push(["fr", translationFr]);
    }
    if (translationEn) {
      inserts.push(["en", translationEn]);
    }

    if (!inserts.length) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Au moins une traduction (FR ou EN) est requise pour sauvegarder.",
      });
    }

    for (const [language_code, meaning] of inserts) {
      await connection.query(
        `
        INSERT INTO pending_words_translations (submission_id, language_code, meaning)
        VALUES (?, ?, ?)
        `,
        [submissionId, language_code, meaning]
      );
    }

    await connection.commit();

    return {
      success: true,
      slug,
      submission_id: submissionId,
    };
  } catch (err) {
    await connection.rollback();
    console.error("Erreur PUT pending-word par slug :", err);
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur serveur lors de la mise à jour de la soumission.",
    });
  } finally {
    connection.release();
  }
});
