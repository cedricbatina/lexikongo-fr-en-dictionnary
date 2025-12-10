// server/api/contribute/mobile-money-request.post.js
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { name, phone, country, operator, amount, message } = body || {};

  if (!name || !phone) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nom et téléphone sont obligatoires.",
    });
  }

  // Ici tu pourras plus tard :
  // - envoyer un email à l’admin
  // - créer une entrée en base "donations_requests"
  // Pour l’instant on log simplement côté serveur.
  console.log("[Mobile Money] Nouvelle demande :", {
    name,
    phone,
    country,
    operator,
    amount,
    message,
    createdAt: new Date().toISOString(),
  });

  return {
    ok: true,
  };
});
