<template>
  <section class="expr-list" aria-labelledby="expr-list-heading">
    <header class="expr-list__header">
      <div>
        <h2 id="expr-list-heading" class="expr-list__title">
          Toutes les expressions
        </h2>
        <p class="expr-list__subtitle">
          Explorez d’un coup d’œil les
          <strong>mots</strong> et les <strong>verbes</strong> en Kikongo,
          avec leur phonétique et leurs traductions en français et en anglais.
        </p>
      </div>

      <p v-if="store.filteredItems.length" class="expr-list__count">
        {{ store.filteredItems.length }}
        expression<span v-if="store.filteredItems.length > 1">s</span>
        affichée<span v-if="store.filteredItems.length > 1">s</span>
      </p>
    </header>

    <!-- Barre filtres + recherche -->
    <div class="expr-list__toolbar">
      <div class="expr-list__filters">
        <button
          type="button"
          class="expr-list__filter-btn"
          :class="{ 'expr-list__filter-btn--active': store.type === 'all' }"
          @click="store.setType('all')"
        >
          Tous
        </button>
        <button
          type="button"
          class="expr-list__filter-btn"
          :class="{ 'expr-list__filter-btn--active': store.type === 'word' }"
          @click="store.setType('word')"
        >
          Mots
        </button>
        <button
          type="button"
          class="expr-list__filter-btn"
          :class="{ 'expr-list__filter-btn--active': store.type === 'verb' }"
          @click="store.setType('verb')"
        >
          Verbes
        </button>
      </div>

      <div class="expr-list__search">
        <label class="expr-list__search-label" for="expr-search">
          Rechercher
        </label>
        <input
          id="expr-search"
          v-model="searchLocal"
          type="search"
          class="expr-list__search-input"
          placeholder="Mot, verbe, traduction FR ou EN…"
          @input="onSearchInput"
        />
      </div>
    </div>

    <!-- État : chargement -->
    <div
      v-if="store.isLoading"
      class="expr-list__status"
      role="status"
      aria-live="polite"
    >
      Chargement des expressions…
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
      Aucune expression trouvée pour ces critères.
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
        <caption
          id="expr-list-caption"
          class="expr-list__caption"
        >
          Chaque ligne représente soit un <strong>mot</strong>, soit un
          <strong>verbe</strong> en Kikongo, avec sa transcription phonétique
          et ses traductions en français et en anglais.
        </caption>

        <thead>
          <tr>
            <th scope="col">Type</th>
            <th scope="col">Expression</th>
            <th scope="col">Phonétique</th>
            <th scope="col">Français</th>
            <th scope="col">Anglais</th>
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
                {{ expr.type === "verb" ? "Verbe" : "Mot" }}
              </span>
            </td>

            <!-- Expression -->
          <td class="expr-list__cell expr-list__cell--expr">
  <template v-if="expr.type === 'verb'">
    <span class="expr-list__ku">ku</span>
    <span class="expr-list__main expr-list__main--verb">
      {{ expr.singular || "—" }}
    </span>
  </template>

  <template v-else>
    <span class="expr-list__main expr-list__main--word small">
      {{ expr.singular || "—" }}
    </span>
    <span
      v-if="expr.plural"
      class="expr-list__secondary expr-list__secondary--plural small"
    >
      - {{ expr.plural }}
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
                {{ truncateText(expr.translation_fr, 80) || "—" }}
              </span>
            </td>

            <!-- Anglais -->
            <td class="expr-list__cell">
              <span class="expr-list__translation expr-list__translation--en">
                {{ truncateText(expr.translation_en, 80) || "—" }}
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Pagination from "@/components/Pagination.vue";
import { useExpressionStore } from "~/stores/expressionStore";

const router = useRouter();
const store = useExpressionStore();

const searchLocal = ref(store.search || "");

// Redirection vers /details/word/:slug ou /details/verb/:slug
const goToDetails = (expr) => {
  if (!expr.slug) {
    console.error("Slug manquant pour l'expression :", expr);
    return;
  }
  const type = expr.type === "verb" ? "verb" : "word";
  router.push(`/details/${type}/${expr.slug}`);
};

const truncateText = (text, limit = 80) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "…" : text;
};

// Accessibilité
const ariaLabel = (expr) => {
  if (expr.type === "verb") {
    return `Voir la fiche du verbe ku ${expr.singular || ""}`;
  }
  return `Voir la fiche du mot ${expr.singular || "en Kikongo"}`;
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
  color: var(--text-default, #111827);
}

.expr-list__subtitle {
  font-size: 0.98rem;
  /* ✅ contraste renforcé comme WordList */
  color: #ecedee;
  max-width: 46rem;
}

.expr-list__subtitle strong {
  font-weight: 600;
}

.expr-list__count {
  margin-left: auto;
  font-size: 0.9rem;
  /* même logique que WordList (muted clair) */
  color: var(--muted-text, #c9d0d9);
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
  background: #f3f5fe;
}

.expr-list__filter-btn {
  border: none;
  background: transparent;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  color: #4b5563;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.08s ease;
}

.expr-list__filter-btn--active {
  background: #4f46e5;
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
  color: #6b7280;
}

.expr-list__search-input {
  min-width: 230px;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  font-size: 0.9rem;
}

/* États (mêmes couleurs que WordList / VerbList) */
.expr-list__status,
.expr-list__empty {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: #eef2ff;
  border: 1px solid rgba(79, 70, 229, 0.4);
  font-size: 0.95rem;
  color: #111827;
}

.expr-list__error {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: #fef2f2;
  border: 1px solid rgba(248, 113, 113, 0.7);
  font-size: 0.95rem;
  color: #991b1b;
}

/* Table (aligné avec WordList / VerbList) */
.expr-list__table-wrapper {
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: #ffffff; /* fond clair */
  overflow: hidden;
}

.expr-list__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.expr-list__caption {
  text-align: left;
  padding: 0.7rem 1rem;
  font-size: 0.82rem;
  color: var(--muted-text, #6b7280);
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
  background: #f9fafb;
}

.expr-list__table thead {
  background: #f3f4f6;
}

.expr-list__table th {
  padding: 0.6rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--muted-text, #374151);
  border-bottom: 1px solid rgba(148, 163, 184, 0.4);
}

/* Lignes + cellules */
.expr-list__cell {
  padding: 0.55rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  vertical-align: middle;
  color: var(--text-default, #111827);
  font-size: 0.95rem;
}

.expr-list__row {
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.08s ease;
}

.expr-list__row:hover {
  background-color: rgba(37, 99, 235, 0.04);
  transform: translateY(-1px);
}

/* Type badge (même logique couleurs) */
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
  color: #047857; /* vert comme FR */
}

.expr-list__badge--verb {
  background: #eff6ff;
  color: #1d4ed8; /* bleu comme les verbes */
}

/* Expression (on reprend la logique verbs/words) */
.expr-list__cell--expr {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

/* "ku" infinitif → bleu primaire */
.expr-list__ku {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: lowercase;
  color: var(--primary, #0d6efd);
}

/* terme principal (mot ou rad. du verbe) */
.expr-list__main {
  font-weight: 600;
  color: #111827;
}

/* pluriel / variante → violet doux (comme WordList) */
.expr-list__secondary {
  font-size: 0.9rem;
  color: #6d28d9;
}

/* Phonétique → monospace + gris bleuté (comme WordList / VerbList) */
.expr-list__cell--phonetic {
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  font-size: 0.9rem;
  color: #383839;
}

.expr-list__phonetic {
  white-space: nowrap;
}

/* Placeholder */
.expr-list__placeholder {
  color: #9ca3af;
}

/* Traductions : FR = vert, EN = ambré (comme partout) */
.expr-list__translation {
  color: #111827;
}

.expr-list__translation--fr {
  color: #047857; /* vert profond */
}

.expr-list__translation--en {
  color: #b45309; /* amber / orange discret */
}

/* Pagination */
.expr-list__pagination {
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 640px) {
  .expr-list__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .expr-list__search-input {
    width: 100%;
    min-width: 0;
  }

  .expr-list__table {
    font-size: 0.9rem;
  }

  .expr-list__table th,
  .expr-list__cell {
    padding: 0.45rem 0.6rem;
  }
}
/* Terme principal (mot ou verbe) */
.expr-list__main {
  font-weight: 600;
}

/* Mot (singulier) → EXACTEMENT comme WordList */
.expr-list__main--word {
  color: var(--primary, #0d6efd); /* bleu primaire */
}

/* Verbe (radical après "ku") → comme VerbList */
.expr-list__main--verb {
  color: #1d4ed8;
}

/* Pluriel → EXACTEMENT comme WordList (.word-list__cell--plural) */
.expr-list__secondary {
  font-size: 0.9rem;
}

.expr-list__secondary--plural {
  font-weight: 600;
  color: #08439c; /* même couleur que dans WordList */
}

</style>
