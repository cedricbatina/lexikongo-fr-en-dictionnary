// server/api/auth/me.get.js
import { defineEventHandler } from "h3";
import { getUserFromCookie } from "~/utils/authSession";
// (Optionnel) pour enrichir email/email_verified depuis la DB :
// import { query } from "~/lib/db";

export default defineEventHandler(async (event) => {
  const user = getUserFromCookie(event);

  if (!user) {
    return { authenticated: false, user: null };
  }

  // Optionnel : enrichir depuis la DB (décommenter si besoin)
  // try {
  //   const rows = await query(
  //     "SELECT email, email_verified FROM users WHERE user_id = ? LIMIT 1",
  //     [user.id]
  //   );
  //   if (rows?.[0]) {
  //     user.email = rows[0].email;
  //     user.email_verified = !!rows[0].email_verified;
  //   }
  // } catch {
  //   // on ignore l’enrichissement si la DB tombe; on garde le profil minimal
  // }

  return {
    authenticated: true,
    user,
  };
});
