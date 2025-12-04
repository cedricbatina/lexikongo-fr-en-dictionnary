// server/api/admin/verb/index.post.js
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

async function ensureUniqueSlug(connection, baseSlug, contentType = "verb") {
  let slug = baseSlug || "verbe";
  let suffix = 2;

  // La table slugs a un index UNIQUE sur slug → on check simplement sur slug.
  // On garde content_type à 'verb' pour info/cohérence.
  // Exemple : longa → longa-2 → longa-3…
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
  // Protégé par middleware require-admin côté serveur.
  const user = requireUser(event); // { id, username, roles }

  const body = await readBody(event);

  const { name, root, suffix, phonetic, translation_fr, translation_en } =
    body || {};

  // root est NOT NULL en DB, name on le rend obligatoire pour la cohérence UI
  if (!name || !root) {
    throw createError({
      statusCode: 400,
      statusMessage: "Champs 'name' et 'root' sont obligatoires.",
    });
  }

  return withConnection(async (connection) => {
    await connection.beginTransaction();

    try {
      // 1️⃣ Insertion du verbe
      const [insertResult] = await connection.execute(
        `INSERT INTO verbs
          (name, root, suffix, phonetic,
           active_verb, derived_verb, derived_from,
           is_approved, user_id, derived_verb_type_id)
         VALUES (?, ?, ?, ?, 1, 0, NULL, 1, ?, NULL)`,
        [
          name.trim(),
          root.trim(),
          suffix ? suffix.trim() : null,
          phonetic ? phonetic.trim() : null,
          user?.id ?? null,
        ]
      );

      const verbId = insertResult.insertId;

      // 2️⃣ Slug unique
      const baseSlug = slugify(name);
      const finalSlug = await ensureUniqueSlug(connection, baseSlug, "verb");

      await connection.execute(
        `INSERT INTO slugs (slug, word_id, verb_id, content_type)
         VALUES (?, NULL, ?, 'verb')`,
        [finalSlug, verbId]
      );

      // 3️⃣ Traductions (verb_meanings)
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
        values.push([verbId, "fr", meaning]);
      }
      for (const meaning of enParts) {
        values.push([verbId, "en", meaning]);
      }

      if (values.length > 0) {
        const placeholders = values.map(() => "(?, ?, ?)").join(", ");
        await connection.execute(
          `INSERT INTO verb_meanings (verb_id, language_code, meaning)
           VALUES ${placeholders}`,
          values.flat()
        );
      }

      await connection.commit();

      return {
        success: true,
        verb_id: verbId,
        slug: finalSlug,
      };
    } catch (err) {
      await connection.rollback();
      console.error("Erreur lors de la création du verbe :", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la création du verbe.",
      });
    }
  });
});
