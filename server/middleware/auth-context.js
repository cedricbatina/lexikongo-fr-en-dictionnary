// server/middleware/auth-context.js
import { defineEventHandler } from "h3";
import { getUserFromCookie } from "../utils/authSession";

export default defineEventHandler((event) => {
  // Hydrate event.context.user si un JWT valide est présent
  getUserFromCookie(event);
});
