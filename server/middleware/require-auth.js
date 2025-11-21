// server/middleware/require-auth.js
import { defineEventHandler, createError } from "h3";
import { getUserFromCookie } from "../utils/authSession.js";

// 🔒 Routes qui DOIVENT être protégées par login
const PROTECTED_PREFIXES = [
  "/api/auth/me",
  "/api/auth/logout",
  "/api/user",
  "/api/users",
  "/api/admin",
  "/api/contributor",
  // ajoute ici d'autres prefixes à protéger si besoin
];

export default defineEventHandler((event) => {
  const path = event.path || event.node?.req?.url || "";

  // Si la route n'est pas dans la liste → on laisse passer (publique)
  const needAuth = PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix));
  if (!needAuth) {
    return;
  }

  // Pour les routes protégées, on vérifie le cookie JWT
  const user = getUserFromCookie(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Non authentifié" });
  }
});
