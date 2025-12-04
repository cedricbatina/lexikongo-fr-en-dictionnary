<template>
  <main class="admin-edit-page" aria-labelledby="admin-add-word-title">
    <LkPageHero
      id="admin-add-word-title"
      :eyebrow="t('details.word.label') || 'Mot'"
      :title="pageTitle"
      :description="t('details.word.subtitle') || fallbackSubtitle"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-tools" aria-hidden="true"></i>
          <span>
            {{ t('admin.word.add.meta') || 'Admin · Ajout de mot' }}
          </span>
        </p>
      </template>

      <template #side>
        <div class="admin-edit-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <section class="admin-edit-card" aria-label="Formulaire d'ajout de mot">
      <header class="admin-edit-card__header">
        <h2 class="admin-edit-card__title">
          {{ form.singular || '—' }}
        </h2>
        <p v-if="form.plural" class="admin-edit-card__subtitle">
          {{ form.plural }}
        </p>
      </header>

      <form class="admin-edit-form" @submit.prevent="onSubmit">
        <!-- Kikongo -->
        <fieldset class="admin-edit-fieldset">
          <legend>{{ t('details.common.kikongoData') || 'Données en kikongo' }}</legend>

          <div class="admin-edit-row">
            <label for="singular">
              {{ t('details.word.singular') || 'Singulier' }}
            </label>
            <input
              id="singular"
              v-model="form.singular"
              type="text"
              required
            />
          </div>

          <div class="admin-edit-row">
            <label for="plural">
              {{ t('details.word.plural') || 'Pluriel' }}
            </label>
            <input
              id="plural"
              v-model="form.plural"
              type="text"
            />
          </div>

          <div class="admin-edit-row">
            <label for="phonetic">
              {{ t('details.common.phonetic') || 'Phonétique' }}
            </label>
            <input
              id="phonetic"
              v-model="form.phonetic"
              type="text"
            />
          </div>

          <div class="admin-edit-row">
            <label for="root">
              {{ t('details.word.root') || 'Racine' }}
            </label>
            <input
              id="root"
              v-model="form.root"
              type="text"
            />
          </div>

          <!-- Classe nominale -->
          <div class="admin-edit-row">
            <label for="nominalClass">
              {{ t('details.word.nominalClass') || 'Classe nominale' }}
            </label>
            <select
              id="nominalClass"
              v-model="form.class_id"
            >
              <option :value="null">
                —
              </option>
              <option
                v-for="nc in nominalClasses"
                :key="nc.class_id"
                :value="nc.class_id"
              >
                {{ nc.class_name }}
              </option>
            </select>
          </div>

          <!-- Variabilité du nombre -->
          <div class="admin-edit-row">
            <label for="numberVariability">
              {{ t('details.word.numberVariability.label') || 'Variabilité du nombre' }}
            </label>
            <select
              id="numberVariability"
              v-model="form.number_variability"
            >
              <option value="singular_only">
                {{ t('details.word.numberVariability.singular_only') || 'Singulier uniquement' }}
              </option>
              <option value="plural_only">
                {{ t('details.word.numberVariability.plural_only') || 'Pluriel uniquement' }}
              </option>
              <option value="invariable">
                {{ t('details.word.numberVariability.invariable') || 'Invariable' }}
              </option>
              <option value="variable">
                {{ t('details.word.numberVariability.variable') || 'Variable' }}
              </option>
            </select>
          </div>
        </fieldset>

        <!-- Traductions -->
        <fieldset class="admin-edit-fieldset">
          <legend>{{ t('details.common.translations') || 'Traductions' }}</legend>

          <div class="admin-edit-row">
            <label for="translation_fr">
              {{ t('details.common.fr') || 'Français' }}
            </label>
            <textarea
              id="translation_fr"
              v-model="form.translation_fr"
              rows="3"
              :placeholder="
                t('admin.word.placeholders.translationFr') ||
                'Sens FR séparés par des virgules'
              "
            />
          </div>

          <div class="admin-edit-row">
            <label for="translation_en">
              {{ t('details.common.en') || 'Anglais' }}
            </label>
            <textarea
              id="translation_en"
              v-model="form.translation_en"
              rows="3"
              :placeholder="
                t('admin.word.placeholders.translationEn') ||
                'EN meanings separated by commas'
              "
            />
          </div>
        </fieldset>

        <!-- Messages -->
        <p v-if="error" class="admin-edit-message admin-edit-message--error">
          {{ error }}
        </p>
        <p v-if="success" class="admin-edit-message admin-edit-message--success">
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
                  ? t('admin.word.add.saving') || 'Enregistrement…'
                  : t('admin.word.add.submit') || 'Créer ce mot'
              }}
            </span>
          </button>

          <button
            type="button"
            class="admin-edit-btn"
            @click="resetForm"
            :disabled="isSaving"
          >
            <i class="fas fa-undo" aria-hidden="true"></i>
            <span>
              {{ t('admin.word.add.reset') || 'Réinitialiser' }}
            </span>
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSeoMeta } from '#imports';
import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import * as Toastification from 'vue-toastification';
import { useWordStore } from '~/stores/wordStore';

const toast = Toastification.useToast();
const router = useRouter();
const { t } = useI18n();
const wordStore = useWordStore();

const nominalClasses = ref([]);

const form = ref({
  singular: '',
  plural: '',
  root: '',
  phonetic: '',
  class_id: null,
  translation_fr: '',
  translation_en: '',
  number_variability: 'variable',
});

const isSaving = ref(false);
const error = ref('');
const success = ref('');

const fallbackSubtitle =
  'Fiche détaillée d’un mot en kikongo avec sa phonétique, sa classe nominale et ses traductions.';

const pageTitle = computed(
  () =>
    t('admin.word.add.pageTitle') ||
    'Admin · Ajouter un mot'
);

useSeoMeta({
  title: () =>
    t('admin.word.add.seoTitle') ||
    'Admin · Ajouter un mot – Lexikongo',
  description: () =>
    t('admin.word.add.seoDescription') ||
    'Tableau de bord admin · ajout d’un mot en kikongo (forme, classe nominale, phonétique, traductions).',
});

/**
 * Charge la liste des classes nominales
 */
const loadNominalClasses = async () => {
  try {
    const data = await $fetch('/api/nominal-classes');
    nominalClasses.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Erreur lors du chargement des classes nominales :', err);
  }
};

const resetForm = () => {
  form.value = {
    singular: '',
    plural: '',
    root: '',
    phonetic: '',
    class_id: null,
    translation_fr: '',
    translation_en: '',
    number_variability: 'variable',
  };
  error.value = '';
  success.value = '';
};

/**
 * Soumission du formulaire : création du mot
 */
const onSubmit = async () => {
  error.value = '';
  success.value = '';

  if (!form.value.singular) {
    error.value =
      t('admin.word.add.errorRequiredSingular') ||
      'Le singulier est obligatoire.';
    return;
  }

  isSaving.value = true;

  try {
    const payload = {
      singular: form.value.singular,
      plural: form.value.plural || null,
      root: form.value.root || null,
      phonetic: form.value.phonetic || null,
      class_id: form.value.class_id || null,
      translation_fr: form.value.translation_fr || '',
      translation_en: form.value.translation_en || '',
      number_variability: form.value.number_variability || 'variable',
    };

    const created = await $fetch('/api/admin/word', {
      method: 'POST',
      body: payload,
    });

    await wordStore.fetchAll();

    const msg =
      t('admin.word.add.success') || 'Mot créé avec succès.';
    toast.success(msg);
    success.value = msg;

    if (created?.slug) {
      router.push(`/details/word/${created.slug}`);
    } else {
      resetForm();
    }
  } catch (err) {
    console.error('Erreur lors de la création du mot :', err);
    const msg =
      err?.data?.statusMessage ||
      t('admin.word.add.errorSave') ||
      'Erreur lors de la création du mot.';
    error.value = msg;
    toast.error(msg);
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  await loadNominalClasses();
});
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
