<template>
  <main
    class="lk-page lk-page--expressions"
    aria-labelledby="expressions-page-title"
  >
    <!-- Hero réutilisable -->
    <LkPageHero
      id="expressions-page-title"
      :eyebrow="t('expressions.page.eyebrow')"
      :title="t('expressions.page.title')"
      :description="t('expressions.page.subtitle')"
        :show-last-expressions="true"


      :side-aria-label="t('pageHero.sideAria')"

    >
      <!-- Boutons d’action principaux -->
      <template #actions>
        <NuxtLink
          to="/search"
          class="lk-hero-btn lk-hero-btn--primary"
        >
          <i class="fas fa-search" aria-hidden="true"></i>
          <span>{{ t('expressions.page.ctaSearch') }}</span>
        </NuxtLink>

        <NuxtLink
          to="/documentation/for-contributors"
          class="lk-hero-btn lk-hero-btn--ghost"
        >
          <i class="fas fa-hands-helping" aria-hidden="true"></i>
          <span>{{ t('expressions.page.ctaContribute') }}</span>
        </NuxtLink>
      </template>

      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-language" aria-hidden="true"></i>
          <span>{{ t('expressions.page.metaLanguages') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : actions bar + raccourci recherche -->
      <template #side>
        <div class="lk-hero-side">
          <LkActionsBar />

     
        </div>
      </template>
    </LkPageHero>

    <!-- Bloc principal : liste des expressions -->
    <section class="lk-page__section lk-page__section--expressions">
      <header class="expr-section__header">
      <!--  <div>
          <h2 class="expr-section__title">
            <i class="fas fa-book" aria-hidden="true"></i>
            <span>{{ t('expressions.page.listTitle') }}</span>
          </h2>
          <p class="expr-section__subtitle">
            {{ t('expressions.page.listSubtitle') }}
          </p>
        </div>-->

    
      </header>

      <ExpressionList />
    </section>

    <!-- Appel à contribution -->
    <section
      class="lk-page__section lk-page__section--cta"
      aria-labelledby="expressions-contribute-title"
    >
     
      <div class="lk-cta">
        <div class="lk-cta__text">
          <h2
            id="expressions-contribute-title"
            class="lk-cta__title"
          >
            {{ t('expressions.page.bottomCtaTitle') }}
          </h2>
          <p class="lk-cta__subtitle">
            {{ t('expressions.page.bottomCtaText') }}
          </p>
        </div>

        <div class="lk-cta__actions">
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

import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import ExpressionList from '@/components/ExpressionList.vue';
import SearchButtons from '@/components/SearchButtons.vue';
import ContributorButtons from '@/components/ContributorButtons.vue';
import AdminButtons from '@/components/AdminButtons.vue';
import LastExpressionsCount from '@/components/LastExpressionsCount.vue';

const { t } = useI18n();

// SEO basé sur i18n, avec fallback FR si jamais la clé manque
const seoTitle =
  t('expressions.meta.title') ||
  'Lexikongo – Liste des expressions en Kikongo';
const seoDescription =
  t('expressions.meta.description') ||
  'Découvrez la liste complète des expressions, mots et verbes en Kikongo avec leurs significations en français et en anglais.';

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
  name: 'Liste des expressions en Kikongo | Lexikongo',
  description:
    'Découvrez la liste complète des expressions, mots et verbes en Kikongo avec leurs significations en français et en anglais.',
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
/* Layout générique de page (aligné sur words/index.vue) */
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
  gap: 1.25rem;
}

/* Section CTA */
.lk-page__section--cta {
  margin-top: 0.5rem;
}

.lk-cta {
  border-radius: 1rem;
  padding: 1rem 1.1rem;
  /* on garde un léger gradient, mais on laisse le texte piloté par les vars */
  background: linear-gradient(
    135deg,
    rgba(13, 110, 253, 0.06),
    rgba(56, 189, 248, 0.08)
  );
  border: 1px solid var(--color-border, rgba(191, 219, 254, 0.9));
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  color: var(--color-text); /* ✅ texte lisible en light & dark */
}

.lk-cta__title {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text); /* ✅ au lieu de #0f172a */
}

.lk-cta__subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted, #9ca3af); /* ✅ au lieu de #475569 */
}

.lk-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}


.lk-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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

/* Colonne de droite du hero */
.lk-hero-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lk-hero__quick-search {
  width: 100%;
}

/* Boutons du hero (équivalent expr-btn, version thème global) */
.lk-hero-btn {
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

.lk-hero-btn--primary {
  background: #0d6efd;
  color: #ffffff;
  border-color: #0d6efd;
}

.lk-hero-btn--primary:hover,
.lk-hero-btn--primary:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(13, 110, 253, 0.4);
}

.lk-hero-btn--ghost {
  background: #ffffff;
  color: #111827;
  border-color: rgba(148, 163, 184, 0.7);
}

.lk-hero-btn--ghost:hover,
.lk-hero-btn--ghost:focus-visible {
  border-color: #0d6efd;
  color: #0d6efd;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

/* En-tête de section liste (on réutilise la logique existante) */
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

/* Responsive */
@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .lk-cta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
