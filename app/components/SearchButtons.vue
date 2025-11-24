<template>
  <nav
    class="lk-search-actions"
    aria-label="Raccourcis de recherche et listes"
  >
    <NuxtLink
      to="/search/words"
      class="lk-search-actions__btn lk-search-actions__btn--primary"
    >
      <i class="fa fa-search" aria-hidden="true"></i>
      <span>Rechercher des mots</span>
    </NuxtLink>

    <NuxtLink
      to="/search/verbs"
      class="lk-search-actions__btn lk-search-actions__btn--success"
    >
      <i class="fa fa-search" aria-hidden="true"></i>
      <span>Rechercher des verbes</span>
    </NuxtLink>

    <NuxtLink
      to="/words"
      class="lk-search-actions__btn lk-search-actions__btn--primary-outline"
    >
      <i class="fas fa-spell-check" aria-hidden="true"></i>
      <span>Liste des mots</span>
    </NuxtLink>

    <NuxtLink
      to="/verbs"
      class="lk-search-actions__btn lk-search-actions__btn--success-outline"
    >
      <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true"></i>
      <span>Liste des verbes</span>
    </NuxtLink>

    <NuxtLink
      to="/expressions"
      class="lk-search-actions__btn lk-search-actions__btn--info-outline"
    >
      <i class="fas fa-book" aria-hidden="true"></i>
      <span>Liste de mots &amp; verbes</span>
    </NuxtLink>

    <NuxtLink
      to="/documentation/for-contributors"
      class="lk-search-actions__btn lk-search-actions__btn--success-outline"
    >
      <i class="fas fa-hands-helping" aria-hidden="true"></i>
      <span>Contribuer sur Lexikongo</span>
    </NuxtLink>

    <NuxtLink
      to="/"
      class="lk-search-actions__btn lk-search-actions__btn--ghost"
    >
      <i class="fas fa-home" aria-hidden="true"></i>
      <span>Retour à l'accueil</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
// pas de logique spécifique ici pour l’instant
</script>

<style scoped>
.lk-search-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Base bouton */
.lk-search-actions__btn {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.45rem 0.9rem;
  font-size: 0.88rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.lk-search-actions__btn i {
  font-size: 0.9rem;
}

/* Variantes pleines */
.lk-search-actions__btn--primary {
  background: #0d6efd;
  border-color: #0d6efd;
  color: #ffffff;
}

.lk-search-actions__btn--success {
  background: #16a34a;
  border-color: #16a34a;
  color: #ffffff;
}

/* Variantes outlines */
.lk-search-actions__btn--primary-outline {
  background: #ffffff;
  border-color: #0d6efd;
  color: #0d6efd;
}

.lk-search-actions__btn--success-outline {
  background: #ffffff;
  border-color: #16a34a;
  color: #15803d;
}

.lk-search-actions__btn--info-outline {
  background: #ffffff;
  border-color: #0ea5e9;
  color: #0369a1;
}

/* Ghost */
.lk-search-actions__btn--ghost {
  background: #ffffff;
  border-color: rgba(148, 163, 184, 0.7);
  color: #111827;
}

/* Hover / focus */
.lk-search-actions__btn:hover,
.lk-search-actions__btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
}

/* Responsive */
@media (max-width: 640px) {
  .lk-search-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .lk-search-actions__btn {
    justify-content: center;
  }
}
</style>
