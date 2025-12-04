// server/api/admin/verbs/[slug].js
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
      name = null,
      phonetic = null,
      root = null,
      suffix = null,
    } = body || {};

    await withConnection(async (connection) => {
      const [result] = await connection.execute(
        `
        UPDATE verbs v
        JOIN slugs s ON v.verb_id = s.verb_id
        SET
          v.name = ?,
          v.phonetic = ?,
          v.root = ?,
          v.suffix = ?,
          v.updated_at = NOW()
        WHERE s.slug = ?
        `,
        [name, phonetic, root, suffix, slug]
      );

      if (!result.affectedRows) {
        throw createError({
          statusCode: 404,
          statusMessage: "Verbe introuvable pour ce slug.",
        });
      }
    });

    return { ok: true };
  }

  if (method === "DELETE") {
    await withConnection(async (connection) => {
      const [result] = await connection.execute(
        `
        DELETE v
        FROM verbs v
        JOIN slugs s ON v.verb_id = s.verb_id
        WHERE s.slug = ?
        `,
        [slug]
      );

      if (!result.affectedRows) {
        throw createError({
          statusCode: 404,
          statusMessage: "Verbe introuvable pour ce slug.",
        });
      }
    });

    return { ok: true };
  }

  throw createError({
    statusCode: 405,
    statusMessage: "Méthode non autorisée.",
  });
});
