<template>
  <main
    class="lk-contrib-page"
    aria-labelledby="contrib-edit-pending-word-title"
  >
    <!-- HERO -->
    <LkPageHero
      id="contrib-edit-pending-word-title"
      :eyebrow="t('contributor.editPendingWord.eyebrow') || t('contributor.addWord.eyebrow')"
      :title="t('contributor.editPendingWord.title') || t('contributor.addWord.title')"
      :description="t('contributor.editPendingWord.subtitle') || t('contributor.addWord.subtitle')"
      :side-aria-label="t('contributor.editPendingWord.meta.label') || t('contributor.addWord.meta.label')"
      :show-last-expressions="true"
    >
      <!-- Meta sous le titre -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-pen-to-square" aria-hidden="true"></i>
          <span>
            {{
              t('contributor.editPendingWord.meta.label')
              || t('contributor.addWord.meta.label')
            }}
          </span>
        </p>
      </template>

      <!-- Colonne de droite : actions contributeur -->
      <template #side>
        <div class="lk-contrib-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <!-- Carte formulaire -->
    <section
      class="lk-contrib-card"
      aria-describedby="contrib-edit-pending-word-help"
    >
      <header class="lk-contrib-card__header">
        <!-- Aide générale -->
        <p
          id="contrib-edit-pending-word-help"
          class="lk-contrib-help"
        >
          {{
            t('contributor.editPendingWord.help')
            || t('contributor.addWord.helpRequired')
          }}
        </p>

        <p class="lk-contrib-hint">
          {{
            t('contributor.editPendingWord.reviewNotice')
            || t('contributor.addWord.reviewNotice')
          }}
        </p>

        <!-- Meta soumission : statut + date -->
        <div
          v-if="submissionMeta"
          class="lk-contrib-meta"
        >
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
              t('contributor.editPendingWord.meta.submittedAtLabel')
              || t('contributor.submissions.meta.createdAt')
            }}
            :
            <time :datetime="submissionMeta.createdAtRaw">
              {{ submissionMeta.createdAtFormatted }}
            </time>
          </span>
        </div>

        <!-- Titre dynamique = mot -->
        <h2 class="lk-contrib-card__title">
          {{
            form.singular && form.singular.trim()
              ? form.singular.trim()
              : (
                t('contributor.editPendingWord.cardTitleFallback')
                || t('contributor.addWord.cardTitleFallback')
              )
          }}
        </h2>

        <p class="lk-contrib-card__subtitle">
          {{
            t('contributor.editPendingWord.subtitle')
            || t('contributor.addWord.subtitle')
          }}
        </p>

        <!-- Si non-pending : message de verrouillage -->
        <p
          v-if="submissionMeta && submissionMeta.status !== 'pending'"
          class="lk-contrib-message lk-contrib-message--info"
        >
          {{ t('contributor.editPendingWord.locked') || 'Cette soumission a déjà été traitée et n’est plus modifiable.' }}
        </p>
      </header>

      <!-- État : non connecté -->
      <div
        v-if="!currentUserId"
        class="lk-submissions-status lk-submissions-status--info"
      >
        <i class="fas fa-user-lock" aria-hidden="true" />
        <span>
          {{ t('contributor.submissions.mustBeLoggedIn') }}
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
          {{ t('contributor.editPendingWord.loading') || 'Chargement de votre soumission…' }}
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
            {{
              t('contributor.addWord.sections.kikongo')
              || t('details.common.kikongoData')
            }}
          </legend>

          <!-- Singulier -->
          <div class="lk-contrib-row">
            <label
              for="singular"
              class="lk-contrib-label"
            >
              {{ t('details.word.singular') || 'Singulier' }}
              <span class="lk-contrib-required">*</span>
            </label>

            <input
              id="singular"
              v-model.trim="form.singular"
              type="text"
              required
              class="lk-contrib-input"
              :disabled="isReadOnly"
              :placeholder="t('contributor.addWord.placeholders.singular') || 'nkento, mwana…'"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addWord.hints.singular')
                || 'Le mot au singulier, tel qu’il est utilisé en kikongo.'
              }}
            </p>
          </div>

          <!-- Pluriel -->
          <div class="lk-contrib-row">
            <label
              for="plural"
              class="lk-contrib-label"
            >
              {{ t('details.word.plural') || 'Pluriel' }}
            </label>

            <input
              id="plural"
              v-model.trim="form.plural"
              type="text"
              class="lk-contrib-input"
              :disabled="isReadOnly"
              :placeholder="t('contributor.addWord.placeholders.plural') || 'bankento, bana…'"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addWord.hints.plural')
                || 'Indiquez le pluriel si vous le connaissez. Sinon, vous pouvez laisser vide.'
              }}
            </p>
          </div>

          <!-- Classe nominale -->
          <div class="lk-contrib-row">
            <label
              for="class_id"
              class="lk-contrib-label"
            >
              {{ t('details.word.nominalClass') || 'Classe nominale' }}
              <span class="lk-contrib-required">*</span>
            </label>

            <select
              id="class_id"
              v-model.number="form.class_id"
              class="lk-contrib-select"
              required
              :disabled="isReadOnly || isLoadingClasses"
            >
              <option :value="null" disabled>
                {{
                  t('contributor.addWord.placeholders.classId')
                  || 'Choisissez une classe nominale…'
                }}
              </option>

              <option
                v-for="klass in nominalClasses"
                :key="klass.class_id"
                :value="klass.class_id"
              >
                {{ klass.class_name }}
              </option>
            </select>

            <p
              v-if="isLoadingClasses"
              class="lk-contrib-hint"
              aria-live="polite"
            >
              {{
                t('contributor.addWord.loadingClasses')
                || 'Chargement des classes nominales…'
              }}
            </p>

            <p
              v-else-if="classesError"
              class="lk-contrib-hint"
              role="alert"
            >
              {{ classesError }}
            </p>

            <p class="lk-contrib-hint">
              {{ t('contributor.addWord.hints.classId') }}
            </p>
          </div>

          <!-- Variabilité du nombre -->
          <div class="lk-contrib-row">
            <label
              for="number_variability"
              class="lk-contrib-label"
            >
              {{
                t('details.word.numberVariability.label')
                || 'Variabilité du nombre'
              }}
            </label>

            <p class="lk-contrib-label-hint">
              {{
                t('contributor.addWord.hints.numberVariabilityShort')
                || 'Optionnel : indiquez si le mot est plutôt singulier, pluriel, ou invariable.'
              }}
            </p>

            <select
              id="number_variability"
              v-model="form.number_variability"
              class="lk-contrib-select"
              :disabled="isReadOnly"
            >
              <option :value="null">
                {{
                  t('contributor.addWord.numberVariability.default')
                  || '— Laisser par défaut —'
                }}
              </option>
              <option value="variable">
                {{
                  t('details.word.numberVariability.variable')
                  || 'Variable (singulier/pluriel distincts)'
                }}
              </option>
              <option value="singular_only">
                {{
                  t('details.word.numberVariability.singularOnly')
                  || 'Singulier uniquement'
                }}
              </option>
              <option value="plural_only">
                {{
                  t('details.word.numberVariability.pluralOnly')
                  || 'Pluriel uniquement'
                }}
              </option>
              <option value="invariable">
                {{
                  t('details.word.numberVariability.invariable')
                  || 'Invariable'
                }}
              </option>
            </select>

            <p class="lk-contrib-hint">
              {{
                t('contributor.addWord.hints.numberVariability')
                || 'Optionnel : indiquez si le mot ne s’emploie qu’au singulier, au pluriel, ou s’il est invariable.'
              }}
            </p>
          </div>

          <!-- Phonétique -->
          <div class="lk-contrib-row">
            <label
              for="phonetic"
              class="lk-contrib-label"
            >
              {{ t('details.common.phonetic') || 'Phonétique' }}
            </label>

            <input
              id="phonetic"
              v-model.trim="form.phonetic"
              type="text"
              class="lk-contrib-input"
              :disabled="isReadOnly"
              :placeholder="t('contributor.addWord.placeholders.phonetic') || '[nkènto]…'"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addWord.hints.phonetic')
                || 'Vous pouvez utiliser les crochets et les accents pour préciser la prononciation.'
              }}
            </p>
          </div>
        </fieldset>

        <!-- Bloc Mot dérivé -->
        <fieldset class="lk-contrib-fieldset">
          <legend class="lk-contrib-legend">
            {{ t('contributor.addWord.sections.derived') }}
            <span class="lk-contrib-legend-tag">
              {{ t('contributor.addWord.sections.derivedOptional') }}
            </span>
          </legend>

          <!-- Checkbox : mot dérivé ? -->
          <div class="lk-contrib-row">
            <label
              for="derived_word"
              class="lk-contrib-label lk-contrib-label--checkbox"
            >
              <input
                id="derived_word"
                v-model="form.derived_word"
                type="checkbox"
                :disabled="isReadOnly"
              />
              <span>{{ t('contributor.addWord.fields.derivedWord') }}</span>
            </label>
            <p class="lk-contrib-hint">
              {{ t('contributor.addWord.hints.derivedWord') }}
            </p>
          </div>

          <!-- Si mot dérivé : base word + base verb -->
          <div
            v-if="form.derived_word"
            class="lk-contrib-row lk-contrib-row--half"
          >
            <!-- Colonne : mot de base -->
            <div class="lk-contrib-row__col">
              <label
                for="base_word_search"
                class="lk-contrib-label"
              >
                {{ t('contributor.addWord.fields.derivedFromWord') }}
              </label>

              <input
                id="base_word_search"
                v-model="baseWordSearch"
                type="search"
                class="lk-contrib-input"
                :disabled="isReadOnly"
                :placeholder="t('contributor.addWord.placeholders.baseWordSearch')"
              />

              <p class="lk-contrib-hint">
                {{ t('contributor.addWord.hints.baseWordSearch') }}
              </p>

              <!-- Suggestions mots -->
              <ul
                v-if="baseWordSearch && baseWordOptions.length"
                class="lk-contrib-suggestions"
              >
                <li
                  v-for="word in baseWordOptions"
                  :key="word.slug || word.word_id || word.id"
                  class="lk-contrib-suggestions__item"
                >
                  <button
                    type="button"
                    class="lk-contrib-suggestions__btn"
                    :disabled="isReadOnly"
                    @click="selectBaseWord(word)"
                  >
                    <span class="lk-contrib-suggestions__main">
                      <span class="lk-contrib-suggestions__lexeme">
                        {{ word.singular || '—' }}
                        <span
                          v-if="word.plural"
                          class="lk-contrib-suggestions__secondary"
                        >
                          · {{ word.plural }}
                        </span>
                      </span>
                    </span>

                    <span
                      v-if="word.phonetic"
                      class="lk-contrib-suggestions__phonetic"
                    >
                      [[{{ word.phonetic }}]]
                    </span>
                  </button>
                </li>
              </ul>

              <p
                v-else-if="baseWordSearch && !baseWordOptions.length"
                class="lk-contrib-hint lk-contrib-hint--muted"
              >
                {{ t('contributor.addWord.baseWordNoResults') }}
              </p>

              <p
                v-if="selectedBaseWordLabel"
                class="lk-contrib-selected-base"
              >
                {{
                  t('contributor.addWord.baseWordSelected', {
                    word: selectedBaseWordLabel,
                  })
                }}
              </p>
            </div>

            <!-- Colonne : verbe de base -->
            <div class="lk-contrib-row__col">
              <label
                for="base_verb_search"
                class="lk-contrib-label"
              >
                {{ t('contributor.addWord.fields.derivedFromVerb') }}
              </label>

              <input
                id="base_verb_search"
                v-model="baseVerbSearch"
                type="search"
                class="lk-contrib-input"
                :disabled="isReadOnly"
                :placeholder="t('contributor.addWord.placeholders.baseVerbSearch')"
              />

              <p class="lk-contrib-hint">
                {{ t('contributor.addWord.hints.baseVerbSearch') }}
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
                        {{ verb.singular || verb.name || '—' }}
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
                {{ t('contributor.addWord.baseVerbNoResults') }}
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
              {{ t('details.common.fr') || 'Français' }}
            </label>

            <textarea
              id="translation_fr"
              v-model.trim="form.translation_fr"
              rows="3"
              class="lk-contrib-textarea"
              :disabled="isReadOnly"
              :placeholder="t('contributor.addWord.placeholders.translationFr') || 'Sens FR séparés par des virgules…'"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addWord.hints.translationFr')
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
              {{ t('details.common.en') || 'Anglais' }}
            </label>

            <textarea
              id="translation_en"
              v-model.trim="form.translation_en"
              rows="3"
              class="lk-contrib-textarea"
              :disabled="isReadOnly"
              :placeholder="t('contributor.addWord.placeholders.translationEn') || 'EN meanings separated by commas…'"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addWord.hints.translationEn')
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
          <button
            type="submit"
            class="lk-contrib-btn lk-contrib-btn--primary"
            :disabled="isSubmitting || isReadOnly"
          >
            <i class="fas fa-save" aria-hidden="true"></i>
            <span>
              {{
                isSubmitting
                  ? (
                    t('contributor.editPendingWord.actions.saving')
                    || t('contributor.addWord.actions.saving')
                    || 'Enregistrement en cours…'
                  )
                  : (
                    t('contributor.editPendingWord.actions.save')
                    || 'Enregistrer les modifications'
                  )
              }}
            </span>
          </button>

          <button
            type="button"
            class="lk-contrib-btn lk-contrib-btn--secondary"
            :disabled="isSubmitting || isReadOnly"
            @click="onReset"
          >
            <i class="fas fa-rotate-left" aria-hidden="true"></i>
            <span>
              {{
                t('contributor.editPendingWord.actions.reset')
                || t('contributor.addWord.actions.reset')
                || 'Réinitialiser'
              }}
            </span>
          </button>

          <button
            type="button"
            class="lk-contrib-btn lk-contrib-btn--danger"
            :disabled="isSubmitting || isReadOnly"
            @click="onDelete"
          >
            <i class="fas fa-trash-alt" aria-hidden="true"></i>
            <span>
              {{
                t('contributor.editPendingWord.actions.delete')
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSeoMeta, useAsyncData } from '#imports';
import * as Toastification from 'vue-toastification';
import { useConfirmStore } from '~/stores/confirmStore';

import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import { useAuthStore } from '~/stores/authStore';
import { useWordStore } from '~/stores/wordStore';
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
  singular: '',
  plural: '',
  class_id: null,
  number_variability: null,
  phonetic: '',
  translation_fr: '',
  translation_en: '',
  derived_word: false,
  derived_from_word: '',
  derived_from_verb: '',
});

const isSubmitting = ref(false);
const error = ref('');
const success = ref('');

const submissionMeta = ref(null); // { status, createdAtRaw, createdAtFormatted }
const originalPayload = ref(null); // pour reset

// Lecture statut pour lock
const isReadOnly = computed(
  () => submissionMeta.value && submissionMeta.value.status !== 'pending',
);

// --------- Stores pour suggestions ---------
const wordStore = useWordStore();
const verbStore = useVerbStore();

const baseWordSearch = ref('');
const baseVerbSearch = ref('');

// SEO
useSeoMeta({
  title: () =>
    t('contributor.editPendingWord.meta.title')
    || 'Contributeur · Modifier un mot en attente – Lexikongo',
  description: () =>
    t('contributor.editPendingWord.meta.description')
    || 'Modifiez une soumission de mot en kikongo tant qu’elle est encore en attente de validation.',
});

// Classes nominales
const {
  data: classesData,
  pending: isLoadingClasses,
  error: classesErrorRaw,
} = await useAsyncData('nominal-classes', () =>
  $fetch('/api/nominal-classes'),
);

const nominalClasses = computed(() => classesData.value || []);
const classesError = computed(() =>
  classesErrorRaw.value
    ? (
      t('contributor.addWord.errors.loadClasses')
      || 'Impossible de charger la liste des classes nominales.'
    )
    : '',
);

// 🔹 Chargement de la soumission à partir du slug + user_id
const {
  data: submissionData,
  pending: isLoadingSubmission,
  error: submissionErrorRaw,
} = await useAsyncData(
  'edit-pending-word',
  async () => {
    if (!slug.value || !currentUserId.value) return null;

    return $fetch(
      `/api/contributor/pending-word/${slug.value}?user_id=${currentUserId.value}`,
    );
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
    || t('contributor.editPendingWord.error.generic')
    || 'Impossible de charger cette soumission.'
  );
});

// Hydratation du formulaire depuis l’API
const hydrateFromSubmission = (payload) => {
  if (!payload) return;

  // On accepte soit un objet à plat, soit { submission, ... }
  const s = payload.submission || payload;

  form.value.singular = s.singular || '';
  form.value.plural = s.plural || '';
  form.value.class_id = s.class_id ?? null;
  form.value.number_variability = s.number_variability || null;
  form.value.phonetic = s.phonetic || '';

  // traductions à plat (comme dans /submissions)
  form.value.translation_fr = payload.translation_fr || '';
  form.value.translation_en = payload.translation_en || '';

  form.value.derived_word = !!s.derived_word;
  form.value.derived_from_word = s.derived_from_word || '';
  form.value.derived_from_verb = s.derived_from_verb || '';

  // helpers pour autocomplete
  baseWordSearch.value = payload.base_word_label || '';
  baseVerbSearch.value = payload.base_verb_label || '';

  // meta soumission
  const createdAtRaw = s.created_at || null;
  submissionMeta.value = {
    status: s.status || 'pending',
    createdAtRaw,
    createdAtFormatted: createdAtRaw
      ? d(new Date(createdAtRaw), 'short')
      : '',
  };

  // snapshot pour reset
  originalPayload.value = JSON.parse(JSON.stringify(payload));
};

// Watch sur la data API
watch(
  submissionData,
  (val) => {
    if (!val) return;
    hydrateFromSubmission(val);
  },
  { immediate: true },
);

// Helpers : payload traductions (au cas où l’API évolue)
const buildTranslationsPayload = () => {
  const translations = [];

  if (form.value.translation_fr?.trim()) {
    translations.push({
      language_code: 'fr',
      meaning: form.value.translation_fr.trim(),
    });
  }

  if (form.value.translation_en?.trim()) {
    translations.push({
      language_code: 'en',
      meaning: form.value.translation_en.trim(),
    });
  }

  return translations;
};

// Autocomplete MOT de base
const baseWordOptions = computed(() => {
  const q = baseWordSearch.value.trim().toLowerCase();
  const list = Array.isArray(wordStore.items) ? wordStore.items : [];
  if (!q) return [];
  return list
    .filter((w) => {
      const singular = (w.singular || '').toLowerCase();
      const plural = (w.plural || '').toLowerCase();
      const fr = (w.translation_fr || '').toLowerCase();
      const en = (w.translation_en || '').toLowerCase();
      return (
        singular.includes(q)
        || plural.includes(q)
        || fr.includes(q)
        || en.includes(q)
      );
    })
    .slice(0, 10);
});

const selectedBaseWord = computed(() => {
  const id = form.value.derived_from_word;
  if (!id) return null;
  const list = Array.isArray(wordStore.items) ? wordStore.items : [];
  return list.find(
    (w) => w.word_id === id || w.id === id,
  ) || null;
});

const selectedBaseWordLabel = computed(() => {
  if (!selectedBaseWord.value) return '';
  const s = selectedBaseWord.value.singular || '—';
  const p = selectedBaseWord.value.plural;
  return p ? `${s} · ${p}` : s;
});

const selectBaseWord = (word) => {
  const id = word.word_id ?? word.id ?? null;
  if (!id) return;
  form.value.derived_from_word = id;
  baseWordSearch.value = word.singular || word.plural || '';
};

// Autocomplete VERBE de base
const baseVerbOptions = computed(() => {
  const q = baseVerbSearch.value.trim().toLowerCase();
  const list = Array.isArray(verbStore.items) ? verbStore.items : [];
  if (!q) return [];
  return list
    .filter((v) => {
      const infinitive = (v.singular || v.name || '').toLowerCase();
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
  const id = form.value.derived_from_verb;
  if (!id) return null;
  const list = Array.isArray(verbStore.items) ? verbStore.items : [];
  return (
    list.find((v) => v.verb_id === id || v.id === id) || null
  );
});

const selectedBaseVerbLabel = computed(() => {
  if (!selectedBaseVerb.value) return '';
  const base = selectedBaseVerb.value.singular
    || selectedBaseVerb.value.name
    || '—';
  return `ku ${base}`;
});

const selectBaseVerb = (verb) => {
  const id = verb.verb_id ?? verb.id ?? null;
  if (!id) return;
  form.value.derived_from_verb = id;
  baseVerbSearch.value = verb.singular || verb.name || '';
};

// Reset = revenir à l’état API initial
const onReset = () => {
  error.value = '';
  success.value = '';
  if (originalPayload.value) {
    hydrateFromSubmission(originalPayload.value);
  }
};

// Submit (PUT)
const onSubmit = async () => {
  error.value = '';
  success.value = '';

  if (!currentUserId.value) {
    error.value = t('contributor.submissions.mustBeLoggedIn');
    return;
  }

  if (isReadOnly.value) {
    error.value =
      t('contributor.editPendingWord.error.locked')
      || 'Cette soumission n’est plus modifiable.';
    return;
  }

  if (!form.value.singular?.trim()) {
    error.value =
      t('contributor.editPendingWord.error.missingSingular')
      || 'Merci d’indiquer au moins le singulier du mot.';
    return;
  }

  if (!form.value.class_id) {
    error.value =
      t('contributor.editPendingWord.error.missingClass')
      || 'Merci de choisir une classe nominale.';
    return;
  }

  if (
    !form.value.translation_fr?.trim()
    && !form.value.translation_en?.trim()
  ) {
    error.value =
      t('contributor.editPendingWord.error.missingTranslations')
      || 'Merci d’ajouter au moins une traduction (FR ou EN).';
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch(`/api/contributor/pending-word/${slug.value}`, {
      method: 'PUT',
      body: {
        user_id: currentUserId.value,
        singular: form.value.singular,
        plural: form.value.plural || null,
        class_id: form.value.class_id,
        phonetic: form.value.phonetic || null,
        number_variability: form.value.number_variability || null,
        derived_word: form.value.derived_word ? 1 : 0,
        derived_from_word: form.value.derived_from_word || null,
        derived_from_verb: form.value.derived_from_verb || null,
        translation_fr: form.value.translation_fr || '',
        translation_en: form.value.translation_en || '',
        // translations: buildTranslationsPayload(), // si tu en as besoin côté API plus tard
      },
    });

    const msg =
      t('contributor.editPendingWord.success')
      || 'Vos modifications ont bien été enregistrées.';
    success.value = msg;
    toast.success(msg);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du mot en attente :', err);
    const apiMsg =
      err?.data?.statusMessage
      || err?.data?.message
      || t('contributor.editPendingWord.error.generic')
      || 'Impossible de mettre à jour cette soumission.';
    error.value = apiMsg;
    toast.error(apiMsg);
  } finally {
    isSubmitting.value = false;
  }
};

// Delete (DELETE)
// Delete (DELETE)
const onDelete = async () => {
  if (!slug.value || !currentUserId.value) return;

  // 1) Ouvrir le modal de confirmation
  const confirmed = await confirmStore.ask({
    title:
      t('contributor.editPendingWord.confirmTitle')
      || t('contributor.submissions.actions.delete')
      || 'Supprimer cette soumission ?',
    message:
      t('contributor.editPendingWord.confirmDelete')
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

  if (!confirmed) {
    return;
  }

  // 2) Si confirmé → on supprime
  isSubmitting.value = true;
  error.value = '';
  success.value = '';

  try {
    await $fetch(`/api/contributor/pending-word/${slug.value}`, {
      method: 'DELETE',
      body: {
        user_id: currentUserId.value,
      },
    });

    const msg =
      t('contributor.editPendingWord.deleted')
      || 'Votre soumission a été supprimée.';
    toast.success(msg);

    await router.push('/contributor/submissions');
  } catch (err) {
    console.error('Erreur lors de la suppression du pending-word :', err);
    const apiMsg =
      err?.data?.statusMessage
      || err?.data?.message
      || t('contributor.editPendingWord.error.delete')
      || 'Impossible de supprimer cette soumission.';
    error.value = apiMsg;
    toast.error(apiMsg);
  } finally {
    isSubmitting.value = false;
  }
};


// Label de statut (réutilisation des libellés existants)
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

// Chargement initial des listes word / verb
onMounted(() => {
  if (!Array.isArray(wordStore.items) || !wordStore.items.length) {
    wordStore.fetchAll();
  }
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

/* Carte principale (light/dark via tokens) */
.lk-contrib-card {
  background: var(--lk-surface-elevated, var(--surface-elevated, #ffffff));
  border-radius: 1rem;
  padding: 1.5rem 1.25rem 1.75rem;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--lk-border-subtle, var(--border-subtle, rgba(148, 163, 184, 0.35)));
  margin-top: 1.5rem;
}

.lk-contrib-card__header {
  margin-bottom: 1.5rem;
}

.lk-contrib-card__title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0.35rem 0 0.25rem;
  color: var(--lk-text-default, var(--text-default, #111827));
}

.lk-contrib-card__subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: var(--lk-color-muted, var(--text-muted, #6b7280));
}

.lk-contrib-help {
  font-size: 0.95rem;
  color: var(--lk-color-muted, var(--text-muted, #6b7280));
  margin: 0 0 0.25rem;
}

.lk-contrib-hint {
  font-size: 0.82rem;
  color: var(--lk-color-muted, var(--text-muted, #6b7280));
  margin: 0;
}

/* Meta soumission (statut + date) */
.lk-contrib-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.lk-contrib-meta__status {
  display: inline-flex;
}

.lk-contrib-meta__date {
  font-size: 0.8rem;
  color: var(--text-muted, #6b7280);
}

/* Pastille statut */
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

/* Formulaire */
.lk-contrib-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.lk-contrib-fieldset {
  border: 1px solid var(--lk-border-subtle, rgba(148, 163, 184, 0.4));
  border-radius: 0.75rem;
  padding: 1.1rem 1rem 1rem;
  background: var(--lk-surface-default, var(--surface-default, transparent));
}

.lk-contrib-legend {
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0 0.5rem;
  color: var(--lk-color-legend, var(--text-default, #111827));
}

.lk-contrib-legend-tag {
  margin-left: 0.4rem;
  font-size: 0.78rem;
  font-weight: 500;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.16);
  color: var(--lk-color-muted, var(--text-muted, #6b7280));
}

.lk-contrib-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.9rem;
}

.lk-contrib-row--half {
  display: grid;
  gap: 0.75rem;
}

.lk-contrib-row__col {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lk-contrib-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--lk-color-label, var(--text-default, #111827));
}

.lk-contrib-label--checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}

.lk-contrib-required {
  color: #dc2626;
  margin-left: 0.15rem;
}

/* Inputs & textarea */
.lk-contrib-input,
.lk-contrib-select,
.lk-contrib-textarea {
  width: 100%;
  border-radius: 0.55rem;
  border: 1px solid var(--lk-border-input, rgba(148, 163, 184, 0.9));
  padding: 0.6rem 0.75rem;
  font-size: 0.96rem;
  line-height: 1.4;
  background-color: var(--lk-surface-input, #f9fafb);
  color: var(--lk-text-default, var(--text-default, #111827));
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}

.lk-contrib-input:focus,
.lk-contrib-select:focus,
.lk-contrib-textarea:focus {
  outline: none;
  border-color: var(--lk-color-primary, var(--primary, #2563eb));
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25);
  background-color: var(--lk-surface-elevated, #ffffff);
}

.lk-contrib-input:disabled,
.lk-contrib-select:disabled,
.lk-contrib-textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.lk-contrib-textarea {
  resize: vertical;
  min-height: 5.5rem;
}

/* Variante avec préfixe (si besoin plus tard) */
.lk-contrib-input-prefix {
  display: flex;
  align-items: stretch;
  border-radius: 0.55rem;
  overflow: hidden;
  border: 1px solid var(--lk-border-input, rgba(148, 163, 184, 0.9));
  background-color: var(--lk-surface-input, #f9fafb);
}

.lk-contrib-input-prefix__label {
  padding: 0.6rem 0.8rem;
  font-size: 0.94rem;
  font-weight: 500;
  background-color: rgba(15, 23, 42, 0.05);
  color: var(--lk-text-default, var(--text-default, #111827));
  border-right: 1px solid var(--lk-border-input, rgba(148, 163, 184, 0.9));
}

.lk-contrib-input-prefix .lk-contrib-input {
  border: none;
  border-radius: 0;
  background: transparent;
}

/* Hints & messages */
.lk-contrib-hint--derived {
  margin-top: 0.35rem;
  font-style: italic;
}

.lk-contrib-message {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
}

.lk-contrib-message--error {
  color: #b91c1c;
}

.lk-contrib-message--success {
  color: #166534;
}

.lk-contrib-message--info {
  color: #92400e;
}

/* Label hint (variabilité du nombre, etc.) */
.lk-contrib-label-hint {
  font-size: 0.75rem;
  font-style: italic;
  color: var(--lk-text-muted, var(--text-muted, #6b7280));
  margin-top: 0.15rem;
}

/* Autocomplete : suggestions mot & verbe de base */
.lk-contrib-suggestions {
  margin-top: 0.5rem;
  padding: 0;
  list-style: none;
  border-radius: 0.5rem;
  border: 1px solid var(--lk-border-subtle, rgba(15, 23, 42, 0.08));
  background-color: var(--lk-surface-elevated, #ffffff);
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
}

.lk-contrib-suggestions__item + .lk-contrib-suggestions__item {
  border-top: 1px solid rgba(15, 23, 42, 0.06);
}

.lk-contrib-suggestions__btn {
  width: 100%;
  text-align: left;
  padding: 0.6rem 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  transition:
    background-color 0.12s ease,
    transform 0.08s ease;
  color: var(--lk-text-default, var(--text-default, #111827));
}

.lk-contrib-suggestions__btn:hover,
.lk-contrib-suggestions__btn:focus-visible {
  background-color: rgba(37, 99, 235, 0.06);
  transform: translateY(-1px);
}

.lk-contrib-suggestions__btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.lk-contrib-suggestions__main {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem;
  font-weight: 600;
}

.lk-contrib-suggestions__secondary {
  font-weight: 400;
  opacity: 0.8;
  margin-left: 0.25rem;
}

/* Pour les verbes : "ku" bien séparé */
.lk-contrib-suggestions__ku {
  font-size: 0.8rem;
  text-transform: lowercase;
  color: var(--lk-color-primary, var(--primary, #2563eb));
  font-weight: 600;
}

.lk-contrib-suggestions__verb {
  font-weight: 600;
  color: var(--lk-color-primary, var(--primary, #2563eb));
}

/* Phonétique entre crochets / doubles crochets */
.lk-contrib-suggestions__phonetic {
  font-size: 0.82rem;
  opacity: 0.8;
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  white-space: nowrap;
  color: var(--lk-text-muted, var(--text-muted, #6b7280));
}

.lk-contrib-hint--muted {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-top: 0.35rem;
}

/* Chip de rappel du mot/verbe sélectionné */
.lk-contrib-selected-base {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--lk-color-success, #14532d);
}

/* Actions */
.lk-contrib-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.lk-contrib-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  padding: 0.55rem 1.1rem;
  font-size: 0.9rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.lk-contrib-btn--primary {
  background-color: var(--lk-color-primary, var(--primary, #2563eb));
  color: #ffffff;
  box-shadow: 0 12px 25px rgba(37, 99, 235, 0.35);
}

.lk-contrib-btn--secondary {
  background-color: var(--lk-surface-elevated, var(--surface-elevated, #ffffff));
  color: var(--lk-text-default, var(--text-default, #111827));
  border-color: var(--lk-border-subtle, var(--border-subtle, rgba(148, 163, 184, 0.9)));
}

.lk-contrib-btn--danger {
  background-color: #fef2f2;
  color: #b91c1c;
  border-color: #fecaca;
}

.lk-contrib-btn--primary:hover:enabled {
  background-color: #1d4ed8;
}

.lk-contrib-btn--secondary:hover:enabled {
  background-color: var(--lk-surface-hover, var(--surface-hover, #f3f4f6));
}

.lk-contrib-btn--danger:hover:enabled {
  background-color: #fee2e2;
}

.lk-contrib-btn:disabled {
  opacity: 0.6;
  cursor: default;
  box-shadow: none;
}

/* États "pas connecté / chargement / erreur" (réutilise styles submissions) */
.lk-submissions-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  margin-top: 0.5rem;
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

/* Layout responsive */
@media (min-width: 768px) {
  .lk-contrib-page {
    padding: 2rem 1.5rem 3.5rem;
  }

  .lk-contrib-card {
    padding: 1.75rem 1.5rem 2rem;
  }

  .lk-contrib-row--half {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .lk-contrib-card {
    padding: 1.25rem 1rem 1.5rem;
  }

  .lk-contrib-suggestions {
    max-height: 200px;
  }
}
</style>
