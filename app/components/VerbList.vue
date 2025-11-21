<template>
  <section class="verb-list" aria-labelledby="verb-list-heading">
    <header class="verb-list__header">
      <div>
        <h2 id="verb-list-heading" class="verb-list__title">
          Liste des verbes
        </h2>
        <p class="verb-list__subtitle">
          Explorez les verbes en Kikongo, avec la particule
          <span class="verb-list__ku-inline">ku</span> de l&apos;infinitif,
          leur phonétique et leurs traductions.
        </p>
      </div>

      <p v-if="store.items.length" class="verb-list__count">
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
        <caption id="verb-list-caption" class="verb-list__caption">
          Chaque ligne présente un verbe en Kikongo à l&apos;infinitif,
          sa transcription phonétique et ses traductions en français et en anglais.
        </caption>

        <thead>
          <tr>
            <th scope="col">Verbe</th>
            <th scope="col">Phonétique</th>
            <th scope="col">Français</th>
            <th scope="col">Anglais</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="verb in store.paginatedVerbs"
            :key="verb.slug"
            class="verb-list__row"
            @click="goToDetails(verb.slug)"
            role="button"
            :aria-label="`Voir la fiche du verbe ku ${verb.singular}`"
          >
            <td class="verb-list__cell verb-list__cell--verb">
              <span class="verb-list__ku">ku</span>
              <span class="verb-list__infinitive">
                {{ verb.singular }}
              </span>
            </td>

            <td class="verb-list__cell verb-list__cell--phonetic">
              <span v-if="verb.phonetic" class="verb-list__phonetic">
                {{ verb.phonetic }}
              </span>
              <span v-else class="verb-list__placeholder">—</span>
            </td>

            <td class="verb-list__cell">
              <span class="verb-list__translation">
                {{ truncateText(verb.translation_fr, 80) || "—" }}
              </span>
            </td>

            <td class="verb-list__cell">
              <span class="verb-list__translation">
                {{ truncateText(verb.translation_en, 80) || "—" }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
    console.error("Erreur : slug manquant pour la redirection.");
    return;
  }
  router.push(`/details/verb/${slug}`);
};

const truncateText = (text, limit = 80) => {
  if (!text) return "";
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
  gap: 0.5rem;
}

.verb-list__title {
  font-size: 1.35rem;
  font-weight: 650;
  color: var(--text-default, #111827);
}

.verb-list__subtitle {
  font-size: 0.98rem;
  /* ✅ contraste renforcé */
  color: #1f2937;
  max-width: 46rem;
}

.verb-list__ku-inline {
  font-family: inherit;
  font-weight: 600;
  color: var(--primary, #0d6efd);
}

.verb-list__count {
  margin-left: auto;
  font-size: 0.9rem;
  color: var(--muted-text, #4b5563);
}

/* États */
.verb-list__status,
.verb-list__empty {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: #eef2ff;
  border: 1px solid rgba(79, 70, 229, 0.4);
  font-size: 0.95rem;
  color: #111827;
}

.verb-list__error {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: #fef2f2;
  border: 1px solid rgba(248, 113, 113, 0.7);
  font-size: 0.95rem;
  color: #991b1b;
}

/* Table */
.verb-list__table-wrapper {
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: #ffffff;
  overflow: hidden;
}

.verb-list__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.verb-list__caption {
  text-align: left;
  padding: 0.7rem 1rem;
  font-size: 0.82rem;
  color: var(--muted-text, #6b7280);
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
  background: #f9fafb;
}

.verb-list__table thead {
  background: #f3f4f6;
}

.verb-list__table th {
  padding: 0.6rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--muted-text, #374151);
  border-bottom: 1px solid rgba(148, 163, 184, 0.4);
}

/* Lignes + cellules */
.verb-list__cell {
  padding: 0.55rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  vertical-align: middle;
  color: var(--text-default, #111827);
  font-size: 0.95rem;
}

.verb-list__row {
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.08s ease;
}

.verb-list__row:hover {
  background-color: rgba(37, 99, 235, 0.04);
  transform: translateY(-1px);
}

/* Verbe + "ku" */
.verb-list__cell--verb {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

/* "ku" infinitif → bleu primaire */
.verb-list__ku {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: lowercase;
 
}

/* infinitif → bleu légèrement différent pour bien se détacher */
.verb-list__infinitive {
  font-weight: 600;
  color: #1d4ed8;
}

/* Phonétique → monospace + bleu-gris */
.verb-list__cell--phonetic {
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  font-size: 0.9rem;
  color: #383839;
}

.verb-list__phonetic {
  white-space: nowrap;
}

/* Placeholder */
.verb-list__placeholder {
  color: #9ca3af;
}

/* Traductions : FR = vert, EN = ambré */
.verb-list__translation {
  color: #111827;
}

/* 3ᵉ colonne (Français) */
.verb-list__table tbody td:nth-child(3) .verb-list__translation {
  color: #047857;
}

/* 4ᵉ colonne (Anglais) */
.verb-list__table tbody td:nth-child(4) .verb-list__translation {
  color: #b45309;
}

/* Pagination */
.verb-list__pagination {
  margin-top: 1rem;
}

/* Responsive : tableau plus compact */
@media (max-width: 640px) {
  .verb-list__table {
    font-size: 0.9rem;
  }

  .verb-list__table th,
  .verb-list__cell {
    padding: 0.45rem 0.6rem;
  }
}
</style>
