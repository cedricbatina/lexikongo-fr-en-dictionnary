// server/api/admin/add/verb.post.js
import { withConnection } from "../../../../utils/db.config";
import { getUserFromCookie } from "../../../../utils/authSession";

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
  // 🔐 récup de l'utilisateur (admin) via ton util existant
  const user = getUserFromCookie(event);
  const adminId = user?.id || null;

  const body = await readBody(event);

  const name = (body.name || "").trim();
  const root = (body.root || "").trim();
  const suffix = (body.suffix || "").trim();
  const phonetic = (body.phonetic || "").trim();

  const translationFrRaw = body.translation_fr || "";
  const translationEnRaw = body.translation_en || "";

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le verbe (infinitif) est obligatoire.",
    });
  }

  const translationsFr = translationFrRaw
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const translationsEn = translationEnRaw
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return withConnection(async (conn) => {
    await conn.beginTransaction();

    try {
      // 1) création du verbe
      const [verbResult] = await conn.execute(
        `
        INSERT INTO verbs (name, root, suffix, phonetic, user_id, is_approved)
        VALUES (?, ?, ?, ?, ?, 1)
      `,
        [name, root || null, suffix || null, phonetic || null, adminId]
      );

      const verbId = verbResult.insertId;

      // 2) slug unique basé sur le name du verbe
      const baseSlug = slugify(name);
      if (!baseSlug) {
        throw createError({
          statusCode: 400,
          statusMessage: "Impossible de générer un slug pour ce verbe.",
        });
      }

      let candidate = baseSlug;
      let suffixIndex = 1;

      // slugs.slug est UNIQUE pour tout (word + verb)
      while (true) {
        const [slugRows] = await conn.execute(
          "SELECT slug_id FROM slugs WHERE slug = ? LIMIT 1",
          [candidate]
        );

        if (!slugRows.length) {
          break;
        }

        suffixIndex += 1;
        candidate = `${baseSlug}-${suffixIndex}`;
      }

      const finalSlug = candidate;

      await conn.execute(
        `
        INSERT INTO slugs (slug, verb_id, content_type)
        VALUES (?, ?, 'verb')
      `,
        [finalSlug, verbId]
      );

      // 3) traductions FR
      if (translationsFr.length) {
        for (const meaning of translationsFr) {
          await conn.execute(
            `
            INSERT INTO verb_meanings (verb_id, language_code, meaning)
            VALUES (?, 'fr', ?)
          `,
            [verbId, meaning]
          );
        }
      }

      // 4) traductions EN
      if (translationsEn.length) {
        for (const meaning of translationsEn) {
          await conn.execute(
            `
            INSERT INTO verb_meanings (verb_id, language_code, meaning)
            VALUES (?, 'en', ?)
          `,
            [verbId, meaning]
          );
        }
      }

      await conn.commit();

      return {
        ok: true,
        id: verbId,
        slug: finalSlug,
      };
    } catch (err) {
      await conn.rollback();
      console.error("Erreur lors de la création du verbe :", err);

      if (err?.statusCode) {
        throw err;
      }

      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la création du verbe.",
      });
    }
  });
});
