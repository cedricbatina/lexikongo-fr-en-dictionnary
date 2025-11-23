<template>
  <main class="home-page" aria-labelledby="home-title">
    <section class="home-hero" aria-label="Présentation de Lexikongo">
      <!-- Colonne principale -->
      <div class="home-hero__content">
        <h1 id="home-title" class="home-hero__title">
          <span class="home-hero__brand">Lexikongo</span>
          <span class="home-hero__badge">
            {{ t('home.hero.badge') }}
          </span>
        </h1>

        <p class="home-hero__subtitle">
          {{ t('home.hero.subtitle') }}
        </p>

        <div class="home-hero__actions">
          <NuxtLink
            to="/words"
            class="home-btn home-btn--solid"
            aria-label="Explorer les mots du dictionnaire"
          >
            <i class="fas fa-spell-check" aria-hidden="true"></i>
            <span>{{ t('home.hero.ctaWords') }}</span>
          </NuxtLink>

          <NuxtLink
            to="/verbs"
            class="home-btn home-btn--ghost"
            aria-label="Découvrir les verbes en Kikongo"
          >
            <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true"></i>
            <span>{{ t('home.hero.ctaVerbs') }}</span>
          </NuxtLink>
        </div>

        <div class="home-hero__meta">
          <p class="home-hero__hint">
            {{ t('home.hero.hintPrefix') }}
            <NuxtLink to="/expressions" class="home-link">
              {{ t('home.hero.hintExpressions') }}
            </NuxtLink>
            {{ t('home.hero.hintSeparator') }}
            <NuxtLink to="/documentation/for-contributors" class="home-link">
              {{ t('home.hero.hintDoc') }}
            </NuxtLink>.
          </p>
        </div>
      </div>

      <!-- Colonne de droite : cartes d’accès rapide -->
      <aside class="home-hero__side" aria-label="Accès rapide">
        <section class="home-card" aria-labelledby="home-contrib-title">
          <h2 id="home-contrib-title" class="home-card__title">
            {{ t('home.cards.contribute.title') }}
          </h2>
          <p class="home-card__text">
            {{ t('home.cards.contribute.body') }}
          </p>
          <NuxtLink
            to="/documentation/for-contributors"
            class="home-card__link"
          >
            <span>{{ t('home.cards.contribute.link') }}</span>
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </NuxtLink>
        </section>

        <section class="home-card home-card--muted" aria-labelledby="home-login-title">
          <h2 id="home-login-title" class="home-card__title">
            {{ t('home.cards.login.title') }}
          </h2>
          <p class="home-card__text">
            {{ t('home.cards.login.body') }}
          </p>
          <NuxtLink
            to="/login"
            class="home-card__link"
          >
            <span>{{ t('home.cards.login.link') }}</span>
            <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
          </NuxtLink>
        </section>
      </aside>
    </section>
  </main>
</template>


<script setup>
import { useSeoMeta } from '#imports';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// SEO réactif à la langue
useSeoMeta({
  title: () => t('home.seo.title'),
  description: () => t('home.seo.description'),
  ogTitle: () => t('home.seo.ogTitle'),
  ogDescription: () => t('home.seo.ogDescription'),
  ogType: 'website',
  ogSiteName: 'Lexikongo',
  // ajuste l’URL si besoin
  ogUrl: 'https://lexikongo.fr/',
  twitterCard: 'summary_large_image',
});
</script>

<style scoped>
.home-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.75rem 1.25rem 2.5rem;
}

/* HERO */
.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr);
  gap: 1.75rem;
  align-items: flex-start;
}

.home-hero__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.home-hero__title {
  font-size: clamp(2rem, 4vw, 2.6rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
}

.home-hero__brand {
  color: var(--color-text);
}

.home-hero__badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(13, 110, 253, 0.08);
  color: var(--primary);
}

.home-hero__subtitle {
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--color-muted);
  max-width: 36rem;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.2rem;
}

/* Boutons */
.home-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.12s ease,
    border-color 0.15s ease;
}

.home-btn--solid {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 14px 30px rgba(13, 110, 253, 0.35);
}

.home-btn--ghost {
  background: var(--surface-elevated);
  color: var(--color-text);
  border-color: var(--border-subtle);
}

.home-btn:hover,
.home-btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.14);
}

.home-btn--solid:hover,
.home-btn--solid:focus-visible {
  background: var(--primary-hover);
}

.home-btn--ghost:hover,
.home-btn--ghost:focus-visible {
  background: rgba(148, 163, 184, 0.18);
}

/* Lien texte */
.home-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.home-link:hover,
.home-link:focus-visible {
  text-decoration: underline;
}

/* Meta */
.home-hero__meta {
  margin-top: 0.6rem;
}

.home-hero__hint {
  font-size: 0.9rem;
  color: var(--color-muted);
}

/* Colonne de droite (side cards) */
.home-hero__side {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.home-card {
  border-radius: 1.1rem;
  padding: 1rem 1.1rem;
  background: var(--surface-elevated);
  border: 1px solid var(--border-subtle);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

/* ✅ plus de gradient agressif ; on reste sur un fond lisible dans les deux thèmes */
.home-card--muted {
  background: var(--surface-default);
  border-style: dashed;
  border-color: rgba(148, 163, 184, 0.8);
}

.home-card__title {
  font-size: 0.98rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: var(--color-text);
}

.home-card__text {
  font-size: 0.9rem;
  color: var(--color-muted);
  margin-bottom: 0.6rem;
}

.home-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  color: var(--primary);
}

.home-card__link i {
  font-size: 0.8rem;
}

/* Responsive */
@media (min-width: 768px) {
  .home-hero {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1.3fr);
  }
}

@media (max-width: 639px) {
  .home-page {
    padding-top: 1.25rem;
  }
}
</style>
