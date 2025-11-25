<template>
  <!-- Conteneur principal : complément au contenu, pas le contenu central -->
  <aside
    class="lk-actions"
    :aria-label="t('actionsBar.global.ariaLabel')"
  >
    <!-- 1) Groupe ADMIN (prioritaire si admin) -->
    <section
      v-if="isAdmin"
      class="lk-actions__group lk-actions__group--admin"
      role="region"
      :aria-label="t('actionsBar.admin.ariaLabel')"
    >
      <h2 class="lk-actions__group-title">
        {{ t('actionsBar.admin.title') }}
      </h2>

      <ul class="lk-actions__list">
        <li>
          <button
            type="button"
            class="lk-actions__btn lk-actions__btn--primary"
            @click="goAdminAddWord"
          >
            <i class="fas fa-spell-check" aria-hidden="true"></i>
            <span>{{ t('actionsBar.admin.addWord') }}</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            class="lk-actions__btn lk-actions__btn--success"
            @click="goAdminAddVerb"
          >
            <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true"></i>
            <span>{{ t('actionsBar.admin.addVerb') }}</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            class="lk-actions__btn lk-actions__btn--accent"
            @click="goAdminAddUser"
          >
            <i class="fas fa-user-plus" aria-hidden="true"></i>
            <span>{{ t('actionsBar.admin.addUser') }}</span>
          </button>
        </li>

        <!-- Espace contributeur accessible même si admin -->
        <li>
          <button
            type="button"
            class="lk-actions__btn lk-actions__btn--ghost"
            @click="goContributorBoard"
          >
            <i class="fas fa-user-cog" aria-hidden="true"></i>
            <span>{{ t('actionsBar.contrib.board') }}</span>
          </button>
        </li>
      </ul>
    </section>

    <!-- 2) Groupe CONTRIBUTEUR (uniquement si contributeur et pas admin) -->
    <section
      v-else-if="isContributor"
      class="lk-actions__group lk-actions__group--contrib"
      role="region"
      :aria-label="t('actionsBar.contrib.ariaLabel')"
    >
      <h2 class="lk-actions__group-title">
        {{ t('actionsBar.contrib.title') }}
      </h2>

      <ul class="lk-actions__list">
        <li>
          <button
            type="button"
            class="lk-actions__btn lk-actions__btn--primary"
            @click="goContribAddWord"
          >
            <i class="fas fa-spell-check" aria-hidden="true"></i>
            <span>{{ t('actionsBar.contrib.addWord') }}</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            class="lk-actions__btn lk-actions__btn--success"
            @click="goContribAddVerb"
          >
            <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true"></i>
            <span>{{ t('actionsBar.contrib.addVerb') }}</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            class="lk-actions__btn lk-actions__btn--ghost"
            @click="goContributorBoard"
          >
            <i class="fas fa-user-cog" aria-hidden="true"></i>
            <span>{{ t('actionsBar.contrib.board') }}</span>
          </button>
        </li>
      </ul>
    </section>

    <!-- 3) Raccourcis de navigation (toujours affichés) -->
    <nav
      class="lk-actions__group lk-actions__group--shortcuts"
      role="navigation"
      :aria-label="t('actionsBar.shortcuts.ariaLabel')"
    >
      <h2 class="lk-actions__group-title lk-actions__group-title--shortcuts">
        {{ t('actionsBar.shortcuts.title') }}
      </h2>

      <ul class="lk-actions__list lk-actions__list--shortcuts">
        <li>
          <NuxtLink
            to="/search/words"
            class="lk-actions__link lk-actions__link--primary"
          >
            <i class="fa fa-search" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.searchWords') }}</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/search/verbs"
            class="lk-actions__link lk-actions__link--success"
          >
            <i class="fa fa-search" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.searchVerbs') }}</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/words"
            class="lk-actions__link lk-actions__link--primary"
          >
            <i class="fas fa-spell-check" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.listWords') }}</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/verbs"
            class="lk-actions__link lk-actions__link--success"
          >
            <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.listVerbs') }}</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/expressions"
            class="lk-actions__link lk-actions__link--info"
          >
            <i class="fas fa-book" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.listExpressions') }}</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/documentation/for-contributors"
            class="lk-actions__link lk-actions__link--success"
          >
            <i class="fas fa-hands-helping" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.contribute') }}</span>
          </NuxtLink>
        </li>

        <!-- Retour à l'accueil UNIQUEMENT ici -->
        <li class="lk-actions__list-item-full">
          <NuxtLink
            to="/"
            class="lk-actions__link lk-actions__link--secondary"
          >
            <i class="fas fa-home" aria-hidden="true"></i>
            <span>{{ t('actionsBar.common.backHome') }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
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

// Pour être safe : on regarde d'abord authStore.roles, puis authStore.userRoles
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

// Si admin, on ne montre pas le bloc contrib (mais bouton "Espace contributeur")
const isContributor = computed(
  () => !isAdmin.value && roles.value.includes('contributor'),
);

// Actions admin
const goAdminAddWord = () => {
  router.push('/admin/admin/add/word');
};
const goAdminAddVerb = () => {
  router.push('/admin/admin/add/verb');
};
const goAdminAddUser = () => {
  router.push('/admin/admin/add/user');
};

// Actions contributeur
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
  gap: 0.9rem;
}

/* Groupes */
.lk-actions__group {
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.5));
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
}

.lk-actions__group--admin {
  border-left: 3px solid var(--primary, #2563eb);
}

.lk-actions__group--contrib {
  border-left: 3px solid #16a34a;
}

.lk-actions__group--shortcuts {
  background: var(--surface-default, #f9fafb);
  border-style: dashed;
}

/* Titres de groupe */
.lk-actions__group-title {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.lk-actions__group-title--shortcuts {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #6b7280);
}

/* Listes */
.lk-actions__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.lk-actions__list--shortcuts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem;
}

.lk-actions__list-item-full {
  grid-column: 1 / -1;
}

/* Boutons admin/contrib */
.lk-actions__btn {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.45rem 0.9rem;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  color: var(--text-default, #111827);
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease,
    border-color 0.15s ease;
}

.lk-actions__btn i {
  font-size: 0.9rem;
}

.lk-actions__btn--primary {
  background: var(--primary, #2563eb);
  color: #fff;
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.4);
}

.lk-actions__btn--success {
  background: #16a34a;
  color: #fff;
  box-shadow: 0 12px 28px rgba(22, 163, 74, 0.4);
}

.lk-actions__btn--accent {
  background: #0f766e;
  color: #fff;
  box-shadow: 0 12px 28px rgba(15, 118, 110, 0.38);
}

.lk-actions__btn--ghost {
  border-color: rgba(148, 163, 184, 0.8);
  background: var(--surface-default, #f9fafb);
  color: var(--text-default, #111827);
}

.lk-actions__btn:hover,
.lk-actions__btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
}

/* Liens raccourcis : bien colorés, bon contraste light/dark */
.lk-actions__link {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.4rem;
  width: 100%;
  padding: 0.45rem 0.8rem;
  border-radius: 0.9rem;
  font-size: 0.86rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid transparent;
  background: rgba(15, 23, 42, 0.02);
  color: var(--color-text, #111827);
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease,
    border-color 0.15s ease;
}

.lk-actions__link i {
  width: 1.1rem;
  text-align: center;
}

/* Variantes : on force des couleurs lisibles, même en dark mode */
.lk-actions__link--primary {
  border-color: rgba(37, 99, 235, 0.7);
  background: rgba(37, 99, 235, 0.12);
  color: var(--primary, #2563eb);
}

.lk-actions__link--success {
  border-color: rgba(22, 163, 74, 0.7);
  background: rgba(22, 163, 74, 0.12);
  color: #15803d;
}

.lk-actions__link--info {
  border-color: rgba(59, 130, 246, 0.75);
  background: rgba(59, 130, 246, 0.14);
  color: #1d4ed8;
}

.lk-actions__link--secondary {
  border-color: rgba(148, 163, 184, 0.95);
  background: rgba(15, 23, 42, 0.75);      /* fond plus sombre, bien visible en dark */
  color: var(--color-text, #f9fafb);       /* laisse le thème gérer la couleur de texte */
  font-weight: 600;
}


/* Effets hover/focus visibles */
.lk-actions__link:hover,
.lk-actions__link:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.2);
  background: rgba(255, 255, 255, 0.96);
}

/* En dark mode, les backgrounds restent assez lumineux via les rgba() ci-dessus,
   et les bordures restent bien visibles grâce aux opacités élevées. */

/* Responsive */
@media (max-width: 640px) {
  .lk-actions__list--shortcuts {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
