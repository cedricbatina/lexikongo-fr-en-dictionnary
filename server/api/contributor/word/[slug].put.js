import { getConnection } from "../../../utils/db.config";
import {
  addTranslation,
  updateTranslation,
  deleteTranslation,
} from "../../add-translation";

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params;
  const data = await readBody(event);

  const { singular, plural, phonetic, class_id, translations, user_id } =
    data || {};

  if (!user_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le champ 'user_id' est requis.",
    });
  }

  if (!singular || !class_id) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Les champs 'singular' et 'class_id' sont obligatoires pour la mise à jour.",
    });
  }

  const connection = await getConnection();

  try {
    // Vérifier que la soumission appartient à ce user
    const [rows] = await connection.execute(
      `
        SELECT ws.submission_id
        FROM pending_words_submissions ws
        JOIN pending_words_slugs wsl 
          ON ws.submission_id = wsl.submission_id
        WHERE wsl.slug = ? AND ws.user_id = ?
      `,
      [slug, user_id]
    );

    const submissionRow = rows[0];

    if (!submissionRow || !submissionRow.submission_id) {
      throw createError({
        statusCode: 404,
        statusMessage:
          "Soumission de mot introuvable ou non autorisée pour cet utilisateur.",
      });
    }

    const submission_id = submissionRow.submission_id;

    const singularValue = singular || null;
    const pluralValue = plural || null;
    const phoneticValue = phonetic || null;
    const classIdValue = class_id || null;

    // Mise à jour des champs principaux
    await connection.execute(
      `
        UPDATE pending_words_submissions 
           SET singular = ?, plural = ?, phonetic = ?, class_id = ?, updated_at = NOW() 
           WHERE submission_id = ?
      `,
      [singularValue, pluralValue, phoneticValue, classIdValue, submission_id]
    );

    // Récupérer les traductions existantes
    const [existingTranslations] = await connection.execute(
      `
        SELECT id AS translation_id, language_code, meaning
        FROM pending_words_translations
        WHERE submission_id = ?
      `,
      [submission_id]
    );

    if (translations && Array.isArray(translations)) {
      const newTranslations = [];
      const updatedTranslations = [];
      const deletedTranslations = new Set();

      const existingTranslationsMap = new Map(
        existingTranslations.map((t) => [t.translation_id, t])
      );

      for (const translation of translations) {
        const { action, language_code, meaning, id } = translation || {};

        if (action === "add" && meaning) {
          newTranslations.push({ language_code, meaning });
        } else if (action === "update" && id) {
          const existing = existingTranslationsMap.get(id);
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

      // Ajouts
      for (const { language_code, meaning } of newTranslations) {
        await addTranslation(connection, {
          pendingWordId: submission_id,
          languageCode: language_code,
          meaning,
        });
      }

      // Mises à jour
      for (const { id, language_code, meaning } of updatedTranslations) {
        await updateTranslation(connection, {
          translationId: id,
          languageCode: language_code,
          meaning,
        });
      }

      // Suppressions
      for (const id of deletedTranslations) {
        await deleteTranslation(connection, {
          translationId: id,
        });
      }
    }

    return { message: "Soumission de mot mise à jour avec succès." };
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la soumission de mot :",
      error
    );
    throw createError({
      statusCode: 500,
      statusMessage:
        "Erreur interne lors de la mise à jour de la soumission de mot.",
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
