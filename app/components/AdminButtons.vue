<template>
  <!-- Visible uniquement pour les admins -->
  <div
    v-if="isAdmin"
    class="lk-actions"
    aria-label="Actions administrateur Lexikongo"
  >
    <button
      type="button"
      class="lk-actions__btn lk-actions__btn--primary"
      @click="addWord"
    >
      <i class="fas fa-spell-check" aria-hidden="true"></i>
      <span>Ajouter un mot</span>
    </button>

    <button
      type="button"
      class="lk-actions__btn lk-actions__btn--success"
      @click="addVerb"
    >
      <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true"></i>
      <span>Ajouter un verbe</span>
    </button>

    <button
      type="button"
      class="lk-actions__btn lk-actions__btn--accent"
      @click="addUser"
    >
      <i class="fas fa-user-plus" aria-hidden="true"></i>
      <span>Ajouter un utilisateur</span>
    </button>

    <button
      type="button"
      class="lk-actions__btn lk-actions__btn--ghost"
      @click="goHome"
    >
      <i class="fas fa-home" aria-hidden="true"></i>
      <span>Retour à l'accueil</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

// On utilise userRoles (array) avec fallback []
const isAdmin = computed(() => {
  const roles = authStore.userRoles || [];
  return Array.isArray(roles) && roles.includes('admin');
});

const addVerb = () => {
  router.push('/admin/admin/add/verb');
};

const addWord = () => {
  router.push('/admin/admin/add/word');
};

const addUser = () => {
  router.push('/admin/admin/add/user');
};

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.lk-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Boutons génériques */
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

/* Variantes */
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

/* Hover / focus */
.lk-actions__btn:hover,
.lk-actions__btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
}

.lk-actions__btn--primary:hover,
.lk-actions__btn--primary:focus-visible {
  box-shadow: 0 10px 24px rgba(13, 110, 253, 0.45);
}

.lk-actions__btn--success:hover,
.lk-actions__btn--success:focus-visible {
  box-shadow: 0 10px 24px rgba(22, 163, 74, 0.45);
}

.lk-actions__btn--accent:hover,
.lk-actions__btn--accent:focus-visible {
  box-shadow: 0 10px 24px rgba(225, 29, 72, 0.45);
}

/* Mobile */
@media (max-width: 640px) {
  .lk-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .lk-actions__btn {
    justify-content: center;
  }
}
</style>
