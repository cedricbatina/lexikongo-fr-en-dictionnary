// server/api/auth/resend-verification.post.js
import { defineEventHandler, readBody, createError } from "h3";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { query } from "~/lib/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = String(body?.email || "").trim().toLowerCase();
  if (!email) {
    throw createError({ statusCode: 422, statusMessage: "Email requis" });
  }

  // Cherche l’utilisateur par email
  const rows = await query(
    "SELECT user_id, username, email, email_verified FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  const user = rows?.[0];

  // Réponse générique (anti-leak) si inconnu ou déjà vérifié
  if (!user || user.email_verified) {
    return { ok: true };
  }

  // (Re)génère un token de vérif valide 24h
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await query(
    `UPDATE users
       SET verification_token = ?, token_expiry = ?
     WHERE user_id = ? AND email_verified = 0`,
    [verificationToken, tokenExpiry, user.user_id]
  );

  // URL du site pour composer le lien
  const { useRuntimeConfig } = await import("#imports");
  const rc = useRuntimeConfig();
  const siteUrl =
    rc.public?.siteUrl ||
    process.env.NUXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    "http://localhost:3000";

  const link = `${siteUrl}/verify-email?token=${encodeURIComponent(
    verificationToken
  )}`;

  // SMTP via runtimeConfig
  const transporter = nodemailer.createTransport({
    host: rc.smtpHost || process.env.SMTP_HOST,
    port: parseInt(rc.smtpPort || process.env.SMTP_PORT || "587", 10),
    secure: (rc.smtpSecure ?? process.env.SMTP_SECURE) === "true",
    auth: {
      user: rc.smtpUser || process.env.SMTP_USER,
      pass: rc.smtpPass || process.env.SMTP_PASS,
    },
  });
  const from =
    rc.adminEmail || process.env.ADMIN_EMAIL || rc.smtpUser || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: user.email,
    subject: "Renvoyer la confirmation de votre e-mail",
    html: `
      <p>Bonjour ${user.username},</p>
      <p>Voici un nouveau lien pour confirmer votre adresse e-mail (valide 24h) :</p>
      <p><a href="${link}" target="_blank" rel="noopener">Confirmer mon adresse</a></p>
      <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
    `,
  });

  return { ok: true };
});
