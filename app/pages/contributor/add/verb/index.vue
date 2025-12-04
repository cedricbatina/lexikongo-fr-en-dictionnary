<template>
  <main
    class="lk-contrib-page"
    aria-labelledby="contrib-add-verb-title"
  >
    <!-- HERO -->
    <LkPageHero
      id="contrib-add-verb-title"
      :eyebrow="t('contributor.addVerb.eyebrow')"
      :title="t('contributor.addVerb.title')"
      :description="t('contributor.addVerb.subtitle')"
      :side-aria-label="t('contributor.addVerb.meta.label')"
      :show-last-expressions="true"
    >
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-hands-helping" aria-hidden="true"></i>
          <span>{{ t('contributor.addVerb.meta.label') }}</span>
        </p>
      </template>

      <template #side>
        <div class="lk-contrib-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <!-- Carte formulaire -->
    <section
      class="lk-contrib-card"
      aria-describedby="contrib-add-verb-help"
    >
      <header class="lk-contrib-card__header">
                <p class="lk-contrib-hint">
  {{ t('contributor.addVerb.reviewNotice') }}
</p>

      

        <h2 class="lk-contrib-card__title">
          {{
            form.name && form.name.trim()
              ? `ku ${form.name.trim()}`
              : t('contributor.addVerb.cardTitleFallback')
          }}
        </h2>
        <p class="lk-contrib-card__subtitle">
          {{ t('contributor.addVerb.subtitle') }}
        </p>
          <p
          id="contrib-add-verb-help"
          class="lk-contrib-help"
        >
          {{ t('contributor.addVerb.helpRequired') }}
        </p>
      </header>

      <form
        class="lk-contrib-form"
        @submit.prevent="onSubmit"
      >
        <!-- Bloc Kikongo -->
        <fieldset class="lk-contrib-fieldset">
          <legend class="lk-contrib-legend">
            {{ t('contributor.addVerb.sections.kikongo') }}
          </legend>

          <!-- Infinitif (sans "ku") -->
          <div class="lk-contrib-row">
            <label for="name" class="lk-contrib-label">
              {{ t('contributor.addVerb.fields.infinitive') }}
              <span class="lk-contrib-required">*</span>
            </label>
            <div class="lk-contrib-input-prefix">
              <span class="lk-contrib-input-prefix__label">ku</span>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="lk-contrib-input"
                :placeholder="t('contributor.addVerb.hints.infinitive')"
              />
            </div>
          </div>

          <!-- Racine -->
          <div class="lk-contrib-row">
            <label for="root" class="lk-contrib-label">
              {{ t('contributor.addVerb.fields.root') }}
              <span class="lk-contrib-required">*</span>
            </label>
            <input
              id="root"
              v-model="form.root"
              type="text"
              required
              class="lk-contrib-input"
              :placeholder="t('contributor.addVerb.hints.root')"
            />
          </div>

          <!-- Suffixe + phonétique -->
          <div class="lk-contrib-row lk-contrib-row--half">
            <div class="lk-contrib-row__col">
              <label for="suffix" class="lk-contrib-label">
                {{ t('contributor.addVerb.fields.suffix') }}
              </label>
              <input
                id="suffix"
                v-model="form.suffix"
                type="text"
                class="lk-contrib-input"
                placeholder="-a, -ama…"
              />
            </div>

            <div class="lk-contrib-row__col">
              <label for="phonetic" class="lk-contrib-label">
                {{ t('contributor.addVerb.fields.phonetic') }}
              </label>
              <input
                id="phonetic"
                v-model="form.phonetic"
                type="text"
                class="lk-contrib-input"
                :placeholder="t('contributor.addVerb.hints.phonetic')"
              />
            </div>
          </div>
        </fieldset>

        <!-- Bloc Verbe dérivé (optionnel) -->
        <fieldset class="lk-contrib-fieldset">
          <legend class="lk-contrib-legend">
            {{ t('contributor.addVerb.sections.derived') }}
            <span class="lk-contrib-legend-tag">
              {{ t('contributor.addVerb.sections.derivedOptional') }}
            </span>
          </legend>

          <div class="lk-contrib-row">
            <label
              for="derived_verb"
              class="lk-contrib-label lk-contrib-label--checkbox"
            >
              <input
                id="derived_verb"
                v-model="form.derived_verb"
                type="checkbox"
              />
              <span>{{ t('contributor.addVerb.fields.derivedVerb') }}</span>
            </label>
            <p class="lk-contrib-hint">
              {{ t('contributor.addVerb.hints.derivedVerb') }}
            </p>
          </div>

          <div
            v-if="form.derived_verb"
            class="lk-contrib-row lk-contrib-row--half"
          >
            <div class="lk-contrib-row__col">
              <label for="derived_from" class="lk-contrib-label">
                {{ t('contributor.addVerb.fields.derivedFrom') }}
              </label>
              <input
                id="derived_from"
                v-model="form.derived_from"
                type="number"
                min="1"
                class="lk-contrib-input"
                :placeholder="t('contributor.addVerb.hints.derivedFrom')"
              />
            </div>

         <div class="lk-contrib-row__col">
  <label for="derived_verb_type_id" class="lk-contrib-label">
    {{ t('contributor.addVerb.fields.derivedVerbType') }}
  </label>

  <select
    id="derived_verb_type_id"
    v-model.number="form.derived_verb_type_id"
    class="lk-contrib-select"
  >
    <option :value="null">
      {{ t('contributor.addVerb.hints.derivedVerbType') || '— Choisir un type de verbe dérivé —' }}
    </option>
    <option
      v-for="type in derivedVerbTypes"
      :key="type.id"
      :value="type.id"
    >
      {{ type.id }} — {{ type.name }}
    </option>
  </select>
  
  <!-- 🔽 On ajoute ce paragraphe explicatif juste en dessous -->
  <p
    v-if="selectedDerivedVerbType"
    class="lk-contrib-hint lk-contrib-hint--derived"
  >
    {{ selectedDerivedVerbType.description }}
  </p>
</div>

          </div>
        </fieldset>

        <!-- Bloc Traductions -->
        <fieldset class="lk-contrib-fieldset">
          <legend class="lk-contrib-legend">
            {{ t('contributor.addVerb.sections.translations') }}
          </legend>

          <!-- FR -->
          <div class="lk-contrib-row">
            <label for="translation_fr" class="lk-contrib-label">
              {{ t('contributor.addVerb.fields.translationFr') }}
            </label>
            <textarea
              id="translation_fr"
              v-model="form.translation_fr"
              rows="3"
              class="lk-contrib-textarea"
              :placeholder="t('contributor.addVerb.hints.translationFr')"
            />
          </div>

          <!-- EN -->
          <div class="lk-contrib-row">
            <label for="translation_en" class="lk-contrib-label">
              {{ t('contributor.addVerb.fields.translationEn') }}
            </label>
            <textarea
              id="translation_en"
              v-model="form.translation_en"
              rows="3"
              class="lk-contrib-textarea"
              :placeholder="t('contributor.addVerb.hints.translationEn')"
            />
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
                  ? t('contributor.addVerb.actions.saving')
                  : t('contributor.addVerb.actions.submit')
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
            <span>{{ t('contributor.addVerb.actions.reset') }}</span>
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSeoMeta } from '#imports';
import { useRouter } from '#app';
import * as Toastification from 'vue-toastification';

import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import { useAuthStore } from '~/stores/authStore';

const { t } = useI18n();
const router = useRouter();
const toast = Toastification.useToast();
const authStore = useAuthStore();
const derivedVerbTypes = [
  {
    id: 1,
    name: 'Voix passive',
    description:
      "Le sujet subit ou reçoit l’action : l’objet de la forme active devient sujet (ex. ku tungua « être construit »).",
  },
  {
    id: 2,
    name: 'Voix causative',
    description:
      "Le sujet fait faire l’action par quelqu’un d’autre : il est la cause, mais n’agit pas directement (ex. ku tungisa « faire construire »).",
  },
  {
    id: 3,
    name: 'Voix applicative',
    description:
      "Le sujet fait l’action pour/envers quelqu’un ou quelque chose, en mettant en avant un bénéficiaire ou un destinataire (ex. ku tungila « construire pour »).",
  },
  {
    id: 4,
    name: 'Voix réciproque',
    description:
      "L’action est mutuelle entre plusieurs sujets : chacun fait et subit l’action (ex. ku kuelana « se marier l’un avec l’autre »).",
  },
  {
    id: 5,
    name: 'Voix itérative',
    description:
      "L’action est répétée ou recommencée : on insiste sur le fait de refaire ou de continuer l’action (ex. tungulula « reconstruire encore et encore »).",
  },
  {
    id: 6,
    name: 'Voix réversive',
    description:
      "L’action défait ou inverse un état précédemment établi : on annule, on libère, on déconstruit (ex. kangula « délier, libérer »).",
  },
  {
    id: 7,
    name: 'Voix potentielle',
    description:
      "Exprime la possibilité ou la capacité : l’action peut se réaliser, « peut se V » ou « peut être V-ée » (ex. sumbamana « pouvoir se vendre »).",
  },
  {
    id: 8,
    name: 'Voix intensive',
    description:
      "L’action est accomplie avec force, énergie ou autorité : on insiste sur l’intensité (ex. kangumuna « lier avec force »).",
  },
  {
    id: 9,
    name: 'Voix réfléchie',
    description:
      "Le sujet fait l’action sur lui-même : il est à la fois agent et patient (ex. kizola « s’aimer soi-même »).",
  },
  {
    id: 10,
    name: "Voix d’attitude",
    description:
      "Décrit un état ou une posture liée à l’action : « être en train de V » ou « être dans l’état de V » (ex. kangalala « être bloqué, fermé »).",
  },
  {
    id: 11,
    name: 'Voix fréquentative',
    description:
      "L’action est réalisée souvent, habituellement : elle exprime une habitude ou une régularité (ex. sumbaka « acheter souvent »).",
  },
];

const selectedDerivedVerbType = computed(() => {
  if (!form.value.derived_verb || !form.value.derived_verb_type_id) {
    return null;
  }
  return derivedVerbTypes.find(
    (t) => t.id === Number(form.value.derived_verb_type_id),
  ) || null;
});

const form = ref({
  name: '',
  root: '',
  suffix: '',
  phonetic: '',
  translation_fr: '',
  translation_en: '',
  derived_verb: false,
  derived_from: '',
  derived_verb_type_id: null,
});


const isSubmitting = ref(false);
const error = ref('');
const success = ref('');

const currentUserId = computed(() => {
  return authStore.user?.id || authStore.user?.user_id || null;
});

useSeoMeta({
  title: () => t('contributor.addVerb.meta.title'),
  description: () => t('contributor.addVerb.meta.description'),
  ogTitle: () => t('contributor.addVerb.meta.title'),
  ogDescription: () => t('contributor.addVerb.meta.description'),
});

const onReset = () => {
  form.value = {
    name: '',
    root: '',
    suffix: '',
    phonetic: '',
    translation_fr: '',
    translation_en: '',
    derived_verb: false,
    derived_from: '',
    derived_verb_type_id: '',
  };
  error.value = '';
  success.value = '';
};

const buildTranslationsPayload = () => {
  const translations = [];

  if (form.value.translation_fr && form.value.translation_fr.trim()) {
    translations.push({
      language_code: 'fr',
      meaning: form.value.translation_fr.trim(),
    });
  }

  if (form.value.translation_en && form.value.translation_en.trim()) {
    translations.push({
      language_code: 'en',
      meaning: form.value.translation_en.trim(),
    });
  }

  return translations;
};

const onSubmit = async () => {
  if (
    !form.value.name ||
    !form.value.name.trim() ||
    !form.value.root ||
    !form.value.root.trim()
  ) {
    error.value = t('contributor.addVerb.errors.missingCore');
    return;
  }

  if (!currentUserId.value) {
    error.value = t('contributor.addVerb.errors.missingUser');
    return;
  }

  const translations = buildTranslationsPayload();
  if (!translations.length) {
    error.value = t('contributor.addVerb.errors.missingTranslations');
    return;
  }

  // conversion des champs derived_* vers un format DB-friendly
  const derivedFlag = !!form.value.derived_verb;
  const derivedFromId =
    derivedFlag && form.value.derived_from
      ? Number.parseInt(form.value.derived_from, 10) || null
      : null;
  const derivedTypeId =
    derivedFlag && form.value.derived_verb_type_id
      ? Number.parseInt(form.value.derived_verb_type_id, 10) || null
      : null;

  isSubmitting.value = true;
  error.value = '';
  success.value = '';

  try {
const payload = {
  name: form.value.name.trim(),
  root: form.value.root.trim(),
  suffix: form.value.suffix?.trim() || null,
  phonetic: form.value.phonetic?.trim() || null,
  active_verb: 1,
  derived_verb: derivedFlag ? 1 : 0,
  derived_from: derivedFromId,
  derived_verb_type_id: derivedTypeId,
  user_id: currentUserId.value,
  translations,
};


    const res = await $fetch('/api/contributor/verb', {
      method: 'POST',
      body: payload,
    });

    const msg = t('contributor.addVerb.success');
    toast.success(msg);
    success.value = msg;

    // plus tard : rediriger vers une page "mes soumissions" ou détail
    // if (res && res.slug) {
    //   await router.push(`/contributor/verb/${res.slug}?user_id=${currentUserId.value}`);
    // }

    onReset();
  } catch (e) {
    console.error('Erreur lors de la soumission du verbe contributeur :', e);
    const apiMessage = e?.data?.statusMessage || e?.data?.message;
    error.value = apiMessage || t('contributor.addVerb.errors.generic');
    toast.error(error.value);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.lk-contrib-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

/* Colonne d’actions (LkActionsBar déjà stylé ailleurs) */
.lk-contrib-side {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Carte principale : light/dark via tokens globaux */
.lk-contrib-card {
  background: var(--surface-elevated, #ffffff);
  border-radius: 1rem;
  padding: 1.5rem 1.25rem 1.75rem;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.35));
  margin-top: 1.5rem;
}

.lk-contrib-card__header {
  margin-bottom: 1rem;
}

.lk-contrib-card__title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0.25rem 0;
  color: var(--text-default, #111827);
}

.lk-contrib-card__subtitle {
  font-size: 0.95rem;
  color: var(--text-muted, #6b7280);
  margin: 0;
}

/* Petit chip d’info “les champs * sont obligatoires …” */
.lk-contrib-help {
  font-size: 0.85rem;
  color: var(--text-muted, #4b5563);
  background: var(--surface-default, #f1f5f9);
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

/* Formulaire */
.lk-contrib-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.75rem;
}

/* Fieldsets */
.lk-contrib-fieldset {
  border: 1px solid var(--border-subtle, #e5e7eb);
  border-radius: 0.9rem;
  padding: 1rem;
  background: var(--surface-default, transparent);
}

.lk-contrib-legend {
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0 0.4rem;
  color: var(--text-default, #111827);
}

/* Tag “optionnel” dans les legends */
.lk-contrib-legend-tag {
  margin-left: 0.4rem;
  font-size: 0.78rem;
  font-weight: 500;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.16);
  color: var(--text-muted, #6b7280);
}

/* Layout lignes / colonnes */
.lk-contrib-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.75rem;
}

.lk-contrib-row--half {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.75rem;
}

.lk-contrib-row__col {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Labels */
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

/* Inputs, selects & textarea */
.lk-contrib-input,
.lk-contrib-textarea,
.lk-contrib-select {
  width: 100%;
  border-radius: 0.7rem;
  border: 1px solid var(--border-subtle, #d1d5db);
  padding: 0.5rem 0.7rem;
  font-size: 0.95rem;
  background-color: var(--surface-elevated, #f9fafb);
  color: var(--text-default, #111827);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}

.lk-contrib-input:focus,
.lk-contrib-textarea:focus,
.lk-contrib-select:focus {
  outline: none;
  border-color: var(--primary, #3b82f6);
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.35);
  background-color: var(--surface-elevated, #ffffff);
}

.lk-contrib-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Input avec préfixe “ku” */
.lk-contrib-input-prefix {
  display: flex;
  align-items: stretch;
  border-radius: 0.7rem;
  overflow: hidden;
  border: 1px solid var(--border-subtle, #d1d5db);
  background: var(--surface-elevated, #f9fafb);
}

.lk-contrib-input-prefix__label {
  display: inline-flex;
  align-items: center;
  padding: 0 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(37, 99, 235, 0.09);
  border-right: 1px solid rgba(191, 219, 254, 1);
  color: var(--primary, #2563eb);
}

.lk-contrib-input-prefix .lk-contrib-input {
  border: none;
  border-radius: 0;
  background: transparent;
}

/* Messages d’erreur / succès */
.lk-contrib-message {
  font-size: 0.9rem;
  margin: 0.25rem 0 0;
}

.lk-contrib-message--error {
  color: #b91c1c;
}

.lk-contrib-message--success {
  color: #166534;
}

/* Hint dérivé (texte explicatif sous le type de verbe dérivé) */
.lk-contrib-hint--derived {
  margin-top: 0.35rem;
  font-style: italic;
  font-size: 0.78rem;
}

/* Hints généraux */
.lk-contrib-hint {
  font-size: 0.82rem;
  color: var(--text-muted, #6b7280);
  margin: 0;
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
  padding: 0.45rem 0.9rem;
  font-size: 0.9rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.05s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

/* Bouton primaire */
.lk-contrib-btn--primary {
  background: var(--primary, #2563eb);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
}

.lk-contrib-btn--primary:disabled {
  opacity: 0.7;
  cursor: default;
  box-shadow: none;
}

.lk-contrib-btn--primary:not(:disabled):hover {
  background: #1d4ed8;
  box-shadow: 0 8px 22px rgba(37, 99, 235, 0.45);
  transform: translateY(-1px);
}

/* Bouton secondaire */
.lk-contrib-btn--secondary {
  background: var(--surface-elevated, #f3f4f6);
  color: var(--text-default, #111827);
  border-color: var(--border-subtle, #d1d5db);
}

.lk-contrib-btn--secondary:hover:not(:disabled) {
  background: var(--surface-hover, #e5e7eb);
}

/* Responsive */
@media (min-width: 768px) {
  .lk-contrib-page {
    padding: 2rem 1rem 3rem;
  }

  .lk-contrib-card {
    padding: 1.75rem 1.5rem 2rem;
  }

  .lk-contrib-row--half {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
