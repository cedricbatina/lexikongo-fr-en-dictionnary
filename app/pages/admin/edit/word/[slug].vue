<template>
  <main class="admin-edit-page" aria-labelledby="admin-edit-word-title">
    <LkPageHero
      id="admin-edit-word-title"
      :eyebrow="t('details.word.label') || 'Mot'"
      :title="heroTitle"
      :description="t('details.word.subtitle') || fallbackSubtitle"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-tools" aria-hidden="true"></i>
          <span>Admin · Edition de mot</span>
        </p>
      </template>

      <template #side>
        <div class="admin-edit-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <section class="admin-edit-card" aria-label="Formulaire d'édition de mot">
      <header class="admin-edit-card__header">
        <h2 class="admin-edit-card__title">
          {{ details.singular || "—" }}
        </h2>
        <p v-if="details.plural" class="admin-edit-card__subtitle">
          {{ details.plural }}
        </p>
      </header>

      <form class="admin-edit-form" @submit.prevent="onSubmit">
        <!-- Kikongo -->
        <fieldset class="admin-edit-fieldset">
          <legend>
            {{ t("details.common.kikongoData") || "Données en kikongo" }}
          </legend>

          <div class="admin-edit-row">
            <label for="singular">
              {{ t("details.word.singular") || "Singulier" }}
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
              {{ t("details.word.plural") || "Pluriel" }}
            </label>
            <input
              id="plural"
              v-model="form.plural"
              type="text"
            />
          </div>

          <div class="admin-edit-row">
            <label for="phonetic">
              {{ t("details.common.phonetic") || "Phonétique" }}
            </label>
            <input
              id="phonetic"
              v-model="form.phonetic"
              type="text"
            />
          </div>

          <div class="admin-edit-row">
            <label for="root">
              {{ t("details.word.root") || "Racine" }}
            </label>
            <input
              id="root"
              v-model="form.root"
              type="text"
            />
          </div>

          <!-- 🔹 Classe nominale -->
          <div class="admin-edit-row">
            <label for="class_id">
              {{ t("details.word.nominalClass") || "Classe nominale" }}
            </label>
            <select
              id="class_id"
              v-model="form.class_id"
            >
              <option value="">
                — 
              </option>
              <option
                v-for="cls in nominalClasses"
                :key="cls.class_id"
                :value="String(cls.class_id)"
              >
                {{ cls.class_name }}
              </option>
            </select>
          </div>

          <div class="admin-edit-row">
            <label for="numberVariability">
              {{
                t("details.word.numberVariability.label") ||
                "Variabilité du nombre"
              }}
            </label>
            <select
              id="numberVariability"
              v-model="form.number_variability"
            >
              <option value="singular_only">
                {{
                  t("details.word.numberVariability.singular_only") ||
                  "Singulier uniquement"
                }}
              </option>
              <option value="plural_only">
                {{
                  t("details.word.numberVariability.plural_only") ||
                  "Pluriel uniquement"
                }}
              </option>
              <option value="invariable">
                {{
                  t("details.word.numberVariability.invariable") ||
                  "Invariable"
                }}
              </option>
              <option value="variable">
                {{
                  t("details.word.numberVariability.variable") || "Variable"
                }}
              </option>
            </select>
          </div>
        </fieldset>

        <!-- Traductions -->
        <fieldset class="admin-edit-fieldset">
          <legend>
            {{ t("details.common.translations") || "Traductions" }}
          </legend>

          <div class="admin-edit-row">
            <label for="translation_fr">
              {{ t("details.common.fr") || "Français" }}
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
              {{ t("details.common.en") || "Anglais" }}
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
              {{ isSaving ? "Enregistrement…" : "Enregistrer les modifications" }}
            </span>
          </button>

          <button
            type="button"
            class="admin-edit-btn admin-edit-btn--danger"
            :disabled="isDeleting"
            @click="onDelete"
          >
            <i class="fas fa-trash" aria-hidden="true"></i>
            <span>
              {{ isDeleting ? "Suppression…" : "Supprimer ce mot" }}
            </span>
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useSeoMeta } from "#imports";
import LkPageHero from "@/components/LkPageHero.vue";
import LkActionsBar from "@/components/LkActionsBar.vue";
import * as Toastification from "vue-toastification";
import { useWordStore } from "~/stores/wordStore";
import { useConfirmStore } from "~/stores/confirmStore";

const toast = Toastification.useToast();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const wordStore = useWordStore();
const confirmStore = useConfirmStore();

const slug = computed(() => route.params.slug);

const nominalClasses = ref([]);

const details = ref({
  singular: "",
  plural: "",
  root: "",
  phonetic: "",
  translation_fr: "",
  translation_en: "",
  number_variability: "variable",
  class_id: "",
});

const form = ref({
  singular: "",
  plural: "",
  root: "",
  phonetic: "",
  translation_fr: "",
  translation_en: "",
  number_variability: "variable",
  class_id: "",
});

const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const error = ref("");
const success = ref("");

const fallbackSubtitle =
  "Fiche détaillée d’un mot en kikongo avec sa phonétique, sa classe nominale et ses traductions.";

const heroTitle = computed(() => {
  if (!details.value?.singular) {
    return t("details.word.label") || "Mot";
  }
  return `${t("details.word.label") || "Mot"} « ${details.value.singular} »`;
});

useSeoMeta({
  title: () =>
    details.value?.singular
      ? `Admin · Éditer le mot « ${details.value.singular} » – Lexikongo`
      : "Admin · Éditer un mot – Lexikongo",
  description: () =>
    "Tableau de bord admin · édition d’un mot en kikongo (forme, phonétique, traductions).",
});

const loadNominalClasses = async () => {
  try {
    const data = await $fetch("/api/nominal-classes");
    nominalClasses.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erreur chargement classes nominales :", err);
  }
};

const loadDetails = async () => {
  if (!slug.value) return;
  isLoading.value = true;
  error.value = "";
  try {
    const data = await $fetch(`/api/details/word/${slug.value}`);
    details.value = {
      ...details.value,
      ...data,
    };
    form.value = {
      singular: data.singular || "",
      plural: data.plural || "",
      root: data.root || "",
      phonetic: data.phonetic || "",
      translation_fr: data.translation_fr || "",
      translation_en: data.translation_en || "",
      number_variability: data.number_variability || "variable",
      class_id:
        data.class_id != null && data.class_id !== ""
          ? String(data.class_id)
          : "",
    };
  } catch (err) {
    console.error("Erreur lors du chargement du mot :", err);
    error.value = "Erreur lors du chargement de la fiche.";
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async () => {
  if (!slug.value) return;
  isSaving.value = true;
  error.value = "";
  success.value = "";

  try {
    // on normalise class_id pour l'API (null si vide)
    const payload = {
      ...form.value,
      class_id: form.value.class_id ? Number(form.value.class_id) : null,
    };

    await $fetch(`/api/admin/word/${slug.value}`, {
      method: "PUT",
      body: payload,
    });

    await wordStore.fetchAll();

    toast.success("Mot mis à jour avec succès.");
    success.value = "Mot mis à jour avec succès.";

    await loadDetails();
  } catch (err) {
    console.error("Erreur save mot :", err);
    error.value =
      err?.data?.statusMessage ||
      "Erreur lors de l’enregistrement des modifications.";
  } finally {
    isSaving.value = false;
  }
};

const onDelete = async () => {
  if (!slug.value) return;

  const ok = await confirmStore.ask({
    title: "Supprimer ce mot ?",
    message:
      "Cette action est définitive. Le mot, son slug et ses traductions seront supprimés.",
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    danger: true,
  });

  if (!ok) return;

  isDeleting.value = true;
  error.value = "";
  success.value = "";

  try {
    await $fetch(`/api/admin/word/${slug.value}`, {
      method: "DELETE",
    });

    toast.success("Mot supprimé avec succès.");
    success.value = "Mot supprimé avec succès.";

    await wordStore.fetchAll();

    await router.push("/words");
  } catch (err) {
    console.error("Erreur suppression mot :", err);
    error.value =
      err?.data?.statusMessage || "Erreur lors de la suppression du mot.";
  } finally {
    isDeleting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadNominalClasses(), loadDetails()]);
});
</script>

<style scoped>
/* mêmes styles que ta version précédente */
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
  font-weight: 600;
  color: var(--primary, #0d6efd);
}

.admin-edit-card__subtitle {
  margin: 0.2rem 0 0;
  font-size: 1.4rem;
  font-weight: 600;
   color: var(--primary, #5e18a9);
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
