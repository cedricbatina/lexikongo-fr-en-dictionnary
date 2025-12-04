// server/api/contributor/submissions/[id].get.js

import { getConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const { id } = event.context.params || {};

  if (method !== "GET") {
    throw createError({
      statusCode: 405,
      statusMessage: "Méthode non autorisée. Utilisez GET.",
    });
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "L'ID utilisateur est requis.",
    });
  }

  const connection = await getConnection();

  try {
    // 🟡 1) Pending words : soumissions en attente + slug + traductions FR/EN
    const [pendingWords] = await connection.execute(
      `
      SELECT
        pw.submission_id,
        pw.user_id,
        pw.status,
        pw.singular,
        pw.plural,
        pw.phonetic,
        pw.class_id,
        nc.class_name AS nominal_class,
        sl.slug,
        GROUP_CONCAT(
          CASE WHEN wt.language_code = 'fr' THEN wt.meaning END
          SEPARATOR '; '
        ) AS translation_fr,
        GROUP_CONCAT(
          CASE WHEN wt.language_code = 'en' THEN wt.meaning END
          SEPARATOR '; '
        ) AS translation_en,
        pw.created_at,
        pw.updated_at
      FROM pending_words_submissions pw
      LEFT JOIN pending_words_slugs sl
        ON sl.submission_id = pw.submission_id
      LEFT JOIN pending_words_translations wt
        ON wt.submission_id = pw.submission_id
      LEFT JOIN nominal_classes nc
        ON nc.class_id = pw.class_id
      WHERE pw.user_id = ?
      GROUP BY
        pw.submission_id,
        pw.user_id,
        pw.status,
        pw.singular,
        pw.plural,
        pw.phonetic,
        pw.class_id,
        nc.class_name,
        sl.slug,
        pw.created_at,
        pw.updated_at
      ORDER BY pw.created_at DESC
      `,
      [id]
    );

    // 🟢 2) Archived words : approuvés / rejetés
    const [archivedWords] = await connection.execute(
      `
      SELECT
        aw.word_id,
        aw.user_id,
        aw.singular,
        aw.plural,
        aw.phonetic,
        aw.class_id,
        aw.status,
        nc.class_name AS nominal_class,
        GROUP_CONCAT(
          DISTINCT CASE WHEN wm.language_code = 'fr' THEN wm.meaning END
          SEPARATOR '; '
        ) AS translation_fr,
        GROUP_CONCAT(
          DISTINCT CASE WHEN wm.language_code = 'en' THEN wm.meaning END
          SEPARATOR '; '
        ) AS translation_en,
        aw.archived_at,
        aw.reason,
        ua.username AS admin_username
      FROM archived_submitted_words aw
      LEFT JOIN word_meanings wm
        ON aw.word_id = wm.word_id
      LEFT JOIN nominal_classes nc
        ON aw.class_id = nc.class_id
      LEFT JOIN users ua
        ON aw.admin_id = ua.user_id
      WHERE aw.user_id = ?
      GROUP BY
        aw.word_id,
        aw.user_id,
        aw.singular,
        aw.plural,
        aw.phonetic,
        aw.class_id,
        aw.status,
        nc.class_name,
        aw.archived_at,
        aw.reason,
        ua.username
      ORDER BY aw.archived_at DESC
      `,
      [id]
    );

    // 🔵 3) Pending verbs : soumissions en attente + slug + traductions FR/EN
    const [pendingVerbs] = await connection.execute(
      `
      SELECT
        pv.submission_id,
        pv.user_id,
        pv.status,
        pv.name,
        pv.root,
        pv.suffix,
        pv.phonetic,
        pv.derived_from,
        sl.slug,
        GROUP_CONCAT(
          CASE WHEN vt.language_code = 'fr' THEN vt.meaning END
          SEPARATOR '; '
        ) AS translation_fr,
        GROUP_CONCAT(
          CASE WHEN vt.language_code = 'en' THEN vt.meaning END
          SEPARATOR '; '
        ) AS translation_en,
        pv.created_at,
        pv.updated_at
      FROM pending_verbs_submissions pv
      LEFT JOIN pending_verbs_slugs sl
        ON sl.submission_id = pv.submission_id
      LEFT JOIN pending_verbs_translations vt
        ON vt.submission_id = pv.submission_id
      WHERE pv.user_id = ?
      GROUP BY
        pv.submission_id,
        pv.user_id,
        pv.status,
        pv.name,
        pv.root,
        pv.suffix,
        pv.phonetic,
        pv.derived_from,
        sl.slug,
        pv.created_at,
        pv.updated_at
      ORDER BY pv.created_at DESC
      `,
      [id]
    );

    // 🔴 4) Archived verbs : approuvés / rejetés
    const [archivedVerbs] = await connection.execute(
      `
      SELECT
        av.verb_id,
        av.user_id,
        av.name,
        av.root,
        av.suffix,
        av.phonetic,
        av.status,
        GROUP_CONCAT(
          CASE WHEN vm.language_code = 'fr' THEN vm.meaning END
          SEPARATOR '; '
        ) AS translation_fr,
        GROUP_CONCAT(
          CASE WHEN vm.language_code = 'en' THEN vm.meaning END
          SEPARATOR '; '
        ) AS translation_en,
        av.archived_at,
        av.reason,
        ua.username AS admin_username
      FROM archived_submitted_verbs av
      LEFT JOIN verb_meanings vm
        ON av.verb_id = vm.verb_id
      LEFT JOIN users ua
        ON av.admin_id = ua.user_id
      WHERE av.user_id = ?
      GROUP BY
        av.verb_id,
        av.user_id,
        av.name,
        av.root,
        av.suffix,
        av.phonetic,
        av.status,
        av.archived_at,
        av.reason,
        ua.username
      ORDER BY av.archived_at DESC
      `,
      [id]
    );

    return {
      pendingWords,
      archivedWords,
      pendingVerbs,
      archivedVerbs,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des soumissions :", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des données.",
    });
  } finally {
    // libération propre de la connexion du pool
    if (connection && typeof connection.release === "function") {
      connection.release();
    } else if (connection && typeof connection.end === "function") {
      await connection.end();
    }
  }
});
