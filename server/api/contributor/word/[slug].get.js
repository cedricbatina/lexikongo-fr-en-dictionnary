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
        ws.*,
        sl.slug,
        wt.id AS translation_id,
        wt.language_code,
        wt.meaning
      FROM pending_words_submissions ws
      JOIN pending_words_slugs sl 
        ON ws.submission_id = sl.submission_id
      LEFT JOIN pending_words_translations wt 
        ON ws.submission_id = wt.submission_id
      WHERE sl.slug = ? AND ws.user_id = ?
      `,
      [slug, user_id]
    );

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Soumission de mot introuvable pour cet utilisateur.",
      });
    }

    const base = rows[0];

    const wordSubmission = {
      submission_id: base.submission_id,
      singular: base.singular,
      plural: base.plural,
      phonetic: base.phonetic,
      class_id: base.class_id,
      user_id: base.user_id,
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

    return wordSubmission;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la soumission de mot :",
      error
    );
    throw createError({
      statusCode: 500,
      statusMessage:
        "Erreur interne lors de la récupération de la soumission de mot.",
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
