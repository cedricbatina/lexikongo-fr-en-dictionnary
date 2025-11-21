<template>
  <section class="word-list" aria-labelledby="word-list-heading">
    <header class="word-list__header">
      <div>
        <h2 id="word-list-heading" class="word-list__title">
          Liste des mots
        </h2>
        <p class="word-list__subtitle">
          Explorez les mots en Kikongo, avec leur pluriel, leur phonétique et
          leurs traductions en français et en anglais.
        </p>
      </div>

      <p v-if="store.items.length" class="word-list__count">
        {{ store.items.length }} mot<span v-if="store.items.length > 1">s</span> en base
      </p>
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
      v-else-if="!paginatedWords.length"
      class="word-list__empty"
      aria-live="polite"
    >
      Aucun mot trouvé pour le moment.
    </p>

    <!-- Tableau des mots -->
    <div
      v-else
      class="word-list__table-wrapper"
    >

    <header class="word-list__header">
      <div>
        <h2 id="word-list-heading" class="word-list__title">
          Liste des mots
        </h2>
        <p class="word-list__subtitle">
          Explorez les mots en Kikongo, avec leur pluriel, leur phonétique et
          leurs traductions en français et en anglais.
        </p>
      </div>

      <p v-if="store.items.length" class="word-list__count">
        {{ store.items.length }} mot<span v-if="store.items.length > 1">s</span> en base
      </p>
    </header>

    <!-- Barre de recherche (même logique visuelle qu’ExpressionList) -->
    <div class="word-list__toolbar">
      <div class="word-list__search">
        <label class="word-list__search-label" for="word-search">
          Rechercher
        </label>
        <input
          id="word-search"
          v-model="searchLocal"
          type="search"
          class="word-list__search-input"
          placeholder="Mot, pluriel, traduction FR ou EN…"
        />
      </div>
    </div>

      <table
        class="word-list__table"
        role="table"
        aria-describedby="word-list-caption"
      >
        <caption
          id="word-list-caption"
          class="word-list__caption"
        >
          Chaque ligne présente un mot en Kikongo, son pluriel (le cas échéant),
          sa transcription phonétique, ainsi que ses traductions en français et en anglais.
        </caption>

        <thead>
          <tr>
            <th scope="col">Mot</th>
            <th scope="col">Pluriel</th>
            <th scope="col">Phonétique</th>
            <th scope="col">Français</th>
            <th scope="col">Anglais</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="word in paginatedWords"
            :key="word.slug || word.id"
            class="word-list__row"
            @click="goToDetails(word.slug)"
            role="button"
            :aria-label="`Voir la fiche du mot ${word.singular || '—'}`"
          >
            <!-- Mot -->
            <td class="word-list__cell word-list__cell--singular">
              <span class="word-list__singular">
                {{ word.singular || "—" }}
              </span>
            </td>

            <!-- Pluriel -->
            <td class="word-list__cell word-list__cell--plural">
              <span v-if="word.plural" class="word-list__plural">
                {{ word.plural }}
              </span>
              <span v-else class="word-list__placeholder">—</span>
            </td>

            <!-- Phonétique -->
            <td class="word-list__cell word-list__cell--phonetic">
              <span v-if="word.phonetic" class="word-list__phonetic">
                {{ word.phonetic }}
              </span>
              <span v-else class="word-list__placeholder">—</span>
            </td>

            <!-- Français -->
            <td class="word-list__cell">
              <span class="word-list__translation">
                {{ truncateText(word.translation_fr, 80) || "—" }}
              </span>
            </td>

            <!-- Anglais -->
            <td class="word-list__cell">
              <span class="word-list__translation">
                {{ truncateText(word.translation_en, 80) || "—" }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="store.totalPages > 1"
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
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import Pagination from "@/components/Pagination.vue";
import { useWordStore } from "~/stores/wordStore";

const router = useRouter();
const store = useWordStore();
const searchLocal = ref("");

// Liste filtrée en fonction de la recherche
const filteredWords = computed(() => {
  const q = searchLocal.value.trim().toLowerCase();
  if (!q) return store.items;

  return store.items.filter((word) => {
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


const goToDetails = (slug) => {
  if (!slug) {
    console.error("Erreur : slug manquant pour la redirection.");
    return;
  }
  router.push(`/details/word/${slug}`);
};

const truncateText = (text, limit = 80) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "…" : text;
};
// Pagination appliquée à la liste filtrée
const paginatedFilteredWords = computed(() => {
  const start = (store.page - 1) * store.pageSize;
  return filteredWords.value.slice(start, start + store.pageSize);
});

// Nombre de pages sur la liste filtrée
const totalFilteredPages = computed(() => {
  if (!filteredWords.value.length) return 1;
  return Math.ceil(filteredWords.value.length / store.pageSize);
});

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
  gap: 0.5rem;
}

.word-list__title {
  font-size: 1.35rem;
  font-weight: 650;
  color: var(--text-default, #111827);
}

.word-list__subtitle {
  font-size: 0.98rem;
  /* ✅ contraste renforcé */
  color: #ecedee;
  max-width: 46rem;
}

.word-list__count {
  margin-left: auto;
  font-size: 0.9rem;
  color: var(--muted-text, #c9d0d9);
}

/* États */
.word-list__status,
.word-list__empty {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: #eef2ff;
  border: 1px solid rgba(79, 70, 229, 0.4);
  font-size: 0.95rem;
  color: #111827;
}

.word-list__error {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: #fef2f2;
  border: 1px solid rgba(248, 113, 113, 0.7);
  font-size: 0.95rem;
  color: #991b1b;
}

/* Table */
.word-list__table-wrapper {
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: #ffffff; /* fond clair */
  overflow: hidden;
}

.word-list__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.word-list__caption {
  text-align: left;
  padding: 0.7rem 1rem;
  font-size: 0.82rem;
  color: var(--muted-text, #6b7280);
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
  background: #f9fafb;
}

.word-list__table thead {
  background: #f3f4f6;
}

.word-list__table th {
  padding: 0.6rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--muted-text, #374151);
  border-bottom: 1px solid rgba(148, 163, 184, 0.4);
}

/* Lignes + cellules */
.word-list__cell {
  padding: 0.55rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  vertical-align: middle;
  color: var(--text-default, #111827);
  font-size: 0.95rem;
}

.word-list__row {
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.08s ease;
}

.word-list__row:hover {
  background-color: rgba(37, 99, 235, 0.04);
  transform: translateY(-1px);
}

/* Colonnes spécifiques + code couleur */
.word-list__cell--singular {
  font-weight: 600;
}

/* Mot (colonne 1) → bleu primaire */
.word-list__cell--singular .word-list__singular {
  color: var(--primary, #0d6efd);
}

/* Pluriel (colonne 2) → violet doux */
.word-list__cell--plural {
  font-weight: 600;

  color: #08439c;
}

/* Phonétique (colonne 3) → monospace + bleu gris */
.word-list__cell--phonetic {
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  font-size: 0.9rem;
   color: #383839;

}

.word-list__phonetic {
  white-space: nowrap;
}

/* Placeholder */
.word-list__placeholder {
  color: #9ca3af;
}

/* Traductions : FR = vert, EN = ambré */
.word-list__translation {
  color: #111827;
}

/* 4ᵉ colonne (Français) */
.word-list__table tbody td:nth-child(4) .word-list__translation {
  color: #047857; /* vert profond */
}

/* 5ᵉ colonne (Anglais) */
.word-list__table tbody td:nth-child(5) .word-list__translation {
  color: #b45309; /* amber / orange discret */
}

/* Pagination */
.word-list__pagination {
  margin-top: 1rem;
}

/* Responsive simple (on garde le tableau mais plus compact) */
@media (max-width: 640px) {
  .word-list__table {
    font-size: 0.9rem;
  }

  .word-list__table th,
  .word-list__cell {
    padding: 0.45rem 0.6rem;
  }
}
/* Barre de recherche (cohérente avec ExpressionList) */
.word-list__toolbar {
  display: flex;
  justify-content: flex-end;
}

.word-list__search {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.word-list__search-label {
  font-size: 0.78rem;
  color: #6b7280;
}

.word-list__search-input {
  min-width: 230px;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .word-list__toolbar {
    justify-content: stretch;
  }

  .word-list__search-input {
    width: 100%;
    min-width: 0;
  }
}

</style>
