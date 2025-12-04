// server/api/admin/manage-pendings/index.get.js
import { defineEventHandler, getQuery, createError } from "h3";
import { getPool } from "../../../utils/db.config";

function toInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) || n <= 0 ? fallback : n;
}

export default defineEventHandler(async (event) => {
  const pool = await getPool();

  const query = getQuery(event);

  const type = (query.type || "all").toString(); // all | word | verb
  const status = (query.status || "pending").toString(); // pending | approved | rejected | all
  const q = (query.q || "").toString().trim();
  const page = toInt(query.page, 1);
  const pageSize = Math.min(toInt(query.pageSize, 20), 100);

  const likeSearch = q ? `%${q}%` : null;

  // Helpers pour construire WHERE + params pour mots / verbes
  const buildWordFilter = () => {
    const where = [];
    const params = [];

    if (status !== "all") {
      where.push("pws.status = ?");
      params.push(status);
    }

    if (likeSearch) {
      where.push(`
        (
          pws.singular LIKE ?
          OR pws.plural LIKE ?
          OR pws.phonetic LIKE ?
          OR u.username LIKE ?
          OR u.email LIKE ?
          OR pwt.meaning LIKE ?
        )
      `);
      params.push(
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch
      );
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    return { whereSql, params };
  };

  const buildVerbFilter = () => {
    const where = [];
    const params = [];

    if (status !== "all") {
      where.push("pvs.status = ?");
      params.push(status);
    }

    if (likeSearch) {
      where.push(`
        (
          pvs.name LIKE ?
          OR pvs.root LIKE ?
          OR pvs.suffix LIKE ?
          OR pvs.phonetic LIKE ?
          OR u.username LIKE ?
          OR u.email LIKE ?
          OR pvt.meaning LIKE ?
        )
      `);
      params.push(
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch
      );
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    return { whereSql, params };
  };

  try {
    const items = [];
    let total = 0;

    // On prépare les requêtes pour mots et verbes
    const { whereSql: wordWhere, params: wordParams } = buildWordFilter();
    const { whereSql: verbWhere, params: verbParams } = buildVerbFilter();

    // ---- Compteurs totaux (pour pagination) ----
    let totalWords = 0;
    let totalVerbs = 0;

    if (type === "all" || type === "word") {
      const [rows] = await pool.execute(
        `
          SELECT COUNT(DISTINCT pws.submission_id) AS total
          FROM pending_words_submissions pws
          LEFT JOIN pending_words_translations pwt
            ON pwt.submission_id = pws.submission_id
          LEFT JOIN users u
            ON u.user_id = pws.user_id
          ${wordWhere}
        `,
        wordParams
      );
      totalWords = rows[0]?.total || 0;
    }

    if (type === "all" || type === "verb") {
      const [rows] = await pool.execute(
        `
          SELECT COUNT(DISTINCT pvs.submission_id) AS total
          FROM pending_verbs_submissions pvs
          LEFT JOIN pending_verbs_translations pvt
            ON pvt.submission_id = pvs.submission_id
          LEFT JOIN users u
            ON u.user_id = pvs.user_id
          ${verbWhere}
        `,
        verbParams
      );
      totalVerbs = rows[0]?.total || 0;
    }

    if (type === "word") {
      total = totalWords;
    } else if (type === "verb") {
      total = totalVerbs;
    } else {
      total = totalWords + totalVerbs;
    }

    const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;
    const offset = (page - 1) * pageSize;

    // ---- Récupération des items ----
    if (type === "word" || type === "all") {
      const [wordRows] = await pool.execute(
        `
          SELECT
            'word' AS kind,
            pws.submission_id,
            sl.slug,
            pws.status,
            pws.singular,
            pws.plural,
            pws.phonetic,
            pws.number_variability,
            pws.created_at,
            u.user_id,
            u.username,
            u.email,
            MAX(CASE WHEN pwt.language_code = 'fr' THEN pwt.meaning END) AS translation_fr,
            MAX(CASE WHEN pwt.language_code = 'en' THEN pwt.meaning END) AS translation_en
          FROM pending_words_submissions pws
          LEFT JOIN pending_words_slugs sl
            ON sl.submission_id = pws.submission_id
          LEFT JOIN pending_words_translations pwt
            ON pwt.submission_id = pws.submission_id
          LEFT JOIN users u
            ON u.user_id = pws.user_id
          ${wordWhere}
          GROUP BY pws.submission_id
          ORDER BY pws.created_at DESC
          LIMIT ? OFFSET ?
        `,
        [...wordParams, pageSize, offset]
      );

      items.push(...wordRows);
    }

    if (type === "verb" || type === "all") {
      const verbOffset = type === "all" ? 0 : offset; // si type=all, on pagine globalement via frontend, mais pour l’instant on simplifie

      const [verbRows] = await pool.execute(
        `
          SELECT
            'verb' AS kind,
            pvs.submission_id,
            sl.slug,
            pvs.status,
            pvs.name,
            pvs.root,
            pvs.suffix,
            pvs.phonetic,
            pvs.created_at,
            u.user_id,
            u.username,
            u.email,
            MAX(CASE WHEN pvt.language_code = 'fr' THEN pvt.meaning END) AS translation_fr,
            MAX(CASE WHEN pvt.language_code = 'en' THEN pvt.meaning END) AS translation_en
          FROM pending_verbs_submissions pvs
          LEFT JOIN pending_verbs_slugs sl
            ON sl.submission_id = pvs.submission_id
          LEFT JOIN pending_verbs_translations pvt
            ON pvt.submission_id = pvs.submission_id
          LEFT JOIN users u
            ON u.user_id = pvs.user_id
          ${verbWhere}
          GROUP BY pvs.submission_id
          ORDER BY pvs.created_at DESC
          LIMIT ? OFFSET ?
        `,
        [...verbParams, pageSize, verbOffset]
      );

      items.push(...verbRows);
    }

    // Tri final : du plus récent au plus ancien
    items.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return db - da;
    });

    // Si type === 'all', on coupe à pageSize après fusion
    const pagedItems = type === "all" ? items.slice(0, pageSize) : items;

    return {
      page,
      pageSize,
      total,
      totalPages,
      items: pagedItems,
      meta: {
        totalWords,
        totalVerbs,
      },
    };
  } catch (err) {
    console.error("Error while listing pending submissions (admin):", err);

    throw createError({
      statusCode: 500,
      statusMessage: "ADMIN_PENDING_LIST_FAILED",
      message: "Erreur lors du chargement des soumissions en attente (admin).",
    });
  }
});
