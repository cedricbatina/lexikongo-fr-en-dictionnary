export default defineNuxtPlugin(async (nuxtApp) => {
  const i18n = nuxtApp.$i18n; // dispo si module actif

  const { public: { i18n: cfg } = {} } = useRuntimeConfig();
  const defaultLocale = (cfg && cfg.defaultLocale) || 'fr';

  // Locale depuis l’URL ?lang=xx (simple et SSR-safe)
  const event = useRequestEvent();
  const q = getQuery(event);
  const urlLocale = typeof q.lang === 'string' ? q.lang : null;

  const current = ref(i18n?.locale?.value || urlLocale || defaultLocale);
  const maps = {};

  async function loadLocale(loc) {
    if (maps[loc]) return;
    try {
      const mod = await import(`~/locales/${loc}.json`);
      maps[loc] = mod.default || mod;
    } catch {
      maps[loc] = {};
    }
  }
  await loadLocale(current.value);

  function t(key, params) {
    if (i18n?.t) return i18n.t(key, params);
    let str = (maps[current.value] && maps[current.value][key]) || key;
    if (params && typeof params === 'object') {
      for (const k in params) str = str.replaceAll(`{${k}}`, String(params[k]));
    }
    return str;
  }

  async function setLocale(loc) {
    if (i18n?.setLocale) return i18n.setLocale(loc);
    current.value = loc;
    await loadLocale(loc);
  }

  function translateMeta(ns) {
    return {
      title: t(`${ns}.title`),
      meta: [
        { name: 'description', content: t(`${ns}.description`) },
        { name: 'keywords', content: t(`${ns}.keywords`) },
      ],
      htmlAttrs: { lang: i18n?.locale?.value || current.value },
    };
  }

  nuxtApp.provide('t', t);
  nuxtApp.provide('setLocale', setLocale);
  nuxtApp.provide('translateMeta', translateMeta);
});
