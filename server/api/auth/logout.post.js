// server/api/auth/logout.post.js
import { defineEventHandler } from "h3";
import { clearAuthCookie } from "../../utils/authSession";

export default defineEventHandler(async (event) => {
  clearAuthCookie(event);
  return { success: true };
});
