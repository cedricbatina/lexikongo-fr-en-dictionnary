// server/api/admin/word/[slug].put.js
import { withConnection } from "../../../utils/db.config";

/**
 * Utilitaire simple pour générer un slug à partir d’un texte.
 */
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

  // On lit ce qui vient du formulaire d’édition
  const singular = (body.singular || "").trim();
  const plural = (body.plural || "").trim();
  const root = (body.root || "").trim();
  const phonetic = (body.phonetic || "").trim();
  const numberVariability =
    body.number_variability || body.numberVariability || "variable";

  const translationFrRaw = body.translation_fr || "";
  const translationEnRaw = body.translation_en || "";

  if (!singular) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le singulier du mot est obligatoire.",
    });
  }

  // On transforme les chaînes en tableaux de sens (séparés par virgules)
  const translationsFr = translationFrRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const translationsEn = translationEnRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return withConnection(async (conn) => {
    // On récupère le mot + son slug actuel
    const [rows] = await conn.execute(
      `
      SELECT
        w.word_id,
        w.singular,
        w.plural,
        w.root,
        w.phonetic,
        w.number_variability,
        s.slug_id,
        s.slug
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

    const current = rows[0];
    const wordId = current.word_id;
    const slugId = current.slug_id;
    const existingSlug = current.slug;

    // Nouveau slug basé sur le singulier
    const baseSlug = slugify(singular);
    let newSlug = existingSlug;

    if (baseSlug && baseSlug !== existingSlug) {
      let candidate = baseSlug;
      let suffix = 1;

      // On boucle tant qu’un autre enregistrement utilise ce slug
      // (on exclut le slug courant avec slug_id)
      // slugs.slug est UNIQUE
      // -> on ajoute -2, -3, etc.
      // NB : on ne filtre pas par content_type, c’est global.
      /* eslint-disable no-constant-condition */
      while (true) {
        const [slugRows] = await conn.execute(
          "SELECT slug_id FROM slugs WHERE slug = ? AND slug_id != ? LIMIT 1",
          [candidate, slugId]
        );

        if (!slugRows.length) break;

        suffix += 1;
        candidate = `${baseSlug}-${suffix}`;
      }
      /* eslint-enable no-constant-condition */

      newSlug = candidate;
    }

    await conn.beginTransaction();
    try {
      // 1️⃣ Mise à jour du mot
      await conn.execute(
        `
        UPDATE words
        SET singular = ?, plural = ?, root = ?, phonetic = ?, number_variability = ?
        WHERE word_id = ?
      `,
        [
          singular,
          plural || null,
          root || null,
          phonetic || null,
          numberVariability || "variable",
          wordId,
        ]
      );

      // 2️⃣ Mise à jour du slug si nécessaire
      if (newSlug !== existingSlug) {
        await conn.execute("UPDATE slugs SET slug = ? WHERE slug_id = ?", [
          newSlug,
          slugId,
        ]);
      }

      // 3️⃣ Traductions : on remplace toutes les FR / EN
      await conn.execute(
        "DELETE FROM word_meanings WHERE word_id = ? AND language_code IN ('fr', 'en')",
        [wordId]
      );

      for (const meaning of translationsFr) {
        await conn.execute(
          `
          INSERT INTO word_meanings (word_id, language_code, meaning)
          VALUES (?, 'fr', ?)
        `,
          [wordId, meaning]
        );
      }

      for (const meaning of translationsEn) {
        await conn.execute(
          `
          INSERT INTO word_meanings (word_id, language_code, meaning)
          VALUES (?, 'en', ?)
        `,
          [wordId, meaning]
        );
      }

      await conn.commit();

      return {
        success: true,
        slug: newSlug,
      };
    } catch (err) {
      await conn.rollback();
      console.error("Erreur lors de la mise à jour du mot :", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la mise à jour du mot.",
      });
    }
  });
});
