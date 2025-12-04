// server/api/admin/verb/[slug].put.js
import { withConnection } from "../../../utils/db.config";

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug manquant." });
  }

  const body = await readBody(event);

  const name = (body.name || "").trim(); // infinitif sans "ku"
  const root = (body.root || "").trim();
  const suffix = (body.suffix || "").trim();
  const phonetic = (body.phonetic || "").trim();

  const translationFrRaw = body.translation_fr || "";
  const translationEnRaw = body.translation_en || "";

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le nom du verbe est obligatoire.",
    });
  }

  const translationsFr = translationFrRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const translationsEn = translationEnRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return withConnection(async (conn) => {
    const [rows] = await conn.execute(
      `
      SELECT
        v.verb_id,
        v.name,
        v.root,
        v.suffix,
        v.phonetic,
        s.slug_id,
        s.slug
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

    const current = rows[0];
    const verbId = current.verb_id;
    const slugId = current.slug_id;
    const existingSlug = current.slug;

    const baseSlug = slugify(name);
    let newSlug = existingSlug;

    if (baseSlug && baseSlug !== existingSlug) {
      let candidate = baseSlug;
      let suffixNum = 1;

      /* eslint-disable no-constant-condition */
      while (true) {
        const [slugRows] = await conn.execute(
          "SELECT slug_id FROM slugs WHERE slug = ? AND slug_id != ? LIMIT 1",
          [candidate, slugId]
        );

        if (!slugRows.length) break;

        suffixNum += 1;
        candidate = `${baseSlug}-${suffixNum}`;
      }
      /* eslint-enable no-constant-condition */

      newSlug = candidate;
    }

    await conn.beginTransaction();
    try {
      // 1️⃣ Mise à jour du verbe
      await conn.execute(
        `
        UPDATE verbs
        SET name = ?, root = ?, suffix = ?, phonetic = ?
        WHERE verb_id = ?
      `,
        [name, root || null, suffix || null, phonetic || null, verbId]
      );

      // 2️⃣ Mise à jour du slug
      if (newSlug !== existingSlug) {
        await conn.execute("UPDATE slugs SET slug = ? WHERE slug_id = ?", [
          newSlug,
          slugId,
        ]);
      }

      // 3️⃣ Traductions
      await conn.execute(
        "DELETE FROM verb_meanings WHERE verb_id = ? AND language_code IN ('fr', 'en')",
        [verbId]
      );

      for (const meaning of translationsFr) {
        await conn.execute(
          `
          INSERT INTO verb_meanings (verb_id, language_code, meaning)
          VALUES (?, 'fr', ?)
        `,
          [verbId, meaning]
        );
      }

      for (const meaning of translationsEn) {
        await conn.execute(
          `
          INSERT INTO verb_meanings (verb_id, language_code, meaning)
          VALUES (?, 'en', ?)
        `,
          [verbId, meaning]
        );
      }

      await conn.commit();

      return {
        success: true,
        slug: newSlug,
      };
    } catch (err) {
      await conn.rollback();
      console.error("Erreur lors de la mise à jour du verbe :", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la mise à jour du verbe.",
      });
    }
  });
});
