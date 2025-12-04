<template>
  <main
    class="lk-page lk-page--faq"
    aria-labelledby="faq-page-title"
  >
    <!-- Hero -->
    <LkPageHero
      id="faq-page-title"
      :eyebrow="t('faq.page.eyebrow')"
      :title="t('faq.page.title')"
      :description="t('faq.page.subtitle')"
      :primary-cta="primaryCta"
      :secondary-cta="secondaryCta"
      :side-aria-label="t('pageHero.sideAria')"
    >
      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-question-circle" aria-hidden="true"></i>
          <span>{{ t('faq.page.meta') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : actions rapides -->
      <template #side>
        <div class="lk-hero-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <!-- Sections FAQ -->
    <section
      v-for="section in faqSections"
      :key="section.id"
      class="lk-page__section lk-faq-section"
      :aria-labelledby="`faq-section-${section.id}`"
    >
      <header class="lk-faq-section__header">
        <div class="lk-faq-section__icon" aria-hidden="true">
          <i :class="section.icon"></i>
        </div>
        <div class="lk-faq-section__titles">
          <h2
            :id="`faq-section-${section.id}`"
            class="lk-faq-section__title"
          >
            {{ section.title }}
          </h2>
          <p
            v-if="section.description"
            class="lk-faq-section__subtitle"
          >
            {{ section.description }}
          </p>
        </div>
      </header>

      <ul class="lk-faq-section__list">
        <li
          v-for="item in section.items"
          :key="item.id"
          class="lk-faq-item"
        >
          <details
            class="lk-faq-item__details"
            :open="item.defaultOpen || false"
          >
            <summary class="lk-faq-item__summary">
              <span class="lk-faq-item__question">
                {{ item.question }}
              </span>
              <span class="lk-faq-item__chevron" aria-hidden="true">
                <i class="fas fa-chevron-down"></i>
              </span>
            </summary>

            <div class="lk-faq-item__answer">
              <!-- Réponse simple en paragraphe -->
              <p v-if="!item.type || item.type === 'text'">
                {{ item.answer }}
              </p>

              <!-- Réponse en liste à puces (optionnel) -->
              <ul
                v-else-if="item.type === 'list'"
                class="lk-faq-item__answer-list"
              >
                <li
                  v-for="(line, idx) in item.answerList"
                  :key="idx"
                >
                  {{ line }}
                </li>
              </ul>
            </div>
          </details>
        </li>
      </ul>
    </section>

    <!-- Appel à contribution final -->
    <section
      class="lk-page__section lk-faq-section lk-faq-section--cta"
      aria-labelledby="faq-contribute-title"
    >
      <div class="lk-cta lk-cta--faq">
        <div class="lk-cta__text">
          <h2
            id="faq-contribute-title"
            class="lk-cta__title"
          >
            {{ t('faq.cta.title') }}
          </h2>
          <p class="lk-cta__subtitle">
            {{ t('faq.cta.subtitle') }}
          </p>
        </div>

        <div class="lk-cta__actions">
          <NuxtLink
            to="/register"
            class="lk-cta-btn lk-cta-btn--primary"
          >
            <i class="fas fa-user-plus" aria-hidden="true"></i>
            <span>{{ t('faq.cta.primary') }}</span>
          </NuxtLink>

          <NuxtLink
            to="/contributor"
            class="lk-cta-btn lk-cta-btn--ghost"
          >
            <i class="fas fa-hands-helping" aria-hidden="true"></i>
            <span>{{ t('faq.cta.secondary') }}</span>
          </NuxtLink>
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
import LkActionsBar from '@/components/LkActionsBar.vue';

const { t } = useI18n();

/**
 * CTA du hero (réutilisation du pattern que tu as sur /words /verbs /expressions)
 */
const primaryCta = computed(() => ({
  to: '/search',
  label: t('faq.page.primaryCta'),
  icon: 'fas fa-search',
}));

const secondaryCta = computed(() => ({
  to: '/contributor',
  label: t('faq.page.secondaryCta'),
  icon: 'fas fa-hands-helping',
  variant: 'ghost',
}));

/**
 * Sections FAQ : on laisse toute la donnée en JS,
 * les textes viennent de l’i18n.
 */
const faqSections = computed(() => [
  {
    id: 'general',
    icon: 'fas fa-language',
    title: t('faq.sections.general.title'),
    description: t('faq.sections.general.description'),
    items: [
      {
        id: 'what-is-lexikongo',
        question: t('faq.sections.general.items.whatIsLexikongo.q'),
        answer: t('faq.sections.general.items.whatIsLexikongo.a'),
        defaultOpen: true,
      },
      {
        id: 'which-languages',
        question: t('faq.sections.general.items.whichLanguages.q'),
        answer: t('faq.sections.general.items.whichLanguages.a'),
      },
      {
        id: 'who-is-it-for',
        question: t('faq.sections.general.items.whoIsItFor.q'),
        answer: t('faq.sections.general.items.whoIsItFor.a'),
      },
      {
        id: 'is-it-free',
        question: t('faq.sections.general.items.isItFree.q'),
        answer: t('faq.sections.general.items.isItFree.a'),
      },
    ],
  },
  {
    id: 'accounts',
    icon: 'fas fa-user-friends',
    title: t('faq.sections.accounts.title'),
    description: t('faq.sections.accounts.description'),
    items: [
      {
        id: 'roles',
        question: t('faq.sections.accounts.items.roles.q'),
        type: 'list',
        answerList: [
          t('faq.sections.accounts.items.roles.a.user'),
          t('faq.sections.accounts.items.roles.a.contributor'),
          t('faq.sections.accounts.items.roles.a.admin'),
        ],
      },
      {
        id: 'need-account',
        question: t('faq.sections.accounts.items.needAccount.q'),
        answer: t('faq.sections.accounts.items.needAccount.a'),
      },
      {
        id: 'become-contributor',
        question: t('faq.sections.accounts.items.becomeContributor.q'),
        answer: t('faq.sections.accounts.items.becomeContributor.a'),
      },
      {
        id: 'email-verification',
        question: t('faq.sections.accounts.items.emailVerification.q'),
        answer: t('faq.sections.accounts.items.emailVerification.a'),
      },
    ],
  },
  {
    id: 'contributions',
    icon: 'fas fa-pencil-alt',
    title: t('faq.sections.contributions.title'),
    description: t('faq.sections.contributions.description'),
    items: [
      {
        id: 'what-can-i-submit',
        question: t('faq.sections.contributions.items.whatCanISubmit.q'),
        type: 'list',
        answerList: [
          t('faq.sections.contributions.items.whatCanISubmit.a.words'),
          t('faq.sections.contributions.items.whatCanISubmit.a.verbs'),
        ],
      },
      {
        id: 'word-details',
        question: t('faq.sections.contributions.items.wordDetails.q'),
        answer: t('faq.sections.contributions.items.wordDetails.a'),
      },
      {
        id: 'verb-details',
        question: t('faq.sections.contributions.items.verbDetails.q'),
        answer: t('faq.sections.contributions.items.verbDetails.a'),
      },
      {
        id: 'difference-admin-contributor',
        question: t('faq.sections.contributions.items.differenceAdminContributor.q'),
        answer: t('faq.sections.contributions.items.differenceAdminContributor.a'),
      },
    ],
  },
  {
    id: 'moderation',
    icon: 'fas fa-check-circle',
    title: t('faq.sections.moderation.title'),
    description: t('faq.sections.moderation.description'),
    items: [
      {
        id: 'statuses',
        question: t('faq.sections.moderation.items.statuses.q'),
        type: 'list',
        answerList: [
          t('faq.sections.moderation.items.statuses.a.pending'),
          t('faq.sections.moderation.items.statuses.a.approved'),
          t('faq.sections.moderation.items.statuses.a.rejected'),
        ],
      },
      {
        id: 'how-long',
        question: t('faq.sections.moderation.items.howLong.q'),
        answer: t('faq.sections.moderation.items.howLong.a'),
      },
      {
        id: 'edit-submission',
        question: t('faq.sections.moderation.items.editSubmission.q'),
        answer: t('faq.sections.moderation.items.editSubmission.a'),
      },
      {
        id: 'archiving',
        question: t('faq.sections.moderation.items.archiving.q'),
        answer: t('faq.sections.moderation.items.archiving.a'),
      },
    ],
  },
  {
    id: 'privacy',
    icon: 'fas fa-shield-alt',
    title: t('faq.sections.privacy.title'),
    description: t('faq.sections.privacy.description'),
    items: [
      {
        id: 'what-data',
        question: t('faq.sections.privacy.items.whatData.q'),
        answer: t('faq.sections.privacy.items.whatData.a'),
      },
      {
        id: 'passwords',
        question: t('faq.sections.privacy.items.passwords.q'),
        answer: t('faq.sections.privacy.items.passwords.a'),
      },
      {
        id: 'cookies',
        question: t('faq.sections.privacy.items.cookies.q'),
        answer: t('faq.sections.privacy.items.cookies.a'),
      },
      {
        id: 'privacy-page',
        question: t('faq.sections.privacy.items.privacyPage.q'),
        answer: t('faq.sections.privacy.items.privacyPage.a'),
      },
    ],
  },
  {
    id: 'future',
    icon: 'fas fa-rocket',
    title: t('faq.sections.future.title'),
    description: t('faq.sections.future.description'),
    items: [
      {
        id: 'new-languages',
        question: t('faq.sections.future.items.newLanguages.q'),
        answer: t('faq.sections.future.items.newLanguages.a'),
      },
      {
        id: 'notifications',
        question: t('faq.sections.future.items.notifications.q'),
        answer: t('faq.sections.future.items.notifications.a'),
      },
      {
        id: 'stats-and-tools',
        question: t('faq.sections.future.items.statsAndTools.q'),
        answer: t('faq.sections.future.items.statsAndTools.a'),
      },
    ],
  },
]);

// SEO
const seoTitle = computed(
  () =>
    t('faq.meta.title') ||
    'FAQ Lexikongo – Questions fréquentes sur le dictionnaire Kikongo'
);

const seoDescription = computed(
  () =>
    t('faq.meta.description') ||
    "Questions fréquentes sur Lexikongo : comptes, rôles, soumissions de mots et de verbes, modération et confidentialité."
);

useHead({
  title: seoTitle.value,
  meta: [
    { name: 'description', content: seoDescription.value },
    {
      name: 'keywords',
      content:
        'Lexikongo, FAQ, aide, Kikongo, dictionnaire, contributeur, admin, soumissions, mots, verbes, langue africaine',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: seoTitle.value },
    { property: 'og:description', content: seoDescription.value },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.lexikongo.fr/faqs' },
    {
      property: 'og:image',
      content: 'https://www.lexikongo.fr/images/text_logo@1x.webp',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://www.lexikongo.fr/faqs',
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

.lk-page__section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Meta hero */
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

/* Section FAQ */
.lk-faq-section {
  border-radius: 1rem;
  padding: 1.1rem 1.1rem 1.2rem;
  background: var(--color-surface, #ffffff);
  box-shadow: var(--shadow-sm, 0 10px 24px rgba(15, 23, 42, 0.06));
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.lk-faq-section--cta {
  background: linear-gradient(
    135deg,
    rgba(13, 110, 253, 0.06),
    rgba(56, 189, 248, 0.09)
  );
}

/* Header de section */
.lk-faq-section__header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.lk-faq-section__icon {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(13, 110, 253, 0.12);
  color: var(--primary, #0d6efd);
  flex-shrink: 0;
}

.lk-faq-section__icon i {
  font-size: 1.1rem;
}

.lk-faq-section__titles {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.lk-faq-section__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text, #0f172a);
}

.lk-faq-section__subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-muted, #6b7280);
}

/* Liste de questions */
.lk-faq-section__list {
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.lk-faq-item__details {
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: var(--color-surface-elevated, #f9fafb);
  overflow: hidden;
}

/* Summary / question */
.lk-faq-item__summary {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text, #111827);
}

.lk-faq-item__summary::-webkit-details-marker {
  display: none;
}

.lk-faq-item__question {
  flex: 1 1 auto;
}

.lk-faq-item__chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.16s ease;
  font-size: 0.8rem;
}

/* Rotation chevron quand ouvert */
.lk-faq-item__details[open] .lk-faq-item__chevron {
  transform: rotate(180deg);
}

/* Réponse */
.lk-faq-item__answer {
  padding: 0 0.85rem 0.7rem;
  font-size: 0.9rem;
  color: var(--color-muted, #4b5563);
}

.lk-faq-item__answer p {
  margin: 0.1rem 0 0;
}

/* Liste dans les réponses */
.lk-faq-item__answer-list {
  margin: 0.1rem 0 0;
  padding-left: 1.1rem;
}

.lk-faq-item__answer-list li {
  margin-bottom: 0.15rem;
}

/* CTA final */
.lk-cta {
  border-radius: 1rem;
  padding: 1rem 1.1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  border: 1px solid rgba(191, 219, 254, 0.9);
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

.lk-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease,
    border-color 0.15s ease;
}

.lk-cta-btn--primary {
  background: var(--primary, #0d6efd);
  color: #fff;
}

.lk-cta-btn--ghost {
  background: rgba(255, 255, 255, 0.2);
  color: var(--primary, #0d6efd);
  border-color: rgba(59, 130, 246, 0.3);
}

.lk-cta-btn:hover,
.lk-cta-btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
}

/* Responsive */
@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .lk-faq-section {
    padding-inline: 0.9rem;
  }

  .lk-cta {
    flex-direction: column;
    align-items: flex-start;
  }

  .lk-cta-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
