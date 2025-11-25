// utils/usernameToSlug.js
export function usernameToSlug(username = "") {
  if (!username) return "profil";

  return (
    username
      .normalize("NFD") // supprime les accents
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // tout ce qui n’est pas alphanum → tiret
      .replace(/^-+|-+$/g, "") || "profil"
  );
}
