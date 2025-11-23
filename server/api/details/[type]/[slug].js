// server/api/details/[type]/[slug].js
import { withConnection } from "../../../utils/db.config";

export default defineEventHandler(async (event) => {
  const { type, slug } = event.context.params || {};

  if (!type || !slug) {
    console.error("Type ou slug manquant :", { type, slug });
    throw createError({
      statusCode: 400,
      statusMessage: "Type ou slug manquant.",
    });
  }

  try {
    const row = await withConnection(async (connection) => {
      let query = "";
      const params = [slug];

      if (type === "word") {
        query = `
          SELECT 
            w.singular, 
            w.plural, 
            w.phonetic, 
            w.root, 
            nc.class_name AS nominal_class,  
            w.derived_word, 
            w.derived_from_word, 
            w.derived_from_verb, 
            w.number_variability, 
            u.username AS author,  
            w.created_at,
            (SELECT GROUP_CONCAT(wm.meaning SEPARATOR ', ') 
             FROM word_meanings wm 
             WHERE wm.word_id = w.word_id AND wm.language_code = 'fr') AS translation_fr,
            (SELECT GROUP_CONCAT(wm.meaning SEPARATOR ', ') 
             FROM word_meanings wm 
             WHERE wm.word_id = w.word_id AND wm.language_code = 'en') AS translation_en
          FROM words w
          JOIN slugs s ON w.word_id = s.word_id
          LEFT JOIN users u ON w.user_id = u.user_id  
          LEFT JOIN nominal_classes nc ON w.class_id = nc.class_id  
          WHERE s.slug = ?`;
      } else if (type === "verb") {
        query = `
          SELECT 
            v.name, 
            v.phonetic, 
            v.root, 
            v.suffix,
            u.username AS author,  
            v.created_at,
            (SELECT GROUP_CONCAT(vm.meaning SEPARATOR ', ') 
             FROM verb_meanings vm 
             WHERE vm.verb_id = v.verb_id AND vm.language_code = 'fr') AS translation_fr,
            (SELECT GROUP_CONCAT(vm.meaning SEPARATOR ', ') 
             FROM verb_meanings vm 
             WHERE vm.verb_id = v.verb_id AND vm.language_code = 'en') AS translation_en
          FROM verbs v
          JOIN slugs s ON v.verb_id = s.verb_id
          LEFT JOIN users u ON v.user_id = u.user_id  
          WHERE s.slug = ?`;
      } else {
        throw createError({
          statusCode: 400,
          statusMessage: "Type invalide.",
        });
      }

      const [rows] = await connection.execute(query, params);

      if (!rows || rows.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: "Détails non trouvés.",
        });
      }

      return rows[0];
    });

    return row;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails :", error);
    // Si c'est déjà un createError, on le relance tel quel
    if (error?.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne du serveur.",
    });
  }
});
