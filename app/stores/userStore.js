// stores/userStore.js
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    currentProfile: null, // fiche profil affichée/éditée
    loading: false,
    saving: false,
    deleting: false,
    error: null,
  }),

  actions: {
    setProfileFromAuth() {
      const auth = useAuthStore();
      if (auth.user) {
        this.currentProfile = { ...auth.user };
      }
    },

    async updateProfileBySlug(slug, payload = {}) {
      this.saving = true;
      this.error = null;
      try {
        const res = await $fetch(`/api/users/edit/${slug}`, {
          method: "PATCH",
          body: payload,
        });

        if (!res?.ok) {
          throw new Error(res?.message || "Échec de la mise à jour du profil.");
        }

        this.currentProfile = res.user || null;

        // Si c’est l’utilisateur courant, on resynchronise aussi authStore
        const auth = useAuthStore();
        if (auth.user && auth.user.id === this.currentProfile?.id) {
          auth.user = { ...auth.user, ...this.currentProfile };
          auth.roles = Array.isArray(this.currentProfile.roles)
            ? this.currentProfile.roles
            : auth.roles;
        }

        return { ok: true, user: this.currentProfile };
      } catch (err) {
        console.error("Erreur updateProfileBySlug :", err);
        this.error =
          err?.data?.statusMessage ||
          err?.message ||
          "Erreur lors de la mise à jour du profil.";
        return { ok: false, error: this.error };
      } finally {
        this.saving = false;
      }
    },

    async deleteAccountBySlug(slug) {
      this.deleting = true;
      this.error = null;
      try {
        const res = await $fetch(`/api/users/delete/${slug}`, {
          method: "DELETE",
        });

        if (!res?.ok) {
          throw new Error(res?.message || "Échec de la suppression du compte.");
        }

        // Si c’est le compte courant, on purge aussi authStore
        const auth = useAuthStore();
        if (auth.user && auth.user.id === res.deletedUserId) {
          auth.authenticated = false;
          auth.user = null;
          auth.roles = [];
        }

        this.currentProfile = null;

        return { ok: true };
      } catch (err) {
        console.error("Erreur deleteAccountBySlug :", err);
        this.error =
          err?.data?.statusMessage ||
          err?.message ||
          "Erreur lors de la suppression du compte.";
        return { ok: false, error: this.error };
      } finally {
        this.deleting = false;
      }
    },
  },
});
