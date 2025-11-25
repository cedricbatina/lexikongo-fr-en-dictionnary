// server/api/admin/total-statistics.get.js
import { eventHandler } from "h3";
import { query } from "../utils/db.config";

export default eventHandler(async () => {
  try {
    const [userRow] = await query("SELECT COUNT(*) AS totalUsers FROM users");
    const [wordRow] = await query("SELECT COUNT(*) AS totalWords FROM words");
    const [verbRow] = await query("SELECT COUNT(*) AS totalVerbs FROM verbs");

    return {
      totalUsers: userRow.totalUsers ?? 0,
      totalWords: wordRow.totalWords ?? 0,
      totalVerbs: verbRow.totalVerbs ?? 0,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques :", error);
    // On renvoie quand même des nombres pour ne pas casser le front
    return {
      totalUsers: 0,
      totalWords: 0,
      totalVerbs: 0,
      error: "Erreur lors de la récupération des statistiques.",
    };
  }
});
