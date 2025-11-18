// stores/authStore.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    ready: false,          // a fini de charger l'état (utile au layout)
    authenticated: false,  // bool global
    user: null,            // { id, username, email?, roles[], email_verified? }
    roles: [],             // alias pratique = user?.roles || []
    pending: false,        // état pour boutons/login etc.
    error: null,
  }),

  getters: {
    isLoggedIn: (s) => s.authenticated,
    hasRole: (s) => (role) => s.roles.includes(role),
    hasAnyRole: (s) => (arr = []) => arr.some((r) => s.roles.includes(r)),
  },

  actions: {
    // Charge /api/auth/me (SSR + CSR). Ne lit PAS le cookie côté client.
    async fetchMe() {
      this.error = null;
      try {
        const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;
        const res = await $fetch("/api/auth/me", { method: "GET", headers });

        this.authenticated = !!res?.authenticated;
        this.user = res?.user || null;
        this.roles = Array.isArray(this.user?.roles) ? this.user.roles : [];
      } catch (e) {
        this.authenticated = false;
        this.user = null;
        this.roles = [];
        this.error = e?.data?.statusMessage || e?.message || "Erreur d'authentification";
      } finally {
        this.ready = true;
      }
    },

    // Connexion : le serveur pose le cookie HttpOnly.
    async login({ identifier, password }) {
      this.pending = true;
      this.error = null;
      try {
        await $fetch("/api/auth/login", {
          method: "POST",
          body: { identifier, password },
        });
        await this.fetchMe();
        return { ok: this.authenticated };
      } catch (e) {
        this.error = e?.data?.statusMessage || e?.message || "Échec de la connexion";
        this.authenticated = false;
        this.user = null;
        this.roles = [];
        return { ok: false, error: this.error };
      } finally {
        this.pending = false;
      }
    },

    // Déconnexion : le serveur efface le cookie HttpOnly.
    async logout() {
      this.pending = true;
      this.error = null;
      try {
        await $fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // même si l’API échoue, on purge localement
      } finally {
        this.authenticated = false;
        this.user = null;
        this.roles = [];
        this.pending = false;
      }
    },
  },
});
