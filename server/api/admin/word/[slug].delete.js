// server/api/admin/word/[slug].delete.js
import { withConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug manquant." });
  }

  return withConnection(async (conn) => {
    // On récupère le mot + slug
    const [rows] = await conn.execute(
      `
      SELECT
        w.word_id,
        s.slug_id
      FROM slugs s
      JOIN words w ON w.word_id = s.word_id
      WHERE s.slug = ? AND s.content_type = 'word'
      LIMIT 1
    `,
      [slug]
    );

    if (!rows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Mot introuvable.",
      });
    }

    const { word_id: wordId, slug_id: slugId } = rows[0];

    await conn.beginTransaction();
    try {
      // 1️⃣ Supprimer les traductions
      await conn.execute("DELETE FROM word_meanings WHERE word_id = ?", [
        wordId,
      ]);

      // 2️⃣ Supprimer le slug
      await conn.execute("DELETE FROM slugs WHERE slug_id = ?", [slugId]);

      // 3️⃣ Supprimer le mot
      await conn.execute("DELETE FROM words WHERE word_id = ?", [wordId]);

      await conn.commit();

      return { success: true };
    } catch (err) {
      await conn.rollback();
      console.error("Erreur lors de la suppression du mot :", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la suppression du mot.",
      });
    }
  });
});
