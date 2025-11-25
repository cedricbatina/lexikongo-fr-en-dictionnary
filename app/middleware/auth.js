// middleware/auth.js
import { useAuthStore } from "~/stores/authStore";
import { defineNuxtRouteMiddleware, navigateTo } from "#imports";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // Charger l'état utilisateur si ce n'est pas fait
  if (!authStore.ready) {
    try {
      await authStore.fetchMe();
    } catch (e) {
      console.error("Erreur fetchMe dans middleware auth :", e);
    }
  }

  // Si pas connecté → redirection vers /login avec redirect=...
  if (!authStore.isLoggedIn) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }

  // sinon on laisse passer
});
