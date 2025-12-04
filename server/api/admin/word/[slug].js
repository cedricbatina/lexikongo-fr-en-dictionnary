// server/api/admin/words/[slug].js
import { withConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params || {};
  const method = event.method;

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug manquant.",
    });
  }

  if (method === "PUT") {
    const body = await readBody(event);

    const {
      singular = null,
      plural = null,
      phonetic = null,
      root = null,
      number_variability = null,
    } = body || {};

    // (optionnel) petite validation basique
    const allowedNumberVars = [
      "singular_only",
      "plural_only",
      "invariable",
      "variable",
      null,
    ];
    if (!allowedNumberVars.includes(number_variability)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Valeur number_variability invalide.",
      });
    }

    await withConnection(async (connection) => {
      const [result] = await connection.execute(
        `
        UPDATE words w
        JOIN slugs s ON w.word_id = s.word_id
        SET
          w.singular = ?,
          w.plural = ?,
          w.phonetic = ?,
          w.root = ?,
          w.number_variability = ?,
          w.updated_at = NOW()
        WHERE s.slug = ?
        `,
        [singular, plural, phonetic, root, number_variability, slug]
      );

      if (!result.affectedRows) {
        throw createError({
          statusCode: 404,
          statusMessage: "Mot introuvable pour ce slug.",
        });
      }
    });

    return { ok: true };
  }

  if (method === "DELETE") {
    await withConnection(async (connection) => {
      const [result] = await connection.execute(
        `
        DELETE w
        FROM words w
        JOIN slugs s ON w.word_id = s.word_id
        WHERE s.slug = ?
        `,
        [slug]
      );

      if (!result.affectedRows) {
        throw createError({
          statusCode: 404,
          statusMessage: "Mot introuvable pour ce slug.",
        });
      }
    });

    return { ok: true };
  }

  // méthode non supportée
  throw createError({
    statusCode: 405,
    statusMessage: "Méthode non autorisée.",
  });
});
