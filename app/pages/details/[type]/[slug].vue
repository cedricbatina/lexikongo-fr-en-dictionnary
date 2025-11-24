<template>
  <main class="entry-page" aria-labelledby="entry-title">
    <!-- États globaux -->
    <section v-if="isLoading" class="entry-state entry-state--loading">
      <p>{{ $t('details.common.loading') || 'Chargement de la fiche…' }}</p>
    </section>

    <section v-else-if="error" class="entry-state entry-state--error" role="alert">
      <p>{{ error }}</p>
      <NuxtLink to="/expressions" class="entry-back-link">
        <i class="fas fa-arrow-left" aria-hidden="true"></i>
        <span>{{ $t('details.common.backToList') || 'Revenir à la liste des expressions' }}</span>
      </NuxtLink>
    </section>

    <!-- Fiche détaillée -->
    <section
      v-else
      class="entry-card"
      :aria-label="isWord ? 'Détail du mot en Kikongo' : 'Détail du verbe en Kikongo'"
    >
      <!-- Header -->
      <header class="entry-card__header">
        <div class="entry-card__heading">
          <p class="entry-card__eyebrow">
            <span class="entry-card__badge entry-card__badge--type">
              {{ isWord ? $t('details.word.label') || 'Mot' : $t('details.verb.label') || 'Verbe' }}
            </span>
          </p>

          <h1 id="entry-title" class="entry-card__title">
            <template v-if="isWord">
              <span class="entry-card__main-word">
                {{ details.singular || '—' }}
              </span>
              <span
                v-if="details.plural"
                class="entry-card__plural"
              >
                · {{ details.plural }}
              </span>
            </template>

            <template v-else>
              <span class="entry-card__ku">ku</span>
              <span class="entry-card__main-word">
                {{ details.name || '—' }}
              </span>
            </template>
          </h1>

          <p v-if="details.phonetic" class="entry-card__phonetic">
            [{{ details.phonetic }}]
          </p>

          <p class="entry-card__subtitle">
            {{
              isWord
                ? ($t('details.word.subtitle') ||
                  'Fiche détaillée du mot en Kikongo avec sa phonétique et ses traductions.')
                : ($t('details.verb.subtitle') ||
                  'Fiche détaillée du verbe en Kikongo avec sa phonétique, ses racines et ses traductions.')
            }}
          </p>
        </div>

        <div class="entry-card__meta">
          <p class="entry-card__meta-item">
            <i class="fas fa-user" aria-hidden="true"></i>
            <span>
              {{ $t('details.common.author') || 'Auteur' }} :
              <strong>{{ details.author || ($t('details.common.unknown') || 'Inconnu') }}</strong>
            </span>
          </p>
          <p class="entry-card__meta-item">
            <i class="fas fa-calendar-alt" aria-hidden="true"></i>
            <span>
              {{ $t('details.common.createdAt') || 'Date de création' }} :
              <strong>{{ formattedDate }}</strong>
            </span>
          </p>
        </div>
      </header>

      <!-- Corps : colonnes -->
      <div class="entry-card__body">
        <!-- Colonne gauche : structure linguistique -->
        <section class="entry-panel">
          <h2 class="entry-panel__title">
            <i class="fas fa-language" aria-hidden="true"></i>
            <span>{{ $t('details.common.kikongoData') || 'Données en Kikongo' }}</span>
          </h2>

          <dl class="entry-panel__dl">
            <!-- Spécifique MOT -->
            <template v-if="isWord">
              <div class="entry-row">
                <dt>{{ $t('details.word.singular') || 'Singulier' }}</dt>
                <dd class="entry-value entry-value--kikongo">
                  {{ details.singular || '—' }}
                </dd>
              </div>

              <div
                v-if="details.plural"
                class="entry-row"
              >
                <dt>{{ $t('details.word.plural') || 'Pluriel' }}</dt>
                <dd class="entry-value entry-value--kikongo">
                  {{ details.plural }}
                </dd>
              </div>

              <div
                v-if="details.nominal_class"
                class="entry-row"
              >
                <dt>{{ $t('details.word.nominalClass') || 'Classe nominale' }}</dt>
                <dd class="entry-value entry-value--meta">
                  {{ details.nominal_class }}
                </dd>
              </div>
            </template>

            <!-- Spécifique VERBE -->
            <template v-else>
              <div class="entry-row">
                <dt>{{ $t('details.verb.infinitive') || 'Infinitif' }}</dt>
                <dd class="entry-value entry-value--kikongo">
                  ku {{ details.name || '—' }}
                </dd>
              </div>

              <div
                v-if="details.root"
                class="entry-row"
              >
                <dt>{{ $t('details.verb.root') || 'Racine' }}</dt>
                <dd class="entry-value entry-value--meta">
                  {{ details.root }}
                </dd>
              </div>

              <div
                v-if="details.suffix"
                class="entry-row"
              >
                <dt>{{ $t('details.verb.suffix') || 'Suffixe' }}</dt>
                <dd class="entry-value entry-value--meta">
                  {{ details.suffix }}
                </dd>
              </div>
            </template>

            <!-- Commun : phonétique -->
            <div class="entry-row">
              <dt>{{ $t('details.common.phonetic') || 'Phonétique' }}</dt>
              <dd class="entry-value entry-value--phonetic">
                {{ details.phonetic || '—' }}
              </dd>
            </div>
          </dl>
        </section>

        <!-- Colonne droite : traductions -->
        <section class="entry-panel entry-panel--translations">
          <h2 class="entry-panel__title">
            <i class="fas fa-globe" aria-hidden="true"></i>
            <span>{{ $t('details.common.translations') || 'Traductions' }}</span>
          </h2>

          <dl class="entry-panel__dl">
            <div class="entry-row">
              <dt>{{ $t('details.common.fr') || 'Français' }}</dt>
              <dd class="entry-value entry-value--fr">
                {{ details.translation_fr || '—' }}
              </dd>
            </div>

            <div class="entry-row">
              <dt>{{ $t('details.common.en') || 'Anglais' }}</dt>
              <dd class="entry-value entry-value--en">
                {{ details.translation_en || '—' }}
              </dd>
            </div>
          </dl>

          <p class="entry-panel__hint">
            {{
              $t('details.common.translationHint') ||
              'Les traductions peuvent proposer plusieurs nuances de sens, séparées par des virgules.'
            }}
          </p>
        </section>
      </div>

      <!-- Liens de navigation -->
      <footer class="entry-card__footer">
        <NuxtLink
          to="/expressions"
          class="entry-footer__link"
        >
          <i class="fas fa-list" aria-hidden="true"></i>
          <span>{{ $t('details.common.backExpressions') || 'Voir la liste des mots & verbes' }}</span>
        </NuxtLink>

        <div class="entry-footer__group">
          <NuxtLink
            to="/search-words"
            class="entry-footer__link"
          >
            <i class="fas fa-search" aria-hidden="true"></i>
            <span>{{ $t('details.common.searchWords') || 'Rechercher des mots' }}</span>
          </NuxtLink>
          <NuxtLink
            to="/search-verbs"
            class="entry-footer__link"
          >
            <i class="fas fa-search" aria-hidden="true"></i>
            <span>{{ $t('details.common.searchVerbs') || 'Rechercher des verbes' }}</span>
          </NuxtLink>
        </div>
      </footer>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSeoMeta, useHead } from '#imports';

const route = useRoute();
const { t } = useI18n();

const type = computed(() => route.params.type);
const slug = computed(() => route.params.slug);

const details = ref(null);
const isLoading = ref(true);
const error = ref(null);

const isWord = computed(() => type.value === 'word');
const isVerb = computed(() => type.value === 'verb');

const mainLabel = computed(() => {
  if (!details.value) return '';
  return isWord.value ? details.value.singular : details.value.name;
});

// Date formatée
const formattedDate = computed(() => {
  if (!details.value?.created_at) {
    return t('details.common.unknown') || 'Inconnue';
  }
  const d = new Date(details.value.created_at);
  if (Number.isNaN(d.getTime())) {
    return t('details.common.unknown') || 'Inconnue';
  }
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});

// SEO (réactif sur details)
useSeoMeta({
  title: () => {
    if (!mainLabel.value) {
      return isWord.value
        ? 'Mot en Kikongo – Fiche détaillée | Lexikongo'
        : 'Verbe en Kikongo – Fiche détaillée | Lexikongo';
    }
    return isWord.value
      ? `Mot en Kikongo « ${mainLabel.value} » – Lexikongo`
      : `Verbe en Kikongo « ${mainLabel.value} » – Lexikongo`;
  },
  description: () => {
    if (!details.value) {
      return 'Fiche détaillée en Kikongo avec phonétique et traductions en français et en anglais.';
    }
    const fr = details.value.translation_fr || '';
    const en = details.value.translation_en || '';
    if (isWord.value) {
      return `Mot en Kikongo « ${details.value.singular} » avec sa phonétique et ses traductions en français (${fr}) et en anglais (${en}).`;
    }
    return `Verbe en Kikongo « ${details.value.name} » avec sa phonétique, ses racines éventuelles et ses traductions en français (${fr}) et en anglais (${en}).`;
  },
  ogTitle: () => {
    if (!mainLabel.value) {
      return isWord.value || isVerb
        ? 'Mot en Kikongo – Fiche détaillée | Lexikongo'
        : 'Verbe en Kikongo – Fiche détaillée | Lexikongo';
    }
    return isWord.value || isVerb
      ? `Mot en Kikongo « ${mainLabel.value} » – Lexikongo`
      : `Verbe en Kikongo « ${mainLabel.value} » – Lexikongo`;
  },
  ogDescription: () => {
    if (!details.value) {
      return 'Découvrez la fiche détaillée en Kikongo avec phonétique et traductions en français et en anglais.';
    }
    const fr = details.value.translation_fr || '';
    const en = details.value.translation_en || '';
    return isWord.value
      ? `Détails du mot « ${details.value.singular} » en Kikongo. Traductions : FR = ${fr}, EN = ${en}.`
      : `Détails du verbe « ${details.value.name} » en Kikongo. Traductions : FR = ${fr}, EN = ${en}.`;
  },
  ogType: 'article',
  ogUrl: () =>
    `https://www.lexikongo.fr/details/${type.value}/${slug.value}`,
  ogSiteName: 'Lexikongo',
});

// JSON-LD “jsontraduction”
const updateJsonLd = (data) => {
  const isWordEntry = isWord.value;

  const fr = data.translation_fr || '';
  const en = data.translation_en || '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: isWordEntry ? data.singular : `ku ${data.name}`,
    inLanguage: 'kg',
    description: isWordEntry
      ? `Mot en Kikongo « ${data.singular} ». Traduction FR : ${fr}. Traduction EN : ${en}.`
      : `Verbe en Kikongo « ku ${data.name} ». Traduction FR : ${fr}. Traduction EN : ${en}.`,
    termCode: slug.value,
    author: data.author
      ? {
          '@type': 'Person',
          name: data.author,
        }
      : undefined,
    dateCreated: data.created_at || undefined,
    alternateName: isWordEntry && data.plural ? data.plural : undefined,
    translationOfWork: [
      fr && {
        '@type': 'CreativeWork',
        inLanguage: 'fr',
        name: fr,
      },
      en && {
        '@type': 'CreativeWork',
        inLanguage: 'en',
        name: en,
      },
    ].filter(Boolean),
  };

  useHead({
    script: [
      {
        type: 'application/ld+json',
        // on stringify une fois pour garder un JSON propre
        children: JSON.stringify(jsonLd),
      },
    ],
  });
};

const fetchDetails = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    if (!type.value || !slug.value) {
      throw new Error('Type ou slug manquant.');
    }

    const res = await fetch(`/api/details/${type.value}/${slug.value}`);
    if (!res.ok) {
      throw new Error(
        res.status === 404
          ? 'Fiche introuvable.'
          : 'Erreur lors du chargement de la fiche.'
      );
    }

    const result = await res.json();
    details.value = result;
    updateJsonLd(result);
  } catch (err) {
    console.error('Erreur lors de la récupération des détails :', err);
    error.value =
      err?.message || 'Une erreur est survenue lors du chargement de la fiche.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDetails);
</script>

<style scoped>
.entry-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* États */
.entry-state {
  padding: 1rem 1.1rem;
  border-radius: 0.9rem;
  font-size: 0.95rem;
}

.entry-state--loading {
  background: rgba(13, 110, 253, 0.08);
  border: 1px solid rgba(13, 110, 253, 0.35);
  color: var(--primary, #0d6efd);
}

.entry-state--error {
  background: rgba(248, 113, 113, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.6);
  color: #b91c1c;
}

.entry-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--primary, #0d6efd);
}

/* Fiche principale */
.entry-card {
  border-radius: 1rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  background: var(--surface-elevated, #ffffff);
  padding: 1.25rem 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

/* Header */
.entry-card__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.85rem;
}

.entry-card__heading {
  max-width: 60%;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.entry-card__eyebrow {
  margin: 0;
}

.entry-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
}

.entry-card__badge--type {
  background: rgba(191, 219, 254, 0.5);
  color: var(--primary, #0d6efd);
}

.entry-card__title {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem;
  font-size: clamp(1.5rem, 2.4vw, 1.9rem);
  font-weight: 700;
  color: var(--text-default, #111827);
}

.entry-card__main-word {
  color: var(--primary, #0d6efd);
}

.entry-card__plural {
  font-size: 1.1rem;
  font-weight: 600;
  color: #6d28d9;
}

.entry-card__ku {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary, #0d6efd);
}

.entry-card__phonetic {
  margin: 0;
  font-size: 0.9rem;
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  color: var(--text-muted, #6b7280);
}

.entry-card__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.95rem;
  color: var(--text-muted, #6b7280);
}

/* Meta (auteur, date) */
.entry-card__meta {
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: flex-end;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

.entry-card__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
}

.entry-card__meta-item i {
  color: var(--primary, #0d6efd);
}

/* Corps (2 colonnes) */
.entry-card__body {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 1rem;
}

/* Panneaux */
.entry-panel {
  border-radius: 0.8rem;
  padding: 0.9rem 0.95rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
  background: var(--surface-default, #f9fafb);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.entry-panel--translations {
  background: rgba(239, 246, 255, 0.9);
}

.entry-panel__title {
  margin: 0 0 0.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-default, #111827);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.entry-panel__title i {
  color: var(--primary, #0d6efd);
}

.entry-panel__dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

/* Rows */
.entry-row {
  display: grid;
  grid-template-columns: minmax(0, 120px) minmax(0, 1fr);
  gap: 0.25rem 0.6rem;
  font-size: 0.9rem;
}

.entry-row dt {
  font-weight: 600;
  color: var(--text-muted, #6b7280);
}

.entry-row dd {
  margin: 0;
}

/* Valeurs */
.entry-value {
  word-break: break-word;
  white-space: normal;
  color: var(--text-default, #111827);
}

.entry-value--kikongo {
  font-weight: 600;
  color: var(--primary, #0d6efd);
}

.entry-value--phonetic {
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  color: var(--text-default, #111827);
}

.entry-value--meta {
  color: #4b5563;
}

/* Couleurs des traductions */
.entry-value--fr {
  color: #047857; /* Français => vert, comme partout ailleurs */
}

.entry-value--en {
  color: #b45309; /* Anglais => ambré, cohérent avec WordList / VerbList */
}

.entry-panel__hint {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  color: var(--text-muted, #6b7280);
}

/* Footer */
.entry-card__footer {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.6rem;
  align-items: center;
}

.entry-footer__group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.entry-footer__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.8));
  font-size: 0.85rem;
  text-decoration: none;
  background: var(--surface-elevated, #ffffff);
  color: var(--primary, #0d6efd);
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.entry-footer__link:hover,
.entry-footer__link:focus-visible {
  outline: none;
  background: rgba(13, 110, 253, 0.06);
  border-color: var(--primary, #0d6efd);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .entry-page {
    padding-inline: 1rem;
  }

  .entry-card__heading {
    max-width: 100%;
  }

  .entry-card__meta {
    align-items: flex-start;
  }

  .entry-card__body {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
