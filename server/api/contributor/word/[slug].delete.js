import { getConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params;
  const body = await readBody(event);
  const user_id = body?.user_id;

  if (!user_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le champ 'user_id' est requis.",
    });
  }

  const connection = await getConnection();

  try {
    // Vérifier que la soumission appartient à ce user
    const [rows] = await connection.execute(
      `
        SELECT ws.submission_id
        FROM pending_words_submissions ws
        JOIN pending_words_slugs wsl 
          ON ws.submission_id = wsl.submission_id
        WHERE wsl.slug = ? AND ws.user_id = ?
      `,
      [slug, user_id]
    );

    const submissionRow = rows[0];

    if (!submissionRow || !submissionRow.submission_id) {
      throw createError({
        statusCode: 404,
        statusMessage:
          "Soumission introuvable ou non autorisée pour cet utilisateur.",
      });
    }

    const submission_id = submissionRow.submission_id;

    // Suppression des données pending
    await connection.execute(
      `DELETE FROM pending_words_translations WHERE submission_id = ?`,
      [submission_id]
    );
    await connection.execute(
      `DELETE FROM pending_words_slugs WHERE submission_id = ?`,
      [submission_id]
    );
    await connection.execute(
      `DELETE FROM pending_words_submissions WHERE submission_id = ?`,
      [submission_id]
    );

    return { message: "Soumission de mot supprimée avec succès." };
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la soumission de mot :",
      error
    );
    throw createError({
      statusCode: 500,
      statusMessage:
        "Erreur interne lors de la suppression de la soumission de mot.",
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
