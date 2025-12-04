<template>
  <aside
    class="lk-actions"
    :aria-label="t('actionsBar.global.ariaLabel')"
  >
    <section
      class="lk-actions__card"
      role="region"
      :aria-labelledby="'lk-actions-title'"
    >
    <header class="lk-actions__header">
  <span
    v-if="isAdmin"
    class="lk-actions__role-chip lk-actions__role-chip--admin"
    aria-hidden="true"
  >
    {{ t('actionsBar.admin.title') }}
  </span>
  <span
    v-else-if="isContributor"
    class="lk-actions__role-chip lk-actions__role-chip--contrib"
    aria-hidden="true"
  >
    {{ t('actionsBar.contrib.title') }}
  </span>
  <span
    v-else
    class="lk-actions__role-chip lk-actions__role-chip--visitor"
    aria-hidden="true"
  >
    {{ t('actionsBar.shortcuts.title') }}
  </span>

  <p class="lk-actions__subtitle">
    {{ t('actionsBar.shortcuts.title') }}
  </p>
</header>


      <div class="lk-actions__body">
        <!-- Bloc privé (admin / contrib) -->
        <div
          v-if="isAdmin || isContributor"
          class="lk-actions__section lk-actions__section--private"
        >
          <!-- Dashboard admin : pill pleine largeur -->
          <button
            v-if="isAdmin"
            type="button"
            class="lk-actions__pill lk-actions__pill--dashboard"
            @click="goAdminDashboard"
          >
            <i class="fas fa-tools" aria-hidden="true"></i>
            <span>{{ t('nav.admin') }}</span>
          </button>

          <!-- Grille d’actions privées -->
          <div class="lk-actions__pill-grid">
            <!-- Admin : ajouter mot / verbe / utilisateur -->
            <button
              v-if="isAdmin"
              type="button"
              class="lk-actions__pill"
              @click="goAdminAddWord"
            >
              <i class="fas fa-plus-circle" aria-hidden="true"></i>
              <span>{{ t('actionsBar.admin.addWord') }}</span>
            </button>

            <button
              v-if="isAdmin"
              type="button"
              class="lk-actions__pill"
              @click="goAdminAddVerb"
            >
              <i class="fas fa-plus-circle" aria-hidden="true"></i>
              <span>{{ t('actionsBar.admin.addVerb') }}</span>
            </button>

            <button
              v-if="isAdmin"
              type="button"
              class="lk-actions__pill"
              @click="goAdminAddUser"
            >
              <i class="fas fa-user-plus" aria-hidden="true"></i>
              <span>{{ t('actionsBar.admin.addUser') }}</span>
            </button>

            <!-- Contributor (non admin) : ajouter mot / verbe -->
            <button
              v-if="isContributor"
              type="button"
              class="lk-actions__pill"
              @click="goContribAddWord"
            >
              <i class="fas fa-plus-circle" aria-hidden="true"></i>
              <span>{{ t('actionsBar.contrib.addWord') }}</span>
            </button>

            <button
              v-if="isContributor"
              type="button"
              class="lk-actions__pill"
              @click="goContribAddVerb"
            >
              <i class="fas fa-plus-circle" aria-hidden="true"></i>
              <span>{{ t('actionsBar.contrib.addVerb') }}</span>
            </button>

            <!-- Espace contributeur : commun admin + contrib -->
            <button
              type="button"
              class="lk-actions__pill lk-actions__pill--ghost"
              @click="goContributorBoard"
            >
              <i class="fas fa-user-cog" aria-hidden="true"></i>
              <span>{{ t('actionsBar.contrib.board') }}</span>
            </button>
          </div>
        </div>

        <!-- Raccourcis publics -->
        <nav
          class="lk-actions__section lk-actions__section--public"
          role="navigation"
          :aria-label="t('actionsBar.shortcuts.ariaLabel')"
        >
          <ul class="lk-actions__link-grid">
            <!-- Rechercher des mots -->
            <li>
              <NuxtLink
                to="/search/words"
                class="lk-actions__link lk-actions__link--search"
              >
                <span class="lk-actions__link-icon">
                  <i class="fa fa-search" aria-hidden="true"></i>
                </span>
                <span class="lk-actions__link-text">
                  {{ t('actionsBar.shortcuts.searchWords') }}
                </span>
              </NuxtLink>
            </li>

            <!-- Rechercher des verbes -->
            <li>
              <NuxtLink
                to="/search/verbs"
                class="lk-actions__link lk-actions__link--search"
              >
                <span class="lk-actions__link-icon">
                  <i class="fa fa-search" aria-hidden="true"></i>
                </span>
                <span class="lk-actions__link-text">
                  {{ t('actionsBar.shortcuts.searchVerbs') }}
                </span>
              </NuxtLink>
            </li>

            <!-- Liste des mots -->
            <li>
              <NuxtLink
                to="/words"
                class="lk-actions__link lk-actions__link--list"
              >
                <span class="lk-actions__link-icon">
                  <i class="fas fa-spell-check" aria-hidden="true"></i>
                </span>
                <span class="lk-actions__link-text">
                  {{ t('actionsBar.shortcuts.listWords') }}
                </span>
              </NuxtLink>
            </li>

            <!-- Liste des verbes -->
            <li>
              <NuxtLink
                to="/verbs"
                class="lk-actions__link lk-actions__link--list"
              >
                <span class="lk-actions__link-icon">
                  <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true"></i>
                </span>
                <span class="lk-actions__link-text">
                  {{ t('actionsBar.shortcuts.listVerbs') }}
                </span>
              </NuxtLink>
            </li>

            <!-- Liste mots & verbes -->
            <li>
              <NuxtLink
                to="/expressions"
                class="lk-actions__link lk-actions__link--list"
              >
                <span class="lk-actions__link-icon">
                  <i class="fas fa-book" aria-hidden="true"></i>
                </span>
                <span class="lk-actions__link-text">
                  {{ t('actionsBar.shortcuts.listExpressions') }}
                </span>
              </NuxtLink>
            </li>

            <!-- Contribuer -->
            <li>
              <NuxtLink
                to="/documentation/for-contributors"
                class="lk-actions__link lk-actions__link--contrib"
              >
                <span class="lk-actions__link-icon">
                  <i class="fas fa-hands-helping" aria-hidden="true"></i>
                </span>
                <span class="lk-actions__link-text">
                  {{ t('actionsBar.shortcuts.contribute') }}
                </span>
              </NuxtLink>
            </li>

            <!-- Retour à l'accueil (plein largeur) -->
            <li class="lk-actions__link-item-full">
              <NuxtLink
                to="/"
                class="lk-actions__link lk-actions__link--home"
              >
                <span class="lk-actions__link-icon">
                  <i class="fas fa-home" aria-hidden="true"></i>
                </span>
                <span class="lk-actions__link-text">
                  {{ t('actionsBar.common.backHome') }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </aside>
</template>


<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

// On unifie les rôles venant du store
const roles = computed(() => {
  if (Array.isArray(authStore.roles) && authStore.roles.length) {
    return authStore.roles;
  }
  if (Array.isArray(authStore.userRoles) && authStore.userRoles.length) {
    return authStore.userRoles;
  }
  return [];
});

const isAdmin = computed(() => roles.value.includes('admin'));
const isContributor = computed(
  () => !isAdmin.value && roles.value.includes('contributor'),
);

const currentRegionLabel = computed(() => {
  if (isAdmin.value) return t('actionsBar.admin.title');
  if (isContributor.value) return t('actionsBar.contrib.title');
  return t('actionsBar.shortcuts.title');
});

// Admin
const goAdminDashboard = () => {
  router.push('/admin');
};
const goAdminAddWord = () => {
  router.push('/admin/add/word');
};
const goAdminAddVerb = () => {
  router.push('/admin/add/verb');
};
const goAdminAddUser = () => {
  router.push('/admin/add/user');
};

// Contributeur
const goContribAddWord = () => {
  router.push('/contributor/add/word');
};
const goContribAddVerb = () => {
  router.push('/contributor/add/verb');
};
const goContributorBoard = () => {
  router.push('/contributor');
};
</script>

<style scoped>
.lk-actions {
  display: flex;
  flex-direction: column;
}

/* Carte principale – respecte le thème (surface + border vars) */
.lk-actions__card {
  border-radius: 1rem;
  padding: 0.95rem 1rem;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.6));
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.18);
}

/* Header */
.lk-actions__header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.6rem;
}

.lk-actions__role-chip {
  align-self: flex-start;
  padding: 0.12rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lk-actions__role-chip--admin {
  background: rgba(37, 99, 235, 0.14);
  color: var(--primary, #2563eb);
}

.lk-actions__role-chip--contrib {
  background: rgba(22, 163, 74, 0.14);
  color: #15803d;
}

.lk-actions__role-chip--visitor {
  background: rgba(148, 163, 184, 0.2);
  color: var(--text-muted, #6b7280);
}

.lk-actions__subtitle {
  margin: 0;
  font-size: 0.83rem;
  color: var(--text-muted, #6b7280);
}

/* Corps */
.lk-actions__body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.lk-actions__section {
  border-radius: 0.75rem;
}

.lk-actions__section--private {
  padding: 0.5rem 0.5rem 0.55rem;
  background: var(--surface-default, #f9fafb);
}

.lk-actions__section--public {
  padding: 0.45rem 0.5rem 0.15rem;
  background: var(--surface-default, #f9fafb);
}

/* Pills (actions privées) */
.lk-actions__pill {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
  padding: 0.34rem 0.8rem;
  font-size: 0.84rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.35rem;
  background: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease,
    border-color 0.15s ease;
}

.lk-actions__pill i {
  font-size: 0.86rem;
}

/* Dashboard pill */
.lk-actions__pill--dashboard {
  width: 100%;
  justify-content: center;
  background: var(--primary, #2563eb);
  color: #ffffff;
  border-color: var(--primary, #2563eb);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.78rem;
}

.lk-actions__pill--ghost {
  background: var(--surface-default, #f9fafb);
}

.lk-actions__pill-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
  margin-top: 0.45rem;
}

.lk-actions__pill:hover,
.lk-actions__pill:focus-visible {
  outline: none;
  transform: translateY(-1px);
  border-color: var(--primary, #2563eb);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
}

.lk-actions__pill--dashboard:hover,
.lk-actions__pill--dashboard:focus-visible {
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.45);
}

/* Liens publics */
.lk-actions__link-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.35rem;
}

.lk-actions__link-item-full {
  grid-column: 1 / -1;
}

.lk-actions__link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.36rem 0.75rem;
  border-radius: 0.9rem;
  font-size: 0.84rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.6));
  background: var(--surface-elevated, #ffffff);
  color: var(--color-text, #111827);
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease,
    border-color 0.15s ease;
}

.lk-actions__link-icon {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(148, 163, 184, 0.18);
}

.lk-actions__link-icon i {
  font-size: 0.78rem;
}

.lk-actions__link-text {
  flex: 1;
}

/* Bouton "retour à l'accueil" plus fort, mais theme-friendly */
.lk-actions__link--home {
  background: var(--primary, #2563eb);
  border-color: var(--primary, #2563eb);
  color: #f9fafb;
}

.lk-actions__link--home .lk-actions__link-icon {
  background: rgba(15, 23, 42, 0.22);
  color: #f9fafb;
}

.lk-actions__link:hover,
.lk-actions__link:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
  border-color: var(--primary, #2563eb);
  background: rgba(239, 246, 255, 0.96);
}

.lk-actions__link--home:hover,
.lk-actions__link--home:focus-visible {
  background: var(--primary, #2563eb);
  color: rgba(239, 246, 255, 0.96);;
}

/* Responsive */
@media (max-width: 640px) {
  .lk-actions__pill-grid,
  .lk-actions__link-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
.lk-actions__header {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.7rem;
  align-items: center;         /* ⬅️ centre le chip + texte */
  text-align: center;          /* ⬅️ centre le texte */
}

.lk-actions__role-chip {
  align-self: center;          /* ⬅️ au lieu de flex-start */
  padding: 0.14rem 0.75rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Couleurs des chips (on garde les mêmes mais un peu plus “pepsi”) */
.lk-actions__role-chip--admin {
  background: rgba(37, 99, 235, 0.16);
  color: var(--primary, #2563eb);
}

.lk-actions__role-chip--contrib {
  background: rgba(22, 163, 74, 0.16);
  color: #15803d;
}

.lk-actions__role-chip--visitor {
  background: rgba(148, 163, 184, 0.26);
  color: var(--text-muted, #6b7280);
}

.lk-actions__subtitle {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary, #2563eb);     /* ⬅️ titre plus coloré */
}
.lk-actions__card {
  border-radius: 1rem;
  padding: 0.95rem 1rem;
  background:
    linear-gradient(
      135deg,
      var(--surface-elevated, #ffffff) 0%,
      rgba(37, 99, 235, 0.04) 40%,
      rgba(56, 189, 248, 0.06) 100%
    );
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.6));
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.18);
}/* Pills (actions privées) */
/* =========
   FIX DARK MODE : pas de hover ultra blanc
   ========= */

/* Pills privées (admin / contrib) */
.lk-actions__pill {
  background: var(--surface-elevated, #020617); /* dépend du thème */
}

.lk-actions__pill:hover,
.lk-actions__pill:focus-visible {
  outline: none;
  transform: translateY(-1px);
  border-color: var(--primary, #2563eb);
  /* léger voile gris, pas de blanc pur */
  background: rgba(148, 163, 184, 0.16);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.2);
}

/* Liens publics : base = surface du thème */
.lk-actions__link {
  background: var(--surface-elevated, #020617);
}

/* Hover générique : petit voile neutre, pas de blanc */
.lk-actions__link:hover,
.lk-actions__link:focus-visible {
  background: rgba(148, 163, 184, 0.18);
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
}

/* 🔵 Search (mots / verbes) : tint bleu soft */
.lk-actions__link--search {
  border-color: rgba(37, 99, 235, 0.45);
  background: rgba(37, 99, 235, 0.10);
  color: var(--primary, #2563eb);
}

.lk-actions__link--search .lk-actions__link-icon {
  background: rgba(37, 99, 235, 0.24);
}

.lk-actions__link--search:hover,
.lk-actions__link--search:focus-visible {
  background: rgba(37, 99, 235, 0.22);
}

/* 🟢 Listes (words / verbs / expressions) : tint vert soft */
.lk-actions__link--list {
  border-color: rgba(16, 185, 129, 0.45);
  background: rgba(16, 185, 129, 0.10);
  color: #047857;
}

.lk-actions__link--list .lk-actions__link-icon {
  background: rgba(16, 185, 129, 0.24);
}

.lk-actions__link--list:hover,
.lk-actions__link--list:focus-visible {
  background: rgba(16, 185, 129, 0.22);
}

/* 🟠 Contrib : tint ambre soft */
.lk-actions__link--contrib {
  border-color: rgba(245, 158, 11, 0.5);
  background: rgba(245, 158, 11, 0.10);
  color: #b45309;
}

.lk-actions__link--contrib .lk-actions__link-icon {
  background: rgba(245, 158, 11, 0.24);
}

.lk-actions__link--contrib:hover,
.lk-actions__link--contrib:focus-visible {
  background: rgba(245, 158, 11, 0.22);
}

/* 🔵 Home = gros CTA bleu, mais sans flash blanc en dark */
.lk-actions__link--home {
  background: var(--primary, #2563eb);
  border-color: var(--primary, #2563eb);
  color: #f9fafb;
}

.lk-actions__link--home .lk-actions__link-icon {
  background: rgba(15, 23, 42, 0.28);
  color: #f9fafb;
}

.lk-actions__link--home:hover,
.lk-actions__link--home:focus-visible {
  background: #1d4ed8;
  border-color: #1d4ed8;
}
.lk-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.lk-actions__pill {
  background: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
}

.lk-actions__link {
  background: var(--surface-elevated, #ffffff);
  color: var(--color-text, #111827);
}
.lk-actions__pill:focus-visible,
.lk-actions__link:focus-visible {
  outline: 2px solid var(--primary, #2563eb);
  outline-offset: 2px;
  box-shadow:
    0 0 0 2px rgba(37, 99, 235, 0.35),
    0 12px 28px rgba(15, 23, 42, 0.22);
  transform: translateY(-1px);
}
.lk-actions__pill i,
.lk-actions__link-icon i {
  font-smooth: antialiased;
  -webkit-font-smoothing: antialiased;
}



</style>
