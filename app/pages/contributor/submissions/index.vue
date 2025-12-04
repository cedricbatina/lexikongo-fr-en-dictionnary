<template>
  <main
    class="lk-contrib-page"
    aria-labelledby="contrib-submissions-title"
  >
    <!-- HERO -->
    <LkPageHero
      id="contrib-submissions-title"
      :eyebrow="t('contributor.submissions.eyebrow')"
      :title="t('contributor.submissions.title')"
      :description="t('contributor.submissions.subtitle')"
      :side-aria-label="t('contributor.submissions.meta.label')"
      :show-last-expressions="true"
    >
      <!-- Meta sous le titre -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-history" aria-hidden="true" />
          <span>{{ t('contributor.submissions.meta.label') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : actions contributeur -->
      <template #side>
        <div class="lk-contrib-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <!-- Carte principale -->
    <section
      class="lk-contrib-card"
      aria-describedby="submissions-help"
    >
      <header class="lk-contrib-card__header">
        <p
          id="submissions-help"
          class="lk-contrib-help"
        >
          {{ t('contributor.submissions.help') }}
        </p>
        <p class="lk-contrib-hint">
          {{ t('contributor.submissions.reviewNotice') }}
        </p>
      </header>

      <!-- Si pas connecté -->
      <div
        v-if="!currentUserId"
        class="lk-submissions-status lk-submissions-status--info"
      >
        <i class="fas fa-user-lock" aria-hidden="true" />
        <span>{{ t('contributor.submissions.mustBeLoggedIn') }}</span>
      </div>

      <!-- Contenu principal (connecté) -->
      <div
        v-else
        class="lk-submissions"
      >
        <!-- Toolbar filtres / type / recherche -->
        <div class="lk-submissions__toolbar">
          <!-- Filtres statut -->
          <div class="lk-submissions__filters">
            <span class="lk-submissions__filters-label">
              {{ t('contributor.submissions.filters.status') }}
            </span>

            <button
              type="button"
              class="lk-submissions-chip"
              :class="{ 'lk-submissions-chip--active': statusFilter === 'all' }"
              @click="statusFilter = 'all'"
            >
              {{ t('contributor.submissions.status.all') }}
            </button>

            <button
              type="button"
              class="lk-submissions-chip lk-submissions-chip--pending"
              :class="{ 'lk-submissions-chip--active': statusFilter === 'pending' }"
              @click="statusFilter = 'pending'"
            >
              {{ t('contributor.submissions.status.pending') }}
              <span
                v-if="counts.pending"
                class="lk-submissions-chip__count"
              >
                {{ counts.pending }}
              </span>
            </button>

            <button
              type="button"
              class="lk-submissions-chip lk-submissions-chip--approved"
              :class="{ 'lk-submissions-chip--active': statusFilter === 'approved' }"
              @click="statusFilter = 'approved'"
            >
              {{ t('contributor.submissions.status.approved') }}
              <span
                v-if="counts.approved"
                class="lk-submissions-chip__count"
              >
                {{ counts.approved }}
              </span>
            </button>

            <button
              type="button"
              class="lk-submissions-chip lk-submissions-chip--rejected"
              :class="{ 'lk-submissions-chip--active': statusFilter === 'rejected' }"
              @click="statusFilter = 'rejected'"
            >
              {{ t('contributor.submissions.status.rejected') }}
              <span
                v-if="counts.rejected"
                class="lk-submissions-chip__count"
              >
                {{ counts.rejected }}
              </span>
            </button>
          </div>

          <!-- Filtres type + recherche -->
          <div class="lk-submissions__toolbar-right">
            <!-- Type -->
            <div class="lk-submissions__filters lk-submissions__filters--type">
              <span class="lk-submissions__filters-label">
                {{ t('contributor.submissions.filters.type') }}
              </span>

              <button
                type="button"
                class="lk-submissions-pill"
                :class="{ 'lk-submissions-pill--active': typeFilter === 'all' }"
                @click="typeFilter = 'all'"
              >
                {{ t('contributor.submissions.types.all') }}
              </button>
              <button
                type="button"
                class="lk-submissions-pill"
                :class="{ 'lk-submissions-pill--active': typeFilter === 'word' }"
                @click="typeFilter = 'word'"
              >
                {{ t('contributor.submissions.types.word') }}
              </button>
              <button
                type="button"
                class="lk-submissions-pill"
                :class="{ 'lk-submissions-pill--active': typeFilter === 'verb' }"
                @click="typeFilter = 'verb'"
              >
                {{ t('contributor.submissions.types.verb') }}
              </button>
            </div>

            <!-- Recherche -->
            <div class="lk-submissions__search">
              <label
                class="lk-submissions__search-label"
                for="submissions-search"
              >
                {{ t('contributor.submissions.search.label') }}
              </label>
              <input
                id="submissions-search"
                v-model="search"
                type="search"
                class="lk-submissions__search-input"
                :placeholder="t('contributor.submissions.search.placeholder')"
              />
            </div>
          </div>
        </div>

        <!-- États de chargement / erreur -->
        <div
          v-if="pending"
          class="lk-submissions-status lk-submissions-status--info"
          role="status"
          aria-live="polite"
        >
          <i class="fas fa-circle-notch fa-spin" aria-hidden="true" />
          <span>{{ t('contributor.submissions.loading') }}</span>
        </div>

        <p
          v-else-if="errorMessage"
          class="lk-submissions-status lk-submissions-status--error"
          role="alert"
        >
          <i class="fas fa-exclamation-triangle" aria-hidden="true" />
          <span>{{ errorMessage }}</span>
        </p>

        <!-- Vide -->
        <p
          v-else-if="!filteredItems.length"
          class="lk-submissions-status lk-submissions-status--empty"
          aria-live="polite"
        >
          <i class="far fa-folder-open" aria-hidden="true" />
          <span>{{ t('contributor.submissions.empty') }}</span>
        </p>

        <!-- Liste des soumissions -->
        <section
          v-else
          aria-label="Liste des soumissions"
        >
          <!-- Compteur global (premium chip) -->
          <div class="lk-submissions-count">
            <p class="lk-submissions-count__chip">
              <span class="lk-submissions-count__dot" aria-hidden="true" />
              <span class="lk-submissions-count__text">
                {{ t('contributor.submissions.count', { total: filteredItems.length }) }}
              </span>
            </p>
          </div>

          <ul class="lk-submissions-list">
            <li
              v-for="item in paginatedItems"
              :key="item.id"
              class="lk-submissions-card"
            >
              <!-- Bandeau haut : type + statut + date -->
              <header class="lk-submissions-card__header">
                <div class="lk-submissions-card__badges">
                  <span
                    class="lk-submissions-badge"
                    :class="{
                      'lk-submissions-badge--word': item.kind === 'word',
                      'lk-submissions-badge--verb': item.kind === 'verb',
                    }"
                  >
                    <i
                      :class="item.kind === 'word' ? 'fas fa-font' : 'fas fa-wave-square'"
                      aria-hidden="true"
                    />
                    <span>
                      {{
                        item.kind === 'word'
                          ? t('contributor.submissions.badges.word')
                          : t('contributor.submissions.badges.verb')
                      }}
                    </span>
                  </span>

                  <span
                    class="lk-submissions-status-pill"
                    :class="`lk-submissions-status-pill--${item.status}`"
                  >
                    {{ statusLabel(item.status) }}
                  </span>
                </div>

                <p
                  v-if="item.dateFormatted"
                  class="lk-submissions-card__date"
                >
                  <span v-if="item.status === 'pending'">
                    {{ t('contributor.submissions.meta.createdAt') }}
                  </span>
                  <span v-else>
                    {{ t('contributor.submissions.meta.decidedAt') }}
                  </span>
                  <time :datetime="item.dateRaw">
                    {{ item.dateFormatted }}
                  </time>
                </p>
              </header>

              <!-- Corps : lexème + phonétique + traductions -->
              <div class="lk-submissions-card__body">
                <h3 class="lk-submissions-card__title">
                  <template v-if="item.kind === 'verb'">
                    <span class="lk-submissions-ku">ku</span>
                    <span class="lk-submissions-lemma">
                      {{ item.lemma || '—' }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="lk-submissions-lemma">
                      {{ item.lemma || '—' }}
                    </span>
                    <span
                      v-if="item.plural"
                      class="lk-submissions-lemma-plural"
                    >
                      · {{ item.plural }}
                    </span>
                  </template>
                </h3>

                <p
                  v-if="item.phonetic"
                  class="lk-submissions-phonetic"
                >
                  [{{ item.phonetic }}]
                </p>

                <dl class="lk-submissions-translations">
                  <div class="lk-submissions-translations__row">
                    <dt>{{ t('common.lang.fr') }}</dt>
                    <dd>
                      <span class="translation-fr">
                        {{ item.translation_fr || '—' }}
                      </span>
                    </dd>
                  </div>
                  <div class="lk-submissions-translations__row">
                    <dt>{{ t('common.lang.en') }}</dt>
                    <dd>
                      <span class="translation-en">
                        {{ item.translation_en || '—' }}
                      </span>
                    </dd>
                  </div>
                </dl>

                <!-- Raison admin pour rejet / commentaire -->
                <p
                  v-if="item.status !== 'pending' && item.reason"
                  class="lk-submissions-reason"
                >
                  <strong>
                    {{ t('contributor.submissions.meta.adminReason') }}
                  </strong>
                  <span> {{ item.reason }}</span>
                  <span v-if="item.admin">
                    &nbsp;— {{ t('contributor.submissions.meta.reviewedBy', { admin: item.admin }) }}
                  </span>
                </p>
              </div>

              <!-- Footer : classe + actions -->
              <footer class="lk-submissions-card__footer">
                <div class="lk-submissions-card__footer-left">
                  <span
                    v-if="item.kind === 'word' && item.nominalClass"
                    class="lk-submissions-chip-small"
                  >
                    <i class="fas fa-layer-group" aria-hidden="true" />
                    <span>{{ item.nominalClass }}</span>
                  </span>
                </div>

                <div class="lk-submissions-card__actions">
                  <!-- Pending : voir / modifier -->
                  <NuxtLink
                    v-if="item.status === 'pending' && item.slug"
                    :to="item.kind === 'word'
                      ? `/contributor/edit/pending-word/${item.slug}`
                      : `/contributor/edit/pending-verb/${item.slug}`"
                    class="lk-submissions-btn lk-submissions-btn--primary"
                  >
                    <i class="fas fa-edit" aria-hidden="true" />
                    <span>{{ t('contributor.submissions.actions.edit') }}</span>
                  </NuxtLink>

                  <!-- TODO : delete quand les API seront prêtes -->
                </div>
              </footer>
            </li>
          </ul>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="lk-submissions__pagination"
          >
            <Pagination
              :currentPage="page"
              :totalPages="totalPages"
              @pageChange="(p) => { page = p; }"
            />
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAsyncData, useSeoMeta } from '#imports';
import { useAuthStore } from '~/stores/authStore';
import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import Pagination from '@/components/Pagination.vue';

const { t, d } = useI18n();
const authStore = useAuthStore();

const currentUserId = computed(
  () => authStore.user?.id || authStore.user?.user_id || null,
);

// Filtres UI
const statusFilter = ref('all'); // all | pending | approved | rejected
const typeFilter = ref('all'); // all | word | verb
const search = ref('');

// SEO
useSeoMeta({
  title: () =>
    t('contributor.submissions.meta.title') ||
    'Espace contributeur · Soumissions – Lexikongo',
  description: () =>
    t('contributor.submissions.meta.description') ||
    'Consultez l’historique de vos soumissions de mots et de verbes en kikongo.',
  ogTitle: () =>
    t('contributor.submissions.meta.ogTitle') ||
    t('contributor.submissions.meta.title'),
  ogDescription: () =>
    t('contributor.submissions.meta.ogDescription') ||
    t('contributor.submissions.meta.description'),
});

// Chargement des soumissions (SSR-friendly)
const {
  data,
  pending,
  error,
} = await useAsyncData(
  'contributor-submissions',
  async () => {
    if (!currentUserId.value) return null;
    return $fetch(`/api/contributor/submissions/${currentUserId.value}`);
  },
  {
    watch: [currentUserId],
  },
);

const errorMessage = computed(() => {
  if (!error.value) return '';
  return (
    error.value?.data?.statusMessage ||
    error.value?.message ||
    t('contributor.submissions.error.generic')
  );
});

// Normalisation des données API en une liste unifiée
const allItems = computed(() => {
  const result = [];

  if (!data.value) return result;

  const {
    pendingWords = [],
    archivedWords = [],
    pendingVerbs = [],
    archivedVerbs = [],
  } = data.value || {};

  // Pending words
  for (const w of pendingWords) {
    result.push({
      id: `word-p-${w.submission_id}`,
      kind: 'word',
      status: w.status || 'pending',
      lemma: w.singular,
      plural: w.plural,
      phonetic: w.phonetic,
      translation_fr: w.translation_fr || '',
      translation_en: w.translation_en || '',
      nominalClass: w.nominal_class || null,
      dateRaw: w.created_at,
      dateFormatted: w.created_at
        ? d(new Date(w.created_at), 'short')
        : '',
      reason: null,
      admin: null,
      slug: w.slug || null,
    });
  }

  // Archived words (approved / rejected)
  for (const aw of archivedWords) {
    result.push({
      id: `word-a-${aw.word_id}`,
      kind: 'word',
      status: aw.status || 'approved',
      lemma: aw.singular,
      plural: aw.plural,
      phonetic: aw.phonetic,
      translation_fr: aw.translation_fr || '',
      translation_en: aw.translation_en || '',
      nominalClass: aw.nominal_class || null,
      dateRaw: aw.archived_at,
      dateFormatted: aw.archived_at
        ? d(new Date(aw.archived_at), 'short')
        : '',
      reason: aw.reason || null,
      admin: aw.admin_username || null,
      slug: null,
    });
  }

  // Pending verbs
  for (const v of pendingVerbs) {
    result.push({
      id: `verb-p-${v.submission_id}`,
      kind: 'verb',
      status: v.status || 'pending',
      lemma: v.name,
      plural: null,
      phonetic: v.phonetic,
      translation_fr: v.translation_fr || '',
      translation_en: v.translation_en || '',
      nominalClass: null,
      dateRaw: v.created_at,
      dateFormatted: v.created_at
        ? d(new Date(v.created_at), 'short')
        : '',
      reason: null,
      admin: null,
      slug: v.slug || null,
    });
  }

  // Archived verbs
  for (const av of archivedVerbs) {
    result.push({
      id: `verb-a-${av.verb_id}`,
      kind: 'verb',
      status: av.status || 'approved',
      lemma: av.name,
      plural: null,
      phonetic: av.phonetic,
      translation_fr: av.translation_fr || '',
      translation_en: av.translation_en || '',
      nominalClass: null,
      dateRaw: av.archived_at,
      dateFormatted: av.archived_at
        ? d(new Date(av.archived_at), 'short')
        : '',
      reason: av.reason || null,
      admin: av.admin_username || null,
      slug: null,
    });
  }

  // Tri : les plus récents d’abord
  return result.sort((a, b) => {
    const da = a.dateRaw ? new Date(a.dateRaw).getTime() : 0;
    const db = b.dateRaw ? new Date(b.dateRaw).getTime() : 0;
    return db - da;
  });
});

// Compteur par statut (pour les chips)
const counts = computed(() => {
  const base = { pending: 0, approved: 0, rejected: 0 };
  for (const item of allItems.value) {
    if (item.status === 'pending') base.pending += 1;
    else if (item.status === 'approved') base.approved += 1;
    else if (item.status === 'rejected') base.rejected += 1;
  }
  return base;
});

// Filtrage combiné statut + type + recherche
const filteredItems = computed(() => {
  let items = allItems.value;

  if (statusFilter.value !== 'all') {
    items = items.filter((i) => i.status === statusFilter.value);
  }

  if (typeFilter.value !== 'all') {
    items = items.filter((i) => i.kind === typeFilter.value);
  }

  const q = search.value.trim().toLowerCase();
  if (!q) return items;

  return items.filter((i) => {
    const lemma = (i.lemma || '').toLowerCase();
    const plural = (i.plural || '').toLowerCase();
    const fr = (i.translation_fr || '').toLowerCase();
    const en = (i.translation_en || '').toLowerCase();
    const phon = (i.phonetic || '').toLowerCase();
    return (
      lemma.includes(q) ||
      plural.includes(q) ||
      fr.includes(q) ||
      en.includes(q) ||
      phon.includes(q)
    );
  });
});

// ---------- Pagination ----------
const page = ref(1);
const pageSize = ref(10);

const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredItems.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => {
  const total = filteredItems.value.length || 0;
  return total ? Math.ceil(total / pageSize.value) : 1;
});

// reset page quand filtres/recherche changent
watch([statusFilter, typeFilter, search], () => {
  page.value = 1;
});

// Label de statut
const statusLabel = (status) => {
  if (status === 'pending') {
    return t('contributor.submissions.status.pending');
  }
  if (status === 'approved') {
    return t('contributor.submissions.status.approved');
  }
  if (status === 'rejected') {
    return t('contributor.submissions.status.rejected');
  }
  return status;
};
</script>

<style scoped>
.lk-contrib-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.lk-contrib-side {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Carte principale (light/dark via tokens) */
.lk-contrib-card {
  background: var(--surface-elevated, #ffffff);
  border-radius: 1rem;
  padding: 1.5rem 1.25rem 1.75rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.35));
  margin-top: 1.5rem;
}

.lk-contrib-card__header {
  margin-bottom: 1rem;
}

.lk-contrib-help {
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
  margin: 0 0 0.25rem;
}

.lk-contrib-hint {
  font-size: 0.82rem;
  color: var(--text-muted, #6b7280);
  margin: 0;
}

/* ---------- Zone principale des soumissions ---------- */

.lk-submissions {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.75rem;
}

/* États (pas connecté / chargement / vide / erreur) */
.lk-submissions-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
}

.lk-submissions-status i {
  font-size: 0.9rem;
}

.lk-submissions-status--info {
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.35);
  color: var(--primary, #2563eb);
}

.lk-submissions-status--error {
  background: rgba(248, 113, 113, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.55);
  color: #b91c1c;
}

.lk-submissions-status--empty {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: var(--text-muted, #6b7280);
}

/* ---------- Toolbar : Statut / Type / Recherche ---------- */

.lk-submissions__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.75rem;
  margin: 1.1rem 0 0.8rem;
}

.lk-submissions__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.lk-submissions__filters-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #6b7280);
  margin-right: 0.25rem;
}

/* Chips statut */
.lk-submissions-chip {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
  padding: 0.3rem 0.9rem;
  font-size: 0.86rem;
  font-weight: 500;
  background: var(--surface-default, #f9fafb);
  color: var(--text-default, #111827);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    transform 0.08s ease;
}

.lk-submissions-chip__count {
  min-width: 1.3rem;
  padding: 0.05rem 0.35rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: rgba(15, 23, 42, 0.05);
}

.lk-submissions-chip--active {
  background: var(--primary, #2563eb);
  border-color: var(--primary, #2563eb);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.3);
}

.lk-submissions-chip:hover,
.lk-submissions-chip:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
}

/* accents de couleur */
.lk-submissions-chip--approved {
  color: #047857;
}

.lk-submissions-chip--rejected {
  color: #b91c1c;
}

/* Pills type (Mots & verbes / mots / verbes) */
.lk-submissions__toolbar-right {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.6rem;
  margin-left: auto;
}

.lk-submissions-pill {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
  padding: 0.28rem 0.9rem;
  font-size: 0.84rem;
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

.lk-submissions-pill--active {
  background: var(--primary, #2563eb);
  border-color: var(--primary, #2563eb);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.3);
}

.lk-submissions-pill:hover,
.lk-submissions-pill:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
}

/* Recherche */
.lk-submissions__search {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 220px;
}

.lk-submissions__search-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #6b7280);
}

.lk-submissions__search-input {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.85));
  padding: 0.4rem 0.9rem;
  font-size: 0.9rem;
  background: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
}

/* ---------- Compteur global ---------- */

.lk-submissions-count {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.4rem;
}

.lk-submissions-count__chip {
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

.lk-submissions-count__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, #22c55e, #16a34a);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18);
}

.lk-submissions-count__text {
  white-space: nowrap;
}

/* ---------- Liste + cartes ---------- */

.lk-submissions-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.lk-submissions-card {
  margin: 0;
}

.lk-submissions-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.lk-submissions-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

/* Badge type mot / verbe */
.lk-submissions-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
}

.lk-submissions-badge--word {
  background: #ecfdf5;
  color: #047857;
}

.lk-submissions-badge--verb {
  background: #eff6ff;
  color: #1d4ed8;
}

/* Pastille statut */
.lk-submissions-status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
  border: 1px solid transparent;
}

.lk-submissions-status-pill--pending {
  background: #fef3c7;
  color: #92400e;
  border-color: #fde68a;
}

.lk-submissions-status-pill--approved {
  background: #ecfdf5;
  color: #166534;
  border-color: #bbf7d0;
}

.lk-submissions-status-pill--rejected {
  background: #fef2f2;
  color: #b91c1c;
  border-color: #fecaca;
}

.lk-submissions-card__date {
  font-size: 0.8rem;
  color: var(--text-muted, #6b7280);
}

/* Corps carte */
.lk-submissions-card__body {
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: var(--surface-elevated, #ffffff);
  padding: 0.8rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.lk-submissions-card__title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem;
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.lk-submissions-ku {
  font-size: 0.85rem;
  font-weight: 500;
  color: #6b7280;
}

.lk-submissions-lemma {
  color: var(--primary, #2563eb);
}

.lk-submissions-lemma-plural {
  color: var(--primary, #2563eb);
}

.lk-submissions-phonetic {
  font-size: 0.86rem;
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  color: var(--text-muted, #6b7280);
}

/* Traductions */
.lk-submissions-translations {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin: 0.2rem 0 0;
}

.lk-submissions-translations__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.2rem 0.5rem;
  align-items: baseline;
}

.lk-submissions-translations__row dt {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.lk-submissions-translations__row dd {
  margin: 0;
  font-size: 0.9rem;
}

/* Couleurs FR / EN */
.translation-fr {
  color: #047857;
}

.translation-en {
  color: #b45309;
}

/* Raison admin */
.lk-submissions-reason {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: var(--text-muted, #6b7280);
}

/* Footer : classe nominale + actions */
.lk-submissions-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.lk-submissions-chip-small {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  font-size: 0.78rem;
  color: var(--text-muted, #6b7280);
}

/* Actions */
.lk-submissions-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: flex-end;
}

.lk-submissions-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.86rem;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    transform 0.08s ease;
}

.lk-submissions-btn--primary {
  background: var(--primary, #2563eb);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.3);
}

.lk-submissions-btn--primary:hover,
.lk-submissions-btn--primary:focus-visible {
  outline: none;
  background: var(--primary-hover, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.2);
}

/* Pagination */
.lk-submissions__pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

/* Responsive */
@media (max-width: 720px) {
  .lk-submissions__toolbar {
    align-items: stretch;
  }

  .lk-submissions__toolbar-right {
    width: 100%;
    justify-content: space-between;
  }

  .lk-submissions__search {
    flex: 1 1 auto;
  }

  .lk-submissions-card__body {
    padding: 0.75rem 0.8rem;
  }
}
</style>
