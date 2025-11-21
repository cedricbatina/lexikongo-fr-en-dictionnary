// stores/verbStore.js
import { defineStore } from "pinia";
import { $fetch } from "ofetch"; // comme pour wordStore

export const useVerbStore = defineStore("verbStore", {
  state: () => ({
    // 🔎 Recherche
    query: "",
    results: [],
    lastQuery: "",
    isLoading: false,
    error: null,

    // 📋 Liste complète (page /verbs)
    items: [],
    page: 1,
    pageSize: 15,
  }),

  getters: {
    hasResults: (state) => state.results && state.results.length > 0,

    totalPages: (state) => {
      if (!state.items.length) return 1;
      return Math.ceil(state.items.length / state.pageSize);
    },

    paginatedVerbs: (state) => {
      const start = (state.page - 1) * state.pageSize;
      return state.items.slice(start, start + state.pageSize);
    },
  },

  actions: {
    // --- Recherche de verbes (barre de recherche éventuelle) ---
    setQuery(q) {
      this.query = q;
    },

    async search(force = false) {
      const q = this.query.trim();

      if (!q) {
        this.results = [];
        this.error = null;
        this.lastQuery = "";
        return;
      }

      if (!force && q === this.lastQuery) {
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const data = await $fetch("/api/verbs", {
          params: { query: q },
        });

        this.results = Array.isArray(data) ? data : [];
        this.lastQuery = q;
      } catch (err) {
        console.error("Erreur lors de la recherche de verbes :", err);
        this.error = "Erreur lors de la recherche. Veuillez réessayer.";
      } finally {
        this.isLoading = false;
      }
    },

    // --- Liste complète de verbes (page /verbs) ---
    async fetchAll() {
      this.isLoading = true;
      this.error = null;

      try {
        const data = await $fetch("/api/verbs", {
          params: { mode: "all" },
        });

        this.items = Array.isArray(data) ? data : [];
        this.page = 1;
      } catch (err) {
        console.error("Erreur lors du chargement des verbes :", err);
        this.error = "Erreur lors du chargement des verbes.";
        this.items = [];
      } finally {
        this.isLoading = false;
      }
    },

    setPage(page) {
      const target = Number(page) || 1;
      const max = this.totalPages;
      this.page = Math.min(Math.max(1, target), max);
    },
  },
});
