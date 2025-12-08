<template>
  <form
    @submit.prevent="handleButtonSearch"
    role="search"
    :aria-label="t('search.form.aria.searchForm')"
  >
    <div class="input-group">
      <!-- Label champ de recherche -->
      <label
        for="search-input"
        class="visually-hidden"
      >
        {{ t('search.form.labelSearch') }}
      </label>

      <input
        id="search-input"
        type="text"
        v-model="searchQuery"
        class="form-control"
        :placeholder="placeholder"
        @input="submitSearch"
        :aria-label="t('search.form.aria.searchInput')"
      />

      <!-- Sélecteur de langue -->
      <label
        for="language-select"
        class="visually-hidden"
      >
        {{ t('search.form.aria.languageSelect') }}
      </label>

      <select
        id="language-select"
        v-model="selectedLanguage"
        class="form-select"
        :aria-label="t('search.form.aria.languageSelect')"
        @change="submitSearch"
      >
        <option value="kikongo">
          {{ t('search.form.language.kikongo') }}
        </option>
        <option value="fr">
          {{ t('search.form.language.fr') }}
        </option>
        <option value="en">
          {{ t('search.form.language.en') }}
        </option>
      </select>

      <!-- Bouton Rechercher -->
      <button
        type="button"
        class="btn btn-primary"
        @click="handleButtonSearch"
        :aria-label="t('search.form.aria.submit')"
      >
        {{ t('search.form.button.search') }}
      </button>

      <!-- Bouton Effacer -->
      <button
        type="button"
        class="btn btn-clear"
        @click="clearForm"
        :aria-label="t('search.form.aria.clear')"
      >
        {{ t('search.form.button.clear') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const searchQuery = ref('');
const selectedLanguage = ref('kikongo'); // Langue par défaut

const emit = defineEmits(['search']);

// Recherche stricte via bouton
const handleButtonSearch = () => {
  if (searchQuery.value.trim() !== '') {
    emit('search', {
      query: searchQuery.value,
      language: selectedLanguage.value,
      mode: 'strict',
    });
  }
};

// Recherche auto (input / select)
const submitSearch = () => {
  emit('search', {
    query: searchQuery.value,
    language: selectedLanguage.value,
    mode: 'auto',
  });
};

// Reset formulaire
const clearForm = () => {
  searchQuery.value = '';
  selectedLanguage.value = 'kikongo';
  submitSearch();
};

// Label de langue + placeholder i18n
const languageLabel = computed(() =>
  t(`search.form.language.${selectedLanguage.value}`)
);

const placeholder = computed(() =>
  t('search.form.placeholder', { language: languageLabel.value })
);
</script>

<style scoped>
.input-group {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
}

/* Champ de recherche + select : alignés sur le thème global */
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

/* Pour éviter le halo bleu moche par défaut */
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

/* Bouton principal : on réutilise la logique globale (primary) */
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

/* Bouton secondaire (Effacer) : outline, compatible dark */
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

/* Visually hidden class pour accessibilité */
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

