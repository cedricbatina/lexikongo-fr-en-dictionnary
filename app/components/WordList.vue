<template>
  <section class="word-list" aria-labelledby="word-list-heading">
    <!-- Header aligné sur ExpressionList -->
    <header class="word-list__header">
      <div class="word-list__header-main">
        <!-- On laisse vide pour l’instant (comme expr-list),
             ou on remettra un petit texte plus tard si tu veux -->
      </div>

      <div
        v-if="itemsLength"
        class="word-list__meta"
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
    </header>

    <!-- Barre de recherche + switch cartes (comme ExpressionList) -->
    <div class="word-list__toolbar">
      <div class="word-list__search">
        <label class="word-list__search-label" for="word-search">
          {{ t('words.list.searchLabel') }}
        </label>
        <input
          id="word-search"
          v-model="searchLocal"
          type="search"
          class="word-list__search-input"
          :placeholder="t('words.list.searchPlaceholder')"
        />
      </div>

      <!-- Légende + bouton switch vue cartes -->
      <div class="word-view-mode">
        <p class="word-view-caption">
          {{ t('words.cards.viewTable') }}
        </p>

        <NuxtLink
          to="/wordlist-card"
          class="word-list__view-link"
          :aria-label="t('words.list.viewCardsAria')"
        >
          <i class="fas fa-th-large" aria-hidden="true"></i>
          <span>{{ t('words.list.viewCards') }}</span>
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

    <!-- Tableau des mots -->
    <div
      v-else
      class="word-list__table-wrapper"
    >
      <table
        class="word-list__table"
        role="table"
        aria-describedby="word-list-caption"
      >
        <!-- Largeurs de colonnes -->
        <colgroup>
          <col style="width: 14%;" />
          <col style="width: 15%;" />
          <col style="width: 16%;" />
          <col style="width: 27%;" />
          <col style="width: 27%;" />
        </colgroup>

        <caption
          id="word-list-caption"
          class="word-list__caption"
        >
          {{ t('words.list.caption') }}
        </caption>

        <thead>
          <tr>
            <th scope="col">{{ t('words.list.column.singular') }}</th>
            <th scope="col">{{ t('words.list.column.plural') }}</th>
            <th scope="col">{{ t('words.list.column.phonetic') }}</th>
            <th scope="col">{{ t('words.list.column.fr') }}</th>
            <th scope="col">{{ t('words.list.column.en') }}</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="word in paginatedWords"
            :key="word.slug || word.id"
            class="word-list__row"
            @click="goToDetails(word.slug)"
            role="button"
            :aria-label="t('words.list.rowAria', { word: word.singular || '—' })"
          >
            <!-- Mot -->
            <td class="word-list__cell word-list__cell--singular">
              <span class="word-list__singular">
                {{ word.singular || '—' }}
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
                {{ truncateText(word.translation_fr, 80) || '—' }}
              </span>
            </td>

            <!-- Anglais -->
            <td class="word-list__cell">
              <span class="word-list__translation">
                {{ truncateText(word.translation_en, 80) || '—' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Pagination from '@/components/Pagination.vue';
import { useWordStore } from '~/stores/wordStore';

const router = useRouter();
const store = useWordStore();
const { t } = useI18n();

const searchLocal = ref('');

// petit helper pour le compteur
const itemsLength = computed(() => (Array.isArray(store.items) ? store.items.length : 0));

// Liste filtrée en fonction de la recherche
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
    console.error('Erreur : slug manquant pour la redirection.');
    return;
  }
  router.push(`/details/word/${slug}`);
};

const truncateText = (text, limit = 80) => {
  if (!text) return '';
  return text.length > limit ? text.slice(0, limit) + '…' : text;
};

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
  color: var(--text-default); /* ✅ thème */
}

.word-list__subtitle {
  font-size: 0.98rem;
  color: var(--text-muted); /* ✅ thème */
  max-width: 46rem;
}

.word-list__count {
  margin-left: auto;
  font-size: 0.9rem;
  color: var(--text-muted); /* ✅ thème */
}

/* Barre de recherche (cohérente avec ExpressionList) */
.word-list__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.word-list__search {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.word-list__search-label {
  font-size: 0.78rem;
  color: var(--text-muted); /* ✅ thème */
}

.word-list__search-input {
  width: 400px;
  max-width: 100%;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle); /* ✅ thème */
  font-size: 0.9rem;
  color: var(--text-default);             /* ✅ thème */
  background: var(--surface-elevated);    /* ✅ thème */
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

/* Table */
.word-list__table-wrapper {
  border-radius: 0.9rem;
  border: 1px solid var(--border-subtle);     /* ✅ thème */
  background: var(--surface-elevated);        /* ✅ thème */
  overflow-x: auto;
  overflow-y: hidden;
}

.word-list__table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  font-size: 0.95rem;
  background: transparent;
}

.word-list__caption {
  text-align: center;
  padding: 0.7rem 1rem;
  font-size: 0.82rem;
  color: var(--text-muted);                    /* ✅ thème */
  border-bottom: 1px solid var(--border-subtle);
  background: var(--surface-default);          /* ✅ thème */
}

.word-list__table thead {
  background: rgba(148, 163, 184, 0.16);       /* neutre, OK light/dark */
}

.word-list__table th {
  padding: 0.6rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-muted);                    /* ✅ thème */
  border-bottom: 1px solid var(--border-subtle);
}

/* Lignes + cellules */
.word-list__cell {
  padding: 0.55rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  vertical-align: top;
  color: var(--text-default);                  /* ✅ thème */
  font-size: 0.95rem;
  word-break: break-word;
  white-space: normal;
}

.word-list__row {
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.08s ease;
}

.word-list__row:hover {
  background-color: rgba(37, 99, 235, 0.06);
  transform: translateY(-1px);
}

/* Colonnes spécifiques + code couleur */
.word-list__cell--singular {
  font-weight: 600;
}

.word-list__cell--singular .word-list__singular {
  color: var(--primary); /* ✅ thème */
}

.word-list__cell--plural {
  font-weight: 600;
  color: var(--primary); /* ✅ même logique que le singulier, thème-friendly */

}

.word-list__cell--phonetic {
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  font-size: 0.9rem;
  color: var(--text-default); /* ✅ au lieu de gris fixe */
}

.word-list__placeholder {
  color: #9ca3af;
}

.word-list__translation {
  color: var(--text-default);
}

/* 4ᵉ colonne (Français) */
.word-list__table tbody td:nth-child(4) .word-list__translation {
  color: #047857;
}

/* 5ᵉ colonne (Anglais) */
.word-list__table tbody td:nth-child(5) .word-list__translation {
  color: #b45309;
}

/* Pagination */
.word-list__pagination {
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 640px) {
  .word-list__table {
    font-size: 0.9rem;
  }

  .word-list__table th,
  .word-list__cell {
    padding: 0.45rem 0.6rem;
  }

  .word-list__toolbar {
    justify-content: stretch;
  }

  .word-list__search-input {
    width: 100%;
    min-width: 0;
  }
}

/* Bouton "vue cartes" */
.word-list__view-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);      /* ✅ thème */
  text-decoration: none;
  background: var(--surface-elevated);         /* ✅ thème */
  color: var(--primary);
  white-space: nowrap;
}

.word-list__view-link:hover {
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary);
}
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
.word-list__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.35rem;
}

.word-list__meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.word-list__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.4rem;
}

.word-view-mode {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
}

/* 🔁 Copie du style expr-count-chip mais version “word” */
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

/* Header au-dessus de la toolbar (aligné sur expr-list) */
.word-list__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.75rem;
  margin-top: 0.8rem;
}

.word-list__header-main {
  flex: 1 1 auto;
}

.word-list__meta {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
}

/* Chip compteur – même style que expr-count-chip */
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

/* Toolbar & vue mode (comme expr-list) */
.word-list__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.4rem;
}

.word-list__search {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.word-list__search-label {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.word-list__search-input {
  width: 400px;
  max-width: 100%;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  font-size: 0.9rem;
  color: var(--text-default);
  background: var(--surface-elevated);
}

/* Bloc vue actuelle + bouton switch */
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

.word-list__view-link {
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

.word-list__view-link:hover {
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary);
}

@media (max-width: 640px) {
  .word-list__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .word-list__search-input {
    width: 100%;
    min-width: 0;
  }

  .word-view-mode {
    align-items: flex-start;
  }

  .word-list__view-link {
    justify-content: center;
  }
}

</style>

