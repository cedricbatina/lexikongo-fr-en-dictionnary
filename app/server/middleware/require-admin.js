// server/middleware/require-admin.js
import { defineEventHandler } from "h3";
import { createRoleGuardMiddleware } from "~/utils/roleGuard";

export default defineEventHandler((event) => {
  // Optionnel : ne viser que certaines routes
  // if (!event.path.startsWith("/api/admin")) return;
  return createRoleGuardMiddleware(["admin"])(event);
});
