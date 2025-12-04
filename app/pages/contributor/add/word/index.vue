<template>
  <main
    class="lk-contrib-page"
    aria-labelledby="contrib-add-word-title"
  >
    <!-- HERO -->
    <LkPageHero
      id="contrib-add-word-title"
      :eyebrow="t('contributor.addWord.eyebrow')"
      :title="t('contributor.addWord.title')"
      :description="t('contributor.addWord.subtitle')"
      :side-aria-label="t('contributor.addWord.meta.label')"
      :show-last-expressions="true"
    >
      <!-- Meta sous le titre -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-hands-helping" aria-hidden="true"></i>
          <span>{{ t('contributor.addWord.meta.label') }}</span>
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
      aria-describedby="contrib-add-word-help"
    >
      <header class="lk-contrib-card__header">
        <p
          id="contrib-add-word-help"
          class="lk-contrib-help"
        >
          {{ t('contributor.addWord.helpRequired') }}
        </p>
        <p class="lk-contrib-hint">
          {{ t('contributor.addWord.reviewNotice') }}
        </p>

        <h2 class="lk-contrib-card__title">
          {{
            form.singular && form.singular.trim()
              ? form.singular.trim()
              : t('contributor.addWord.cardTitleFallback')
          }}
        </h2>

        <p class="lk-contrib-card__subtitle">
          {{ t('contributor.addWord.subtitle') }}
        </p>
      </header>

      <form
        class="lk-contrib-form"
        @submit.prevent="onSubmit"
      >
        <!-- Bloc Kikongo -->
        <fieldset class="lk-contrib-fieldset">
          <legend class="lk-contrib-legend">
            {{ t('contributor.addWord.sections.kikongo') || t('details.common.kikongoData') }}
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
              :placeholder="t('contributor.addWord.placeholders.plural') || 'bankento, bana…'"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addWord.hints.plural')
                  || 'Indiquez le pluriel si vous le connaissez. Sinon, vous pouvez laisser vide.'
              }}
            </p>
          </div>
<!-- Classe nominale (obligatoire) -->
<div class="lk-contrib-row">
  <label
    for="class_id"
    class="lk-contrib-label"
  >
    {{ t('details.word.nominalClass') || 'Classe nominale' }}
    <span class="lk-contrib-required">*</span>
  </label>

  <!-- Select alimenté par nominal_classes -->
  <select
    id="class_id"
    v-model.number="form.class_id"
    class="lk-contrib-select"
    required
  >
    <option :value="null" disabled>
      {{ t('contributor.addWord.placeholders.classId') || 'Choisissez une classe nominale…' }}
    </option>

    <option
      v-for="klass in nominalClasses"
      :key="klass.class_id"
      :value="klass.class_id"
    >
      {{ klass.class_name }}
    </option>
  </select>

  <!-- État de chargement / erreur -->
  <p
    v-if="isLoadingClasses"
    class="lk-contrib-hint"
    aria-live="polite"
  >
    {{ t('contributor.addWord.loadingClasses') || 'Chargement des classes nominales…' }}
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


          <!-- Variabilité du nombre (optionnelle pour l’instant, API l’ignorera tant qu’on ne l’exploite pas) -->
          <div class="lk-contrib-row">
      
<label
  for="number_variability"
  class="lk-contrib-label"
>
  {{ t('details.word.numberVariability.label') || 'Variabilité du nombre' }}
</label>

<p class="lk-contrib-label-hint">
  {{ t('contributor.addWord.hints.numberVariabilityShort') }}
</p>



            <select
              id="number_variability"
              v-model="form.number_variability"
              class="lk-contrib-select"
            >
              <option :value="null">
                {{ t('contributor.addWord.numberVariability.default') || '— Laisser par défaut —' }}
              </option>
              <option value="variable">
                {{ t('details.word.numberVariability.variable') || 'Variable (singulier/pluriel distincts)' }}
              </option>
              <option value="singular_only">
                {{ t('details.word.numberVariability.singularOnly') || 'Singulier uniquement' }}
              </option>
              <option value="plural_only">
                {{ t('details.word.numberVariability.pluralOnly') || 'Pluriel uniquement' }}
              </option>
              <option value="invariable">
                {{ t('details.word.numberVariability.invariable') || 'Invariable' }}
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
              :placeholder="t('contributor.addWord.placeholders.phonetic') || '[nkènto]…'"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addWord.hints.phonetic')
                  || 'Vous pouvez utiliser les crochets et les accents pour préciser la prononciation.'
              }}
            </p>
          </div>
                  <!-- Bloc Mot dérivé (optionnel) -->
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
              />
              <span>{{ t('contributor.addWord.fields.derivedWord') }}</span>
            </label>
            <p class="lk-contrib-hint">
              {{ t('contributor.addWord.hints.derivedWord') }}
            </p>
          </div>

          <!-- Si mot dérivé : permettre de pointer la base -->
        <!-- Si mot dérivé : permettre de pointer la base -->
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

    <!-- Champ de recherche du mot de base -->
    <input
      id="base_word_search"
      v-model="baseWordSearch"
      type="search"
      class="lk-contrib-input"
      :placeholder="t('contributor.addWord.placeholders.baseWordSearch')"
    />

    <p class="lk-contrib-hint">
      {{ t('contributor.addWord.hints.baseWordSearch') }}
    </p>

    <!-- Suggestions -->
    <!-- Suggestions : mots de base -->
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
          @click="selectBaseWord(word)"
        >
          <!-- Partie gauche : singulier · pluriel -->
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

          <!-- Partie droite : phonétique -->
          <span
            v-if="word.phonetic"
            class="lk-contrib-suggestions__phonetic"
          >
            {{ word.phonetic }}
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

    <!-- Rappel du mot sélectionné -->
    <p
      v-if="selectedBaseWordLabel"
      class="lk-contrib-selected-base"
    >
      {{ t('contributor.addWord.baseWordSelected', { word: selectedBaseWordLabel }) }}
    </p>


    <p
      v-else-if="baseWordSearch && !baseWordOptions.length"
      class="lk-contrib-hint lk-contrib-hint--muted"
    >
      {{ t('contributor.addWord.baseWordNoResults') }}
    </p>

    <!-- Rappel du mot sélectionné -->
   
  </div>
  <!-- Colonne : verbe de base (autocomplete sur les verbes existants) -->
  <div class="lk-contrib-row__col">
    <label
      for="base_verb_search"
      class="lk-contrib-label"
    >
      {{ t('contributor.addWord.fields.derivedFromVerb') }}
    </label>

    <!-- Champ de recherche du verbe de base -->
    <input
      id="base_verb_search"
      v-model="baseVerbSearch"
      type="search"
      class="lk-contrib-input"
      :placeholder="t('contributor.addWord.placeholders.baseVerbSearch')"
    />

    <p class="lk-contrib-hint">
      {{ t('contributor.addWord.hints.baseVerbSearch') }}
    </p>

       <!-- Suggestions de verbes -->
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
          @click="selectBaseVerb(verb)"
        >
          <!-- gauche : ku + verbe -->
          <span class="lk-contrib-suggestions__main">
            <span class="lk-contrib-suggestions__ku">ku</span>
            <span class="lk-contrib-suggestions__verb">
              {{ verb.singular || verb.name || '—' }}
            </span>
          </span>

          <!-- droite : phonétique -->
          <span
            v-if="verb.phonetic"
            class="lk-contrib-suggestions__phonetic"
          >
            {{ verb.phonetic }}
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

    <!-- Rappel du verbe sélectionné -->
    <p
      v-if="selectedBaseVerbLabel"
      class="lk-contrib-selected-base"
    >
      {{ t('contributor.addWord.baseVerbSelected', { verb: selectedBaseVerbLabel }) }}
    </p>


    <p
      v-else-if="baseVerbSearch && !baseVerbOptions.length"
      class="lk-contrib-hint lk-contrib-hint--muted"
    >
      {{ t('contributor.addWord.baseVerbNoResults') }}
    </p>

    <!-- Rappel du verbe sélectionné -->

  </div>

</div>

        </fieldset>

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
            :disabled="isSubmitting"
          >
            <i class="fas fa-paper-plane" aria-hidden="true"></i>
            <span>
              {{
                isSubmitting
                  ? (t('contributor.addWord.actions.saving') || 'Envoi de votre proposition…')
                  : (t('contributor.addWord.actions.submit') || 'Proposer ce mot')
              }}
            </span>
          </button>

          <button
            type="button"
            class="lk-contrib-btn lk-contrib-btn--secondary"
            :disabled="isSubmitting"
            @click="onReset"
          >
            <i class="fas fa-undo" aria-hidden="true"></i>
            <span>
              {{ t('contributor.addWord.actions.reset') || 'Réinitialiser le formulaire' }}
            </span>
          </button>
        </div>

        <!-- Lien vers la soumission après succès -->
        <p
          v-if="lastSlug"
          class="lk-contrib-after-success"
        >
          <NuxtLink :to="`/contributor/word/${lastSlug}`">
            {{ t('contributor.addWord.actions.viewSubmission') || 'Voir votre soumission' }}
          </NuxtLink>
        </p>
      </form>
    </section>
  </main>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSeoMeta, useAsyncData } from '#imports';
import * as Toastification from 'vue-toastification';

import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import { useAuthStore } from '~/stores/authStore';
import { useWordStore } from '~/stores/wordStore';
import { useVerbStore } from '~/stores/verbStore';

const { t } = useI18n();
const toast = Toastification.useToast();

const authStore = useAuthStore();
const currentUserId = computed(
  () => authStore.user?.id || authStore.user?.user_id || null,
);

// --------- Formulaire principal ---------
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
const lastSlug = ref(null);

// --------- Stores pour les suggestions ---------
const wordStore = useWordStore();
const verbStore = useVerbStore();

// recherche locale pour le mot de base
const baseWordSearch = ref('');
// recherche locale pour le verbe de base
const baseVerbSearch = ref('');

// --------- SEO ---------
useSeoMeta({
  title: () =>
    t('contributor.addWord.meta.title') ||
    'Contributeur · Proposer un mot en kikongo – Lexikongo',
  description: () =>
    t('contributor.addWord.meta.description') ||
    'Proposez un nouveau mot en kikongo avec sa classe nominale, sa phonétique et ses traductions.',
});

// --------- Nominal classes (SSR-friendly) ---------
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
    ? t('contributor.addWord.errors.loadClasses') ||
      'Impossible de charger la liste des classes nominales.'
    : '',
);

// --------- Helpers traductions ---------
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

// --------- Autocomplete MOT de base (derived_from_word) ---------
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
        singular.includes(q) ||
        plural.includes(q) ||
        fr.includes(q) ||
        en.includes(q)
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

// --------- Autocomplete VERBE de base (derived_from_verb) ---------
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
        infinitive.includes(q) ||
        phon.includes(q) ||
        fr.includes(q) ||
        en.includes(q)
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
  const base = selectedBaseVerb.value.singular || selectedBaseVerb.value.name || '—';
  return `ku ${base}`;
});

const selectBaseVerb = (verb) => {
  const id = verb.verb_id ?? verb.id ?? null;
  if (!id) return;
  form.value.derived_from_verb = id;
  baseVerbSearch.value = verb.singular || verb.name || '';
};

// --------- Reset ---------
const onReset = () => {
  form.value = {
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
  };
  error.value = '';
  success.value = '';
  lastSlug.value = null;
  baseWordSearch.value = '';
  baseVerbSearch.value = '';
};

// --------- Submit ---------
const onSubmit = async () => {
  error.value = '';
  success.value = '';
  lastSlug.value = null;

  if (!currentUserId.value) {
    error.value =
      t('contributor.errors.mustBeLoggedIn') ||
      'Vous devez être connecté pour proposer un mot.';
    return;
  }

  if (!form.value.singular || !form.value.singular.trim()) {
    error.value =
      t('contributor.addWord.errors.requiredSingular') ||
      'Merci de remplir au moins le singulier.';
    return;
  }

  if (!form.value.class_id) {
    error.value =
      t('contributor.addWord.errors.requiredClassId') ||
      'Merci d’indiquer la classe nominale.';
    return;
  }

  const translationsPayload = buildTranslationsPayload();
  if (!translationsPayload.length) {
    error.value =
      t('contributor.addWord.errors.translationRequired') ||
      'Merci de proposer au moins une traduction (FR ou EN).';
    return;
  }

  // Champs dérivés → int ou null
  const derivedFlag = !!form.value.derived_word;

  const derivedFromWordId =
    derivedFlag && form.value.derived_from_word
      ? Number.parseInt(form.value.derived_from_word, 10) || null
      : null;

  const derivedFromVerbId =
    derivedFlag && form.value.derived_from_verb
      ? Number.parseInt(form.value.derived_from_verb, 10) || null
      : null;

  isSubmitting.value = true;

  try {
    const created = await $fetch('/api/contributor/word', {
      method: 'POST',
      body: {
        singular: form.value.singular.trim(),
        plural: form.value.plural?.trim() || null,
        class_id: form.value.class_id,
        number_variability: form.value.number_variability || null,
        phonetic: form.value.phonetic?.trim() || null,
        user_id: currentUserId.value,
        translations: translationsPayload,
        derived_word: derivedFlag ? 1 : 0,
        derived_from_word: derivedFromWordId,
        derived_from_verb: derivedFromVerbId,
      },
    });

    const msg =
      t('contributor.addWord.success') ||
      'Merci ! Votre mot a été soumis et sera vérifié par un administrateur.';
    toast.success(msg);
    success.value = msg;

    if (created && created.slug) {
      lastSlug.value = created.slug;
    }

    onReset();
  } catch (err) {
    console.error('Erreur lors de la soumission du mot :', err);
    const apiMsg =
      err?.data?.statusMessage ||
      t('contributor.addWord.errors.generic') ||
      'Erreur lors de l’envoi de votre proposition.';
    error.value = apiMsg;
    toast.error(apiMsg);
  } finally {
    isSubmitting.value = false;
  }
};

// --------- Chargement initial des listes word / verb ---------
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

/* En-têtes locaux (au cas où, même si LkPageHero gère le header) */
.lk-contrib-header {
  margin-bottom: 1.5rem;
}

.lk-contrib-eyebrow {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #6b7280);
  margin-bottom: 0.25rem;
}

.lk-contrib-title {
  font-size: clamp(1.6rem, 2.4vw, 2rem);
  font-weight: 700;
  margin: 0;
}

.lk-contrib-subtitle {
  margin-top: 0.35rem;
  margin-bottom: 0;
  color: var(--text-muted, #6b7280);
  font-size: 0.98rem;
}

/* Carte principale (light/dark via tokens) */
.lk-contrib-card {
  background: var(--surface-elevated, #ffffff);
  border-radius: 1rem;
  padding: 1.5rem 1.25rem 1.75rem;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.35));
}

.lk-contrib-card__header {
  margin-bottom: 1.5rem;
}

.lk-contrib-card__title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0.35rem 0 0.25rem;
  color: var(--text-default, #111827);
}

.lk-contrib-card__subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-muted, #6b7280);
}

.lk-contrib-help {
  font-size: 0.95rem;
  color: var(--text-muted, #6b7280);
  margin: 0 0 0.25rem;
}

/* Formulaire */
.lk-contrib-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.lk-contrib-fieldset {
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  border-radius: 0.75rem;
  padding: 1.1rem 1rem 1rem;
  background: var(--surface-default, transparent);
}

.lk-contrib-legend {
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0 0.5rem;
  color: var(--text-default, #111827);
}

.lk-contrib-legend-tag {
  margin-left: 0.4rem;
  font-size: 0.78rem;
  font-weight: 500;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.16);
  color: var(--text-muted, #6b7280);
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
  color: var(--text-default, #111827);
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
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.9));
  padding: 0.6rem 0.75rem;
  font-size: 0.96rem;
  line-height: 1.4;
  background-color: var(--surface-elevated, #f9fafb);
  color: var(--text-default, #111827);
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
  border-color: var(--primary, #2563eb);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25);
  background-color: var(--surface-elevated, #ffffff);
}

.lk-contrib-textarea {
  resize: vertical;
  min-height: 5.5rem;
}

/* Variante avec préfixe (si tu en ajoutes plus tard) */
.lk-contrib-input-prefix {
  display: flex;
  align-items: stretch;
  border-radius: 0.55rem;
  overflow: hidden;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.9));
  background-color: var(--surface-elevated, #f9fafb);
}

.lk-contrib-input-prefix__label {
  padding: 0.6rem 0.8rem;
  font-size: 0.94rem;
  font-weight: 500;
  background-color: rgba(15, 23, 42, 0.05);
  color: var(--text-default, #111827);
  border-right: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.9));
}

.lk-contrib-input-prefix .lk-contrib-input {
  border: none;
  border-radius: 0;
  background: transparent;
}

/* Hints & messages */
.lk-contrib-hint {
  font-size: 0.82rem;
  color: var(--text-muted, #6b7280);
  margin: 0;
}

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

/* Label hint (variabilité du nombre, etc.) */
.lk-contrib-label-hint {
  font-size: 0.75rem;
  font-style: italic;
  color: var(--text-muted, #6b7280);
  margin-top: 0.15rem;
}

/* Autocomplete : suggestions mot & verbe de base */
.lk-contrib-suggestions {
  margin-top: 0.5rem;
  padding: 0;
  list-style: none;
  border-radius: 0.5rem;
  border: 1px solid var(--border-subtle, rgba(15, 23, 42, 0.08));
  background-color: var(--surface-elevated, #ffffff);
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
  color: var(--text-default, #111827);
}

.lk-contrib-suggestions__btn:hover,
.lk-contrib-suggestions__btn:focus-visible {
  background-color: rgba(37, 99, 235, 0.06);
  transform: translateY(-1px);
}

.lk-contrib-suggestions__main {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem;
  font-weight: 600;
}

/* Pour les mots (singulier · pluriel) */
.lk-contrib-suggestions__secondary {
  font-weight: 400;
  opacity: 0.8;
  margin-left: 0.25rem;
}

/* Pour les verbes : "ku" bien séparé */
.lk-contrib-suggestions__ku {
  font-size: 0.8rem;
  text-transform: lowercase;
  color: var(--primary, #2563eb);
  font-weight: 600;
}

.lk-contrib-suggestions__verb {
  font-weight: 600;
  color: var(--primary, #2563eb);
}

/* Phonétique entre crochets / doubles crochets */
.lk-contrib-suggestions__phonetic {
  font-size: 0.82rem;
  opacity: 0.8;
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  white-space: nowrap;
  color: var(--text-muted, #6b7280);
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
  color: var(--success, #14532d);
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
  background-color: var(--primary, #2563eb);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 12px 25px rgba(37, 99, 235, 0.35);
}

.lk-contrib-btn--primary:hover:enabled {
  background-color: #1d4ed8;
}

.lk-contrib-btn--secondary {
  background-color: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
  border-color: var(--border-subtle, rgba(148, 163, 184, 0.9));
}

.lk-contrib-btn--secondary:hover:enabled {
  background-color: var(--surface-hover, #f3f4f6);
}

.lk-contrib-btn:disabled {
  opacity: 0.6;
  cursor: default;
  box-shadow: none;
}

/* Lien après succès */
.lk-contrib-after-success {
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.lk-contrib-after-success a {
  color: var(--primary, #2563eb);
  text-decoration: underline;
  text-underline-offset: 0.15em;
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
