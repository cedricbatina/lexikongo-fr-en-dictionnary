// stores/confirmStore.js
import { defineStore } from "pinia";

export const useConfirmStore = defineStore("confirmStore", {
  state: () => ({
    open: false,
    title: "",
    message: "",
    confirmLabel: "",
    cancelLabel: "",
    danger: false,
    _resolver: null,
  }),

  actions: {
    ask(options = {}) {
      const {
        title = "",
        message = "",
        confirmLabel = "OK",
        cancelLabel = "Annuler",
        danger = false,
      } = options;

      return new Promise((resolve) => {
        this.open = true;
        this.title = title;
        this.message = message;
        this.confirmLabel = confirmLabel;
        this.cancelLabel = cancelLabel;
        this.danger = danger;
        this._resolver = resolve;
      });
    },

    confirm() {
      if (this._resolver) this._resolver(true);
      this._reset();
    },

    cancel() {
      if (this._resolver) this._resolver(false);
      this._reset();
    },

    _reset() {
      this.open = false;
      this.title = "";
      this.message = "";
      this.confirmLabel = "";
      this.cancelLabel = "";
      this.danger = false;
      this._resolver = null;
    },
  },
});
