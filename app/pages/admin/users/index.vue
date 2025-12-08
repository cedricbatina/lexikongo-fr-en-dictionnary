<!-- pages/admin/users/index.vue -->
<template>
  <main
    class="lk-page lk-page--admin-users"
    aria-labelledby="admin-users-page-title"
  >
    <!-- Hero admin -->
    <LkPageHero
      id="admin-users-page-title"
      :eyebrow="t('admin.users.page.eyebrow')"
      :title="t('admin.users.page.title')"
      :description="t('admin.users.page.subtitle')"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <!-- Meta sous le titre -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-user-shield" aria-hidden="true"></i>
          <span>{{ t('admin.users.page.meta') }}</span>
        </p>
      </template>

      <!-- Colonne droite : raccourcis admin / global -->
      <template #side>
        <aside class="lk-hero-side">
          <LkActionsBar class="lk-hero__quick-actions" />
        </aside>
      </template>
    </LkPageHero>

    <!-- Section liste utilisateurs -->
    <section
      class="lk-page__section lk-page__section--admin-users"
      aria-label="Gestion des comptes utilisateurs"
    >
      <div class="admin-users-card">
        <header class="admin-users-card__header">
          <div>
            <h2 class="admin-users-card__title">
              {{ t('admin.users.table.title') }}
            </h2>
            <p class="admin-users-card__subtitle">
              {{ t('admin.users.table.subtitle') }}
            </p>
          </div>
        </header>

        <!-- Liste des utilisateurs -->
        <UserList />
      </div>
    </section>
  </main>
</template>

<script setup>
import { useSeoMeta } from '#imports';
import { useI18n } from 'vue-i18n';

import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import UserList from '@/components/UserList.vue';

const { t } = useI18n();

// SEO basique côté admin (suffisant)
useSeoMeta({
  title: () => t('admin.users.meta.title'),
  description: () => t('admin.users.meta.description'),
  robots: 'noindex, nofollow',
  ogTitle: () => t('admin.users.meta.title'),
  ogDescription: () => t('admin.users.meta.description'),
});
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

.lk-page__section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Meta dans le hero */
.lk-hero-meta {
  margin: 0.4rem 0 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

.lk-hero-meta i {
  color: var(--primary, #0d6efd);
}

.lk-hero-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lk-hero__quick-actions {
  width: 100%;
}

/* Carte principale admin */
.admin-users-card {
  border-radius: 1rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  background: var(--surface-elevated, #020617);
  padding: 1.2rem 1.3rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-users-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.75rem;
}

.admin-users-card__title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 650;
  color: var(--text-default, #e5e7eb);
}

.admin-users-card__subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.9rem;
  color: var(--text-muted, #9ca3af);
}

/* Responsive */
@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .admin-users-card {
    padding-inline: 1rem;
  }
}
</style>
