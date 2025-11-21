import { getConnection } from "../utils/db.config";

export default defineEventHandler(async (event) => {
  let connection;

  // Tu peux changer cette valeur si tu veux 30 jours, 14 jours, etc.
  const DAYS_WINDOW = 90;

  try {
    connection = await getConnection();

    // 1️⃣ Essai principal : expressions sur les N derniers jours
    const [rowsRecent] = await connection.execute(
      `
      SELECT 
        'word' AS type,
        w.singular,
        w.plural,
        w.phonetic,
        NULL AS name,
        (SELECT GROUP_CONCAT(DISTINCT wm.meaning SEPARATOR ', ') 
         FROM word_meanings wm 
         WHERE wm.word_id = w.word_id AND wm.language_code = 'fr') AS translation_fr,
        (SELECT GROUP_CONCAT(DISTINCT wm.meaning SEPARATOR ', ') 
         FROM word_meanings wm 
         WHERE wm.word_id = w.word_id AND wm.language_code = 'en') AS translation_en,
        w.created_at,
        s.slug
      FROM words w
      JOIN slugs s ON w.word_id = s.word_id
      WHERE w.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)

      UNION ALL

      SELECT 
        'verb' AS type,
        NULL AS singular,
        NULL AS plural,
        v.phonetic,
        v.name,
        (SELECT GROUP_CONCAT(DISTINCT vm.meaning SEPARATOR ', ') 
         FROM verb_meanings vm 
         WHERE vm.verb_id = v.verb_id AND vm.language_code = 'fr') AS translation_fr,
        (SELECT GROUP_CONCAT(DISTINCT vm.meaning SEPARATOR ', ') 
         FROM verb_meanings vm 
         WHERE vm.verb_id = v.verb_id AND vm.language_code = 'en') AS translation_en,
        v.created_at,
        s.slug
      FROM verbs v
      JOIN slugs s ON v.verb_id = s.verb_id
      WHERE v.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)

      ORDER BY created_at DESC
    `,
      [DAYS_WINDOW, DAYS_WINDOW]
    );

    let expressions = rowsRecent;

    // 2️⃣ Fallback : si rien sur N jours, on prend quand même les dernières entrées
    if (!expressions.length) {
      const [rowsFallback] = await connection.execute(`
        SELECT 
          'word' AS type,
          w.singular,
          w.plural,
          w.phonetic,
          NULL AS name,
          (SELECT GROUP_CONCAT(DISTINCT wm.meaning SEPARATOR ', ') 
           FROM word_meanings wm 
           WHERE wm.word_id = w.word_id AND wm.language_code = 'fr') AS translation_fr,
          (SELECT GROUP_CONCAT(DISTINCT wm.meaning SEPARATOR ', ') 
           FROM word_meanings wm 
           WHERE wm.word_id = w.word_id AND wm.language_code = 'en') AS translation_en,
          w.created_at,
          s.slug
        FROM words w
        JOIN slugs s ON w.word_id = s.word_id

        UNION ALL

        SELECT 
          'verb' AS type,
          NULL AS singular,
          NULL AS plural,
          v.phonetic,
          v.name,
          (SELECT GROUP_CONCAT(DISTINCT vm.meaning SEPARATOR ', ') 
           FROM verb_meanings vm 
           WHERE vm.verb_id = v.verb_id AND vm.language_code = 'fr') AS translation_fr,
          (SELECT GROUP_CONCAT(DISTINCT vm.meaning SEPARATOR ', ') 
           FROM verb_meanings vm 
           WHERE vm.verb_id = v.verb_id AND vm.language_code = 'en') AS translation_en,
          v.created_at,
          s.slug
        FROM verbs v
        JOIN slugs s ON v.verb_id = s.verb_id

        ORDER BY created_at DESC
        LIMIT 50
      `);

      expressions = rowsFallback;
    }

    const wordCount = expressions.filter((e) => e.type === "word").length;
    const verbCount = expressions.filter((e) => e.type === "verb").length;

    return {
      wordCount,
      verbCount,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des dernières expressions :",
      error
    );
    return {
      error: "Erreur lors de la récupération des dernières expressions.",
    };
  } finally {
    if (connection) {
      try {
        if (typeof connection.release === "function") {
          connection.release();
        } else if (typeof connection.end === "function") {
          await connection.end();
        }
      } catch (e) {
        console.error("Erreur lors de la fermeture de la connexion :", e);
      }
    }
  }
});
