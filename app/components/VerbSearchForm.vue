<template>
  <form
    @submit.prevent="handleButtonSearch"
    role="search"
    :aria-label="t('verbs.search.form.ariaLabel')"
  >
    <div class="input-group">
      <!-- Champ de recherche -->
      <label
        for="verb-search-input"
        class="visually-hidden"
      >
        {{ t('verbs.search.form.label.search') }}
      </label>

      <input
        id="verb-search-input"
        v-model="searchQuery"
        type="search"
        class="form-control"
        :placeholder="t('verbs.search.form.placeholder', { language: languageLabel })"
        @input="submitSearch"
        :aria-label="t('verbs.search.form.ariaSearchInput')"
      />

      <!-- Sélecteur de langue -->
      <label
        for="verb-language-select"
        class="visually-hidden"
      >
        {{ t('verbs.search.form.label.language') }}
      </label>

      <select
        id="verb-language-select"
        v-model="selectedLanguage"
        class="form-select"
        @change="submitSearch"
        :aria-label="t('verbs.search.form.ariaLanguageSelect')"
      >
        <option value="kikongo">
          {{ t('verbs.search.form.languageOptions.kikongo') }}
        </option>
        <option value="fr">
          {{ t('verbs.search.form.languageOptions.fr') }}
        </option>
        <option value="en">
          {{ t('verbs.search.form.languageOptions.en') }}
        </option>
      </select>

      <!-- Bouton "Rechercher" -->
      <button
        type="button"
        class="btn btn-primary"
        @click="handleButtonSearch"
        :aria-label="t('verbs.search.form.buttons.search')"
      >
        {{ t('verbs.search.form.buttons.search') }}
      </button>

      <!-- Bouton "Effacer" -->
      <button
        type="button"
        class="btn btn-clear"
        @click="clearForm"
        :aria-label="t('verbs.search.form.buttons.clear')"
      >
        {{ t('verbs.search.form.buttons.clear') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const searchQuery = ref('');
const selectedLanguage = ref('kikongo');

const emit = defineEmits(['search']);

// Recherche stricte (bouton)
const handleButtonSearch = () => {
  if (searchQuery.value.trim() !== '') {
    emit('search', {
      query: searchQuery.value,
      language: selectedLanguage.value,
      mode: 'strict',
    });
  }
};

// Recherche automatique (saisie / changement langue)
const submitSearch = () => {
  emit('search', {
    query: searchQuery.value,
    language: selectedLanguage.value,
    mode: 'auto',
  });
};

// Reset du formulaire
const clearForm = () => {
  searchQuery.value = '';
  selectedLanguage.value = 'kikongo';
  submitSearch();
};

// Libellé de langue pour le placeholder (i18n-safe)
const languageLabel = computed(() => {
  switch (selectedLanguage.value) {
    case 'kikongo':
      return t('verbs.search.form.languageOptions.kikongo');
    case 'fr':
      return t('verbs.search.form.languageOptions.fr');
    case 'en':
      return t('verbs.search.form.languageOptions.en');
    default:
      return '';
  }
});
</script>

<style scoped>
.input-group {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
}

/* Champs alignés au design system (light + dark) */
.form-control,
.form-select {
  flex: 1;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.6));
  font-size: 0.9rem;
  color: var(--text-default, #111827);
  background: var(--surface-elevated, #ffffff);
}

/* Focus visible → accessibilité */
.form-control:focus-visible,
.form-select:focus-visible {
  outline: none;
  border-color: var(--primary, #0d6efd);
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
}

/* Select un peu plus court sur desktop */
.form-select {
  max-width: 170px;
}

/* Bouton principal (Rechercher) */
.btn-primary {
  margin-left: 0.25rem;
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  border: 1px solid transparent;
  background-color: var(--primary, #0d6efd);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease;
}

.btn-primary:hover,
.btn-primary:focus-visible {
  background-color: var(--primary-strong, #0b5ed7);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.28);
  transform: translateY(-1px);
  outline: none;
}

/* Bouton Effacer : outline léger compatible dark mode */
.btn-clear {
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
  background-color: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.08s ease;
}

.btn-clear:hover,
.btn-clear:focus-visible {
  border-color: var(--primary, #0d6efd);
  color: var(--primary, #0d6efd);
  background-color: var(--surface-default, #f9fafb);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.18);
  transform: translateY(-1px);
  outline: none;
}

/* Responsive mobile */
@media (max-width: 576px) {
  .input-group {
    flex-direction: column;
  }

  .form-control,
  .form-select,
  .btn-clear,
  .btn-primary {
    width: 100%;
    margin: 0;
  }

  .btn-primary {
    margin-top: 0.25rem;
  }
}

/* Visually hidden pour accessibilité */
.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
</style>
