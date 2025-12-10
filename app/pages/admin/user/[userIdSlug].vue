<template>
  <main
    class="lk-page lk-page--admin-user"
    aria-labelledby="admin-user-page-title"
  >
    <!-- Lien retour -->
    <nav class="admin-user__back-nav">
      <NuxtLink to="/admin/users" class="admin-user__back-link">
        <i class="fas fa-arrow-left" aria-hidden="true"></i>
        <span>{{ t('admin.user.backToList') }}</span>
      </NuxtLink>
    </nav>

    <!-- Hero -->
    <LkPageHero
      id="admin-user-page-title"
      :eyebrow="t('admin.user.page.eyebrow')"
      :title="userDisplayName"
      :description="t('admin.user.page.subtitle')"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-user-shield" aria-hidden="true"></i>
          <span>{{ t('admin.user.page.meta') }}</span>
        </p>
      </template>

      <template #side>
        <aside class="lk-hero-side">
          <p class="admin-user__email" v-if="user && user.email">
            {{ user.email }}
          </p>

          <div class="admin-user__actions">
            <!-- Bouton éditer -->
            <NuxtLink
              :to="editLink"
              class="admin-user__btn admin-user__btn--primary"
            >
              <i class="fas fa-edit" aria-hidden="true"></i>
              <span>{{ t('admin.user.actions.edit') }}</span>
            </NuxtLink>

            <!-- Bouton supprimer -->
            <button
              type="button"
              class="admin-user__btn admin-user__btn--danger"
              @click="onDelete"
            >
              <i class="fas fa-trash-alt" aria-hidden="true"></i>
              <span>{{ t('admin.user.actions.delete') }}</span>
            </button>
          </div>
        </aside>
      </template>
    </LkPageHero>

    <!-- Contenu principal -->
    <section
      class="lk-page__section lk-page__section--admin-user"
      aria-label="Détails du compte utilisateur"
    >
      <!-- États de chargement / erreur -->
      <div v-if="pending" class="admin-user__status" role="status">
        {{ t('admin.user.states.loading') }}
      </div>

      <p v-else-if="error" class="admin-user__error" role="alert">
        {{ t('admin.user.states.error') }}
      </p>

      <article v-else-if="user" class="admin-user__grid">
        <!-- Colonne infos principales -->
        <section class="admin-user__card">
          <h2 class="admin-user__card-title">
            {{ t('admin.user.sections.account') }}
          </h2>

          <dl class="admin-user__dl">
            <div class="admin-user__dl-row">
              <dt>{{ t('admin.user.labels.id') }}</dt>
              <dd>#{{ user.user_id }}</dd>
            </div>
            <div class="admin-user__dl-row">
              <dt>{{ t('admin.user.labels.username') }}</dt>
              <dd>{{ user.username || t('admin.user.labels.unknownUser') }}</dd>
            </div>
            <div class="admin-user__dl-row">
              <dt>{{ t('admin.user.labels.email') }}</dt>
              <dd>{{ user.email || t('admin.user.labels.noEmail') }}</dd>
            </div>
            <div class="admin-user__dl-row">
              <dt>{{ t('admin.user.labels.createdAt') }}</dt>
              <dd>{{ formatDate(user.created_at) }}</dd>
            </div>
            <div class="admin-user__dl-row">
              <dt>{{ t('admin.user.labels.updatedAt') }}</dt>
              <dd>{{ formatDateTime(user.updated_at) }}</dd>
            </div>
            <div class="admin-user__dl-row">
              <dt>{{ t('admin.user.labels.lastSeen') }}</dt>
              <dd>{{ formatDateTime(user.last_seen) }}</dd>
            </div>
            <div class="admin-user__dl-row">
              <dt>{{ t('admin.user.labels.previousSeen') }}</dt>
              <dd>{{ formatDateTime(user.previous_seen) }}</dd>
            </div>
          </dl>
        </section>

        <!-- Colonne rôles + sécurité -->
        <section class="admin-user__card">
          <h2 class="admin-user__card-title">
            {{ t('admin.user.sections.roles') }}
          </h2>

          <div class="admin-user__roles">
            <p class="admin-user__roles-label">
              {{ t('admin.user.labels.roles') }}
            </p>
            <div class="admin-user__roles-chips">
              <span
                v-for="role in user.roles"
                :key="role"
                class="admin-user__role-chip"
              >
                {{ role }}
              </span>
              <span
                v-if="!user.roles || !user.roles.length"
                class="admin-user__roles-empty"
              >
                {{ t('admin.user.labels.noRoles') }}
              </span>
            </div>
          </div>

          <div class="admin-user__security">
            <h3 class="admin-user__security-title">
              {{ t('admin.user.sections.security') }}
            </h3>

            <p class="admin-user__verification">
              <strong>
                {{
                  user.email_verified
                    ? t('admin.user.labels.verifiedYes')
                    : t('admin.user.labels.verifiedNo')
                }}
              </strong>
            </p>

            <p class="admin-user__hint">
              {{ t('admin.user.security.passwordHint') }}
            </p>
          </div>
        </section>
      </article>

      <!-- Aucun user (au cas où) -->
      <p v-else class="admin-user__empty">
        {{ t('admin.user.states.notFound') }}
      </p>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter, useAsyncData, useSeoMeta } from '#imports';
import { useI18n } from 'vue-i18n';
import { useConfirmStore } from '@/stores/confirmStore'; // adapte le chemin
import LkPageHero from '@/components/LkPageHero.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const confirmStore = useConfirmStore();

// Récupère l'ID numérique depuis "10-tusikila-kinuani-kia-batina"
const rawParam = route.params.userIdSlug;
const idPart = Array.isArray(rawParam) ? rawParam[0] : rawParam;
const userId = computed(() => {
  if (!idPart || typeof idPart !== 'string') return null;
  const first = idPart.split('-')[0];
  const n = Number.parseInt(first, 10);
  return Number.isNaN(n) ? null : n;
});

// Chargement des données
const {
  data: user,
  pending,
  error,
} = await useAsyncData(
  () => `admin-user-${userId.value || 'unknown'}`,
  async () => {
    if (!userId.value) {
      throw new Error('Invalid userId slug param');
    }
    return await $fetch(`/api/admin/users/${userId.value}`);
  }
);

// SEO
const userDisplayName = computed(
  () => user.value?.username || t('admin.user.labels.unknownUser')
);

useSeoMeta({
  title: () => t('admin.user.meta.title', { username: userDisplayName.value }),
  description: () =>
    t('admin.user.meta.description', { username: userDisplayName.value }),
  robots: 'noindex, nofollow',
});

// Lien d'édition
const editLink = computed(() => {
  const param = route.params.userIdSlug;
  const slug = Array.isArray(param) ? param[0] : param;
  return `/admin/edit/user/${slug}`;
});

// Suppression (avec confirmStore)
const onDelete = async () => {
  if (!userId.value) return;

  const confirmed = await confirmStore.ask({
    title: t('admin.user.actions.deleteConfirmTitle'),
    message: t('admin.user.actions.deleteConfirmBody', {
      username: userDisplayName.value,
    }),
    confirmLabel: t('admin.user.actions.deleteConfirmCta'),
    cancelLabel: t('common.cancel'),
    danger: true,
  });

  if (!confirmed) return;

  try {
    await $fetch(`/api/admin/users/${userId.value}`, {
      method: 'DELETE',
    });
    // Optionnel : si tu as un système de toast, tu utiliseras ici
    // t('admin.user.states.deleted')
    router.push('/admin/users');
  } catch (err) {
    console.error('Erreur lors de la suppression du user :', err);
    // Optionnel : toast d’erreur avec t('admin.user.states.deleteError')
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

/* ───────── Lien retour ───────── */

.admin-user__back-nav {
  margin-bottom: 0.5rem;
}

.admin-user__back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--primary, #2563eb);
}

.admin-user__back-link i {
  font-size: 0.85rem;
}

/* ───────── Meta hero ───────── */

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

.admin-user__email {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

/* ───────── Boutons actions ───────── */

.admin-user__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.admin-user__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
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

.admin-user__btn i {
  font-size: 0.9rem;
}

.admin-user__btn--primary {
  background: var(--primary, #2563eb);
  color: #ffffff;
}

.admin-user__btn--primary:hover,
.admin-user__btn--primary:focus-visible {
  background: var(--primary-hover, #1d4ed8);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.25);
  transform: translateY(-1px);
}

/* Danger → theme-aware */

.admin-user__btn--danger {
  background: var(
    --button-danger-bg,
    rgba(248, 113, 113, 0.10)
  );
  border-color: var(
    --button-danger-border,
    rgba(248, 113, 113, 0.6)
  );
  color: var(
    --button-danger-text,
    #b91c1c
  );
}

.admin-user__btn--danger:hover,
.admin-user__btn--danger:focus-visible {
  background: var(
    --button-danger-bg-hover,
    rgba(248, 113, 113, 0.18)
  );
  box-shadow: 0 10px 24px rgba(239, 68, 68, 0.25);
  transform: translateY(-1px);
}

/* ───────── Section principale ───────── */

.lk-page__section--admin-user {
  border-radius: 1rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  background: var(
    --surface-elevated,
    #f9fafb
  );
  padding: 1.2rem 1.3rem;
}

/* États */

.admin-user__status,
.admin-user__error,
.admin-user__empty {
  font-size: 0.95rem;
  color: var(--text-muted, #6b7280);
}

/* ───────── Grid 2 colonnes ───────── */

.admin-user__grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .admin-user__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* ───────── Cartes ───────── */

.admin-user__card {
  border-radius: 0.9rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.45));
  background: var(
    --surface-default,
    #ffffff
  );
  padding: 0.9rem 1rem;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.admin-user__card-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

/* ───────── DL ───────── */

.admin-user__dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.admin-user__dl-row {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.admin-user__dl-row dt {
  color: var(--text-muted, #6b7280);
}

.admin-user__dl-row dd {
  margin: 0;
  color: var(--text-default, #111827);
  text-align: right;
}

/* ───────── Rôles ───────── */

.admin-user__roles {
  margin-top: 0.5rem;
}

.admin-user__roles-label {
  margin: 0 0 0.3rem;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

.admin-user__roles-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.admin-user__role-chip {
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  border: 1px solid
    var(--badge-role-border, rgba(59, 130, 246, 0.4));
  background: var(
    --badge-role-bg,
    rgba(59, 130, 246, 0.10)
  );
  color: var(
    --badge-role-text,
    var(--primary, #2563eb)
  );
}

.admin-user__roles-empty {
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

/* ───────── Sécurité ───────── */

.admin-user__security {
  margin-top: 0.75rem;
}

.admin-user__security-title {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.admin-user__verification {
  margin: 0 0 0.4rem;
  font-size: 0.9rem;
  color: var(--text-default, #111827);
}

.admin-user__hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted, #6b7280);
}

/* ───────── Responsive ───────── */

@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .lk-page__section--admin-user {
    padding-inline: 1rem;
  }
}
</style>
