<template>
  <main
    class="lk-contrib-page"
    aria-labelledby="contrib-edit-pending-verb-title"
  >
    <!-- HERO -->
    <LkPageHero
      id="contrib-edit-pending-verb-title"
      :eyebrow="t('contributor.editPendingVerb.eyebrow') || t('contributor.addVerb.eyebrow')"
      :title="t('contributor.editPendingVerb.title') || t('contributor.addVerb.title')"
      :description="t('contributor.editPendingVerb.subtitle') || t('contributor.addVerb.subtitle')"
      :side-aria-label="t('contributor.editPendingVerb.meta.label') || t('contributor.addVerb.meta.label')"
      :show-last-expressions="true"
    >
      <!-- Meta sous le titre -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-pen-to-square" aria-hidden="true"></i>
          <span>
            {{
              t('contributor.editPendingVerb.meta.label')
              || t('contributor.addVerb.meta.label')
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
      aria-describedby="contrib-edit-pending-verb-help"
    >
      <header class="lk-contrib-card__header">
        <!-- Aide générale -->
        <p
          id="contrib-edit-pending-verb-help"
          class="lk-contrib-help"
        >
          {{
            t('contributor.editPendingVerb.help')
            || t('contributor.addVerb.helpRequired')
          }}
        </p>

        <p class="lk-contrib-hint">
          {{
            t('contributor.editPendingVerb.reviewNotice')
            || t('contributor.addVerb.reviewNotice')
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
              t('contributor.editPendingVerb.meta.submittedAtLabel')
              || t('contributor.submissions.meta.createdAt')
            }}
            :
            <time :datetime="submissionMeta.createdAtRaw">
              {{ submissionMeta.createdAtFormatted }}
            </time>
          </span>
        </div>

        <!-- Titre dynamique = infinitif -->
        <h2 class="lk-contrib-card__title">
          {{
            form.name && form.name.trim()
              ? form.name.trim()
              : (
                t('contributor.editPendingVerb.cardTitleFallback')
                || t('contributor.addVerb.cardTitleFallback')
              )
          }}
        </h2>

        <p class="lk-contrib-card__subtitle">
          {{
            t('contributor.editPendingVerb.subtitle')
            || t('contributor.addVerb.subtitle')
          }}
        </p>

        <!-- Si non-pending : message de verrouillage (au cas où l’API évolue) -->
        <p
          v-if="submissionMeta && submissionMeta.status !== 'pending'"
          class="lk-contrib-message lk-contrib-message--info"
        >
          {{
            t('contributor.editPendingVerb.locked')
            || 'Cette soumission a déjà été traitée et n’est plus modifiable.'
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
          {{ t('contributor.editPendingVerb.loading') || 'Chargement de votre soumission…' }}
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

          <!-- Infinitif sans ku -->
          <div class="lk-contrib-row">
            <label
              for="verb_name"
              class="lk-contrib-label"
            >
              {{ t('contributor.addVerb.fields.infinitive') || 'Infinitif (sans « ku »)' }}
              <span class="lk-contrib-required">*</span>
            </label>

            <input
              id="verb_name"
              v-model.trim="form.name"
              type="text"
              required
              class="lk-contrib-input"
              :disabled="isReadOnly"
              :placeholder="t('contributor.addVerb.hints.infinitive') || 'longa, bala…'"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addVerb.hints.infinitive')
                || 'Écrivez l’infinitif sans « ku » (ex. longa, bala…).'
              }}
            </p>
          </div>

          <!-- Radical -->
          <div class="lk-contrib-row">
            <label
              for="verb_root"
              class="lk-contrib-label"
            >
              {{ t('contributor.addVerb.fields.root') || 'Radical verbal' }}
              <span class="lk-contrib-required">*</span>
            </label>

            <input
              id="verb_root"
              v-model.trim="form.root"
              type="text"
              required
              class="lk-contrib-input"
              :disabled="isReadOnly"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addVerb.hints.root')
                || 'Indiquez le radical verbal (ex. long-, bal-…).'
              }}
            </p>
          </div>

          <!-- Suffixe -->
          <div class="lk-contrib-row">
            <label
              for="verb_suffix"
              class="lk-contrib-label"
            >
              {{ t('contributor.addVerb.fields.suffix') || 'Suffixe' }}
            </label>

            <input
              id="verb_suffix"
              v-model.trim="form.suffix"
              type="text"
              class="lk-contrib-input"
              :disabled="isReadOnly"
            />
          </div>

          <!-- Phonétique -->
          <div class="lk-contrib-row">
            <label
              for="verb_phonetic"
              class="lk-contrib-label"
            >
              {{ t('details.common.phonetic') || t('contributor.addVerb.fields.phonetic') || 'Phonétique' }}
            </label>

            <input
              id="verb_phonetic"
              v-model.trim="form.phonetic"
              type="text"
              class="lk-contrib-input"
              :disabled="isReadOnly"
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
              for="verb_derived"
              class="lk-contrib-label lk-contrib-label--checkbox"
            >
              <input
                id="verb_derived"
                v-model="form.derived_verb"
                type="checkbox"
                :disabled="isReadOnly"
              />
              <span>
                {{ t('contributor.addVerb.fields.derivedVerb') || 'Ce verbe est dérivé d’un autre verbe' }}
              </span>
            </label>

            <p class="lk-contrib-hint">
              {{
                t('contributor.addVerb.hints.derivedVerb')
                || 'Cochez si ce verbe est construit à partir d’un autre (dérivé morphologique).'
              }}
            </p>
          </div>

          <!-- Champs visibles uniquement si derived_verb -->
          <div
            v-if="form.derived_verb"
            class="lk-contrib-row lk-contrib-row--half"
          >
            <!-- ID verbe de base -->
            <div class="lk-contrib-row__col">
              <label
                for="derived_from"
                class="lk-contrib-label"
              >
                {{ t('contributor.addVerb.fields.derivedFrom') || 'ID du verbe de base' }}
              </label>

              <input
                id="derived_from"
                v-model="form.derived_from"
                type="number"
                class="lk-contrib-input"
                :disabled="isReadOnly"
              />

              <p class="lk-contrib-hint">
                {{
                  t('contributor.addVerb.hints.derivedFrom')
                  || 'ID interne du verbe de base, si vous le connaissez (sinon, laissez vide).'
                }}
              </p>
            </div>

            <!-- Type de dérivation -->
            <div class="lk-contrib-row__col">
              <label
                for="derived_verb_type_id"
                class="lk-contrib-label"
              >
                {{ t('contributor.addVerb.fields.derivedVerbType') || 'Type de verbe dérivé' }}
              </label>

              <input
                id="derived_verb_type_id"
                v-model="form.derived_verb_type_id"
                type="number"
                class="lk-contrib-input"
                :disabled="isReadOnly"
              />

              <p class="lk-contrib-hint">
                {{
                  t('contributor.addVerb.hints.derivedVerbType')
                  || 'Sélectionnez / indiquez le type de dérivation (passive, causative, etc.), si vous le connaissez.'
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
              for="verb_translation_fr"
              class="lk-contrib-label"
            >
              {{ t('details.common.fr') || 'Français' }}
            </label>

            <textarea
              id="verb_translation_fr"
              v-model.trim="form.translation_fr"
              rows="3"
              class="lk-contrib-textarea"
              :disabled="isReadOnly"
              :placeholder="t('contributor.addVerb.hints.translationFr') || 'Vous pouvez proposer plusieurs sens en français, séparés par des virgules ou sur plusieurs lignes.'"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addVerb.hints.translationFr')
                || 'Vous pouvez proposer plusieurs sens en français, séparés par des virgules ou sur plusieurs lignes.'
              }}
            </p>
          </div>

          <!-- EN -->
          <div class="lk-contrib-row">
            <label
              for="verb_translation_en"
              class="lk-contrib-label"
            >
              {{ t('details.common.en') || 'Anglais' }}
            </label>

            <textarea
              id="verb_translation_en"
              v-model.trim="form.translation_en"
              rows="3"
              class="lk-contrib-textarea"
              :disabled="isReadOnly"
              :placeholder="t('contributor.addVerb.hints.translationEn') || 'Vous pouvez proposer plusieurs sens en anglais, séparés par des virgules ou sur plusieurs lignes.'"
            />

            <p class="lk-contrib-hint">
              {{
                t('contributor.addVerb.hints.translationEn')
                || 'Vous pouvez proposer plusieurs sens en anglais, séparés par des virgules ou sur plusieurs lignes.'
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
            :disabled="isSubmitting || isReadOnly"
          >
            <i class="fas fa-save" aria-hidden="true"></i>
            <span>
              {{
                isSubmitting
                  ? (
                    t('contributor.editPendingVerb.actions.saving')
                    || t('contributor.addVerb.actions.saving')
                    || 'Enregistrement en cours…'
                  )
                  : (
                    t('contributor.editPendingVerb.actions.save')
                    || 'Enregistrer les modifications'
                  )
              }}
            </span>
          </button>

          <!-- Reset -->
          <button
            type="button"
            class="lk-contrib-btn lk-contrib-btn--secondary"
            :disabled="isSubmitting || isReadOnly"
            @click="onReset"
          >
            <i class="fas fa-rotate-left" aria-hidden="true"></i>
            <span>
              {{
                t('contributor.editPendingVerb.actions.reset')
                || t('contributor.addVerb.actions.reset')
                || 'Réinitialiser'
              }}
            </span>
          </button>

          <!-- Delete -->
          <button
            type="button"
            class="lk-contrib-btn lk-contrib-btn--danger"
            :disabled="isSubmitting || isReadOnly"
            @click="onDelete"
          >
            <i class="fas fa-trash-alt" aria-hidden="true"></i>
            <span>
              {{
                t('contributor.editPendingVerb.actions.delete')
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
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSeoMeta, useAsyncData } from '#imports';
import * as Toastification from 'vue-toastification';

import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';

import { useAuthStore } from '~/stores/authStore';
import { useConfirmStore } from '~/stores/confirmStore';

// --- i18n / route / router / toast ---
const route = useRoute();
const router = useRouter();
const { t, d } = useI18n();
const toast = Toastification.useToast();

// --- Auth ---
const authStore = useAuthStore();
const currentUserId = computed(
  () => authStore.user?.id || authStore.user?.user_id || null,
);

// --- Confirm modal store ---
const confirmStore = useConfirmStore();

// --- Slug param ---
const slug = computed(() => route.params.slug || null);

// --- State formulaire ---
const form = ref({
  name: '',
  root: '',
  suffix: '',
  phonetic: '',
  active_verb: true,
  derived_verb: false,
  derived_from: '',
  derived_verb_type_id: null,
  translation_fr: '',
  translation_en: '',
});

const isSubmitting = ref(false);
const error = ref('');
const success = ref('');

const submissionMeta = ref(null); // { status, createdAtRaw, createdAtFormatted }
const originalPayload = ref(null); // snapshot pour reset

const isReadOnly = computed(
  () => submissionMeta.value && submissionMeta.value.status !== 'pending',
);

// --- SEO ---
useSeoMeta({
  title: () =>
    t('contributor.editPendingVerb.meta.title')
    || 'Contributeur · Modifier un verbe en attente – Lexikongo',
  description: () =>
    t('contributor.editPendingVerb.meta.description')
    || 'Modifiez une soumission de verbe en kikongo tant qu’elle est encore en attente de validation.',
});

// --- Chargement de la soumission (GET pending-verb) ---
const {
  data: submissionData,
  pending: isLoadingSubmission,
  error: submissionErrorRaw,
} = await useAsyncData(
  'edit-pending-verb',
  async () => {
    if (!slug.value || !currentUserId.value) return null;

    return $fetch(
      `/api/contributor/pending-verb/${slug.value}?user_id=${currentUserId.value}`,
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
    || t('contributor.editPendingVerb.errors.generic')
    || 'Impossible de charger cette soumission.'
  );
});

// --- Hydratation du formulaire depuis l’API ---
const hydrateFromSubmission = (payload) => {
  if (!payload) return;

  form.value.name = payload.name || '';
  form.value.root = payload.root || '';
  form.value.suffix = payload.suffix || '';
  form.value.phonetic = payload.phonetic || '';
  form.value.active_verb = !!payload.active_verb;
  form.value.derived_verb = !!payload.derived_verb;
  form.value.derived_from = payload.derived_from || '';
  form.value.derived_verb_type_id = payload.derived_verb_type_id || null;
  form.value.translation_fr = payload.translation_fr || '';
  form.value.translation_en = payload.translation_en || '';

  const createdAtRaw = payload.created_at || null;
  submissionMeta.value = {
    status: payload.status || 'pending',
    createdAtRaw,
    createdAtFormatted: createdAtRaw
      ? d(new Date(createdAtRaw), 'short')
      : '',
  };

  originalPayload.value = JSON.parse(JSON.stringify(payload));
};

// Watch pour hydrater dès que la data arrive
watch(
  submissionData,
  (val) => {
    if (!val) return;
    hydrateFromSubmission(val);
  },
  { immediate: true },
);

// --- Reset = revenir à l’état API initial ---
const onReset = () => {
  error.value = '';
  success.value = '';
  if (originalPayload.value) {
    hydrateFromSubmission(originalPayload.value);
  }
};

// --- Submit (PUT pending-verb) ---
const onSubmit = async () => {
  error.value = '';
  success.value = '';

  if (!currentUserId.value) {
    error.value = t('contributor.submissions.mustBeLoggedIn');
    return;
  }

  if (isReadOnly.value) {
    error.value =
      t('contributor.editPendingVerb.errors.notEditable')
      || 'Cette soumission n’est plus modifiable.';
    return;
  }

  if (!form.value.name?.trim()) {
    error.value =
      t('contributor.editPendingVerb.errors.missingName')
      || 'Merci d’indiquer l’infinitif du verbe (sans « ku »).';
    return;
  }

  if (!form.value.root?.trim()) {
    error.value =
      t('contributor.editPendingVerb.errors.missingRoot')
      || 'Merci d’indiquer le radical verbal.';
    return;
  }

  if (
    !form.value.translation_fr?.trim()
    && !form.value.translation_en?.trim()
  ) {
    error.value =
      t('contributor.editPendingVerb.errors.missingTranslations')
      || 'Merci de proposer au moins une traduction (FR ou EN).';
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch(`/api/contributor/pending-verb/${slug.value}`, {
      method: 'PUT',
      body: {
        user_id: currentUserId.value,
        name: form.value.name,
        root: form.value.root,
        suffix: form.value.suffix || null,
        phonetic: form.value.phonetic || null,
        derived_verb: form.value.derived_verb ? 1 : 0,
        derived_from: form.value.derived_from || null,
        derived_verb_type_id: form.value.derived_verb_type_id || null,
        translation_fr: form.value.translation_fr || '',
        translation_en: form.value.translation_en || '',
      },
    });

    const msg =
      t('contributor.editPendingVerb.success')
      || 'Vos modifications ont bien été enregistrées.';
    success.value = msg;
    toast.success(msg);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du verbe en attente :', err);
    const apiMsg =
      err?.data?.statusMessage
      || err?.data?.message
      || t('contributor.editPendingVerb.errors.generic')
      || 'Impossible de mettre à jour cette soumission.';
    error.value = apiMsg;
    toast.error(apiMsg);
  } finally {
    isSubmitting.value = false;
  }
};

// --- Delete (DELETE /api/contributor/verb/[slug]) avec confirmStore ---
const onDelete = async () => {
  if (!slug.value || !currentUserId.value) return;

  const title =
    t('contributor.editPendingVerb.confirmTitle')
    || t('contributor.editPendingWord.confirmTitle')
    || 'Supprimer cette soumission ?';

  const message =
    t('contributor.editPendingVerb.confirmDelete')
    || t('contributor.editPendingWord.confirmDelete')
    || 'Voulez-vous vraiment supprimer cette soumission ? Cette action est définitive.';

  const confirmLabel =
    t('contributor.editPendingVerb.actions.confirmDelete')
    || t('common.actions.delete')
    || 'Supprimer';

  const cancelLabel =
    t('common.actions.cancel')
    || 'Annuler';

  // Ouvre le LkConfirmModal via le store (pattern officiel)
  const confirmed = await confirmStore.ask({
    title,
    message,
    confirmLabel,
    cancelLabel,
    danger: true,
  });

  if (!confirmed) return;

  isSubmitting.value = true;
  error.value = '';
  success.value = '';

  try {
    await $fetch(`/api/contributor/verb/${slug.value}`, {
      method: 'DELETE',
      body: {
        user_id: currentUserId.value,
      },
    });

    const msg =
      t('contributor.editPendingVerb.deleted')
      || 'Votre soumission de verbe a été supprimée.';
    toast.success(msg);

    await router.push('/contributor/submissions');
  } catch (err) {
    console.error('Erreur lors de la suppression du pending-verb :', err);
    const apiMsg =
      err?.data?.statusMessage
      || err?.data?.message
      || t('contributor.editPendingVerb.errors.delete')
      || 'Impossible de supprimer cette soumission.';
    error.value = apiMsg;
    toast.error(apiMsg);
  } finally {
    isSubmitting.value = false;
  }
};

// --- Label de statut (mêmes clés que pour les soumissions) ---
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
