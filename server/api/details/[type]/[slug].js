// server/api/details/[type]/[slug].js

import { createError } from "h3";
import { getConnection } from "../../../utils/db.config.js"; // même helper que tes autres routes

export default defineEventHandler(async (event) => {
  const { type, slug } = event.context.params || {};

  if (!type || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Type ou slug manquant.",
    });
  }

  if (type !== "word" && type !== "verb") {
    throw createError({
      statusCode: 400,
      statusMessage: "Type invalide. Utiliser 'word' ou 'verb'.",
    });
  }

  const connection = await getConnection();

  try {
    if (type === "word") {
      const [rows] = await connection.execute(
        `
        SELECT
          w.word_id,
          w.singular,
          w.plural,
          w.phonetic,
          w.class_id,
          nc.class_name AS nominal_class,
          w.number_variability,
          w.created_at,
          u.username AS author,
          GROUP_CONCAT(
            CASE WHEN wm.language_code = 'fr' THEN wm.meaning END
            SEPARATOR ', '
          ) AS translation_fr,
          GROUP_CONCAT(
            CASE WHEN wm.language_code = 'en' THEN wm.meaning END
            SEPARATOR ', '
          ) AS translation_en
        FROM slugs s
        JOIN words w ON w.word_id = s.word_id
        LEFT JOIN word_meanings wm ON wm.word_id = w.word_id
        LEFT JOIN users u ON u.user_id = w.user_id
        LEFT JOIN nominal_classes nc ON nc.class_id = w.class_id
        WHERE s.slug = ?
          AND s.content_type = 'word'
          AND w.is_approved = 1
        GROUP BY
          w.word_id,
          w.singular,
          w.plural,
          w.phonetic,
          w.class_id,
          nc.class_name,
          w.number_variability,
          w.created_at,
          u.username
        `,
        [slug]
      );

      if (!rows.length) {
        throw createError({
          statusCode: 404,
          statusMessage: "Fiche introuvable.",
        });
      }

      const row = rows[0];

      return {
        type: "word",
        singular: row.singular,
        plural: row.plural,
        phonetic: row.phonetic,
        translation_fr: row.translation_fr || "",
        translation_en: row.translation_en || "",
        // 🔹 désormais pris en DB, comme ton API /nominal-classes
        nominal_class: row.nominal_class || null,
        root: null,
        suffix: null,
        author: row.author || null,
        created_at: row.created_at,
        number_variability: row.number_variability || null,
      };
    }

    // ----- type === 'verb' -----
    const [rows] = await connection.execute(
      `
      SELECT
        v.verb_id,
        v.name,
        v.root,
        v.suffix,
        v.phonetic,
        v.created_at,
        u.username AS author,
        GROUP_CONCAT(
          CASE WHEN vm.language_code = 'fr' THEN vm.meaning END
          SEPARATOR ', '
        ) AS translation_fr,
        GROUP_CONCAT(
          CASE WHEN vm.language_code = 'en' THEN vm.meaning END
          SEPARATOR ', '
        ) AS translation_en
      FROM slugs s
      JOIN verbs v ON v.verb_id = s.verb_id
      LEFT JOIN verb_meanings vm ON vm.verb_id = v.verb_id
      LEFT JOIN users u ON u.user_id = v.user_id
      WHERE s.slug = ?
        AND s.content_type = 'verb'
        AND v.is_approved = 1
      GROUP BY
        v.verb_id,
        v.name,
        v.root,
        v.suffix,
        v.phonetic,
        v.created_at,
        u.username
      `,
      [slug]
    );

    if (!rows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Fiche introuvable.",
      });
    }

    const row = rows[0];

    return {
      type: "verb",
      name: row.name,
      phonetic: row.phonetic,
      root: row.root || null,
      suffix: row.suffix || null,
      translation_fr: row.translation_fr || "",
      translation_en: row.translation_en || "",
      author: row.author || null,
      created_at: row.created_at,
      singular: null,
      plural: null,
      nominal_class: null,
      number_variability: null,
    };
  } catch (err) {
    if (err.statusCode) {
      throw err;
    }

    console.error("Erreur API /api/details/[type]/[slug]:", err);

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur serveur lors de la récupération de la fiche.",
    });
  } finally {
    // même pattern que tes autres routes : on release la connexion
    if (connection) {
      connection.release?.();
    }
  }
});
