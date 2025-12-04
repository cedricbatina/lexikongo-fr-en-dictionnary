// server/api/admin/verb/[slug].delete.js
import { withConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug manquant." });
  }

  return withConnection(async (conn) => {
    const [rows] = await conn.execute(
      `
      SELECT
        v.verb_id,
        s.slug_id
      FROM slugs s
      JOIN verbs v ON v.verb_id = s.verb_id
      WHERE s.slug = ? AND s.content_type = 'verb'
      LIMIT 1
    `,
      [slug]
    );

    if (!rows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Verbe introuvable.",
      });
    }

    const { verb_id: verbId, slug_id: slugId } = rows[0];

    await conn.beginTransaction();
    try {
      // 1️⃣ Supprimer traductions
      await conn.execute("DELETE FROM verb_meanings WHERE verb_id = ?", [
        verbId,
      ]);

      // 2️⃣ Supprimer slug
      await conn.execute("DELETE FROM slugs WHERE slug_id = ?", [slugId]);

      // 3️⃣ Supprimer verbe
      await conn.execute("DELETE FROM verbs WHERE verb_id = ?", [verbId]);

      await conn.commit();

      return { success: true };
    } catch (err) {
      await conn.rollback();
      console.error("Erreur lors de la suppression du verbe :", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la suppression du verbe.",
      });
    }
  });
});
