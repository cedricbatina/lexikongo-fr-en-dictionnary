<template>
  <main
    class="lk-page lk-page--documentation"
    aria-labelledby="documentation-page-title"
  >
    <!-- Hero principal -->
    <LkPageHero
      id="documentation-page-title"
      :eyebrow="t('documentation.page.eyebrow')"
      :title="t('documentation.page.title')"
      :description="t('documentation.page.subtitle')"
      :primary-cta="primaryCta"
      :secondary-cta="secondaryCta"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-book-open" aria-hidden="true"></i>
          <span>{{ t('documentation.page.metaHighlight') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : logo + actions -->
      <template #side>
        <div class="lk-hero-side">
          <LogoSlogan class="lk-hero__logo" />
          <LkActionsBar class="lk-hero__quick-actions" />
        </div>
      </template>
    </LkPageHero>

    <!-- Intro -->
    <section
      class="lk-page__section lk-page__section--intro"
      aria-labelledby="documentation-intro-title"
    >
      <header class="lk-doc-header">
        <h2
          id="documentation-intro-title"
          class="lk-doc-title"
        >
          {{ t('documentation.sections.intro.title') }}
        </h2>
        <p class="lk-doc-lead">
          {{ t('documentation.sections.intro.lead') }}
        </p>
      </header>

      <p class="lk-doc-paragraph">
        {{ t('documentation.sections.intro.body') }}
      </p>
    </section>

    <!-- Cartes de rôles / guides -->
    <section
      class="lk-page__section lk-page__section--guides"
      aria-labelledby="documentation-guides-title"
    >
      <header class="lk-doc-guides-header">
        <h2
          id="documentation-guides-title"
          class="lk-doc-title"
        >
          {{ t('documentation.sections.guides.title') }}
        </h2>
        <p class="lk-doc-lead">
          {{ t('documentation.sections.guides.lead') }}
        </p>
      </header>

      <div class="lk-doc-guides-grid">
        <!-- Utilisateurs -->
        <article class="lk-doc-card">
          <h3 class="lk-doc-card__title">
            <i class="fas fa-user" aria-hidden="true"></i>
            <span>{{ t('documentation.sections.guides.users.title') }}</span>
          </h3>
          <p class="lk-doc-card__text">
            {{ t('documentation.sections.guides.users.body') }}
          </p>
          <NuxtLink
            to="/documentation/for-users"
            class="lk-doc-card__link"
          >
            <span>{{ t('documentation.sections.guides.users.link') }}</span>
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </NuxtLink>
        </article>

        <!-- Contributeurs -->
        <article class="lk-doc-card">
          <h3 class="lk-doc-card__title">
            <i class="fas fa-hands-helping" aria-hidden="true"></i>
            <span>{{ t('documentation.sections.guides.contributors.title') }}</span>
          </h3>
          <p class="lk-doc-card__text">
            {{ t('documentation.sections.guides.contributors.body') }}
          </p>
          <NuxtLink
            to="/documentation/for-contributors"
            class="lk-doc-card__link"
          >
            <span>{{ t('documentation.sections.guides.contributors.link') }}</span>
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </NuxtLink>
        </article>

        <!-- Administrateurs -->
        <article class="lk-doc-card">
          <h3 class="lk-doc-card__title">
            <i class="fas fa-tools" aria-hidden="true"></i>
            <span>{{ t('documentation.sections.guides.admins.title') }}</span>
          </h3>
          <p class="lk-doc-card__text">
            {{ t('documentation.sections.guides.admins.body') }}
          </p>
          <NuxtLink
            to="/documentation/for-admins"
            class="lk-doc-card__link"
          >
            <span>{{ t('documentation.sections.guides.admins.link') }}</span>
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </NuxtLink>
        </article>

        <!-- Développeurs -->
        <article class="lk-doc-card">
          <h3 class="lk-doc-card__title">
            <i class="fas fa-code" aria-hidden="true"></i>
            <span>{{ t('documentation.sections.guides.devs.title') }}</span>
          </h3>
          <p class="lk-doc-card__text">
            {{ t('documentation.sections.guides.devs.body') }}
          </p>
          <NuxtLink
            to="/documentation/for-devs"
            class="lk-doc-card__link"
          >
            <span>{{ t('documentation.sections.guides.devs.link') }}</span>
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </NuxtLink>
        </article>
      </div>
    </section>

    <!-- Bloc "besoin d'aide" -->
    <section
      class="lk-page__section lk-page__section--help"
      aria-labelledby="documentation-help-title"
    >
      <div class="lk-cta lk-cta--docs">
        <div class="lk-cta__text">
          <h2
            id="documentation-help-title"
            class="lk-cta__title"
          >
            {{ t('documentation.sections.help.title') }}
          </h2>
          <p class="lk-cta__subtitle">
            {{ t('documentation.sections.help.subtitle') }}
          </p>
        </div>

        <div class="lk-cta__actions">
          <NuxtLink
            to="/faqs"
            class="lk-btn lk-btn--primary"
          >
            <i class="fas fa-question-circle" aria-hidden="true"></i>
            <span>{{ t('documentation.sections.help.actions.faq') }}</span>
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="lk-btn lk-btn--ghost"
          >
            <i class="fas fa-envelope" aria-hidden="true"></i>
            <span>{{ t('documentation.sections.help.actions.contact') }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useHead } from '#app';
import { useI18n } from 'vue-i18n';

import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import LogoSlogan from '@/components/LogoSlogan.vue';

const { t } = useI18n();

const primaryCta = computed(() => ({
  to: '/search',
  label: t('documentation.page.primaryCta'),
  icon: 'fas fa-search',
}));

const secondaryCta = computed(() => ({
  to: '/contributor',
  label: t('documentation.page.secondaryCta'),
  icon: 'fas fa-hands-helping',
  variant: 'ghost',
}));

// SEO
const seoTitle =
  t('documentation.meta.title') ||
  'Documentation Lexikongo – Guides utilisateurs, contributeurs, admins et développeurs';
const seoDescription =
  t('documentation.meta.description') ||
  "Explorez la documentation de Lexikongo : guides pour les utilisateurs, contributeurs, administrateurs et développeurs du dictionnaire Kikongo.";

// JSON-LD simple pour la page de doc
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Documentation Lexikongo',
  description: seoDescription,
  url: 'https://www.lexikongo.fr/documentation',
  inLanguage: 'fr',
  publisher: {
    '@type': 'Organization',
    name: 'Lexikongo',
    url: 'https://www.lexikongo.fr',
  },
};

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    {
      name: 'keywords',
      content:
        'Lexikongo, documentation, guide utilisateur, contributeur, administrateur, développeur, dictionnaire Kikongo',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: 'https://www.lexikongo.fr/documentation',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://www.lexikongo.fr/documentation',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(jsonLd),
    },
  ],
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

/* Sections génériques */
.lk-page__section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lk-page__section--intro,
.lk-page__section--guides {
  background: var(--color-surface-elevated, #ffffff);
  border-radius: 1rem;
  padding: 1.3rem 1.2rem;
  border: 1px solid var(--color-border-subtle, rgba(148, 163, 184, 0.35));
}

/* Header documentation */
.lk-doc-header,
.lk-doc-guides-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.lk-doc-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text, #0f172a);
}

.lk-doc-lead {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted, #6b7280);
}

/* Paragraphes */
.lk-doc-paragraph {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--color-text-muted, #4b5563);
}

/* Grille des cartes de guides */
.lk-doc-guides-grid {
  margin-top: 0.75rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.lk-doc-card {
  border-radius: 0.9rem;
  padding: 0.9rem 0.85rem;
  background: var(--color-surface, #f9fafb);
  border: 1px solid rgba(148, 163, 184, 0.4);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.lk-doc-card__title {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.lk-doc-card__title i {
  font-size: 1rem;
  color: var(--primary, #0d6efd);
}

.lk-doc-card__text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted, #4b5563);
}

.lk-doc-card__link {
  margin-top: 0.3rem;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--primary, #0d6efd);
  text-decoration: none;
}

.lk-doc-card__link i {
  font-size: 0.8rem;
}

.lk-doc-card__link:hover,
.lk-doc-card__link:focus-visible {
  text-decoration: underline;
}

/* CTA "besoin d'aide" */
.lk-page__section--help {
  margin-top: 0.5rem;
}

.lk-cta.lk-cta--docs {
  border-radius: 1rem;
  padding: 1rem 1.1rem;
  background: linear-gradient(
    135deg,
    rgba(13, 110, 253, 0.06),
    rgba(56, 189, 248, 0.08)
  );
  border: 1px solid rgba(191, 219, 254, 0.9);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
}

.lk-cta__title {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #0f172a;
}

.lk-cta__subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
}

.lk-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Boutons CTA */
.lk-btn {
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease;
}

.lk-btn--primary {
  background: var(--primary, #0d6efd);
  color: #ffffff;
}

.lk-btn--ghost {
  background: transparent;
  color: var(--color-text-muted, #4b5563);
  border-color: rgba(148, 163, 184, 0.7);
}

.lk-btn:hover,
.lk-btn:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.15);
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

/* Side hero */
.lk-hero-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lk-hero__logo {
  max-width: 230px;
  width: 100%;
}

.lk-hero__quick-actions {
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .lk-page__section--intro,
  .lk-page__section--guides {
    padding-inline: 1rem;
  }

  .lk-doc-guides-grid {
    grid-template-columns: 1fr;
  }

  .lk-cta.lk-cta--docs {
    flex-direction: column;
    align-items: flex-start;
  }

  .lk-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
