// server/middleware/require-auth.js
import { defineEventHandler, createError } from "h3";
import { getUserFromCookie } from "~/utils/authSession";

export default defineEventHandler((event) => {
  const user = getUserFromCookie(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Non authentifié" });
});
