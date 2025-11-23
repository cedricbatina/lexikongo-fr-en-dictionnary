<template>
  <main
    class="login-container"
    aria-labelledby="login-title"
    aria-busy="false"
  >
    <h1 id="login-title">Connexion</h1>

    <form
      @submit.prevent="login"
      class="login-form"
      novalidate
    >
      <div class="form-group">
        <label for="login-identifier">Email ou nom d'utilisateur</label>
        <input
          id="login-identifier"
          v-model="identifier"
          type="text"
          required
          autocomplete="username"
          placeholder="Entrez votre email ou nom d'utilisateur"
        />
      </div>

      <div class="form-group">
        <label for="login-password">Mot de passe</label>
        <div class="password-wrapper">
          <input
            id="login-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            autocomplete="current-password"
            placeholder="Entrez votre mot de passe"
            :aria-invalid="error ? 'true' : 'false'"
            :aria-describedby="error ? 'login-error' : undefined"
          />
          <button
            type="button"
            class="toggle-password"
            @click="togglePassword"
            :aria-pressed="showPassword ? 'true' : 'false'"
            :aria-label="showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'"
          >
            {{ showPassword ? "Cacher" : "Voir" }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isLoading"
        >
          {{ isLoading ? "Connexion..." : "Connexion" }}
        </button>
      </div>

      <div
        v-if="error"
        id="login-error"
        class="error"
        role="alert"
        aria-live="assertive"
      >
        {{ error }}
      </div>

      <div class="form-links">
        <nuxt-link to="/register">Créer un compte</nuxt-link>
        |
        <nuxt-link to="/forgot-password">Mot de passe oublié ?</nuxt-link>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/authStore";

const identifier = ref(""); // email OU username
const password = ref("");
const showPassword = ref(false);
const error = ref("");

const router = useRouter();
const authStore = useAuthStore();

// on réutilise l'état "pending" du store
const isLoading = computed(() => authStore.pending);

const login = async () => {
  error.value = "";

  const trimmedIdentifier = identifier.value.trim();
  if (!trimmedIdentifier || !password.value) {
    error.value = "Veuillez remplir tous les champs.";
    return;
  }

  try {
    const { ok, error: loginError } = await authStore.login({
      identifier: trimmedIdentifier,
      password: password.value,
    });

    if (!ok) {
      error.value =
        loginError ||
        authStore.error ||
        "Échec de la connexion. Veuillez vérifier vos identifiants.";
      return;
    }

    // Redirection dynamique
    const currentRoute = router.currentRoute.value;
    const redirectPath = currentRoute?.query?.redirect || null;

    if (redirectPath) {
      await router.push(redirectPath);
      return;
    }

    // Utilise les getters de rôles du store
    if (authStore.hasRole("admin")) {
      await router.push("/admin");
    } else if (authStore.hasRole("contributor")) {
      await router.push("/contributor");
    } else {
      await router.push("/user");
    }
  } catch (err) {
    console.error("Erreur lors de la tentative de connexion :", err);
    error.value =
      err?.message || "Une erreur est survenue lors de la connexion.";
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.login-container h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  width: 100%;
  padding-right: 60px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  text-align: center;
  margin-top: 1rem;
}

.form-links {
  margin-top: 1rem;
  text-align: center;
}

.form-links a {
  color: #007bff;
  text-decoration: none;
}

.form-links a:hover {
  text-decoration: underline;
}
</style>
