// stores/wordStore.js
import { defineStore } from "pinia";

export const useWordStore = defineStore("wordStore", {
  state: () => ({
    // Recherche
    query: "",
    language: "kikongo", // 'kikongo' | 'fr' | 'en'
    results: [],
    isLoading: false,
    error: null,
    lastQuery: "",
    lastLanguage: "",

    // Liste complète de mots (pour /words + WordList)
    items: [],
    page: 1,
    pageSize: 15,
  }),

  getters: {
    hasResults: (state) => state.results && state.results.length > 0,

    // Pagination sur la liste complète
    totalPages: (state) => {
      if (!state.items.length) return 1;
      return Math.ceil(state.items.length / state.pageSize);
    },

    paginatedWords: (state) => {
      const start = (state.page - 1) * state.pageSize;
      return state.items.slice(start, start + state.pageSize);
    },
  },

  actions: {
    // --- Recherche (tel que tu l'avais) ---
    setLanguage(lang) {
      this.language = lang;
    },

    setQuery(q) {
      this.query = q;
    },

    async search(force = false) {
      const q = this.query.trim();

      if (!q) {
        this.results = [];
        this.error = null;
        this.lastQuery = "";
        this.lastLanguage = this.language;
        return;
      }

      // Pas besoin de relancer la même requête si rien n'a changé
      if (
        !force &&
        q === this.lastQuery &&
        this.language === this.lastLanguage
      ) {
        return;
      }

      this.isLoading = true;
      this.error = null;

      const { $fetch } = useNuxtApp();

      let url = "/api/words";
      let params = {};

      if (this.language === "kikongo") {
        url = "/api/words";
        params = { query: q, language: "kikongo" };
      } else if (this.language === "fr") {
        url = "/api/words-fr";
        params = { query: q };
      } else if (this.language === "en") {
        url = "/api/words-en";
        params = { query: q };
      }

      try {
        const data = await $fetch(url, { params });
        this.results = Array.isArray(data) ? data : [];
        this.lastQuery = q;
        this.lastLanguage = this.language;
      } catch (err) {
        console.error("Erreur lors de la recherche de mots :", err);
        this.error = "Erreur lors de la recherche. Veuillez réessayer.";
      } finally {
        this.isLoading = false;
      }
    },

    // --- Liste complète de mots (pour WordList / /words/) ---
    async fetchAll() {
      this.isLoading = true;
      this.error = null;

      const { $fetch } = useNuxtApp();

      try {
        const data = await $fetch("/api/all-words-verbs");

        this.items = (Array.isArray(data) ? data : [])
          .filter((item) => item.type === "word" && item.slug)
          .map((item) => ({
            ...item,
            slug: item.slug || null,
          }));

        this.page = 1;
      } catch (err) {
        console.error("Erreur lors du chargement des mots :", err);
        this.error = "Erreur lors du chargement des mots.";
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
