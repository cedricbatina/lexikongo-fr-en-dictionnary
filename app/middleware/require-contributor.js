// server/middleware/require-contributor.js
import { defineEventHandler, createError } from "h3";
import { getUserFromCookie } from "~/utils/authSession";

export default defineEventHandler((event) => {
  const user = getUserFromCookie(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentification requise.",
    });
  }

  const roles = user.roles || [];
  if (!roles.includes("contributor") && !roles.includes("admin")) {
    throw createError({
      statusCode: 403,
      statusMessage: "Accès contributeur requis.",
    });
  }

  event.context.user = user;
});
