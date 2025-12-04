// server/api/admin/add/word.post.js
import { withConnection } from "../../../utils/db.config";
import { requireUser } from "../../../utils/authSession";

function slugify(input) {
  if (!input || typeof input !== "string") return "";
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(connection, baseSlug, contentType = "word") {
  let slug = baseSlug || "mot";
  let suffix = 2;

  // slug est unique globalement via l’index UNIQUE, donc on check simplement sur slug
  // (content_type reste renseigné pour l’info).
  // On boucle tant qu’un slug existe déjà.
  // Ex : nzu → nzu-2 → nzu-3…
  // (on garde le même algo que ce qu’on a fait côté update).
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [rows] = await connection.execute(
      "SELECT slug FROM slugs WHERE slug = ? LIMIT 1",
      [slug]
    );
    if (!rows || rows.length === 0) {
      return slug;
    }
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export default defineEventHandler(async (event) => {
  // Protégé par server/middleware/require-admin.js,
  // ici on récupère juste l’utilisateur pour le user_id.
  const user = requireUser(event); // => { id, username, roles }

  const body = await readBody(event);

  const {
    singular,
    plural,
    root,
    phonetic,
    class_id,
    number_variability,
    translation_fr,
    translation_en,
  } = body || {};

  if (!singular || !class_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Champ 'singular' ou 'class_id' manquant.",
    });
  }

  return withConnection(async (connection) => {
    await connection.beginTransaction();
    try {
      // 1️⃣ Insertion du mot
      const [insertResult] = await connection.execute(
        `INSERT INTO words
          (singular, plural, root, phonetic, class_id,
           derived_word, derived_from_word, derived_from_verb,
           number_variability, is_approved, user_id)
         VALUES (?, ?, ?, ?, ?, 0, NULL, NULL, ?, 1, ?)`,
        [
          singular.trim(),
          plural ? plural.trim() : null,
          root ? root.trim() : null,
          phonetic ? phonetic.trim() : null,
          class_id,
          number_variability || "variable",
          user?.id ?? null,
        ]
      );

      const wordId = insertResult.insertId;

      // 2️⃣ Slug unique
      const baseSlug = slugify(singular);
      const finalSlug = await ensureUniqueSlug(connection, baseSlug, "word");

      await connection.execute(
        `INSERT INTO slugs (slug, word_id, verb_id, content_type)
         VALUES (?, ?, NULL, 'word')`,
        [finalSlug, wordId]
      );

      // 3️⃣ Traductions (word_meanings)
      const frParts = (translation_fr || "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const enParts = (translation_en || "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const values = [];

      for (const meaning of frParts) {
        values.push([wordId, "fr", meaning]);
      }
      for (const meaning of enParts) {
        values.push([wordId, "en", meaning]);
      }

      if (values.length > 0) {
        const placeholders = values.map(() => "(?, ?, ?)").join(", ");
        await connection.execute(
          `INSERT INTO word_meanings (word_id, language_code, meaning)
           VALUES ${placeholders}`,
          values.flat()
        );
      }

      await connection.commit();

      return {
        success: true,
        word_id: wordId,
        slug: finalSlug,
      };
    } catch (err) {
      await connection.rollback();
      console.error("Erreur lors de la création du mot :", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la création du mot.",
      });
    }
  });
});
