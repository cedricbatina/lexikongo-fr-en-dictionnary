<template>
  <section class="expr-list page" aria-labelledby="expr-list-heading">
    <!-- Header -->
    <header class="expr-list__header">
      <div>
        <h2 id="expr-list-heading" class="expr-list__title">
          {{ t('expressions.list.title') }}
        </h2>
        <p class="expr-list__subtitle">
          {{ t('expressions.list.subtitle') }}
        </p>
      </div>

      <p v-if="store.filteredItems.length" class="expr-list__count">
        {{ t('expressions.list.count', store.filteredItems.length) }}
      </p>
    </header>

    <!-- Barre filtres + recherche + switch cartes -->
    <div class="expr-list__toolbar">
      <div class="expr-list__filters">
        <button
          type="button"
          class="expr-list__filter-btn"
          :class="{ 'expr-list__filter-btn--active': store.type === 'all' }"
          @click="store.setType('all')"
        >
          {{ t('expressions.list.filterAll') }}
        </button>
        <button
          type="button"
          class="expr-list__filter-btn"
          :class="{ 'expr-list__filter-btn--active': store.type === 'word' }"
          @click="store.setType('word')"
        >
          {{ t('expressions.list.filterWords') }}
        </button>
        <button
          type="button"
          class="expr-list__filter-btn"
          :class="{ 'expr-list__filter-btn--active': store.type === 'verb' }"
          @click="store.setType('verb')"
        >
          {{ t('expressions.list.filterVerbs') }}
        </button>
      </div>

      <div class="expr-list__toolbar-right">
        <div class="expr-list__search">
          <label class="expr-list__search-label" for="expr-search">
            {{ t('expressions.list.searchLabel') }}
          </label>
          <input
            id="expr-search"
            v-model="searchLocal"
            type="search"
            class="expr-list__search-input"
            :placeholder="t('expressions.list.searchPlaceholder')"
            @input="onSearchInput"
          />
        </div>

        <NuxtLink
          to="/expressionlist-card"
          class="expr-list__view-link"
          :aria-label="t('expressions.list.viewCardsAria')"
        >
          <i class="fas fa-th-large" aria-hidden="true"></i>
          <span>{{ t('expressions.list.viewCards') }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- État : chargement -->
    <div
      v-if="store.isLoading"
      class="expr-list__status"
      role="status"
      aria-live="polite"
    >
      {{ t('expressions.list.loading') }}
    </div>

    <!-- État : erreur -->
    <p
      v-else-if="store.error"
      class="expr-list__error"
      role="alert"
    >
      {{ store.error }}
    </p>

    <!-- État : vide -->
    <p
      v-else-if="!store.paginatedExpressions.length"
      class="expr-list__empty"
      aria-live="polite"
    >
      {{ t('expressions.list.empty') }}
    </p>

    <!-- Tableau des expressions -->
    <div
      v-else
      class="expr-list__table-wrapper"
    >
      <table
        class="expr-list__table"
        role="table"
        aria-describedby="expr-list-caption"
      >
        <colgroup>
          <col style="width: 3%" />
          <col style="width: 32%" />
          <col style="width: 19%" />
          <col style="width: 26%" />
          <col style="width: 25%" />
        </colgroup>

        <caption
          id="expr-list-caption"
          class="expr-list__caption"
        >
          {{ t('expressions.list.caption') }}
        </caption>

        <thead>
          <tr>
            <th scope="col">{{ t('expressions.list.column.type') }}</th>
<th scope="col">{{ t('expressions.list.column.expression') }}</th>
<th scope="col">{{ t('expressions.list.column.phonetic') }}</th>
<th scope="col">{{ t('common.lang.fr') }}</th>
<th scope="col">{{ t('common.lang.en') }}</th>

          </tr>
        </thead>

        <tbody>
          <tr
            v-for="expr in store.paginatedExpressions"
            :key="expr.slug || expr.id"
            class="expr-list__row"
            @click="goToDetails(expr)"
            role="button"
            :aria-label="ariaLabel(expr)"
          >
            <!-- Type -->
            <td class="expr-list__cell expr-list__cell--type">
              <span
                class="expr-list__badge"
                :class="{
                  'expr-list__badge--word': expr.type === 'word',
                  'expr-list__badge--verb': expr.type === 'verb',
                }"
              >
                {{
                  expr.type === 'verb'
                    ? t('expressions.list.badge.verb')
                    : t('expressions.list.badge.word')
                }}
              </span>
            </td>

            <!-- Expression -->
            <td class="expr-list__cell expr-list__cell--expr">
              <template v-if="expr.type === 'verb'">
                <span class="expr-list__ku">ku</span>
                <span class="expr-list__main expr-list__main--verb">
                  {{ expr.singular || '—' }}
                </span>
              </template>

              <template v-else>
                <span class="expr-list__main expr-list__main--word">
                  {{ expr.singular || '—' }}
                </span>
                <span
                  v-if="expr.plural"
                  class="expr-list__secondary expr-list__secondary--plural"
                >
                  – {{ expr.plural }}
                </span>
              </template>
            </td>

            <!-- Phonétique -->
            <td class="expr-list__cell expr-list__cell--phonetic">
              <span v-if="expr.phonetic" class="expr-list__phonetic">
                {{ expr.phonetic }}
              </span>
              <span v-else class="expr-list__placeholder">—</span>
            </td>

            <!-- Français -->
            <td class="expr-list__cell">
              <span class="expr-list__translation expr-list__translation--fr">
                {{ truncateText(expr.translation_fr, 80) || '—' }}
              </span>
            </td>

            <!-- Anglais -->
            <td class="expr-list__cell">
              <span class="expr-list__translation expr-list__translation--en">
                {{ truncateText(expr.translation_en, 80) || '—' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="store.totalPages > 1"
      class="expr-list__pagination"
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

// Redirection vers /details/word/:slug ou /details/verb/:slug
const goToDetails = (expr) => {
  if (!expr.slug) {
    console.error("Slug manquant pour l'expression :", expr);
    return;
  }
  const type = expr.type === 'verb' ? 'verb' : 'word';
  router.push(`/details/${type}/${expr.slug}`);
};

const truncateText = (text, limit = 80) => {
  if (!text) return '';
  return text.length > limit ? text.slice(0, limit) + '…' : text;
};

// Accessibilité
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

// sync champ de recherche → store
const onSearchInput = () => {
  store.setSearch(searchLocal.value);
};

// Chargement initial (comme WordList / VerbList, SSR-safe)
onMounted(() => {
  if (!store.items.length) {
    store.fetchAll();
  }
});
</script>

<style scoped>
.expr-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}


/* Header (aligné avec WordList / VerbList) */
.expr-list__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.expr-list__title {
  font-size: 1.35rem;
  font-weight: 650;
  color: var(--text-default);
}

.expr-list__subtitle {
  font-size: 0.98rem;
  color: var(--text-muted);
  max-width: 46rem;
}

.expr-list__subtitle strong {
  font-weight: 600;
}

.expr-list__count {
  margin-left: auto;
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* Toolbar (filtres + recherche) */
.expr-list__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.expr-list__filters {
  display: inline-flex;
  gap: 0.4rem;
  padding: 0.15rem;
  border-radius: 999px;
  background: var(--surface-default);
  border: 1px solid var(--border-subtle);
}

.expr-list__filter-btn {
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

.expr-list__filter-btn--active {
  background: var(--primary);
  color: #ffffff;
  transform: translateY(-1px);
}

.expr-list__search {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.expr-list__search-label {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.expr-list__search-input {
  width: 400px;          /* 🔁 comme WordList, confortable */
  max-width: 100%;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  font-size: 0.9rem;
  color: var(--text-default);
  background: var(--surface-elevated);
}

/* États */
.expr-list__status,
.expr-list__empty,
.expr-list__error {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.95rem;
}

/* info (chargement) */
.expr-list__status {
  background: rgba(13, 110, 253, 0.12);
  border: 1px solid rgba(13, 110, 253, 0.35);
  color: var(--primary);
}

/* vide */
.expr-list__empty {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: var(--text-muted);
}

/* erreur */
.expr-list__error {
  background: rgba(248, 113, 113, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.6);
  color: #b91c1c;
}

/* Table */
.expr-list__table-wrapper {
  border-radius: 0.9rem;
  border: 1px solid var(--border-subtle);
  background: var(--surface-elevated);
 
}

.expr-list__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  table-layout: auto;   /* laisse le navigateur répartir l’espace */
}
.expr-list__caption {
  text-align: center;
  padding: 0.7rem 1rem;
  font-size: 0.82rem;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-subtle);
  background: var(--surface-default);
}

.expr-list__table thead {
  background: rgba(148, 163, 184, 0.16);
}

.expr-list__table th {
  padding: 0.6rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-subtle);
}

/* Lignes + cellules */
.expr-list__cell {
  padding: 0.55rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  vertical-align: top;
  color: var(--text-default);
  font-size: 0.95rem;
  word-break: break-word;   /* longues définitions renvoyées à la ligne */
  white-space: normal;
}

.expr-list__row {
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.08s ease;
}

.expr-list__row:hover {
  background-color: rgba(37, 99, 235, 0.06);
  transform: translateY(-1px);
}

/* Type badge */
.expr-list__cell--type {
  width: 0;
  white-space: nowrap;
}

.expr-list__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
}

.expr-list__badge--word {
  background: #ecfdf5;
  color: #047857;
}

.expr-list__badge--verb {
  background: #eff6ff;
  color: #1d4ed8;
}

/* Expression (mot ou verbe) */
.expr-list__cell--expr {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  min-width: 220px; /* un peu plus large pour singulier + pluriel */
}

.expr-list__ku {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: lowercase;
  color: var(--primary);
}

.expr-list__main {
  font-weight: 500;
  color: var(--primary);  /* 🔁 singulier identique à WordList */
  word-break: keep-all;
}

.expr-list__secondary {
  font-weight: 500;
 color: var(--primary);  
  word-break: keep-all;
}

/* Phonétique */
.expr-list__cell--phonetic {
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  font-size: 0.9rem;
  color: var(--text-default);
  width: 12%;
  min-width: 150px;
}

.expr-list__phonetic {
  word-break: keep-all;
}

.expr-list__placeholder {
  color: #9ca3af;
}

/* Traductions : FR = vert, EN = ambré */
.expr-list__translation {
  color: var(--text-default);
  white-space: normal;
  word-break: break-word;
}

.expr-list__translation--fr {
  color: #047857;
}

.expr-list__translation--en {
  color: #b45309;
}

/* Pagination */
.expr-list__pagination {
  margin-top: 1rem;
}

/* Toolbar droite (search + vue cartes) */
.expr-list__toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.expr-list__view-link {
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

.expr-list__view-link:hover {
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary);
}

@media (max-width: 640px) {
  .expr-list__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .expr-list__search-input {
    width: 100%;
    min-width: 0;
  }

  /* Ancien bloc à supprimer ou commenter :
  .expr-list__table {
    font-size: 0.9rem;
    min-width: 720px;
  }
  */

  .expr-list__table {
    font-size: 0.8rem;   /* on garde la taille un peu plus petite */
  }

  .expr-list__table th,
  .expr-list__cell {
    padding: 0.45rem 0.6rem;
  }

  .expr-list__toolbar-right {
    flex-direction: column;
    align-items: stretch;
  }

  .expr-list__view-link {
    justify-content: center;
  }
}

</style>

