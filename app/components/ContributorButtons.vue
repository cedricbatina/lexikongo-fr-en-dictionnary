<template>
  <!-- On n'affiche les boutons que pour les contributeurs -->
  <div
    v-if="isContributor"
    class="lk-actions"
    aria-label="Actions contributeur Lexikongo"
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
      class="lk-actions__btn lk-actions__btn--ghost"
      @click="goContributorBoard"
    >
      <i class="fas fa-user-cog" aria-hidden="true"></i>
      <span>Espace contributeur</span>
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

// S'appuie sur userRoles du store (array) avec fallback []
const isContributor = computed(() => {
  const roles = authStore.userRoles || [];
  return Array.isArray(roles) && roles.includes('contributor');
});

const addVerb = () => {
  router.push('/contributor/add/verb');
};

const addWord = () => {
  router.push('/contributor/add/word');
};

const goHome = () => {
  router.push('/');
};

const goContributorBoard = () => {
  router.push('/contributor');
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

/* Responsive */
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
