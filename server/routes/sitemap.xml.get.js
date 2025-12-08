// server/routes/sitemap.xml.get.js
import { defineEventHandler } from "h3";
import { useRuntimeConfig } from "#imports";
import sitemapEntries from "../data/sitemapRoutes.json";

// Petite fonction pour échapper les caractères XML
function escapeXml(value) {
  if (!value) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const baseUrl =
    (config.public && config.public.siteUrl) || "https://lexikongo.fr";

  const routes = Array.isArray(sitemapEntries) ? sitemapEntries : [];

  const urlsXml = routes
    .map((entry) => {
      const loc = new URL(entry.loc, baseUrl).toString();
      const lastmod = entry.lastmod || new Date().toISOString();
      const changefreq = entry.changefreq || "weekly";
      const priority =
        typeof entry.priority === "number" ? entry.priority : 0.5;

      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
        `    <changefreq>${escapeXml(changefreq)}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlsXml,
    "</urlset>",
  ].join("\n");

  event.node.res.setHeader("Content-Type", "application/xml; charset=utf-8");
  return xml;
});
