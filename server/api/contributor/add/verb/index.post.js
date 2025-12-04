// server/api/contributor/add/verb/index.post.js

import { getConnection } from "../../../../utils/db.config";
import { generateUniqueSlug } from "../../../../utils/generate-unique-slugs";

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
    // Champs principaux
    name,          // verbe kikongo (forme de base) -> OBLIGATOIRE
    root,          // racine                        -> OBLIGATOIRE
    suffix = null,   // optionnel
    phonetic = null, // optionnel

    // Dérivation
    derived_from = null,        // optionnel : id du verbe source (si dérivé)

    // Champs éventuels envoyés par le front mais qui
    // n'existent PAS dans pending_verbs_submissions : on les ignore en DB
    active_verb,          // ignoré ici
    derived_verb,         // ignoré ici
    derived_verb_type_id, // ignoré ici

    // Auteur
    user_id, // OBLIGATOIRE

    // Traductions [{ language_code:'fr'|'en', meaning:'...' }, ...]
    translations,
  } = body || {};

  // --- Validation basique ---
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
      statusMessage:
        "Au moins une traduction est requise dans 'translations'.",
    });
  }

  const connection = await getConnection();

  try {
    // 1) Insertion dans pending_verbs_submissions
    // Schéma actuel :
    // submission_id, user_id, status, name, root, suffix,
    // phonetic, derived_from, reason, created_at, updated_at
    const [result] = await connection.execute(
      `
        INSERT INTO pending_verbs_submissions
          (user_id, status, name, root, suffix, phonetic, derived_from)
        VALUES (?, 'pending', ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        name.trim(),
        root.trim(),
        suffix || null,
        phonetic || null,
        derived_from || null,
      ],
    );

    const submissionId = result.insertId;

    // 2) Génération d’un slug temporaire pour cette soumission
    const slug = await generateUniqueSlug(connection, name);

    await connection.execute(
      `
        INSERT INTO pending_verbs_slugs (submission_id, slug)
        VALUES (?, ?)
      `,
      [submissionId, slug],
    );

    // 3) Insertion des traductions FR/EN dans pending_verbs_translations
    const validTranslations = translations.filter(
      (t) =>
        t &&
        typeof t.language_code === "string" &&
        t.language_code.trim() !== "" &&
        typeof t.meaning === "string" &&
        t.meaning.trim() !== "",
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
        [submissionId, t.language_code.trim(), t.meaning.trim()],
      );
    }

    // 4) Réponse OK
    return {
      message: "Soumission de verbe créée avec succès.",
      submission_id: submissionId,
      slug,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la création de la soumission de verbe :",
      error,
    );

    throw createError({
      statusCode: 500,
      statusMessage:
        "Erreur interne lors de la création de la soumission de verbe.",
    });
  } finally {
    await connection.end(); // ton wrapper gère bien le pool derrière
  }
});
