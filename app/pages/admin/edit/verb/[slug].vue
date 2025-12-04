<template>
  <main class="admin-edit-page" aria-labelledby="admin-edit-verb-title">
    <LkPageHero
      id="admin-edit-verb-title"
      :eyebrow="t('details.verb.label') || 'Verbe'"
      :title="heroTitle"
      :description="t('details.verb.subtitle') || fallbackSubtitle"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-tools" aria-hidden="true"></i>
          <span>Admin · Edition de verbe</span>
        </p>
      </template>

      <template #side>
        <div class="admin-edit-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <section class="admin-edit-card" aria-label="Formulaire d'édition de verbe">
      <header class="admin-edit-card__header">
        <h2 class="admin-edit-card__title">
          <span class="admin-edit-card__ku">ku</span>
          <span>{{ details.name || '—' }}</span>
        </h2>
        <p v-if="details.root" class="admin-edit-card__subtitle">
          {{ t('details.verb.root') || 'Racine' }} : {{ details.root }}
        </p>
      </header>

      <form class="admin-edit-form" @submit.prevent="onSubmit">
        <!-- Données en kikongo -->
        <fieldset class="admin-edit-fieldset">
          <legend>{{ t('details.common.kikongoData') || 'Données en kikongo' }}</legend>

          <div class="admin-edit-row">
            <label for="name">
              {{ t('details.verb.infinitive') || 'Infinitif' }}
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
            />
            <small class="admin-edit-hint">Ex. « longa » (l’infinitif sera affiché comme « ku longa »)</small>
          </div>

          <div class="admin-edit-row">
            <label for="root">
              {{ t('details.verb.root') || 'Racine' }}
            </label>
            <input
              id="root"
              v-model="form.root"
              type="text"
            />
          </div>

          <div class="admin-edit-row">
            <label for="suffix">
              {{ t('details.verb.suffix') || 'Suffixe' }}
            </label>
            <input
              id="suffix"
              v-model="form.suffix"
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
              placeholder="Sens FR séparés par des virgules"
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
              placeholder="EN meanings separated by commas"
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
              {{ isSaving ? 'Enregistrement…' : 'Enregistrer les modifications' }}
            </span>
          </button>

          <button
            type="button"
            class="admin-edit-btn admin-edit-btn--danger"
            :disabled="isDeleting"
            @click="isDeleteModalOpen = true"
          >
            <i class="fas fa-trash" aria-hidden="true"></i>
            <span>
              {{ isDeleting ? 'Suppression…' : 'Supprimer ce verbe' }}
            </span>
          </button>
        </div>
      </form>
    </section>

    <!-- Modal de confirmation de suppression -->
    <LkConfirmModal
      v-model:open="isDeleteModalOpen"
      :title="t('details.verb.editCta') || 'Éditer ce verbe'"
      :description="deleteDescription"
      :confirm-label="t('actions.delete') || 'Supprimer'"
      :cancel-label="t('common.cancel') || 'Annuler'"
      @confirm="onConfirmDelete"
    />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSeoMeta } from '#imports';
import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import LkConfirmModal from '@/components/LkConfirmModal.vue';
import * as Toastification from 'vue-toastification';
import { useVerbStore } from '~/stores/verbStore';

const verbStore = useVerbStore();

const toast = Toastification.useToast();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const slug = computed(() => route.params.slug);

const details = ref({
  name: '',
  root: '',
  suffix: '',
  phonetic: '',
  translation_fr: '',
  translation_en: '',
});

const form = ref({
  name: '',
  root: '',
  suffix: '',
  phonetic: '',
  translation_fr: '',
  translation_en: '',
});

const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const error = ref('');
const success = ref('');
const isDeleteModalOpen = ref(false);

const fallbackSubtitle =
  "Fiche détaillée d’un verbe en kikongo avec sa phonétique, sa racine et ses traductions.";

const heroTitle = computed(() => {
  if (!details.value?.name) {
    return t('details.verb.label') || 'Verbe';
  }
  return `${t('details.verb.label') || 'Verbe'} « ku ${details.value.name} »`;
});

const deleteDescription = computed(
  () =>
    t('admin.verb.deleteDescription') ||
    "Cette action est définitive. Le verbe, son slug et ses traductions seront supprimés."
);

useSeoMeta({
  title: () =>
    details.value?.name
      ? `Admin · Éditer le verbe « ku ${details.value.name} » – Lexikongo`
      : 'Admin · Éditer un verbe – Lexikongo',
  description: () =>
    'Tableau de bord admin · édition d’un verbe en kikongo (infinitif, phonétique, racine, traductions).',
});

const loadDetails = async () => {
  if (!slug.value) return;
  isLoading.value = true;
  error.value = '';
  try {
    const data = await $fetch(`/api/details/verb/${slug.value}`);
    details.value = {
      ...details.value,
      ...data,
    };
    form.value = {
      name: data.name || '',
      root: data.root || '',
      suffix: data.suffix || '',
      phonetic: data.phonetic || '',
      translation_fr: data.translation_fr || '',
      translation_en: data.translation_en || '',
    };
  } catch (err) {
    console.error('Erreur lors du chargement du verbe :', err);
    error.value = 'Erreur lors du chargement de la fiche.';
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async () => {
  if (!slug.value) return;
  isSaving.value = true;
  error.value = '';
  success.value = '';

try {
    await $fetch(`/api/admin/verb/${slug.value}`, {
      method: 'PUT',
      body: { ...form.value },
    });

    await verbStore.fetchAll();

    toast.success("Verbe mis à jour avec succès.");
    success.value = 'Verbe mis à jour avec succès.';

    await loadDetails();
  } catch (err) {
    console.error('Erreur save verbe :', err);
    error.value =
      err?.data?.statusMessage ||
      'Erreur lors de l’enregistrement des modifications.';
  } finally {
    isSaving.value = false;
  }
};

const onConfirmDelete = async () => {
  if (!slug.value) return;

  isDeleting.value = true;
  error.value = '';
  success.value = '';

  try {
    await $fetch(`/api/admin/verb/${slug.value}`, {
      method: 'DELETE',
    });
    success.value = 'Verbe supprimé avec succès.';
    toast.success('Verbe supprimé avec succès.');
    isDeleteModalOpen.value = false;

    await router.push('/verbs');
  } catch (err) {
    console.error('Erreur suppression verbe :', err);
    error.value =
      err?.data?.statusMessage || 'Erreur lors de la suppression du verbe.';
  } finally {
    isDeleting.value = false;
  }
};

onMounted(loadDetails);
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
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
}

.admin-edit-card__ku {
  font-size: 0.95rem;
  font-weight: 600;
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
.admin-edit-row textarea {
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

.admin-edit-hint {
  font-size: 0.78rem;
  color: var(--text-muted, #6b7280);
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

.admin-edit-btn--danger {
  background: #fee2e2;
  color: #b91c1c;
  border-color: #fecaca;
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
