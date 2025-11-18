// nuxt.config.js — SSR first
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: true, // explicite (SSR partout)
  // ⬇️ Désactiver le checker TS (on est en JS)
  typescript: {
    typeCheck: false,
  },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@vite-pwa/nuxt",
    "@nuxtjs/i18n",
  ],

  css: [
    "bootstrap/dist/css/bootstrap.css",
    "@fortawesome/fontawesome-free/css/all.css",
    "vue-toastification/dist/index.css",
    // '~/assets/css/data-style.css',
    "~/assets/css/global.css",
    "~/assets/css/main.css",
    "~/assets/css/button-styles.css",
    "~/assets/css/footer-style.css",
  ],


  app: {
    head: {
      titleTemplate: "%s · Lexikongo",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#0f766e" },
        { name: "format-detection", content: "telephone=no" },
        {
          name: "description",
          content:
            "Lexikongo · Dictionnaire Kikongo — Français/Anglais & phonétique",
        },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/icon.svg" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
    },
  },

  // ------- Runtime Config (public + privé) -------
  runtimeConfig: {
    // privées (serveur uniquement)
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    smtpPassword: process.env.SMTP_PASS,

    // publiques (exposées au client)
    public: {
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL || "https://lexikongo.example.com",
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || "Lexikongo",
      siteDescription:
        process.env.NUXT_PUBLIC_SITE_DESC ||
        "Dictionnaire Kikongo · FR/EN & phonétique",
      defaultLocale: process.env.NUXT_PUBLIC_DEFAULT_LOCALE || "fr",

      // Paiements
      stripePublishableKey:
        process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      paypalClientId: process.env.NUXT_PUBLIC_PAYPAL_CLIENT_ID || "",
      paypalWebhookId: process.env.PAYPAL_WEBHOOK_ID || "",

      // SMTP (métadonnées non sensibles côté client si besoin d’affichage)
      smtpHost: process.env.SMTP_HOST || "",
      smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
      smtpUser: process.env.SMTP_USER || "",
      smtpSecure: String(process.env.SMTP_SECURE || "false") === "true",
      adminEmail: process.env.ADMIN_EMAIL || "",
    },
  },
  i18n: {
    locales: [
      { code: "fr", iso: "fr-FR", name: "Français", file: "fr.json" },
      { code: "en", iso: "en-US", name: "English", file: "en.json" },
      { code: "it", iso: "it-IT", name: "Italiano", file: "it.json" },
      { code: "pt", iso: "pt-PT", name: "Português", file: "pt.json" },
      { code: "ru", iso: "ru-RU", name: "Русский", file: "ru.json" },
      { code: "zh", iso: "zh-CN", name: "中文", file: "zh.json" },
      { code: "es", iso: "es-ES", name: "Español", file: "es.json" },
    ],
    defaultLocale: "fr",
    strategy: "prefix_except_default",
    lazy: true,
    // ⬇️ on pointe vers "locales" DANS le dossier i18n
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_locale",
      redirectOn: "root",
      alwaysRedirect: false,
      fallbackLocale: "fr",
    },
    seo: true,
  },
  // ------- Sitemap / Robots -------
  sitemap: {
    siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://lexikongo.fr",
    autoLastmod: true,
    xsl: true,
    defaults: { changefreq: "weekly", priority: 0.7 },
    // exclude: ['/admin/**', '/api/**'],
  },
  robots: {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: [
      (process.env.NUXT_PUBLIC_SITE_URL || "https://lexikongo.fr") +
        "/sitemap.xml",
    ],
  },

  // ------- PWA (compatible SSR) -------
  pwa: {
    registerType: "autoUpdate",
    includeAssets: ["icon.svg", "apple-touch-icon.png", "pwa-maskable.png"],
    manifest: {
      name: "Lexikongo",
      short_name: "Lexikongo",
      description: "Dictionnaire Kikongo — Français/Anglais & phonétique",
      theme_color: "#0f766e",
      background_color: "#ffffff",
      display: "standalone",
      start_url: "/",
      lang: "fr",
      icons: [
        { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
        {
          src: "/pwa-maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/", // SSR + SW: fallback SPA si hors-ligne
      globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
      runtimeCaching: [
        // API (SSR garde la fraicheur, SW sert de filet hors-ligne)
        {
          urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
          handler: "NetworkFirst",
          options: { cacheName: "api-cache", networkTimeoutSeconds: 4 },
        },
        // Images
        {
          urlPattern: ({ request }) => request.destination === "image",
          handler: "CacheFirst",
          options: {
            cacheName: "image-cache",
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
      ],
    },
    devOptions: { enabled: true }, // désactive en prod automatiquement
  },

  // ------- Nitro (SSR hosting) -------
  nitro: {
    preset: "vercel", // SSR classique (adapter si Vercel, Node, Docker, etc.)
    routeRules: {
      "/_nuxt/**": {
        headers: { "cache-control": "public, max-age=31536000, immutable" },
      },
      // Rien en SPA: SSR reste actif partout
      // ISR optionnel (tu peux activer au cas par cas) :
      // '/': { isr: 60 },
    },
  },

  // ------- Vite -------
  vite: {
    build: { sourcemap: process.env.NODE_ENV !== "production" },
    // fs: { allow: ['.'] }, // on garde strict pour éviter l’erreur “allow list”
  },

  // ------- TS / Devtools / Expérimental -------
  //typescript: { typeCheck: true, strict: true },
  imports: { autoImport: true },
  devtools: { enabled: true },
  experimental: { typedPages: true },
});