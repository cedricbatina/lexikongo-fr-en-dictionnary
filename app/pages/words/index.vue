<!-- pages/words/index.vue -->
<template>
  <main class="page words-page">
    <!-- HERO -->
    <section class="words-hero">
      <div class="words-hero__content">
        <h1 class="words-hero__title">
          <span class="words-hero__icon" aria-hidden="true">
            <i class="fas fa-spell-check"></i>
          </span>
          <span>{{ t('words.index.title') }}</span>
        </h1>
        <p class="words-hero__subtitle">
          {{ t('words.index.description') }}
        </p>
        <div class="words-hero__meta">
          <LogoSlogan />
        </div>
      </div>

      <aside class="words-hero__side" aria-label="Actions rapides">
        <SearchButtons />
        <ContributorButtons />
        <AdminButtons />
      </aside>
    </section>

    <!-- CONTENU PRINCIPAL -->
    <section class="words-main" aria-labelledby="words-list-heading">
      <header class="words-main__header">
        <h2 id="words-list-heading" class="words-main__title">
          {{ t('words.index.listTitle') }}
        </h2>
        <p class="words-main__hint">
          {{ t('words.index.listHint') }}
        </p>
      </header>

      <!-- Ici, pour l’instant, on continue d’utiliser WordList tel quel.
           Quand tu m’auras collé son code, on le refondra pour consommer wordStore. -->
      <WordList />

      <div class="words-main__footer">
        <LastExpressionsCount />
      </div>
    </section>

    <!-- CTA CONTRIBUTION -->
    <section class="words-cta" aria-labelledby="contribute-section">
      <div class="words-cta__card">
        <div class="words-cta__text">
          <h2 id="contribute-section" class="words-cta__title">
            {{ t('words.index.contributeTitle') }}
          </h2>
          <p class="words-cta__description">
            {{ t('words.index.contributeText') }}
          </p>
        </div>

        <div class="words-cta__actions">
          <NuxtLink
            to="/documentation/for-contributors"
            class="btn-solid"
            aria-label="Rejoignez les contributeurs pour enrichir le lexique"
          >
            <i class="fas fa-hands-helping" aria-hidden="true"></i>
            <span>{{ t('words.index.contributeButton') }}</span>
          </NuxtLink>

          <NuxtLink
            to="/contact"
            class="btn-ghost"
            aria-label="Contactez-nous pour toute assistance ou suggestion"
          >
            <i class="fas fa-envelope" aria-hidden="true"></i>
            <span>{{ t('words.index.contactButton') }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- SEARCH BUTTONS EN BAS POUR MOBILE -->
    <section class="words-bottom-actions">
      <SearchButtons />
    </section>
  </main>
</template>

<script setup>
import { useSeoMeta, useHead } from '#imports';
import { useI18n } from 'vue-i18n';
import WordList from '@/components/WordList.vue';

const { t } = useI18n();

// SEO + i18n
useSeoMeta({
  title: () => t('words.index.title'),
  description: () => t('words.index.description'),
  keywords: () => t('words.index.keywords'),
  ogTitle: () => t('words.index.title'),
  ogDescription: () => t('words.index.ogDescription') || t('words.index.description'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('words.index.title'),
  twitterDescription: () => t('words.index.description'),
});

// JSON-LD (adapté à ta nouvelle base SSR, mais même esprit que ton code actuel)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Liste des Mots en Kikongo | Lexikongo',
  description:
    "Explorez la liste des mots en Kikongo, enrichie de traductions en français et en anglais, avec leur phonétique.",
  url: 'https://www.lexikongo.fr/words',
  image: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
  inLanguage: 'fr',
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
.page.words-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 2.5rem;
}

/* HERO */
.words-hero {
  display: grid;
  grid-template-columns: minmax(0, 2fr);
  gap: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 2.5rem;
}

.words-hero__title {
  display: flex;
  align-items: center;
  gap: .75rem;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 700;
  color: var(--primary, #0d6efd);
}

.words-hero__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: .75rem;
  background: rgba(13, 110, 253, .08);
}

.words-hero__subtitle {
  margin-top: .75rem;
  color: var(--muted-text, #6c757d);
  line-height: 1.6;
}

.words-hero__meta {
  margin-top: 1rem;
}

.words-hero__side {
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

@media (min-width: 768px) {
  .words-hero {
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    align-items: center;
  }
}

/* SECTION PRINCIPALE */
.words-main {
  padding: 1.5rem;
  border-radius: 1.2rem;
  background: var(--surface-elevated, #ffffff);
  box-shadow: 0 18px 45px rgba(15, 23, 42, .08);
  margin-bottom: 2.5rem;
}

.words-main__header {
  margin-bottom: 1.25rem;
}

.words-main__title {
  font-size: 1.25rem;
  font-weight: 600;
}

.words-main__hint {
  margin-top: .4rem;
  color: var(--muted-text, #6c757d);
  font-size: .95rem;
}

.words-main__footer {
  margin-top: 1.5rem;
}

/* CTA CONTRIBUTION */
.words-cta {
  margin-bottom: 2rem;
}

.words-cta__card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: linear-gradient(135deg, rgba(13,110,253,0.06), rgba(13,110,253,0.02));
  border: 1px solid rgba(13, 110, 253, 0.16);
}

.words-cta__title {
  font-size: 1.15rem;
  font-weight: 600;
}

.words-cta__description {
  margin-top: .35rem;
  color: var(--muted-text, #6c757d);
}

.words-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
}

/* Boutons premium */
.btn-solid,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .65rem 1.1rem;
  border-radius: 999px;
  font-size: .95rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease, border-color .12s ease;
}

.btn-solid {
  background: var(--primary, #0d6efd);
  color: #fff;
  box-shadow: 0 10px 24px rgba(13, 110, 253, 0.35);
}

.btn-ghost {
  background: transparent;
  color: var(--primary, #0d6efd);
  border-color: rgba(13, 110, 253, 0.4);
}

.btn-solid:hover,
.btn-solid:focus-visible,
.btn-ghost:hover,
.btn-ghost:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
}

/* SECTION BASSE (search buttons) */
.words-bottom-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
</style>
