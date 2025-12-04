<template>
  <main class="admin-edit-page" aria-labelledby="admin-add-verb-title">
    <!-- HERO -->
    <LkPageHero
      id="admin-add-verb-title"
      :eyebrow="t('details.verb.label') || 'Verbe'"
      :title="t('admin.verb.add.title') || 'Ajouter un verbe en kikongo'"
      :description="t('admin.verb.add.subtitle') || fallbackSubtitle"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <!-- Meta sous le titre -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-tools" aria-hidden="true"></i>
          <span>
            {{ t('admin.verb.add.meta') || 'Admin · Ajout de verbe' }}
          </span>
        </p>
      </template>

      <!-- Colonne de droite : actions globales -->
      <template #side>
        <div class="admin-edit-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <!-- Carte formulaire -->
    <section
      class="admin-edit-card"
      aria-label="Formulaire d'ajout de verbe"
    >
      <header class="admin-edit-card__header">
        <h2 class="admin-edit-card__title">
          {{ form.name ? `ku ${form.name}` : t('details.verb.label') || 'Verbe' }}
        </h2>
        <p class="admin-edit-card__subtitle">
          {{ t('admin.verb.add.subtitle') || fallbackSubtitle }}
        </p>
      </header>

      <form class="admin-edit-form" @submit.prevent="onSubmit">
        <!-- Bloc Kikongo -->
        <fieldset class="admin-edit-fieldset">
          <legend>
            {{ t('admin.verb.add.legendKikongo') || (t('details.common.kikongoData') || 'Données en kikongo') }}
          </legend>

          <!-- Infinitif (sans "ku") -->
          <div class="admin-edit-row">
            <label for="name">
              {{ t('admin.verb.add.fields.infinitive') || (t('details.verb.infinitive') || 'Infinitif') }}
            </label>
            <div class="admin-edit-input-prefix">
              <span class="admin-edit-input-prefix__label">ku</span>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                :placeholder="t('admin.verb.add.placeholders.infinitive') || 'longa, bala…'"
              />
            </div>
          </div>

          <!-- Racine -->
          <div class="admin-edit-row">
            <label for="root">
              {{ t('admin.verb.add.fields.root') || (t('details.verb.root') || 'Racine') }}
            </label>
            <input
              id="root"
              v-model="form.root"
              type="text"
              :placeholder="t('admin.verb.add.placeholders.root') || 'Racine du verbe…'"
            />
          </div>

          <!-- Suffixe -->
          <div class="admin-edit-row">
            <label for="suffix">
              {{ t('admin.verb.add.fields.suffix') || (t('details.verb.suffix') || 'Suffixe') }}
            </label>
            <input
              id="suffix"
              v-model="form.suffix"
              type="text"
              :placeholder="t('admin.verb.add.placeholders.suffix') || '-a, -ama…'"
            />
          </div>

          <!-- Phonétique -->
          <div class="admin-edit-row">
            <label for="phonetic">
              {{ t('admin.verb.add.fields.phonetic') || (t('details.common.phonetic') || 'Phonétique') }}
            </label>
            <input
              id="phonetic"
              v-model="form.phonetic"
              type="text"
              :placeholder="t('admin.verb.add.placeholders.phonetic') || '[lónga]…'"
            />
          </div>
        </fieldset>

        <!-- Bloc traductions -->
        <fieldset class="admin-edit-fieldset">
          <legend>
            {{ t('admin.verb.add.legendTranslations') || (t('details.common.translations') || 'Traductions') }}
          </legend>

          <!-- FR -->
          <div class="admin-edit-row">
            <label for="translation_fr">
              {{ t('admin.verb.add.fields.translationFr') || (t('details.common.fr') || 'Français') }}
            </label>
            <textarea
              id="translation_fr"
              v-model="form.translation_fr"
              rows="3"
              :placeholder="t('admin.verb.add.placeholders.translationFr') || 'Sens FR séparés par des virgules…'"
            />
          </div>

          <!-- EN -->
          <div class="admin-edit-row">
            <label for="translation_en">
              {{ t('admin.verb.add.fields.translationEn') || (t('details.common.en') || 'Anglais') }}
            </label>
            <textarea
              id="translation_en"
              v-model="form.translation_en"
              rows="3"
              :placeholder="t('admin.verb.add.placeholders.translationEn') || 'EN meanings separated by commas…'"
            />
          </div>
        </fieldset>

        <!-- Messages -->
        <p
          v-if="error"
          class="admin-edit-message admin-edit-message--error"
        >
          {{ error }}
        </p>
        <p
          v-if="success"
          class="admin-edit-message admin-edit-message--success"
        >
          {{ success }}
        </p>

        <!-- Actions -->
        <div class="admin-edit-actions">
          <button
            type="submit"
            class="admin-edit-btn admin-edit-btn--primary"
            :disabled="isSaving"
          >
            <i class="fas fa-save" aria-hidden="true"></i>
            <span>
              {{
                isSaving
                  ? (t('admin.verb.add.actions.saving') || 'Enregistrement…')
                  : (t('admin.verb.add.actions.submit') || 'Enregistrer le verbe')
              }}
            </span>
          </button>

          <button
            type="button"
            class="admin-edit-btn admin-edit-btn--secondary"
            :disabled="isSaving"
            @click="onReset"
          >
            <i class="fas fa-undo" aria-hidden="true"></i>
            <span>
              {{ t('admin.verb.add.actions.reset') || 'Réinitialiser le formulaire' }}
            </span>
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import * as Toastification from 'vue-toastification';
import { useVerbStore } from '~/stores/verbStore';
import { useSeoMeta, useRouter } from '#imports';

const { t } = useI18n();
const toast = Toastification.useToast();
const verbStore = useVerbStore();
const router = useRouter(); // ✅

const form = ref({
  name: '',
  root: '',
  suffix: '',
  phonetic: '',
  translation_fr: '',
  translation_en: '',
});

const isSaving = ref(false);
const error = ref('');
const success = ref('');

const fallbackSubtitle =
  'Ajoutez un nouveau verbe en kikongo avec sa phonétique et ses traductions en français et en anglais.';

useSeoMeta({
  title: () =>
    t('admin.verb.add.seoTitle') ||
    'Admin · Ajouter un verbe en kikongo – Lexikongo',
  description: () =>
    t('admin.verb.add.seoDescription') ||
    'Tableau de bord admin · ajout d’un verbe en kikongo (infinitif, phonétique, traductions).',
});

/**
 * Réinitialisation simple du formulaire
 */
const onReset = () => {
  form.value = {
    name: '',
    root: '',
    suffix: '',
    phonetic: '',
    translation_fr: '',
    translation_en: '',
  };
  error.value = '';
  success.value = '';
};

/**
 * Soumission du formulaire de création
 */
const onSubmit = async () => {
  if (!form.value.name || !form.value.root) {
    error.value = 'Merci de remplir au moins l’infinitif et la racine.';
    return;
  }

  isSaving.value = true;
  error.value = '';
  success.value = '';

  try {
    // Appel API : création du verbe
    const created = await $fetch('/api/admin/verb', {
      method: 'POST',
      body: {
        name: form.value.name,
        root: form.value.root,
        suffix: form.value.suffix || null,
        phonetic: form.value.phonetic || null,
        translation_fr: form.value.translation_fr || '',
        translation_en: form.value.translation_en || '',
      },
    });

    // 🔁 On rafraîchit le store global (liste des verbes utilisée par /verbs, /expressions, etc.)
    try {
      await verbStore.fetchAll();
    } catch (e) {
      console.warn('Impossible de rafraîchir verbStore après création :', e);
    }

    // ✅ Toast + message de succès
    const successMsg = 'Verbe créé avec succès.';
    toast.success(successMsg);
    success.value = successMsg;

    // 🔀 Redirection vers la page de détails si l’API renvoie le slug
    if (created && created.slug) {
      await router.push(`/details/verb/${created.slug}`);
    } else {
      // Fallback : on retourne à la liste des verbes
      await router.push('/verbs');
    }
  } catch (err) {
    console.error('Erreur lors de la création du verbe :', err);
    error.value =
      err?.data?.statusMessage ||
      'Erreur lors de la création du verbe.';
    toast.error(error.value);
  } finally {
    isSubmitting.value = false;
  }
};

</script>

<style scoped>
.admin-edit-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-edit-side {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.admin-edit-card {
  border-radius: 1rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  background: var(--surface-elevated, #ffffff);
  padding: 1.3rem 1.2rem;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.12);
}

.admin-edit-card__header {
  margin-bottom: 0.9rem;
}

.admin-edit-card__title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary, #0d6efd);
}

.admin-edit-card__subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.95rem;
  color: var(--text-muted, #6b7280);
}

.admin-edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-edit-fieldset {
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  border-radius: 0.75rem;
  padding: 0.75rem 0.9rem 0.9rem;
  background: var(--surface-default, #f9fafb);
}

.admin-edit-fieldset legend {
  padding: 0 0.3rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.admin-edit-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.admin-edit-row label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted, #6b7280);
}

/* Group "ku" + input */
.admin-edit-input-prefix {
  display: flex;
  align-items: stretch;
  gap: 0.25rem;
}

.admin-edit-input-prefix__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.6rem;
  border-radius: 0.55rem;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.4);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary, #0d6efd);
}

.admin-edit-input-prefix input {
  flex: 1;
}

/* Champs formulaires */
.admin-edit-row input,
.admin-edit-row textarea,
.admin-edit-row select {
  border-radius: 0.55rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.8));
  padding: 0.45rem 0.6rem;
  font-size: 0.9rem;
  background: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
}

.admin-edit-row textarea {
  resize: vertical;
}

/* Messages */
.admin-edit-message {
  font-size: 0.85rem;
  margin: 0.2rem 0 0;
}

.admin-edit-message--error {
  color: #b91c1c;
}

.admin-edit-message--success {
  color: #15803d;
}

/* Actions */
.admin-edit-actions {
  margin-top: 0.8rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.admin-edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: var(--surface-elevated, #ffffff);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease;
}

.admin-edit-btn--primary {
  background: var(--primary, #0d6efd);
  color: #ffffff;
  border-color: var(--primary, #0d6efd);
}

.admin-edit-btn--secondary {
  background: var(--surface-default, #f9fafb);
  color: var(--text-default, #111827);
  border-color: var(--border-subtle, rgba(148, 163, 184, 0.9));
}

.admin-edit-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.admin-edit-btn:hover:not(:disabled),
.admin-edit-btn:focus-visible:not(:disabled) {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
}

@media (max-width: 768px) {
  .admin-edit-page {
    padding-inline: 1rem;
  }
}
</style>
