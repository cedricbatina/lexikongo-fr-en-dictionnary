<template>
  <main class="home-page" aria-labelledby="home-title">
    <!-- HERO générique réutilisable -->
    <LkPageHero
      id="home-title"
      :eyebrow="t('home.hero.badge')"
      title="Lexikongo"
      :description="t('home.hero.subtitle')"
        :show-last-expressions="true"
    >
      <!-- Boutons principaux : mots / verbes -->
      <template #actions>
        <NuxtLink
          to="/words"
          class="home-btn home-btn--solid"
          :aria-label="t('home.hero.ctaWords')"
        >
          <i class="fas fa-spell-check" aria-hidden="true"></i>
          <span>{{ t('home.hero.ctaWords') }}</span>
        </NuxtLink>

        <NuxtLink
          to="/verbs"
          class="home-btn home-btn--ghost"
          :aria-label="t('home.hero.ctaVerbs')"
        >
          <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true"></i>
          <span>{{ t('home.hero.ctaVerbs') }}</span>
        </NuxtLink>
      </template>

      <!-- Petit texte “hint” sous les boutons -->
      <template #meta>
        {{ t('home.hero.hintPrefix') }}
        <NuxtLink to="/expressions" class="home-link">
          {{ t('home.hero.hintExpressions') }}
        </NuxtLink>
        {{ t('home.hero.hintSeparator') }}
        <NuxtLink to="/documentation/for-contributors" class="home-link">
          {{ t('home.hero.hintDoc') }}
        </NuxtLink>.
      </template>

      <!-- Colonne de droite -->
      <template #side>
        <aside class="home-side" aria-label="Accès rapide">
          <!-- Carte “Contribuer” (toujours visible) -->
          <section
            class="home-card"
            aria-labelledby="home-contrib-title"
          >
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

          <!-- 🟢 Si NON connecté → carte “Se connecter” -->
          <section
            v-if="!isLoggedIn"
            class="home-card home-card--muted"
            aria-labelledby="home-login-title"
          >
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

          <!-- 🟣 Si connecté → carte “Espace membre / Admin / Contrib” -->
          <section
            v-else
            class="home-card home-card--muted"
            aria-labelledby="home-account-title"
          >
            <h2 id="home-account-title" class="home-card__title">
              {{ accountTitle }}
            </h2>
            <p class="home-card__text">
              {{ accountBody }}
            </p>
            <NuxtLink
              :to="accountLink"
              class="home-card__link"
            >
              <span>{{ accountCtaLabel }}</span>
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </NuxtLink>
          </section>
        </aside>
      </template>
    </LkPageHero>



    <!-- Barre d’actions globale -->
    <section
      class="home-actions"
      aria-label="Actions rapides et raccourcis du dictionnaire"
    >
      <LkActionsBar />
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useSeoMeta } from '#imports';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/authStore';
import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import LastExpressionsCount from '@/components/LastExpressionsCount.vue';

const { t } = useI18n();
const authStore = useAuthStore();

// Helper i18n avec fallback (si jamais une clé manque)
const tt = (key, fallback) => {
  const res = t(key);
  return res === key ? fallback : res;
};

// 🔐 État auth
const isLoggedIn = computed(() => authStore.isLoggedIn);
const roles = computed(() => authStore.roles || []);
const user = computed(() => authStore.user || null);

// Même helper que pour le profil / login
function usernameToSlug(username = '') {
  if (typeof username !== 'string' || !username) return 'profil';
  const safe =
    username
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  return safe || 'profil';
}

// Lien principal “espace membre”
const accountLink = computed(() => {
  const r = roles.value;

  if (Array.isArray(r) && r.includes('admin')) {
    return '/admin';
  }
  if (Array.isArray(r) && r.includes('contributor')) {
    return '/contributor';
  }

  // user “classique” → profil
  const username = user.value?.username || '';
  const slug = usernameToSlug(username);
  return `/profile/${slug}`;
});

// Texte de la carte quand on est connecté
const accountTitle = computed(() => {
  const r = roles.value;
  if (Array.isArray(r) && r.includes('admin')) {
    return tt('home.cards.account.adminTitle', 'Espace administrateur');
  }
  if (Array.isArray(r) && r.includes('contributor')) {
    return tt('home.cards.account.contribTitle', 'Espace contributeur');
  }
  return tt('home.cards.account.userTitle', 'Espace membre');
});

const accountBody = computed(() => {
  const r = roles.value;
  if (Array.isArray(r) && r.includes('admin')) {
    return tt(
      'home.cards.account.adminBody',
      'Accédez à votre tableau de bord administrateur : mots, verbes, utilisateurs et soumissions.'
    );
  }
  if (Array.isArray(r) && r.includes('contributor')) {
    return tt(
      'home.cards.account.contribBody',
      'Retrouvez vos propositions, votre activité et vos outils de contribution.'
    );
  }
  return tt(
    'home.cards.account.userBody',
    'Retrouvez votre profil, vos favoris et votre activité sur Lexikongo.'
  );
});

const accountCtaLabel = computed(() => {
  const r = roles.value;
  if (Array.isArray(r) && r.includes('admin')) {
    return tt(
      'home.cards.account.adminCta',
      "Accéder à l’espace admin"
    );
  }
  if (Array.isArray(r) && r.includes('contributor')) {
    return tt(
      'home.cards.account.contribCta',
      "Accéder à l’espace contributeur"
    );
  }
  return tt(
    'home.cards.account.userCta',
    'Accéder à mon espace'
  );
});

// SEO réactif à la langue (comme avant)
useSeoMeta({
  title: () => t('home.seo.title'),
  description: () => t('home.seo.description'),
  ogTitle: () => t('home.seo.ogTitle'),
  ogDescription: () => t('home.seo.ogDescription'),
  ogType: 'website',
  ogSiteName: 'Lexikongo',
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

/* Colonne droite (dans le slot #side) */
.home-side {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

/* Cartes (reprennent ton look initial) */
.home-card {
  border-radius: 1.1rem;
  padding: 1rem 1.1rem;
  background: var(--surface-elevated);
  border: 1px solid var(--border-subtle);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

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

/* Boutons du hero (slots #actions) */
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
  background: var(--primary-hover, #0b5ed7);
}

.home-btn--ghost:hover,
.home-btn--ghost:focus-visible {
  background: rgba(148, 163, 184, 0.18);
}

/* Lien texte dans le hint (#meta) */
.home-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.home-link:hover,
.home-link:focus-visible {
  text-decoration: underline;
}

/* Section actions sous le hero */
.home-actions {
  margin-top: 2rem;
}

/* Mobile léger */
@media (max-width: 639px) {
  .home-page {
    padding-top: 1.25rem;
  }
}
.lastexpr {
    margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(to bottom, #f9f9f9, #ffffff);
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.lk-nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  text-decoration: none;
}

.lk-nav__brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: var(--primary);
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.18);
}

.lk-nav__brand-text {
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text);
}

</style>
