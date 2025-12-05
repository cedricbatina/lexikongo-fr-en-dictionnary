<template>
  <main
    class="lk-page lk-page--doc-contributors"
    aria-labelledby="doc-contrib-page-title"
  >
    <!-- Hero principal -->
    <LkPageHero
      id="doc-contrib-page-title"
      :eyebrow="t('docContrib.page.eyebrow')"
      :title="t('docContrib.page.title')"
      :description="t('docContrib.page.subtitle')"
      :primary-cta="primaryCta"
      :secondary-cta="secondaryCta"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-language" aria-hidden="true"></i>
          <span>{{ t('docContrib.page.metaHighlight') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : logo + actions contributeur -->
      <template #side>
        <aside class="lk-hero-side">
          <LogoSlogan class="lk-hero__logo" />

          <section
            class="lk-contrib-side"
            aria-label="Actions rapides pour les contributeurs"
          >
            <h2 class="lk-contrib-side__title">
              <i class="fas fa-hands-helping" aria-hidden="true"></i>
              <span>{{ t('docContrib.side.title') }}</span>
            </h2>

            <p class="lk-contrib-side__text">
              {{ t('docContrib.side.text') }}
            </p>

            <div class="lk-contrib-side__actions">
              <ContributorButtons />
              <AdminButtons />
            </div>
          </section>
        </aside>
      </template>
    </LkPageHero>

    <!-- Intro & vision générale -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-contrib-intro-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-contrib-intro-title"
          class="lk-doc-section__title"
        >
          Rejoignez la communauté Lexikongo
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Devenez un acteur clé dans la préservation et la promotion de la langue
        Kikongo. Enrichissez notre lexique, partagez vos connaissances et
        participez à ce projet unique pour préserver un patrimoine culturel
        inestimable.
      </p>
      <p class="lk-doc-paragraph">
        Le Kikongo, une langue bantu parlée par des millions de personnes, est
        riche de plus de <strong>350&nbsp;000 mots et verbes</strong>. Ce
        lexique a un immense potentiel pour enrichir l’éducation, les sciences
        et les arts. Ensemble, transformons cette vision en réalité.
      </p>
    </section>

    <!-- Pourquoi contribuer ? -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-contrib-why-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-contrib-why-title"
          class="lk-doc-section__title"
        >
          Pourquoi contribuer ?
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        En rejoignant Lexikongo, vous devenez une pièce essentielle dans la
        sauvegarde d’une langue qui incarne l’histoire, la culture et
        l’identité d’un peuple. Contribuer, c’est&nbsp;:
      </p>

      <ul class="lk-doc-list">
        <li>
          <strong>Préserver un trésor linguistique :</strong>
          la langue Kikongo est bien plus qu’un moyen de communication. Elle
          porte en elle des valeurs, des philosophies et des expressions
          uniques.
        </li>
        <li>
          <strong>Créer des mots modernes :</strong>
          grâce à la logique et à la structure du Kikongo, nous pouvons créer
          des mots pour des concepts modernes en science, technologie et
          éducation.
        </li>
        <li>
          <strong>Faire rayonner la culture Kongo :</strong>
          participez à rendre cette langue vivante et influente à l’ère
          numérique.
        </li>
      </ul>

      <p class="lk-doc-paragraph">
        Imaginez un monde où le Kikongo est enseigné dans les écoles, utilisé
        dans les innovations technologiques et reconnu internationalement. Ce
        rêve commence avec vos contributions.
      </p>
    </section>

    <!-- Engagement socio-culturel -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-contrib-engagement-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-contrib-engagement-title"
          class="lk-doc-section__title"
        >
          Engagement socio-culturel
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Lexikongo n’est pas une simple plateforme numérique, mais une mission
        qui vise à préserver et à moderniser l’une des langues les plus riches
        et anciennes d’Afrique&nbsp;: le Kikongo. En soutenant ce projet, vous
        jouez un rôle actif dans&nbsp;:
      </p>

      <ul class="lk-doc-list">
        <li>
          <strong>Préserver le patrimoine linguistique :</strong>
          le Kikongo, avec ses plus de <strong>350&nbsp;000 mots et verbes</strong>,
          est une langue en danger face à l’érosion culturelle. Chaque
          contribution aide à documenter et préserver ce trésor inestimable.
        </li>
        <li>
          <strong>Favoriser l’éducation et la recherche :</strong>
          votre soutien permet de créer des outils modernes pour l’enseignement,
          comme des cours interactifs, des guides d’apprentissage et des
          lexiques numériques multilingues (Kikongo–Français–Anglais).
        </li>
        <li>
          <strong>Créer une langue vivante et moderne :</strong>
          aidez-nous à introduire de nouveaux mots pour parler des sciences, de
          la technologie et des concepts modernes, tout en respectant la
          structure du Kikongo classique.
        </li>
        <li>
          <strong>Inspirer les générations futures :</strong>
          grâce à votre soutien, nous transmettons aux jeunes une langue qui ne
          se limite pas à un héritage, mais devient un outil d’expression et
          d’innovation.
        </li>
      </ul>
    </section>

    <!-- Conditions pour contribuer -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-contrib-conditions-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-contrib-conditions-title"
          class="lk-doc-section__title"
        >
          Conditions pour contribuer
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Pour garantir la qualité de notre base de données, voici les prérequis
        pour rejoindre Lexikongo&nbsp;:
      </p>

      <ul class="lk-doc-list">
        <li>
          <strong>Connaissances linguistiques :</strong>
          avoir une maîtrise de base du Kikongo ou suivre le cours&nbsp;:
          <a
            href="https://longoka.fr/course/apprenez-les-bases-du-kikongo-classique/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apprenez les bases du Kikongo classique
          </a>.
        </li>
        <li>
          <strong>Créer un compte :</strong>
          <NuxtLink to="/register">
            Inscrivez-vous gratuitement
          </NuxtLink>
          pour accéder aux outils de contribution. Après avoir confirmé votre
          inscription en cliquant sur le lien envoyé dans votre boîte mail (pensez
          à vérifier les spams), faites une demande de contribution en envoyant
          un message à l’administrateur via le
          <NuxtLink to="/contact">
            formulaire de contact
          </NuxtLink>.
          <br />
          <span class="lk-doc-paragraph">
            Vous pouvez également envoyer un email à&nbsp;:
            <a href="mailto:contact@lexikongo.fr" class="email-link">
              contact@lexikongo.fr
            </a>
          </span>
        </li>
        <li>
          <strong>Respect des consignes :</strong>
          soumettez des données fiables, précises et conformes aux normes
          établies.
        </li>
      </ul>
    </section>

    <!-- Comment contribuer ? -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-contrib-how-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-contrib-how-title"
          class="lk-doc-section__title"
        >
          Comment contribuer ?
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Contribuer à Lexikongo est un processus simple et structuré&nbsp;:
      </p>

      <ol class="lk-doc-list lk-doc-list--ordered">
        <li>
          <strong>Inscrivez-vous :</strong>
          créez un compte sur notre plateforme
          <NuxtLink to="/register">
            Lexikongo
          </NuxtLink>.
        </li>
        <li>
          <strong>Connectez-vous :</strong>
          explorez les outils dédiés aux contributeurs dans votre tableau de
          bord.
        </li>
        <li>
          <strong>Soumettez vos contributions :</strong>
          ajoutez des mots, verbes et expressions avec des détails tels que&nbsp;:
          <ul class="lk-doc-list lk-doc-list--nested">
            <li>
              Singulier et pluriel, phonétique et au moins une traduction en
              français pour les mots.
            </li>
            <li>
              Infinitif, racine, suffixe, phonétique et au moins une traduction
              en français pour les verbes.
            </li>
            <li>Traductions en français et en anglais.</li>
          </ul>
        </li>
        <li>
          <strong>Suivez vos soumissions :</strong>
          consultez leur statut (en attente, approuvé, rejeté) en temps réel.
        </li>
      </ol>

      <p class="lk-doc-paragraph">
        Ce processus structuré garantit la qualité et la pertinence des données
        ajoutées à notre base de connaissances.
      </p>
    </section>

    <!-- Un rêve collectif -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-contrib-dream-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-contrib-dream-title"
          class="lk-doc-section__title"
        >
          Un rêve collectif
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Imaginez une plateforme où le Kikongo devient une langue centrale pour
        l’éducation, la recherche et la culture. Imaginez des étudiants
        apprenant à coder, à innover, à enseigner les sciences en Kikongo. C’est
        une vision ambitieuse, mais réalisable grâce à votre soutien.
      </p>
      <p class="lk-doc-paragraph">
        Chaque mot ajouté au lexique, chaque euro versé pour développer cette
        plateforme, chaque partage de connaissances nous rapproche de cet
        objectif. Votre soutien n’est pas qu’un don&nbsp;: il est un
        investissement dans l’avenir d’une culture millénaire.
      </p>
      <p class="lk-doc-paragraph">
        Lexikongo aspire à devenir une plateforme révolutionnaire pour les
        apprenants, les chercheurs et les locuteurs de la langue Kikongo. Grâce
        à vos contributions, nous pouvons&nbsp;:
      </p>
      <ul class="lk-doc-list">
        <li>Développer des outils linguistiques modernes.</li>
        <li>Intégrer des cours interactifs et des ressources éducatives.</li>
        <li>
          Étendre la base de données pour inclure des variantes et des dialectes
          régionaux.
        </li>
      </ul>
    </section>

    <!-- Soutiens & autres contributions -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-contrib-support-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-contrib-support-title"
          class="lk-doc-section__title"
        >
          Soutenez-nous autrement
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Vous souhaitez nous soutenir davantage&nbsp;? Voici quelques façons de
        contribuer :
      </p>

      <ul class="lk-doc-list">
        <li>
          <strong>Faire un don :</strong>
          visitez notre page
          <NuxtLink to="/contribute">
            Contribution financière
          </NuxtLink>
          pour nous soutenir.
        </li>
        <li>
          <strong>Partager Lexikongo :</strong>
          faites connaître notre plateforme à votre entourage et sur vos réseaux
          sociaux.
        </li>
        <li>
          <strong>Envoyer des suggestions :</strong>
          partagez vos idées et ressources pour enrichir notre projet.
        </li>
      </ul>

      <div
        class="lk-contrib-cta"
        aria-label="Autres façons de contribuer à Lexikongo"
      >
        <h3 class="lk-contrib-cta__title">
          Autres formes de contribution
        </h3>
        <p class="lk-doc-paragraph">
          Il existe plusieurs façons de soutenir Lexikongo :
        </p>

        <div class="lk-contrib-cta__actions">
          <NuxtLink
            to="/contribute"
            class="lk-btn lk-btn--primary"
          >
            <i class="fas fa-hand-holding-usd" aria-hidden="true"></i>
            <span>Faire un don à Lexikongo</span>
          </NuxtLink>

          <NuxtLink
            to="/register"
            class="lk-btn lk-btn--outline"
          >
            <i class="fas fa-users" aria-hidden="true"></i>
            <span>Rejoindre les contributeurs</span>
          </NuxtLink>

          <NuxtLink
            to="/contact"
            class="lk-btn lk-btn--ghost"
          >
            <i class="fas fa-envelope" aria-hidden="true"></i>
            <span>Contactez-nous</span>
          </NuxtLink>
        </div>

        <p class="lk-doc-paragraph">
          Votre contribution, qu’elle soit financière ou intellectuelle, est
          précieuse pour bâtir un futur où le Kikongo est à la fois préservé et
          modernisé.
        </p>
      </div>
    </section>

    <!-- Où vont vos dons ? -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-contrib-don-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-contrib-don-title"
          class="lk-doc-section__title"
        >
          Où vont vos dons ?
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Vos dons sont utilisés avec soin et transparence. Voici quelques
        exemples de ce qu’ils permettent de financer :
      </p>

      <ul class="lk-doc-list">
        <li>
          <strong>Développement technique :</strong>
          création et maintenance de la plateforme, ajout de fonctionnalités
          comme la recherche avancée et des tableaux de bord pour les
          contributeurs.
        </li>
        <li>
          <strong>Production de contenu éducatif :</strong>
          développement de cours, guides, vidéos et autres supports
          pédagogiques pour promouvoir l’apprentissage du Kikongo.
        </li>
        <li>
          <strong>Extension linguistique :</strong>
          ajout de dialectes, de nouvelles langues africaines, de traductions
          dans d’autres langues, pour enrichir le réseau linguistique de
          Lexikongo.
        </li>
        <li>
          <strong>Formation et soutien des contributeurs :</strong>
          mise en place d’outils collaboratifs, formations pour les volontaires
          et partenariats avec des écoles et des universités.
        </li>
        <li>
          <strong>Maintenance et sécurité :</strong>
          garantir un accès fiable et sécurisé à tous les utilisateurs à
          travers le monde.
        </li>
      </ul>
    </section>

    <!-- Vision collective -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-contrib-vision-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-contrib-vision-title"
          class="lk-doc-section__title"
        >
          Construire une plateforme pour tous
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Notre vision dépasse la préservation linguistique. Lexikongo ambitionne
        de devenir une plateforme où le Kikongo est utilisé pour enseigner,
        communiquer et innover. Grâce à votre soutien, nous pourrons construire
        une base de données dynamique et accessible, tout en inspirant les
        générations futures à embrasser cette langue unique.
      </p>
      <p class="lk-doc-paragraph">
        Rejoignez-nous dans ce voyage fascinant, où chaque contribution
        rapproche le Kikongo d’une place centrale dans le monde numérique.
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
import ContributorButtons from '@/components/ContributorButtons.vue';
import AdminButtons from '@/components/AdminButtons.vue';

const { t } = useI18n();

const primaryCta = computed(() => ({
  to: '/register',
  label: t('docContrib.page.primaryCta'),
  icon: 'fas fa-user-plus',
}));

const secondaryCta = computed(() => ({
  to: '/contribute',
  label: t('docContrib.page.secondaryCta'),
  icon: 'fas fa-hand-holding-heart',
  variant: 'ghost',
}));

const seoTitle =
  t('docContrib.meta.title') ||
  'Rejoignez la communauté – Contributeurs Lexikongo';
const seoDescription =
  t('docContrib.meta.description') ||
  "Devenez contributeur Lexikongo pour enrichir le lexique Kikongo, préserver cette langue unique et participer à un projet culturel et éducatif ambitieux.";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Rejoignez la communauté – Contributeurs de Lexikongo',
  description: seoDescription,
  url: 'https://www.lexikongo.fr/documentation/for-contributors',
  inLanguage: 'fr',
  image: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
  publisher: {
    '@type': 'Organization',
    name: 'Lexikongo',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
      width: 200,
      height: 200,
    },
  },
  mainEntity: {
    '@type': 'CreativeWork',
    headline:
      "Rejoignez Lexikongo – Participez à la préservation et à l’enrichissement du lexique Kikongo",
    text: 'Découvrez comment rejoindre notre communauté de contributeurs et aider à préserver la langue Kikongo. Devenez un acteur clé dans la création d’une ressource linguistique et culturelle inestimable.',
  },
};

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    {
      name: 'keywords',
      content:
        'Lexikongo, contributeurs, langue Kikongo, préservation linguistique, lexique Kikongo, culture africaine, langue africaine, communauté linguistique',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: seoTitle },
    {
      property: 'og:description',
      content:
        'Participez activement à la préservation de la langue Kikongo en rejoignant notre communauté de contributeurs passionnés.',
    },
    {
      property: 'og:image',
      content: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
    },
    {
      property: 'og:url',
      content: 'https://www.lexikongo.fr/documentation/for-contributors',
    },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle },
    {
      name: 'twitter:description',
      content:
        "Découvrez comment contribuer à Lexikongo pour enrichir le lexique Kikongo, préserver cette langue unique et participer à un projet culturel ambitieux.",
    },
    {
      name: 'twitter:image',
      content: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://www.lexikongo.fr/documentation/for-contributors',
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

.lk-doc-list--ordered {
  list-style: decimal;
}

.lk-doc-list--nested {
  list-style: disc;
  margin-top: 0.2rem;
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

/* Bloc côté contributeur */
.lk-contrib-side {
  border-radius: 0.9rem;
  padding: 0.8rem 0.85rem;
  background: var(--color-surface, #f9fafb);
  border: 1px solid rgba(148, 163, 184, 0.45);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.lk-contrib-side__title {
  margin: 0;
  font-size: 0.96rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--color-text, #111827);
}

.lk-contrib-side__title i {
  color: var(--primary, #0d6efd);
}

.lk-contrib-side__text {
  margin: 0;
  font-size: 0.86rem;
  color: var(--color-text-muted, #4b5563);
}

.lk-contrib-side__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

/* CTA bloc "autres contributions" */
.lk-contrib-cta {
  margin-top: 0.5rem;
  border-radius: 0.9rem;
  padding: 0.9rem 0.9rem;
  background: linear-gradient(
    135deg,
    rgba(13, 110, 253, 0.06),
    rgba(56, 189, 248, 0.08)
  );
  border: 1px solid rgba(191, 219, 254, 0.9);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.lk-contrib-cta__title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 600;
  color: #0f172a;
}

.lk-contrib-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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

.lk-btn--ghost {
  background: transparent;
  color: var(--color-text-muted, #4b5563);
  border-color: rgba(148, 163, 184, 0.5);
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

  .lk-contrib-cta__actions {
    flex-direction: column;
  }

  .lk-btn {
    width: 100%;
    justify-content: center;
  }
}
.lk-doc-help {
  margin-top: 1.5rem;
  border-radius: 0.9rem;
  padding: 0.9rem 1rem;
  background: var(--color-surface-elevated, #111827);
  border: 1px solid var(--color-border, rgba(148, 163, 184, 0.5));
}
.lk-contrib-cta__title {
   margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text, #f9fafb);
}
.lk-doc-help__title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text, #f9fafb);
}

.lk-doc-help__text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted, #9ca3af);
}

</style>
