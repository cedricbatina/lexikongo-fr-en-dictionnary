// server/api/contributor/pending-verb/[slug].put.js
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

  const name = body.name?.trim();
  const root = body.root?.trim();

  if (!name || !root) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Infinitif (sans "ku") et racine sont obligatoires.',
    });
  }

  const suffix = body.suffix?.trim() || null;
  const phonetic = body.phonetic?.trim() || null;

  const derivedFlag = !!body.derived_verb;
  const derivedFromId =
    derivedFlag && body.derived_from
      ? Number.parseInt(body.derived_from, 10) || null
      : null;
  const derivedTypeId =
    derivedFlag && body.derived_verb_type_id
      ? Number.parseInt(body.derived_verb_type_id, 10) || null
      : null;

  const translationFr = body.translation_fr?.trim() || "";
  const translationEn = body.translation_en?.trim() || "";

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // 1) Récupérer la soumission
    const [rows] = await connection.query(
      `
      SELECT
        s.submission_id,
        s.user_id,
        s.status
      FROM pending_verbs_slugs sl
      JOIN pending_verbs_submissions s
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

    // 2) Mise à jour du verbe
    await connection.query(
      `
      UPDATE pending_verbs_submissions
      SET
        name = ?,
        root = ?,
        suffix = ?,
        phonetic = ?,
        active_verb = 1,
        derived_verb = ?,
        derived_from = ?,
        derived_verb_type_id = ?,
        updated_at = NOW()
      WHERE submission_id = ?
      `,
      [
        name,
        root,
        suffix,
        phonetic,
        derivedFlag ? 1 : 0,
        derivedFromId,
        derivedTypeId,
        submissionId,
      ]
    );

    // 3) Remplacement des traductions
    await connection.query(
      `DELETE FROM pending_verbs_translations WHERE submission_id = ?`,
      [submissionId]
    );

    const inserts = [];
    if (translationFr) inserts.push(["fr", translationFr]);
    if (translationEn) inserts.push(["en", translationEn]);

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
        INSERT INTO pending_verbs_translations (submission_id, language_code, meaning)
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
    console.error("Erreur PUT pending-verb par slug :", err);
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur serveur lors de la mise à jour de la soumission.",
    });
  } finally {
    connection.release();
  }
});
