<template>
  <main
    class="lk-page lk-page--doc-users"
    aria-labelledby="doc-users-page-title"
  >
    <!-- Hero principal -->
    <LkPageHero
      id="doc-users-page-title"
      :eyebrow="t('docUsers.page.eyebrow')"
      :title="t('docUsers.page.title')"
      :description="t('docUsers.page.subtitle')"
      :primary-cta="primaryCta"
      :secondary-cta="secondaryCta"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-language" aria-hidden="true"></i>
          <span>{{ t('docUsers.page.metaHighlight') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : logo + raccourcis utilisateur -->
      <template #side>
        <aside class="lk-hero-side">
          <LogoSlogan class="lk-hero__logo" />

          <section
            class="lk-user-side"
            aria-label="Espace utilisateur Lexikongo"
          >
            <h2 class="lk-user-side__title">
              <i class="fas fa-user" aria-hidden="true"></i>
              <span>{{ t('docUsers.side.title') }}</span>
            </h2>

            <p class="lk-user-side__text">
              {{ t('docUsers.side.text') }}
            </p>

            <div class="lk-user-side__actions">
              <NuxtLink
                to="/expressions"
                class="lk-btn lk-btn--primary"
              >
                <i class="fas fa-search" aria-hidden="true"></i>
                <span>{{ t('docUsers.side.actions.explore') }}</span>
              </NuxtLink>

              <NuxtLink
                to="/register"
                class="lk-btn lk-btn--outline"
              >
                <i class="fas fa-user-plus" aria-hidden="true"></i>
                <span>{{ t('docUsers.side.actions.register') }}</span>
              </NuxtLink>
            </div>
          </section>
        </aside>
      </template>
    </LkPageHero>

    <!-- Intro -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-users-intro-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-users-intro-title"
          class="lk-doc-section__title"
        >
          Guide des utilisateurs Lexikongo
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Lexikongo est une plateforme accessible à tous pour consulter un
        lexique trilingue en Kikongo, Français et Anglais. Que vous soyez
        simple visiteur, apprenant, enseignant ou passionné de langues, ce
        guide décrit les fonctionnalités disponibles en fonction de votre type
        de compte.
      </p>
    </section>

    <!-- Fonctionnalités pour tous -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-users-all-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-users-all-title"
          class="lk-doc-section__title"
        >
          Fonctionnalités pour tous les utilisateurs
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Tous les visiteurs, avec ou sans compte, peuvent&nbsp;:
      </p>

      <ul class="lk-doc-list">
        <li>
          Consulter le lexique pour explorer les mots et les verbes en Kikongo
          ainsi que leurs traductions en français et en anglais.
        </li>
        <li>
          Utiliser la recherche pour trouver des expressions, découvrir de
          nouveaux termes et enrichir leur connaissance du Kikongo.
        </li>
      </ul>

      <p class="lk-doc-paragraph">
        L’accès à ces fonctionnalités ne nécessite pas d’inscription&nbsp;:
        Lexikongo reste ouvert à tous ceux qui souhaitent découvrir la langue
        et la culture Kongo.
      </p>
    </section>

    <!-- Fonctionnalités pour les comptes créés -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-users-account-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-users-account-title"
          class="lk-doc-section__title"
        >
          Fonctionnalités pour les utilisateurs avec compte
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Les utilisateurs inscrits bénéficient de fonctionnalités avancées :
      </p>

      <ul class="lk-doc-list">
        <li>
          Accès à des informations enrichies sur les mots et les verbes
          (exemples d’utilisation, nuances de sens, précisions linguistiques,
          lorsque disponibles).
        </li>
        <li>
          Consultation de détails supplémentaires comme les synonymes,
          remarques et liens avec d’autres entrées du lexique.
        </li>
        <li>
          Possibilité de soumettre des demandes pour devenir contributeur ou
          administrateur, si les conditions sont remplies (connaissances
          linguistiques, engagement, etc.).
        </li>
      </ul>

      <p class="lk-doc-paragraph">
        Créer un compte vous permet également de préparer une éventuelle
        participation active au projet (soumissions de mots/verbres,
        relectures, etc.).
      </p>
    </section>

    <!-- Contribution financière -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-users-don-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-users-don-title"
          class="lk-doc-section__title"
        >
          Contributions financières
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Les utilisateurs peuvent également soutenir Lexikongo en
        contribuant financièrement. Ces dons permettent d’améliorer
        l’application et de développer de nouvelles fonctionnalités
        (recherche avancée, outils pédagogiques, statistiques, etc.).
      </p>

      <ul class="lk-doc-list">
        <li>
          En passant par la page
          <NuxtLink to="/contribute">
            Contribution financière
          </NuxtLink>
          pour soutenir directement le projet.
        </li>
        <li>
          Ou via des plateformes de type “Buy me a coffee” lorsque cela est
          proposé par l’équipe Lexikongo.
        </li>
      </ul>

      <p class="lk-doc-paragraph">
        Quel que soit le montant, votre soutien contribue à faire vivre une
        ressource linguistique unique et à la rendre accessible au plus grand
        nombre.
      </p>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useHead } from '#app';
import { useI18n } from 'vue-i18n';

import LkPageHero from '@/components/LkPageHero.vue';
import LogoSlogan from '@/components/LogoSlogan.vue';

const { t } = useI18n();

const primaryCta = computed(() => ({
  to: '/expressions',
  label: t('docUsers.page.primaryCta'),
  icon: 'fas fa-search',
}));

const secondaryCta = computed(() => ({
  to: '/register',
  label: t('docUsers.page.secondaryCta'),
  icon: 'fas fa-user-plus',
  variant: 'ghost',
}));

const seoTitle =
  t('docUsers.meta.title') || 'Guide des utilisateurs – Lexikongo';
const seoDescription =
  t('docUsers.meta.description') ||
  "Guide pour les utilisateurs de Lexikongo : fonctionnalités disponibles avec ou sans compte, consultation du lexique et soutien au projet.";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Guide des utilisateurs – Lexikongo',
  description: seoDescription,
  url: 'https://www.lexikongo.fr/documentation/for-users',
  inLanguage: 'fr',
  publisher: {
    '@type': 'Organization',
    name: 'Lexikongo',
  },
};

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    {
      name: 'keywords',
      content:
        'Lexikongo, guide utilisateur, dictionnaire Kikongo, consulter le lexique, langue Kikongo',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    {
      property: 'og:url',
      content: 'https://www.lexikongo.fr/documentation/for-users',
    },
    { property: 'og:type', content: 'article' },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://www.lexikongo.fr/documentation/for-users',
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
  gap: 0.85rem;
}

.lk-doc-section {
  background: var(--color-surface-elevated, #ffffff);
  border-radius: 1rem;
  padding: 1.2rem 1.1rem 1.3rem;
  border: 1px solid var(--color-border-subtle, rgba(148, 163, 184, 0.35));
}

/* Header de section */
.lk-doc-section__header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lk-doc-section__title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text, #0f172a);
}

/* Texte */
.lk-doc-paragraph {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--color-text-muted, #4b5563);
}

/* Listes */
.lk-doc-list {
  margin: 0.25rem 0 0.25rem;
  padding-left: 1.2rem;
  font-size: 0.9rem;
  color: var(--color-text-muted, #4b5563);
}

.lk-doc-list li {
  margin-bottom: 0.2rem;
}

/* Hero meta & side */
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

.lk-hero__logo {
  max-width: 230px;
  width: 100%;
}

/* Bloc côté utilisateur */
.lk-user-side {
  border-radius: 0.9rem;
  padding: 0.8rem 0.85rem;
  background: var(--color-surface, #f9fafb);
  border: 1px solid rgba(148, 163, 184, 0.45);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.lk-user-side__title {
  margin: 0;
  font-size: 0.96rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--color-text, #111827);
}

.lk-user-side__title i {
  color: var(--primary, #0d6efd);
}

.lk-user-side__text {
  margin: 0;
  font-size: 0.86rem;
  color: var(--color-text-muted, #4b5563);
}

.lk-user-side__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

/* Boutons */
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

.lk-btn--outline {
  background: transparent;
  color: var(--color-text, #0f172a);
  border-color: rgba(148, 163, 184, 0.8);
}

.lk-btn:hover,
.lk-btn:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .lk-doc-section {
    padding-inline: 1rem;
  }

  .lk-user-side__actions {
    flex-direction: column;
  }

  .lk-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
