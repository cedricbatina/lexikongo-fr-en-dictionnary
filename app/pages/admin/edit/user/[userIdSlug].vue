<!-- pages/admin/edit/user/[userIdSlug].vue -->
<template>
  <main
    class="lk-page lk-page--admin-user-edit"
    aria-labelledby="admin-user-edit-page-title"
  >
    <!-- Lien retour -->
    <nav class="admin-user-edit__back-nav">
      <NuxtLink to="/admin/users" class="admin-user-edit__back-link">
        <i class="fas fa-arrow-left" aria-hidden="true"></i>
        <span>{{ t('admin.user.backToList') }}</span>
      </NuxtLink>
    </nav>

    <!-- Hero -->
    <LkPageHero
      id="admin-user-edit-page-title"
      :eyebrow="tt('admin.userEdit.page.eyebrow', 'Administration · Utilisateurs')"
      :title="heroTitle"
      :description="tt('admin.userEdit.page.subtitle', 'Modifier les informations du compte utilisateur.')"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-user-edit" aria-hidden="true"></i>
          <span>
            {{ tt('admin.userEdit.page.meta', 'Seuls les administrateurs autorisés peuvent modifier ces informations.') }}
          </span>
        </p>
      </template>

      <template #side>
        <aside class="lk-hero-side">
          <p v-if="user && user.email" class="admin-user-edit__email">
            {{ user.email }}
          </p>
        </aside>
      </template>
    </LkPageHero>

    <!-- Contenu principal -->
    <section
      class="lk-page__section lk-page__section--admin-user-edit"
      aria-label="Formulaire d’édition du compte utilisateur"
    >
      <!-- États loading / erreur globale -->
      <div v-if="pending" class="admin-user-edit__status" role="status">
        {{ tt('admin.user.states.loading', 'Chargement du compte utilisateur…') }}
      </div>

      <p v-else-if="error" class="admin-user-edit__error" role="alert">
        {{ tt('admin.user.states.error', 'Impossible de charger ce compte pour le moment.') }}
      </p>

      <p v-else-if="!user" class="admin-user-edit__empty">
        {{ tt('admin.user.states.notFound', 'Utilisateur introuvable.') }}
      </p>

      <!-- Formulaire -->
      <form
        v-else
        class="admin-user-edit__form"
        @submit.prevent="onSubmit"
        novalidate
      >
        <!-- Carte infos principales -->
        <section class="admin-user-edit__card">
          <h2 class="admin-user-edit__card-title">
            {{ tt('admin.userEdit.sections.account', 'Informations du compte') }}
          </h2>

          <div class="admin-user-edit__grid">
            <!-- ID en lecture seule -->
            <div class="admin-user-edit__field admin-user-edit__field--inline">
              <label class="admin-user-edit__label">
                {{ tt('admin.user.labels.id', 'Identifiant interne') }}
              </label>
              <div class="admin-user-edit__static">
                #{{ user.user_id }}
              </div>
            </div>

            <!-- Username -->
            <div class="admin-user-edit__field">
              <label
                class="admin-user-edit__label"
                for="admin-user-username"
              >
                {{ tt('admin.user.labels.username', "Nom d'utilisateur") }}
              </label>
              <input
                id="admin-user-username"
                v-model.trim="form.username"
                type="text"
                class="admin-user-edit__input"
                :placeholder="tt('admin.userEdit.placeholders.username', 'Ex. : Tusikila Kinuani Kia Batina')"
                required
              />
              <p v-if="fieldErrors.username" class="admin-user-edit__field-error">
                {{ fieldErrors.username }}
              </p>
            </div>

            <!-- Email -->
            <div class="admin-user-edit__field">
              <label
                class="admin-user-edit__label"
                for="admin-user-email"
              >
                {{ tt('admin.user.labels.email', 'Adresse email') }}
              </label>
              <input
                id="admin-user-email"
                v-model.trim="form.email"
                type="email"
                class="admin-user-edit__input"
                :placeholder="tt('admin.userEdit.placeholders.email', 'Ex. : utilisateur@example.com')"
                required
              />
              <p v-if="fieldErrors.email" class="admin-user-edit__field-error">
                {{ fieldErrors.email }}
              </p>
            </div>

            <!-- Créé le (lecture seule) -->
            <div class="admin-user-edit__field admin-user-edit__field--inline">
              <label class="admin-user-edit__label">
                {{ tt('admin.user.labels.createdAt', 'Créé le') }}
              </label>
              <div class="admin-user-edit__static">
                {{ formatDate(user.created_at) }}
              </div>
            </div>

            <!-- Dernière connexion (read-only) -->
            <div class="admin-user-edit__field admin-user-edit__field--inline">
              <label class="admin-user-edit__label">
                {{ tt('admin.user.labels.lastSeen', 'Dernière connexion') }}
              </label>
              <div class="admin-user-edit__static">
                {{ formatDateTime(user.last_seen) }}
              </div>
            </div>
          </div>
        </section>

        <!-- Carte rôles + sécurité -->
        <section class="admin-user-edit__card">
          <h2 class="admin-user-edit__card-title">
            {{ tt('admin.user.sections.roles', 'Rôles & permissions') }}
          </h2>

          <!-- Rôles -->
          <div class="admin-user-edit__roles">
            <p class="admin-user-edit__label">
              {{ tt('admin.user.labels.roles', 'Rôles attribués') }}
            </p>
            <div class="admin-user-edit__roles-options">
              <label
                v-for="role in AVAILABLE_ROLES"
                :key="role"
                class="admin-user-edit__checkbox-label"
              >
                <input
                  type="checkbox"
                  class="admin-user-edit__checkbox"
                  :value="role"
                  v-model="form.roles"
                />
                <span class="admin-user-edit__checkbox-text">
                  {{ role }}
                </span>
              </label>
            </div>
            <p class="admin-user-edit__hint">
              {{ tt('admin.userEdit.hints.roles', 'L’absence de rôle spécifique équivaut à un rôle “utilisateur” classique.') }}
            </p>
          </div>

          <!-- Sécurité / email vérifié -->
          <div class="admin-user-edit__security">
            <h3 class="admin-user-edit__security-title">
              {{ tt('admin.user.sections.security', 'Sécurité') }}
            </h3>

            <label class="admin-user-edit__checkbox-label admin-user-edit__checkbox-label--switch">
              <input
                type="checkbox"
                class="admin-user-edit__checkbox"
                v-model="form.emailVerified"
              />
              <span class="admin-user-edit__checkbox-text">
                {{
                  form.emailVerified
                    ? tt('admin.user.labels.verifiedYes', 'Email vérifié')
                    : tt('admin.user.labels.verifiedNo', 'Email non vérifié')
                }}
              </span>
            </label>

            <p class="admin-user-edit__hint">
              {{ tt('admin.user.security.passwordHint', 'Le mot de passe reste stocké de manière sécurisée (hash en base).') }}
            </p>
          </div>
        </section>

        <!-- Actions formulaire -->
        <footer class="admin-user-edit__footer">
          <button
            type="button"
            class="admin-user-edit__btn admin-user-edit__btn--ghost"
            @click="goBackToDetail"
          >
            {{ tt('common.cancel', 'Annuler') }}
          </button>

          <button
            type="submit"
            class="admin-user-edit__btn admin-user-edit__btn--primary"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">
              {{ tt('admin.userEdit.actions.save', 'Enregistrer les modifications') }}
            </span>
            <span v-else>
              {{ tt('common.saving', 'Enregistrement en cours…') }}
            </span>
          </button>
        </footer>

        <p v-if="submitError" class="admin-user-edit__submit-error" role="alert">
          {{ submitError }}
        </p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter, useAsyncData, useSeoMeta } from '#imports';
import { useI18n } from 'vue-i18n';
import * as Toastification from 'vue-toastification';
import LkPageHero from '@/components/LkPageHero.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = Toastification.useToast();   // 👈 nouveau
// petit helper i18n avec fallback
const tt = (key, fallback) => {
  const v = t(key);
  return v === key ? fallback : v;
};

// On récupère l’ID numérique depuis "10-tusikila-kinuani-kia-batina"
const rawParam = route.params.userIdSlug;
const idPart = Array.isArray(rawParam) ? rawParam[0] : rawParam;
const userId = computed(() => {
  if (!idPart || typeof idPart !== 'string') return null;
  const first = idPart.split('-')[0];
  const n = Number.parseInt(first, 10);
  return Number.isNaN(n) ? null : n;
});

// Chargement des données utilisateur
const {
  data: user,
  pending,
  error,
} = await useAsyncData(
  () => `admin-user-edit-${userId.value || 'unknown'}`,
  async () => {
    if (!userId.value) {
      throw new Error('Invalid userId slug param');
    }
    return await $fetch(`/api/admin/users/${userId.value}`);
  }
);

// Form state
const form = ref({
  username: '',
  email: '',
  roles: [],
  emailVerified: false,
});

const fieldErrors = ref({
  username: '',
  email: '',
});

const submitError = ref('');
const isSubmitting = ref(false);

// Rôles possibles (adaptables)
const AVAILABLE_ROLES = ['admin', 'contributor', 'user'];

// Pré-remplir le formulaire quand les données arrivent
if (user.value) {
  form.value.username = user.value.username || '';
  form.value.email = user.value.email || '';
  form.value.roles = Array.isArray(user.value.roles)
    ? [...user.value.roles]
    : [];
  form.value.emailVerified =
    user.value.email_verified === 1 ||
    user.value.email_verified === true;
}

// Titre du hero
const heroTitle = computed(() =>
  user.value?.username ||
  tt('admin.userEdit.page.titleFallback', 'Modifier un compte utilisateur')
);

// SEO
useSeoMeta({
  title: () =>
    t('admin.userEdit.meta.title', { username: heroTitle.value }),
  description: () =>
    t('admin.userEdit.meta.description', {
      username: heroTitle.value,
    }),
  robots: 'noindex, nofollow',
});

// Navigation retour vers la fiche détail
const goBackToDetail = () => {
  const param = route.params.userIdSlug;
  const slug = Array.isArray(param) ? param[0] : param;
  router.push(`/admin/user/${slug}`);
};

// Validations simples
const validate = () => {
  submitError.value = '';
  fieldErrors.value.username = '';
  fieldErrors.value.email = '';

  if (!form.value.username.trim()) {
    fieldErrors.value.username = tt(
      'admin.userEdit.errors.usernameRequired',
      "Le nom d'utilisateur est obligatoire."
    );
  }

  if (!form.value.email.trim()) {
    fieldErrors.value.email = tt(
      'admin.userEdit.errors.emailRequired',
      "L'adresse email est obligatoire."
    );
  } else if (!/.+@.+\..+/.test(form.value.email)) {
    fieldErrors.value.email = tt(
      'admin.userEdit.errors.emailInvalid',
      "L'adresse email n'est pas valide."
    );
  }

  return !fieldErrors.value.username && !fieldErrors.value.email;
};

// Submit
const onSubmit = async () => {
  if (!userId.value || !user.value) return;
  if (!validate()) return;

  isSubmitting.value = true;
  submitError.value = '';

  try {
    await $fetch(`/api/admin/users/${userId.value}`, {
      method: 'PUT',
      body: {
        username: form.value.username,
        email: form.value.email,
        roles: form.value.roles,
        emailVerified: form.value.emailVerified,
      },
    });
  // ✅ toast succès
    toast.success(
      t('admin.user.states.updated')
      || 'Le compte utilisateur a bien été mis à jour.'
    );

    // On peut rester simple : retour vers la fiche détail
    const param = route.params.userIdSlug;
    const slug = Array.isArray(param) ? param[0] : param;
    router.push(`/admin/user/${slug}`);
  } catch (err) {
    console.error('Erreur lors de la mise à jour utilisateur :', err);
    submitError.value = tt(
      'admin.userEdit.errors.submit',
      'Impossible de sauvegarder les modifications pour le moment.'
    );
     toast.error(apiMsg);
  } finally {
    isSubmitting.value = false;
  }
};
const onDelete = async () => {
  if (!userId.value) return;

  // ouverture de la modale de confirmation
  const confirmed = await confirmStore.ask({
    title: t('admin.user.actions.deleteConfirmTitle'),
    message: t('admin.user.actions.deleteConfirmBody', {
      username: userDisplayName.value,
    }),
    confirmLabel: t('admin.user.actions.deleteConfirmCta'),
    cancelLabel: t('common.actions.cancel') || 'Annuler',
    danger: true,
  });

  if (!confirmed) return;

  try {
    await $fetch(`/api/admin/users/${userId.value}`, {
      method: 'DELETE',
    });

    // ✅ toast succès
    toast.success(
      t('admin.user.states.deleted')
      || 'Le compte utilisateur a bien été supprimé.'
    );

    router.push('/admin/users');
  } catch (err) {
    console.error('Erreur suppression utilisateur (admin) :', err);

    const apiMsg =
      err?.data?.statusMessage
      || err?.data?.message
      || t('admin.user.states.deleteError')
      || 'Impossible de supprimer ce compte utilisateur.';

    // ❌ toast erreur
    toast.error(apiMsg);
  }
};

// Formatters
const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style scoped>
.lk-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Retour */
.admin-user-edit__back-nav {
  margin-bottom: 0.5rem;
}

.admin-user-edit__back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--primary, #2563eb);
}

.admin-user-edit__back-link i {
  font-size: 0.85rem;
}

/* Meta hero */
.lk-hero-meta {
  margin: 0.4rem 0 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

.lk-hero-meta i {
  color: var(--primary, #2563eb);
}

.lk-hero-side {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.admin-user-edit__email {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

/* Section principale */
.lk-page__section--admin-user-edit {
  border-radius: 1rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  background: var(--surface-elevated, #f9fafb);
  padding: 1.2rem 1.3rem;
}

/* États globaux */
.admin-user-edit__status,
.admin-user-edit__error,
.admin-user-edit__empty {
  font-size: 0.95rem;
  color: var(--text-muted, #6b7280);
}

/* Form */
.admin-user-edit__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Cartes */
.admin-user-edit__card {
  border-radius: 0.9rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.45));
  background: var(--surface-default, #ffffff);
  padding: 0.9rem 1rem;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.admin-user-edit__card-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

/* Grille de champs */
.admin-user-edit__grid {
  display: grid;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .admin-user-edit__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Champs */
.admin-user-edit__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.admin-user-edit__field--inline {
  flex-direction: column;
}

.admin-user-edit__label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted, #6b7280);
}

.admin-user-edit__input {
  border-radius: 0.5rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.6));
  padding: 0.45rem 0.6rem;
  font-size: 0.9rem;
  background: var(--surface-input, #ffffff);
  color: var(--text-default, #111827);
}

.admin-user-edit__input:focus-visible {
  outline: 2px solid var(--primary, #2563eb);
  outline-offset: 1px;
}

.admin-user-edit__static {
  font-size: 0.9rem;
  color: var(--text-default, #111827);
}

.admin-user-edit__field-error {
  margin: 0;
  font-size: 0.8rem;
  color: var(--danger-text, #b91c1c);
}

/* Rôles */
.admin-user-edit__roles {
  margin-top: 0.25rem;
}

.admin-user-edit__roles-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.75rem;
  margin-top: 0.2rem;
}

.admin-user-edit__checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: var(--text-default, #111827);
}

.admin-user-edit__checkbox-label--switch {
  margin-top: 0.35rem;
}

.admin-user-edit__checkbox {
  accent-color: var(--primary, #2563eb);
}

.admin-user-edit__checkbox-text {
  font-size: 0.85rem;
}

.admin-user-edit__hint {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: var(--text-muted, #6b7280);
}

/* Sécurité */
.admin-user-edit__security {
  margin-top: 0.75rem;
}

.admin-user-edit__security-title {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

/* Footer du formulaire */
.admin-user-edit__footer {
  margin-top: 0.3rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.admin-user-edit__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease,
    border-color 0.15s ease;
}

.admin-user-edit__btn--ghost {
  background: transparent;
  color: var(--text-muted, #6b7280);
  border-color: var(--border-subtle, rgba(148, 163, 184, 0.6));
}

.admin-user-edit__btn--ghost:hover,
.admin-user-edit__btn--ghost:focus-visible {
  background: rgba(148, 163, 184, 0.08);
  transform: translateY(-1px);
}

.admin-user-edit__btn--primary {
  background: var(--primary, #2563eb);
  color: #ffffff;
}

.admin-user-edit__btn--primary:hover,
.admin-user-edit__btn--primary:focus-visible {
  background: var(--primary-hover, #1d4ed8);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.25);
  transform: translateY(-1px);
}

.admin-user-edit__btn[disabled] {
  opacity: 0.7;
  cursor: default;
  box-shadow: none;
  transform: none;
}

/* Erreur submit */
.admin-user-edit__submit-error {
  margin: 0.4rem 0 0;
  font-size: 0.85rem;
  color: var(--danger-text, #b91c1c);
}

/* Responsive */
@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .lk-page__section--admin-user-edit {
    padding-inline: 1rem;
  }

  .admin-user-edit__footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .admin-user-edit__btn {
    width: 100%;
  }
}
</style>
