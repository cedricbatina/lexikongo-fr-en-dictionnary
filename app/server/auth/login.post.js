// server/api/auth/login.post.js
import { eventHandler, readBody, sendError } from "h3";
import bcrypt from "bcrypt";
import { query } from "~/lib/db";
import { signJwt, setAuthCookie } from "~/utils/authSession"; // ← NEW

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const identifier = (body?.identifier || "").trim(); // email OU username
    const password = body?.password || "";

    if (!identifier || !password) {
      return sendError(event, {
        statusCode: 400,
        statusMessage: "Identifiants incomplets.",
      });
    }

    // Tenter par email, sinon par username
    const users = await query(
      "SELECT user_id, username, email, password, email_verified FROM users WHERE email = ? OR username = ? LIMIT 1",
      [identifier.toLowerCase(), identifier]
    );
    if (users.length === 0) {
      return sendError(event, {
        statusCode: 401,
        statusMessage: "Identifiants invalides.",
      });
    }

    const user = users[0];

    // Email non confirmé ?
    if (!user.email_verified) {
      return sendError(event, {
        statusCode: 403,
        statusMessage:
          "E-mail non confirmé. Veuillez vérifier votre boîte mail.",
      });
    }

    // Vérification mot de passe
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return sendError(event, {
        statusCode: 401,
        statusMessage: "Identifiants invalides.",
      });
    }

    // Rôles (array de strings)
    const rowsRoles = await query(
      `SELECT r.role_name
         FROM roles r
         INNER JOIN user_roles ur ON ur.role_id = r.role_id
        WHERE ur.user_id = ?`,
      [user.user_id]
    );
    const roles = rowsRoles.map((r) => r.role_name);

    // --- JWT + Cookie via helpers (authSession) ---
    const token = signJwt(
      {
        sub: String(user.user_id),
        uid: user.user_id,
        username: user.username,
        roles,
      },
      "7d"
    );
    setAuthCookie(event, token); // HttpOnly, Secure, SameSite=Lax, 7j

    // Réponse minimale (jamais de token)
    return {
      success: true,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        roles,
        email_verified: !!user.email_verified,
      },
    };
  } catch (err) {
    console.error("Erreur login.post:", err);
    return sendError(event, {
      statusCode: 500,
      statusMessage: "Erreur lors de la connexion.",
    });
  }
});
