// server/middleware/require-contributor.js
import { defineEventHandler } from "h3";
import { createRoleGuardMiddleware } from "../utils/roleGuard.js";

const CONTRIBUTOR_PREFIXES = ["/api/contributor"];

export default defineEventHandler((event) => {
  const path = event.path || event.node?.req?.url || "";

  // Si la route ne concerne pas l’espace contributor → on ne fait rien
  const needContributor = CONTRIBUTOR_PREFIXES.some((prefix) =>
    path.startsWith(prefix)
  );
  if (!needContributor) {
    return;
  }

  // contributor + éventuellement admin si allowAdmin = true
  return createRoleGuardMiddleware(["contributor"], { allowAdmin: true })(
    event
  );
});
