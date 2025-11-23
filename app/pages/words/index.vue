<template>
  <main
    class="lk-page lk-page--words"
    aria-labelledby="words-page-title"
  >
    <!-- Hero / introduction -->
    <section class="lk-hero">
      <div class="lk-hero__content">
        <h1 id="words-page-title" class="lk-hero__title">
          <span class="lk-hero__kicker">
            Lexikongo · Dictionnaire en ligne
          </span>
          <span class="lk-hero__main">
            Découvrir les mots en Kikongo
          </span>
        </h1>

        <p class="lk-hero__subtitle">
          Parcourez le lexique Kikongo avec leurs pluriels, transcriptions
          phonétiques et traductions en français et en anglais. Construit
          et enrichi par la communauté.
        </p>

        <div class="lk-hero__actions">
          <NuxtLink
            to="/search"
            class="lk-btn lk-btn--primary"
          >
            <i class="fas fa-search" aria-hidden="true"></i>
            <span>Commencer une recherche</span>
          </NuxtLink>

          <NuxtLink
            to="/documentation/for-contributors"
            class="lk-btn lk-btn--ghost"
          >
            <i class="fas fa-hands-helping" aria-hidden="true"></i>
            <span>Contribuer au dictionnaire</span>
          </NuxtLink>
        </div>

        <p class="lk-hero__meta">
          <i class="fas fa-language" aria-hidden="true"></i>
          <span>Kikongo · Français · Anglais · Phonétique</span>
        </p>
      </div>

      <div class="lk-hero__side">
        <LogoSlogan class="lk-hero__logo" />
        <SearchButtons class="lk-hero__quick-search" />
      </div>
    </section>

    <!-- Bloc principal : on laisse WordList gérer son propre titre -->
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
import { useHead } from '#app';
import { useI18n } from 'vue-i18n';

import WordList from '@/components/WordList.vue';
import LogoSlogan from '@/components/LogoSlogan.vue';
import SearchButtons from '@/components/SearchButtons.vue';
import ContributorButtons from '@/components/ContributorButtons.vue';
import AdminButtons from '@/components/AdminButtons.vue';

const { t } = useI18n();

// Clés i18n pour le SEO (avec fallback FR)
const seoTitle =
  t('words.meta.title') ||
  'Lexikongo - Découvrez et explorez les mots en Kikongo';
const seoDescription =
  t('words.meta.description') ||
  "Explorez le lexique des mots en Kikongo avec leurs pluriels, transcriptions phonétiques et traductions en français et en anglais.";

// JSON-LD (SEO)
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
    {
      name: 'description',
      content: seoDescription,
    },
    {
      name: 'keywords',
      content:
        'Kikongo, dictionnaire Kikongo, mots en Kikongo, traduction Kikongo, langue africaine, lexique, Congo, culture africaine, étymologie Kikongo, mots, verbes, linguistique, traduction, français, anglais, patrimoine linguistique',
    },
    { name: 'author', content: 'Lexikongo' },
    { name: 'robots', content: 'index, follow' },

    // Open Graph
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    {
      property: 'og:image',
      content: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
    },
    { property: 'og:url', content: 'https://www.lexikongo.fr/words' },
    { property: 'og:type', content: 'website' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
    {
      name: 'twitter:image',
      content: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
    },
  ],
  // 🔧 canonical doit être dans "link" et non dans "meta"
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

/* HERO */
.lk-hero {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.4fr);
  gap: 1.75rem;
  align-items: center;
}

.lk-hero__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lk-hero__title {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lk-hero__kicker {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #6b7280;
}

.lk-hero__main {
  font-size: 1.8rem;
  line-height: 1.2;
  font-weight: 700;
  color: #111827;
}

.lk-hero__subtitle {
  margin: 0;
  font-size: 0.98rem;
  color: #4b5563;
}

.lk-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 0.25rem;
}

.lk-btn {
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

.lk-btn--primary {
  background: #0d6efd;
  color: #ffffff;
  border-color: #0d6efd;
}

.lk-btn--primary:hover,
.lk-btn--primary:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(13, 110, 253, 0.4);
}

.lk-btn--ghost {
  background: #ffffff;
  color: #111827;
  border-color: rgba(148, 163, 184, 0.7);
}

.lk-btn--ghost:hover,
.lk-btn--ghost:focus-visible {
  border-color: #0d6efd;
  color: #0d6efd;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

.lk-hero__meta {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.lk-hero__meta i {
  color: #0d6efd;
}

/* Colonne droite du hero */
.lk-hero__side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.lk-hero__logo {
  max-width: 220px;
  width: 100%;
}

.lk-hero__quick-search {
  width: 100%;
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

/* Responsive */
@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .lk-hero {
    grid-template-columns: minmax(0, 1fr);
  }

  .lk-hero__side {
    align-items: flex-start;
  }

  .lk-hero__main {
    font-size: 1.5rem;
  }

  .lk-cta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
