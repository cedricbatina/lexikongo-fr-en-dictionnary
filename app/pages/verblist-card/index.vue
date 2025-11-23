<template>
  <section class="verb-list" aria-labelledby="verb-list-heading">
    <!-- Header -->
    <header class="verb-list__header">
      <div>
        <h2 id="verb-list-heading" class="verb-list__title">
          {{ t('verbs.list.title') }} {{ t('verbs.cards.titleSuffix') }}
        </h2>
        <p class="verb-list__subtitle">
          {{ t('verbs.list.subtitle.prefix') }}
          <span class="verb-list__ku-inline">ku</span>
          {{ t('verbs.list.subtitle.suffix') }}
        </p>
      </div>

      <div class="verb-list__header-actions">
        
        <p v-if="itemsLength" class="verb-list__count">
          {{ t('verbs.list.count', itemsLength) }}
        </p>

        <NuxtLink
          to="/verbs"
          class="verb-list__view-link"
          :aria-label="t('verbs.cards.viewTableAria')"
        >
          <i class="fas fa-table" aria-hidden="true"></i>
          <span>{{ t('verbs.cards.viewTable') }}</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Barre de recherche -->
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

    <!-- Résultats -->
    <ul v-else class="verb-list__grid">
      <li
        v-for="item in paginatedVerbs"
        :key="item.slug || item.id"
        class="verb-card"
      >
        <button
          type="button"
          class="verb-card__inner"
          @click="goToDetails(item.slug)"
          :aria-label="t('verbs.list.rowAria', { verb: item.singular || '—' })"
        >
          <header class="verb-card__header">
            <h3 class="verb-card__title">
              <span class="verb-card__ku">ku</span>
              <span class="verb-card__verb">
                {{ item.singular || '—' }}
              </span>
            </h3>
            <p v-if="item.phonetic" class="verb-card__phonetic">
              [{{ item.phonetic }}]
            </p>
          </header>

          <dl class="verb-card__body">
            <div class="verb-card__row">
              <dt>{{ t('verbs.list.column.fr') }}</dt>
              <dd>{{ truncateText(item.translation_fr, 80) }}</dd>
            </div>
            <div class="verb-card__row">
              <dt>{{ t('verbs.list.column.en') }}</dt>
              <dd>{{ truncateText(item.translation_en, 80) }}</dd>
            </div>
          </dl>

        <footer class="verb-card__footer">
  <span class="verb-card__cta">
    {{ t('verbs.cards.viewDetails') }}
    <i class="fas fa-arrow-right" aria-hidden="true"></i>
  </span>
</footer>

        </button>
      </li>
    </ul>

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
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Pagination from '@/components/Pagination.vue';
import { useVerbStore } from '~/stores/verbStore';

const router = useRouter();
const store = useVerbStore();
const { t } = useI18n();

const searchLocal = ref('');

// petit helper pour le compteur
const itemsLength = computed(() =>
  Array.isArray(store.items) ? store.items.length : 0
);

// liste filtrée selon la recherche
const filteredVerbs = computed(() => {
  const q = searchLocal.value.trim().toLowerCase();
  const items = Array.isArray(store.items) ? store.items : [];

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

// reset pagination quand on tape dans la recherche
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
    console.error('Erreur : Slug manquant pour la redirection.');
    return;
  }
  router.push(`/details/verb/${slug}`);
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
.verb-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Header */
.verb-list__header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.verb-list__title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-default); /* ✅ thème */
}

.verb-list__subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);    /* ✅ thème */
  max-width: 40rem;
}

.verb-list__ku-inline {
  font-weight: 600;
  color: var(--primary);       /* ✅ thème */
}

.verb-list__header-actions {
  margin-left: auto;          /* ⬅️ pousse le bloc complètement à droite */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.verb-list__count {
  font-size: 0.9rem;
  color: var(--text-muted);    /* ✅ thème */
}

/* Bouton vers vue tableau */
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
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.15s ease;
}

.verb-list__view-link i {
  font-size: 0.85rem;
}

.verb-list__view-link:hover,
.verb-list__view-link:focus-visible {
  outline: none;
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
  transform: translateY(-1px);
}

/* États */
.verb-list__status,
.verb-list__error,
.verb-list__empty {
  font-size: 0.95rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
}

.verb-list__status {
  background: rgba(13, 110, 253, 0.08);
  color: var(--primary);
}

.verb-list__error {
  background: rgba(220, 53, 69, 0.08);
  color: #b91c1c;
}

.verb-list__empty {
  background: rgba(148, 163, 184, 0.12);
  color: var(--text-muted);
}

/* Grid de cartes */
.verb-list__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .verb-list__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 992px) {
  .verb-list__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Carte verbe */
.verb-card {
  margin: 0;
}

.verb-card__inner {
  width: 100%;
  text-align: left;
  border-radius: 1rem;
  border: 1px solid var(--border-subtle);
  background: var(--surface-elevated); /* ✅ thème */
  padding: 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  cursor: pointer;
  transition:
    box-shadow 0.16s ease,
    transform 0.12s ease,
    border-color 0.16s ease,
    background 0.16s ease;
}

.verb-card__inner:hover,
.verb-card__inner:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
  transform: translateY(-1px);
}

/* Header carte */
.verb-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.verb-card__title {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-default);
}

.verb-card__ku {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary);
}

.verb-card__verb {
  font-size: 1.05rem;
  color: var(--text-default);
}

.verb-card__phonetic {
  font-size: 0.9rem;
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  color: var(--text-muted);
}

/* Corps carte */
.verb-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin: 0;
}

.verb-card__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.3rem 0.5rem;
  align-items: baseline;
  font-size: 0.9rem;
}

.verb-card__row dt {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.verb-card__row dd {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-default);
}

/* Footer carte */
.verb-card__footer {
  margin-top: 0.25rem;
  display: flex;
  justify-content: flex-end;
}

.verb-card__cta {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.verb-card__cta i {
  font-size: 0.8rem;
}

/* Barre de recherche */
.verb-list__toolbar {
  display: flex;
  justify-content: flex-start;  /* ✅ comme WordListCard */
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
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  font-size: 0.9rem;
  color: var(--text-default);
  background: var(--surface-elevated);
}

/* Pagination */
.verb-list__pagination {
  margin-top: 0.75rem;
  display: flex;
  justify-content: center;
}

/* Responsive */
@media (max-width: 640px) {
  .verb-list__search-input {
    width: 100%;
    min-width: 0;
  }
}

.verb-cards__header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-end;
}

.verb-cards__header-actions {
  margin-left: auto;          /* ⬅️ pousse le bloc complètement à droite */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.verb-cards__count {
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

.verb-cards__view-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148,163,184,0.8));
  text-decoration: none;
  background: var(--surface-elevated, #ffffff);
  color: var(--primary, #0d6efd);
  white-space: nowrap;
}

.verb-cards__view-link:hover {
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary, #0d6efd);
}

</style>
