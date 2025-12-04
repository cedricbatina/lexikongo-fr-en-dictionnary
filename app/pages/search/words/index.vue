<template>
  <main
    class="page search-page"
    aria-labelledby="search-words-title"
  >
    <!-- Hero Lexikongo -->
    <LkPageHero
      id="search-words-title"
      :eyebrow="t('search.word.eyebrow')"
      :title="t('search.word.title')"
      :description="t('search.word.subtitle')"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="true"
    >
      <!-- Meta sous le titre -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-language" aria-hidden="true"></i>
          <span>
            {{ t('search.word.metaKikongo') }}
          </span>
        </p>
      </template>

      <!-- Colonne de droite : actions globales -->
      <template #side>
        <div class="lk-hero-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <!-- Barre de recherche -->
    <section
      class="search-panel"
      aria-labelledby="search-words-form-title"
    >
      <header class="search-panel__header">
        <h2
          id="search-words-form-title"
          class="search-panel__title"
        >
          {{ t('search.word.formTitle') }}
        </h2>
        <p class="search-panel__subtitle">
          {{ t('search.word.formSubtitle') }}
        </p>
      </header>

      <form
        class="search-panel__form"
        @submit.prevent
      >
        <label
          class="search-panel__label"
          for="search-words-input"
        >
          {{ t('search.word.inputLabel') }}
        </label>

        <div class="search-panel__input-wrap">
          <span
            class="search-panel__input-icon"
            aria-hidden="true"
          >
            <i class="fas fa-search" />
          </span>
          <input
            id="search-words-input"
            v-model="searchLocal"
            type="search"
            class="search-panel__input"
            :placeholder="t('search.word.inputPlaceholder')"
            autocomplete="off"
          />
        </div>

        <p class="search-panel__hint">
          {{ t('search.word.hint') }}
        </p>
      </form>
    </section>

    <!-- Résultats -->
    <section
      class="search-results"
      aria-live="polite"
      :aria-busy="store.isLoading ? 'true' : 'false'"
    >
      <!-- États -->
      <div class="search-results__status">
        <p
          v-if="store.isLoading"
          class="search-results__badge search-results__badge--loading"
          role="status"
        >
          {{ t('search.word.loading') }}
        </p>

        <p
          v-else-if="store.error"
          class="search-results__badge search-results__badge--error"
          role="alert"
        >
          {{ store.error }}
        </p>

        <p
          v-else-if="!searchLocal"
          class="search-results__badge search-results__badge--idle"
        >
          {{ t('search.word.idle') }}
        </p>

        <p
          v-else-if="filteredWords.length === 0"
          class="search-results__badge search-results__badge--empty"
        >
          {{ t('search.word.emptyForQuery', { query: searchLocal }) }}
        </p>

        <p
          v-else
          class="search-results__badge search-results__badge--count"
        >
          {{ t('search.word.resultsCount', { count: filteredWords.length }) }}
        </p>
      </div>

      <!-- Tableau des résultats -->
      <div
        v-if="paginatedWords.length"
        class="search-results__table-wrapper"
      >
        <table
          class="search-results__table"
          role="table"
          aria-describedby="search-words-caption"
        >
          <colgroup>
            <col style="width: 16%;" />
            <col style="width: 16%;" />
            <col style="width: 18%;" />
            <col style="width: 25%;" />
            <col style="width: 25%;" />
          </colgroup>

          <caption
            id="search-words-caption"
            class="search-results__caption"
          >
            {{ t('search.word.resultsCaption') }}
          </caption>

          <thead>
            <tr>
              <th scope="col">
                {{ t('words.list.column.singular') }}
              </th>
              <th scope="col">
                {{ t('words.list.column.plural') }}
              </th>
              <th scope="col">
                {{ t('words.list.column.phonetic') }}
              </th>
              <th scope="col">
                {{ t('words.list.column.fr') }}
              </th>
              <th scope="col">
                {{ t('words.list.column.en') }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="word in paginatedWords"
              :key="word.slug || word.id"
              class="search-results__row"
              role="button"
              tabindex="0"
              @click="goToDetails(word.slug)"
              @keydown.enter.prevent="goToDetails(word.slug)"
              @keydown.space.prevent="goToDetails(word.slug)"
              :aria-label="t('words.list.rowAria', { word: word.singular || '—' })"
            >
              <td class="search-results__cell search-results__cell--main">
                <span class="search-results__singular">
                  {{ word.singular || '—' }}
                </span>
                <span
                  v-if="word.plural"
                  class="search-results__plural"
                >
                  · {{ word.plural }}
                </span>
              </td>

              <td class="search-results__cell">
                <span v-if="word.plural" class="search-results__value">
                  {{ word.plural }}
                </span>
                <span v-else class="search-results__placeholder">—</span>
              </td>

              <td class="search-results__cell">
                <span
                  v-if="word.phonetic"
                  class="search-results__phonetic"
                >
                  {{ word.phonetic }}
                </span>
                <span v-else class="search-results__placeholder">—</span>
              </td>

              <td class="search-results__cell">
                <span class="search-results__translation search-results__translation--fr">
                  {{ truncateText(word.translation_fr, 90) || '—' }}
                </span>
              </td>

              <td class="search-results__cell">
                <span class="search-results__translation search-results__translation--en">
                  {{ truncateText(word.translation_en, 90) || '—' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1 && filteredWords.length"
      class="search-page__pagination"
    >
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        :totalItems="filteredWords.length"
        :pageSize="pageSize"
        :ariaLabel="t('search.word.paginationAria')"
        :labelPrev="t('pagination.prev')"
        :labelNext="t('pagination.next')"
        :showSummary="true"
        :showGoto="true"
        :gotoLabel="t('pagination.gotoLabel')"
        @pageChange="handlePageChange"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useSeoMeta } from "#imports";

import LkPageHero from "@/components/LkPageHero.vue";
import LkActionsBar from "@/components/LkActionsBar.vue";
import Pagination from "@/components/Pagination.vue";
import { useWordStore } from "~/stores/wordStore";

const { t } = useI18n();
const router = useRouter();
const store = useWordStore();

const searchLocal = ref("");
const currentPage = ref(1);
const pageSize = 20;

// SEO
useSeoMeta({
  title: () =>
    t("search.word.metaTitle") || "Rechercher des mots en Kikongo | Lexikongo",
  description: () =>
    t("search.word.metaDescription") ||
    "Recherchez des mots en Kikongo avec leurs traductions en français, en anglais et leur phonétique dans le dictionnaire Lexikongo.",
});

// Liste filtrée en fonction de la recherche (singulier / pluriel / FR / EN)
const filteredWords = computed(() => {
  const items = Array.isArray(store.items) ? store.items : [];
  const q = searchLocal.value.trim().toLowerCase();

  if (!q) return [];

  return items.filter((word) => {
    const singular = (word.singular || "").toLowerCase();
    const plural = (word.plural || "").toLowerCase();
    const fr = (word.translation_fr || "").toLowerCase();
    const en = (word.translation_en || "").toLowerCase();

    return (
      singular.includes(q) ||
      plural.includes(q) ||
      fr.includes(q) ||
      en.includes(q)
    );
  });
});

// Pagination
const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredWords.value.slice(start, start + pageSize);
});

const totalPages = computed(() => {
  const total = filteredWords.value.length || 0;
  if (!total) return 1;
  return Math.ceil(total / pageSize);
});

// Reset page si on change la recherche
watch(searchLocal, () => {
  currentPage.value = 1;
});

const handlePageChange = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const truncateText = (text, limit = 90) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "…" : text;
};

const goToDetails = (slug) => {
  if (!slug) return;
  router.push(`/details/word/${slug}`);
};

onMounted(() => {
  if (!store.items.length) {
    store.fetchAll();
  }
});
</script>

<style scoped>
.page.search-page {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

/* Panneau de recherche */
.search-panel {
  margin-top: 0.3rem;
  border-radius: 0.9rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  background: var(--surface-elevated, #ffffff);
  padding: 0.9rem 1rem;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
}

.search-panel__header {
  margin-bottom: 0.4rem;
}

.search-panel__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.search-panel__subtitle {
  margin: 0.1rem 0 0;
  font-size: 0.85rem;
  color: var(--text-muted, #6b7280);
}

.search-panel__form {
  margin-top: 0.45rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.search-panel__label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-muted, #6b7280);
}

.search-panel__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-panel__input-icon {
  position: absolute;
  left: 0.9rem;
  font-size: 0.9rem;
  color: var(--text-muted, #9ca3af);
}

.search-panel__input {
  width: 100%;
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
  padding: 0.5rem 0.9rem 0.5rem 2.1rem;
  font-size: 0.95rem;
  background: var(--surface-default, #f9fafb);
  color: var(--text-default, #111827);
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease;
}

.search-panel__input:focus-visible {
  border-color: var(--primary, #2563eb);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25);
  background: #ffffff;
}

.search-panel__hint {
  margin: 0;
  font-size: 0.78rem;
  color: var(--text-muted, #6b7280);
}

/* Résultats */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.search-results__status {
  display: flex;
  justify-content: flex-start;
}

.search-results__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  border: 1px solid transparent;
}

.search-results__badge--loading {
  border-color: rgba(37, 99, 235, 0.45);
  background: rgba(37, 99, 235, 0.08);
  color: var(--primary, #2563eb);
}

.search-results__badge--error {
  border-color: rgba(248, 113, 113, 0.6);
  background: rgba(248, 113, 113, 0.18);
  color: #b91c1c;
}

.search-results__badge--empty,
.search-results__badge--idle {
  border-color: rgba(148, 163, 184, 0.6);
  background: rgba(148, 163, 184, 0.12);
  color: var(--text-muted, #6b7280);
}

.search-results__badge--count {
  border-color: rgba(34, 197, 94, 0.55);
  background: rgba(22, 163, 74, 0.08);
  color: #15803d;
}

/* Tableau */
.search-results__table-wrapper {
  border-radius: 0.9rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  background: var(--surface-elevated, #ffffff);
  overflow: hidden;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
}

.search-results__caption {
  text-align: left;
  font-size: 0.8rem;
  padding: 0.5rem 0.9rem;
  color: var(--text-muted, #6b7280);
  background: rgba(148, 163, 184, 0.12);
}

.search-results__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.search-results__table thead {
  background: rgba(148, 163, 184, 0.1);
}

.search-results__table th,
.search-results__table td {
  padding: 0.55rem 0.9rem;
  text-align: left;
}

.search-results__table th {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted, #6b7280);
  border-bottom: 1px solid rgba(148, 163, 184, 0.45);
}

.search-results__row {
  cursor: pointer;
  transition:
    background-color 0.12s ease,
    transform 0.06s ease;
}

.search-results__row:nth-child(2n) {
  background: rgba(148, 163, 184, 0.04);
}

.search-results__row:hover,
.search-results__row:focus-visible {
  outline: none;
  background: rgba(37, 99, 235, 0.06);
  transform: translateY(-1px);
}

.search-results__cell--main {
  font-weight: 600;
}

.search-results__singular {
  color: var(--primary, #2563eb);
}

.search-results__plural {
  margin-left: 0.2rem;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

.search-results__phonetic {
  font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco,
    Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.86rem;
  color: var(--text-default, #111827);
}

.search-results__translation {
  display: inline-block;
  max-width: 100%;
}

.search-results__translation--fr {
  color: #047857;
}

.search-results__translation--en {
  color: #b45309;
}

.search-results__placeholder {
  color: var(--text-muted, #9ca3af);
}

/* Pagination */
.search-page__pagination {
  margin-top: 0.6rem;
}

/* Responsive */
@media (max-width: 768px) {
  .search-panel {
    padding-inline: 0.85rem;
  }

  .search-results__table th,
  .search-results__table td {
    padding-inline: 0.65rem;
  }
}
</style>
