<template>
  <nav
    class="lk-nav"
    role="navigation"
    aria-label="Barre de navigation principale"
  >
    <div class="lk-nav__inner">
      <!-- Logo / Home -->
      <NuxtLink
        to="/"
        class="lk-nav__brand"
        aria-label="Lexikongo — Accueil"
      >
        <Logo />
      </NuxtLink>

      <!-- Section droite (desktop) -->
      <div class="lk-nav__right lk-nav__right--desktop">
        <ul class="lk-nav__links">
          <li v-for="link in mainLinks" :key="link.to" class="lk-nav__item">
            <NuxtLink
              :to="link.to"
              class="lk-nav__link"
            >
              <i :class="link.icon" aria-hidden="true"></i>
              <span>{{ t(link.labelKey) }}</span>
            </NuxtLink>
          </li>

          <!-- Rôles -->
          <template v-if="isLoggedIn">
            <li
              v-if="userRoles.includes('user')"
              class="lk-nav__item"
            >
              <NuxtLink
                to="/user/profile"
                class="lk-nav__link"
              >
                <i class="fas fa-user-check" aria-hidden="true"></i>
                <span>{{ t('nav.dashboard') }}</span>
              </NuxtLink>
            </li>
            <li
              v-if="userRoles.includes('contributor')"
              class="lk-nav__item"
            >
              <NuxtLink
                to="/contributor"
                class="lk-nav__link"
              >
                <i class="fas fa-tasks" aria-hidden="true"></i>
                <span>{{ t('nav.contributor') }}</span>
              </NuxtLink>
            </li>
            <li
              v-if="userRoles.includes('admin')"
              class="lk-nav__item"
            >
              <NuxtLink
                to="/admin"
                class="lk-nav__link"
              >
                <i class="fas fa-tools" aria-hidden="true"></i>
                <span>{{ t('nav.admin') }}</span>
              </NuxtLink>
            </li>
          </template>
        </ul>

        <!-- Profil + Auth -->
        <div class="lk-nav__auth">
          <NuxtLink
            v-if="isLoggedIn"
            :to="`/user/profile/${username}`"
            class="lk-nav__user"
            :title="t('nav.profileTitle')"
          >
            <i class="fas fa-user-circle" aria-hidden="true"></i>
            <span class="lk-nav__user-name">
              {{ username }}
            </span>
          </NuxtLink>

          <NuxtLink
            v-if="!isLoggedIn"
            to="/login"
            class="lk-nav__btn lk-nav__btn--outline"
          >
            <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
            <span>{{ t('nav.login') }}</span>
          </NuxtLink>

          <button
            v-else
            type="button"
            class="lk-nav__btn lk-nav__btn--ghost"
            @click="logout"
          >
            <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
            <span>{{ t('nav.logout') }}</span>
          </button>
        </div>
      </div>

      <!-- Bouton hamburger (mobile) -->
      <button
        class="lk-nav__toggle"
        type="button"
        @click="toggleMenu"
        :aria-expanded="isMenuOpen.toString()"
        aria-controls="lk-nav-panel"
        :aria-label="isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')"
      >
        <span class="lk-nav__toggle-line" />
        <span class="lk-nav__toggle-line" />
        <span class="lk-nav__toggle-line" />
      </button>
    </div>

    <!-- Panel mobile -->
    <transition name="lk-nav-panel">
      <div
        v-if="isMenuOpen"
        id="lk-nav-panel"
        class="lk-nav__panel"
      >
        <ul class="lk-nav__panel-links">
          <li
            v-for="link in mainLinks"
            :key="link.to"
            class="lk-nav__panel-item"
          >
            <NuxtLink
              :to="link.to"
              class="lk-nav__panel-link"
              @click="closeMenu"
            >
              <i :class="link.icon" aria-hidden="true"></i>
              <span>{{ t(link.labelKey) }}</span>
            </NuxtLink>
          </li>

          <template v-if="isLoggedIn">
            <li
              v-if="userRoles.includes('user')"
              class="lk-nav__panel-item"
            >
              <NuxtLink
                to="/user/profile"
                class="lk-nav__panel-link"
                @click="closeMenu"
              >
                <i class="fas fa-user-check" aria-hidden="true"></i>
                <span>{{ t('nav.dashboard') }}</span>
              </NuxtLink>
            </li>
            <li
              v-if="userRoles.includes('contributor')"
              class="lk-nav__panel-item"
            >
              <NuxtLink
                to="/contributor"
                class="lk-nav__panel-link"
                @click="closeMenu"
              >
                <i class="fas fa-tasks" aria-hidden="true"></i>
                <span>{{ t('nav.contributor') }}</span>
              </NuxtLink>
            </li>
            <li
              v-if="userRoles.includes('admin')"
              class="lk-nav__panel-item"
            >
              <NuxtLink
                to="/admin"
                class="lk-nav__panel-link"
                @click="closeMenu"
              >
                <i class="fas fa-tools" aria-hidden="true"></i>
                <span>{{ t('nav.admin') }}</span>
              </NuxtLink>
            </li>
          </template>
        </ul>

        <div class="lk-nav__panel-auth">
          <NuxtLink
            v-if="isLoggedIn"
            :to="`/user/profile/${username}`"
            class="lk-nav__panel-user"
            @click="closeMenu"
          >
            <i class="fas fa-user-circle" aria-hidden="true"></i>
            <div class="lk-nav__panel-user-text">
              <span class="lk-nav__panel-user-label">
                {{ t('nav.connectedAs') }}
              </span>
              <span class="lk-nav__panel-user-name">
                {{ username }}
              </span>
            </div>
          </NuxtLink>

          <NuxtLink
            v-if="!isLoggedIn"
            to="/login"
            class="lk-nav__panel-btn lk-nav__panel-btn--solid"
            @click="closeMenu"
          >
            <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
            <span>{{ t('nav.login') }}</span>
          </NuxtLink>

          <button
            v-else
            type="button"
            class="lk-nav__panel-btn lk-nav__panel-btn--ghost"
            @click="handleLogoutFromPanel"
          >
            <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
            <span>{{ t('nav.logout') }}</span>
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/authStore';
import Logo from '@/components/Logo.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

const isMenuOpen = ref(false);

const isLoggedIn = computed(() => authStore.isLoggedIn);
const userRoles = computed(() => authStore.userRoles || []);
const username = computed(() => authStore.user?.username || 'Utilisateur');

// liens principaux
const mainLinks = [
  { to: '/', icon: 'fas fa-home', labelKey: 'nav.home' },
  { to: '/words', icon: 'fas fa-spell-check', labelKey: 'nav.words' },
  { to: '/verbs', icon: 'fa-solid fa-arrow-down-a-z', labelKey: 'nav.verbs' },
  { to: '/expressions', icon: 'fas fa-book', labelKey: 'nav.expressions' },
  { to: '/documentation/for-contributors', icon: 'fas fa-hands-helping', labelKey: 'nav.contribute' },
];

onMounted(() => {
  authStore.checkAuth();
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};

const handleLogoutFromPanel = async () => {
  await logout();
  closeMenu();
};
</script>

<style scoped>
.lk-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid rgba(148, 163, 184, 0.4);
  background-color: var(--surface-elevated, #ffffff);
  backdrop-filter: blur(10px);
}

.lk-nav__inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0.6rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand */
.lk-nav__brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

/* Desktop right section */
.lk-nav__right {
  display: none;
  align-items: center;
  gap: 1.25rem;
}

.lk-nav__links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.lk-nav__item {
  margin: 0;
}

.lk-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.94rem;
  font-weight: 500;
  color: var(--muted-text, #4b5563);
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease;
}

.lk-nav__link i {
  font-size: 0.9rem;
}

.lk-nav__link:hover,
.lk-nav__link:focus-visible {
  background: rgba(13, 110, 253, 0.08);
  color: var(--primary, #0d6efd);
  transform: translateY(-1px);
}

/* Auth desktop */
.lk-nav__auth {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lk-nav__user {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.9rem;
  color: var(--text-default, #111827);
  text-decoration: none;
  background: rgba(148, 163, 184, 0.14);
}

.lk-nav__user i {
  font-size: 1rem;
}

.lk-nav__btn {
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  background: none;
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease,
    border-color 0.15s ease;
}

.lk-nav__btn--outline {
  border-color: rgba(13, 110, 253, 0.6);
  color: var(--primary, #0d6efd);
}

.lk-nav__btn--ghost {
  color: var(--muted-text, #4b5563);
}

.lk-nav__btn:hover,
.lk-nav__btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

.lk-nav__btn--outline:hover,
.lk-nav__btn--outline:focus-visible {
  background: var(--primary, #0d6efd);
  color: #fff;
}

.lk-nav__btn--ghost:hover,
.lk-nav__btn--ghost:focus-visible {
  background: rgba(148, 163, 184, 0.16);
}

/* Hamburger (mobile) */
.lk-nav__toggle {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  padding: 0;
}

.lk-nav__toggle-line {
  width: 16px;
  height: 2px;
  border-radius: 999px;
  background: var(--text-default, #111827);
  margin: 0 auto;
}

/* Panel mobile */
.lk-nav__panel {
  border-top: 1px solid rgba(148, 163, 184, 0.4);
  background: var(--surface, #f9fafb);
  padding: 0.75rem 1.2rem 1rem;
}

.lk-nav__panel-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.lk-nav__panel-item {
  margin: 0;
}

.lk-nav__panel-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.2rem;
  font-size: 0.95rem;
  color: var(--text-default, #111827);
  text-decoration: none;
}

.lk-nav__panel-link i {
  width: 1.1rem;
  text-align: center;
  color: var(--primary, #0d6efd);
}

.lk-nav__panel-link:hover,
.lk-nav__panel-link:focus-visible {
  color: var(--primary, #0d6efd);
}

/* Auth mobile */
.lk-nav__panel-auth {
  margin-top: 0.75rem;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  padding-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.lk-nav__panel-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-default, #111827);
}

.lk-nav__panel-user i {
  font-size: 1.1rem;
}

.lk-nav__panel-user-label {
  font-size: 0.8rem;
  color: var(--muted-text, #6b7280);
}

.lk-nav__panel-user-name {
  font-size: 0.95rem;
  font-weight: 500;
}

.lk-nav__panel-btn {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.45rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  background: none;
  text-align: left;
}

.lk-nav__panel-btn--solid {
  background: var(--primary, #0d6efd);
  color: #fff;
  border-color: transparent;
}

.lk-nav__panel-btn--ghost {
  color: var(--muted-text, #4b5563);
  border-color: rgba(148, 163, 184, 0.6);
}

.lk-nav__panel-btn:hover,
.lk-nav__panel-btn:focus-visible {
  outline: none;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

/* Transition panel */
.lk-nav-panel-enter-active,
.lk-nav-panel-leave-active {
  transition: max-height 0.18s ease, opacity 0.18s ease;
}
.lk-nav-panel-enter-from,
.lk-nav-panel-leave-to {
  max-height: 0;
  opacity: 0;
}
.lk-nav-panel-enter-to,
.lk-nav-panel-leave-from {
  max-height: 260px;
  opacity: 1;
}

/* Responsif */
@media (min-width: 768px) {
  .lk-nav__right--desktop {
    display: flex;
  }

  .lk-nav__toggle {
    display: none;
  }

  .lk-nav__panel {
    display: none;
  }
}
</style>
