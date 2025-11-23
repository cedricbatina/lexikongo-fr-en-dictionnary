<template>
  <section
    class="container-fluid word-list p-2"
    aria-labelledby="word-list-heading"
  >
  <header class="word-list__header">
  <div>
   <h1 id="word-list-heading" class="word-list__title">
  {{ t('words.list.title') }} {{ t('words.cards.titleSuffix') }}
</h1>

    <p class="word-list__subtitle">
      {{ t('words.list.subtitle') }}
    </p>
  </div>

  <p
    v-if="store.items && store.items.length"
    class="word-list__count"
  >
    {{ t('words.list.count', store.items.length) }}
  </p>
</header>


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

  <NuxtLink
    to="/words"
    class="word-list__view-link"
    :aria-label="t('words.cards.viewTableAria')"
  >
    <i class="fas fa-table" aria-hidden="true"></i>
    <span>{{ t('words.cards.viewTable') }}</span>
  </NuxtLink>
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

    <!-- Résultats -->
    <ul v-else class="word-list__grid">
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
              <span v-if="item.plural" class="word-card__plural">
                · {{ item.plural }}
              </span>
            </h3>
            <p v-if="item.phonetic" class="word-card__phonetic">
              [{{ item.phonetic }}]
            </p>
          </header>

          <dl class="word-card__body">
            <div class="word-card__row">
              <dt>{{ t('words.list.column.fr') }}</dt>
              <dd>{{ truncateText(item.translation_fr, 80) }}</dd>
            </div>
            <div class="word-card__row">
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

const router = useRouter();
const store = useWordStore();
const { t } = useI18n();

const searchLocal = ref('');

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

// reset la pagination quand on modifie la recherche
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
  gap: 0.6rem;
}

.word-list__title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-default, #111827); /* ✅ thème-friendly */
}

.word-list__subtitle {
  font-size: 0.95rem;
  color: var(--text-muted, #6b7280); /* ✅ comme WordList */
  max-width: 40rem;
}

.word-list__header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.word-list__count {
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

/* États */
.word-list__status,
.word-list__error,
.word-list__empty {
  font-size: 0.95rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
}

.word-list__status {
  background: rgba(13, 110, 253, 0.08);
  color: var(--primary, #0d6efd);
}

.word-list__error {
  background: rgba(220, 53, 69, 0.08);
  color: #fecaca;
}

.word-list__empty {
  background: rgba(108, 117, 125, 0.06);
  color: var(--text-muted, #e5e7eb);
}

/* Grid de cartes */
.word-list__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .word-list__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

@media (min-width: 992px) {
  .word-list__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.word-card {
  margin: 0;
}

.word-card__inner {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: var(--surface-elevated, #ffffff); /* ✅ thème */
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

.word-card__inner:hover,
.word-card__inner:focus-visible {
  outline: none;
  border-color: var(--primary, #0d6efd);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  transform: translateY(-1px);
}

/* Contenu de la carte */
.word-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.word-card__title {
  font-size: 1.05rem;
  font-weight: 600;
}

.word-card__singular {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary, #0d6efd);
}

.word-card__plural {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary); /* ✅ même couleur que le singulier, thème-friendly */
}

.word-card__phonetic {
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  font-size: 0.9rem;
  color: var(--text-default, #111827);
  white-space: nowrap;
}

.word-card__body {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.word-card__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 0.4rem;
  font-size: 0.9rem;
}

.word-card__row dt {
  font-weight: 600;
  color: var(--text-muted, #6c757d);
}

.word-card__row dd {
  margin: 0;
  color: var(--text-default, #111827);
}
/* Traductions : même code couleur que le tableau (FR / EN) */
.word-card__row:nth-child(1) dd {
  color: #047857; /* Français */
}

.word-card__row:nth-child(2) dd {
  color: #b45309; /* Anglais */
}

/* Footer de la carte */
.word-card__footer {
  margin-top: 0.35rem;
  display: flex;
  justify-content: flex-end;
}

.word-card__cta {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--primary, #0d6efd);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

/* Pagination */
.word-list__pagination {
  margin-top: 1.25rem;
  display: flex;
  justify-content: center;
}

/* Barre de recherche */
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
  color: var(--text-muted, #6b7280);
}

.word-list__search-input {
  width: 400px;
  max-width: 100%;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  font-size: 0.9rem;
  color: var(--text-default, #111827);
  background: var(--surface-elevated, #ffffff);
}

/* Bouton vue tableau */
.word-list__view-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  text-decoration: none;
  background: var(--surface-elevated, #ffffff);
  color: var(--primary, #0d6efd);
  white-space: nowrap;
}

.word-list__view-link:hover {
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary, #0d6efd);
}

/* Responsive */
@media (max-width: 640px) {
  .word-list__toolbar {
    justify-content: stretch;
  }

  .word-list__search-input {
    width: 100%;
    min-width: 0;
  }
}
.word-list__header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* important pour mettre le compteur à droite */
.word-list__count {
  margin-left: auto;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

/* toolbar identique à WordList */
.word-list__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

</style>
