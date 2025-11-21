// server/middleware/require-admin.js
import { defineEventHandler } from "h3";
import { createRoleGuardMiddleware } from "../utils/roleGuard.js";

const ADMIN_PREFIXES = ["/api/admin"];

export default defineEventHandler((event) => {
  const path = event.path || event.node?.req?.url || "";

  // Si la route ne commence pas par /api/admin → on ne fait rien
  const needAdmin = ADMIN_PREFIXES.some((prefix) => path.startsWith(prefix));
  if (!needAdmin) {
    return;
  }

  // Ici seulement on applique le guard
  return createRoleGuardMiddleware(["admin"])(event);
});
