<template>
  <main
    class="lk-page lk-page--doc-devs"
    aria-labelledby="doc-devs-page-title"
  >
    <!-- Hero -->
    <LkPageHero
      id="doc-devs-page-title"
      :eyebrow="t('docDevs.page.eyebrow')"
      :title="t('docDevs.page.title')"
      :description="t('docDevs.page.subtitle')"
      :primary-cta="primaryCta"
      :secondary-cta="secondaryCta"
      :side-aria-label="t('pageHero.sideAria')"
      :show-last-expressions="false"
    >
      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-code-branch" aria-hidden="true"></i>
          <span>{{ t('docDevs.page.metaHighlight') }}</span>
        </p>
      </template>

      <!-- Colonne droite : logo + rappel techno -->
      <template #side>
        <aside class="lk-hero-side">
          <LogoSlogan class="lk-hero__logo" />

          <section
            class="lk-dev-stack"
            aria-label="Stack technique de Lexikongo"
          >
            <h2 class="lk-dev-stack__title">
              <i class="fas fa-layer-group" aria-hidden="true"></i>
              <span>Stack</span>
            </h2>
            <ul class="lk-dev-stack__list">
              <li>Nuxt 4 (SSR, JavaScript)</li>
              <li>MySQL (héritage existant, schéma conservé)</li>
              <li>API Nitro (server/api/*)</li>
              <li>JWT + cookies HttpOnly/Secure</li>
            </ul>
          </section>
        </aside>
      </template>
    </LkPageHero>

    <!-- 1. Objectif & contexte -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-devs-objective-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-devs-objective-title"
          class="lk-doc-section__title"
        >
          Objectif et contexte du projet
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Lexikongo est une application Nuxt (SSR) conçue pour promouvoir et
        préserver la langue Kikongo, avec des fonctionnalités collaboratives
        permettant aux utilisateurs de soumettre, valider et consulter des mots
        et verbes en Kikongo, avec des traductions en français et anglais.
      </p>
      <p class="lk-doc-paragraph">
        L’application est construite pour être évolutive : ajout de nouvelles
        langues, gestion fine des rôles utilisateurs, historisation des
        contributions et intégration potentielle avec des systèmes externes
        (auth centralisée, paiements de soutien, etc.). Le schéma de base de
        données existant est conservé et enrichi pour éviter toute régression.
      </p>
    </section>

    <!-- 2. Architecture DB -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-devs-db-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-devs-db-title"
          class="lk-doc-section__title"
        >
          Architecture de la base de données (MySQL)
        </h2>
        <p class="lk-doc-section__subtitle">
          Vue d’ensemble des principales tables utilisées par Lexikongo.
        </p>
      </header>

      <div class="lk-doc-2col">
        <div class="lk-doc-2col__col">
          <h3 class="lk-doc-subtitle">Utilisateurs & rôles</h3>
          <ul class="lk-doc-list">
            <li>
              <strong>users</strong> : informations compte
              (<code>user_id</code>, <code>username</code>,
              <code>email</code>, <code>password</code> hashé, dates,
              vérification e-mail…).
            </li>
            <li>
              <strong>roles</strong> + éventuelle table de jointure (selon
              version) pour associer les rôles <em>(user, contributor, admin)</em>
              à chaque utilisateur.
            </li>
          </ul>

          <h3 class="lk-doc-subtitle">Mots & verbes validés</h3>
          <ul class="lk-doc-list">
            <li>
              <strong>words</strong> : mots validés (<code>word_id</code>,
              <code>singular</code>, <code>plural</code>,
              <code>class_id</code>, <code>phonetic</code>,
              <code>derived_word</code>, liens vers mots/verbres dérivants,
              <code>is_approved</code>, <code>user_id</code> auteur, etc.).
            </li>
            <li>
              <strong>verbs</strong> : verbes validés (<code>verb_id</code>,
              <code>name</code> (infinitif), <code>root</code>,
              <code>suffix</code>, <code>phonetic</code>,
              <code>active_verb</code>, <code>derived_verb</code>,
              <code>derived_from</code>, <code>derived_verb_type_id</code>,
              <code>is_approved</code>, <code>user_id</code>…).
            </li>
            <li>
              <strong>word_meanings</strong> /
              <strong>verb_meanings</strong> : traductions associées via
              <code>word_id</code> ou <code>verb_id</code> avec
              <code>language_code</code> (fr, en, …) et
              <code>meaning</code>.
            </li>
          </ul>
        </div>

        <div class="lk-doc-2col__col">
          <h3 class="lk-doc-subtitle">Soumissions en attente</h3>
          <ul class="lk-doc-list">
            <li>
              <strong>pending_words_submissions</strong> /
              <strong>pending_verbs_submissions</strong> : données envoyées par
              les contributeurs avant validation (statut, phonétique, classe,
              radical, suffixe…).
            </li>
            <li>
              <strong>pending_words_translations</strong> /
              <strong>pending_verbs_translations</strong> : traductions liées
              aux soumissions via <code>submission_id</code>.
            </li>
            <li>
              <strong>pending_words_slugs</strong> /
              <strong>pending_verbs_slugs</strong> : slugs temporaires générés
              côté pending avant bascule dans les tables finales.
            </li>
          </ul>

          <h3 class="lk-doc-subtitle">Slugs & archivage</h3>
          <ul class="lk-doc-list">
            <li>
              <strong>slugs</strong> : table unifiée pour les slugs
              “publics” avec <code>slug_id</code>, <code>slug</code>
              (unique), <code>word_id</code> ou <code>verb_id</code> et
              <code>content_type</code> (<code>'word'</code> ou
              <code>'verb'</code>).
            </li>
            <li>
              <strong>archived_submitted_words</strong> /
              <strong>archived_submitted_verbs</strong> : archivage des
              soumissions (statut approved/rejected, admin, raison, lien vers
              l’ID final quand approuvé). Utilisé pour garder un historique sur
              une durée limitée.
            </li>
            <li>
              <strong>languages</strong> : langues de traduction
              (<code>language_id</code>, <code>language_code</code>,
              <code>language_name</code>).
            </li>
            <li>
              <strong>nominal_classes</strong> et
              <strong>derived_verb_types</strong> : métadonnées
              linguistiques (classes nominales, types de verbes).
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 3. Rôles & permissions -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-devs-roles-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-devs-roles-title"
          class="lk-doc-section__title"
        >
          Gestion des rôles et permissions
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Lexikongo s’appuie sur des rôles explicites pour contrôler l’accès aux
        fonctionnalités critiques (modération, admin, etc.) :
      </p>

      <ul class="lk-doc-list">
        <li>
          <strong>Utilisateur</strong> (<code>user</code>) :
          accès en lecture seule au dictionnaire public (mots &amp; verbes
          approuvés). Peut gérer son profil.
        </li>
        <li>
          <strong>Contributeur</strong> (<code>contributor</code>) :
          peut soumettre des mots et des verbes. Les données vont dans les
          tables <code>pending_*_submissions</code> et sont visibles côté
          admin pour validation.
        </li>
        <li>
          <strong>Administrateur</strong> (<code>admin</code>) :
          accès à l’espace admin, validation/rejet des soumissions,
          archivage, corrections directes dans les tables principales,
          parfois gestion des utilisateurs.
        </li>
      </ul>

      <p class="lk-doc-paragraph">
        Côté code, les routes Nitro (server/api/*) vérifient le rôle en
        se basant sur le JWT décodé (stocké dans un cookie HttpOnly) et
        appliquent les gardes nécessaires (par ex. autoriser seulement
        <code>admin</code> sur les endpoints de modération).
      </p>
    </section>

    <!-- 4. API & endpoints -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-devs-api-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-devs-api-title"
          class="lk-doc-section__title"
        >
          API et endpoints (Nitro)
        </h2>
        <p class="lk-doc-section__subtitle">
          L’API est organisée par ressource dans <code>server/api/…</code>,
          avec contrôle d’accès via JWT.
        </p>
      </header>

      <div class="lk-doc-2col">
        <div class="lk-doc-2col__col">
          <h3 class="lk-doc-subtitle">Soumission</h3>
          <ul class="lk-doc-list">
            <li>
              <code>POST /api/contributor/submit-word</code> (exemple) :
              soumettre un mot → insertion dans
              <code>pending_words_submissions</code> +
              <code>pending_words_translations</code> +
              <code>pending_words_slugs</code>.
            </li>
            <li>
              <code>POST /api/contributor/submit-verb</code> :
              soumettre un verbe avec <code>name</code>,
              <code>root</code>, <code>suffix</code>,
              <code>phonetic</code>, traductions, etc.
            </li>
          </ul>

          <h3 class="lk-doc-subtitle">Modération</h3>
          <ul class="lk-doc-list">
            <li>
              <code>POST /api/admin/manage-submissions</code> :
              endpoint central pour approuver / rejeter / supprimer
              une soumission. Déclenche :
              <ul>
                <li>création du mot / verbe final ;</li>
                <li>transfert des traductions ;</li>
                <li>création du slug dans <code>slugs</code> ;</li>
                <li>archivage dans <code>archived_submitted_*</code> ;</li>
                <li>suppression des tables pending.</li>
              </ul>
            </li>
          </ul>
        </div>

        <div class="lk-doc-2col__col">
          <h3 class="lk-doc-subtitle">Traductions & slugs</h3>
          <ul class="lk-doc-list">
            <li>
              <code>PUT /api/admin/word/[slug]</code>,
              <code>PUT /api/admin/verb/[slug]</code> :
              mise à jour d’un mot/verbe validé (surface, traductions,
              phonétique…).
            </li>
            <li>
              <code>GET /api/words</code>, <code>GET /api/verbs</code> :
              recherche et listing côté public avec pagination,
              filtres, etc.
            </li>
            <li>
              Génération de slug unifié :
              utilitaires internes pour s’assurer de
              l’unicité dans <code>slugs</code> en fonction de
              <code>content_type</code>.
            </li>
          </ul>

          <h3 class="lk-doc-subtitle">Auth & session</h3>
          <ul class="lk-doc-list">
            <li>
              <code>POST /api/auth/login</code> :
              authentification, génération de JWT et placement
              en cookie HttpOnly/SameSite.
            </li>
            <li>
              <code>GET /api/auth/me</code> :
              renvoie le profil courant + rôles
              à partir du JWT.
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 5. Exemple de flux : validation d'un verbe -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-devs-flow-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-devs-flow-title"
          class="lk-doc-section__title"
        >
          Exemple de flux : validation d’un verbe
        </h2>
        <p class="lk-doc-section__subtitle">
          Simplification du flux appliqué dans l’endpoint d’admin lors d’un
          <em>approve</em>.
        </p>
      </header>

      <pre class="lk-code-block" aria-label="Exemple de pseudo-code de validation de verbe">
<code>async function approvePendingVerb(connection, submission_id, admin_id) {
  // 1. Charger la soumission et ses traductions
  const submission = await fetchPendingVerbWithTranslations(connection, submission_id);

  // 2. Créer le verbe officiel
  const [resVerb] = await connection.execute(`
    INSERT INTO verbs (name, root, suffix, phonetic, active_verb,
                       derived_verb, derived_from, is_approved, user_id,
                       derived_verb_type_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `, [
    submission.name,
    submission.root,
    submission.suffix ?? null,
    submission.phonetic ?? null,
    submission.active_verb ?? 1,
    submission.derived_verb ?? 0,
    submission.derived_from ?? null,
    submission.user_id ?? null,
    submission.derived_verb_type_id ?? null,
  ]);

  const newVerbId = resVerb.insertId;

  // 3. Transférer les traductions vers verb_meanings
  for (const tr of submission.translations) {
    if (!tr.language_code || !tr.meaning) continue;
    await connection.execute(
      'INSERT INTO verb_meanings (verb_id, language_code, meaning) VALUES (?, ?, ?)',
      [newVerbId, tr.language_code, tr.meaning.trim()]
    );
  }

  // 4. Créer le slug définitif dans la table unifiée "slugs"
  const slug = await ensureUniqueSlugForVerb(connection, submission.slug, newVerbId);

  // 5. Archiver la soumission puis nettoyer les tables pending
  await archiveVerb(connection, submission, 'approved', admin_id, newVerbId, null);
  await deletePendingVerb(connection, submission_id);
}</code>
      </pre>

      <p class="lk-doc-paragraph">
        Le principe est identique pour les mots (<code>words</code> /
        <code>word_meanings</code>) avec l’écriture dans
        <code>archived_submitted_words</code>.
      </p>
    </section>

    <!-- 6. Outils de développement & déploiement -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-devs-tools-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-devs-tools-title"
          class="lk-doc-section__title"
        >
          Outils de développement & déploiement
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Lexikongo utilise la toolchain standard Nuxt (Vite). Quelques commandes
        utiles :
      </p>

      <ul class="lk-doc-list">
        <li><code>npm install</code> : installation des dépendances.</li>
        <li><code>npm run dev</code> : serveur de développement local.</li>
        <li><code>npm run build</code> : build de production (SSR).</li>
        <li><code>npm run preview</code> (selon config) : prévisualisation locale du build.</li>
      </ul>

      <p class="lk-doc-paragraph">
        Le déploiement actuel cible un environnement compatible Nuxt SSR (par
        exemple Vercel, avec adaptation du fichier de config). Les scripts de
        migration et d’évolution de schéma MySQL doivent être versionnés et
        appliqués de manière maîtrisée.
      </p>
    </section>

    <!-- 7. Workflow Git & mises à jour -->
    <section
      class="lk-page__section lk-doc-section"
      aria-labelledby="doc-devs-git-title"
    >
      <header class="lk-doc-section__header">
        <h2
          id="doc-devs-git-title"
          class="lk-doc-section__title"
        >
          Workflow Git & mises à jour
        </h2>
      </header>

      <p class="lk-doc-paragraph">
        Pour collaborer proprement sur Lexikongo, un workflow Git classique est
        recommandé :
      </p>

      <ul class="lk-doc-list">
        <li>création de branches de fonctionnalités (<code>feature/*</code>),</li>
        <li>pull requests avec revue de code,</li>
        <li>tests manuels (et automatisés quand disponibles) avant merge,</li>
        <li>journalisation des changements dans un fichier <code>CHANGELOG</code> ou équivalent.</li>
      </ul>

      <p class="lk-doc-paragraph">
        Les modifications sensibles (auth, rôles, migrations DB) doivent être
        testées sur un environnement de pré-production avant la mise en ligne.
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
import LkActionsBar from '@/components/LkActionsBar.vue';

const { t } = useI18n();

const primaryCta = computed(() => ({
  to: '/documentation',
  label: t('docDevs.page.primaryCta'),
  icon: 'fas fa-book-open',
}));

const secondaryCta = computed(() => ({
  to: '/contact',
  label: t('docDevs.page.secondaryCta'),
  icon: 'fas fa-envelope',
  variant: 'ghost',
}));

const seoTitle =
  t('docDevs.meta.title') ||
  'Documentation développeurs – Lexikongo (Nuxt, MySQL, API, rôles)';
const seoDescription =
  t('docDevs.meta.description') ||
  "Guide technique pour contribuer au développement de Lexikongo : architecture Nuxt, schéma MySQL, API Nitro, rôles et flux de validation.";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Documentation pour les développeurs – Lexikongo',
  description: seoDescription,
  inLanguage: 'fr',
  author: {
    '@type': 'Organization',
    name: 'Lexikongo',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Lexikongo',
  },
  url: 'https://www.lexikongo.fr/documentation/for-devs',
};

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    {
      name: 'keywords',
      content:
        'Lexikongo, développeur, Nuxt, MySQL, JWT, API, dictionnaire Kikongo',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    {
      property: 'og:url',
      content: 'https://www.lexikongo.fr/documentation/for-devs',
    },
    { property: 'og:type', content: 'article' },
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

.lk-doc-section__subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted, #6b7280);
}

/* Paragraphes & listes */
.lk-doc-paragraph {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--color-text-muted, #4b5563);
}

.lk-doc-list {
  margin: 0.25rem 0 0;
  padding-left: 1.2rem;
  font-size: 0.9rem;
  color: var(--color-text-muted, #4b5563);
}

.lk-doc-list li {
  margin-bottom: 0.2rem;
}

/* Sous-titres */
.lk-doc-subtitle {
  margin: 0.6rem 0 0.15rem;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--color-text, #111827);
}

/* Deux colonnes */
.lk-doc-2col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.lk-doc-2col__col {
  display: flex;
  flex-direction: column;
}

/* Code block */
.lk-code-block {
  margin: 0.4rem 0 0.5rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.75rem;
  background: #020617;
  color: #e5e7eb;
  font-size: 0.8rem;
  line-height: 1.5;
  overflow-x: auto;
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

/* Bloc stack */
.lk-dev-stack {
  border-radius: 0.9rem;
  padding: 0.7rem 0.75rem;
  background: var(--color-surface, #f9fafb);
  border: 1px solid rgba(148, 163, 184, 0.5);
}

.lk-dev-stack__title {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text, #111827);
}

.lk-dev-stack__title i {
  color: var(--primary, #0d6efd);
}

.lk-dev-stack__list {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.86rem;
  color: var(--color-text-muted, #4b5563);
}

/* Responsive */
@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .lk-doc-section {
    padding-inline: 1rem;
  }

  .lk-doc-2col {
    grid-template-columns: 1fr;
  }
}
</style>
