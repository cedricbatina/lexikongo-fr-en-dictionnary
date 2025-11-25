<template>
  <main
    class="page-auth"
    aria-labelledby="register-hero-title"
  >
    <LkPageHero
      id="register-hero-title"
      :eyebrow="tt('auth.register.kicker', 'Lexikongo · Compte gratuit')"
      :title="tt('auth.register.pageTitle', 'Créer un compte Lexikongo')"
      :description="
        tt(
          'auth.register.heroDescription',
          'Créez votre compte gratuit pour contribuer au dictionnaire kikongo, suivre vos contributions et retrouver vos favoris.'
        )
      "
      :side-aria-label="
        tt(
          'auth.register.sideAria',
          'Informations complémentaires et formulaire de création de compte Lexikongo'
        )
      "
    >
      <!-- CTA secondaire : déjà un compte ? -->
      <template #actions>
        <NuxtLink
          to="/login"
          class="auth-hero-btn auth-hero-btn--ghost"
        >
          <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
          <span>
            {{
              tt(
                'auth.register.loginLink',
                'Vous avez déjà un compte ? Connectez-vous'
              )
            }}
          </span>
        </NuxtLink>
      </template>

      <!-- Meta : explication sur l’e-mail de confirmation -->
      <template #meta>
        <p class="auth-meta my-3">
          <span class="auth-meta__badge">
            {{
              tt(
                'auth.register.emailConfirmLabel',
                'Activation du compte par e-mail'
              )
            }}
          </span>
          <span class="auth-meta__hint">
            {{
              tt(
                'auth.register.emailConfirmHint',
                'Après votre inscription, un e-mail contenant un lien de validation vous sera envoyé. Cliquez dessus pour activer votre compte (pensez à vérifier vos spams).'
              )
            }}
          </span>
        </p>
          <!-- Bénéfices / résumé -->
          <section
            class="auth-side__card my-5"
            aria-labelledby="auth-side-benefits-title"
          >
            <h2
              id="auth-side-benefits-title"
              class="auth-side__title"
            >
              {{
                tt(
                  'auth.register.sideTitle',
                  'Votre espace Lexikongo'
                )
              }}
            </h2>
            <ul class="auth-side__list">
              <li>
                <i class="fas fa-check-circle" aria-hidden="true"></i>
                <span>
                  {{
                    tt(
                      'auth.register.sideBenefit1',
                      'Proposer des mots, verbes et expressions en kikongo.'
                    )
                  }}
                </span>
              </li>
              <li>
                <i class="fas fa-check-circle" aria-hidden="true"></i>
                <span>
                  {{
                    tt(
                      'auth.register.sideBenefit2',
                      'Suivre l’historique de vos contributions.'
                    )
                  }}
                </span>
              </li>
              <li>
                <i class="fas fa-check-circle" aria-hidden="true"></i>
                <span>
                  {{
                    tt(
                      'auth.register.sideBenefit3',
                      'Retrouver rapidement vos entrées favorites.'
                    )
                  }}
                </span>
              </li>
            </ul>
          </section>
      </template>

      <!-- COLONNE DROITE : bénéfices + formulaire d’inscription -->
      <template #side>
        <aside class="auth-side">
          <!-- Formulaire d’inscription directement dans la colonne de droite -->
          <section
            class="auth-side__form-wrapper"
            aria-label="Formulaire de création de compte"
          >
            <Register />
          </section>
        

         
        </aside>
      </template>
    </LkPageHero>
  </main>
</template>

<script setup>
import Register from '@/components/Register.vue';
import LkPageHero from '@/components/LkPageHero.vue';
import { useSeoMeta, useHead } from '#imports';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// helper i18n avec fallback propre
const tt = (key, fallback) => {
  const res = t(key);
  return res === key ? fallback : res;
};

// SEO
const seoTitle = tt(
  'auth.register.meta.title',
  'Créer un compte · Dictionnaire Kikongo Lexikongo'
);

const seoDescription = tt(
  'auth.register.meta.description',
  "Créez votre compte Lexikongo pour proposer des mots, verbes et expressions en kikongo, suivre vos contributions et retrouver vos favoris. Un e-mail d’activation vous sera envoyé."
);

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogUrl: 'https://www.lexikongo.fr/register',
  ogSiteName: 'Lexikongo',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterCard: 'summary',
});

// JSON-LD + canonical
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: seoTitle,
  description: seoDescription,
  url: 'https://www.lexikongo.fr/register',
  inLanguage: 'fr',
  publisher: {
    '@type': 'Organization',
    name: 'Lexikongo',
    url: 'https://www.lexikongo.fr',
  },
  potentialAction: {
    '@type': 'RegisterAction',
    target: 'https://www.lexikongo.fr/register',
  },
};

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://www.lexikongo.fr/register',
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
.page-auth {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.75rem 1.25rem 2.5rem;
}

/* Bouton dans le slot #actions du hero */
.auth-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
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
    transform 0.08s ease,
    border-color 0.15s ease;
}

.auth-hero-btn--ghost {
  background: var(--surface-elevated, #ffffff);
  color: var(--primary, #2563eb);
  border-color: rgba(148, 163, 184, 0.8);
}

.auth-hero-btn--ghost:hover,
.auth-hero-btn--ghost:focus-visible {
  outline: none;
  background: rgba(37, 99, 235, 0.06);
  border-color: var(--primary, #2563eb);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
  transform: translateY(-1px);
}

/* Meta (texte sous les boutons du hero) */
.auth-meta {
  margin: 0.4rem 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.86rem;
  color: var(--text-muted, #6b7280);
}

.auth-meta__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.12rem 0.55rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: var(--primary, #2563eb);
  font-weight: 600;
  font-size: 0.78rem;
}

.auth-meta__hint {
  max-width: 440px;
}

/* Colonne de droite (slot #side) : bénéfices + formulaire */
.auth-side {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.auth-side__card {
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.6));
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.auth-side__title {
  margin: 0 0 0.4rem;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.auth-side__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: var(--text-muted, #4b5563);
}

.auth-side__list li {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
}

.auth-side__list i {
  margin-top: 0.08rem;
  font-size: 0.9rem;
  color: #16a34a;
}

/* Wrapper du formulaire dans la colonne de droite */
.auth-side__form-wrapper {
  /* le Register.vue gère déjà son design (lk-auth) */
  max-width: 460px;
}

/* Responsive léger */
@media (max-width: 640px) {
  .page-auth {
    padding-inline: 1rem;
  }
}
</style>
