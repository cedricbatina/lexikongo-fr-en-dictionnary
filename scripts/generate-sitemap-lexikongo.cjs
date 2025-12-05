// scripts/generate-sitemap-lexikongo.cjs

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

// 🔹 Routes statiques principales Lexikongo
const staticRoutes = [
  "/",
  "/expressions",
  "/expressionlist-card",
  "/words",
  "/wordlist-card",
  "/verbs",
  "/verblist-card",
  "/search",
  "/contribution",


  // Documentation : toutes les pages publiques
  "/documentation",
  "/documentation/for-devs",
  "/documentation/for-contributors",
  "/documentation/for-admins",
  "/documentation/for-users",

  // Autres pages publiques
  "/privacy",
  "/faqs",
  "/contribute",
  "/contact",
];


// Connexion BDD (mêmes env vars que ton app Nuxt)
async function getDbConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  });
}

async function generateSitemapRoutes() {
  const connection = await getDbConnection();
  const sitemapEntries = [];

  const nowIso = new Date().toISOString();

  // 1️⃣ Routes statiques
  for (const route of staticRoutes) {
    sitemapEntries.push({
      loc: route,
      lastmod: nowIso,
      changefreq: "weekly",
      priority: 0.8,
    });
  }

  // 2️⃣ Mots (details/word/:slug)
  // - slugs.content_type = 'word'
  // - on ne prend que les mots approuvés
  const [wordRows] = await connection.execute(
    `
    SELECT s.slug, w.created_at, w.updated_at
    FROM slugs s
    JOIN words w ON w.word_id = s.word_id
    WHERE s.content_type = 'word'
      AND w.is_approved = 1
    `
  );

  for (const row of wordRows) {
    sitemapEntries.push({
      loc: `/details/word/${row.slug}`,
      lastmod: row.updated_at || row.created_at || nowIso,
      changefreq: "weekly",
      priority: 0.9,
    });
  }

  // 3️⃣ Verbes (details/verb/:slug)
  const [verbRows] = await connection.execute(
    `
    SELECT s.slug, v.created_at, v.updated_at
    FROM slugs s
    JOIN verbs v ON v.verb_id = s.verb_id
    WHERE s.content_type = 'verb'
      AND v.is_approved = 1
    `
  );

  for (const row of verbRows) {
    sitemapEntries.push({
      loc: `/details/verb/${row.slug}`,
      lastmod: row.updated_at || row.created_at || nowIso,
      changefreq: "weekly",
      priority: 0.9,
    });
  }

  await connection.end();

  // 4️⃣ Écriture du JSON
  const outputDir = path.resolve(__dirname, "../server/data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "sitemapRoutes.json");
  fs.writeFileSync(outputPath, JSON.stringify(sitemapEntries, null, 2));

  console.log(`✅ ${sitemapEntries.length} routes écrites dans ${outputPath}`);
}

generateSitemapRoutes().catch((err) => {
  console.error("❌ Erreur lors de la génération du sitemap:", err);
  process.exit(1);
});
