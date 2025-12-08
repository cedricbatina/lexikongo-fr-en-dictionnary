<template>
  <section class="verb-results">
    <!-- Résultats -->
    <div
      v-if="paginatedVerbs.length"
      class="verb-results__table-wrapper"
    >
      <table
        class="verb-results__table"
        role="table"
        :aria-label="t('verbs.search.results.ariaLabel')"
      >
        <caption class="verb-results__caption">
          {{ t('verbs.search.results.caption') }}
        </caption>

        <thead>
          <tr>
            <th scope="col">
              {{ t('verbs.search.results.columns.infinitive') }}
            </th>
            <th scope="col">
              {{ t('verbs.search.results.columns.phonetic') }}
            </th>
            <th scope="col">
              {{ t('verbs.search.results.columns.fr') }}
            </th>
            <th scope="col">
              {{ t('verbs.search.results.columns.en') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="verb in paginatedVerbs"
            :key="verb.slug || verb.id"
            class="verb-results__row"
            role="button"
            tabindex="0"
            @click="goToDetails(verb.slug)"
            @keydown.enter.prevent="goToDetails(verb.slug)"
            @keydown.space.prevent="goToDetails(verb.slug)"
            :aria-label="t('verbs.search.results.rowAria', { verb: verb.singular || t('verbs.common.unknownVerb') })"
          >
            <!-- Infinitif -->
            <td class="verb-results__cell verb-results__cell--infinitive">
              <span class="verb-results__infinitive">
                {{ verb.singular || '—' }}
              </span>
            </td>

            <!-- Phonétique -->
            <td class="verb-results__cell verb-results__cell--phonetic">
              <span v-if="verb.phonetic" class="verb-results__phonetic">
                {{ verb.phonetic }}
              </span>
              <span v-else class="verb-results__placeholder">—</span>
            </td>

            <!-- Français -->
            <td class="verb-results__cell">
              <span class="verb-results__translation verb-results__translation--fr">
                {{ verb.translation_fr || '—' }}
              </span>
            </td>

            <!-- Anglais -->
            <td class="verb-results__cell">
              <span class="verb-results__translation verb-results__translation--en">
                {{ verb.translation_en || '—' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="verb-results__pagination">
        <Pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          :totalItems="verbs.length"
          :pageSize="pageSize"
          @pageChange="changePage"
        />
      </div>
    </div>

    <!-- Aucun résultat -->
    <p
      v-else-if="searchPerformed && !paginatedVerbs.length"
      class="verb-results__empty"
      role="status"
      aria-live="polite"
    >
      {{ t('verbs.search.results.empty') }}
    </p>

    <!-- Message d’erreur -->
    <p
      v-if="errorMessage"
      class="verb-results__error"
      role="alert"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Pagination from '@/components/Pagination.vue';

const props = defineProps({
  results: {
    type: Array,
    default: () => [],
  },
});

const { t } = useI18n();
const router = useRouter();

const verbs = ref([]);            // Liste des verbes
const searchPerformed = ref(false);
const errorMessage = ref(null);

const currentPage = ref(1);
const pageSize = 15;

// Navigation vers la page détail
const goToDetails = (slug) => {
  if (!slug) {
    errorMessage.value = t('verbs.search.results.errors.missingSlug');
    return;
  }
  router.push(`/details/verb/${slug}`);
};

// Changement de page
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    errorMessage.value = null;
  } else {
    errorMessage.value = t('verbs.search.results.errors.invalidPage');
  }
};

// Pagination
const paginatedVerbs = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return verbs.value.slice(start, start + pageSize);
});

const totalPages = computed(() =>
  verbs.value.length ? Math.ceil(verbs.value.length / pageSize) : 1,
);

// Mise à jour quand results change
watch(
  () => props.results,
  (newResults) => {
    if (Array.isArray(newResults)) {
      verbs.value = newResults;
      searchPerformed.value = true;
      errorMessage.value = null;
      currentPage.value = 1;
    } else {
      errorMessage.value = t('verbs.search.results.errors.unexpectedFormat');
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.verb-results {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

/* Tableau */
.verb-results__table-wrapper {
  border-radius: 0.9rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.6));
  background: var(--surface-elevated, #ffffff);
  overflow-x: auto;
}

.verb-results__table {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
  font-size: 0.95rem;
  background: transparent;
}

.verb-results__caption {
  text-align: center;
  padding: 0.7rem 1rem;
  font-size: 0.82rem;
  color: var(--text-muted, #6b7280);
  border-bottom: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.6));
  background: var(--surface-default, #f9fafb);
}

.verb-results__table thead {
  background: rgba(148, 163, 184, 0.16);
}

.verb-results__table th {
  padding: 0.6rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-muted, #6b7280);
  border-bottom: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.6));
}

/* Lignes / cellules */
.verb-results__cell {
  padding: 0.55rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  vertical-align: top;
  color: var(--text-default, #111827);
  font-size: 0.95rem;
  word-break: break-word;
}

.verb-results__row {
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.08s ease;
}

.verb-results__row:hover,
.verb-results__row:focus-visible {
  background-color: rgba(37, 99, 235, 0.06);
  transform: translateY(-1px);
  outline: none;
}

/* Infinitif en couleur primaire */
.verb-results__cell--infinitive .verb-results__infinitive {
  font-weight: 600;
  color: var(--primary, #2563eb);
}

/* Phonétique */
.verb-results__cell--phonetic {
  font-family: 'Fira Code', Menlo, ui-monospace, SFMono-Regular, monospace;
  font-size: 0.9rem;
  color: var(--text-default, #111827);
}

.verb-results__placeholder {
  color: #9ca3af;
}

/* Traductions : petit code couleur comme pour WordList */
.verb-results__translation {
  color: var(--text-default, #111827);
}

.verb-results__translation--fr {
  color: #047857; /* vert (FR) */
}

.verb-results__translation--en {
  color: #b45309; /* orange (EN) */
}

/* Pagination */
.verb-results__pagination {
  margin-top: 0.75rem;
}

/* États : vide / erreur */
.verb-results__empty,
.verb-results__error {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.95rem;
}

/* Vide */
.verb-results__empty {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: var(--text-muted, #6b7280);
}

/* Erreur */
.verb-results__error {
  background: rgba(248, 113, 113, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.6);
  color: #b91c1c;
}

/* Responsive */
@media (max-width: 640px) {
  .verb-results__table {
    font-size: 0.9rem;
  }

  .verb-results__table th,
  .verb-results__cell {
    padding: 0.45rem 0.6rem;
  }
}
</style>
