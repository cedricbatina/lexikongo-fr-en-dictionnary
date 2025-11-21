// app/plugins/translate-bridge.server.js
// Bridge ultra simple vers les traductions, SSR-safe, sans getQuery.

export default defineNuxtPlugin(async (nuxtApp) => {
  // Nuxt i18n est déjà installé, on récupère l'instance
  const i18n = nuxtApp.$i18n; // Composer de vue-i18n fourni par @nuxtjs/i18n

  // Cache local des fichiers de locale (optionnel, pour éviter de re-importer)
  const maps = {};

  async function loadLocale(loc) {
    if (maps[loc]) return;

    try {
      // IMPORTANT : on respecte le langDir: 'i18n/locales' de nuxt.config
      const mod = await import(`~/i18n/locales/${loc}.json`);
      maps[loc] = mod.default || mod;
    } catch {
      // Si le fichier n'existe pas, on met un objet vide
      maps[loc] = {};
    }
  }

  // On s'assure que la locale courante a été chargée
  const currentLocale = i18n.locale.value || i18n.fallbackLocale.value || "fr";
  await loadLocale(currentLocale);

  // Bridge : $translation / $tBridge → préférer le JSON brut, sinon fallback sur i18n.t
  function translation(key, params) {
    const loc = i18n.locale.value || currentLocale;
    const map = maps[loc] || {};

    let msg = map[key];

    // Si la clé n'est pas dans notre JSON fait maison, on délègue à nuxt-i18n
    if (!msg) {
      return i18n.t(key, params);
    }

    // Petite interpolation {placeholder}
    if (params && typeof msg === "string") {
      for (const [k, v] of Object.entries(params)) {
        msg = msg.replace(new RegExp(`{${k}}`, "g"), String(v));
      }
    }

    return msg;
  }

  // Injection globale : this.$translation, this.$tBridge, nuxtApp.$translation, etc.
  nuxtApp.provide("translation", translation);
  nuxtApp.provide("tBridge", translation);
});
