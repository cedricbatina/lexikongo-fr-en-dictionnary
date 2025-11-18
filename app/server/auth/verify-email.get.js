// server/api/auth/verify-email.get.js
import { defineEventHandler, getQuery, sendError } from "h3";
import { query } from "~/lib/db";

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);

  if (!token || typeof token !== "string") {
    return sendError(event, {
      statusCode: 400,
      statusMessage: "Token manquant.",
    });
  }

  try {
    // Confirme l'email si :
    // - le token correspond
    // - l'email n'est pas déjà vérifié
    // - ET token_expiry est NULL OU encore valide
    const res = await query(
      `UPDATE users
         SET email_verified = 1,
             verification_token = NULL,
             token_expiry = NULL
       WHERE verification_token = ?
         AND email_verified = 0
         AND (token_expiry IS NULL OR token_expiry >= NOW())`,
      [token]
    );

    if (!res?.affectedRows) {
      return sendError(event, {
        statusCode: 400,
        statusMessage: "Token invalide ou expiré.",
      });
    }

    return { success: true, message: "Votre email a été vérifié avec succès !" };
  } catch (err) {
    console.error("verify-email.get error:", err);
    return sendError(event, {
      statusCode: 500,
      statusMessage: "Erreur lors de la vérification.",
    });
  }
});
