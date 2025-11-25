<template>
  <main
    class="profile-page"
    aria-labelledby="profile-page-title"
  >
    <!-- HERO : Profil -->
    <LkPageHero
      id="profile-page-title"
      :eyebrow="t('profile.eyebrow')"
      :title="heroTitle"
      :description="t('profile.subtitle')"
      :side-aria-label="t('profile.sideAria')"
    >
      <!-- Boutons d’action principaux -->
      <template #actions>
        <NuxtLink
          to="/search"
          class="profile-hero-btn profile-hero-btn--primary"
        >
          <i class="fas fa-search" aria-hidden="true" />
          <span>{{ t('profile.actions.expressions') }}</span>
        </NuxtLink>
      </template>

      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="profile-hero-meta">
          <i class="fas fa-shield-alt" aria-hidden="true" />
          <span>{{ t('profile.metaSecurity') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : actions bar -->
      <template #side>
        <aside class="profile-hero-side">
          <section
            class="profile-hero-card profile-hero-card--muted"
            aria-label="Lexikongo – Actions rapides et raccourcis"
          >
            <LkActionsBar />
          </section>
        </aside>
      </template>
    </LkPageHero>

    <!-- CONTENU PRINCIPAL : fiche utilisateur -->
    <section
      class="profile-layout"
      aria-label="User profile details"
    >
      <!-- Carte 1 : Résumé / Fiche utilisateur -->
      <article class="profile-card profile-card--main">
        <header class="profile-card__header">
          <div class="profile-card__title-block">
            <p class="profile-card__eyebrow">
              {{ t('profile.summary.title') }}
            </p>
            <h2 class="profile-card__title">
              {{ displayName }}
            </h2>
            <p class="profile-card__subtitle">
              {{ t('profile.subtitle') }}
            </p>
          </div>

          <div class="profile-card__meta">
            <!-- Membre depuis -->
            <p class="profile-card__meta-row">
              <span class="profile-card__meta-label">
                {{ t('profile.summary.memberSince') }}
              </span>
              <span class="profile-card__meta-value">
                {{ createdAtDisplay }}
              </span>
            </p>

            <!-- Rôles -->
            <p class="profile-card__meta-row">
              <span class="profile-card__meta-label">
                {{ t('profile.summary.roles') }}
              </span>
              <span class="profile-card__meta-value profile-card__meta-value--chips">
                <span
                  v-for="role in roleChips"
                  :key="role.key"
                  class="profile-chip"
                >
                  {{ role.label }}
                </span>
              </span>
            </p>

            <!-- Actions rapides du compte -->
        <div class="profile-card__meta-actions">
    <NuxtLink
      :to="`/profile/edit/${route.params.username}`"
      class="profile-meta-btn profile-meta-btn--outline"
    >
      <i class="fas fa-user-edit" aria-hidden="true"></i>
      <span>{{ tt('profile.actions.editProfile', 'Modifier mon profil') }}</span>
    </NuxtLink>

    <button
      type="button"
      class="profile-meta-btn profile-meta-btn--danger"
      @click="handleDeleteAccount"
    >
      <i class="fas fa-user-slash" aria-hidden="true"></i>
      <span>{{ tt('profile.actions.deleteAccount', 'Supprimer mon compte') }}</span>
    </button>
  </div>
          </div>
        </header>
      </article>

      <!-- Carte 2 : Informations du compte -->
      <article class="profile-card">
        <header class="profile-card__section-header">
          <h2 class="profile-card__section-title">
            {{ t('profile.section.account.title') }}
          </h2>
          <p class="profile-card__section-intro">
            {{ t('profile.section.account.subtitle') }}
          </p>
        </header>

        <dl class="profile-dl">
          <!-- Username -->
          <div class="profile-dl__row">
            <dt>{{ t('profile.section.account.username') }}</dt>
            <dd>
              <p class="profile-dl__value">
                {{ displayName }}
              </p>
              <p class="profile-dl__hint">
                {{ t('profile.section.account.usernameHint') }}
              </p>
            </dd>
          </div>

          <!-- Email + statut -->
          <div class="profile-dl__row">
            <dt>{{ t('profile.section.account.email') }}</dt>
            <dd>
              <p class="profile-dl__value">
                {{ emailDisplay }}
              </p>

              <p class="profile-dl__email-status" v-if="emailDisplay">
                <span
                  class="profile-email-badge"
                  :class="emailVerified ? 'profile-email-badge--ok' : 'profile-email-badge--warn'"
                >
                  <i
                    :class="emailVerified ? 'fas fa-check-circle' : 'fas fa-clock'"
                    aria-hidden="true"
                  />
                  <span>
                    {{
                      emailVerified
                        ? tt(
                            'profile.section.account.emailVerifiedBadge',
                            'E-mail verified'
                          )
                        : tt(
                            'profile.section.account.emailUnverifiedBadge',
                            'E-mail not verified'
                          )
                    }}
                  </span>
                </span>
              </p>

              <p class="profile-dl__hint">
                {{ t('profile.section.account.emailHint') }}
              </p>
            </dd>
          </div>
        </dl>
      </article>

      <!-- Carte 3 : Sécurité du compte -->
      <article class="profile-card">
        <header class="profile-card__section-header">
          <h2 class="profile-card__section-title">
            {{ t('profile.section.security.title') }}
          </h2>
          <p class="profile-card__section-intro">
            {{ t('profile.section.security.subtitle') }}
          </p>
        </header>

        <p class="profile-security-text">
          <!-- On peut réutiliser le sous-titre comme texte principal, ou le compléter plus tard -->
          {{ t('profile.section.security.subtitle') }}
        </p>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSeoMeta } from '#imports';
import { useAuthStore } from '~/stores/authStore';
import { useConfirmStore } from '~/stores/confirmStore';
import LkPageHero from '~/components/LkPageHero.vue';
import LkActionsBar from '~/components/LkActionsBar.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const confirmStore = useConfirmStore();

// helper i18n avec fallback lisible
const tt = (key, fallback) => {
  const res = t(key);
  return res === key ? fallback : res;
};

// S'assurer qu'on a les infos utilisateur (utile si la page est chargée direct côté client)
onMounted(async () => {
  if (!authStore.ready) {
    await authStore.fetchMe();
  }
});

const user = computed(() => authStore.user || {});

// Nom affiché
const displayName = computed(
  () =>
    user.value.username ||
    t('profile.fallbackName')
);

// Date "membre depuis"
const createdAtDisplay = computed(() => {
  const raw = user.value.created_at;
  if (!raw) {
    return t('profile.memberSince.unknown');
  }
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) {
    return t('profile.memberSince.unknown');
  }
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});

// Email + statut
const email = computed(() => user.value.email || '');
const emailVerified = computed(() => !!user.value.email_verified);

const emailDisplay = computed(() => {
  if (!email.value) {
    return t('profile.section.account.emailUnknown');
  }
  return email.value;
});

// Rôles → chips jolis
const rawRoles = computed(() => authStore.roles || []);

const roleChips = computed(() => {
  const roles = rawRoles.value.length ? rawRoles.value : ['user'];
  return roles.map((r) => {
    if (r === 'admin') {
      return {
        key: 'admin',
        label: t('profile.roleLabels.admin'),
      };
    }
    if (r === 'contributor') {
      return {
        key: 'contributor',
        label: t('profile.roleLabels.contributor'),
      };
    }
    return {
      key: 'user',
      label: t('profile.roleLabels.user'),
    };
  });
});

// Titre du hero : on s'aligne sur profile.title
const heroTitle = computed(() => t('profile.title'));

// Suppression du compte avec modal global
const handleDeleteAccount = async () => {
  const confirmed = await confirmStore.ask({
    title: t('profile.delete.title'),
    message: t('profile.delete.message'),
    confirmLabel: t('profile.delete.confirm'),
    cancelLabel: t('profile.delete.cancel'),
  });

  if (!confirmed) return;

  try {
    await $fetch('/api/users/delete-account', {
      method: 'DELETE',
    });

    // On informe l'utilisateur (toast si tu en as un, ou alert simple)
    // Ici on passe par console, à remplacer par ton système de notifications
    console.info(t('profile.delete.success'));

    await authStore.logout();
    await router.push('/');
  } catch (err) {
    console.error('Erreur lors de la suppression du compte :', err);
    // Idem : à remplacer par ton système de notifications
    alert(t('profile.delete.error'));
  }
};

// SEO (page privée → noindex)
useSeoMeta({
  title: () => t('profile.meta.title'),
  description: () => t('profile.meta.description'),
  ogTitle: () => t('profile.meta.ogTitle'),
  ogDescription: () => t('profile.meta.ogDescription'),
  ogType: 'website',
  ogSiteName: 'Lexikongo',
  robots: 'noindex, nofollow, noimageindex',
});
</script>

<style scoped>
.profile-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.75rem 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Boutons du hero */
.profile-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.05rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease,
    border-color 0.15s ease;
}

.profile-hero-btn--primary {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 14px 30px rgba(13, 110, 253, 0.3);
}

.profile-hero-btn--ghost {
  background: var(--surface-elevated, #ffffff);
  color: var(--color-text);
  border-color: var(--border-subtle);
}

.profile-hero-btn:hover,
.profile-hero-btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.14);
}

.profile-hero-btn--primary:hover,
.profile-hero-btn--primary:focus-visible {
  background: var(--primary-hover, #0b5ed7);
}

.profile-hero-btn--ghost:hover,
.profile-hero-btn--ghost:focus-visible {
  background: rgba(148, 163, 184, 0.18);
}

/* Meta sous le hero */
.profile-hero-meta {
  margin: 0.3rem 0 0;
  font-size: 0.88rem;
  color: var(--text-muted, #6b7280);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.profile-hero-meta i {
  color: var(--primary);
}

/* Colonne droite du hero */
.profile-hero-side {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.profile-hero-card {
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.09);
}

.profile-hero-card--muted {
  background: var(--surface-default, #f9fafb);
  border-style: dashed;
}

/* Layout des cartes de profil */
.profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.4fr);
  gap: 1rem;
}

@media (max-width: 900px) {
  .profile-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* Cartes de profil */
.profile-card {
  border-radius: 1rem;
  padding: 1.1rem 1rem;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.5));
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.12);
}

/* Carte principale un peu plus mise en avant */
.profile-card--main {
  grid-column: 1 / -1;
}

/* Header de la carte principale */
.profile-card__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.9rem;
}

.profile-card__title-block {
  max-width: 60%;
  min-width: 260px;
}

.profile-card__eyebrow {
  margin: 0;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #6b7280);
}

.profile-card__title {
  margin: 0.1rem 0 0.15rem;
  font-size: clamp(1.3rem, 2vw, 1.7rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-default, #111827);
}

.profile-card__subtitle {
  margin: 0;
  font-size: 0.93rem;
  color: var(--text-muted, #6b7280);
}

.profile-card__meta {
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

.profile-card__meta-row {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.profile-card__meta-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(107, 114, 128, 0.9);
}

.profile-card__meta-value {
  font-weight: 500;
}

.profile-card__meta-value--chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

/* Actions meta */
.profile-card__meta-actions {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.profile-meta-btn {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  text-decoration: none;
}

.profile-meta-btn--outline {
  background: var(--surface-default, #f9fafb);
  border-color: var(--border-subtle);
  color: var(--text-default, #111827);
}

.profile-meta-btn--danger {
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(220, 38, 38, 0.9);
  color: #b91c1c;
}

/* Sections secondaires */
.profile-card__section-header {
  margin-bottom: 0.5rem;
}

.profile-card__section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.profile-card__section-intro {
  margin: 0.2rem 0 0;
  font-size: 0.88rem;
  color: var(--text-muted, #6b7280);
}

/* DL */
.profile-dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.profile-dl__row {
  display: grid;
  grid-template-columns: minmax(0, 130px) minmax(0, 1fr);
  gap: 0.35rem 0.7rem;
  font-size: 0.9rem;
}

.profile-dl__row dt {
  font-weight: 600;
  color: var(--text-muted, #6b7280);
}

.profile-dl__row dd {
  margin: 0;
}

.profile-dl__value {
  margin: 0;
  font-weight: 500;
  color: var(--text-default, #111827);
}

.profile-dl__hint {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  color: var(--text-muted, #6b7280);
}

/* Email / badge */
.profile-dl__email-status {
  margin: 0.25rem 0 0;
}

.profile-email-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.18rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
}

.profile-email-badge--ok {
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
}

.profile-email-badge--warn {
  background: rgba(250, 204, 21, 0.16);
  color: #92400e;
}

.profile-email-badge i {
  font-size: 0.9rem;
}

/* Sécurité */
.profile-security-text {
  margin: 0.2rem 0 0;
  font-size: 0.9rem;
  color: var(--text-default, #111827);
}

/* Responsive */
@media (max-width: 768px) {
  .profile-page {
    padding-inline: 1rem;
  }

  .profile-card__header {
    flex-direction: column;
  }

  .profile-card__title-block {
    max-width: 100%;
  }
}
.profile-card__meta-actions {
  margin-top: 0.4rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.profile-meta-btn {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
}

.profile-meta-btn--outline {
  background: var(--surface-default, #f9fafb);
  border-color: var(--border-subtle, rgba(148, 163, 184, 0.8));
  color: var(--text-default, #111827);
}

.profile-meta-btn--danger {
  background: #b91c1c;
  border-color: #991b1b;
  color: #fff;
}

</style>
