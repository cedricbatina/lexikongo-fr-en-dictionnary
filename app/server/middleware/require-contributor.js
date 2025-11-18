// server/middleware/require-contributor.js
import { defineEventHandler } from "h3";
import { createRoleGuardMiddleware } from "~/utils/roleGuard";

export default defineEventHandler((event) => {
  return createRoleGuardMiddleware(["contributor"], { allowAdmin: true })(event);
});
