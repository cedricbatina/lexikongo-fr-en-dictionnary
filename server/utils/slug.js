// server/utils/slug.js
export function toSlug(input = "") {
  if (!input || typeof input !== "string") return "";

  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Garantit un slug unique dans la table slugs.
 * - connection : connexion MySQL (de withConnection)
 * - baseSlug : slug de base (ex: "nzu")
 * - contentType : "word" | "verb"
 * - currentSlug : slug actuel de cette entrée (pour ne pas le recréer si déjà ok)
 */
export async function ensureUniqueSlug(
  connection,
  baseSlug,
  contentType,
  currentSlug = null
) {
  if (!baseSlug) {
    return currentSlug || "";
  }

  // Si on ne change pas vraiment de base (ex : singular identique), on garde
  if (currentSlug && currentSlug === baseSlug) {
    return currentSlug;
  }

  // Récupérer tous les slugs qui commencent par baseSlug (base, base-2, base-3, ...)
  const [rows] = await connection.execute(
    `
      SELECT slug
      FROM slugs
      WHERE content_type = ?
        AND (slug = ? OR slug LIKE CONCAT(?, '-%'))
    `,
    [contentType, baseSlug, baseSlug]
  );

  if (!rows.length) {
    // baseSlug est libre
    return baseSlug;
  }

  // Si currentSlug est dans la liste et que baseSlug est déjà utilisé par cette même entrée,
  // on peut le garder (cas où on a re-sauvegardé sans vraiment changer)
  const existing = rows.map((r) => r.slug);
  if (currentSlug && existing.length === 1 && existing[0] === currentSlug) {
    return currentSlug;
  }

  // Chercher le suffixe max existant, ex : base, base-2, base-3 => on repart sur max+1
  let maxSuffix = 1;

  for (const s of existing) {
    if (s === baseSlug) {
      maxSuffix = Math.max(maxSuffix, 2);
      continue;
    }
    const m = s.match(new RegExp(`^${baseSlug}-(\\d+)$`));
    if (m) {
      const n = parseInt(m[1], 10);
      if (!Number.isNaN(n)) {
        maxSuffix = Math.max(maxSuffix, n + 1);
      }
    }
  }

  return `${baseSlug}-${maxSuffix}`;
}
