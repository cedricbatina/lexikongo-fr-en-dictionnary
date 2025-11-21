// utils/roleGuard.js
import { createError } from "h3";
import { getUserFromCookie } from "../utils/authSession";

// Hiérarchie simple (modifiable si besoin)
const RANK = { user: 1, contributor: 2, admin: 3 };

export function hasAnyRole(userRoles = [], allowed = [], { allowAdmin = true } = {}) {
  const set = new Set(userRoles.map(r => String(r).toLowerCase()));
  if (allowAdmin && set.has("admin")) return true;
  return allowed.some(role => set.has(String(role).toLowerCase()));
}

export function hasAtLeast(userRoles = [], minRole) {
  const min = RANK[String(minRole).toLowerCase()] ?? 0;
  return userRoles.some(r => (RANK[String(r).toLowerCase()] ?? 0) >= min);
}

// Guard générique (ANY des rôles listés)
export function requireAnyRole(event, allowed = [], opts = { allowAdmin: true }) {
  const user = getUserFromCookie(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Non authentifié" });
  if (!hasAnyRole(user.roles, allowed, opts)) {
    throw createError({ statusCode: 403, statusMessage: "Accès refusé" });
  }
  return user; // pratique si on veut continuer avec l'id, etc.
}

// Guard hiérarchique (au moins un certain niveau)
export function requireAtLeastRole(event, minRole) {
  const user = getUserFromCookie(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Non authentifié" });
  if (!hasAtLeast(user.roles, minRole)) {
    throw createError({ statusCode: 403, statusMessage: "Accès refusé" });
  }
  return user;
}

// Factory pour créer un middleware serveur ciblé
export function createRoleGuardMiddleware(allowed = [], opts = { allowAdmin: true }) {
  return (event) => {
    requireAnyRole(event, allowed, opts);
  };
}
