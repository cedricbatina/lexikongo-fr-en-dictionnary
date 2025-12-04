<template>
  <main
    class="contrib-page"
    aria-labelledby="contrib-page-title"
  >
    <LkPageHero
      id="contrib-page-title"
      :eyebrow="tt('contrib.dashboard.hero.eyebrow', 'Espace membre · Contributeur')"
      :title="heroTitle"
      :description="tt(
        'contrib.dashboard.hero.description',
        'Proposez de nouveaux mots, verbes et expressions en kikongo et suivez vos contributions.'
      )"
      :side-aria-label="tt(
        'contrib.dashboard.hero.sideAria',
        'Raccourcis contributeur et actions rapides'
      )"
    >
      <!-- CTA principaux -->
      <template #actions>
        <NuxtLink
          to="/words"
          class="contrib-hero-btn contrib-hero-btn--primary"
        >
          <i class="fas fa-spell-check" aria-hidden="true" />
          <span>
            {{
              tt(
                'contrib.dashboard.hero.ctaWords',
                'Explorer les mots'
              )
            }}
          </span>
        </NuxtLink>

        <NuxtLink
          to="/verbs"
          class="contrib-hero-btn contrib-hero-btn--ghost"
        >
          <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true" />
          <span>
            {{
              tt(
                'contrib.dashboard.hero.ctaVerbs',
                'Explorer les verbes'
              )
            }}
          </span>
        </NuxtLink>
      </template>

      <template #meta>
        <p class="contrib-hero-meta">
          <i class="fas fa-hands-helping" aria-hidden="true" />
          <span>
            {{
              tt(
                'contrib.dashboard.hero.meta',
                'Chaque contribution est relue avant publication afin de préserver la qualité du dictionnaire.'
              )
            }}
          </span>
        </p>
      </template>

      <template #side>
        <aside class="contrib-hero-side">
          <section
            class="contrib-hero-card contrib-hero-card--muted"
            :aria-label="tt(
              'contrib.dashboard.hero.actionsAria',
              'Actions rapides Lexikongo'
            )"
          >
            <LkActionsBar />
          </section>
        </aside>
      </template>
    </LkPageHero>

    <!-- Contenu contributeur -->
    <section
      class="contrib-layout"
      aria-label="Tableau de bord contributeur"
    >
      <!-- Colonne gauche : actions de contribution -->
      <section
        class="contrib-section"
        aria-labelledby="contrib-actions-title"
      >
        <header class="contrib-section__header">
          <h2
            id="contrib-actions-title"
            class="contrib-section__title"
          >
            {{
              tt(
                'contrib.dashboard.actions.title',
                'Contribuer au dictionnaire'
              )
            }}
          </h2>
          <p class="contrib-section__intro">
            {{
              tt(
                'contrib.dashboard.actions.intro',
                'Choisissez ce que vous souhaitez proposer ou améliorer sur Lexikongo.'
              )
            }}
          </p>
        </header>
        <div class="contrib-actions-grid">
          <article class="contrib-action-card">
            <h3 class="contrib-action-card__title">
              {{
                tt(
                  'contrib.dashboard.actions.words.title',
                  'Proposer un mot'
                )
              }}
            </h3>
            <p class="contrib-action-card__text">
              {{
                tt(
                  'contrib.dashboard.actions.words.text',
                  'Ajoutez un nouveau mot en kikongo avec sa traduction et sa phonétique.'
                )
              }}
            </p>
            <NuxtLink
              to="/words"
              class="contrib-action-card__link"
            >
              <span>
                {{
                  tt(
                    'contrib.dashboard.actions.words.link',
                    'Accéder aux mots'
                  )
                }}
              </span>
              <i class="fas fa-arrow-right" aria-hidden="true" />
            </NuxtLink>
          </article>

          <article class="contrib-action-card">
            <h3 class="contrib-action-card__title">
              {{
                tt(
                  'contrib.dashboard.actions.verbs.title',
                  'Proposer un verbe'
                )
              }}
            </h3>
            <p class="contrib-action-card__text">
              {{
                tt(
                  'contrib.dashboard.actions.verbs.text',
                  'Ajoutez un verbe ou proposez une meilleure conjugaison.'
                )
              }}
            </p>
            <NuxtLink
              to="/verbs"
              class="contrib-action-card__link"
            >
              <span>
                {{
                  tt(
                    'contrib.dashboard.actions.verbs.link',
                    'Accéder aux verbes'
                  )
                }}
              </span>
              <i class="fas fa-arrow-right" aria-hidden="true" />
            </NuxtLink>
          </article>

          <article class="contrib-action-card">
            <h3 class="contrib-action-card__title">
              {{
                tt(
                  'contrib.dashboard.actions.expressions.title',
                  'Proposer une expression'
                )
              }}
            </h3>
            <p class="contrib-action-card__text">
              {{
                tt(
                  'contrib.dashboard.actions.expressions.text',
                  'Partagez des expressions idiomatiques, proverbes ou tournures fréquentes.'
                )
              }}
            </p>
            <NuxtLink
              to="/expressions"
              class="contrib-action-card__link"
            >
              <span>
                {{
                  tt(
                    'contrib.dashboard.actions.expressions.link',
                    'Accéder aux expressions'
                  )
                }}
              </span>
              <i class="fas fa-arrow-right" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- 🆕 Nouvelle carte : gérer les contributions -->
          <article class="contrib-action-card">
            <h3 class="contrib-action-card__title">
              {{
                tt(
                  'contrib.dashboard.actions.submissions.title',
                  'Gérer vos contributions'
                )
              }}
            </h3>
            <p class="contrib-action-card__text">
              {{
                tt(
                  'contrib.dashboard.actions.submissions.text',
                  'Retrouvez tous les mots et verbes que vous avez proposés, pour les modifier ou les compléter.'
                )
              }}
            </p>
            <NuxtLink
              to="/contributor/submissions"
              class="contrib-action-card__link"
            >
              <span>
                {{
                  tt(
                    'contrib.dashboard.actions.submissions.link',
                    'Voir vos contributions'
                  )
                }}
              </span>
              <i class="fas fa-arrow-right" aria-hidden="true" />
            </NuxtLink>
          </article>

          <article class="contrib-action-card">
            <h3 class="contrib-action-card__title">
              {{
                tt(
                  'contrib.dashboard.actions.doc.title',
                  'Lire la documentation'
                )
              }}
            </h3>
            <p class="contrib-action-card__text">
              {{
                tt(
                  'contrib.dashboard.actions.doc.text',
                  'Découvrez comment structurer vos propositions et les bonnes pratiques.'
                )
              }}
            </p>
            <NuxtLink
              to="/documentation/for-contributors"
              class="contrib-action-card__link"
            >
              <span>
                {{
                  tt(
                    'contrib.dashboard.actions.doc.link',
                    'Voir la documentation'
                  )
                }}
              </span>
              <i class="fas fa-arrow-right" aria-hidden="true" />
            </NuxtLink>
          </article>
        </div>

      </section>

      <!-- Colonne droite : résumé compte -->
      <section
        class="contrib-section contrib-section--side"
        aria-labelledby="contrib-summary-title"
      >
        <header class="contrib-section__header">
          <h2
            id="contrib-summary-title"
            class="contrib-section__title"
          >
            {{
              tt(
                'contrib.dashboard.summary.title',
                'Résumé de votre compte'
              )
            }}
          </h2>
          <p class="contrib-section__intro">
            {{
              tt(
                'contrib.dashboard.summary.intro',
                'Un rappel des informations principales liées à votre profil.'
              )
            }}
          </p>
        </header>

        <dl class="contrib-summary-dl">
          <div class="contrib-summary-row">
            <dt>
              {{ tt('contrib.dashboard.summary.username', "Nom d'utilisateur") }}
            </dt>
            <dd>
              {{ displayName }}
            </dd>
          </div>

          <div class="contrib-summary-row">
            <dt>
              {{ tt('contrib.dashboard.summary.role', 'Rôle') }}
            </dt>
            <dd>
              {{ tt('contrib.dashboard.summary.roleLabel', 'Contributeur') }}
            </dd>
          </div>

          <div class="contrib-summary-row">
            <dt>
              {{ tt('contrib.dashboard.summary.memberSince', 'Membre depuis') }}
            </dt>
            <dd>
              {{ createdAtDisplay }}
            </dd>
          </div>
        </dl>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSeoMeta } from '#imports';
import { useAuthStore } from '~/stores/authStore';
import LkPageHero from '~/components/LkPageHero.vue';
import LkActionsBar from '~/components/LkActionsBar.vue';

definePageMeta({
  middleware: 'auth',
  userRole: 'contributor',
});

const { t } = useI18n();
const authStore = useAuthStore();

const tt = (key, fallback) => {
  const res = t(key);
  return res === key ? fallback : res;
};

onMounted(async () => {
  if (!authStore.ready) {
    await authStore.fetchMe();
  }
});

const user = computed(() => authStore.user || {});

const displayName = computed(
  () =>
    user.value.username ||
    tt('contrib.dashboard.summary.fallbackName', 'Contributeur Lexikongo')
);

const createdAtDisplay = computed(() => {
  const raw = user.value.created_at;
  if (!raw) {
    return tt(
      'contrib.dashboard.summary.memberSinceUnknown',
      'Date inconnue'
    );
  }
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) {
    return tt(
      'contrib.dashboard.summary.memberSinceUnknown',
      'Date inconnue'
    );
  }
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});

const heroTitle = computed(() => {
  const name = displayName.value;
  const key = 'contrib.dashboard.hero.titleWithName';
  const res = t(key, { name });
  if (res && res !== key) return res;
  return `Espace contributeur · ${name}`;
});

// SEO (page privée)
useSeoMeta({
  title: () =>
    tt(
      'contrib.dashboard.seo.title',
      'Espace contributeur – Lexikongo'
    ),
  description: () =>
    tt(
      'contrib.dashboard.seo.description',
      'Proposez et suivez vos contributions dans le dictionnaire kikongo Lexikongo.'
    ),
  ogTitle: () =>
    tt(
      'contrib.dashboard.seo.title',
      'Espace contributeur – Lexikongo'
    ),
  ogDescription: () =>
    tt(
      'contrib.dashboard.seo.description',
      'Proposez et suivez vos contributions dans le dictionnaire kikongo Lexikongo.'
    ),
  ogType: 'website',
  ogSiteName: 'Lexikongo',
  robots: 'noindex, nofollow, noimageindex',
});
</script>

<style scoped>
.contrib-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.75rem 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Hero buttons */
.contrib-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.1rem;
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
    transform 0.1s ease,
    border-color 0.15s ease;
}

.contrib-hero-btn--primary {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 14px 30px rgba(13, 110, 253, 0.3);
}

.contrib-hero-btn--ghost {
  background: var(--surface-elevated, #ffffff);
  color: var(--color-text);
  border-color: var(--border-subtle);
}

.contrib-hero-btn:hover,
.contrib-hero-btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.14);
}

.contrib-hero-btn--primary:hover,
.contrib-hero-btn--primary:focus-visible {
  background: var(--primary-hover, #0b5ed7);
}

.contrib-hero-btn--ghost:hover,
.contrib-hero-btn--ghost:focus-visible {
  background: rgba(148, 163, 184, 0.18);
}

/* Meta hero */
.contrib-hero-meta {
  margin: 0.3rem 0 0;
  font-size: 0.88rem;
  color: var(--text-muted, #6b7280);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.contrib-hero-meta i {
  color: var(--primary);
}

/* Side hero */
.contrib-hero-side {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.contrib-hero-card {
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.09);
}

.contrib-hero-card--muted {
  background: var(--surface-default, #f9fafb);
  border-style: dashed;
}

/* Layout */
.contrib-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.5fr);
  gap: 1.1rem;
}

@media (max-width: 900px) {
  .contrib-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* Sections */
.contrib-section {
  border-radius: 1rem;
  padding: 1.05rem 1rem;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.5));
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.12);
}

.contrib-section__header {
  margin-bottom: 0.7rem;
}

.contrib-section__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.contrib-section__intro {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

/* Action cards */
.contrib-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.7rem;
  margin-top: 0.4rem;
}

.contrib-action-card {
  border-radius: 0.9rem;
  padding: 0.8rem 0.85rem;
  background: var(--surface-default, #f9fafb);
  border: 1px solid rgba(148, 163, 184, 0.5);
}

.contrib-action-card__title {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.contrib-action-card__text {
  margin: 0 0 0.5rem;
  font-size: 0.88rem;
  color: var(--text-muted, #6b7280);
}

.contrib-action-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.88rem;
  text-decoration: none;
  color: var(--primary);
}

.contrib-action-card__link i {
  font-size: 0.86rem;
}

.contrib-action-card__link:hover,
.contrib-action-card__link:focus-visible {
  text-decoration: underline;
}

/* Résumé compte */
.contrib-summary-dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.contrib-summary-row {
  display: grid;
  grid-template-columns: minmax(0, 130px) minmax(0, 1fr);
  gap: 0.2rem 0.7rem;
}

.contrib-summary-row dt {
  font-weight: 600;
  color: var(--text-muted, #6b7280);
}

.contrib-summary-row dd {
  margin: 0;
  color: var(--text-default, #111827);
}
</style>
