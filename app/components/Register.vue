<template>
  <section
    class="lk-auth"
    aria-labelledby="register-title"
    :aria-busy="isLoading ? 'true' : 'false'"
  >
    <div class="lk-auth__card">
      <!-- En-tête -->
      <header class="lk-auth__header">
        <h1
          id="register-title"
          class="lk-auth__title"
        >
          {{ tt('auth.register.title', "Créer un compte") }}
        </h1>
        <p class="lk-auth__subtitle">
          {{
            tt(
              'auth.register.subtitle',
              "Rejoignez Lexikongo pour contribuer au dictionnaire Kikongo."
            )
          }}
        </p>
      </header>

      <!-- Formulaire -->
      <form
        class="lk-auth__form"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <!-- Nom d'utilisateur -->
        <div class="lk-auth__field">
          <label
            for="register-username"
            class="lk-auth__label"
          >
            {{ tt('auth.register.usernameLabel', "Nom d'utilisateur") }}
          </label>
<input
  id="register-username"
  v-model.trim="username"
  type="text"
  class="lk-auth__input"
  required
  autocomplete="username"
  :placeholder="tt(
    'auth.register.usernamePlaceholder',
    'Entrez votre nom d\'utilisateur'
  )"
  :disabled="isLoading"
/>

        </div>

        <!-- Email -->
        <div class="lk-auth__field">
          <label
            for="register-email"
            class="lk-auth__label"
          >
            {{ tt('auth.register.emailLabel', 'Email') }}
          </label>

          <input
            id="register-email"
            v-model.trim="email"
            type="email"
            class="lk-auth__input"
            required
            autocomplete="email"
            :placeholder="tt(
              'auth.register.emailPlaceholder',
              'Entrez votre adresse email'
            )"
            :disabled="isLoading"
          />
        </div>

        <!-- Mot de passe -->
        <div class="lk-auth__field">
          <label
            for="register-password"
            class="lk-auth__label"
          >
            {{ tt('auth.register.passwordLabel', 'Mot de passe') }}
          </label>

          <div class="lk-auth__password-wrapper">
            <input
              id="register-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="lk-auth__input lk-auth__input--password"
              required
              autocomplete="new-password"
              :placeholder="tt(
                'auth.register.passwordPlaceholder',
                'Choisissez un mot de passe sécurisé'
              )"
              :aria-invalid="error ? 'true' : 'false'"
              :aria-describedby="error ? 'register-error' : undefined"
              :disabled="isLoading"
            />

            <button
              type="button"
              class="lk-auth__toggle-password"
              @click="togglePassword"
              :aria-pressed="showPassword ? 'true' : 'false'"
              :aria-label="
                showPassword
                  ? tt('auth.login.hidePassword', 'Cacher le mot de passe')
                  : tt('auth.login.showPassword', 'Afficher le mot de passe')
              "
            >
              <i
                :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                aria-hidden="true"
              />
              <span class="lk-auth__toggle-password-text">
                {{
                  showPassword
                    ? tt('auth.login.hidePasswordText', 'Cacher')
                    : tt('auth.login.showPasswordText', 'Voir')
                }}
              </span>
            </button>
          </div>
        </div>

        <!-- Bouton submit -->
        <div class="lk-auth__actions">
          <button
            type="submit"
            class="lk-auth__submit"
            :disabled="isLoading"
          >
            <i
              class="fas fa-user-plus"
              aria-hidden="true"
            />
            <span v-if="isLoading">
              {{ tt('auth.register.submitting', 'Inscription…') }}
            </span>
            <span v-else>
              {{ tt('auth.register.submit', "S'inscrire") }}
            </span>
          </button>
        </div>

        <!-- Erreur globale -->
        <p
          v-if="error"
          id="register-error"
          class="lk-auth__error"
          role="alert"
          aria-live="assertive"
        >
          {{ error }}
        </p>

        <!-- Message succès -->
        <p
          v-if="success"
          class="lk-auth__success"
          role="status"
          aria-live="polite"
        >
          {{ success }}
        </p>

        <!-- Liens secondaires -->
        <div class="lk-auth__links">
          <NuxtLink
            to="/login"
            class="lk-auth__link"
          >
            {{ tt('auth.register.loginLink', 'Déjà un compte ? Connexion') }}
          </NuxtLink>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

// Champs
const username = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);

const error = ref('');
const success = ref('');
const isLoading = ref(false);

// helper i18n avec fallback lisible
const tt = (key, fallback) => {
  const res = t(key);
  return res === key ? fallback : res;
};

const handleSubmit = async () => {
  error.value = '';
  success.value = '';

  const u = username.value.trim();
  const e = email.value.trim();
  const p = password.value;

  if (!u || !e || !p) {
    error.value = tt(
      'auth.register.error.requiredFields',
      'Veuillez remplir tous les champs.'
    );
    return;
  }

  // Petit check email (optionnel, mais utile côté UX)
  if (!e.includes('@') || !e.includes('.')) {
    error.value = tt(
      'auth.register.error.invalidEmail',
      'Veuillez saisir une adresse email valide.'
    );
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: u,
        email: e,
        password: p,
      }),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      // si le backend ne renvoie pas de JSON propre, on ignore
    }

    if (!response.ok) {
      const message =
        data?.statusMessage ||
        data?.message ||
        `${tt('auth.register.error.http', 'Erreur HTTP')} ${response.status}`;
      throw new Error(message);
    }

    if (data?.success) {
      success.value =
        data?.message ||
        tt(
          'auth.register.success.message',
          "Inscription réussie ! Veuillez vérifier votre email pour valider votre compte."
        );

      // Petite redirection après un court délai, comme dans ta version
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      throw new Error(
        data?.message ||
          tt(
            'auth.register.error.generic',
            "L'inscription a échoué. Veuillez réessayer."
          )
      );
    }
  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);
    error.value =
      err?.message ||
      tt(
        'auth.register.error.generic',
        "Une erreur est survenue pendant l'inscription."
      );
  } finally {
    isLoading.value = false;
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.lk-auth {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2.5rem 1.25rem;
}

.lk-auth__card {
  width: 100%;
  max-width: 420px;
  border-radius: 1rem;
  padding: 1.75rem 1.5rem;
  background: var(--surface-elevated, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
}

/* Header */
.lk-auth__header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.lk-auth__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-default, #111827);
}

.lk-auth__subtitle {
  margin: 0.4rem 0 0;
  font-size: 0.95rem;
  color: var(--text-muted, #6b7280);
}

/* Form */
.lk-auth__form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.lk-auth__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lk-auth__label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-default, #111827);
}

.lk-auth__input {
  width: 100%;
  padding: 0.55rem 0.8rem;
  border-radius: 0.7rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.9));
  font-size: 0.95rem;
  color: var(--text-default, #111827);
  background: var(--surface-default, #f9fafb);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease;
}

.lk-auth__input:focus-visible {
  outline: none;
  border-color: var(--primary, #2563eb);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.4);
  background: #ffffff;
}

/* Password wrapper */
.lk-auth__password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.lk-auth__input--password {
  padding-right: 3.2rem;
}

.lk-auth__toggle-password {
  position: absolute;
  right: 0.35rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.78rem;
  color: var(--primary, #2563eb);
  cursor: pointer;
}

.lk-auth__toggle-password:hover,
.lk-auth__toggle-password:focus-visible {
  background: rgba(37, 99, 235, 0.08);
  outline: none;
}

.lk-auth__toggle-password-text {
  display: none;
}

@media (min-width: 480px) {
  .lk-auth__toggle-password-text {
    display: inline;
  }
}

/* Actions */
.lk-auth__actions {
  margin-top: 0.25rem;
}

.lk-auth__submit {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: var(--primary, #2563eb);
  color: #ffffff;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease;
}

.lk-auth__submit i {
  font-size: 0.95rem;
}

.lk-auth__submit:hover,
.lk-auth__submit:focus-visible {
  outline: none;
  background: #1d4ed8;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.25);
  transform: translateY(-1px);
}

.lk-auth__submit:disabled {
  cursor: progress;
  opacity: 0.85;
  transform: none;
  box-shadow: none;
}

/* Erreurs / succès */
.lk-auth__error {
  margin: 0.25rem 0 0;
  font-size: 0.88rem;
  color: #b91c1c;
  background: rgba(248, 113, 113, 0.18);
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
}

.lk-auth__success {
  margin: 0.4rem 0 0;
  font-size: 0.88rem;
  color: #166534;
  background: rgba(34, 197, 94, 0.16);
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
}

/* Liens secondaires */
.lk-auth__links {
  margin-top: 0.9rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.88rem;
  color: var(--text-muted, #6b7280);
}

.lk-auth__link {
  color: var(--primary, #2563eb);
  text-decoration: none;
}

.lk-auth__link:hover,
.lk-auth__link:focus-visible {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .lk-auth {
    padding-inline: 1rem;
  }

  .lk-auth__card {
    padding: 1.4rem 1.2rem;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  }
}
</style>
