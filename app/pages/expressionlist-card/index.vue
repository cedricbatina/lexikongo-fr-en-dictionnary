<template>
  <section class="expr-cards" aria-labelledby="expr-cards-heading">
  <!--  <header class="expr-cards__header">
      <div>
        <h1 id="expr-cards-heading" class="expr-cards__title">
          {{ t('expressions.list.title') }} {{ t('expressions.cards.titleSuffix') }}
        </h1>
        <p class="expr-cards__subtitle">
          {{ t('expressions.cards.subtitle') }}
        </p>
      </div>

      <div class="expr-cards__header-actions">
        <p
          v-if="store.filteredItems.length"
          class="expr-cards__count"
        >
          {{ t('expressions.cards.count', store.filteredItems.length) }}
        </p>

        <NuxtLink
          to="/expressions"
          class="expr-cards__link-back"
          :aria-label="t('expressions.cards.viewTableAria')"
        >
          <i class="fas fa-table" aria-hidden="true"></i>
          <span>{{ t('expressions.cards.viewTable') }}</span>
        </NuxtLink>
      </div>
    </header>-->
 <!-- Hero réutilisable -->
    <LkPageHero
      id="expressions-page-title"
      :eyebrow="t('expressions.page.eyebrow')"
      :title="t('expressions.page.title')"
      :description="t('expressions.page.subtitle')"
        :show-last-expressions="true"

      :side-aria-label="t('pageHero.sideAria')"
    >
      <!-- Boutons d’action principaux -->
      <template #actions>
        <NuxtLink
          to="/search"
          class="lk-hero-btn lk-hero-btn--primary"
        >
          <i class="fas fa-search" aria-hidden="true"></i>
          <span>{{ t('expressions.page.ctaSearch') }}</span>
        </NuxtLink>

        <NuxtLink
          to="/documentation/for-contributors"
          class="lk-hero-btn lk-hero-btn--ghost"
        >
          <i class="fas fa-hands-helping" aria-hidden="true"></i>
          <span>{{ t('expressions.page.ctaContribute') }}</span>
        </NuxtLink>
      </template>

      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-language" aria-hidden="true"></i>
          <span>{{ t('expressions.page.metaLanguages') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : actions bar + raccourci recherche -->
      <template #side>
        <div class="lk-hero-side">
          <LkActionsBar />

     
        </div>
      </template>
    </LkPageHero>
 <!-- 🔽 Compteur premium au-dessus de la toolbar -->
<div
  v-if="store.filteredItems.length"
  class="expr-cards__meta"
>
  <p
    class="expr-count-chip"
    aria-live="polite"
  >
    <span
      class="expr-count-chip__dot"
      aria-hidden="true"
    />
    <span class="expr-count-chip__text">
      {{ t('expressions.cards.count', store.filteredItems.length) }}
    </span>
  </p>
</div>

 
    <!-- Filtres simples -->
    <!--
      <div class="expr-cards__header-actions">
        <p
          v-if="store.filteredItems.length"
          class="expr-cards__count"
        >
          {{ t('expressions.cards.count', store.filteredItems.length) }}
        </p>

        <NuxtLink
          to="/expressions"
          class="expr-cards__link-back"
          :aria-label="t('expressions.cards.viewTableAria')"
        >
          <i class="fas fa-table" aria-hidden="true"></i>
          <span>{{ t('expressions.cards.viewTable') }}</span>
        </NuxtLink>
      </div>-->
       <!-- Barre filtres + recherche + switch tableau -->
    <div class="expr-cards__toolbar">
      <div class="expr-cards__filters">
        <button
          type="button"
          class="expr-cards__filter-btn"
          :class="{ 'expr-cards__filter-btn--active': store.type === 'all' }"
          @click="store.setType('all')"
        >
          {{ t('expressions.list.filterAll') }}
        </button>
        <button
          type="button"
          class="expr-cards__filter-btn"
          :class="{ 'expr-cards__filter-btn--active': store.type === 'word' }"
          @click="store.setType('word')"
        >
          {{ t('expressions.list.filterWords') }}
        </button>
        <button
          type="button"
          class="expr-cards__filter-btn"
          :class="{ 'expr-cards__filter-btn--active': store.type === 'verb' }"
          @click="store.setType('verb')"
        >
          {{ t('expressions.list.filterVerbs') }}
        </button>
      </div>
<div class="expr-cards__toolbar-right">
  <div class="expr-cards__search">
    <label class="expr-cards__search-label" for="expr-cards-search">
      {{ t('expressions.list.searchLabel') }}
    </label>
    <input
      id="expr-cards-search"
      v-model="searchLocal"
      type="search"
      class="expr-cards__search-input"
      :placeholder="t('expressions.list.searchPlaceholder')"
      @input="onSearchInput"
    />
  </div>

 
  <div class="expr-view-mode">
    <!-- Légende : vue actuelle = cartes -->
    <p class="expr-view-caption">
      {{ t('expressions.list.viewCards') }}
    </p>

    <NuxtLink
      to="/expressions"
      class="expr-cards__link-back"
      :aria-label="t('expressions.cards.viewTableAria')"
    >
      <i class="fas fa-table" aria-hidden="true"></i>
      <span>{{ t('expressions.cards.viewTable') }}</span>
    </NuxtLink>
  </div>
</div>


    </div>


    <!-- État : chargement -->
    <div
      v-if="store.isLoading"
      class="expr-cards__status"
      role="status"
      aria-live="polite"
    >
      {{ t('expressions.list.loading') }}
    </div>

    <!-- État : erreur -->
    <p
      v-else-if="store.error"
      class="expr-cards__error"
      role="alert"
    >
      {{ store.error }}
    </p>

    <!-- État : vide -->
    <p
      v-else-if="!store.paginatedExpressions.length"
      class="expr-cards__empty"
      aria-live="polite"
    >
      {{ t('expressions.list.empty') }}
    </p>

    <!-- Résultats -->
    <ul v-else class="expr-cards__grid">
      <li
        v-for="expr in store.paginatedExpressions"
        :key="expr.slug || expr.id"
        class="expr-card"
      >
        <button
          type="button"
          class="expr-card__inner"
          @click="goToDetails(expr)"
          :aria-label="ariaLabel(expr)"
        >
          <header class="expr-card__header">
            <div class="expr-card__type">
              <span
                class="expr-card__badge"
                :class="{
                  'expr-card__badge--word': expr.type === 'word',
                  'expr-card__badge--verb': expr.type === 'verb',
                }"
              >
                {{
                  expr.type === 'verb'
                    ? t('expressions.list.badge.verb')
                    : t('expressions.list.badge.word')
                }}
              </span>
            </div>

            <h3 class="expr-card__title">
              <template v-if="expr.type === 'verb'">
                <span class="expr-card__ku">ku</span>
                <span class="expr-card__main expr-card__main--verb">
                  {{ expr.singular || '—' }}
                </span>
              </template>
              <template v-else>
                <span class="expr-card__main expr-card__main--word">
                  {{ expr.singular || '—' }}
                </span>
                <span
                  v-if="expr.plural"
                  class="expr-card__secondary"
                >
                  – {{ expr.plural }}
                </span>
              </template>
            </h3>

            <p v-if="expr.phonetic" class="expr-card__phonetic">
              [{{ expr.phonetic }}]
            </p>
          </header>
<dl class="expr-card__body">
  <div class="expr-card__row">
    <dt>{{ t('common.lang.fr') }}</dt>
    <dd><span class="translation-fr">{{ truncateText(expr.translation_fr, 110) || "—" }}</span></dd>
  </div>
  <div class="expr-card__row">
    <dt>{{ t('common.lang.en') }}</dt>
    <dd><span class="translation-en">{{ truncateText(expr.translation_en, 110) || "—" }}</span></dd>
  </div>
</dl>




          <footer class="expr-card__footer">
            <span class="expr-card__cta">
              {{ t('expressions.cards.cta') }}
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </span>
          </footer>
        </button>
      </li>
    </ul>

    <!-- Pagination -->
    <div
      v-if="store.totalPages > 1"
      class="expr-cards__pagination"
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

// Navigation vers la fiche détail (mot / verbe)
const goToDetails = (expr) => {
  if (!expr.slug) {
    console.error("Slug manquant pour l'expression :", expr);
    return;
  }
  const type = expr.type === 'verb' ? 'verb' : 'word';
  router.push(`/details/${type}/${expr.slug}`);
};

const truncateText = (text, limit = 80) => {
  if (!text) return '—';
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

// Chargement initial (SSR-safe)
onMounted(() => {
  if (!store.items.length) {
    store.fetchAll();
  }
});
</script>

<style scoped>
.expr-cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Header */
.expr-cards__header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.expr-cards__title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-default);
}

.expr-cards__subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  max-width: 44rem;
}

.expr-cards__subtitle strong {
  font-weight: 600;
}

.expr-cards__header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;

  /* 👉 pousse tout le bloc à droite dans le header */
  margin-left: auto;
  justify-content: flex-end;
}


.expr-cards__count {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.expr-cards__link-back {
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

.expr-cards__link-back:hover {
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary);
}

/* Toolbar */
.expr-cards__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.expr-cards__filters {
  display: inline-flex;
  gap: 0.4rem;
  padding: 0.15rem;
  border-radius: 999px;
  background: var(--surface-default);
  border: 1px solid var(--border-subtle);
}

.expr-cards__filter-btn {
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

.expr-cards__filter-btn--active {
  background: var(--primary);
  color: #ffffff;
  transform: translateY(-1px);
}

.expr-cards__search {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.expr-cards__search-label {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.expr-cards__search-input {
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
.expr-cards__status,
.expr-cards__empty,
.expr-cards__error {
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.95rem;
}

/* info (chargement) */
.expr-cards__status {
  background: rgba(13, 110, 253, 0.12);
  border: 1px solid rgba(13, 110, 253, 0.35);
  color: var(--primary);
}

/* vide */
.expr-cards__empty {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: var(--text-muted);
}

/* erreur */
.expr-cards__error {
  background: rgba(248, 113, 113, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.6);
  color: #b91c1c;
}

/* Grid des cartes */
.expr-cards__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .expr-cards__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .expr-cards__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Carte */
.expr-card {
  margin: 0;
}

.expr-card__inner {
  width: 100%;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: var(--surface-elevated);
  padding: 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  text-align: left;
  cursor: pointer;
  transition:
    box-shadow 0.16s ease,
    transform 0.12s ease,
    border-color 0.16s ease,
    background 0.16s ease;
}

.expr-card__inner:hover,
.expr-card__inner:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
  transform: translateY(-1px);
}

/* Header carte */
.expr-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.expr-card__type {
  display: flex;
  justify-content: flex-start;
}

.expr-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
}

.expr-card__badge--word {
  background: #ecfdf5;
  color: #047857;
}

.expr-card__badge--verb {
  background: #eff6ff;
  color: #1d5ed8;
}

.expr-card__title {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-default);
}

.expr-card__ku {
  font-size: 0.85rem;
  font-weight: 500;
  color: #8a8a8b;

}

.expr-card__main {
  font-weight: 600;
}

.expr-card__main--word {
  color: var(--primary);
}

.expr-card__main--verb {
   color: var(--primary);
}

.expr-card__secondary {

  color: var(--primary);
}

.expr-card__phonetic {
  font-size: 0.88rem;
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  color: var(--text-muted);
}

/* Corps carte */
.expr-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 0;
}

.expr-card__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.3rem 0.5rem;
}

.expr-card__row dt {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.expr-card__row dd {
  margin: 0;
  font-size: 0.9rem;
}

.expr-card__translation {
  color: var(--text-default);
  white-space: normal;
  word-break: break-word;
}

.translation-fr {
  color: #047857;
}

.translation-en {
  color: #b45309;
}

/* Footer */
.expr-card__footer {
  margin-top: 0.25rem;
  display: flex;
  justify-content: flex-end;
}

.expr-card__cta {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.expr-card__cta i {
  font-size: 0.8rem;
}

/* Pagination */
.expr-cards__pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
/* Couleurs des traductions (même logique que WordList / VerbList) */
.expr-card__row--fr dd {
  color: #047857;   /* vert FR */
}

.expr-card__row--en dd {
  color: #b45309;   /* ambré EN */
}

/* Responsive */
@media (max-width: 640px) {
  .expr-cards__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .expr-cards__search-input {
    width: 100%;
    min-width: 0;
  }
}
.expr-cards__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.expr-cards__toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* 🔽 nouveau : stack vertical (compteur au-dessus du lien) */
.expr-cards__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.expr-cards__count {
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

.expr-cards__link-back {
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

.expr-cards__link-back:hover {
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary, #0d6efd);
}


/* Boutons d’action du hero (comme sur la page expressions liste) */
.lk-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.05rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease,
    border-color 0.15s ease;
}

.lk-hero-btn--primary {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 14px 30px rgba(13, 110, 253, 0.3);
}

.lk-hero-btn--ghost {
  background: var(--surface-elevated, #ffffff);
  color: var(--color-text);
  border-color: var(--border-subtle);
}

.lk-hero-btn:hover,
.lk-hero-btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.14);
}

.lk-hero-btn--primary:hover,
.lk-hero-btn--primary:focus-visible {
  background: var(--primary-hover, #0b5ed7);
}

.lk-hero-btn--ghost:hover,
.lk-hero-btn--ghost:focus-visible {
  background: rgba(148, 163, 184, 0.18);
}

/* Toolbar (filtres + recherche + switch tableau) */
.expr-cards__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.75rem;
  margin: 1.2rem 0 0.8rem;
}

/* Groupe filtres */
.expr-cards__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.expr-cards__filter-btn {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
  padding: 0.32rem 0.9rem;
  font-size: 0.86rem;
  font-weight: 500;
  background: var(--surface-default, #f9fafb);
  color: var(--text-default, #111827);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    transform 0.08s ease;
}

.expr-cards__filter-btn--active {
  background: var(--primary, #2563eb);
  border-color: var(--primary, #2563eb);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.3);
}

.expr-cards__filter-btn:hover,
.expr-cards__filter-btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
}

/* Colonne droite : recherche + lien "Vue tableau" */
.expr-cards__toolbar-right {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.6rem;
  margin-left: auto;
}

.expr-cards__search {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 220px;
}

.expr-cards__search-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #6b7280);
}

.expr-cards__search-input {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.85));
  padding: 0.4rem 0.9rem;
  font-size: 0.9rem;
  background: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
}

/* Lien switch "Vue tableau" (même style que vue cartes) */
.expr-cards__link-back {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  padding: 0.4rem 0.85rem;
  font-size: 0.86rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid rgba(148, 163, 184, 0.8);
  background: var(--surface-default, #f9fafb);
  color: var(--text-default, #111827);
  white-space: nowrap;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease,
    border-color 0.15s ease;
}

.expr-cards__link-back i {
  font-size: 0.9rem;
}

.expr-cards__link-back:hover,
.expr-cards__link-back:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
  border-color: var(--primary, #2563eb);
}

/* Petit bloc meta juste au-dessus (compteur) */
.expr-cards__meta {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.35rem;
}

.expr-cards__count {
  font-size: 0.86rem;
  color: var(--text-muted, #6b7280);
}

/* Responsive */
@media (max-width: 720px) {
  .expr-cards__toolbar {
    align-items: stretch;
  }

  .expr-cards__toolbar-right {
    width: 100%;
    justify-content: space-between;
  }

  .expr-cards__search {
    flex: 1 1 auto;
  }
}
/* Meta au-dessus de la toolbar (même logique que la vue tableau) */
.expr-cards__meta {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.8rem;
}

/* On réutilise le même look de chip que dans expressions/index.vue */
.expr-count-chip {
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

.expr-count-chip__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, #22c55e, #16a34a);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18);
}

.expr-count-chip__text {
  white-space: nowrap;
}
.expr-view-mode {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
}

.expr-view-caption {
  margin: 0;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #6b7280);
}

</style>
