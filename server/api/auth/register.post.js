// server/api/auth/register.post.js
import { eventHandler, readBody, sendError } from "h3";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { query } from "../../utils/db.config"; // <- notre helper validé

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const username = (body?.username || "").trim();
    const email = (body?.email || "").trim().toLowerCase();
    const password = body?.password || "";

    // Validations minimales (ne pas surcharger ici)
    if (!username || !email || !password) {
      return sendError(event, { statusCode: 400, statusMessage: "Tous les champs sont requis." });
    }
    if (password.length < 8) {
      return sendError(event, { statusCode: 400, statusMessage: "Le mot de passe doit contenir au moins 8 caractères." });
    }

    // Vérifier doublons username/email
    const existing = await query(
      "SELECT username, email FROM users WHERE username = ? OR email = ? LIMIT 1",
      [username, email]
    );
    if (existing.length > 0) {
      const duplicateField = existing[0].email === email ? "email" : "username";
      return sendError(event, { statusCode: 409, statusMessage: `Cet ${duplicateField} est déjà utilisé.` });
    }

    // Préparation des données
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24h
    const emailVerified = 0;

    // Insertion user (attention: pas de colonne "role" dans users)
    await query(
      `INSERT INTO users (username, email, password, verification_token, token_expiry, email_verified)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, verificationToken, tokenExpiry, emailVerified]
    );

    // Runtime config (Nuxt 4) pour SMTP + URL publique
    const { useRuntimeConfig } = await import("#imports");
    const rc = useRuntimeConfig();

    const siteUrl =
      rc.public?.siteUrl ||
      process.env.NUXT_PUBLIC_SITE_URL ||
      process.env.APP_URL ||
      "http://localhost:3000";

    const confirmationUrl = `${siteUrl}/verify-email?token=${verificationToken}`;

    // Transport SMTP (Brevo/Sendinblue, Mailers, etc.)
    // NOTE: Déclare ces clés dans nuxt.config.ts -> runtimeConfig (server) et runtimeConfig.public (client-safe)
    const transporter = nodemailer.createTransport({
      host: rc.smtpHost || process.env.SMTP_HOST,
      port: parseInt(rc.smtpPort || process.env.SMTP_PORT || "587", 10),
      secure: (rc.smtpSecure ?? process.env.SMTP_SECURE) === "true",
      auth: {
        user: rc.smtpUser || process.env.SMTP_USER,
        pass: rc.smtpPass || process.env.SMTP_PASS,
      },
    });

    const from = rc.adminEmail || process.env.ADMIN_EMAIL || rc.smtpUser || process.env.SMTP_USER;

    await transporter.sendMail({
      from,
      to: email,
      subject: "Confirmez votre inscription",
      html: `
        <p>Bonjour ${username},</p>
        <p>Merci de votre inscription. Veuillez confirmer votre adresse e-mail en cliquant sur le lien ci-dessous (valide 24h) :</p>
        <p><a href="${confirmationUrl}" target="_blank" rel="noopener">Confirmer mon inscription</a></p>
        <p>Si vous n'êtes pas à l'origine de cette action, vous pouvez ignorer cet e-mail.</p>
      `,
    });

    return { success: true, message: "Inscription réussie. Vérifiez votre boîte mail pour confirmer votre adresse." };
  } catch (err) {
    console.error("Erreur register.post:", err);
    return sendError(event, { statusCode: 500, statusMessage: "Erreur lors de l'inscription." });
  }
});
