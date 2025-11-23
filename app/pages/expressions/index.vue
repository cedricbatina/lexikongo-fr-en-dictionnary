<template>
  <main class="expr-page" aria-labelledby="expressions-page-title">
    <!-- Hero -->
    <header class="expr-hero">
      <div class="expr-hero__content">
        <h1 id="expressions-page-title" class="expr-hero__title">
          <span class="expr-hero__kicker">
            {{ t('expressions.page.eyebrow') }}
          </span>
          <span class="expr-hero__main">
            {{ t('expressions.page.title') }}
          </span>
        </h1>

        <p class="expr-hero__subtitle">
          {{ t('expressions.page.subtitle') }}
        </p>

        <div class="expr-hero__actions">
          <NuxtLink
            to="/search"
            class="expr-btn expr-btn--primary"
          >
            <i class="fas fa-search" aria-hidden="true"></i>
            <span>{{ t('expressions.page.ctaSearch') }}</span>
          </NuxtLink>

          <NuxtLink
            to="/documentation/for-contributors"
            class="expr-btn expr-btn--ghost"
          >
            <i class="fas fa-hands-helping" aria-hidden="true"></i>
            <span>{{ t('expressions.page.ctaContribute') }}</span>
          </NuxtLink>
        </div>

        <p class="expr-hero__meta">
          <i class="fas fa-language" aria-hidden="true"></i>
          <span>{{ t('expressions.page.metaLanguages') }}</span>
        </p>
      </div>

   
    </header>
        <LogoSlogan class="expr-hero__logo" />

   <div class="expr-hero__side">
        <SearchButtons class="expr-hero__quick-search" />
      </div>
    <!-- Bloc principal : tableau des expressions -->
    <section class="expr-section expr-section--list">
      <header class="expr-section__header">
        <div>
          <h2 class="expr-section__title">
            <i class="fas fa-book" aria-hidden="true"></i>
            <span>{{ t('expressions.page.listTitle') }}</span>
          </h2>
          <p class="expr-section__subtitle">
            {{ t('expressions.page.listSubtitle') }}
          </p>
        </div>

        <div class="expr-section__meta">
          <LastExpressionsCount />
        </div>
      </header>


    </section>
      <ExpressionList />
    <!-- Appel à contribution -->
    <section
      class="expr-section expr-section--cta"
      aria-labelledby="expressions-contribute-title"
    >
      <div class="expr-cta">
        <div class="expr-cta__text">
          <h2
            id="expressions-contribute-title"
            class="expr-cta__title"
          >
            {{ t('expressions.page.bottomCtaTitle') }}
          </h2>
          <p class="expr-cta__subtitle">
            {{ t('expressions.page.bottomCtaText') }}
          </p>
        </div>

        <div class="expr-cta__actions">
          <ContributorButtons />
          <AdminButtons />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useHead } from '#app';
import { useSeoMeta } from '#imports';
import { useI18n } from 'vue-i18n';

import ExpressionList from '@/components/ExpressionList.vue';
import LogoSlogan from '@/components/LogoSlogan.vue';
import SearchButtons from '@/components/SearchButtons.vue';
import ContributorButtons from '@/components/ContributorButtons.vue';
import AdminButtons from '@/components/AdminButtons.vue';
import LastExpressionsCount from '@/components/LastExpressionsCount.vue';

const { t } = useI18n();

// SEO basé sur i18n, avec fallback FR si jamais la clé manque
const seoTitle =
  t('expressions.meta.title') ||
  'Lexikongo – Liste des mots et verbes en Kikongo';
const seoDescription =
  t('expressions.meta.description') ||
  'Découvrez la liste complète des mots et verbes en Kikongo avec leurs significations en français et en anglais.';

// Balises meta classiques / Open Graph / Twitter
useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogUrl: 'https://www.lexikongo.fr/expressions',
  ogSiteName: 'Lexikongo',
});

// JSON-LD + canonical
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Liste des mots et verbes en Kikongo | Lexikongo',
  description:
    'Découvrez la liste complète des mots et verbes en Kikongo avec leurs significations en français et en anglais.',
  url: 'https://www.lexikongo.fr/expressions',
  image: 'https://www.lexikongo.fr/images/lexikongo_logo@2x.png',
  inLanguage: 'fr',
  publisher: {
    '@type': 'Organization',
    name: 'Lexikongo',
    url: 'https://www.lexikongo.fr',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.lexikongo.fr/images/logo.webp',
      width: 200,
      height: 200,
    },
  },
  about: {
    '@type': 'Thing',
    name: 'Kikongo Language',
    sameAs: [
      'https://en.wikipedia.org/wiki/Kikongo',
      'https://fr.wikipedia.org/wiki/Kikongo',
    ],
  },
};

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://www.lexikongo.fr/expressions',
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
.expr-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* HERO */
.expr-hero {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.4fr);
  gap: 1.75rem;
  align-items: center;
}

.expr-hero__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.expr-hero__title {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.expr-hero__kicker {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #6b7280;
}

.expr-hero__main {
  font-size: 1.8rem;
  line-height: 1.2;
  font-weight: 700;
  color: #111827;
}

.expr-hero__subtitle {
  margin: 0;
  font-size: 0.98rem;
  color: #4b5563;
}

.expr-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 0.25rem;
}

.expr-btn {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.expr-btn--primary {
  background: #0d6efd;
  color: #ffffff;
  border-color: #0d6efd;
}

.expr-btn--primary:hover,
.expr-btn--primary:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(13, 110, 253, 0.4);
}

.expr-btn--ghost {
  background: #ffffff;
  color: #111827;
  border-color: rgba(148, 163, 184, 0.7);
}

.expr-btn--ghost:hover,
.expr-btn--ghost:focus-visible {
  border-color: #0d6efd;
  color: #0d6efd;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

.expr-hero__meta {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.expr-hero__meta i {
  color: #0d6efd;
}

/* Colonne droite du hero */
.expr-hero__side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.expr-hero__logo {
  max-width: 220px;
  width: 100%;
}

.expr-hero__quick-search {
  width: 100%;
}

/* Sections */
.expr-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* En-tête section liste */
.expr-section__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: flex-end;
}

.expr-section__title {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: #111827;
}

.expr-section__title i {
  color: #0d6efd;
}

.expr-section__subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.expr-section__meta {
  font-size: 0.85rem;
  color: #4b5563;
}

/* CTA */
.expr-section--cta {
  margin-top: 0.5rem;
}

.expr-cta {
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

.expr-cta__title {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #0f172a;
}

.expr-cta__subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
}

.expr-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .expr-page {
    padding-inline: 1rem;
  }

  .expr-hero {
    grid-template-columns: minmax(0, 1fr);
  }

  .expr-hero__side {
    align-items: flex-start;
  }

  .expr-hero__main {
    font-size: 1.5rem;
  }

  .expr-cta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
