//app/plugins/toastification.js
import { defineNuxtPlugin } from "#app";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Importation du module par défaut
import ToastificationModule from "vue-toastification";

export default defineNuxtPlugin((nuxtApp) => {
  // Configuration globale de vue-toastification
  nuxtApp.vueApp.use(Toast, {
    timeout: 3000, // Durée des toasts en millisecondes
    position: "top-right", // Position par défaut
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    icon: true,
  });

  // Exporter explicitement `useToast` pour vos composants
  nuxtApp.provide("useToast", ToastificationModule.useToast);
});
