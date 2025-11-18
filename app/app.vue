<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
    <NuxtRouteAnnouncer />
  </NuxtLayout>
</template>

<script setup>
// SSR: hydrate l'état auth (cookie HttpOnly)
const auth = useAuthStore();
await auth.fetchMe();

// Thème: applique le thème sauvegardé au mount (client)
onMounted(() => {
  const saved = localStorage.getItem("theme");
  const el = document.documentElement;
  if (saved && saved !== "light") el.setAttribute("data-theme", saved);
  else el.removeAttribute("data-theme");
});

// Head global (ajuste si besoin)
useHead({
  titleTemplate: (t) => (t ? `${t} · Lexikongo` : "Lexikongo — Dictionnaire Kikongo"),
  htmlAttrs: { lang: "fr" },
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    { name: "description", content: "Lexikongo — Dictionnaire Kikongo · Français · Anglais · Phonétique." },
    // Respect des thèmes (clair/sombre)
    { name: "color-scheme", content: "light dark" },
    // Couleur de barre d'adresse mobile (optionnel, peut être surchargée par layout/page)
    { name: "theme-color", content: "#0d6efd", media: "(prefers-color-scheme: light)" },
    { name: "theme-color", content: "#11161c", media: "(prefers-color-scheme: dark)" },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" },
    // { rel: "manifest", href: "/manifest.webmanifest" }, // si PWA plus tard
  ],
});
</script>

<style>
/* Garde ta classe utilitaire */
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.header a, .footer a { text-decoration: none }
</style>
