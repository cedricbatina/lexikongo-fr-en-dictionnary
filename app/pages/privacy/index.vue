<!-- pages/privacy/index.vue -->
<template>
  <main
    class="lk-page lk-page--privacy"
    aria-labelledby="privacy-page-title"
  >
    <!-- Hero réutilisable -->
    <LkPageHero
      id="privacy-page-title"
      :eyebrow="t('privacy.page.eyebrow')"
      :title="t('privacy.page.title')"
      :description="t('privacy.page.subtitle')"
      :primary-cta="primaryCta"
      :secondary-cta="secondaryCta"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-shield-alt" aria-hidden="true"></i>
          <span>{{ t('privacy.page.metaHighlight') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : raccourcis utiles -->
      <template #side>
        <div class="lk-hero-side">
          <LkActionsBar class="lk-hero__quick-links" />
        </div>
      </template>
    </LkPageHero>

    <!-- Contenu principal de la politique -->
    <section
      class="lk-page__section lk-page__section--privacy"
      aria-labelledby="privacy-content-title"
    >
      <header class="lk-privacy-header">
        <h2
          id="privacy-content-title"
          class="lk-privacy-title"
        >
          {{ t('privacy.sections.intro.title') }}
        </h2>
        <p class="lk-privacy-lead">
          {{ t('privacy.sections.intro.lead') }}
        </p>
      </header>

      <article class="lk-privacy-article">
        <!-- Section : responsable du traitement -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-responsible-title"
        >
          <h3 id="privacy-responsible-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.responsible.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.responsible.body') }}
          </p>
        </section>

        <!-- Section : hébergeur -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-hosting-title"
        >
          <h3 id="privacy-hosting-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.hosting.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.hosting.body') }}
          </p>
        </section>

        <!-- Section : bases légales et finalités -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-legal-basis-title"
        >
          <h3 id="privacy-legal-basis-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.legalBasis.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.legalBasis.body') }}
          </p>
        </section>

        <!-- Section : données collectées -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-data-title"
        >
          <h3 id="privacy-data-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.data.title') }}
          </h3>
          <ul class="lk-privacy-list">
            <li class="lk-privacy-list__item">
              {{ t('privacy.sections.data.items.account') }}
            </li>
            <li class="lk-privacy-list__item">
              {{ t('privacy.sections.data.items.usage') }}
            </li>
            <li class="lk-privacy-list__item">
              {{ t('privacy.sections.data.items.contributions') }}
            </li>
            <li class="lk-privacy-list__item">
              {{ t('privacy.sections.data.items.technical') }}
            </li>
          </ul>
        </section>

        <!-- Section : conservation -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-retention-title"
        >
          <h3 id="privacy-retention-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.retention.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.retention.body') }}
          </p>
        </section>

        <!-- Section : destinataires et sous-traitants -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-recipients-title"
        >
          <h3 id="privacy-recipients-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.recipients.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.recipients.body') }}
          </p>
        </section>

        <!-- Section : transferts hors UE -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-transfers-title"
        >
          <h3 id="privacy-transfers-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.transfers.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.transfers.body') }}
          </p>
        </section>

        <!-- Section : sécurité -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-security-title"
        >
          <h3 id="privacy-security-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.security.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.security.body') }}
          </p>
        </section>

        <!-- Section : cookies -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-cookies-title"
        >
          <h3 id="privacy-cookies-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.cookies.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.cookies.body') }}
          </p>
        </section>

        <!-- Section : droits RGPD -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-rights-title"
        >
          <h3 id="privacy-rights-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.rights.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.rights.body') }}
          </p>
        </section>

        <!-- Section : contact RGPD -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-contact-title"
        >
          <h3 id="privacy-contact-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.contact.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.contact.body') }}
          </p>
        </section>

        <!-- Section : loi applicable / juridiction -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-law-title"
        >
          <h3 id="privacy-law-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.law.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.law.body') }}
          </p>
        </section>

        <!-- Section : mise à jour -->
        <section
          class="lk-privacy-block"
          aria-labelledby="privacy-update-title"
        >
          <h3 id="privacy-update-title" class="lk-privacy-block__title">
            {{ t('privacy.sections.update.title') }}
          </h3>
          <p class="lk-privacy-block__text">
            {{ t('privacy.sections.update.body') }}
          </p>
        </section>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useHead } from '#app';
import { useI18n } from 'vue-i18n';

import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';

const { t } = useI18n();

/**
 * CTA i18n
 */
const primaryCta = computed(() => ({
  to: '/search',
  label: t('privacy.page.primaryCta'),
  icon: 'fas fa-search',
}));

const secondaryCta = computed(() => ({
  to: '/contact',
  label: t('privacy.page.secondaryCta'),
  icon: 'fas fa-envelope-open-text',
  variant: 'ghost',
}));

// SEO de base
const seoTitle =
  t('privacy.meta.title') ||
  'Lexikongo – Politique de confidentialité';
const seoDescription =
  t('privacy.meta.description') ||
  "Découvrez comment Lexikongo collecte, utilise et protège vos données lors de l'utilisation du dictionnaire Kikongo.";

// JSON-LD enrichi (PrivacyPolicy)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'PrivacyPolicy',
  name: 'Politique de confidentialité | Lexikongo',
  description: seoDescription,
  url: 'https://www.lexikongo.fr/privacy',
  inLanguage: 'fr',
  publisher: {
    '@type': 'Organization',
    name: 'Lexikongo',
    url: 'https://www.lexikongo.fr',
  },
  provider: {
    '@type': 'Organization',
    name: 'Artful Batina Creative Studios',
    url: 'https://www.artfulbatinacreativestudios.fr',
  },
  maintainer: {
    '@type': 'Person',
    name: 'Cédric Batina',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gradignan',
      addressCountry: 'FR',
    },
  },
  hostingProvider: {
    '@type': 'Organization',
    name: 'Infomaniak Network SA',
    url: 'https://www.infomaniak.com',
  },
};

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    {
      name: 'keywords',
      content:
        'Lexikongo, confidentialité, données personnelles, RGPD, cookies, dictionnaire Kikongo, politique de confidentialité',
    },
    { name: 'author', content: 'Lexikongo' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    {
      property: 'og:url',
      content: 'https://www.lexikongo.fr/privacy',
    },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://www.lexikongo.fr/privacy',
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

/* Section principale */
.lk-page__section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.lk-page__section--privacy {
  background: var(--color-surface-elevated, #ffffff);
  border-radius: 1rem;
  padding: 1.5rem 1.25rem 1.75rem;
  border: 1px solid var(--color-border-subtle, rgba(148, 163, 184, 0.35));
}

/* En-tête du contenu */
.lk-privacy-header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.lk-privacy-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-text, #0f172a);
}

.lk-privacy-lead {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted, #6b7280);
}

/* Article */
.lk-privacy-article {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

/* Blocs de section */
.lk-privacy-block {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.lk-privacy-block__title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.lk-privacy-block__text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-muted, #4b5563);
}

/* Liste */
.lk-privacy-list {
  margin: 0.25rem 0 0;
  padding-left: 1.1rem;
}

.lk-privacy-list__item {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-muted, #4b5563);
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

.lk-hero__quick-links {
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .lk-page__section--privacy {
    padding-inline: 1rem;
  }
}
</style>
