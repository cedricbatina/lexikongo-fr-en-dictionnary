<template>
  <main
    class="admin-page"
    aria-labelledby="admin-page-title"
  >
    <!-- HERO ADMIN -->
    <LkPageHero
      id="admin-page-title"
      :eyebrow="tt('admin.dashboard.hero.eyebrow', 'Espace membre · Administration')"
      :title="heroTitle"
      :description="tt(
        'admin.dashboard.hero.description',
        'Accédez aux outils d’administration de Lexikongo : mots, verbes, utilisateurs et soumissions.'
      )"
      :side-aria-label="tt(
        'admin.dashboard.hero.sideAria',
        'Raccourcis administrateur et actions rapides'
      )"
    >
      <!-- CTA principaux -->
      <template #actions>
        <NuxtLink
          to="/words"
          class="admin-hero-btn admin-hero-btn--primary"
        >
          <i class="fas fa-book" aria-hidden="true" />
          <span>
            {{ tt('admin.dashboard.hero.ctaWords', 'Gérer les mots') }}
          </span>
        </NuxtLink>

        <NuxtLink
          to="/verbs"
          class="admin-hero-btn admin-hero-btn--ghost"
        >
          <i class="fas fa-pencil-alt" aria-hidden="true" />
          <span>
            {{ tt('admin.dashboard.hero.ctaVerbs', 'Gérer les verbes') }}
          </span>
        </NuxtLink>
      </template>

      <!-- Meta sous les boutons -->
      <template #meta>
        <p class="admin-hero-meta">
          <i class="fas fa-shield-alt" aria-hidden="true" />
          <span>
            {{
              tt(
                'admin.dashboard.hero.meta',
                'Vous voyez ici uniquement des informations réservées à votre rôle d’administrateur.'
              )
            }}
          </span>
        </p>
      </template>

      <!-- Colonne de droite : actions bar -->
      <template #side>
        <aside class="admin-hero-side">
          <section
            class="admin-hero-card admin-hero-card--muted"
            :aria-label="tt(
              'admin.dashboard.hero.actionsAria',
              'Actions rapides Lexikongo'
            )"
          >
            <LkActionsBar />
          </section>
        </aside>
      </template>
    </LkPageHero>

    <!-- CONTENU PRINCIPAL -->
    <section
      class="admin-layout"
      aria-label="Tableau de bord administrateur"
    >
      <!-- Colonne gauche : accès sections -->
      <section
        class="admin-section admin-section--access"
        aria-labelledby="admin-access-title"
      >
        <header class="admin-section__header">
          <h2
            id="admin-access-title"
            class="admin-section__title"
          >
            {{ tt('admin.dashboard.access.title', 'Accès aux sections') }}
          </h2>
          <p class="admin-section__intro">
            {{
              tt(
                'admin.dashboard.access.intro',
                'Retrouvez rapidement les zones clés du dictionnaire et de la gestion des comptes.'
              )
            }}
          </p>
        </header>

        <div class="admin-access-grid">
          <!-- Mots -->
          <article class="admin-access-card">
            <h3 class="admin-access-card__title">
              {{ tt('admin.dashboard.access.words.title', 'Gestion des mots') }}
            </h3>
            <p class="admin-access-card__text">
              {{
                tt(
                  'admin.dashboard.access.words.text',
                  'Consultez, filtrez et modifiez les entrées de mots du dictionnaire.'
                )
              }}
            </p>
            <NuxtLink
              to="/words"
              class="admin-access-card__link"
            >
              <span>
                {{ tt('admin.dashboard.access.words.link', 'Voir les mots') }}
              </span>
              <i class="fas fa-arrow-right" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- Verbes -->
          <article class="admin-access-card">
            <h3 class="admin-access-card__title">
              {{
                tt(
                  'admin.dashboard.access.verbs.title',
                  'Gestion des verbes'
                )
              }}
            </h3>
            <p class="admin-access-card__text">
              {{
                tt(
                  'admin.dashboard.access.verbs.text',
                  'Consultez, filtrez et modifiez les verbes enregistrés.'
                )
              }}
            </p>
            <NuxtLink
              to="/verbs"
              class="admin-access-card__link"
            >
              <span>
                {{
                  tt(
                    'admin.dashboard.access.verbs.link',
                    'Voir les verbes'
                  )
                }}
              </span>
              <i class="fas fa-arrow-right" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- Utilisateurs -->
          <article class="admin-access-card">
            <h3 class="admin-access-card__title">
              {{
                tt(
                  'admin.dashboard.access.users.title',
                  'Gestion des utilisateurs'
                )
              }}
            </h3>
            <p class="admin-access-card__text">
              {{
                tt(
                  'admin.dashboard.access.users.text',
                  'Consultez et gérez les comptes utilisateurs (rôles, accès, suppression).'
                )
              }}
            </p>
            <NuxtLink
              to="/admin/admin-users"
              class="admin-access-card__link"
            >
              <span>
                {{
                  tt(
                    'admin.dashboard.access.users.link',
                    'Voir les utilisateurs'
                  )
                }}
              </span>
              <i class="fas fa-arrow-right" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- Soumissions -->
          <article class="admin-access-card">
            <h3 class="admin-access-card__title">
              {{
                tt(
                  'admin.dashboard.access.submissions.title',
                  'Gestion des soumissions'
                )
              }}
            </h3>
            <p class="admin-access-card__text">
              {{
                tt(
                  'admin.dashboard.access.submissions.text',
                  'Validez ou refusez les nouvelles propositions de mots, verbes et expressions.'
                )
              }}
            </p>
            <NuxtLink
              to="/admin/manage-pendings"
              class="admin-access-card__link"
            >
              <span>
                {{
                  tt(
                    'admin.dashboard.access.submissions.link',
                    'Voir les soumissions'
                  )
                }}
              </span>
              <i class="fas fa-arrow-right" aria-hidden="true" />
            </NuxtLink>
          </article>
        </div>
      </section>

      <!-- Colonne droite : stats + session -->
      <section
        class="admin-section admin-section--stats"
        aria-labelledby="admin-stats-title"
      >
        <header class="admin-section__header">
          <h2
            id="admin-stats-title"
            class="admin-section__title"
          >
            {{ tt('admin.dashboard.stats.title', 'Statistiques rapides') }}
          </h2>
          <p class="admin-section__intro">
            {{
              tt(
                'admin.dashboard.stats.intro',
                'Un aperçu global de l’activité sur Lexikongo.'
              )
            }}
          </p>
        </header>

        <div class="admin-stats-grid">
          <article class="admin-stat-card">
            <p class="admin-stat-card__label">
              {{ tt('admin.dashboard.stats.usersLabel', 'Utilisateurs') }}
            </p>
            <p class="admin-stat-card__value">
              {{ totalUsersDisplay }}
            </p>
            <p class="admin-stat-card__hint">
              {{
                tt(
                  'admin.dashboard.stats.usersHint',
                  'Comptes enregistrés dans la base.'
                )
              }}
            </p>
          </article>

          <article class="admin-stat-card">
            <p class="admin-stat-card__label">
              {{ tt('admin.dashboard.stats.wordsLabel', 'Mots') }}
            </p>
            <p class="admin-stat-card__value">
              {{ totalWordsDisplay }}
            </p>
            <p class="admin-stat-card__hint">
              {{
                tt(
                  'admin.dashboard.stats.wordsHint',
                  'Entrées de mots actuellement disponibles.'
                )
              }}
            </p>
          </article>

          <article class="admin-stat-card">
            <p class="admin-stat-card__label">
              {{ tt('admin.dashboard.stats.verbsLabel', 'Verbes') }}
            </p>
            <p class="admin-stat-card__value">
              {{ totalVerbsDisplay }}
            </p>
            <p class="admin-stat-card__hint">
              {{
                tt(
                  'admin.dashboard.stats.verbsHint',
                  'Entrées de verbes actuellement disponibles.'
                )
              }}
            </p>
          </article>
        </div>

        <!-- Petit bloc session / logout -->
        <footer class="admin-session">
          <p class="admin-session__text">
            {{
              tt(
                'admin.dashboard.session.text',
                'Vous êtes connecté avec un compte administrateur.'
              )
            }}
          </p>
          <button
            type="button"
            class="admin-session__logout"
            @click="handleLogout"
          >
            <i class="fas fa-sign-out-alt" aria-hidden="true" />
            <span>
              {{ tt('admin.dashboard.session.logout', 'Se déconnecter') }}
            </span>
          </button>
        </footer>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSeoMeta } from '#imports';
import { useAuthStore } from '~/stores/authStore';
import LkPageHero from '~/components/LkPageHero.vue';
import LkActionsBar from '~/components/LkActionsBar.vue';

definePageMeta({
  middleware: 'auth',   // garde ton middleware existant
  userRole: 'admin',    // pour ton middleware de rôles actuel
});

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();

// helper i18n
const tt = (key, fallback) => {
  const res = t(key);
  return res === key ? fallback : res;
};

// stats réactives simples
const stats = reactive({
  users: 0,
  words: 0,
  verbs: 0,
});

const totalUsersDisplay = computed(() => stats.users ?? 0);
const totalWordsDisplay = computed(() => stats.words ?? 0);
const totalVerbsDisplay = computed(() => stats.verbs ?? 0);

// titre hero
const heroTitle = computed(() => {
  const name = authStore.user?.username || tt('admin.dashboard.hero.fallbackName', 'Administrateur Lexikongo');
  const key = 'admin.dashboard.hero.title';
  const res = t(key, { name });
  if (res && res !== key) return res;
  return `Tableau de bord admin · ${name}`;
});

// fetch stats au montage (CSR, page non SEO)
const fetchStats = async () => {
  try {
    const data = await $fetch('/api/total-statistics');
    stats.users = data?.totalUsers ?? 0;
    stats.words = data?.totalWords ?? 0;
    stats.verbs = data?.totalVerbs ?? 0;
  } catch (e) {
    console.error('Erreur statistiques admin :', e);
  }
};

onMounted(async () => {
  if (!authStore.ready) {
    await authStore.fetchMe();
  }
  if (authStore.hasRole('admin')) {
    await fetchStats();
  }
});

// logout via authStore
const handleLogout = async () => {
  await authStore.logout();
  await router.push('/login');
};

// SEO (page privée → noindex)
useSeoMeta({
  title: () =>
    tt('admin.dashboard.seo.title', 'Administration · Lexikongo'),
  description: () =>
    tt(
      'admin.dashboard.seo.description',
      "Tableau de bord administrateur Lexikongo : gestion des mots, verbes et utilisateurs."
    ),
  ogTitle: () =>
    tt('admin.dashboard.seo.title', 'Administration · Lexikongo'),
  ogDescription: () =>
    tt(
      'admin.dashboard.seo.description',
      "Tableau de bord administrateur Lexikongo : gestion des mots, verbes et utilisateurs."
    ),
  ogType: 'website',
  ogSiteName: 'Lexikongo',
  robots: 'noindex, nofollow, noimageindex',
});
</script>

<style scoped>
.admin-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.75rem 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Boutons hero */
.admin-hero-btn {
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

.admin-hero-btn--primary {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 14px 30px rgba(13, 110, 253, 0.3);
}

.admin-hero-btn--ghost {
  background: var(--surface-elevated, #ffffff);
  color: var(--color-text);
  border-color: var(--border-subtle);
}

.admin-hero-btn:hover,
.admin-hero-btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.14);
}

.admin-hero-btn--primary:hover,
.admin-hero-btn--primary:focus-visible {
  background: var(--primary-hover, #0b5ed7);
}

.admin-hero-btn--ghost:hover,
.admin-hero-btn--ghost:focus-visible {
  background: rgba(148, 163, 184, 0.18);
}

/* Meta sous hero */
.admin-hero-meta {
  margin: 0.3rem 0 0;
  font-size: 0.88rem;
  color: var(--text-muted, #6b7280);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.admin-hero-meta i {
  color: var(--primary);
}

/* Colonne droite hero */
.admin-hero-side {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.admin-hero-card {
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.09);
}

.admin-hero-card--muted {
  background: var(--surface-default, #f9fafb);
  border-style: dashed;
}

/* Layout sections */
.admin-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.4fr);
  gap: 1.1rem;
}

@media (max-width: 900px) {
  .admin-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

.admin-section {
  border-radius: 1rem;
  padding: 1.05rem 1rem;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.5));
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.12);
}

.admin-section__header {
  margin-bottom: 0.7rem;
}

.admin-section__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.admin-section__intro {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

/* Accès cards */
.admin-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.7rem;
  margin-top: 0.4rem;
}

.admin-access-card {
  border-radius: 0.9rem;
  padding: 0.8rem 0.85rem;
  background: var(--surface-default, #f9fafb);
  border: 1px solid rgba(148, 163, 184, 0.5);
}

.admin-access-card__title {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.admin-access-card__text {
  margin: 0 0 0.5rem;
  font-size: 0.88rem;
  color: var(--text-muted, #6b7280);
}

.admin-access-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.88rem;
  text-decoration: none;
  color: var(--primary);
}

.admin-access-card__link i {
  font-size: 0.86rem;
}

.admin-access-card__link:hover,
.admin-access-card__link:focus-visible {
  text-decoration: underline;
}

/* Stats */
.admin-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.7rem;
  margin-top: 0.4rem;
}

.admin-stat-card {
  border-radius: 0.9rem;
  padding: 0.75rem 0.8rem;
  background: var(--surface-default, #f9fafb);
  border: 1px solid rgba(148, 163, 184, 0.5);
}

.admin-stat-card__label {
  margin: 0 0 0.2rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #6b7280);
}

.admin-stat-card__value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-default, #111827);
}

.admin-stat-card__hint {
  margin: 0.25rem 0 0;
  font-size: 0.82rem;
  color: var(--text-muted, #6b7280);
}

/* Session / logout */
.admin-session {
  margin-top: 0.9rem;
  padding-top: 0.7rem;
  border-top: 1px dashed rgba(148, 163, 184, 0.6);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
}

.admin-session__text {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted, #6b7280);
}

.admin-session__logout {
  border-radius: 999px;
  border: 1px solid rgba(220, 38, 38, 0.8);
  padding: 0.35rem 0.9rem;
  font-size: 0.86rem;
  font-weight: 500;
  background: rgba(248, 113, 113, 0.08);
  color: #b91c1c;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
}

.admin-session__logout:hover,
.admin-session__logout:focus-visible {
  background: rgba(248, 113, 113, 0.16);
}
</style>
