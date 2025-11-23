<template>
  <section class="expr-cards" aria-labelledby="expr-cards-heading">
    <!-- Header -->
    <header class="expr-cards__header">
      <div>
        <h1 id="expr-cards-heading" class="expr-cards__title">
          {{ t('expressions.list.title') }} {{ t('expressions.cards.titleSuffix') }}
        </h1>
        <p class="expr-cards__subtitle">
          {{ t('expressions.list.subtitle') }}
        </p>
      </div>

      <div class="expr-cards__meta">
        <p v-if="store.filteredItems.length" class="expr-cards__count">
          {{ t('expressions.list.count', store.filteredItems.length) }}
        </p>

        <NuxtLink
          to="/expressions"
          class="expr-cards__view-link"
          :aria-label="t('expressions.cards.viewTableAria')"
        >
          <i class="fas fa-table" aria-hidden="true"></i>
          <span>{{ t('expressions.cards.viewTable') }}</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Filtres + recherche -->
    <div class="expr-cards__toolbar">
      <div class="expr-cards__filters">
        <button
          type="button"
          class="expr-cards__filter-btn"
          :class="{ 'expr-cards__filter-btn--active': store.type === 'all' }"
          @click="store.setType('all')"
        >
          {{ t('expressions.list.filterAll') }}
        </button>
        <button
          type="button"
          class="expr-cards__filter-btn"
          :class="{ 'expr-cards__filter-btn--active': store.type === 'word' }"
          @click="store.setType('word')"
        >
          {{ t('expressions.list.filterWords') }}
        </button>
        <button
          type="button"
          class="expr-cards__filter-btn"
          :class="{ 'expr-cards__filter-btn--active': store.type === 'verb' }"
          @click="store.setType('verb')"
        >
          {{ t('expressions.list.filterVerbs') }}
        </button>
      </div>

      <div class="expr-cards__search">
        <label class="expr-cards__search-label" for="expr-cards-search">
          {{ t('expressions.list.searchLabel') }}
        </label>
        <input
          id="expr-cards-search"
          v-model="searchLocal"
          type="search"
          class="expr-cards__search-input"
          :placeholder="t('expressions.list.searchPlaceholder')"
          @input="onSearchInput"
        />
      </div>
    </div>

    <!-- États -->
    <div
      v-if="store.isLoading"
      class="expr-cards__status"
      role="status"
      aria-live="polite"
    >
      {{ t('expressions.list.loading') }}
    </div>

    <p
      v-else-if="store.error"
      class="expr-cards__error"
      role="alert"
    >
      {{ store.error }}
    </p>

    <p
      v-else-if="!store.paginatedExpressions.length"
      class="expr-cards__empty"
      aria-live="polite"
    >
      {{ t('expressions.list.empty') }}
    </p>

    <!-- Grid de cartes -->
    <ul
      v-else
      class="expr-cards__grid"
    >
      <li
        v-for="expr in store.paginatedExpressions"
        :key="expr.slug || expr.id"
        class="expr-card"
      >
        <button
          type="button"
          class="expr-card__inner"
          @click="goToDetails(expr)"
          :aria-label="ariaLabel(expr)"
        >
          <header class="expr-card__header">
            <div class="expr-card__type">
              <span
                class="expr-card__badge"
                :class="{
                  'expr-card__badge--word': expr.type === 'word',
                  'expr-card__badge--verb': expr.type === 'verb',
                }"
              >
                {{
                  expr.type === 'verb'
                    ? t('expressions.list.badge.verb')
                    : t('expressions.list.badge.word')
                }}
              </span>
            </div>

            <h2 class="expr-card__title">
              <template v-if="expr.type === 'verb'">
                <span class="expr-card__ku">ku</span>
                <span class="expr-card__main expr-card__main--verb">
                  {{ expr.singular || '—' }}
                </span>
              </template>
              <template v-else>
                <span class="expr-card__main expr-card__main--word">
                  {{ expr.singular || '—' }}
                </span>
                <span
                  v-if="expr.plural"
                  class="expr-card__secondary"
                >
                  · {{ expr.plural }}
                </span>
              </template>
            </h2>

            <p v-if="expr.phonetic" class="expr-card__phonetic">
              {{ expr.phonetic }}
            </p>
          </header>

          <dl class="expr-card__body">
            <div class="expr-card__row">
              <dt>{{ t('expressions.list.column.fr') }}</dt>
              <dd>{{ truncateText(expr.translation_fr, 110) || '—' }}</dd>
            </div>
            <div class="expr-card__row">
              <dt>{{ t('expressions.list.column.en') }}</dt>
              <dd>{{ truncateText(expr.translation_en, 110) || '—' }}</dd>
            </div>
          </dl>

          <footer class="expr-card__footer">
            <span class="expr-card__cta">
              {{ t('expressions.cards.viewDetails') }}
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </span>
          </footer>
        </button>
      </li>
    </ul>

    <!-- Pagination -->
    <div
      v-if="store.totalPages > 1"
      class="expr-cards__pagination"
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Pagination from '@/components/Pagination.vue';
import { useExpressionStore } from '~/stores/expressionStore';

const router = useRouter();
const store = useExpressionStore();
const { t } = useI18n();

const searchLocal = ref(store.search || '');

// Navigation vers la fiche détail (mot / verbe)
const goToDetails = (expr) => {
  if (!expr.slug) {
    console.error("Slug manquant pour l'expression :", expr);
    return;
  }
  const type = expr.type === 'verb' ? 'verb' : 'word';
  router.push(`/details/${type}/${expr.slug}`);
};

const truncateText = (text, limit = 110) => {
  if (!text) return '';
  return text.length > limit ? text.slice(0, limit) + '…' : text;
};

const ariaLabel = (expr) => {
  if (expr.type === 'verb') {
    return t('expressions.list.rowAriaVerb', {
      verb: expr.singular || '',
    });
  }
  return t('expressions.list.rowAriaWord', {
    word: expr.singular || '',
  });
};

const onSearchInput = () => {
  store.setSearch(searchLocal.value);
};

// Chargement initial (SSR-safe)
onMounted(() => {
  if (!store.items.length) {
    store.fetchAll();
  }
});
</script>

<style scoped>
.expr-cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Header */
.expr-cards__header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.expr-cards__title {
  font-size: 1.4rem;
  font-weight: 650;
  color: var(--text-default);
}

.expr-cards__subtitle {
  font-size: 0.96rem;
  color: var(--text-muted);
  max-width: 46rem;
}

.expr-cards__subtitle strong {
  font-weight: 600;
}

.expr-cards__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.expr-cards__count {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.expr-cards__view-link {
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

.expr-cards__view-link:hover {
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary);
}

/* Toolbar */
.expr-cards__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.expr-cards__filters {
  display: inline-flex;
  gap: 0.4rem;
  padding: 0.15rem;
  border-radius: 999px;
  background: var(--surface-default);
  border: 1px solid var(--border-subtle);
}

.expr-cards__filter-btn {
  border: none;
  background: transparent;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  color: var(--text-muted);
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.08s ease;
}

.expr-cards__filter-btn--active {
  background: var(--primary);
  color: #ffffff;
  transform: translateY(-1px);
}

.expr-cards__search {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.expr-cards__search-label {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.expr-cards__search-input {
  width: 320px;
  max-width: 100%;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  font-size: 0.9rem;
  color: var(--text-default);
  background: var(--surface-elevated);
}

/* États */
.expr-cards__status,
.expr-cards__empty,
.expr-cards__error {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.95rem;
}

.expr-cards__status {
  background: rgba(13, 110, 253, 0.08);
  border: 1px solid rgba(13, 110, 253, 0.35);
  color: var(--primary);
}

.expr-cards__empty {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: var(--text-muted);
}

.expr-cards__error {
  background: rgba(248, 113, 113, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.6);
  color: #b91c1c;
}

/* Grid de cartes */
.expr-cards__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .expr-cards__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .expr-cards__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.expr-card {
  margin: 0;
}

.expr-card__inner {
  width: 100%;
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: var(--surface-elevated);
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

.expr-card__inner:hover,
.expr-card__inner:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  transform: translateY(-1px);
}

/* Contenu carte */
.expr-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.expr-card__type {
  margin-bottom: 0.1rem;
}

.expr-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
}

.expr-card__badge--word {
  background: #ecfdf5;
  color: #047857;
}

.expr-card__badge--verb {
  background: #eff6ff;
  color: #1d4ed8;
}

.expr-card__title {
  font-size: 1.04rem;
  font-weight: 600;
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.expr-card__ku {
  font-size: 0.86rem;
  font-weight: 500;
  text-transform: lowercase;
  color: var(--primary);
}

.expr-card__main {
  font-weight: 600;
}

.expr-card__main--word {
  color: var(--primary);
}

.expr-card__main--verb {
  color: #1d4ed8;
}

.expr-card__secondary {
  font-size: 0.9rem;
  color: #6d28d9;
}

.expr-card__phonetic {
  font-size: 0.85rem;
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  color: var(--text-muted);
}

/* Body */
.expr-card__body {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.expr-card__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 0.4rem;
  font-size: 0.9rem;
}

.expr-card__row dt {
  font-weight: 600;
  color: var(--text-muted);
}

.expr-card__row dd {
  margin: 0;
  color: var(--text-default);
}

/* Footer */
.expr-card__footer {
  margin-top: 0.35rem;
  display: flex;
  justify-content: flex-end;
}

.expr-card__cta {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

/* Pagination */
.expr-cards__pagination {
  margin-top: 1.25rem;
  display: flex;
  justify-content: center;
}

/* Responsive */
@media (max-width: 640px) {
  .expr-cards__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .expr-cards__search-input {
    width: 100%;
  }
}
</style>
