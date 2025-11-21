// stores/expressionStore.js
import { defineStore } from "pinia";
import { $fetch } from "ofetch";

export const useExpressionStore = defineStore("expressionStore", {
  state: () => ({
    items: [], // toutes les expressions (mots + verbes)
    isLoading: false,
    error: null,

    // filtres
    type: "all", // "all" | "word" | "verb"
    search: "",

    // pagination
    page: 1,
    pageSize: 30,
  }),

  getters: {
    // Liste filtrée (type + recherche)
    filteredItems() {
      let list = this.items || [];

      // filtre type
      if (this.type === "word") {
        list = list.filter((item) => item.type === "word");
      } else if (this.type === "verb") {
        list = list.filter((item) => item.type === "verb");
      }

      // recherche
      const q = (this.search || "").trim().toLowerCase();
      if (!q) return list;

      return list.filter((item) => {
        const singular = (item.singular || "").toLowerCase();
        const plural = (item.plural || "").toLowerCase();
        const fr = (item.translation_fr || "").toLowerCase();
        const en = (item.translation_en || "").toLowerCase();

        return (
          singular.includes(q) ||
          plural.includes(q) ||
          fr.includes(q) ||
          en.includes(q)
        );
      });
    },

    totalPages() {
      const total = this.filteredItems.length || 0;
      if (!total) return 1;
      return Math.ceil(total / this.pageSize);
    },

    paginatedExpressions() {
      const start = (this.page - 1) * this.pageSize;
      return this.filteredItems.slice(start, start + this.pageSize);
    },
  },

  actions: {
    setType(type) {
      this.type = type;
      this.page = 1;
    },

    setSearch(q) {
      this.search = q || "";
      this.page = 1;
    },

    setPage(page) {
      const target = Number(page) || 1;
      const max = this.totalPages;
      this.page = Math.min(Math.max(1, target), max);
    },

    async fetchAll() {
      this.isLoading = true;
      this.error = null;

      try {
        const data = await $fetch("/api/all-words-verbs");
        console.log("[expressionStore] données brutes :", data);

        this.items = Array.isArray(data) ? data : [];
        console.log(
          "[expressionStore] items chargés :",
          this.items.length,
          "expressions"
        );

        this.page = 1;
      } catch (err) {
        console.error("Erreur lors du chargement des expressions :", err);
        this.error = "Erreur lors du chargement des expressions.";
        this.items = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
});
