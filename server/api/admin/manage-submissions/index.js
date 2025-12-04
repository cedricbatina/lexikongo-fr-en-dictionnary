// server/api/admin/manage-submissions.js
import { getQuery, readBody, createError, sendError } from "h3";
import { getConnection } from "../../../utils/db.config";
import { archiveWord, archiveVerb } from "../../../utils/archive-submissions";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === "GET") {
    return listPendingSubmissions(event);
  }
  if (method === "POST") {
    return handleSubmissionAction(event);
  }

  return sendError(
    event,
    createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    })
  );
});

/**
 * GET /api/admin/manage-submissions
 * Liste les pending words / verbs pour l’admin
 *
 * Query params possibles :
 * - page (par défaut 1)
 * - limit (par défaut 20)
 * - type = all | word | verb
 * - status = all | pending | approved | rejected
 * - search = texte libre (mot, traduction, phonétique…)
 *
 * (NB : cette route est distincte de /api/admin/manage-pendings qui est utilisée par ta page vue.
 *  On la garde pour compat, mais ce n’est pas la liste principale.)
 */
async function listPendingSubmissions(event) {
  const query = getQuery(event);

  const page = Math.max(parseInt(query.page || "1", 10), 1);
  const limit = Math.max(parseInt(query.limit || "20", 10), 1);
  const typeFilter = (query.type || "all").toString(); // 'all' | 'word' | 'verb'
  const statusFilter = (query.status || "all").toString(); // 'all' | 'pending' | 'approved' | 'rejected'
  const search = (query.search || "").toString().trim();

  const offset = (page - 1) * limit;

  const connection = await getConnection();

  try {
    const items = [];

    // ------- Pending WORDS -------
    if (typeFilter === "all" || typeFilter === "word") {
      const whereParts = [];
      const params = [];

      if (statusFilter !== "all") {
        whereParts.push("ws.status = ?");
        params.push(statusFilter);
      }

      if (search) {
        whereParts.push(
          `(ws.singular LIKE ? OR ws.plural LIKE ? OR wt.meaning LIKE ? OR ws.phonetic LIKE ?)`
        );
        const like = `%${search}%`;
        params.push(like, like, like, like);
      }

      const whereSql = whereParts.length
        ? `WHERE ${whereParts.join(" AND ")}`
        : "";

      const [rows] = await connection.execute(
        `
        SELECT
          'word' AS kind,
          ws.submission_id,
          wsl.slug,
          ws.singular,
          ws.plural,
          ws.phonetic,
          ws.status,
          ws.created_at,
          GROUP_CONCAT(
            CASE WHEN wt.language_code = 'fr' THEN wt.meaning END
            SEPARATOR ' | '
          ) AS translation_fr,
          GROUP_CONCAT(
            CASE WHEN wt.language_code = 'en' THEN wt.meaning END
            SEPARATOR ' | '
          ) AS translation_en
        FROM pending_words_submissions ws
        LEFT JOIN pending_words_slugs wsl
          ON wsl.submission_id = ws.submission_id
        LEFT JOIN pending_words_translations wt
          ON wt.submission_id = ws.submission_id
        ${whereSql}
        GROUP BY ws.submission_id
        ORDER BY ws.created_at DESC
        `,
        params
      );

      items.push(...rows);
    }

    // ------- Pending VERBS -------
    if (typeFilter === "all" || typeFilter === "verb") {
      const whereParts = [];
      const params = [];

      if (statusFilter !== "all") {
        whereParts.push("vs.status = ?");
        params.push(statusFilter);
      }

      if (search) {
        whereParts.push(
          `(vs.name LIKE ? OR vs.root LIKE ? OR vt.meaning LIKE ? OR vs.phonetic LIKE ?)`
        );
        const like = `%${search}%`;
        params.push(like, like, like, like);
      }

      const whereSql = whereParts.length
        ? `WHERE ${whereParts.join(" AND ")}`
        : "";

      const [rows] = await connection.execute(
        `
        SELECT
          'verb' AS kind,
          vs.submission_id,
          vsl.slug,
          vs.name AS infinitive,
          vs.root,
          vs.suffix,
          vs.phonetic,
          vs.status,
          vs.created_at,
          GROUP_CONCAT(
            CASE WHEN vt.language_code = 'fr' THEN vt.meaning END
            SEPARATOR ' | '
          ) AS translation_fr,
          GROUP_CONCAT(
            CASE WHEN vt.language_code = 'en' THEN vt.meaning END
            SEPARATOR ' | '
          ) AS translation_en
        FROM pending_verbs_submissions vs
        LEFT JOIN pending_verbs_slugs vsl
          ON vsl.submission_id = vs.submission_id
        LEFT JOIN pending_verbs_translations vt
          ON vt.submission_id = vs.submission_id
        ${whereSql}
        GROUP BY vs.submission_id
        ORDER BY vs.created_at DESC
        `,
        params
      );

      items.push(...rows);
    }

    // Tri final (par date desc, au cas où) + pagination JS
    items.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return db - da;
    });

    const total = items.length;
    const pagedItems = items.slice(offset, offset + limit);

    return {
      page,
      limit,
      total,
      items: pagedItems,
    };
  } catch (err) {
    console.error("Error while listing pending submissions (admin):", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Unable to list pending submissions.",
    });
  } finally {
    connection.release();
  }
}

/**
 * POST /api/admin/manage-submissions
 *
 * Body JSON :
 * {
 *   "submission_id": number,
 *   "content_type": "word" | "verb",
 *   "action": "approve" | "reject" | "delete",
 *   "user_id": admin_id (dans le body) => renommé admin_id ici,
 *   "reason": string | null
 * }
 */
async function handleSubmissionAction(event) {
  const body = await readBody(event);
  const {
    submission_id,
    action,
    user_id: admin_id, // on renomme user_id (du body) en admin_id ici
    content_type,
    reason,
  } = body;

  if (!submission_id || !action || !admin_id || !content_type) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Tous les champs (submission_id, action, admin_id, content_type) sont requis.",
    });
  }

  if (!["word", "verb"].includes(content_type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'content_type doit être "word" ou "verb".',
    });
  }

  if (!["approve", "reject", "delete"].includes(action)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'action doit être "approve", "reject" ou "delete".',
    });
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    if (content_type === "word") {
      await handleWordAction(connection, {
        submission_id,
        action,
        admin_id,
        reason,
      });
    } else {
      await handleVerbAction(connection, {
        submission_id,
        action,
        admin_id,
        reason,
      });
    }

    await connection.commit();

    return { ok: true };
  } catch (err) {
    await connection.rollback();
    console.error("Error while handling submission action (admin):", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors du traitement de la soumission.",
    });
  } finally {
    connection.release();
  }
}

// ----------------- Helpers : fetch pending + traductions -----------------

async function fetchPendingWordWithTranslations(connection, submission_id) {
  const [rows] = await connection.execute(
    `
    SELECT
      ws.*,
      wt.language_code,
      wt.meaning
    FROM pending_words_submissions ws
    LEFT JOIN pending_words_translations wt
      ON wt.submission_id = ws.submission_id
    WHERE ws.submission_id = ?
    `,
    [submission_id]
  );

  if (!rows.length) return null;

  const base = rows[0];

  const translations = rows
    .filter((r) => r.language_code && r.meaning)
    .map((r) => ({
      language_code: r.language_code,
      meaning: r.meaning,
    }));

  return {
    submission_id: base.submission_id,
    user_id: base.user_id,
    singular: base.singular,
    plural: base.plural,
    class_id: base.class_id,
    phonetic: base.phonetic,
    derived_word: base.derived_word,
    derived_from_word: base.derived_from_word,
    derived_from_verb: base.derived_from_verb,
    number_variability: base.number_variability,
    translations,
  };
}

async function fetchPendingVerbWithTranslations(connection, submission_id) {
  const [rows] = await connection.execute(
    `
    SELECT
      vs.*,
      vt.language_code,
      vt.meaning
    FROM pending_verbs_submissions vs
    LEFT JOIN pending_verbs_translations vt
      ON vt.submission_id = vs.submission_id
    WHERE vs.submission_id = ?
    `,
    [submission_id]
  );

  if (!rows.length) return null;

  const base = rows[0];

  const translations = rows
    .filter((r) => r.language_code && r.meaning)
    .map((r) => ({
      language_code: r.language_code,
      meaning: r.meaning,
    }));

  return {
    submission_id: base.submission_id,
    user_id: base.user_id,
    name: base.name,
    root: base.root,
    suffix: base.suffix,
    phonetic: base.phonetic,
    active_verb: base.active_verb,
    derived_verb: base.derived_verb,
    derived_from: base.derived_from,
    derived_verb_type_id: base.derived_verb_type_id,
    translations,
  };
}

// ----------------- ACTION MOTS -----------------

// ----------------- ACTION MOTS -----------------

async function handleWordAction(connection, payload) {
  const { submission_id, action, admin_id, reason } = payload;

  // 1) Récupérer la soumission complète
  const [rows] = await connection.execute(
    `SELECT * FROM pending_words_submissions WHERE submission_id = ?`,
    [submission_id]
  );

  if (!rows.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "Soumission (mot) introuvable.",
    });
  }

  const submission = rows[0];

  // On reconstruit un "submissionData" simple pour archiveWord
  const submissionData = {
    submission_id: submission.submission_id,
    user_id: submission.user_id,
    singular: submission.singular,
    plural: submission.plural,
    class_id: submission.class_id,
    phonetic: submission.phonetic,
    status: submission.status,
    created_at: submission.created_at,
    derived_word: submission.derived_word,
    derived_from_word: submission.derived_from_word,
    derived_from_verb: submission.derived_from_verb,
    number_variability: submission.number_variability,
  };

  // DELETE pur (sans archive)
  if (action === "delete") {
    await deletePendingWord(connection, submission_id);
    return;
  }

  // Pour approve / reject, on récupère les traductions à partir des tables pending
  const [translationsRows] = await connection.execute(
    `SELECT language_code, meaning FROM pending_words_translations WHERE submission_id = ?`,
    [submission_id]
  );

  // On nettoie une fois pour toutes (sert à word_meanings + archive)
  const cleanedTranslations = translationsRows
    .filter((tr) => tr.meaning && tr.meaning.trim())
    .map((tr) => ({
      language_code: tr.language_code || "fr",
      meaning: tr.meaning.trim(),
    }));

  // 2) Si on approuve → créer l'entrée dans words + word_meanings + slugs
  let createdWordId = null;

  if (action === "approve") {
    if (!translationsRows.length) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Impossible d'approuver un mot sans au moins une traduction.",
      });
    }

    // 2.1) Création du mot dans la table principale "words"
    const [insertResult] = await connection.execute(
      `
      INSERT INTO words (
        singular,
        plural,
        class_id,
        phonetic,
        derived_word,
        derived_from_word,
        derived_from_verb,
        is_approved,
        user_id,
        number_variability
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `,
      [
        submission.singular || null,
        submission.plural || null,
        submission.class_id,
        submission.phonetic || null,
        submission.derived_word ?? 0,
        submission.derived_from_word || null,
        submission.derived_from_verb || null,
        submission.user_id || null,
        submission.number_variability || "variable",
      ]
    );

    createdWordId = insertResult.insertId;

    // 2.2) Transfert des traductions vers "word_meanings"
    if (cleanedTranslations.length) {
      const values = [];
      const placeholders = cleanedTranslations
        .map(() => "(?, ?, ?)")
        .join(", ");

      cleanedTranslations.forEach((tr) => {
        values.push(createdWordId, tr.language_code, tr.meaning);
      });

      await connection.execute(
        `
        INSERT INTO word_meanings (word_id, language_code, meaning)
        VALUES ${placeholders}
        `,
        values
      );
    }

    // 2.3) Slug → table unifiée "slugs"
    const [slugRows] = await connection.execute(
      `SELECT slug FROM pending_words_slugs WHERE submission_id = ?`,
      [submission_id]
    );

    const slug = slugRows[0]?.slug || null;
    if (slug) {
      await connection.execute(
        `
        INSERT INTO slugs (slug, word_id, content_type)
        VALUES (?, ?, 'word')
        `,
        [slug, createdWordId]
      );
    }
  }

  // 3) Approve / reject → archiver + supprimer la pending
  const archivedStatus = action === "approve" ? "approved" : "rejected";

  // On enrichit les données d’archive avec les traductions nettoyées
  const submissionForArchive = {
    ...submissionData,
    translations: cleanedTranslations,
  };

  await archiveWord(
    connection,
    submissionForArchive,
    archivedStatus,
    admin_id,
    createdWordId,
    reason || null
  );

  await deletePendingWord(connection, submission_id);
}


async function deletePendingWord(connection, submission_id) {
  await connection.execute(
    `DELETE FROM pending_words_slugs WHERE submission_id = ?`,
    [submission_id]
  );
  await connection.execute(
    `DELETE FROM pending_words_translations WHERE submission_id = ?`,
    [submission_id]
  );
  await connection.execute(
    `DELETE FROM pending_words_submissions WHERE submission_id = ?`,
    [submission_id]
  );
}

// ----------------- ACTION VERBES -----------------

const handleVerbAction = async (connection, payload) => {
  const { submission_id, action, admin_id, reason } = payload;

  const submissionData = await fetchPendingVerbWithTranslations(
    connection,
    submission_id
  );

  if (!submissionData) {
    throw createError({
      statusCode: 404,
      statusMessage: "Soumission (verbe) introuvable.",
    });
  }

  // DELETE = suppression brute
  if (action === "delete") {
    await deletePendingVerb(connection, submission_id);
    return { action: "deleted" };
  }

  const finalStatus = action === "approve" ? "approved" : "rejected";

  let newVerbId = null;

  // ----- APPROVE : on crée le verbe officiel + traductions + slug -----
  if (action === "approve") {
    // Récupérer le slug de la pending
    let slug = null;
    const [slugRows] = await connection.execute(
      `
      SELECT slug
      FROM pending_verbs_slugs
      WHERE submission_id = ?
      `,
      [submission_id]
    );
    if (slugRows.length) {
      slug = slugRows[0].slug;
    }

    // 1. Créer le verbe dans "verbs"
    const [resVerb] = await connection.execute(
      `
      INSERT INTO verbs (
        name,
        root,
        suffix,
        phonetic,
        active_verb,
        derived_verb,
        derived_from,
        is_approved,
        user_id,
        derived_verb_type_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `,
      [
        submissionData.name,
        submissionData.root,
        submissionData.suffix || null,
        submissionData.phonetic || null,
        submissionData.active_verb ?? 1,
        submissionData.derived_verb ?? 0,
        submissionData.derived_from || null,
        submissionData.user_id || null,
        submissionData.derived_verb_type_id || null,
      ]
    );

    newVerbId = resVerb.insertId;

    // 2. Traductions → verb_meanings
    if (newVerbId && Array.isArray(submissionData.translations)) {
      for (const tr of submissionData.translations) {
        if (!tr.meaning || !tr.language_code) continue;

        await connection.execute(
          `
          INSERT INTO verb_meanings (verb_id, language_code, meaning)
          VALUES (?, ?, ?)
          `,
          [newVerbId, tr.language_code, tr.meaning]
        );
      }
    }

    // 3. Slug → verbs_slugs
    // 3. Slug → table unifiée "slugs"
    if (newVerbId && slug) {
      await connection.execute(
        `
    INSERT INTO slugs (slug, verb_id, content_type)
    VALUES (?, ?, 'verb')
    `,
        [slug, newVerbId]
      );
    }
  }

  // ----- ARCHIVE (approved / rejected) -----
  await archiveVerb(
    connection,
    submissionData,
    finalStatus,
    admin_id, // admin
    newVerbId, // verb_id si approuvé
    reason || null
  );

  // Suppression de la pending dans tous les cas
  await deletePendingVerb(connection, submission_id);

  return {
    action: finalStatus,
    verb_id: newVerbId,
  };
};

async function deletePendingVerb(connection, submission_id) {
  await connection.execute(
    `DELETE FROM pending_verbs_slugs WHERE submission_id = ?`,
    [submission_id]
  );
  await connection.execute(
    `DELETE FROM pending_verbs_translations WHERE submission_id = ?`,
    [submission_id]
  );
  await connection.execute(
    `DELETE FROM pending_verbs_submissions WHERE submission_id = ?`,
    [submission_id]
  );
}
