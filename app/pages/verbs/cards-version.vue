<template>
  <section class="verb-list" aria-labelledby="verb-list-heading">
    <header class="verb-list__header">
      <div>
        <h2 id="verb-list-heading" class="verb-list__title">
          Liste des verbes
        </h2>
        <p class="verb-list__subtitle">
          Explorez les verbes en Kikongo avec leur phonétique et leurs
          traductions en français et en anglais.
        </p>
      </div>

   <p v-if="store.items && store.items.length" class="verb-list__count">
  {{ store.items.length }} verbe<span v-if="store.items.length > 1">s</span> en base
</p>

    </header>

    <!-- État : chargement -->
    <div
      v-if="store.isLoading"
      class="verb-list__status"
      role="status"
      aria-live="polite"
    >
      Chargement des verbes...
    </div>

    <!-- État : erreur -->
    <p
      v-else-if="store.error"
      class="verb-list__error"
      role="alert"
    >
      {{ store.error }}
    </p>

    <!-- État : vide -->
    <p
      v-else-if="!store.paginatedVerbs.length"
      class="verb-list__empty"
      aria-live="polite"
    >
      Aucun verbe trouvé pour le moment.
    </p>

    <!-- Résultats -->
    <ul v-else class="verb-list__grid">
      <li
        v-for="item in store.paginatedVerbs"
        :key="item.slug"
        class="verb-card"
      >
        <button
          type="button"
          class="verb-card__inner"
          @click="goToDetails(item.slug)"
          :aria-label="`Détails pour le verbe ${item.singular || 'ce verbe'}`"
        >
          <header class="verb-card__header">
            <h3 class="verb-card__title">
              <span class="verb-card__ku">ku</span>
              <span class="verb-card__verb">
                {{ item.singular || "—" }}
              </span>
            </h3>
            <p v-if="item.phonetic" class="verb-card__phonetic">
              [{{ item.phonetic }}]
            </p>
          </header>

          <dl class="verb-card__body">
            <div class="verb-card__row">
              <dt>Français</dt>
              <dd>{{ truncateText(item.translation_fr, 80) }}</dd>
            </div>
            <div class="verb-card__row">
              <dt>Anglais</dt>
              <dd>{{ truncateText(item.translation_en, 80) }}</dd>
            </div>
          </dl>

          <footer class="verb-card__footer">
            <span class="verb-card__cta">
              Voir le verbe
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </span>
          </footer>
        </button>
      </li>
    </ul>

    <!-- Pagination -->
    <div
      v-if="store.totalPages > 1"
      class="verb-list__pagination"
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
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import Pagination from "@/components/Pagination.vue";
import { useVerbStore } from "~/stores/verbStore";

const router = useRouter();
const store = useVerbStore();

const goToDetails = (slug) => {
  if (!slug) {
    console.error("Erreur : Slug manquant pour la redirection.");
    return;
  }
  // même pattern que pour les mots : /details/verb/:slug
  router.push(`/details/verb/${slug}`);
};

const truncateText = (text, limit = 80) => {
  if (!text) return "—";
  return text.length > limit ? text.slice(0, limit) + "…" : text;
};

// Chargement initial (client side, SSR-safe)
onMounted(() => {
  if (!store.items.length) {
    store.fetchAll();
  }
});
</script>

<style scoped>
.verb-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Header */
.verb-list__header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.verb-list__title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-default, #111827);
}

.verb-list__subtitle {
  font-size: 0.95rem;
  color: var(--muted-text, #6b7280);
  max-width: 40rem;
}

.verb-list__count {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: var(--muted-text, #6b7280);
}

/* États */
.verb-list__status,
.verb-list__empty,
.verb-list__error {
  font-size: 0.95rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.75rem;
}

.verb-list__status {
  background: rgba(37, 99, 235, 0.06);
  color: #1d4ed8;
}

.verb-list__empty {
  background: rgba(148, 163, 184, 0.12);
  color: #4b5563;
}

.verb-list__error {
  background: rgba(239, 68, 68, 0.08);
  color: #b91c1c;
}

/* Grid des cartes */
.verb-list__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

/* Mobile first : 1 colonne
   puis 2 colonnes sur >= 768px */
@media (min-width: 768px) {
  .verb-list__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .verb-list__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Carte verbe */
.verb-card {
  margin: 0;
}

.verb-card__inner {
  width: 100%;
  text-align: left;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: var(--surface-elevated, #ffffff);
  padding: 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  cursor: pointer;
  transition:
    box-shadow 0.16s ease,
    transform 0.12s ease,
    border-color 0.16s ease,
    background 0.16s ease;
}

.verb-card__inner:hover,
.verb-card__inner:focus-visible {
  outline: none;
  border-color: rgba(37, 99, 235, 0.8);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
  transform: translateY(-1px);
}

/* Header carte */
.verb-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.verb-card__title {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.verb-card__ku {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
  opacity: 0.85;
}

.verb-card__verb {
  font-size: 1.05rem;
}

.verb-card__phonetic {
  font-size: 0.9rem;
  font-style: italic;
  color: var(--muted-text, #6b7280);
}

/* Corps carte */
.verb-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin: 0;
}

.verb-card__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.3rem 0.5rem;
  align-items: baseline;
}

.verb-card__row dt {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--muted-text, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.verb-card__row dd {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-default, #111827);
}

/* Footer carte */
.verb-card__footer {
  margin-top: 0.25rem;
  display: flex;
  justify-content: flex-end;
}

.verb-card__cta {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--primary, #0d6efd);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.verb-card__cta i {
  font-size: 0.8rem;
}

/* Pagination */
.verb-list__pagination {
  margin-top: 0.75rem;
  display: flex;
  justify-content: center;
}
</style>