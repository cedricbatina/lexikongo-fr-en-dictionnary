<template>
  <section class="verb-list" aria-labelledby="verb-list-heading">
    <!-- Header -->
     <header class="verb-list__header">
 <!--   
      <div>
        <h2 id="verb-list-heading" class="verb-list__title">
          {{ t('verbs.list.title') }}
        </h2>
        <p class="verb-list__subtitle">
          {{ t('verbs.list.subtitle.prefix') }}
          <span class="verb-list__ku-inline">ku</span>
          {{ t('verbs.list.subtitle.suffix') }}
        </p>
      </div>-->

      <p
        v-if="itemsLength"
        class="verb-list__count"
      >
        {{ t('verbs.list.count', itemsLength) }}
      </p>
    </header>

    <!-- Barre de recherche + switch cartes -->
    <div class="verb-list__toolbar">
      <div class="verb-list__search">
        <label class="verb-list__search-label" for="verb-search">
          {{ t('verbs.list.searchLabel') }}
        </label>
        <input
          id="verb-search"
          v-model="searchLocal"
          type="search"
          class="verb-list__search-input"
          :placeholder="t('verbs.list.searchPlaceholder')"
        />
      </div>

      <NuxtLink
        to="/verblist-card"
        class="verb-list__view-link"
        :aria-label="t('verbs.list.viewCardsAria')"
      >
        <i class="fas fa-th-large" aria-hidden="true"></i>
        <span>{{ t('verbs.list.viewCards') }}</span>
      </NuxtLink>
    </div>

    <!-- État : chargement -->
    <div
      v-if="store.isLoading"
      class="verb-list__status"
      role="status"
      aria-live="polite"
    >
      {{ t('verbs.list.loading') }}
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
      v-else-if="!paginatedVerbs.length"
      class="verb-list__empty"
      aria-live="polite"
    >
      {{ t('verbs.list.empty') }}
    </p>

    <!-- Tableau des verbes -->
    <div
      v-else
      class="verb-list__table-wrapper"
    >
      <table
        class="verb-list__table"
        role="table"
        aria-describedby="verb-list-caption"
      >
        <!-- Largeurs de colonnes -->
        <colgroup>
          <col style="width: 22%;" />
          <col style="width: 18%;" />
          <col style="width: 30%;" />
          <col style="width: 30%;" />
        </colgroup>

        <caption
          id="verb-list-caption"
          class="verb-list__caption"
        >
          {{ t('verbs.list.caption') }}
        </caption>

        <thead>
          <tr>
            <th scope="col">{{ t('verbs.list.column.verb') }}</th>
            <th scope="col">{{ t('verbs.list.column.phonetic') }}</th>
            <th scope="col">{{ t('verbs.list.column.fr') }}</th>
            <th scope="col">{{ t('verbs.list.column.en') }}</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="verb in paginatedVerbs"
            :key="verb.slug || verb.id"
            class="verb-list__row"
            @click="goToDetails(verb.slug)"
            role="button"
            :aria-label="t('verbs.list.rowAria', { verb: verb.singular || '' })"
          >
            <!-- Verbe (ku + infinitif) -->
            <td class="verb-list__cell verb-list__cell--verb">
              <span class="verb-list__ku">ku</span>
              <span class="verb-list__infinitive">
                {{ verb.singular || '—' }}
              </span>
            </td>

            <!-- Phonétique -->
            <td class="verb-list__cell verb-list__cell--phonetic">
              <span v-if="verb.phonetic" class="verb-list__phonetic">
                {{ verb.phonetic }}
              </span>
              <span v-else class="verb-list__placeholder">—</span>
            </td>

            <!-- Français -->
            <td class="verb-list__cell">
              <span class="verb-list__translation">
                {{ truncateText(verb.translation_fr, 80) || '—' }}
              </span>
            </td>

            <!-- Anglais -->
            <td class="verb-list__cell">
              <span class="verb-list__translation">
                {{ truncateText(verb.translation_en, 80) || '—' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="verb-list__pagination"
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Pagination from '@/components/Pagination.vue';
import { useVerbStore } from '~/stores/verbStore';

const router = useRouter();
const store = useVerbStore();
const { t } = useI18n();

const searchLocal = ref('');

// helper pour le compteur (évite les erreurs si items = null)
const itemsLength = computed(() =>
  Array.isArray(store.items) ? store.items.length : 0
);

// liste filtrée selon la recherche
const filteredVerbs = computed(() => {
  const items = Array.isArray(store.items) ? store.items : [];
  const q = searchLocal.value.trim().toLowerCase();
  if (!q) return items;

  return items.filter((verb) => {
    const singular = (verb.singular || '').toLowerCase();
    const phonetic = (verb.phonetic || '').toLowerCase();
    const fr = (verb.translation_fr || '').toLowerCase();
    const en = (verb.translation_en || '').toLowerCase();

    return (
      singular.includes(q) ||
      phonetic.includes(q) ||
      fr.includes(q) ||
      en.includes(q)
    );
  });
});

// reset pagination quand on modifie la recherche
watch(searchLocal, () => {
  store.page = 1;
});

// pagination appliquée à la liste filtrée
const paginatedVerbs = computed(() => {
  const start = (store.page - 1) * store.pageSize;
  return filteredVerbs.value.slice(start, start + store.pageSize);
});

// nombre de pages sur la liste filtrée
const totalPages = computed(() => {
  const total = filteredVerbs.value.length || 0;
  if (!total) return 1;
  return Math.ceil(total / store.pageSize);
});

const goToDetails = (slug) => {
  if (!slug) {
    console.error('Erreur : slug manquant pour la redirection.');
    return;
  }
  router.push(`/details/verb/${slug}`);
};

const truncateText = (text, limit = 80) => {
  if (!text) return '';
  return text.length > limit ? text.slice(0, limit) + '…' : text;
};

// Chargement initial (SSR-safe)
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
  gap: 0.5rem;
}

.verb-list__title {
  font-size: 1.35rem;
  font-weight: 650;
  color: var(--text-default);
}

.verb-list__subtitle {
  font-size: 0.98rem;
  color: var(--text-muted);
  max-width: 46rem;
}

.verb-list__ku-inline {
  font-family: inherit;
  font-weight: 600;
    color: #535559;


  
}

.verb-list__count {
  margin-left: auto;
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* Barre de recherche */
.verb-list__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.verb-list__search {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.verb-list__search-label {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.verb-list__search-input {
  width: 400px;
  max-width: 100%;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  font-size: 0.9rem;
  color: var(--text-default);
  background: var(--surface-elevated);
}

/* États */
.verb-list__status,
.verb-list__empty,
.verb-list__error {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.95rem;
}

/* info (chargement) */
.verb-list__status {
  background: rgba(13, 110, 253, 0.12);
  border: 1px solid rgba(13, 110, 253, 0.35);
  color: var(--primary);
}

/* vide */
.verb-list__empty {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: var(--text-muted);
}

/* erreur */
.verb-list__error {
  background: rgba(248, 113, 113, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.6);
  color: #b91c1c;
}

/* Table */
.verb-list__table-wrapper {
  border-radius: 0.9rem;
  border: 1px solid var(--border-subtle);
  background: var(--surface-elevated);
  overflow-x: auto;
  overflow-y: hidden;
}

.verb-list__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  min-width: 900px;
  background: transparent;
}

.verb-list__caption {
  text-align: center;
  padding: 0.7rem 1rem;
  font-size: 0.82rem;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-subtle);
  background: var(--surface-default);
}

.verb-list__table thead {
  background: rgba(148, 163, 184, 0.16);
}

.verb-list__table th {
  padding: 0.6rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-subtle);
}

/* Lignes + cellules */
.verb-list__cell {
  padding: 0.55rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  vertical-align: top;
  color: var(--text-default);
  font-size: 0.95rem;
  word-break: break-word;
  white-space: normal;
}

.verb-list__row {
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.08s ease;
}

.verb-list__row:hover {
  background-color: rgba(37, 99, 235, 0.06);
  transform: translateY(-1px);
}

/* Verbe + "ku" */
.verb-list__cell--verb {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  min-width: 180px;
}

.verb-list__ku {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: lowercase;
  color: var(--primary);
}

.verb-list__infinitive {
  font-weight: 600;
 color: var(--primary);
}

/* Phonétique */
.verb-list__cell--phonetic {
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  font-size: 0.9rem;
  color: var(--text-default);
}

.verb-list__phonetic {
  white-space: nowrap;
}

/* Placeholder */
.verb-list__placeholder {
  color: #535559;
}

/* Traductions : FR = vert, EN = ambré (comme WordList) */
.verb-list__translation {
  color: var(--text-default);
  white-space: normal;
  word-break: break-word;
}

.verb-list__table tbody td:nth-child(3) .verb-list__translation {
  color: #047857;
}

.verb-list__table tbody td:nth-child(4) .verb-list__translation {
  color: #b45309;
}

/* Pagination */
.verb-list__pagination {
  margin-top: 1rem;
}

/* Bouton "vue cartes" */
.verb-list__view-link {
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

.verb-list__view-link:hover {
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary);
}

/* Responsive */
@media (max-width: 640px) {
  .verb-list__table {
    font-size: 0.9rem;
    min-width: 640px;
  }

  .verb-list__table th,
  .verb-list__cell {
    padding: 0.45rem 0.6rem;
  }

  .verb-list__toolbar {
    justify-content: stretch;
  }

  .verb-list__search-input {
    width: 100%;
    min-width: 0;
  }
}
</style>
