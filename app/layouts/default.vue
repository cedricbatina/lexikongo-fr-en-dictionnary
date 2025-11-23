<template>
  <div class="layout-root">
    <header class="layout-header">
      <div class="layout-header-bar">
        <!-- Navbar gère le logo + les liens -->
        <Navbar />

        <!-- Bouton thème global, à droite -->
        <button
          type="button"
          class="theme-toggle__button"
          @click="toggleTheme"
        >
          <span class="theme-toggle__icon" aria-hidden="true">
            <i v-if="isDark" class="fas fa-sun" />
            <i v-else class="fas fa-moon" />
          </span>
          <span class="theme-toggle__label">
            {{ isDark ? "Mode clair" : "Mode sombre" }}
          </span>
        </button>
      </div>
    </header>

    <main id="main-content" class="layout-main">
      <slot />
    </main>

    <footer class="layout-footer">
      <!-- Tu pourras remettre <Footer /> ici si tu veux -->
      <!-- Footer Lexikongo -->
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Navbar from "~/components/Navbar.vue";

const theme = ref("light");

const applyTheme = (value) => {
  theme.value = value;

  if (typeof document !== "undefined") {
    const root = document.documentElement;

    if (value === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      // light = thème par défaut → on enlève l’attribut
      root.removeAttribute("data-theme");
    }

    try {
      localStorage.setItem("lxk-theme", value);
    } catch {
      // ignore si localStorage indispo (SSR / private mode)
    }
  }
};

onMounted(() => {
  let initial = "light";

  try {
    const saved = localStorage.getItem("lxk-theme");
    if (saved === "light" || saved === "dark") {
      initial = saved;
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      initial = "dark";
    }
  } catch {
    // rien, on reste sur "light"
  }

  applyTheme(initial);
});

const toggleTheme = () => {
  applyTheme(theme.value === "dark" ? "light" : "dark");
};

const isDark = computed(() => theme.value === "dark");
</script>

<style scoped>
.layout-root {
  min-height: 100vh;
  background: var(--color-page-bg);
  color: var(--color-text);
  display: flex;
  flex-direction: column;
}

/* Header global */
.layout-header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.layout-header-bar {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0.35rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* Le Navbar prend toute la place à gauche */
.layout-header-bar > :first-child {
  flex: 1 1 auto;
}

/* Bouton de bascule de thème */
.theme-toggle__button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-elevated);
  color: var(--color-text);
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease;
}

.theme-toggle__button:hover,
.theme-toggle__button:focus-visible {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.theme-toggle__label {
  /* ✅ toujours lisible, en clair comme en sombre */
  color: var(--color-text);
}

.theme-toggle__icon {
  font-size: 0.9rem;
}

/* Contenu principal */
.layout-main {
  flex: 1 1 auto;
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.25rem 1rem 2.5rem;
}

/* Footer simple (tu pourras l’enrichir) */
.layout-footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  color: var(--color-text-muted, var(--color-muted));
}
</style>
