<template>
  <main
    class="lk-page lk-page--words"
    aria-labelledby="words-page-title"
  >
    <!-- Hero réutilisable -->
    <LkPageHero
      id="words-page-title"
      :eyebrow="t('words.page.eyebrow')"
      :title="t('words.page.title')"
      :description="t('words.page.subtitle')"
      :primary-cta="primaryCta"
      :secondary-cta="secondaryCta"
      :side-aria-label="t('pageHero.sideAria')"
        :show-last-expressions="true"

    >
      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-language" aria-hidden="true"></i>
          <span>Kikongo · Français · Anglais · Phonétique</span>
        </p>
      </template>

      <!-- Colonne de droite : logo + raccourcis -->
      <template #side>
        <div class="lk-hero-side">
     
          <LkActionsBar class="lk-hero__quick-search" />
        </div>
      </template>
    </LkPageHero>

    <!-- Bloc principal : WordList gère son propre titre i18n -->
    <section class="lk-page__section lk-page__section--words">
      <WordList />
    </section>

    <!-- Appel à contribution -->
    <section
      class="lk-page__section lk-page__section--cta"
      aria-labelledby="words-contribute-title"
    >
      <div class="lk-cta">
        <div class="lk-cta__text">
          <h2
            id="words-contribute-title"
            class="lk-cta__title"
          >
            Vous ne trouvez pas un mot dans le lexique ?
          </h2>
          <p class="lk-cta__subtitle">
            Lexikongo est un dictionnaire vivant. Proposez de nouveaux mots,
            expressions ou verbes pour enrichir la langue Kikongo en ligne.
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
import { computed } from 'vue';
import { useHead } from '#app';
import { useI18n } from 'vue-i18n';

import LkPageHero from '@/components/LkPageHero.vue';
import WordList from '@/components/WordList.vue';
import LogoSlogan from '@/components/LogoSlogan.vue';
import SearchButtons from '@/components/SearchButtons.vue';
import ContributorButtons from '@/components/ContributorButtons.vue';
import AdminButtons from '@/components/AdminButtons.vue';

const { t } = useI18n();

/**
 * CTA 100% i18n + réactifs
 * (change de langue => les labels se mettent à jour)
 */
const primaryCta = computed(() => ({
  to: '/search',
  label: t('words.page.primaryCta'),
  icon: 'fas fa-search',
}));

const secondaryCta = computed(() => ({
  to: '/documentation/for-contributors',
  label: t('words.page.secondaryCta'),
  icon: 'fas fa-hands-helping',
  variant: 'ghost',
}));

// SEO
const seoTitle =
  t('words.meta.title') ||
  'Lexikongo - Découvrez et explorez les mots en Kikongo';
const seoDescription =
  t('words.meta.description') ||
  "Explorez le lexique des mots en Kikongo avec leurs pluriels, transcriptions phonétiques et traductions en français et en anglais.";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Liste des mots en Kikongo | Lexikongo',
  description:
    'Explorez la liste des mots en Kikongo avec leurs traductions en français et en anglais, ainsi que leur phonétique.',
  url: 'https://www.lexikongo.fr/words',
  inLanguage: 'fr',
  image: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
  publisher: {
    '@type': 'Organization',
    name: 'Lexikongo',
    url: 'https://www.lexikongo.fr',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
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
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.lexikongo.fr/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    {
      name: 'keywords',
      content:
        'Kikongo, dictionnaire Kikongo, mots en Kikongo, traduction Kikongo, langue africaine, lexique, Congo, culture africaine, étymologie Kikongo, mots, verbes, linguistique, traduction, français, anglais, patrimoine linguistique',
    },
    { name: 'author', content: 'Lexikongo' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    {
      property: 'og:image',
      content: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
    },
    { property: 'og:url', content: 'https://www.lexikongo.fr/words' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
    {
      name: 'twitter:image',
      content: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://www.lexikongo.fr/words',
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

/* Sections */
.lk-page__section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* CTA */
.lk-page__section--cta {
  margin-top: 0.5rem;
}

.lk-cta {
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

/* Side hero pour les mots */
.lk-hero-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lk-hero__logo {
  max-width: 220px;
  width: 100%;
}

.lk-hero__quick-search {
  width: 100%;
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
