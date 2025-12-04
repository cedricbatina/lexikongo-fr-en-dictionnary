<template>
  <div
    class="lk-lastexpr"
    aria-live="polite"
  >
    <!-- État chargement -->
    <p
      v-if="loading"
      class="lk-lastexpr__text lk-lastexpr__text--muted"
    >
      {{ t('home.lastExpressions.loading') }}
    </p>

    <!-- État erreur -->
    <p
      v-else-if="error"
      class="lk-lastexpr__text lk-lastexpr__text--error"
    >
      {{ t('home.lastExpressions.error') }}
    </p>

    <!-- État OK -->
    <p v-else class="lk-lastexpr__text">
      <span class="lk-lastexpr__pill">
        {{ t('home.lastExpressions.total', { total: totalExpressions }) }}
      </span>
      <span class="lk-lastexpr__details">
        {{ t('home.lastExpressions.details', {
          words: data.wordCount,
          verbs: data.verbCount
        }) }}
      </span>
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const data = ref({
  wordCount: 0,
  verbCount: 0,
});

const loading = ref(true);
const error = ref(false);

const totalExpressions = computed(
  () => data.value.wordCount + data.value.verbCount,
);

const fetchExpressionCounts = async () => {
  loading.value = true;
  error.value = false;

  try {
    const res = await fetch('/api/last-expressions-count');

    if (!res.ok) {
      throw new Error('HTTP ' + res.status);
    }

    const result = await res.json();
    data.value = {
      wordCount: Number(result.wordCount || 0),
      verbCount: Number(result.verbCount || 0),
    };
  } catch (e) {
    console.error('Erreur lors de la récupération des dernières expressions :', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchExpressionCounts);
</script>

<style scoped>
.lk-lastexpr {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid rgba(148, 163, 184, 0.5);
}

.lk-lastexpr__text {
  margin: 0;
  font-size: 0.88rem;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  color: var(--text-default, #111827);
}

.lk-lastexpr__text--muted {
  color: var(--text-muted, #6b7280);
}

.lk-lastexpr__text--error {
  color: #b91c1c;
}

.lk-lastexpr__pill {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  font-weight: 600;
  background: rgba(37, 99, 235, 0.12);
  color: var(--primary, #2563eb);
}

.lk-lastexpr__details {
  font-weight: 500;
  color: var(--text-muted, #4b5563);
}

@media (max-width: 640px) {
  .lk-lastexpr {
    width: 100%;
    justify-content: center;
    text-align: center;
  }
}
</style>
