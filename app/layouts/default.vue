<!-- layouts/default.vue -->
<template>
  <div>
    <header>
      <div class="top-bar" role="contentinfo" aria-label="Contact rapide">
        <div class="top-item">
          <i class="fas fa-phone" aria-hidden="true"></i>
          <a class="top-link" href="tel:+33748484902">+33 7 48 48 49 02</a>
        </div>
        <div class="top-item">
          <i class="fas fa-envelope" aria-hidden="true"></i>
          <a class="top-link" href="mailto:info@lexikongo.fr">info@lexikongo.fr</a>
        </div>
      </div>
      <Navbar />
    </header>

    <main id="main-content">
      <slot />
    </main>

    <footer>
      <Footer />
    </footer>
  </div>
</template>

<script setup>
import Navbar from "~/components/Navbar.vue";
import Footer from "~/components/Footer.vue";

// Meta “globales layout” (peuvent être surchargées par pages)
useHead({
  meta: [
    { property: "og:site_name", content: "Lexikongo" },
    { property: "og:type", content: "website" },
  ],
});
</script>

<style scoped>
@import "@/assets/css/footer-style.css";

/* Mobile-first top bar (sans classes bootstrap) */
.top-bar {
  display: flex;
  gap: .75rem;
  align-items: center;
  justify-content: space-between;
  padding: .5rem .75rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.top-item {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: .95rem;
}

.top-link {
  color: inherit;
  text-decoration: none;
}
.top-link:hover, .top-link:focus-visible {
  color: var(--primary);
  text-decoration: underline;
}

/* Icônes */
.fas { color: #ed5717; }

/* Petits écrans : empiler si besoin */
@media (max-width: 420px) {
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
