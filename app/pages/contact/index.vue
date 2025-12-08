<template>
  <main
    class="lk-page lk-page--contact"
    aria-labelledby="contact-page-title"
  >
    <!-- Hero réutilisable -->
    <LkPageHero
      id="contact-page-title"
      :eyebrow="t('contact.page.eyebrow')"
      :title="t('contact.page.title')"
      :description="t('contact.page.subtitle')"
      :side-aria-label="t('pageHero.sideAria')"
    >
      <!-- Boutons d’action principaux -->
      <template #actions>
        <NuxtLink
          to="/faqs"
          class="lk-hero-btn lk-hero-btn--primary"
        >
          <i class="fas fa-question-circle" aria-hidden="true"></i>
          <span>{{ t('contact.page.ctaFaq') }}</span>
        </NuxtLink>

        <NuxtLink
          to="/documentation"
          class="lk-hero-btn lk-hero-btn--ghost"
        >
          <i class="fas fa-book-open" aria-hidden="true"></i>
          <span>{{ t('contact.page.ctaDocs') }}</span>
        </NuxtLink>
      </template>

      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-envelope" aria-hidden="true"></i>
          <span>{{ t('contact.page.meta') }}</span>
        </p>
      </template>

      <!-- Colonne de droite -->
      <template #side>
        <div class="lk-hero-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <!-- Section formulaire de contact -->
    <section
      class="lk-page__section lk-page__section--contact"
      aria-labelledby="contact-form-title"
    >
      <div class="lk-contact-layout">
        <!-- Formulaire -->
        <section
          class="lk-contact-card"
          aria-label="Formulaire de contact Lexikongo"
        >
          <header class="lk-contact-card__header">
            <h2
              id="contact-form-title"
              class="lk-contact-card__title"
            >
              {{ t('contact.form.title') }}
            </h2>
            <p class="lk-contact-card__subtitle">
              {{ t('contact.form.subtitle') }}
            </p>
          </header>

          <form
            class="lk-contact-form"
            @submit.prevent="submitForm"
            novalidate
          >
            <!-- Nom -->
            <div class="lk-field">
              <label
                class="lk-field__label"
                for="contact-name"
              >
                {{ t('contact.form.fields.name.label') }}
              </label>
              <input
                id="contact-name"
                v-model="form.name"
                type="text"
                class="lk-field__input"
                :placeholder="t('contact.form.fields.name.placeholder')"
                autocomplete="name"
                required
              />
            </div>

            <!-- Email -->
            <div class="lk-field">
              <label
                class="lk-field__label"
                for="contact-email"
              >
                {{ t('contact.form.fields.email.label') }}
              </label>
              <input
                id="contact-email"
                v-model="form.email"
                type="email"
                class="lk-field__input"
                :placeholder="t('contact.form.fields.email.placeholder')"
                autocomplete="email"
                required
              />
            </div>

            <!-- Message -->
            <div class="lk-field">
              <label
                class="lk-field__label"
                for="contact-message"
              >
                {{ t('contact.form.fields.message.label') }}
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                class="lk-field__textarea"
                rows="5"
                :placeholder="t('contact.form.fields.message.placeholder')"
                required
              ></textarea>
            </div>

            <!-- Info / Erreur -->
            <p
              v-if="errorMessage"
              class="lk-contact-form__error"
              role="alert"
            >
              {{ errorMessage }}
            </p>

            <!-- Bouton -->
            <div class="lk-contact-form__actions">
              <button
                type="submit"
                class="lk-contact-submit-btn"
                :disabled="submitting"
              >
                <span v-if="!submitting">
                  <i class="fas fa-paper-plane" aria-hidden="true"></i>
                  {{ t('contact.form.actions.submit') }}
                </span>
                <span v-else>
                  <i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i>
                  {{ t('contact.form.actions.submitting') }}
                </span>
              </button>
            </div>
          </form>
        </section>

        <!-- Colonne droite : pourquoi nous contacter -->
        <aside
          class="lk-contact-aside"
          aria-labelledby="contact-why-title"
        >
          <h2
            id="contact-why-title"
            class="lk-contact-aside__title"
          >
            {{ t('contact.why.title') }}
          </h2>
          <p class="lk-contact-aside__text">
            {{ t('contact.why.p1') }}
          </p>
          <p class="lk-contact-aside__text">
            {{ t('contact.why.p2') }}
          </p>

          <figure class="lk-contact-aside__figure">
            <img
              src="/images/life-flower.png"
              alt="Motif traditionnel Kongo"
              class="lk-contact-aside__image"
              loading="lazy"
            />
            <figcaption class="lk-contact-aside__caption">
              {{ t('contact.why.caption') }}
            </figcaption>
          </figure>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useSeoMeta, useHead } from '#imports';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';

const { t } = useI18n();
const toast = useToast();

const form = ref({
  name: '',
  email: '',
  message: '',
});

const submitting = ref(false);
const errorMessage = ref('');

// --- SEO ultra complet ---
const seoTitle = 'Contactez-nous – Lexikongo | Dictionnaire Kikongo · Français · Anglais';
const seoDescription =
  "Contactez l’équipe Lexikongo pour toute question, suggestion, partenariat ou demande d’assistance. Contribuez à la préservation et à la valorisation de la langue Kikongo.";

// Métas classiques / OpenGraph / Twitter
useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogUrl: 'https://www.lexikongo.fr/contact',
  ogSiteName: 'Lexikongo',
  ogImage: 'https://www.lexikongo.fr/images/lexikongo_logo@2x.png',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: 'https://www.lexikongo.fr/images/lexikongo_logo@2x.png',
});

// JSON-LD + canonical
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact – Lexikongo',
  description:
    "Page de contact pour poser des questions, envoyer des suggestions ou établir des partenariats avec l’équipe Lexikongo, dictionnaire trilingue Kikongo – Français – Anglais.",
  url: 'https://www.lexikongo.fr/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'Lexikongo',
    url: 'https://www.lexikongo.fr',
    sameAs: [
      'https://www.facebook.com/lexikongo',
      'https://www.instagram.com/lexikongo',
    ],
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.lexikongo.fr/images/lexikongo_logo@2x.png',
      width: 200,
      height: 200,
    },
  },
  potentialAction: {
    '@type': 'CommunicateAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.lexikongo.fr/contact',
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
  },
};

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://www.lexikongo.fr/contact',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(jsonLd),
    },
  ],
});

// --- Soumission du formulaire ---
const submitForm = async () => {
  errorMessage.value = '';

  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.message.trim()) {
    errorMessage.value = t('contact.form.errors.required');
    return;
  }

  submitting.value = true;

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form.value,
    });

    toast.success(t('contact.form.success'));
    form.value = { name: '', email: '', message: '' };
  } catch (err) {
    console.error('Erreur contact :', err);
    errorMessage.value = t('contact.form.errors.generic');
    toast.error(t('contact.form.errors.generic'));
  } finally {
    submitting.value = false;
  }
};
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

/* Section générique */
.lk-page__section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

/* Boutons du hero */
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
  background: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
  border-color: rgba(148, 163, 184, 0.7);
}

.lk-hero-btn--ghost:hover,
.lk-hero-btn--ghost:focus-visible {
  border-color: #0d6efd;
  color: #0d6efd;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

.lk-hero-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Layout contact : 1 colonne mobile, 2 colonnes desktop */
.lk-contact-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 900px) {
  .lk-contact-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(260px, 1fr);
    align-items: flex-start;
    gap: 1.75rem;
  }
}

/* Carte formulaire */
.lk-contact-card {
  border-radius: 1rem;
  padding: 1.2rem 1.25rem 1.4rem;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.lk-contact-card__header {
  margin-bottom: 0.9rem;
}

.lk-contact-card__title {
  margin: 0 0 0.25rem;
  font-size: 1.2rem;
  font-weight: 650;
  color: var(--text-default, #0f172a);
}

.lk-contact-card__subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-muted, #6b7280);
}

/* Formulaire */
.lk-contact-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.lk-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.lk-field__label {
  font-size: 0.86rem;
  font-weight: 500;
  color: var(--text-muted, #4b5563);
}

.lk-field__input,
.lk-field__textarea {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.8));
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  color: var(--text-default, #0f172a);
  background: var(--surface-default, #ffffff);
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease;
}

.lk-field__input:focus-visible,
.lk-field__textarea:focus-visible {
  border-color: var(--primary, #0d6efd);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25);
}

.lk-field__textarea {
  resize: vertical;
  min-height: 140px;
}

/* Messages d’erreur */
.lk-contact-form__error {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #b91c1c;
}

/* Actions */
.lk-contact-form__actions {
  margin-top: 0.4rem;
  display: flex;
  justify-content: flex-end;
}

.lk-contact-submit-btn {
  border-radius: 999px;
  padding: 0.5rem 1.3rem;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  background: #0d6efd;
  color: #ffffff;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease;
}

.lk-contact-submit-btn:hover:not(:disabled),
.lk-contact-submit-btn:focus-visible:not(:disabled) {
  background: #0b5ed7;
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.35);
}

.lk-contact-submit-btn:disabled {
  opacity: 0.7;
  cursor: default;
  box-shadow: none;
  transform: none;
}

/* Aside */
.lk-contact-aside {
  border-radius: 1rem;
  padding: 1rem 1.1rem;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.92),
    rgba(30, 64, 175, 0.9)
  );
  border: 1px solid rgba(191, 219, 254, 0.5);
  color: #e5e7eb;
}

.lk-contact-aside__title {
  margin: 0 0 0.4rem;
  font-size: 1.02rem;
  font-weight: 600;
}

.lk-contact-aside__text {
  margin: 0 0 0.4rem;
  font-size: 0.9rem;
}

.lk-contact-aside__figure {
  margin: 0.8rem 0 0;
  text-align: center;
}

.lk-contact-aside__image {
  width: 130px;
  max-width: 100%;
  height: auto;
}

.lk-contact-aside__caption {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  opacity: 0.85;
}

/* Responsive */
@media (max-width: 768px) {
  .lk-page {
    padding-inline: 1rem;
  }

  .lk-contact-card {
    padding-inline: 1rem;
  }
}
</style>
