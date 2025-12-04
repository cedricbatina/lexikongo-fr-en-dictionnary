// server/api/contributor/pending-verb/[slug].delete.js
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
        statusMessage: "Vous ne pouvez pas supprimer cette soumission.",
      });
    }

    if (submission.status !== "pending") {
      throw createError({
        statusCode: 409,
        statusMessage: "Vous ne pouvez plus supprimer cette soumission.",
      });
    }

    const submissionId = submission.submission_id;

    // 2) Supprimer traductions, slug, soumission (pas de table "nominal_classes" pour les verbes)
    await connection.query(
      `DELETE FROM pending_verbs_translations WHERE submission_id = ?`,
      [submissionId]
    );

    await connection.query(
      `DELETE FROM pending_verbs_slugs WHERE submission_id = ?`,
      [submissionId]
    );

    await connection.query(
      `DELETE FROM pending_verbs_submissions WHERE submission_id = ?`,
      [submissionId]
    );

    await connection.commit();

    return {
      success: true,
      slug,
      submission_id: submissionId,
    };
  } catch (err) {
    await connection.rollback();
    console.error("Erreur DELETE pending-verb par slug :", err);
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur serveur lors de la suppression de la soumission.",
    });
  } finally {
    connection.release();
  }
});
