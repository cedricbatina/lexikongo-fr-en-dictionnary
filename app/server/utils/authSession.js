// utils/authSession.js
import jwt from "jsonwebtoken";
import { getCookie, setCookie, deleteCookie } from "h3";

function getRuntimeConfig() {
  // #imports est dispo côté serveur Nitro
  // On évite un import top-level pour garder ce fichier portable
  const { useRuntimeConfig } = require("#imports");
  return useRuntimeConfig();
}

export function getAuthCookieName() {
  const rc = getRuntimeConfig();
  return rc.authCookieName || process.env.AUTH_COOKIE_NAME || "lexikongo_auth";
}

function getJwtSecret() {
  const rc = getRuntimeConfig();
  const secret = rc.jwtSecret || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret manquant (runtimeConfig.jwtSecret ou JWT_SECRET).");
  }
  return secret;
}

export function signJwt(payload, expiresIn = "7d") {
  const secret = getJwtSecret();
  // Ne mets JAMAIS de données sensibles dans le JWT
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt(token) {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

export function setAuthCookie(event, token, maxAgeSec = 60 * 60 * 24 * 7) {
  const name = getAuthCookieName();
  const isProd = process.env.NODE_ENV === "production";
  setCookie(event, name, token, {
    httpOnly: true,
    secure: isProd,   // true en prod (Vercel)
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSec,
  });
}

export function clearAuthCookie(event) {
  const name = getAuthCookieName();
  // deleteCookie gère l’expiration; on force aussi un set vide par compat
  deleteCookie(event, name, { path: "/" });
  setCookie(event, name, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Lit le cookie, vérifie le JWT, hydrate event.context.user et retourne le payload.
 * Payload attendu (ex) : { sub: "123", uid: 123, username: "foo", roles: ["user"] }
 */
export function getUserFromCookie(event) {
  const name = getAuthCookieName();
  const token = getCookie(event, name);
  if (!token) {
    event.context.user = null;
    return null;
  }
  const decoded = verifyJwt(token);
  if (!decoded) {
    event.context.user = null;
    return null;
  }
  // Hydrate un objet minimal (évite d’exposer le token)
  const user = {
    id: decoded.uid ?? (decoded.sub ? Number(decoded.sub) : undefined),
    username: decoded.username,
    roles: Array.isArray(decoded.roles) ? decoded.roles : [],
  };
  event.context.user = user;
  return user;
}

/**
 * Optionnel : guard à utiliser dans des endpoints si besoin.
 */
export function requireUser(event) {
  const user = getUserFromCookie(event);
  if (!user) {
    const { createError } = require("h3");
    throw createError({ statusCode: 401, statusMessage: "Non authentifié" });
  }
  return user;
}
