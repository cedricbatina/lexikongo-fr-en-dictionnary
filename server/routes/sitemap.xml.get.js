import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

export default defineEventHandler((event) => {
  // URL de base de ton site en prod
  const baseUrl = process.env.PUBLIC_SITE_URL || "https://lexikongo.fr";

  const filePath = resolve(process.cwd(), "server/data/sitemapRoutes.json");

  let entries = [];
  if (existsSync(filePath)) {
    try {
      const raw = readFileSync(filePath, "utf8");
      entries = JSON.parse(raw);
    } catch (e) {
      console.error("Erreur lecture sitemapRoutes.json:", e);
    }
  }

  if (!Array.isArray(entries) || !entries.length) {
    // Fallback minimal si jamais le JSON n'existe pas
    entries = [
      {
        loc: "/",
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 1.0,
      },
    ];
  }

  const urlsXml = entries
    .map((e) => {
      const loc = `${baseUrl}${e.loc}`;
      const lastmod = e.lastmod
        ? new Date(e.lastmod).toISOString()
        : new Date().toISOString();

      return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${e.changefreq || "weekly"}</changefreq>
    <priority>${e.priority ?? 0.8}</priority>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urlsXml}
</urlset>`;

  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  return sitemap;
});
