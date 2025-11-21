<template>
  <main class="page-verbs" aria-labelledby="page-verbs-title">
    <!-- Hero pédagogique -->
    <header class="page-verbs__hero">
      <p class="page-verbs__eyebrow">
        Liste des verbes en Kikongo
      </p>

      <div class="page-verbs__title-block">
        <h1 id="page-verbs-title" class="page-verbs__title">
          Liste des Verbes
        </h1>
        <p class="page-verbs__subtitle">
          Explorez les verbes en Kikongo avec leur phonétique et leurs traductions
          en français et en anglais. Idéal pour l&apos;apprentissage, la révision
          et la préparation de supports pédagogiques.
        </p>
      </div>
    </header>

    <!-- Bloc principal : liste -->
    <section class="page-verbs__content">
      <VerbList />
    </section>

    <!-- CTA pédagogique -->
    <section class="page-verbs__cta" aria-label="Contribuer au dictionnaire">
      <div class="page-verbs__cta-inner">
        <h2 class="page-verbs__cta-title">
          Vous ne trouvez pas le verbe que vous cherchez&nbsp;?
        </h2>
        <p class="page-verbs__cta-text">
          Contribuez à enrichir le lexique en proposant de nouveaux verbes en Kikongo,
          avec leurs traductions et exemples d&apos;usage. Chaque contribution aide
          la communauté à mieux apprendre et transmettre la langue.
        </p>
        <NuxtLink to="/contributor" class="page-verbs__cta-button">
          <i class="fas fa-hands-helping" aria-hidden="true"></i>
          <span>Devenir contributeur</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import VerbList from "@/components/VerbList.vue";
import { useSeoMeta } from "#imports";

useSeoMeta({
  title: "Liste des verbes en Kikongo – Lexikongo",
  description:
    "Découvrez la liste des verbes en Kikongo avec leur phonétique et leurs traductions en français et en anglais. Outil idéal pour apprendre et enseigner la langue.",
  ogTitle: "Liste des verbes en Kikongo – Lexikongo",
  ogDescription:
    "Parcourez les verbes en Kikongo, leur prononciation et leurs traductions. Un dictionnaire en ligne pensé pour l’apprentissage et la pédagogie.",
  ogType: "website",
  ogUrl: "https://www.lexikongo.fr/verbs",
  ogSiteName: "Lexikongo",
});
</script>

<style scoped>
.page-verbs {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1rem 2.5rem;
}

/* Hero */
.page-verbs__hero {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
}

.page-verbs__eyebrow {
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--muted-text, #6b7280);
}

.page-verbs__title-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.page-verbs__title {
  font-size: clamp(1.8rem, 2.4vw, 2.2rem);
  line-height: 1.1;
  font-weight: 700;
  color: var(--text-default, #111827);
}

.page-verbs__subtitle {
  max-width: 48rem;
  font-size: 0.98rem;
  line-height: 1.5;
  color: var(--muted-text, #4b5563);
}

/* Contenu principal */
.page-verbs__content {
  margin-top: 0.75rem;
}

/* CTA */
.page-verbs__cta {
  margin-top: 2.5rem;
}

.page-verbs__cta-inner {
  border-radius: 1rem;
  padding: 1.4rem 1.3rem;
  background: radial-gradient(
      circle at top left,
      rgba(13, 110, 253, 0.1),
      transparent 55%
    ),
    #f3f4ff;
  border: 1px solid rgba(148, 163, 184, 0.45);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.page-verbs__cta-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.page-verbs__cta-text {
  font-size: 0.95rem;
  color: var(--muted-text, #4b5563);
}

.page-verbs__cta-button {
  align-self: flex-start;
  margin-top: 0.3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(37, 99, 235, 0.7);
  background: #fff;
  color: #1d4ed8;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.page-verbs__cta-button i {
  font-size: 0.95rem;
}

.page-verbs__cta-button:hover,
.page-verbs__cta-button:focus-visible {
  background: #1d4ed8;
  color: #fff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.2);
  transform: translateY(-1px);
  outline: none;
}

/* Responsive */
@media (min-width: 768px) {
  .page-verbs {
    padding-inline: 1.5rem;
  }

  .page-verbs__hero {
    margin-bottom: 2rem;
  }

  .page-verbs__cta-inner {
    padding: 1.6rem 1.8rem;
  }
}
</style>
