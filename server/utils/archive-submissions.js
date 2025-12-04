// server/utils/archive-submissions.js
// Utilitaires pour archiver les soumissions (mots & verbes) côté admin.
// Ce module ne supprime PAS les pending_* : c'est la route API qui le fait
// (ex. /api/admin/manage-submissions). Ici on se contente de créer une trace
// dans les tables archived_* + copier les traductions associées.

// Archive un MOT
export async function archiveWord(
  connection,
  submissionData,
  status,
  adminId,
  wordId = null,
  reason = null
) {
  if (!submissionData) {
    throw new Error("archiveWord: submissionData manquant");
  }

  const {
    submission_id,
    user_id,
    singular,
    plural,
    class_id,
    phonetic,
    derived_word,
    derived_from_word,
    derived_from_verb,
    number_variability,
    translations = [],
  } = submissionData;

  const [result] = await connection.execute(
    `
      INSERT INTO archived_submitted_words (
        submission_id,
        admin_id,
        user_id,
        singular,
        plural,
        class_id,
        phonetic,
        status,
        word_id,
        reason,
        derived_word,
        derived_from_word,
        derived_from_verb,
        number_variability
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      submission_id,
      adminId,
      user_id,
      singular ?? null,
      plural ?? null,
      class_id ?? null,
      phonetic ?? null,
      status,
      wordId ?? null,
      reason ?? null,
      derived_word ? 1 : 0,
      derived_from_word ?? null,
      derived_from_verb ?? null,
      number_variability ?? null,
    ]
  );

  const archivedId = result.insertId;

  if (Array.isArray(translations) && translations.length) {
    const values = translations
      .filter((tr) => tr.language_code && tr.meaning)
      .map((tr) => [archivedId, tr.language_code, tr.meaning]);

    if (values.length) {
      const placeholders = values.map(() => "(?, ?, ?)").join(", ");
      const flat = values.flat();

      await connection.execute(
        `
          INSERT INTO archived_words_translations (
            archived_word_id,
            language_code,
            meaning
          )
          VALUES ${placeholders}
        `,
        flat
      );
    }
  }

  return archivedId;
}

// Archive un VERBE
export async function archiveVerb(
  connection,
  submissionData,
  status,
  adminId,
  verbId = null,
  reason = null
) {
  if (!submissionData) {
    throw new Error("archiveVerb: submissionData manquant");
  }

  const {
    submission_id,
    user_id,
    name,
    singular,
    infinitive,
    root,
    suffix,
    phonetic,
    translations = [],
  } = submissionData;

  const finalName = name ?? singular ?? infinitive ?? null;

  const [result] = await connection.execute(
    `
      INSERT INTO archived_submitted_verbs (
        submission_id,
        admin_id,
        user_id,
        name,
        root,
        suffix,
        phonetic,
        status,
        verb_id,
        reason
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      submission_id,
      adminId,
      user_id,
      finalName,
      root ?? null,
      suffix ?? null,
      phonetic ?? null,
      status,
      verbId ?? null,
      reason ?? null,
    ]
  );

  const archivedId = result.insertId;

  if (Array.isArray(translations) && translations.length) {
    const values = translations
      .filter((tr) => tr.language_code && tr.meaning)
      .map((tr) => [archivedId, tr.language_code, tr.meaning]);

    if (values.length) {
      const placeholders = values.map(() => "(?, ?, ?)").join(", ");
      const flat = values.flat();

      await connection.execute(
        `
          INSERT INTO archived_verbs_translations (
            archived_verb_id,
            language_code,
            meaning
          )
          VALUES ${placeholders}
        `,
        flat
      );
    }
  }

  return archivedId;
}
