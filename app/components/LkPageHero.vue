<template>
  <section
    class="lk-hero"
    :aria-labelledby="headingId"
    :aria-describedby="descriptionId"
  >
    <div class="lk-hero__content">
      <p
        v-if="eyebrow"
        class="lk-hero__eyebrow"
      >
        {{ eyebrow }}
      </p>

      <h1
        :id="headingId"
        class="lk-hero__title"
      >
      <LogoSlogan/>
    <!--    {{ title }}-->
      </h1>

      <p
        v-if="description"
        :id="descriptionId"
        class="lk-hero__subtitle"
      >
        {{ description }}
      </p>

      <div v-if="$slots.actions" class="lk-hero__actions">
        <slot name="actions" />
      </div>

      <div v-if="$slots.meta" class="lk-hero__meta">
        <slot name="meta" />
      </div>
    </div>

    <aside
      v-if="$slots.side"
      class="lk-hero__side"
      :aria-label="sideAriaLabel || undefined"
    >
      <slot name="side" />
    </aside>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: null,
  },
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  // pour aria-label de la colonne de droite → i18n possible
  sideAriaLabel: {
    type: String,
    default: '',
  },
});

const headingId = computed(() => props.id || 'lk-hero-heading');
const descriptionId = computed(() =>
  props.description ? `${headingId.value}-desc` : undefined,
);
</script>

<style scoped>
.lk-hero {
  display: grid;
  grid-template-columns: minmax(0, 2fr);
  gap: 1.75rem;
  align-items: flex-start;
}

@media (min-width: 768px) {
  .lk-hero {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1.3fr);
  }
}

/* Colonne principale */
.lk-hero__content {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.lk-hero__eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--text-muted, #6b7280);
}

.lk-hero__title {
  font-size: clamp(2rem, 4vw, 2.6rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-default, #111827);
}

.lk-hero__subtitle {
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--text-muted, #4b5563);
  max-width: 40rem;
}

.lk-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.lk-hero__meta {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

/* Colonne de droite */
.lk-hero__side {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
</style>
