<template>
  <section
    class="word-cards page"
    aria-labelledby="words-page-title"
  >
    <!-- Hero réutilisable -->
    <LkPageHero
      id="words-page-title"
      :eyebrow="t('words.page.eyebrow')"
      :title="t('words.page.title')"
      :description="t('words.page.subtitle')"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="true"
    >
      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-language" aria-hidden="true"></i>
          <span>{{ t('words.page.metaLanguages') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : LkActionsBar -->
      <template #side>
        <div class="lk-hero-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <!-- Compteur premium : X mots en base (comme expressions) -->
    <div
      v-if="itemsLength"
      class="word-cards__meta"
    >
      <p
        class="word-count-chip"
        aria-live="polite"
      >
        <span
          class="word-count-chip__dot"
          aria-hidden="true"
        />
        <span class="word-count-chip__text">
          {{ t('words.list.count', itemsLength) }}
        </span>
      </p>
    </div>

    <!-- Barre de recherche + switch tableau -->
    <div class="word-cards__toolbar">
      <div class="word-cards__search">
        <label
          class="word-cards__search-label"
          for="word-cards-search"
        >
          {{ t('words.list.searchLabel') }}
        </label>

        <input
          id="word-cards-search"
          v-model="searchLocal"
          type="search"
          class="word-cards__search-input"
          :placeholder="t('words.list.searchPlaceholder')"
        />
      </div>

      <!-- Légende + bouton switch vue tableau -->
      <div class="word-view-mode">
        <!-- Vue actuelle = cartes -->
        <p class="word-view-caption">
          {{ t('words.cards.viewCards') }}
        </p>

        <NuxtLink
          to="/words"
          class="word-cards__view-link"
          :aria-label="t('words.cards.viewTableAria')"
        >
          <i class="fas fa-table" aria-hidden="true"></i>
          <span>{{ t('words.cards.viewTable') }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- État : chargement -->
    <div
      v-if="store.isLoading"
      class="word-list__status"
      role="status"
      aria-live="polite"
    >
      {{ t('words.list.loading') }}
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
      v-else-if="!paginatedWords.length"
      class="word-list__empty"
      aria-live="polite"
    >
      {{ t('words.list.empty') }}
    </p>

    <!-- Résultats : cartes -->
    <ul
      v-else
      class="word-list__grid"
    >
      <li
        v-for="item in paginatedWords"
        :key="item.slug || item.id"
        class="word-card"
      >
        <button
          type="button"
          class="word-card__inner"
          @click="goToDetails(item.slug)"
          :aria-label="t('words.list.rowAria', { word: item.singular || '—' })"
        >
          <header class="word-card__header">
            <h3 class="word-card__title">
              <span class="word-card__singular">
                {{ item.singular || '—' }}
              </span>
              <span
                v-if="item.plural"
                class="word-card__plural"
              >
                · {{ item.plural }}
              </span>
            </h3>

            <p
              v-if="item.phonetic"
              class="word-card__phonetic"
            >
              [{{ item.phonetic }}]
            </p>
          </header>

          <dl class="word-card__body">
            <div class="word-card__row word-card__row--fr">
              <dt>{{ t('words.list.column.fr') }}</dt>
              <dd>{{ truncateText(item.translation_fr, 80) }}</dd>
            </div>
            <div class="word-card__row word-card__row--en">
              <dt>{{ t('words.list.column.en') }}</dt>
              <dd>{{ truncateText(item.translation_en, 80) }}</dd>
            </div>
          </dl>

          <footer class="word-card__footer">
            <span class="word-card__cta">
              {{ t('words.cards.viewDetails') }}
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </span>
          </footer>
        </button>
      </li>
    </ul>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="word-list__pagination"
    >
      <Pagination
        :currentPage="store.page"
        :totalPages="totalPages"
        @pageChange="store.setPage"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Pagination from '@/components/Pagination.vue';
import { useWordStore } from '~/stores/wordStore';
import LkActionsBar from '@/components/LkActionsBar.vue';

const router = useRouter();
const store = useWordStore();
const { t } = useI18n();

const searchLocal = ref('');

// Liste filtrée (singulier / pluriel / FR / EN)
const filteredWords = computed(() => {
  const items = Array.isArray(store.items) ? store.items : [];
  const q = searchLocal.value.trim().toLowerCase();

  if (!q) return items;

  return items.filter((word) => {
    const singular = (word.singular || '').toLowerCase();
    const plural = (word.plural || '').toLowerCase();
    const fr = (word.translation_fr || '').toLowerCase();
    const en = (word.translation_en || '').toLowerCase();

    return (
      singular.includes(q) ||
      plural.includes(q) ||
      fr.includes(q) ||
      en.includes(q)
    );
  });
});

// Compteur premium : nombre d’éléments filtrés
const itemsLength = computed(() =>
  Array.isArray(filteredWords.value) ? filteredWords.value.length : 0,
);

// Reset pagination quand la recherche change
watch(searchLocal, () => {
  store.page = 1;
});

// Pagination appliquée à la liste filtrée
const paginatedWords = computed(() => {
  const start = (store.page - 1) * store.pageSize;
  return filteredWords.value.slice(start, start + store.pageSize);
});

// Nombre de pages sur la liste filtrée
const totalPages = computed(() => {
  const total = filteredWords.value.length || 0;
  if (!total) return 1;
  return Math.ceil(total / store.pageSize);
});

const goToDetails = (slug) => {
  if (!slug) {
    console.error('Erreur : Slug manquant pour la redirection.');
    return;
  }
  router.push(`/details/word/${slug}`);
};

const truncateText = (text, limit = 80) => {
  if (!text) return '—';
  return text.length > limit ? text.slice(0, limit) + '…' : text;
};

// Chargement initial
onMounted(() => {
  if (!store.items.length) {
    store.fetchAll();
  }
});
</script>

<style scoped>
.word-cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Meta (compteur) */
.word-cards__meta {
  display: flex;
  justify-content: flex-end;
}

/* Chip compteur : même logique que expressions */
.word-count-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.18rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.03),
    rgba(37, 99, 235, 0.06)
  );
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted, #4b5563);
}

.word-count-chip__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, #22c55e, #16a34a);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18);
}

.word-count-chip__text {
  white-space: nowrap;
}

/* Toolbar (recherche + switch vue) */
.word-cards__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.word-cards__search {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.word-cards__search-label {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.word-cards__search-input {
  width: 400px;
  max-width: 100%;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  font-size: 0.9rem;
  color: var(--text-default);
  background: var(--surface-elevated);
}

/* Bloc vue “cartes” + bouton vers tableau */
.word-view-mode {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
}

.word-view-caption {
  margin: 0;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #6b7280);
}

.word-cards__view-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  text-decoration: none;
  background: var(--surface-elevated);
  color: var(--primary);
  white-space: nowrap;
}

.word-cards__view-link:hover {
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary);
}

/* États */
.word-list__status,
.word-list__empty,
.word-list__error {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.95rem;
}

/* info (chargement) */
.word-list__status {
  background: rgba(13, 110, 253, 0.12);
  border: 1px solid rgba(13, 110, 253, 0.35);
  color: var(--primary);
}

/* vide */
.word-list__empty {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: var(--text-muted);
}

/* erreur */
.word-list__error {
  background: rgba(248, 113, 113, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.6);
  color: #b91c1c;
}

/* Grid de cartes */
.word-list__grid {
  list-style: none;
  margin: 0;
  margin-top: 0.8rem;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.9rem;
}

.word-card {
  margin: 0;
}

.word-card__inner {
  width: 100%;
  text-align: left;
  padding: 0.9rem 0.85rem 0.8rem;
  border-radius: 0.9rem;
  border: 1px solid var(--border-subtle);
  background: var(--surface-elevated, #ffffff);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease,
    border-color 0.15s ease;
}

.word-card__inner:hover,
.word-card__inner:focus-visible {
  outline: none;
  border-color: var(--primary);
  background: linear-gradient(
    135deg,
    rgba(239, 246, 255, 0.9),
    rgba(219, 234, 254, 0.95)
  );
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.18);
  transform: translateY(-1px);
}

/* Header de carte */
.word-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.word-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.word-card__singular {
  color: var(--primary, #2563eb);
}

.word-card__plural {
  margin-left: 0.25rem;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

.word-card__phonetic {
  margin: 0;
  font-size: 0.86rem;
  font-family: 'Fira Code', Menlo, ui-monospace, SFMono-Regular, monospace;
  color: var(--text-muted, #4b5563);
}

/* Body */
.word-card__body {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
}

.word-card__row {
  display: grid;
  grid-template-columns: minmax(0, 80px) minmax(0, 1fr);
  gap: 0.25rem 0.5rem;
}

.word-card__row dt {
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--text-muted, #6b7280);
}

.word-card__row dd {
  margin: 0;
}

/* Footer / CTA */
.word-card__footer {
  margin-top: 0.25rem;
}

.word-card__cta {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

/* Pagination */
.word-list__pagination {
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 640px) {
  .word-cards__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .word-view-mode {
    align-items: flex-start;
  }

  .word-cards__view-link {
    justify-content: center;
  }
}
/* Mise en valeur des traductions FR / EN dans les cartes */
.word-card__row--fr dt {
  color: var(--primary, #2563eb);
}

.word-card__row--fr dd {
  color: var(--primary, #2563eb);
  font-weight: 500;
}

.word-card__row--en dt {
  color: var(--accent-en, #0d9488);
}

.word-card__row--en dd {
  color: var(--accent-en, #0d9488);
  font-weight: 500;
}

</style>
