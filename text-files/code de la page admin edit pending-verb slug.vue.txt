<!-- pages/admin/edit/pending-verb/[slug].vue -->
<template>
  <main
    class="lk-contrib-page"
    aria-labelledby="admin-edit-pending-verb-title"
  >
    <!-- HERO -->
    <LkPageHero
      id="admin-edit-pending-verb-title"
      :eyebrow="
        t('admin.editPendingVerb.eyebrow')
        || t('contributor.editPendingVerb.eyebrow')
        || t('contributor.addVerb.eyebrow')
      "
      :title="
        t('admin.editPendingVerb.title')
        || t('contributor.editPendingVerb.title')
        || t('contributor.addVerb.title')
      "
      :description="
        t('admin.editPendingVerb.subtitle')
        || t('contributor.editPendingVerb.subtitle')
        || t('contributor.addVerb.subtitle')
      "
      :side-aria-label="
        t('admin.editPendingVerb.meta.label')
        || t('contributor.editPendingVerb.meta.label')
        || t('contributor.addVerb.meta.label')
      "
      :show-last-expressions="false"
    >
      <!-- Meta sous le titre -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-user-shield" aria-hidden="true"></i>
          <span>
            {{
              t('admin.editPendingVerb.meta.label')
              || t('contributor.editPendingVerb.meta.label')
              || t('contributor.addVerb.meta.label')
            }}
          </span>
        </p>
      </template>

      <!-- Colonne de droite : actions admin (pour l’instant on recycle LkActionsBar) -->
      <template #side>
        <div class="lk-contrib-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <!-- Carte formulaire -->
    <section
      class="lk-contrib-card"
      aria-describedby="admin-edit-pending-verb-help"
    >
      <header class="lk-contrib-card__header">
        <!-- Aide générale -->
        <p
          id="admin-edit-pending-verb-help"
          class="lk-contrib-help"
        >
          {{
            t('admin.editPendingVerb.help')
            || t('contributor.editPendingVerb.help')
            || t('contributor.addVerb.helpRequired')
          }}
        </p>

        <p class="lk-contrib-hint">
          {{
            t('admin.editPendingVerb.reviewNotice')
            || t('contributor.editPendingVerb.reviewNotice')
            || t('contributor.addVerb.reviewNotice')
          }}
        </p>

        <!-- Meta soumission : statut + date -->
            <!-- Meta soumission : statut + date + auteur -->
        <div
          v-if="submissionMeta"
          class="lk-contrib-meta"
        >
          <div class="lk-contrib-meta__row">
            <span class="lk-contrib-meta__status">
              <span
                class="lk-contrib-status-pill"
                :class="`lk-contrib-status-pill--${submissionMeta.status}`"
              >
                {{ statusLabel(submissionMeta.status) }}
              </span>
            </span>

            <span
              v-if="submissionMeta.createdAtFormatted"
              class="lk-contrib-meta__date"
            >
              {{
                t('admin.editPendingVerb.meta.submittedAtLabel')
                || t('contributor.editPendingVerb.meta.submittedAtLabel')
                || t('contributor.submissions.meta.createdAt')
                || 'Soumis le'
              }}
              :
              <time :datetime="submissionMeta.createdAtRaw">
                {{ submissionMeta.createdAtFormatted }}
              </time>
            </span>
          </div>

          <div class="lk-contrib-meta__row lk-contrib-meta__row--chips">
            <span
              v-if="submissionMeta.userLabel"
              class="lk-contrib-chip lk-contrib-chip--user"
            >
              <i class="fas fa-user" aria-hidden="true" />
              <span>{{ submissionMeta.userLabel }}</span>
            </span>

            <span
              v-if="submissionMeta.submissionId"
              class="lk-contrib-chip lk-contrib-chip--id"
            >
              <i class="fas fa-hashtag" aria-hidden="true" />
              <span>#{{ submissionMeta.submissionId }}</span>
            </span>

            <span
              v-if="slug"
              class="lk-contrib-chip lk-contrib-chip--slug"
            >
              <i class="fas fa-link" aria-hidden="true" />
              <span>{{ slug }}</span>
            </span>
          </div>
        </div>


        <!-- Titre dynamique = verbe -->
        <h2 class="lk-contrib-card__title">
          {{
            form.infinitive && form.infinitive.trim()
              ? `ku ${form.infinitive.trim()}`
              : (
                t('admin.editPendingVerb.cardTitleFallback')
                || t('contributor.editPendingVerb.cardTitleFallback')
                || t('contributor.addVerb.cardTitleFallback')
              )
          }}
        </h2>

        <p class="lk-contrib-card__subtitle">
          {{
            t('admin.editPendingVerb.subtitle')
            || t('contributor.editPendingVerb.subtitle')
            || t('contributor.addVerb.subtitle')
          }}
        </p>

        <!-- Si non-pending : message d’info (l’admin voit quand même) -->
        <p
          v-if="submissionMeta && submissionMeta.status !== 'pending'"
          class="lk-contrib-message lk-contrib-message--info"
        >
          {{
            t('admin.editPendingVerb.locked')
            || t('contributor.editPendingVerb.locked')
            || 'Cette soumission n’est plus en statut « en attente ».'
          }}
        </p>
      </header>

      <!-- État : non connecté -->
      <div
        v-if="!currentUserId"
        class="lk-submissions-status lk-submissions-status--info"
      >
        <i class="fas fa-user-lock" aria-hidden="true" />
        <span>
          {{
            t('admin.common.mustBeLoggedIn')
            || t('contributor.submissions.mustBeLoggedIn')
          }}
        </span>
      </div>

      <!-- État : chargement -->
      <div
        v-else-if="isLoadingSubmission"
        class="lk-submissions-status lk-submissions-status--info"
        role="status"
        aria-live="polite"
      >
        <i class="fas fa-circle-notch fa-spin" aria-hidden="true" />
        <span>
          {{
            t('admin.editPendingVerb.loading')
            || t('contributor.editPendingVerb.loading')
            || 'Chargement de la soumission…'
          }}
        </span>
      </div>

      <!-- État : erreur -->
      <p
        v-else-if="submissionErrorMessage"
        class="lk-submissions-status lk-submissions-status--error"
        role="alert"
      >
        <i class="fas fa-exclamation-triangle" aria-hidden="true" />
        <span>{{ submissionErrorMessage }}</span>
      </p>

      <!-- Formulaire -->
      <form
        v-else
        class="lk-contrib-form"
        @submit.prevent="onSubmit"
      >
        <!-- Bloc Kikongo -->
        <fieldset class="lk-contrib-fieldset">
          <legend class="lk-contrib-legend">
            {{ t('contributor.addVerb.sections.kikongo') || 'Forme en kikongo' }}
          </legend>

          <!-- Infinitif -->
          <div class="lk-contrib-row">
            <label
              for="infinitive"
              class="lk-contrib-label"
            >
              {{ t('contributor.addVerb.fields.infinitive') || 'Infinitif (sans « ku »)' }}
              <span class="lk-contrib-required">*</span>
            </label>

            <div class="lk-contrib-input-prefix-wrap">
              <span class="lk-contrib-input-prefix">ku</span>
              <input
                id="infinitive"
                v-model.trim="form.infinitive"
                type="text"
                required
                class="lk-contrib-input lk-contrib-input--with-prefix"
                :disabled="isReadOnly"
                :placeholder="t('contributor.addVerb.hints.infinitive') || 'longa, bala…'"
              />
            </div>

            <p class="lk-contrib-hint">
              {{
                t('contributor.addVerb.hints.infinitive')
                || 'Écrivez l’infinitif sans « ku » (ex. longa, bala…).'
              }}
            </p>
          </div>

          <!-- Radical + suffixe -->
          <div class="lk-contrib-row lk-contrib-row--half">
            <div class="lk-contrib-row__col">
              <label
                for="root"
                class="lk-contrib-label"
              >
                {{ t('contributor.addVerb.fields.root') || 'Radical verbal' }}
              </label>
              <input
                id="root"
                v-model.trim="form.root"
                type="text"
                class="lk-contrib-input"
                :disabled="isReadOnly"
                :placeholder="t('contributor.addVerb.hints.root') || 'long-, bal-…'"
              />
              <p class="lk-contrib-hint">
                {{
                  t('contributor.addVerb.hints.root')
                  || 'Indiquez le radical verbal (ex. long-, bal-…).'
                }}
              </p>
            </div>

            <div class="lk-contrib-row__col">
              <label
                for="suffix"
                class="lk-contrib-label"
              >
                {{ t('contributor.addVerb.fields.suffix') || 'Suffixe' }}
              </label>
              <input
                id="suffix"
                v-model.trim="form.suffix"
                type="text"
                class="lk-contrib-input"
                :disabled="isReadOnly"
                :placeholder="t('contributor.addVerb.fields.suffix') || '-ana, -ola…'"
              />
              <p class="lk-contrib-hint">
                {{
                  t('contributor.addVerb.hints.suffix')
                  || 'Indiquez un suffixe de dérivation si nécessaire (passif, causatif…).'
                }}
              </p>
            </div>
          </div>

          <!-- Phonétique -->
          <div class="lk-contrib-row">
            <label
              for="phonetic"
              class="lk-contrib-label"
            >
              {{ t('contributor.addVerb.fields.phonetic') || 'Phonétique' }}
            </label>

            <input
              id="phonetic"
              v-model.trim="form.phonetic"
              type="text"
              class="lk-contrib-input"
              :disabled="isReadOnly"
              :placeholder="t('contributor.addVerb.hints.phonetic') || '[lónga]…'"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addVerb.hints.phonetic')
                || 'Vous pouvez utiliser des crochets et des accents pour préciser la prononciation.'
              }}
            </p>
          </div>
        </fieldset>

        <!-- Bloc Verbe dérivé -->
        <fieldset class="lk-contrib-fieldset">
          <legend class="lk-contrib-legend">
            {{ t('contributor.addVerb.sections.derived') || 'Verbe dérivé' }}
            <span class="lk-contrib-legend-tag">
              {{ t('contributor.addVerb.sections.derivedOptional') || 'optionnel' }}
            </span>
          </legend>

          <!-- Checkbox : verbe dérivé ? -->
          <div class="lk-contrib-row">
            <label
              for="derived_verb"
              class="lk-contrib-label lk-contrib-label--checkbox"
            >
              <input
                id="derived_verb"
                v-model="form.derived_verb"
                type="checkbox"
                :disabled="isReadOnly"
              />
              <span>
                {{ t('contributor.addVerb.fields.derivedVerb') || 'Ce verbe est dérivé d’un autre verbe' }}
              </span>
            </label>
            <p class="lk-contrib-hint">
              {{ t('contributor.addVerb.hints.derivedVerb') }}
            </p>
          </div>

          <div
            v-if="form.derived_verb"
            class="lk-contrib-row lk-contrib-row--half"
          >
            <!-- Verbe de base -->
            <div class="lk-contrib-row__col">
              <label
                for="base_verb_search"
                class="lk-contrib-label"
              >
                {{ t('contributor.addVerb.fields.derivedFrom') || 'Verbe de base' }}
              </label>

              <input
                id="base_verb_search"
                v-model="baseVerbSearch"
                type="search"
                class="lk-contrib-input"
                :disabled="isReadOnly"
                :placeholder="
                  t('contributor.addVerb.hints.derivedFrom')
                  || 'Rechercher le verbe de base…'
                "
              />

              <p class="lk-contrib-hint">
                {{
                  t('contributor.addVerb.hints.derivedFrom')
                  || 'ID interne ou recherche dans les verbes existants.'
                }}
              </p>

              <!-- Suggestions verbes -->
              <ul
                v-if="baseVerbSearch && baseVerbOptions.length"
                class="lk-contrib-suggestions"
              >
                <li
                  v-for="verb in baseVerbOptions"
                  :key="verb.slug || verb.verb_id || verb.id"
                  class="lk-contrib-suggestions__item"
                >
                  <button
                    type="button"
                    class="lk-contrib-suggestions__btn"
                    :disabled="isReadOnly"
                    @click="selectBaseVerb(verb)"
                  >
                    <span class="lk-contrib-suggestions__main">
                      <span class="lk-contrib-suggestions__ku">ku</span>
                      <span class="lk-contrib-suggestions__verb">
                        {{ verb.singular || verb.name || verb.infinitive || '—' }}
                      </span>
                    </span>

                    <span
                      v-if="verb.phonetic"
                      class="lk-contrib-suggestions__phonetic"
                    >
                      [[{{ verb.phonetic }}]]
                    </span>
                  </button>
                </li>
              </ul>

              <p
                v-else-if="baseVerbSearch && !baseVerbOptions.length"
                class="lk-contrib-hint lk-contrib-hint--muted"
              >
                {{ t('contributor.addWord.baseVerbNoResults') || 'Aucun verbe ne correspond pour l’instant.' }}
              </p>

              <p
                v-if="selectedBaseVerbLabel"
                class="lk-contrib-selected-base"
              >
                {{
                  t('contributor.addWord.baseVerbSelected', {
                    verb: selectedBaseVerbLabel,
                  })
                }}
              </p>
            </div>

            <!-- Type de dérivation -->
            <div class="lk-contrib-row__col">
              <label
                for="derived_verb_type"
                class="lk-contrib-label"
              >
                {{ t('contributor.addVerb.fields.derivedVerbType') || 'Type de verbe dérivé' }}
              </label>

              <input
                id="derived_verb_type"
                v-model.trim="form.derived_verb_type"
                type="text"
                class="lk-contrib-input"
                :disabled="isReadOnly"
                :placeholder="
                  t('contributor.addVerb.hints.derivedVerbType')
                  || 'passif, causatif, applicatif, fréquentatif…'
                "
              />

              <p class="lk-contrib-hint">
                {{
                  t('contributor.addVerb.hints.derivedVerbType')
                  || 'Précisez le type de dérivation si vous le connaissez (passive, causative, etc.).'
                }}
              </p>
            </div>
          </div>
        </fieldset>

        <!-- Bloc traductions -->
        <fieldset class="lk-contrib-fieldset">
          <legend class="lk-contrib-legend">
            {{ t('details.common.translations') || 'Traductions' }}
          </legend>

          <!-- FR -->
          <div class="lk-contrib-row">
            <label
              for="translation_fr"
              class="lk-contrib-label"
            >
              {{ t('contributor.addVerb.fields.translationFr') || 'Traductions en français' }}
            </label>

            <textarea
              id="translation_fr"
              v-model.trim="form.translation_fr"
              rows="3"
              class="lk-contrib-textarea"
              :disabled="isReadOnly"
              :placeholder="
                t('contributor.addVerb.hints.translationFr')
                || 'Sens FR séparés par des virgules…'
              "
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addVerb.hints.translationFr')
                || 'Vous pouvez proposer plusieurs sens en français, séparés par des virgules.'
              }}
            </p>
          </div>

          <!-- EN -->
          <div class="lk-contrib-row">
            <label
              for="translation_en"
              class="lk-contrib-label"
            >
              {{ t('contributor.addVerb.fields.translationEn') || 'Traductions en anglais' }}
            </label>

            <textarea
              id="translation_en"
              v-model.trim="form.translation_en"
              rows="3"
              class="lk-contrib-textarea"
              :disabled="isReadOnly"
              :placeholder="
                t('contributor.addVerb.hints.translationEn')
                || 'EN meanings separated by commas…'
              "
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addVerb.hints.translationEn')
                || 'Vous pouvez proposer plusieurs sens en anglais, séparés par des virgules.'
              }}
            </p>
          </div>
        </fieldset>

        <!-- Messages -->
        <p
          v-if="error"
          class="lk-contrib-message lk-contrib-message--error"
          role="alert"
        >
          {{ error }}
        </p>

        <p
          v-if="success"
          class="lk-contrib-message lk-contrib-message--success"
        >
          {{ success }}
        </p>

              <!-- Actions -->
        <div class="lk-contrib-actions">
          <!-- Enregistrer -->
          <button
            type="submit"
            class="lk-contrib-btn lk-contrib-btn--primary"
            :disabled="isSubmitting || isModerating"
          >
            <i class="fas fa-save" aria-hidden="true"></i>
            <span>
              {{
                isSubmitting
                  ? (
                    t('admin.editPendingVerb.actions.saving')
                    || t('contributor.editPendingVerb.actions.saving')
                    || t('contributor.addVerb.actions.saving')
                    || 'Enregistrement en cours…'
                  )
                  : (
                    t('admin.editPendingVerb.actions.save')
                    || t('contributor.editPendingVerb.actions.save')
                    || 'Enregistrer les modifications'
                  )
              }}
            </span>
          </button>

          <!-- Reset -->
          <button
            type="button"
            class="lk-contrib-btn lk-contrib-btn--secondary"
            :disabled="isSubmitting || isModerating"
            @click="onReset"
          >
            <i class="fas fa-rotate-left" aria-hidden="true"></i>
            <span>
              {{
                t('admin.editPendingVerb.actions.reset')
                || t('contributor.editPendingVerb.actions.reset')
                || t('contributor.addVerb.actions.reset')
                || 'Réinitialiser'
              }}
            </span>
          </button>

          <!-- ✅ Approuver / Rejeter : seulement si statut = pending -->
          <template v-if="submissionMeta && submissionMeta.status === 'pending'">
            <button
              type="button"
              class="lk-contrib-btn lk-contrib-btn--success"
              :disabled="isSubmitting || isModerating"
              @click="onApprove"
            >
              <i class="fas fa-check" aria-hidden="true" />
              <span>
                {{
                  t('admin.editPendingVerb.actions.approve')
                  || 'Approuver cette soumission'
                }}
              }}
            </span>
            </button>

            <button
              type="button"
              class="lk-contrib-btn lk-contrib-btn--warning"
              :disabled="isSubmitting || isModerating"
              @click="onReject"
            >
              <i class="fas fa-ban" aria-hidden="true" />
              <span>
                {{
                  t('admin.editPendingVerb.actions.reject')
                  || 'Rejeter cette soumission'
                }}
              </span>
            </button>
          </template>

          <!-- Supprimer -->
          <button
            type="button"
            class="lk-contrib-btn lk-contrib-btn--danger"
            :disabled="isSubmitting || isModerating"
            @click="onDelete"
          >
            <i class="fas fa-trash-alt" aria-hidden="true"></i>
            <span>
              {{
                t('admin.editPendingVerb.actions.delete')
                || t('contributor.editPendingVerb.actions.delete')
                || 'Supprimer cette soumission'
              }}
            </span>
          </button>
        </div>

      </form>
    </section>
  </main>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSeoMeta, useAsyncData } from '#imports';
import * as Toastification from 'vue-toastification';

import { useConfirmStore } from '~/stores/confirmStore';
import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import { useAuthStore } from '~/stores/authStore';
import { useVerbStore } from '~/stores/verbStore';

const route = useRoute();
const router = useRouter();
const { t, d } = useI18n();
const toast = Toastification.useToast();
const confirmStore = useConfirmStore();

const authStore = useAuthStore();
const currentUserId = computed(
  () => authStore.user?.id || authStore.user?.user_id || null,
);

const slug = computed(() => route.params.slug || null);

// --------- State formulaire ---------
const form = ref({
  infinitive: '',
  root: '',
  suffix: '',
  phonetic: '',
  translation_fr: '',
  translation_en: '',
  derived_verb: false,
  derived_from: '',
  derived_verb_type: '',
});

const isSubmitting = ref(false);
const isModerating = ref(false); // ✅ modération
const error = ref('');
const success = ref('');

const submissionMeta = ref(null);
const originalPayload = ref(null);

// lecture-only si pas pending
const isReadOnly = computed(
  () => submissionMeta.value && submissionMeta.value.status !== 'pending',
);

// store verbes
const verbStore = useVerbStore();
const baseVerbSearch = ref('');

// SEO
useSeoMeta({
  title: () =>
    t('admin.editPendingVerb.meta.title')
    || t('contributor.editPendingVerb.meta.title')
    || 'Admin · Modifier un verbe proposé – Lexikongo',
  description: () =>
    t('admin.editPendingVerb.meta.description')
    || t('contributor.editPendingVerb.meta.description')
    || 'Modifiez un verbe soumis par un contributeur avant décision de modération.',
});

// 🔹 Chargement de la soumission à partir du slug (route admin)
const {
  data: submissionData,
  pending: isLoadingSubmission,
  error: submissionErrorRaw,
} = await useAsyncData(
  'admin-edit-pending-verb',
  async () => {
    if (!slug.value || !currentUserId.value) return null;

    return $fetch(`/api/admin/pending-verb/${slug.value}`);
  },
  {
    watch: [slug, currentUserId],
  },
);

const submissionErrorMessage = computed(() => {
  if (!submissionErrorRaw.value) return '';
  return (
    submissionErrorRaw.value?.data?.statusMessage
    || submissionErrorRaw.value?.message
    || t('admin.editPendingVerb.errors.generic')
    || t('contributor.editPendingVerb.errors.generic')
    || 'Impossible de charger cette soumission.'
  );
});

// Hydratation du formulaire depuis l’API
const hydrateFromSubmission = (payload) => {
  if (!payload) return;

  const s = payload.submission || payload;

  form.value.infinitive =
    s.infinitive || s.singular || s.name || '';
  form.value.root = s.root || '';
  form.value.suffix = s.suffix || '';
  form.value.phonetic = s.phonetic || '';

  form.value.translation_fr =
    payload.translation_fr || s.translation_fr || '';
  form.value.translation_en =
    payload.translation_en || s.translation_en || '';

  form.value.derived_verb = !!s.derived_verb;
  form.value.derived_from = s.derived_from || '';
  form.value.derived_verb_type = s.derived_verb_type || '';

  baseVerbSearch.value = payload.base_verb_label || '';

  // meta
  const createdAtRaw = s.created_at || payload.created_at || null;
  const userLabel =
    payload.user_name
    || payload.username
    || payload.user_username
    || payload.user_email
    || '';

  submissionMeta.value = {
    status: s.status || payload.status || 'pending',
    createdAtRaw,
    createdAtFormatted: createdAtRaw
      ? d(new Date(createdAtRaw), 'short')
      : '',
    submissionId: s.submission_id || payload.submission_id || null,
    userLabel,
  };

  originalPayload.value = JSON.parse(JSON.stringify(payload));
};

watch(
  submissionData,
  (val) => {
    if (!val) return;
    hydrateFromSubmission(val);
  },
  { immediate: true },
);

// Suggestions de verbe de base
const baseVerbOptions = computed(() => {
  const q = baseVerbSearch.value.trim().toLowerCase();
  const list = Array.isArray(verbStore.items) ? verbStore.items : [];
  if (!q) return [];
  return list
    .filter((v) => {
      const infinitive = (v.infinitive || v.singular || v.name || '').toLowerCase();
      const phon = (v.phonetic || '').toLowerCase();
      const fr = (v.translation_fr || '').toLowerCase();
      const en = (v.translation_en || '').toLowerCase();
      return (
        infinitive.includes(q)
        || phon.includes(q)
        || fr.includes(q)
        || en.includes(q)
      );
    })
    .slice(0, 10);
});

const selectedBaseVerb = computed(() => {
  const id = form.value.derived_from;
  if (!id) return null;
  const list = Array.isArray(verbStore.items) ? verbStore.items : [];
  return (
    list.find((v) => v.verb_id === id || v.id === id) || null
  );
});

const selectedBaseVerbLabel = computed(() => {
  if (!selectedBaseVerb.value) return '';
  const base =
    selectedBaseVerb.value.infinitive
    || selectedBaseVerb.value.singular
    || selectedBaseVerb.value.name
    || '—';
  return `ku ${base}`;
});

const selectBaseVerb = (verb) => {
  const id = verb.verb_id ?? verb.id ?? null;
  if (!id) return;
  form.value.derived_from = id;
  baseVerbSearch.value =
    verb.infinitive || verb.singular || verb.name || '';
};

// Reset = revenir à l’état API initial
const onReset = () => {
  error.value = '';
  success.value = '';
  if (originalPayload.value) {
    hydrateFromSubmission(originalPayload.value);
  }
};

// Submit (PUT) → retourne true si OK, false sinon
const onSubmit = async () => {
  error.value = '';
  success.value = '';

  if (!currentUserId.value) {
    error.value =
      t('admin.common.mustBeLoggedIn')
      || t('contributor.submissions.mustBeLoggedIn');
    return false;
  }

  if (!form.value.infinitive?.trim()) {
    error.value =
      t('admin.editPendingVerb.errors.missingInfinitive')
      || t('contributor.addVerb.errors.missingInfinitive')
      || 'Merci d’indiquer au moins l’infinitif du verbe.';
    return false;
  }

  if (
    !form.value.translation_fr?.trim()
    && !form.value.translation_en?.trim()
  ) {
    error.value =
      t('admin.editPendingVerb.errors.translationRequired')
      || t('contributor.addVerb.errors.missingTranslations')
      || 'Merci de proposer au moins une traduction (FR ou EN).';
    return false;
  }

  isSubmitting.value = true;

  try {
    await $fetch(`/api/admin/pending-verb/${slug.value}`, {
      method: 'PUT',
      body: {
        infinitive: form.value.infinitive,
        root: form.value.root || null,
        suffix: form.value.suffix || null,
        phonetic: form.value.phonetic || null,
        derived_verb: form.value.derived_verb ? 1 : 0,
        derived_from: form.value.derived_from || null,
        derived_verb_type: form.value.derived_verb_type || null,
        translation_fr: form.value.translation_fr || '',
        translation_en: form.value.translation_en || '',
      },
    });

    const msg =
      t('admin.editPendingVerb.success')
      || t('contributor.editPendingVerb.success')
      || 'Les modifications ont bien été enregistrées.';
    success.value = msg;
    toast.success(msg);
    return true;
  } catch (err) {
    console.error('Erreur lors de la mise à jour du verbe en attente (admin) :', err);
    const apiMsg =
      err?.data?.statusMessage
      || err?.data?.message
      || t('admin.editPendingVerb.errors.generic')
      || t('contributor.editPendingVerb.errors.generic')
      || 'Impossible de mettre à jour cette soumission.';
    error.value = apiMsg;
    toast.error(apiMsg);
    return false;
  } finally {
    isSubmitting.value = false;
  }
};

// ✅ Approve / Reject via /api/admin/manage-submissions
const moderate = async (action) => {
  if (!currentUserId.value) {
    toast.error(
      t('admin.common.mustBeLoggedIn')
      || t('contributor.submissions.mustBeLoggedIn')
      || 'Vous devez être connecté pour effectuer cette action.',
    );
    return;
  }

  if (!submissionMeta.value || !submissionMeta.value.submissionId) {
    toast.error(
      t('admin.editPendingVerb.errors.noSubmissionId')
      || 'Impossible de retrouver l’identifiant de la soumission.',
    );
    return;
  }

  if (submissionMeta.value.status !== 'pending') {
    toast.error(
      t('admin.editPendingVerb.locked')
      || 'Cette soumission n’est plus en statut « en attente ».',
    );
    return;
  }

  let reason;
  if (action === 'reject') {
    const confirmed = await confirmStore.ask({
      title:
        t('admin.editPendingVerb.confirmRejectTitle')
        || 'Rejeter cette soumission ?',
      message:
        t('admin.editPendingVerb.confirmReject')
        || 'Voulez-vous vraiment rejeter cette soumission ? Vous pourrez préciser une raison ensuite.',
      confirmLabel:
        t('admin.editPendingVerb.actions.reject')
        || 'Rejeter',
      cancelLabel:
        t('common.actions.cancel')
        || 'Annuler',
      danger: true,
    });
    if (!confirmed) return;

    const promptLabel =
      t('admin.editPendingVerb.rejectReasonPrompt')
      || 'Raison du rejet (optionnel) :';
    // eslint-disable-next-line no-alert
    reason = window.prompt(promptLabel, '') || '';
  }

  // On sauvegarde d’abord les modifs
  const saved = await onSubmit();
  if (!saved) return;

  isModerating.value = true;
  error.value = '';
  success.value = '';

  try {
    await $fetch('/api/admin/manage-submissions', {
      method: 'POST',
      body: {
        submission_id: submissionMeta.value.submissionId,
        content_type: 'verb',
        action, // 'approve' | 'reject'
        user_id: currentUserId.value,
        reason: reason || undefined,
      },
    });

    if (action === 'approve') {
      submissionMeta.value = {
        ...submissionMeta.value,
        status: 'approved',
      };
      const msg =
        t('admin.editPendingVerb.successApproved')
        || 'Soumission approuvée et ajoutée au dictionnaire.';
      toast.success(msg);
      success.value = msg;
    } else if (action === 'reject') {
      submissionMeta.value = {
        ...submissionMeta.value,
        status: 'rejected',
      };
      const msg =
        t('admin.editPendingVerb.successRejected')
        || 'Soumission rejetée.';
      toast.success(msg);
      success.value = msg;
    }
  } catch (err) {
    console.error('Erreur modération pending-verb (admin):', err);
    const apiMsg =
      err?.data?.statusMessage
      || err?.data?.message
      || t('admin.editPendingVerb.errors.moderation')
      || 'Impossible de traiter cette soumission.';
    error.value = apiMsg;
    toast.error(apiMsg);
  } finally {
    isModerating.value = false;
  }
};

const onApprove = () => moderate('approve');
const onReject = () => moderate('reject');

// Delete (DELETE)
const onDelete = async () => {
  if (!slug.value || !currentUserId.value) return;

  const confirmed = await confirmStore.ask({
    title:
      t('admin.editPendingVerb.confirmTitle')
      || t('contributor.editPendingVerb.confirmTitle')
      || t('contributor.submissions.actions.delete')
      || 'Supprimer cette soumission ?',
    message:
      t('admin.editPendingVerb.confirmDelete')
      || t('contributor.editPendingVerb.confirmDelete')
      || 'Voulez-vous vraiment supprimer cette soumission ? Cette action est définitive.',
    confirmLabel:
      t('common.actions.delete')
      || t('contributor.submissions.actions.delete')
      || 'Supprimer',
    cancelLabel:
      t('common.actions.cancel')
      || 'Annuler',
    danger: true,
  });

  if (!confirmed) return;

  isSubmitting.value = true;
  error.value = '';
  success.value = '';

  try {
    await $fetch(`/api/admin/pending-verb/${slug.value}`, {
      method: 'DELETE',
    });

    const msg =
      t('admin.editPendingVerb.deleted')
      || t('contributor.editPendingVerb.deleted')
      || 'La soumission a été supprimée.';
    toast.success(msg);

    await router.push('/admin/manage-pendings');
  } catch (err) {
    console.error('Erreur lors de la suppression du pending-verb (admin) :', err);
    const apiMsg =
      err?.data?.statusMessage
      || err?.data?.message
      || t('admin.editPendingVerb.errors.delete')
      || t('contributor.editPendingVerb.errors.delete')
      || 'Impossible de supprimer cette soumission.';
    error.value = apiMsg;
    toast.error(apiMsg);
  } finally {
    isSubmitting.value = false;
  }
};

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

// Chargement initial des listes de verbes
onMounted(() => {
  if (!Array.isArray(verbStore.items) || !verbStore.items.length) {
    verbStore.fetchAll();
  }
});
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

/* Carte principale */
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

/* Meta soumission (statut + date) */
.lk-contrib-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.75rem;
}

.lk-contrib-meta__status {
  display: inline-flex;
  align-items: center;
}

.lk-contrib-meta__date {
  font-size: 0.82rem;
  color: var(--text-muted, #6b7280);
}

/* Pastilles statut */
.lk-contrib-status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
  border: 1px solid transparent;
}

.lk-contrib-status-pill--pending {
  background: #fef3c7;
  color: #92400e;
  border-color: #fde68a;
}

.lk-contrib-status-pill--approved {
  background: #ecfdf5;
  color: #166534;
  border-color: #bbf7d0;
}

.lk-contrib-status-pill--rejected {
  background: #fef2f2;
  color: #b91c1c;
  border-color: #fecaca;
}

/* Titre carte */
.lk-contrib-card__title {
  margin: 0.9rem 0 0.15rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.lk-contrib-card__subtitle {
  margin: 0 0 0.35rem;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

/* Messages info / succès / erreur dans la carte */
.lk-contrib-message {
  margin-top: 0.65rem;
  padding: 0.65rem 0.8rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
}

.lk-contrib-message--info {
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: var(--primary, #2563eb);
}

.lk-contrib-message--error {
  background: rgba(248, 113, 113, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.6);
  color: #b91c1c;
}

.lk-contrib-message--success {
  background: rgba(22, 163, 74, 0.12);
  border: 1px solid rgba(22, 163, 74, 0.6);
  color: #166534;
}

/* États génériques (non connecté / chargement / erreur globale) */
.lk-submissions-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  margin-top: 0.75rem;
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

/* Formulaire */
.lk-contrib-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.75rem;
}

/* Fieldset & legend */
.lk-contrib-fieldset {
  border: 1px solid rgba(148, 163, 184, 0.5);
  border-radius: 0.9rem;
  padding: 1rem 1rem 1.1rem;
}

.lk-contrib-legend {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-default, #111827);
  padding: 0 0.35rem;
  margin-bottom: 0.6rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.lk-contrib-legend-tag {
  font-size: 0.75rem;
  padding: 0.06rem 0.45rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  color: var(--text-muted, #6b7280);
  background: var(--surface-default, #f9fafb);
}

/* Lignes / colonnes */
.lk-contrib-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.7rem;
}

.lk-contrib-row--half {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.lk-contrib-row__col {
  flex: 1 1 220px;
}

/* Labels */
.lk-contrib-label {
  font-size: 0.87rem;
  font-weight: 500;
  color: var(--text-default, #111827);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.lk-contrib-label--checkbox {
  cursor: pointer;
}

.lk-contrib-label--checkbox input {
  margin-right: 0.35rem;
}

.lk-contrib-label-hint {
  font-size: 0.8rem;
  color: var(--text-muted, #6b7280);
  margin: 0.15rem 0 0;
}

.lk-contrib-required {
  color: #b91c1c;
}

/* Inputs / selects / textareas */
.lk-contrib-input,
.lk-contrib-select,
.lk-contrib-textarea {
  width: 100%;
  border-radius: 0.65rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.8));
  padding: 0.45rem 0.7rem;
  font-size: 0.9rem;
  background: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
}

.lk-contrib-input:focus-visible,
.lk-contrib-select:focus-visible,
.lk-contrib-textarea:focus-visible {
  outline: none;
  border-color: var(--primary, #2563eb);
  box-shadow: 0 0 0 1px var(--primary, #2563eb);
}

.lk-contrib-textarea {
  resize: vertical;
  min-height: 4.5rem;
}

/* Actions form */
.lk-contrib-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  justify-content: flex-end;
  margin-top: 0.75rem;
}

.lk-contrib-btn {
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

.lk-contrib-btn i {
  font-size: 0.9rem;
}

/* Primary */
.lk-contrib-btn--primary {
  background: var(--primary, #2563eb);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.3);
}

.lk-contrib-btn--primary:hover,
.lk-contrib-btn--primary:focus-visible {
  outline: none;
  background: var(--primary-hover, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.2);
}

/* Secondary */
.lk-contrib-btn--secondary {
  background: var(--surface-default, #f9fafb);
  color: var(--text-default, #111827);
  border-color: var(--border-subtle, rgba(148, 163, 184, 0.8));
}

.lk-contrib-btn--secondary:hover,
.lk-contrib-btn--secondary:focus-visible {
  outline: none;
  background: rgba(148, 163, 184, 0.18);
  transform: translateY(-1px);
}

/* Danger */
.lk-contrib-btn--danger {
  background: #fee2e2;
  color: #b91c1c;
  border-color: #fecaca;
}

.lk-contrib-btn--danger:hover,
.lk-contrib-btn--danger:focus-visible {
  outline: none;
  background: #fecaca;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 720px) {
  .lk-contrib-card {
    padding: 1.25rem 1rem 1.4rem;
  }

  .lk-contrib-row--half {
    flex-direction: column;
  }

  .lk-contrib-actions {
    justify-content: stretch;
  }

  .lk-contrib-actions .lk-contrib-btn {
    flex: 1 1 auto;
    justify-content: center;
  }
}
</style>

