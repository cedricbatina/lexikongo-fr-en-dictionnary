<template>
  <main class="home-page" aria-labelledby="home-title">
    <section class="home-hero">
      <div class="home-hero__content">
        <h1 id="home-title" class="home-hero__title">
          Lexikongo
          <span class="home-hero__badge">Nuxt 4 · SSR</span>
        </h1>
        <p class="home-hero__subtitle">
          Dictionnaire Kikongo · Français · Anglais · Phonétique.
          Une base vivante pour apprendre, explorer et contribuer au patrimoine
          linguistique kikongo.
        </p>

        <div class="home-hero__actions">
          <NuxtLink to="/words" class="home-btn home-btn--solid">
            <i class="fas fa-spell-check" aria-hidden="true"></i>
            <span>Explorer les mots</span>
          </NuxtLink>
          <NuxtLink to="/verbs" class="home-btn home-btn--ghost">
            <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true"></i>
            <span>Découvrir les verbes</span>
          </NuxtLink>
        </div>

        <div class="home-hero__meta">
          <p class="home-hero__hint">
            Vous pouvez aussi parcourir
            <NuxtLink to="/expressions" class="home-link">
              les expressions
            </NuxtLink>
            ou lire la
            <NuxtLink to="/documentation" class="home-link">
              documentation contributeur
            </NuxtLink>.
          </p>
        </div>
      </div>

      <aside class="home-hero__side" aria-label="Accès rapide">
        <div class="home-card">
          <h2 class="home-card__title">
            Contribuer au lexique
          </h2>
          <p class="home-card__text">
            Ajoutez de nouveaux mots, verbes ou expressions et
            aidez la communauté à enrichir la base.
          </p>
          <NuxtLink
            to="/documentation/for-contributors"
            class="home-card__link"
          >
            <span>Accéder à l’espace contributeur</span>
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </NuxtLink>
        </div>

        <div class="home-card home-card--muted">
          <h2 class="home-card__title">
            Se connecter
          </h2>
          <p class="home-card__text">
            Retrouvez votre tableau de bord, vos propositions et votre activité.
          </p>
          <NuxtLink to="/login" class="home-card__link">
            <span>Se connecter</span>
            <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
          </NuxtLink>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { useSeoMeta } from '#imports';

useSeoMeta({
  title: 'Lexikongo — Dictionnaire Kikongo · Nuxt 4 SSR',
  description:
    "Lexikongo est un dictionnaire Kikongo · Français · Anglais avec phonétique. Explorez les mots, les verbes et les expressions du Kikongo.",
  ogTitle: 'Lexikongo — Dictionnaire Kikongo',
  ogDescription:
    "Dictionnaire Kikongo · Français · Anglais · Phonétique. Une ressource moderne pour découvrir et préserver la langue kikongo.",
  ogType: 'website',
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

.home-hero__badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(13, 110, 253, 0.08);
  color: var(--primary, #0d6efd);
}

.home-hero__subtitle {
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--muted-text, #4b5563);
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
  background: var(--primary, #0d6efd);
  color: #fff;
  box-shadow: 0 14px 30px rgba(13, 110, 253, 0.35);
}

.home-btn--ghost {
  background: rgba(148, 163, 184, 0.05);
  color: var(--text-default, #111827);
  border-color: rgba(148, 163, 184, 0.6);
}

.home-btn:hover,
.home-btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.14);
}

.home-btn--solid:hover,
.home-btn--solid:focus-visible {
  background: #0b5ed7;
}

.home-btn--ghost:hover,
.home-btn--ghost:focus-visible {
  background: rgba(148, 163, 184, 0.16);
}

/* Lien texte */
.home-link {
  color: var(--primary, #0d6efd);
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
  color: var(--muted-text, #6b7280);
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
  background: var(--surface-elevated, #ffffff);
  border: 1px solid rgba(148, 163, 184, 0.5);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

.home-card--muted {
  background: linear-gradient(
    135deg,
    rgba(148, 163, 184, 0.06),
    rgba(249, 250, 251, 0.9)
  );
}

.home-card__title {
  font-size: 0.98rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.home-card__text {
  font-size: 0.9rem;
  color: var(--muted-text, #6b7280);
  margin-bottom: 0.6rem;
}

.home-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  color: var(--primary, #0d6efd);
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
