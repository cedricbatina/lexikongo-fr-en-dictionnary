
<template>
  <div class="logo-footer" aria-label="Logo du site Lexikongo">
    <NuxtLink
      to="/"
      class="logo-footer__link"
      aria-label="Retour à l'accueil de Lexikongo"
    >
      <img
        src="/images/lexikongo_logo@2x.webp"
        alt="Logo Lexikongo"
        class="logo-footer__image"
        loading="lazy"
      />
    </NuxtLink>
  </div>
</template>

<script setup>
// aucun code pour l'instant
</script>

<style scoped>
.logo-footer {
  display: flex;
  justify-content: center;
  padding: 1rem 1rem 0;
}

.logo-footer__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.logo-footer__image {
  max-width: 210px;
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 8px 18px rgba(15, 23, 42, 0.24));
}

@media (max-width: 480px) {
  .logo-footer__image {
    max-width: 180px;
  }
}
</style>
