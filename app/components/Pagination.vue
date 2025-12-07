<template>
  <nav
    class="app-pagination"
    :aria-label="navAriaLabel"
  >
    <div class="app-pagination__inner">
      <!-- Résumé -->
   <p
  v-if="showSummary && summaryText"
  class="app-pagination__summary"
  aria-live="polite"
>
  {{ summaryText }}
</p>


      <ul class="app-pagination__list">
        <!-- Bouton Précédent -->
        <li class="app-pagination__item">
          <button
            type="button"
            class="app-pagination__btn app-pagination__btn--nav"
            :class="{ 'app-pagination__btn--disabled': isFirstPage }"
            :disabled="isFirstPage"
            @click="goToPage(currentPage - 1)"
            :aria-label="computedLabelPrev"
          >
            <span class="app-pagination__icon" aria-hidden="true">
              <i class="fas fa-chevron-left" aria-hidden="true"></i>
            </span>
            <span class="app-pagination__text">
              {{ computedLabelPrev }}
            </span>
          </button>
        </li>

        <!-- Pages (desktop / medium) -->
        <li
          v-for="page in visiblePages"
          :key="page.key"
          class="app-pagination__item app-pagination__item--page"
        >
          <button
            v-if="page.type === 'page'"
            type="button"
            class="app-pagination__btn app-pagination__btn--page"
            :class="{ 'app-pagination__btn--active': page.number === currentPage }"
            @click="goToPage(page.number)"
            :aria-current="page.number === currentPage ? 'page' : undefined"
          >
            {{ page.number }}
          </button>
          <span
            v-else
            class="app-pagination__ellipsis"
            aria-hidden="true"
          >
            …
          </span>
        </li>

        <!-- Bouton Suivant -->
        <li class="app-pagination__item">
          <button
            type="button"
            class="app-pagination__btn app-pagination__btn--nav"
            :class="{ 'app-pagination__btn--disabled': isLastPage }"
            :disabled="isLastPage"
            @click="goToPage(currentPage + 1)"
            :aria-label="computedLabelNext"
          >
            <span class="app-pagination__text">
              {{ computedLabelNext }}
            </span>
            <span class="app-pagination__icon" aria-hidden="true">
              <i class="fas fa-chevron-right" aria-hidden="true"></i>
            </span>
          </button>
        </li>

        <!-- Aller à la page -->
        <li
          v-if="showGoto && totalPages > 1"
          class="app-pagination__item app-pagination__item--goto"
        >
          <div class="app-pagination__goto">
            <label class="app-pagination__goto-label">
              <span class="app-pagination__goto-label-text">
                {{ gotoLabelText }}
              </span>
           <input
  v-model="inputPage"
  type="number"
  class="app-pagination__goto-input"
  inputmode="numeric"
  pattern="[0-9]*"
  min="1"
  :max="totalPages"
  :aria-label="gotoAriaLabel"
  @keydown.enter.prevent="applyInputPage"
  @blur="applyInputPage"
  @change="applyInputPage"
/>

              <span class="app-pagination__goto-total">
                / {{ totalPages }}
              </span>
            </label>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 0,
  },
  showSummary: {
    type: Boolean,
    default: true,
  },
  showGoto: {
    type: Boolean,
    default: true,
  },
  /**
   * Texte aria-label du <nav>. Si non fourni, on prend t('pagination.ariaLabel').
   */
  ariaLabel: {
    type: String,
    default: "",
  },
  /**
   * Libellés fallback pour compat.
   * Si non fournis, on prend les traductions i18n.
   */
  labelPrev: {
    type: String,
    default: "",
  },
  labelNext: {
    type: String,
    default: "",
  },
  /**
   * Permet de namespacer les clés i18n si besoin (pagination.*, search.pagination.*, etc.)
   */
  i18nNamespace: {
    type: String,
    default: "pagination",
  },
});

const emit = defineEmits(["pageChange"]);

const ns = computed(() => props.i18nNamespace);

// Input local pour "aller à la page"
const inputPage = ref(props.currentPage);

// garde input synchronisé avec la page actuelle
watch(
  () => props.currentPage,
  (val) => {
    inputPage.value = val;
  }
);

// États de base
const isFirstPage = computed(() => props.currentPage <= 1);
const isLastPage = computed(
  () => props.currentPage >= props.totalPages || props.totalPages <= 1
);

// Calcule X et Y pour le résumé
const startItem = computed(() => {
  if (!props.totalItems || !props.pageSize) return 1;
  return (props.currentPage - 1) * props.pageSize + 1;
});

const endItem = computed(() => {
  if (!props.totalItems || !props.pageSize) return props.totalItems;
  const raw = props.currentPage * props.pageSize;
  return raw > props.totalItems ? props.totalItems : raw;
});

// Libellés i18n / fallback
const navAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;
  return t(`${ns.value}.ariaLabel`);
});

const computedLabelPrev = computed(() => {
  if (props.labelPrev) return props.labelPrev;
  return t(`${ns.value}.prev`);
});

const computedLabelNext = computed(() => {
  if (props.labelNext) return props.labelNext;
  return t(`${ns.value}.next`);
});

const gotoLabelText = computed(() => t(`${ns.value}.gotoLabel`));
const gotoAriaLabel = computed(() =>
  t(`${ns.value}.gotoAriaLabel`, { total: props.totalPages })
);

// Résumé "X–Y sur Z résultats"
const summaryText = computed(() => {
  // Aucun résultat
  if (!props.totalItems) {
    return t(`${ns.value}.empty`, { total: props.totalItems });
  }

  // On a des résultats, mais pas de pageSize fiable → on évite de dire n'importe quoi
  if (!props.pageSize) {
    return t(`${ns.value}.summaryNoPageSize`, {
      total: props.totalItems,
    });
  }

  // Cas normal : X–Y sur Z
  return t(`${ns.value}.summary`, {
    start: startItem.value,
    end: endItem.value,
    total: props.totalItems,
  });
});


// Algorithme d'affichage des pages (1 ... 4 5 [6] 7 8 ... 30)
const visiblePages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  const pages = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push({ type: "page", number: i, key: `p-${i}` });
    }
    return pages;
  }

  const addPage = (n) => pages.push({ type: "page", number: n, key: `p-${n}` });
  const addEllipsis = (id) => pages.push({ type: "ellipsis", key: `e-${id}` });

  addPage(1);

  if (current > 3) {
    addEllipsis("left");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    addPage(i);
  }

  if (current < total - 2) {
    addEllipsis("right");
  }

  addPage(total);

  return pages;
});

// Navigation
function goToPage(page) {
  const target = Number(page);

  if (!Number.isFinite(target)) return;
  if (target < 1 || target > props.totalPages) return;

  if (target !== props.currentPage) {
    emit("pageChange", target);
  }
}

// "Aller à la page" à partir de l'input
function applyInputPage() {
  let page = Number(inputPage.value);

  if (!Number.isFinite(page) || page < 1) {
    page = 1;
  }
  if (page > props.totalPages) {
    page = props.totalPages;
  }

  inputPage.value = page;
  goToPage(page);
}
</script>

<style scoped>
.app-pagination {
  width: 100%;
  margin: 1rem 0 1.5rem;
  font-size: 0.95rem;
}

.app-pagination__inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* Résumé X–Y sur Z */
.app-pagination__summary {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted, #6b7280);
}

/* Liste principale */
.app-pagination__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.app-pagination__item {
  display: flex;
}

/* Boutons de base */
.app-pagination__btn {
  border-radius: 999px;
  border: 1px solid transparent;
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #374151);
  padding: 0.32rem 0.8rem;
  font-size: 0.9rem;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

/* Précédent / Suivant */
.app-pagination__btn--nav {
  border-color: var(--color-border, rgba(148, 163, 184, 0.7));
  background: var(--color-surface-muted, #f9fafb);
}

/* Boutons numéros */
.app-pagination__btn--page {
  min-width: 2.25rem;
  justify-content: center;
}

.app-pagination__btn--page.app-pagination__btn--active {
  background: var(--primary, #0d6efd);
  color: #ffffff;
  border-color: var(--primary, #0d6efd);
  box-shadow: 0 10px 24px rgba(13, 110, 253, 0.25);
}

/* Hover / focus */
.app-pagination__btn:hover,
.app-pagination__btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
}

.app-pagination__btn--nav:hover,
.app-pagination__btn--nav:focus-visible {
  border-color: var(--primary, #0d6efd);
  color: var(--primary, #0d6efd);
  background: var(--primary-soft, #eef2ff);
}

/* Désactivé */
.app-pagination__btn--disabled {
  cursor: default;
  opacity: 0.5;
  box-shadow: none;
  transform: none;
}

/* Ellipses (…) */
.app-pagination__ellipsis {
  padding: 0.32rem 0.3rem;
  font-size: 0.9rem;
  color: var(--color-text-muted, #9ca3af);
}

/* Icône / texte */
.app-pagination__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-pagination__text {
  display: inline;
}

/* Aller à la page */
.app-pagination__item--goto {
  margin-left: 0.25rem;
}

.app-pagination__goto {
  display: inline-flex;
  align-items: center;
}

.app-pagination__goto-label {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: var(--color-text, #4b5563);
}

.app-pagination__goto-input {
  width: 3rem;
  padding: 0.18rem 0.35rem;
  border-radius: 0.5rem;
  border: 1px solid var(
    --color-border,
    rgba(148, 163, 184, 0.8)
  );
  font-size: 0.85rem;
  text-align: center;
  outline: none;
  background-color: var(--color-surface, #ffffff);
  color: var(--color-text, #111827);
}

.app-pagination__goto-input:focus-visible {
  border-color: var(--primary, #0d6efd);
  box-shadow: 0 0 0 1px rgba(13, 110, 253, 0.35);
}

.app-pagination__goto-total {
  font-size: 0.85rem;
  color: var(--color-text-muted, #9ca3af);
}

/* Responsive */
@media (max-width: 640px) {
  .app-pagination__inner {
    padding-inline: 1rem;
  }

  .app-pagination__summary {
    order: 2;
    text-align: center;
  }

  .app-pagination__list {
    justify-content: center;
    flex-wrap: wrap;
  }

  /* On ne garde que les icônes sur Prev/Next pour gagner de la place */
  .app-pagination__text {
    display: none;
  }

  .app-pagination__btn--nav {
    padding-inline: 0.7rem;
  }

  /* Label "Page" masqué sur mobile, mais on garde l'input + / total */
  .app-pagination__goto-label-text {
    display: none;
  }

  .app-pagination__goto-input {
    width: 2.4rem;
  }

  .app-pagination__item--goto {
    margin-left: 0;
  }
}

/* ✅ Sur très petit écran, on NE CACHE PLUS le goto,
   mais on le centre proprement sous les boutons */
@media (max-width: 480px) {
  .app-pagination__list {
    justify-content: center;
  }

  .app-pagination__item--goto {
    width: 100%;
    justify-content: center;
  }

  .app-pagination__goto {
    justify-content: center;
  }
}
/* Boutons de base */
.app-pagination__btn {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  background: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
  padding: 0.32rem 0.8rem;
  font-size: 0.9rem;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

/* Précédent / Suivant : même base, juste un peu plus "chip" */
.app-pagination__btn--nav {
  background: var(--surface-elevated, #ffffff);
}

/* Boutons numéros */
.app-pagination__btn--page {
  min-width: 2.25rem;
  justify-content: center;
}

.app-pagination__btn--page.app-pagination__btn--active {
  background: var(--primary, #0d6efd);
  color: #ffffff;
  border-color: var(--primary, #0d6efd);
  box-shadow: 0 10px 24px rgba(13, 110, 253, 0.25);
}

/* Hover / focus */
.app-pagination__btn:hover,
.app-pagination__btn:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
}

/* Hover spécifique nav */
.app-pagination__btn--nav:hover,
.app-pagination__btn--nav:focus-visible {
  border-color: var(--primary, #0d6efd);
  color: var(--primary, #0d6efd);
  background: var(--primary-soft, #eef2ff);
}

/* Désactivé */
.app-pagination__btn--disabled {
  cursor: default;
  opacity: 0.5;
  box-shadow: none;
  transform: none;
}

/* 🔆 Améliore la visibilité des chevrons haut/bas en mode sombre (Chrome / Edge / Safari) */
[data-theme="dark"] .app-pagination__goto-input::-webkit-inner-spin-button,
[data-theme="dark"] .app-pagination__goto-input::-webkit-outer-spin-button {
  filter: invert(1);
}

/* Pour Firefox : on ne peut pas styler les chevrons, mais on améliore au moins le contraste du champ */
[data-theme="dark"] .app-pagination__goto-input {
  border-color: var(--primary, #0d6efd);
}
/* 🔧 Supprimer les flèches natives (chevrons) du input[type=number] */
.app-pagination__goto-input::-webkit-inner-spin-button,
.app-pagination__goto-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.app-pagination__goto-input {
  -moz-appearance: textfield; /* Firefox */
  appearance: textfield;
}

/* 🌙 Contraste du champ en dark */
[data-theme="dark"] .app-pagination__goto-input {
  background-color: var(--surface-elevated, #020617);
  color: var(--color-text, #e5e7eb);
  border-color: var(--color-border, #475569);
}

</style>
