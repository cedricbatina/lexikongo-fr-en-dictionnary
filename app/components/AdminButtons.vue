<template>
  <!-- Visible uniquement pour les admins -->
  <div
    v-if="isAdmin"
    class="lk-admin"
    aria-label="Actions administrateur Lexikongo"
  >
    <button
      type="button"
      class="lk-admin__btn lk-admin__btn--primary"
      @click="addWord"
    >
      <i class="fas fa-spell-check" aria-hidden="true"></i>
      <span>Ajouter un mot</span>
    </button>

    <button
      type="button"
      class="lk-admin__btn lk-admin__btn--success"
      @click="addVerb"
    >
      <i class="fa-solid fa-arrow-down-a-z" aria-hidden="true"></i>
      <span>Ajouter un verbe</span>
    </button>

    <button
      type="button"
      class="lk-admin__btn lk-admin__btn--accent"
      @click="addUser"
    >
      <i class="fas fa-user-plus" aria-hidden="true"></i>
      <span>Ajouter un utilisateur</span>
    </button>

    <button
      type="button"
      class="lk-admin__btn lk-admin__btn--ghost"
      @click="goHome"
    >
      <i class="fas fa-home" aria-hidden="true"></i>
      <span>Retour à l'accueil</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const router = useRouter();

// On utilise userRoles (array) avec fallback []
const isAdmin = computed(() => {
  const roles = authStore.userRoles || [];
  return Array.isArray(roles) && roles.includes("admin");
});

const addVerb = () => {
  router.push("/admin/admin/add/verb");
};

const addWord = () => {
  router.push("/admin/admin/add/word");
};

const addUser = () => {
  router.push("/admin/admin/add/user");
};

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.lk-admin {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Boutons génériques */
.lk-admin__btn {
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

.lk-admin__btn i {
  font-size: 0.9rem;
}

/* Variantes */
.lk-admin__btn--primary {
  background: #0d6efd;
  border-color: #0d6efd;
  color: #ffffff;
}

.lk-admin__btn--success {
  background: #16a34a;
  border-color: #16a34a;
  color: #ffffff;
}

.lk-admin__btn--accent {
  background: #e11d48; /* rouge/rose pour action sensible (utilisateurs) */
  border-color: #e11d48;
  color: #ffffff;
}

.lk-admin__btn--ghost {
  background: #ffffff;
  border-color: rgba(148, 163, 184, 0.7);
  color: #111827;
}

/* Hover / focus */
.lk-admin__btn:hover,
.lk-admin__btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
}

.lk-admin__btn--primary:hover,
.lk-admin__btn--primary:focus-visible {
  box-shadow: 0 10px 24px rgba(13, 110, 253, 0.45);
}

.lk-admin__btn--success:hover,
.lk-admin__btn--success:focus-visible {
  box-shadow: 0 10px 24px rgba(22, 163, 74, 0.45);
}

.lk-admin__btn--accent:hover,
.lk-admin__btn--accent:focus-visible {
  box-shadow: 0 10px 24px rgba(225, 29, 72, 0.45);
}

/* Responsive mobile-first */
@media (max-width: 640px) {
  .lk-admin {
    flex-direction: column;
    align-items: stretch;
  }

  .lk-admin__btn {
    justify-content: center;
  }
}
</style>
