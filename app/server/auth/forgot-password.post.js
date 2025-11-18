// server/api/auth/forgot-password.post.js
import { defineEventHandler, readBody } from "h3";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { query } from "~/lib/db";

function sha256Hex(str) {
  return crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = String(body?.email || "").trim().toLowerCase();

  // Réponse générique par défaut
  const okResponse = { ok: true };

  if (!email) return okResponse;

  // Cherche user (email_verified = 1 recommandé)
  const rows = await query(
    "SELECT user_id, username, email, email_verified FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  const user = rows?.[0];
  if (!user || !user.email_verified) {
    // Ne pas révéler l’existence de l’email
    return okResponse;
  }

  // Génére un token brut + hash
  const rawToken = crypto.randomBytes(48).toString("hex"); // 96 chars
  const tokenHash = sha256Hex(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

  // Enregistre le reset (on ne supprime pas les anciens, used/expired filtreront)
  await query(
    `INSERT INTO password_resets (user_id, token_hash, expires_at)
     VALUES (?, ?, ?)`,
    [user.user_id, tokenHash, expiresAt]
  );

  // Compose le lien
  const { useRuntimeConfig } = await import("#imports");
  const rc = useRuntimeConfig();
  const siteUrl =
    rc.public?.siteUrl ||
    process.env.NUXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    "http://localhost:3000";

  const resetLink = `${siteUrl}/reset?token=${encodeURIComponent(rawToken)}`;

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
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <p>Bonjour ${user.username},</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe. Ce lien est valable 1 heure :</p>
      <p><a href="${resetLink}" target="_blank" rel="noopener">Réinitialiser mon mot de passe</a></p>
      <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
    `,
  });

  return okResponse;
});
