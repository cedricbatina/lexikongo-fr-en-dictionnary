<!-- pages/contribute.vue -->
<template>
  <main
    class="lk-page lk-page--contribute"
    aria-labelledby="contribute-page-title"
  >
    <!-- Hero réutilisable -->
    <LkPageHero
      id="contribute-page-title"
      :eyebrow="t('contribute.page.eyebrow')"
      :title="t('contribute.page.title')"
      :description="t('contribute.page.subtitle')"
      :side-aria-label="t('pageHero.sideAria')"
    >
      <!-- Meta sous le hero -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-donate" aria-hidden="true"></i>
          <span>{{ t('contribute.page.meta') }}</span>
        </p>
      </template>

      <!-- Colonne de droite : raccourcis / actions -->
      <template #side>
        <div class="lk-hero-side">
          <LkActionsBar class="lk-hero__quick-actions" />
        </div>
      </template>
    </LkPageHero>

    <!-- 1️⃣ Bloc paiement en ligne -->
    <section
      class="lk-page__section lk-page__section--payments"
      aria-labelledby="contribute-payments-title"
    >
      <header class="section-header">
        <h2
          id="contribute-payments-title"
          class="section-header__title"
        >
          {{ t('contribute.payments.title') }}
        </h2>
        <p class="section-header__subtitle">
          {{ t('contribute.payments.subtitle') }}
        </p>
      </header>

      <div class="support-card">
        <PaymentForm />
      </div>
    </section>

    <!-- 2️⃣ Bloc virement bancaire -->
    <section
      class="lk-page__section lk-page__section--bank"
      aria-labelledby="contribute-bank-title"
    >
      <header class="section-header section-header--center">
        <h2
          id="contribute-bank-title"
          class="section-header__title"
        >
          {{ t('contribute.bank.title') }}
        </h2>
        <p class="section-header__subtitle">
          {{ t('contribute.bank.subtitle') }}
        </p>
      </header>

      <div class="bank-card">
        <BankTransfer />
      </div>
    </section>

    <!-- 3️⃣ Autres façons de soutenir -->
    <section
      class="lk-page__section lk-page__section--other"
      aria-labelledby="contribute-other-title"
    >
      <header class="section-header section-header--center">
        <h2
          id="contribute-other-title"
          class="section-header__title"
        >
          {{ t('contribute.other.title') }}
        </h2>
        <p class="section-header__subtitle">
          {{ t('contribute.other.subtitle') }}
        </p>
      </header>

           <div class="contribute-other__grid">
        <!-- Bloc contact -->
        <article class="contribute-card">
          <h3 class="contribute-card__title">
            {{ t('contribute.other.blocks.contact.title') }}
          </h3>
          <p class="contribute-card__text">
            {{ t('contribute.other.blocks.contact.text') }}
          </p>
          <NuxtLink
            to="/contact"
            class="contribute-card__cta"
            :aria-label="t('contribute.other.blocks.contact.aria')"
          >
            <i class="fas fa-envelope" aria-hidden="true"></i>
            <span>{{ t('contribute.other.blocks.contact.cta') }}</span>
          </NuxtLink>
        </article>

        <!-- Bloc partage -->
        <article class="contribute-card">
          <h3 class="contribute-card__title">
            {{ t('contribute.other.blocks.share.title') }}
          </h3>
          <p class="contribute-card__text">
            {{ t('contribute.other.blocks.share.text') }}
          </p>

          <div class="contribute-share">
            <a
              :href="shareFacebook"
              target="_blank"
              rel="noopener noreferrer"
              class="contribute-share__btn contribute-share__btn--facebook"
              aria-label="Partager Lexikongo sur Facebook"
            >
              <i class="fab fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a
              :href="shareTwitter"
              target="_blank"
              rel="noopener noreferrer"
              class="contribute-share__btn contribute-share__btn--twitter"
              aria-label="Partager Lexikongo sur X (Twitter)"
            >
              <i class="fab fa-twitter" aria-hidden="true"></i>
            </a>
            <a
              :href="shareLinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              class="contribute-share__btn contribute-share__btn--linkedin"
              aria-label="Partager Lexikongo sur LinkedIn"
            >
              <i class="fab fa-linkedin-in" aria-hidden="true"></i>
            </a>
          </div>
        </article>

        <!-- Bloc rejoindre les contributeurs -->
        <article class="contribute-card">
          <h3 class="contribute-card__title">
            {{ t('contribute.other.blocks.contributors.title') }}
          </h3>
          <p class="contribute-card__text">
            {{ t('contribute.other.blocks.contributors.text') }}
          </p>
          <NuxtLink
            to="/register"
            class="contribute-card__cta"
            :aria-label="t('contribute.other.blocks.contributors.aria')"
          >
            <i class="fas fa-users" aria-hidden="true"></i>
            <span>{{ t('contribute.other.blocks.contributors.cta') }}</span>
          </NuxtLink>
        </article>
      </div>

    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useRuntimeConfig, useSeoMeta, useHead } from '#imports';
import { useI18n } from 'vue-i18n';

import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import PaymentForm from '@/components/PaymentForm.vue';
import BankTransfer from '@/components/BankTransfer.vue';

const { t } = useI18n();
const config = useRuntimeConfig();

const siteUrl = config.public.siteUrl || 'https://www.lexikongo.fr';
const pageUrl = `${siteUrl}/contribute`;

// ⚡ SEO puissant
const seoTitle = t('contribute.meta.title') || 'Soutenez Lexikongo | Contributions';
const seoDescription =
  t('contribute.meta.description') ||
  "Apportez votre soutien à Lexikongo pour préserver et valoriser la langue Kikongo (dictionnaire Kikongo – Français/Anglais & phonétique).";

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogUrl: pageUrl,
  ogSiteName: config.public.siteName || 'Lexikongo',
  ogImage: `${siteUrl}/images/contribute-banner.webp`,
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: `${siteUrl}/images/contribute-banner.webp`,
});

// 🔗 Liens de partage dynamiques
const encodedUrl = encodeURIComponent(pageUrl);
const encodedTitle = encodeURIComponent(
  'Lexikongo — Dictionnaire Kikongo · FR/EN & phonétique'
);

const shareFacebook = computed(
  () => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
);
const shareTwitter = computed(
  () =>
    `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
);
const shareLinkedIn = computed(
  () =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
);

// Script PayPal / Google Pay (optionnels)
const paypalClientId = config.public.paypalClientId;

useHead({
  link: [
    {
      rel: 'canonical',
      href: pageUrl,
    },
  ],
  script: [
    {
      src: 'https://pay.google.com/gp/p/js/pay.js',
      async: true,
    },
    ...(paypalClientId
      ? [
          {
            src: `https://www.paypal.com/sdk/js?client-id=${paypalClientId}`,
            async: true,
          },
        ]
      : []),
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: seoTitle,
        description: seoDescription,
        url: pageUrl,
        image: `${siteUrl}/images/contribute-banner.webp`,
        inLanguage: 'fr',
        publisher: {
          '@type': 'Organization',
          name: config.public.siteName || 'Lexikongo',
          url: siteUrl,
        },
      }),
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
  gap: 1.25rem;
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

.lk-hero-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Headers de section */
.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.section-header--center {
  text-align: center;
  align-items: center;
}

.section-header__title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 650;
  color: var(--text-default);
}

.section-header__subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-muted);
  max-width: 44rem;
}

/* Carte de support (paiement) */
.support-card {
  max-width: 640px;
  width: 100%;
  border-radius: 1rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.5));
  background: var(--surface-elevated, #020617);
  padding: 1.2rem 1.4rem;
  margin: 0 auto;
}

/* Carte virement */
.bank-card {
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  padding: 1.2rem 1.4rem;
  border-radius: 1rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.5));
  background: radial-gradient(circle at 0 0, rgba(37, 99, 235, 0.08), transparent),
    var(--surface-elevated, #020617);
}

/* Section “autres façons de soutenir” */
.contribute-other__grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .contribute-other__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.contribute-card {
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: var(--surface-elevated, #020617);
  padding: 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.contribute-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-default);
}

.contribute-card__text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* CTA contact */
.contribute-card__cta {
  margin-top: 0.4rem;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  text-decoration: none;
  font-size: 0.9rem;
  background: var(--surface-default);
  color: var(--primary);
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease;
}

.contribute-card__cta:hover {
  background: rgba(37, 99, 235, 0.08);
  border-color: var(--primary);
  transform: translateY(-1px);
}

/* Boutons de partage */
.contribute-share {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.contribute-share__btn {
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border: none;
  text-decoration: none;
  font-size: 1.05rem;
  transition:
    transform 0.08s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
}

.contribute-share__btn--facebook {
  background: #1877f2;
}

.contribute-share__btn--twitter {
  background: #1da1f2;
}

.contribute-share__btn--linkedin {
  background: #0a66c2;
}

.contribute-share__btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.35);
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .support-card,
  .bank-card {
    padding: 1rem 1.05rem;
  }
}
</style>
