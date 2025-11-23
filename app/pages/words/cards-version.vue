<template>
  <section class="word-list" aria-labelledby="word-list-heading">
<header class="word-list__header">
  <div>
    <h2 id="word-list-heading" class="word-list__title">
      Liste des mots
    </h2>
    <p class="word-list__subtitle">
      Consultez les mots disponibles dans le lexique, avec leur pluriel, leur
      phonétique et leurs traductions.
    </p>
  </div>

  <div class="word-list__header-right">
    <p v-if="store.items.length" class="word-list__count">
      {{ store.items.length }} mot<span v-if="store.items.length > 1">s</span> en base
    </p>

    <NuxtLink
      to="/words"
      class="word-list__view-link"
      aria-label="Revenir à la version tableau des mots"
    >
      <i class="fas fa-table" aria-hidden="true"></i>
      <span>Version tableau</span>
    </NuxtLink>
  </div>
</header>


    <!-- État : chargement -->
    <div
      v-if="store.isLoading"
      class="word-list__status"
      role="status"
      aria-live="polite"
    >
      Chargement des mots...
    </div>

    <!-- État : erreur -->
    <p
      v-else-if="store.error"
      class="word-list__error"
      role="alert"
    >
      {{ store.error }}
    </p>

    <!-- État : vide -->
    <p
      v-else-if="!store.paginatedWords.length"
      class="word-list__empty"
      aria-live="polite"
    >
      Aucun mot trouvé pour le moment.
    </p>

    <!-- Résultats -->
    <ul v-else class="word-list__grid">
      <li
        v-for="item in store.paginatedWords"
        :key="item.id"
        class="word-card"
      >
        <button
          type="button"
          class="word-card__inner"
          @click="goToDetails(item.slug)"
          :aria-label="`Détails pour ${item.singular || 'ce mot'}`"
        >
          <header class="word-card__header">
            <h3 class="word-card__title">
              <span class="word-card__singular">
                {{ item.singular || '—' }}
              </span>
              <span v-if="item.plural" class="word-card__plural">
                · {{ item.plural }}
              </span>
            </h3>
            <p v-if="item.phonetic" class="word-card__phonetic">
              [{{ item.phonetic }}]
            </p>
          </header>

          <dl class="word-card__body">
            <div class="word-card__row">
              <dt>Français</dt>
              <dd>{{ truncateText(item.translation_fr, 80) }}</dd>
            </div>
            <div class="word-card__row">
              <dt>Anglais</dt>
              <dd>{{ truncateText(item.translation_en, 80) }}</dd>
            </div>
          </dl>

          <footer class="word-card__footer">
            <span class="word-card__cta">
              Voir la fiche
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </span>
          </footer>
        </button>
      </li>
    </ul>

    <!-- Pagination -->
    <div
      v-if="store.totalPages > 1"
      class="word-list__pagination"
    >
      <Pagination
        :currentPage="store.page"
        :totalPages="store.totalPages"
        @pageChange="store.setPage"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Pagination from '@/components/Pagination.vue';
import { useWordStore } from '~/stores/wordStore';

const router = useRouter();
const store = useWordStore();

const goToDetails = (slug) => {
  if (!slug) {
    console.error('Erreur : Slug manquant pour la redirection.');
    return;
  }
  // On garde ta route actuelle /details/word/:slug
  router.push(`/details/word/${slug}`);
};

const truncateText = (text, limit = 80) => {
  if (!text) return '—';
  return text.length > limit ? text.slice(0, limit) + '…' : text;
};

// Chargement initial (client side, SSR-safe)
onMounted(() => {
  if (!store.items.length) {
    store.fetchAll();
  }
});
</script>

<style scoped>
.word-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Header */
.word-list__header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.word-list__title {
  font-size: 1.25rem;
  font-weight: 600;
}

.word-list__subtitle {
  font-size: 0.95rem;
  color: var(--muted-text, #6c757d);
}

.word-list__count {
  font-size: 0.9rem;
  color: var(--muted-text, #6c757d);
}

/* États */
.word-list__status,
.word-list__error,
.word-list__empty {
  font-size: 0.95rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
}

.word-list__status {
  background: rgba(13, 110, 253, 0.08);
  color: var(--primary, #0d6efd);
}

.word-list__error {
  background: rgba(220, 53, 69, 0.08);
  color: #dc3545;
}

.word-list__empty {
  background: rgba(108, 117, 125, 0.06);
  color: var(--muted-text, #6c757d);
}

/* Grid de cartes */
.word-list__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .word-list__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

@media (min-width: 992px) {
  .word-list__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.word-card {
  margin: 0;
}

.word-card__inner {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: var(--surface-elevated, #ffffff);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  cursor: pointer;
  transition:
    box-shadow 0.15s ease,
    transform 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;
}

.word-card__inner:hover,
.word-card__inner:focus-visible {
  outline: none;
  border-color: var(--primary, #0d6efd);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  transform: translateY(-1px);
}

/* Contenu de la carte */
.word-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.word-card__title {
  font-size: 1.05rem;
  font-weight: 600;
}

.word-card__singular {
  color: var(--secondary-color, #0f172a);
}

.word-card__plural {
  font-size: 0.9rem;
  color: var(--muted-text, #6c757d);
}

.word-card__phonetic {
  font-size: 0.85rem;
  font-style: italic;
  color: var(--highlight-color, #0d6efd);
}

.word-card__body {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.word-card__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 0.4rem;
  font-size: 0.9rem;
}

.word-card__row dt {
  font-weight: 600;
  color: var(--muted-text, #6c757d);
}

.word-card__row dd {
  margin: 0;
  color: var(--text-default, #111827);
}

/* Footer de la carte */
.word-card__footer {
  margin-top: 0.35rem;
  display: flex;
  justify-content: flex-end;
}

.word-card__cta {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--primary, #0d6efd);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

/* Pagination */
.word-list__pagination {
  margin-top: 1.25rem;
  display: flex;
  justify-content: center;
}
.word-list__header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* Regroupe compteur + bouton de vue */
.word-list__header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
}

.word-list__count {
  font-size: 0.9rem;
  color: var(--muted-text, #6c757d);
}

/* Bouton "Version tableau" */
.word-list__view-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  font-size: 0.85rem;
  text-decoration: none;
  color: var(--primary, #0d6efd);
  background: rgba(255, 255, 255, 0.85);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    transform 0.08s ease,
    box-shadow 0.15s ease;
}

.word-list__view-link i {
  font-size: 0.85rem;
}

.word-list__view-link:hover,
.word-list__view-link:focus-visible {
  border-color: rgba(37, 99, 235, 0.85);
  background: #eff6ff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .word-list__header {
    align-items: flex-start;
  }

  .word-list__header-right {
    align-items: flex-start;
  }
}

</style>