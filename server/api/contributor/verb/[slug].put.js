// server/api/contributor/verb/[slug].put.js

import { getConnection } from "../../../utils/db.config";
import {
  addTranslation,
  updateTranslation,
  deleteTranslation,
} from "../../add-translation";

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params;
  const body = await readBody(event);

  const {
    name,
    root,
    suffix = null,
    phonetic = null,
    translations,
    user_id,
  } = body || {};

  if (!user_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le champ 'user_id' est requis.",
    });
  }

  if (!name || !root) {
    throw createError({
      statusCode: 400,
      statusMessage: "Les champs 'name' et 'root' sont obligatoires.",
    });
  }

  const connection = await getConnection();

  try {
    // Vérifier l'appartenance de la soumission
    const [rows] = await connection.execute(
      `
        SELECT vs.submission_id
        FROM pending_verbs_submissions vs
        JOIN pending_verbs_slugs sl 
          ON vs.submission_id = sl.submission_id
        WHERE sl.slug = ? AND vs.user_id = ?
      `,
      [slug, user_id]
    );

    const submissionRow = rows[0];

    if (!submissionRow || !submissionRow.submission_id) {
      throw createError({
        statusCode: 404,
        statusMessage: "Soumission introuvable pour cet utilisateur.",
      });
    }

    const submission_id = submissionRow.submission_id;

    // Mise à jour des champs principaux
    await connection.execute(
      `
        UPDATE pending_verbs_submissions
        SET name = ?, root = ?, suffix = ?, phonetic = ?, updated_at = NOW()
        WHERE submission_id = ?
      `,
      [
        name || null,
        root || null,
        suffix || null,
        phonetic || null,
        submission_id,
      ]
    );

    // Gestion des traductions (optionnelle)
    if (translations && Array.isArray(translations)) {
      const [existingTranslations] = await connection.execute(
        `
          SELECT id AS translation_id, language_code, meaning
          FROM pending_verbs_translations
          WHERE submission_id = ?
        `,
        [submission_id]
      );

      const existingMap = new Map(
        existingTranslations.map((t) => [t.translation_id, t])
      );

      const newTranslations = [];
      const updatedTranslations = [];
      const deletedTranslations = new Set();

      for (const t of translations) {
        const { action, language_code, meaning, id } = t || {};

        if (action === "add" && meaning) {
          newTranslations.push({ language_code, meaning });
        } else if (action === "update" && id) {
          const existing = existingMap.get(id);
          if (
            existing &&
            (existing.language_code !== language_code ||
              existing.meaning !== meaning)
          ) {
            updatedTranslations.push({ id, language_code, meaning });
          }
        } else if (action === "delete" && id) {
          deletedTranslations.add(id);
        }
      }

      // Suppression
      for (const id of deletedTranslations) {
        await deleteTranslation(connection, { translationId: id });
      }

      // Mise à jour
      for (const { id, language_code, meaning } of updatedTranslations) {
        await updateTranslation(connection, {
          translationId: id,
          languageCode: language_code,
          meaning,
        });
      }

      // Ajouts
      for (const { language_code, meaning } of newTranslations) {
        await addTranslation(connection, {
          pendingVerbId: submission_id,
          languageCode: language_code,
          meaning,
        });
      }
    }

    return { message: "Soumission de verbe mise à jour avec succès." };
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la soumission de verbe :",
      error
    );
    throw createError({
      statusCode: 500,
      statusMessage:
        "Erreur interne lors de la mise à jour de la soumission de verbe.",
    });
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    } else if (connection && typeof connection.end === "function") {
      // fallback au cas où, pour ne rien casser
      await connection.end();
    }
  }
});
