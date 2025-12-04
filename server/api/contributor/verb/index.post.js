// server/api/contributor/verb/index.post.js

import { getConnection } from "../../../utils/db.config";
import { generateUniqueSlug } from "../../../utils/generate-unique-slugs";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Méthode non autorisée. Utilisez POST.",
    });
  }

  const body = await readBody(event);

  const {
    name,
    root,
    suffix = null,
    phonetic = null,
    active_verb = 1,
    derived_verb = 0,
    derived_from = null,
    user_id,
    derived_verb_type_id = null,
    translations,
  } = body;

  // Validation minimale des champs obligatoires
  if (!name || !root || !user_id) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Les champs 'name', 'root' et 'user_id' sont obligatoires.",
    });
  }

  if (!Array.isArray(translations) || translations.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Au moins une traduction est requise dans 'translations'.",
    });
  }

  const connection = await getConnection();

  try {
    // 1) Création de la soumission de verbe dans pending_verbs_submissions
    const [result] = await connection.execute(
      `
        INSERT INTO pending_verbs_submissions
          (name, root, suffix, phonetic, active_verb, derived_verb, derived_from, user_id, derived_verb_type_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name.trim(),
        root.trim(),
        suffix || null,
        phonetic || null,
        active_verb,
        derived_verb,
        derived_from || null,
        user_id,
        derived_verb_type_id || null,
      ]
    );

    const submissionId = result.insertId;

    // 2) Génération du slug unique pour la soumission
    const slug = await generateUniqueSlug(connection, name);

    await connection.execute(
      `
        INSERT INTO pending_verbs_slugs (slug, submission_id)
        VALUES (?, ?)
      `,
      [slug, submissionId]
    );

    // 3) Insertion des traductions dans pending_verbs_translations
    const validTranslations = translations.filter(
      (t) =>
        t &&
        typeof t.language_code === "string" &&
        t.language_code.trim() !== "" &&
        typeof t.meaning === "string" &&
        t.meaning.trim() !== ""
    );

    if (validTranslations.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Les traductions fournies sont invalides. Vérifiez 'language_code' et 'meaning'.",
      });
    }

    for (const t of validTranslations) {
      await connection.execute(
        `
          INSERT INTO pending_verbs_translations (submission_id, language_code, meaning)
          VALUES (?, ?, ?)
        `,
        [submissionId, t.language_code.trim(), t.meaning.trim()]
      );
    }

    // 4) Réponse
    return {
      message: "Soumission de verbe créée avec succès.",
      submission_id: submissionId,
      slug,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la création de la soumission de verbe :",
      error
    );

    throw createError({
      statusCode: 500,
      statusMessage:
        "Erreur interne lors de la création de la soumission de verbe.",
    });
  }   finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    } else if (connection && typeof connection.end === "function") {
      // fallback au cas où, pour ne rien casser
      await connection.end();
    }
  }


});
