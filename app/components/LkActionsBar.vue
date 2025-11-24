<template>
  <!-- Conteneur principal : complément au contenu, pas le contenu central -->
  <aside
    class="lk-actions"
    :aria-label="t('actionsBar.global.ariaLabel')"
  >
    <!-- 1) Groupe ADMIN -->
    <section
      v-if="isAdmin"
      class="lk-actions__group lk-actions__group--admin"
      role="region"
      :aria-labelledby="adminTitleId"
    >
      <h2
        :id="adminTitleId"
        class="lk-actions__title lk-actions__title--visually-hidden"
      >
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

        <li>
          <button
            type="button"
            class="lk-actions__btn lk-actions__btn--ghost"
            @click="goHome"
          >
            <i class="fas fa-home" aria-hidden="true"></i>
            <span>{{ t('actionsBar.common.backHome') }}</span>
          </button>
        </li>
      </ul>
    </section>

    <!-- 2) Groupe CONTRIBUTEUR (indépendant de l'admin) -->
    <section
      v-if="isContributor"
      class="lk-actions__group lk-actions__group--contrib"
      role="region"
      :aria-labelledby="contribTitleId"
    >
      <h2
        :id="contribTitleId"
        class="lk-actions__title lk-actions__title--visually-hidden"
      >
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

        <!-- Pas obligé, mais cohérent d’offrir “Accueil” ici aussi -->
        <li>
          <button
            type="button"
            class="lk-actions__btn lk-actions__btn--ghost"
            @click="goHome"
          >
            <i class="fas fa-home" aria-hidden="true"></i>
            <span>{{ t('actionsBar.common.backHome') }}</span>
          </button>
        </li>
      </ul>
    </section>

    <!-- 3) Raccourcis de navigation (ex-SearchButtons) -->
    <nav
      class="lk-actions__group lk-actions__group--shortcuts"
      role="navigation"
      :aria-labelledby="shortcutsTitleId"
    >
      <h2
        :id="shortcutsTitleId"
        class="lk-actions__title lk-actions__title--visually-hidden"
      >
        {{ t('actionsBar.shortcuts.title') }}
      </h2>

      <ul class="lk-actions__list">
        <li>
          <NuxtLink
            to="/search/words"
            class="lk-actions__link lk-actions__link--outline-primary"
          >
            <i class="fa fa-search" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.searchWords') }}</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/search/verbs"
            class="lk-actions__link lk-actions__link--outline-success"
          >
            <i class="fa fa-search" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.searchVerbs') }}</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/words"
            class="lk-actions__link lk-actions__link--outline-primary"
          >
            <i class="fas fa-spell-check" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.listWords') }}</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/verbs"
            class="lk-actions__link lk-actions__link--outline-success"
          >
            <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.listVerbs') }}</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/expressions"
            class="lk-actions__link lk-actions__link--outline-info"
          >
            <i class="fas fa-book" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.listExpressions') }}</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/documentation/for-contributors"
            class="lk-actions__link lk-actions__link--outline-success"
          >
            <i class="fas fa-hands-helping" aria-hidden="true"></i>
            <span>{{ t('actionsBar.shortcuts.contribute') }}</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/"
            class="lk-actions__link lk-actions__link--outline-secondary"
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

// IDs stables pour aria-labelledby
const adminTitleId = 'lk-actions-admin-title';
const contribTitleId = 'lk-actions-contrib-title';
const shortcutsTitleId = 'lk-actions-shortcuts-title';

// Rôles
const isAdmin = computed(() => {
  const roles = authStore.userRoles || [];
  return Array.isArray(roles) && roles.includes('admin');
});

const isContributor = computed(() => {
  const roles = authStore.userRoles || [];
  return Array.isArray(roles) && roles.includes('contributor');
});

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

// Commun
const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.lk-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Chaque bloc (admin / contrib / raccourcis) */
.lk-actions__group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

/* Liste horizontale de boutons/liens */
.lk-actions__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.lk-actions__title--visually-hidden {
  /* SR-only local, scope-friendly */
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Boutons (admin & contrib) */
.lk-actions__btn {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.45rem 0.9rem;
  font-size: 0.88rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  background: #ffffff;
  color: #111827;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.lk-actions__btn i {
  font-size: 0.9rem;
}

/* Variantes de boutons */
.lk-actions__btn--primary {
  background: #0d6efd;
  border-color: #0d6efd;
  color: #ffffff;
}

.lk-actions__btn--success {
  background: #16a34a;
  border-color: #16a34a;
  color: #ffffff;
}

.lk-actions__btn--accent {
  background: #e11d48;
  border-color: #e11d48;
  color: #ffffff;
}

.lk-actions__btn--ghost {
  background: #ffffff;
  border-color: rgba(148, 163, 184, 0.7);
  color: #111827;
}

/* Focus / hover : focus-visible garde un repère clair */
.lk-actions__btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
}

.lk-actions__btn:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #bfdbfe;
}

/* Liens raccourcis */
.lk-actions__link {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.45rem 0.9rem;
  font-size: 0.88rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  background: #ffffff;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.lk-actions__link i {
  font-size: 0.9rem;
}

/* Variantes de liens outline */
.lk-actions__link--outline-primary {
  border-color: #0d6efd;
  color: #0d6efd;
}

.lk-actions__link--outline-success {
  border-color: #16a34a;
  color: #16a34a;
}

.lk-actions__link--outline-info {
  border-color: #0ea5e9;
  color: #0ea5e9;
}

.lk-actions__link--outline-secondary {
  border-color: #6b7280;
  color: #6b7280;
}

/* Hover / focus liens */
.lk-actions__link:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
}

.lk-actions__link--outline-primary:hover {
  background: #0d6efd;
  color: #ffffff;
}

.lk-actions__link--outline-success:hover {
  background: #16a34a;
  color: #ffffff;
}

.lk-actions__link--outline-info:hover {
  background: #0ea5e9;
  color: #ffffff;
}

.lk-actions__link--outline-secondary:hover {
  background: #6b7280;
  color: #ffffff;
}

.lk-actions__link:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #bfdbfe;
}

/* Responsive : stack sur mobile */
@media (max-width: 640px) {
  .lk-actions__list {
    flex-direction: column;
  }

  .lk-actions__btn,
  .lk-actions__link {
    justify-content: center;
  }
}
</style>
