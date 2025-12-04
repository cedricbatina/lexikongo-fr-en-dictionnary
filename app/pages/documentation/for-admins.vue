<template>
  <main
    class="lk-page lk-page--doc-admins"
    aria-labelledby="doc-admins-page-title"
  >
    <!-- Hero principal -->
    <LkPageHero
      id="doc-admins-page-title"
      :eyebrow="t('docAdmins.page.eyebrow')"
      :title="t('docAdmins.page.title')"
      :description="t('docAdmins.page.subtitle')"
      :primary-cta="primaryCta"
      :secondary-cta="secondaryCta"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-user-shield" aria-hidden="true"></i>
          <span>{{ t('docAdmins.page.metaHighlight') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : logo + raccourcis admin -->
      <template #side>
        <aside class="lk-hero-side">
          <LogoSlogan class="lk-hero__logo" />

          <section
            class="lk-admin-side"
            aria-label="Espace administrateur Lexikongo"
          >
            <h2 class="lk-admin-side__title">
              <i class="fas fa-tools" aria-hidden="true"></i>
              <span>{{ t('docAdmins.side.title') }}</span>
            </h2>

            <p class="lk-admin-side__text">
              {{ t('docAdmins.side.text') }}
            </p>

            <div class="lk-admin-side__actions">
              <NuxtLink
                to="/admin"
                class="lk-btn lk-btn--primary"
              >
                <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
                <span>{{ t('docAdmins.side.actions.dashboard') }}</span>
              </NuxtLink>

              <NuxtLink
                to="/admin/manage-pendings"
                class="lk-btn lk-btn--outline"
              >
                <i class="fas fa-inbox" aria-hidden="true"></i>
                <span>{{ t('docAdmins.side.actions.pendings') }}</span>
              </NuxtLink>
            </div>
          </section>
        </aside>
      </template>
    </LkPageHero>

    <!-- Intro -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-admins-intro-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-admins-intro-title"
          class="lk-doc-section__title"
        >
          Rôle des administrateurs dans Lexikongo
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Les administrateurs ont un rôle crucial dans la gestion et la modération
        des contributions de mots et de verbes sur la plateforme Lexikongo. Ce
        guide détaille leurs responsabilités, les outils de modération, et les
        étapes pour devenir administrateur.
      </p>
    </section>

    <!-- Conditions pour devenir admin -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-admins-conditions-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-admins-conditions-title"
          class="lk-doc-section__title"
        >
          Conditions pour devenir administrateur
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Pour postuler en tant qu’administrateur, les utilisateurs doivent :
      </p>

      <ul class="lk-doc-list">
        <li>Créer un compte utilisateur sur Lexikongo.</li>
        <li>Faire une demande via le formulaire de contact.</li>
        <li>
          Être un expert en Kikongo ou avoir terminé le cours&nbsp;
          <a
            href="https://longoka.fr/cours/apprenez-les-bases-du-kikongo-classique/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apprenez les bases du Kikongo classique
          </a>.
        </li>
      </ul>
    </section>

    <!-- Rôles & responsabilités -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-admins-roles-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-admins-roles-title"
          class="lk-doc-section__title"
        >
          Rôles et responsabilités des administrateurs
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Les administrateurs ont un accès étendu à la plateforme et sont
        responsables de la qualité du contenu publié. Leurs principales
        responsabilités incluent :
      </p>

      <ul class="lk-doc-list">
        <li>
          <strong>Modération des contributions :</strong>
          examiner, approuver ou rejeter les soumissions de mots et de verbes
          dans le tableau de bord de modération (vue de type
          <code>ManageSubmissions</code> / <code>manage-pendings</code>).
        </li>
        <li>
          <strong>Validation et rejet :</strong>
          lorsqu’une soumission est approuvée, elle est transférée vers les
          tables finales <code>words</code> ou <code>verbs</code>. En cas de
          rejet, un motif peut être spécifié et la soumission est archivée dans
          les tables d’archives dédiées.
        </li>
        <li>
          <strong>Archivage :</strong>
          les soumissions traitées sont stockées pendant une période définie
          dans les tables d’archivage (par ex.
          <code>archived_submitted_words</code> /
          <code>archived_submitted_verbs</code>), offrant un historique pour la
          modération.
        </li>
        <li>
          <strong>Gestion des utilisateurs :</strong>
          consulter les informations des contributeurs, suivre leurs
          soumissions, et valider les demandes d’élévation de rôle
          (contributeur &rarr; administrateur, le cas échéant).
        </li>
      </ul>
    </section>

    <!-- Outils & vue admin -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-admins-tools-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-admins-tools-title"
          class="lk-doc-section__title"
        >
          Outils et vue administrateur
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        L’interface administrateur regroupe plusieurs outils pour modérer,
        corriger et enrichir les données :
      </p>

      <ul class="lk-doc-list">
        <li>
          <strong>Tableau de bord :</strong>
          accès rapide aux indicateurs clés&nbsp;: nombre de mots et de verbes
          validés, nombre d’utilisateurs, volume de soumissions en attente, etc.
          Des graphiques peuvent montrer l’évolution du contenu et des
          contributions dans le temps.
        </li>
        <li>
          <strong>Liste des soumissions en attente :</strong>
          vue consolidée des pending words / pending verbs, avec filtres (type,
          statut, recherche texte) et actions rapides
          (approuver, rejeter, supprimer).
        </li>
        <li>
          <strong>Composants d’ajout direct :</strong>
          les formulaires d’administration (par ex. “Ajouter un mot”, “Ajouter
          un verbe”) permettent à un administrateur d’insérer directement des
          données validées sans passer par le flux de contribution publique.
        </li>
        <li>
          <strong>Gestion des slugs :</strong>
          contrôle des slugs uniques pour chaque mot et verbe validé via la
          table <code>slugs</code>, afin de garantir des URLs propres et stables
          pour le SEO.
        </li>
      </ul>
    </section>

    <!-- Fonctionnalités futures -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-admins-future-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-admins-future-title"
          class="lk-doc-section__title"
        >
          Fonctionnalités futures pour les administrateurs
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Plusieurs pistes d’évolution sont envisagées pour enrichir l’expérience
        administrateur :
      </p>

      <ul class="lk-doc-list">
        <li>
          <strong>Tableau de bord de statistiques avancées :</strong>
          affichage de données analytiques détaillées sur les contributions, les
          taux d’approbation, les délais moyens de validation et l’activité des
          contributeurs.
        </li>
        <li>
          <strong>Notifications aux contributeurs :</strong>
          ajout d’un système de notification (e-mail ou in-app) pour informer
          automatiquement les contributeurs de l’évolution de leurs soumissions
          (validation, rejet, demande de précision).
        </li>
        <li>
          <strong>Améliorations de l’archivage :</strong>
          options de tri et de filtrage avancés dans les archives, rallongement
          éventuel de la durée de rétention ou export CSV pour audit.
        </li>
      </ul>

      <p class="lk-doc-paragraph">
        Ces fonctionnalités pourront être déployées progressivement, en
        fonction des besoins de la communauté et des ressources disponibles.
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
  to: '/admin',
  label: t('docAdmins.page.primaryCta'),
  icon: 'fas fa-tachometer-alt',
}));

const secondaryCta = computed(() => ({
  to: '/documentation/for-contributors',
  label: t('docAdmins.page.secondaryCta'),
  icon: 'fas fa-hands-helping',
  variant: 'ghost',
}));

const seoTitle =
  t('docAdmins.meta.title') || 'Guide des administrateurs – Lexikongo';
const seoDescription =
  t('docAdmins.meta.description') ||
  "Guide complet pour les administrateurs de Lexikongo : modération des contributions, archivage, gestion des utilisateurs et pistes d'évolution.";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Guide des administrateurs – Lexikongo',
  description: seoDescription,
  url: 'https://www.lexikongo.fr/documentation/for-admins',
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
        'Lexikongo, administrateur, modération, dictionnaire Kikongo, gestion des contributions',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    {
      property: 'og:url',
      content: 'https://www.lexikongo.fr/documentation/for-admins',
    },
    { property: 'og:type', content: 'article' },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://www.lexikongo.fr/documentation/for-admins',
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

/* Bloc côté admin */
.lk-admin-side {
  border-radius: 0.9rem;
  padding: 0.8rem 0.85rem;
  background: var(--color-surface, #f9fafb);
  border: 1px solid rgba(148, 163, 184, 0.45);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.lk-admin-side__title {
  margin: 0;
  font-size: 0.96rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--color-text, #111827);
}

.lk-admin-side__title i {
  color: var(--primary, #0d6efd);
}

.lk-admin-side__text {
  margin: 0;
  font-size: 0.86rem;
  color: var(--color-text-muted, #4b5563);
}

.lk-admin-side__actions {
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

  .lk-admin-side__actions {
    flex-direction: column;
  }

  .lk-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
