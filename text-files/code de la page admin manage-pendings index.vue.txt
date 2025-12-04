<template>
  <main
    class="lk-contrib-page"
    aria-labelledby="admin-manage-pendings-title"
  >
    <!-- HERO -->
    <LkPageHero
      id="admin-manage-pendings-title"
      :eyebrow="
        t('admin.managePendings.eyebrow')
        || t('contributor.submissions.eyebrow')
      "
      :title="
        t('admin.managePendings.title')
        || t('contributor.submissions.title')
      "
      :description="
        t('admin.managePendings.subtitle')
        || t('contributor.submissions.subtitle')
      "
      :side-aria-label="
        t('admin.managePendings.meta.label')
        || t('contributor.submissions.meta.label')
      "
      :show-last-expressions="false"
    >
      <template #meta>
        <p class="lk-hero-meta">
          <i class="fas fa-user-shield" aria-hidden="true"></i>
          <span>
            {{
              t('admin.managePendings.meta.label')
              || 'Administration · Soumissions en attente'
            }}
          </span>
        </p>
      </template>

      <template #side>
        <div class="lk-contrib-side">
          <LkActionsBar />
        </div>
      </template>
    </LkPageHero>

    <!-- Carte principale -->
    <section
      class="lk-contrib-card"
      aria-describedby="admin-manage-pendings-help"
    >
      <header class="lk-contrib-card__header">
        <p
          id="admin-manage-pendings-help"
          class="lk-contrib-help"
        >
          {{
            t('admin.managePendings.help')
            || 'Filtrez les soumissions en attente (mots & verbes), puis ouvrez la fiche d’édition admin pour décider de les approuver, rejeter ou supprimer.'
          }}
        </p>

        <p class="lk-contrib-hint">
          {{
            t('admin.managePendings.reviewNotice')
            || 'Les décisions (approbation/rejet) se prennent depuis les pages d’édition détaillées ou via les actions rapides ci-dessous.'
          }}
        </p>
      </header>

      <!-- État : non connecté -->
      <div
        v-if="!currentUserId"
        class="lk-submissions-status lk-submissions-status--info"
      >
        <i class="fas fa-user-lock" aria-hidden="true" />
        <span>
          {{
            t('admin.common.mustBeLoggedIn')
            || t('contributor.submissions.mustBeLoggedIn')
          }}
        </span>
      </div>

      <!-- État : chargement -->
      <div
        v-else-if="isLoading"
        class="lk-submissions-status lk-submissions-status--info"
        role="status"
        aria-live="polite"
      >
        <i class="fas fa-circle-notch fa-spin" aria-hidden="true" />
        <span>
          {{
            t('admin.managePendings.loading')
            || 'Chargement des soumissions en attente…'
          }}
        </span>
      </div>

      <!-- État : erreur -->
      <p
        v-else-if="errorMessage"
        class="lk-submissions-status lk-submissions-status--error"
        role="alert"
      >
        <i class="fas fa-exclamation-triangle" aria-hidden="true" />
        <span>{{ errorMessage }}</span>
      </p>

      <!-- Liste -->
      <div v-else>
        <!-- Toolbar filtres + recherche -->
        <div class="lk-submissions__toolbar">
          <!-- Filtres statut/type -->
          <div class="lk-submissions__filters">
            <span class="lk-submissions__filters-label">
              {{ t('contributor.submissions.filters.status') || 'Statut' }}
            </span>

            <button
              v-for="s in statusOptions"
              :key="s.value"
              type="button"
              class="lk-submissions-chip"
              :class="[
                s.value === statusFilter ? 'lk-submissions-chip--active' : '',
                `lk-submissions-chip--${s.value || 'all'}`,
              ]"
              @click="statusFilter = s.value"
            >
              <span>{{ s.label }}</span>
            </button>
          </div>

          <div class="lk-submissions__toolbar-right">
            <!-- Type -->
            <div class="lk-submissions__filters lk-submissions__filters--type">
              <span class="lk-submissions__filters-label">
                {{ t('contributor.submissions.filters.type') || 'Type' }}
              </span>

              <button
                v-for="tOpt in typeOptions"
                :key="tOpt.value"
                type="button"
                class="lk-submissions-pill"
                :class="tOpt.value === typeFilter ? 'lk-submissions-pill--active' : ''"
                @click="typeFilter = tOpt.value"
              >
                {{ tOpt.label }}
              </button>
            </div>

            <!-- Recherche -->
            <div class="lk-submissions__search">
              <label
                for="admin-pendings-search"
                class="lk-submissions__search-label"
              >
                {{
                  t('admin.managePendings.search.label')
                  || t('contributor.submissions.search.label')
                  || 'Rechercher'
                }}
              </label>
              <input
                id="admin-pendings-search"
                v-model.trim="searchTerm"
                type="search"
                class="lk-submissions__search-input"
                :placeholder="
                  t('admin.managePendings.search.placeholder')
                  || t('contributor.submissions.search.placeholder')
                  || 'Recherchez par lemme, traduction ou contributeur…'
                "
              >
            </div>
          </div>
        </div>

        <!-- Compteur + badges mots / verbes -->
        <div class="lk-submissions-count">
          <!-- Total général -->
          <div class="lk-submissions-count__chip">
            <span class="lk-submissions-count__dot" />
            <span class="lk-submissions-count__text">
              {{
                t('admin.managePendings.count', { total })
                || t('contributor.submissions.count', { total })
                || `${total} soumissions trouvées`
              }}
            </span>
          </div>

          <!-- Badges détaillés mots / verbes -->
          <div class="lk-submissions-count__meta">
            <span
              v-if="totalWords"
              class="lk-submissions-count__chip lk-submissions-count__chip--word"
            >
              <i class="fas fa-font" aria-hidden="true" />
              <span>
                {{
                  t('admin.managePendings.countWords', { totalWords })
                  || `${totalWords} mot(s)`
                }}
              </span>
            </span>

            <span
              v-if="totalVerbs"
              class="lk-submissions-count__chip lk-submissions-count__chip--verb"
            >
              <i class="fas fa-pen-nib" aria-hidden="true" />
              <span>
                {{
                  t('admin.managePendings.countVerbs', { totalVerbs })
                  || `${totalVerbs} verbe(s)`
                }}
              </span>
            </span>
          </div>
        </div>

        <!-- Liste des cartes -->
        <ul class="lk-submissions-list">
          <li
            v-for="item in items"
            :key="`${item.type}-${item.id}`"
            class="lk-submissions-card"
          >
            <article class="lk-submissions-card__body">
              <header class="lk-submissions-card__header">
                <div class="lk-submissions-card__badges">
                  <!-- Badge type -->
                  <span
                    class="lk-submissions-badge"
                    :class="item.type === 'word'
                      ? 'lk-submissions-badge--word'
                      : 'lk-submissions-badge--verb'"
                  >
                    <i
                      :class="item.type === 'word'
                        ? 'fas fa-font'
                        : 'fas fa-pen-nib'"
                      aria-hidden="true"
                    />
                    <span>
                      {{
                        item.type === 'word'
                          ? (
                            t('contributor.submissions.badges.word')
                            || 'Mot proposé'
                          )
                          : (
                            t('contributor.submissions.badges.verb')
                            || 'Verbe proposé'
                          )
                      }}
                    </span>
                  </span>

                  <!-- Statut -->
                  <span
                    class="lk-submissions-status-pill"
                    :class="`lk-submissions-status-pill--${item.status}`"
                  >
                    {{ statusLabel(item.status) }}
                  </span>
                </div>

                <!-- Date -->
                <time
                  v-if="item.created_at_formatted"
                  class="lk-submissions-card__date"
                  :datetime="item.created_at"
                >
                  {{
                    t('admin.managePendings.meta.submittedAtLabel')
                    || t('contributor.submissions.meta.createdAt')
                    || 'Soumis le '
                  }}
                  {{ item.created_at_formatted }}
                </time>
              </header>

              <!-- Titre = lemme principal -->
              <div class="lk-submissions-card__title">
                <span
                  v-if="item.type === 'verb'"
                  class="lk-submissions-ku"
                >
                  ku
                </span>
                <span class="lk-submissions-lemma">
                  {{ mainLemma(item) }}
                </span>
                <span
                  v-if="item.type === 'word' && item.plural"
                  class="lk-submissions-lemma-plural"
                >
                  · {{ item.plural }}
                </span>
                <span
                  v-if="item.phonetic"
                  class="lk-submissions-phonetic"
                >
                  [[{{ item.phonetic }}]]
                </span>
              </div>

              <!-- Traductions -->
              <dl class="lk-submissions-translations">
                <div
                  v-if="item.translation_fr"
                  class="lk-submissions-translations__row"
                >
                  <dt>FR</dt>
                  <dd class="translation-fr">
                    {{ item.translation_fr }}
                  </dd>
                </div>

                <div
                  v-if="item.translation_en"
                  class="lk-submissions-translations__row"
                >
                  <dt>EN</dt>
                  <dd class="translation-en">
                    {{ item.translation_en }}
                  </dd>
                </div>
              </dl>

              <!-- Footer : contributeur + actions -->
              <footer class="lk-submissions-card__footer">
                <div class="lk-submissions-chip-small">
                  <i class="fas fa-user" aria-hidden="true" />
                  <span>
                    {{
                      item.user_name
                      || item.user_email
                      || t('admin.managePendings.unknownUser')
                      || 'Contributeur inconnu'
                    }}
                  </span>
                </div>

                <div class="lk-submissions-card__actions">
                  <!-- Bouton d’édition détaillée -->
                  <button
                    type="button"
                    class="lk-submissions-btn lk-submissions-btn--primary"
                    @click="goToEdit(item)"
                  >
                    <i class="fas fa-pen-to-square" aria-hidden="true" />
                    <span>
                      {{
                        item.type === 'word'
                          ? (
                            t('admin.managePendings.actions.editWord')
                            || 'Éditer le mot'
                          )
                          : (
                            t('admin.managePendings.actions.editVerb')
                            || 'Éditer le verbe'
                          )
                      }}
                    </span>
                  </button>

                  <!-- ✅ Actions rapides : approuver / rejeter / supprimer -->
                  <button
                    v-if="item.status === 'pending'"
                    type="button"
                    class="lk-submissions-btn lk-submissions-btn--success"
                    :disabled="actingSubmissionId === item.id"
                    @click="onApprove(item)"
                  >
                    <i class="fas fa-check" aria-hidden="true" />
                    <span>
                      {{
                        t('admin.managePendings.actions.approve')
                        || 'Approuver'
                      }}
                    </span>
                  </button>

                  <button
                    v-if="item.status === 'pending'"
                    type="button"
                    class="lk-submissions-btn lk-submissions-btn--warning"
                    :disabled="actingSubmissionId === item.id"
                    @click="onReject(item)"
                  >
                    <i class="fas fa-ban" aria-hidden="true" />
                    <span>
                      {{
                        t('admin.managePendings.actions.reject')
                        || 'Rejeter'
                      }}
                    </span>
                  </button>

                  <button
                    type="button"
                    class="lk-submissions-btn lk-submissions-btn--danger"
                    :disabled="actingSubmissionId === item.id"
                    @click="onDelete(item)"
                  >
                    <i class="fas fa-trash-alt" aria-hidden="true" />
                    <span>
                      {{
                        t('admin.managePendings.actions.delete')
                        || 'Supprimer'
                      }}
                    </span>
                  </button>
                </div>
              </footer>
            </article>
          </li>
        </ul>

        <!-- Pagination -->
        <div
          v-if="pageCount > 1"
          class="lk-submissions__pagination"
        >
          <button
            type="button"
            class="lk-submissions-btn"
            :disabled="page <= 1"
            @click="goToPage(page - 1)"
          >
            ‹ {{ t('admin.managePendings.pagination.prev') || 'Précédent' }}
          </button>

          <span class="lk-submissions-chip-small">
            {{
              t('admin.managePendings.pagination.info', {
                page,
                pageCount,
              })
              || `Page ${page} / ${pageCount}`
            }}
          </span>

          <button
            type="button"
            class="lk-submissions-btn"
            :disabled="page >= pageCount"
            @click="goToPage(page + 1)"
          >
            {{ t('admin.managePendings.pagination.next') || 'Suivant' }} ›
          </button>
        </div>

        <!-- État vide -->
        <p
          v-if="!items.length && !isLoading && !errorMessage"
          class="lk-submissions-status lk-submissions-status--empty"
        >
          <i class="fas fa-circle-info" aria-hidden="true" />
          <span>
            {{
              t('admin.managePendings.empty')
              || 'Aucune soumission ne correspond à ces filtres.'
            }}
          </span>
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSeoMeta, useAsyncData } from '#imports';
import * as Toastification from 'vue-toastification';

import LkPageHero from '@/components/LkPageHero.vue';
import LkActionsBar from '@/components/LkActionsBar.vue';
import { useAuthStore } from '~/stores/authStore';
import { useConfirmStore } from '~/stores/confirmStore';

const router = useRouter();
const { t, d } = useI18n();
const toast = Toastification.useToast();
const confirmStore = useConfirmStore();

const authStore = useAuthStore();
const currentUserId = computed(
  () => authStore.user?.id || authStore.user?.user_id || null,
);

// Filtres
const statusFilter = ref('pending'); // 'pending' | 'approved' | 'rejected' | '' (tous)
const typeFilter = ref(''); // '' = tous, 'word', 'verb'
const searchTerm = ref('');
const page = ref(1);
const perPage = ref(10);

// Pour suivre l’item en cours de traitement (approve / reject / delete)
const actingSubmissionId = ref(null);

// Options
const statusOptions = [
  {
    value: '',
    label:
      t('contributor.submissions.status.all')
      || 'Tous les statuts',
  },
  {
    value: 'pending',
    label:
      t('contributor.submissions.status.pending')
      || 'En attente',
  },
  {
    value: 'approved',
    label:
      t('contributor.submissions.status.approved')
      || 'Approuvée',
  },
  {
    value: 'rejected',
    label:
      t('contributor.submissions.status.rejected')
      || 'Rejetée',
  },
];

const typeOptions = [
  {
    value: '',
    label:
      t('contributor.submissions.types.all')
      || 'Mots & verbes',
  },
  {
    value: 'word',
    label:
      t('contributor.submissions.types.word')
      || 'Mots uniquement',
  },
  {
    value: 'verb',
    label:
      t('contributor.submissions.types.verb')
      || 'Verbes uniquement',
  },
];

// SEO
useSeoMeta({
  title: () =>
    t('admin.managePendings.meta.title')
    || 'Admin · Soumissions en attente – Lexikongo',
  description: () =>
    t('admin.managePendings.meta.description')
    || 'Administration des soumissions de mots et verbes en kikongo (filtrage, recherche, accès aux fiches d’édition).',
});

// Construction des paramètres pour coller à l’API /api/admin/manage-pendings
// L’API attend : { status, type, q, page, pageSize }
const buildQuery = () => ({
  status: statusFilter.value || 'all', // '' -> 'all'
  type: typeFilter.value || 'all', // '' -> 'all'
  q: searchTerm.value || undefined,
  page: page.value,
  pageSize: perPage.value,
});

// Shape réelle de l’API (côté serveur) :
// {
//   page: 1,
//   pageSize: 20,
//   total: 42,
//   totalPages: 5,
//   items: [
//     // mots
//     {
//       kind: 'word',
//       submission_id,
//       slug,
//       status,
//       singular,
//       plural,
//       phonetic,
//       number_variability,
//       created_at,
//       user_id,
//       username,
//       email,
//       translation_fr,
//       translation_en,
//     },
//     // verbes
//     {
//       kind: 'verb',
//       submission_id,
//       slug,
//       status,
//       name,
//       root,
//       suffix,
//       phonetic,
//       created_at,
//       user_id,
//       username,
//       email,
//       translation_fr,
//       translation_en,
//     },
//   ],
//   meta: { totalWords, totalVerbs }
// }

const {
  data,
  pending,
  error: rawError,
  refresh, // ✅ on va l’utiliser après une action
} = await useAsyncData(
  'admin-manage-pendings',
  () => $fetch('/api/admin/manage-pendings', {
    query: buildQuery(),
  }),
  {
    watch: [statusFilter, typeFilter, searchTerm, page],
  },
);

const isLoading = computed(() => pending.value);

// Normalisation des items pour coller au template existant
const rawItems = computed(() => data.value?.items || []);

const items = computed(() => rawItems.value.map((row) => {
  const type = row.kind === 'word' ? 'word' : 'verb';

  // Lemmes
  const singular = row.singular || null;
  const plural = row.plural || null;
  const infinitive = row.name || row.singular || null;

  // Date formatée via i18n
  const createdAtFormatted = row.created_at
    ? d(new Date(row.created_at), 'short')
    : '';

  return {
    id: row.submission_id,
    type,
    slug: row.slug,
    singular,
    plural,
    infinitive,
    phonetic: row.phonetic || null,
    translation_fr: row.translation_fr || '',
    translation_en: row.translation_en || '',
    status: row.status,
    created_at: row.created_at,
    created_at_formatted: createdAtFormatted,
    user_name: row.username || null,
    user_email: row.email || null,
  };
}));

const total = computed(() => data.value?.total || 0);
const pageCount = computed(() => data.value?.totalPages || 1);

// Totaux par type pour les badges
const totalWords = computed(() => data.value?.meta?.totalWords || 0);
const totalVerbs = computed(() => data.value?.meta?.totalVerbs || 0);

const errorMessage = computed(() => {
  if (!rawError.value) return '';
  return (
    rawError.value?.data?.statusMessage
    || rawError.value?.message
    || t('admin.managePendings.error.generic')
    || 'Impossible de récupérer les soumissions en attente.'
  );
});

// Helpers
const mainLemma = (item) => {
  if (item.type === 'verb') {
    return item.infinitive
      || item.singular
      || item.slug
      || '—';
  }
  // word
  return item.singular || item.slug || '—';
};

const statusLabel = (status) => {
  if (status === 'pending') {
    return t('contributor.submissions.status.pending');
  }
  if (status === 'approved') {
    return t('contributor.submissions.status.approved');
  }
  if (status === 'rejected') {
    return t('contributor.submissions.status.rejected');
  }
  return status || '';
};

const goToPage = (newPage) => {
  if (newPage < 1 || newPage > pageCount.value) return;
  page.value = newPage;
};

const goToEdit = (item) => {
  if (!item?.slug || !item?.type) return;

  if (item.type === 'word') {
    router.push(`/admin/edit/pending-word/${item.slug}`);
  } else if (item.type === 'verb') {
    router.push(`/admin/edit/pending-verb/${item.slug}`);
  }
};

// ✅ Actions de modération rapides
const handleModerationAction = async (item, action) => {
  if (!currentUserId.value) {
    toast.error(
      t('admin.common.mustBeLoggedIn')
      || t('contributor.submissions.mustBeLoggedIn')
      || 'Vous devez être connecté pour effectuer cette action.',
    );
    return;
  }

  if (!item?.id || !item?.type) return;

  // Delete se fait via les endpoints spécifiques, pas via /manage-submissions
  if (action === 'delete') {
    const confirmed = await confirmStore.ask({
      title:
        t('admin.managePendings.confirmDeleteTitle')
        || 'Supprimer cette soumission ?',
      message:
        t('admin.managePendings.confirmDeleteMessage')
        || 'Voulez-vous vraiment supprimer cette soumission ? Cette action est définitive.',
      confirmLabel:
        t('common.actions.delete')
        || 'Supprimer',
      cancelLabel:
        t('common.actions.cancel')
        || 'Annuler',
      danger: true,
    });

    if (!confirmed) return;

    actingSubmissionId.value = item.id;

    try {
      if (item.type === 'word') {
        await $fetch(`/api/admin/pending-word/${item.slug}`, {
          method: 'DELETE',
        });
      } else if (item.type === 'verb') {
        await $fetch(`/api/admin/pending-verb/${item.slug}`, {
          method: 'DELETE',
        });
      }

      const msg =
        t('admin.managePendings.deleted')
        || 'La soumission a été supprimée.';
      toast.success(msg);
      await refresh();
    } catch (err) {
      console.error('Erreur lors de la suppression de la soumission (admin):', err);
      const apiMsg =
        err?.data?.statusMessage
        || err?.data?.message
        || t('admin.managePendings.errors.delete')
        || 'Impossible de supprimer cette soumission.';
      toast.error(apiMsg);
    } finally {
      actingSubmissionId.value = null;
    }

    return;
  }

  // Approve / reject via /api/admin/manage-submissions
  if (item.status !== 'pending') {
    toast.error(
      t('admin.managePendings.errors.notPending')
      || 'Cette soumission n’est plus en statut « en attente ».',
    );
    return;
  }

  let reason = null;

  if (action === 'reject') {
    // Petit prompt simple pour la raison
    const defaultLabel =
      t('admin.managePendings.actions.rejectPrompt')
      || 'Indiquez la raison du rejet (optionnel) :';
    // eslint-disable-next-line no-alert
    reason = window.prompt(defaultLabel, '') || '';
  }

  actingSubmissionId.value = item.id;

  try {
    await $fetch('/api/admin/manage-submissions', {
      method: 'POST',
      body: {
        submission_id: item.id,
        content_type: item.type, // 'word' | 'verb'
        action, // 'approve' | 'reject'
        user_id: currentUserId.value, // mappé en admin_id côté API
        reason: reason || undefined,
      },
    });

    let msg;
    if (action === 'approve') {
      msg =
        t('admin.managePendings.successApproved')
        || 'Soumission approuvée et intégrée au dictionnaire.';
    } else if (action === 'reject') {
      msg =
        t('admin.managePendings.successRejected')
        || 'Soumission marquée comme rejetée.';
    }

    if (msg) toast.success(msg);

    await refresh();
  } catch (err) {
    console.error('Erreur modération soumission (admin):', err);
    const apiMsg =
      err?.data?.statusMessage
      || err?.data?.message
      || t('admin.managePendings.errors.generic')
      || 'Impossible de traiter cette soumission.';
    toast.error(apiMsg);
  } finally {
    actingSubmissionId.value = null;
  }
};

// Petits wrappers pour le template
const onApprove = (item) => handleModerationAction(item, 'approve');
const onReject = (item) => handleModerationAction(item, 'reject');
const onDelete = (item) => handleModerationAction(item, 'delete');

// Si on change les filtres principaux, on revient à la page 1
watch(
  [statusFilter, typeFilter, searchTerm],
  () => {
    page.value = 1;
  },
);
</script>

<style scoped>
.lk-contrib-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.lk-contrib-side {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lk-contrib-card {
  background: var(--surface-elevated, #ffffff);
  border-radius: 1rem;
  padding: 1.5rem 1.25rem 1.75rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.35));
  margin-top: 1.5rem;
}

.lk-contrib-card__header {
  margin-bottom: 1rem;
}

.lk-contrib-help {
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
  margin: 0 0 0.25rem;
}

.lk-contrib-hint {
  font-size: 0.82rem;
  color: var(--text-muted, #6b7280);
  margin: 0;
}

/* Toolbar */
.lk-submissions__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.75rem;
  margin: 1.1rem 0 0.8rem;
}

.lk-submissions__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.lk-submissions__filters-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #6b7280);
  margin-right: 0.25rem;
}

.lk-submissions-chip {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
  padding: 0.3rem 0.9rem;
  font-size: 0.86rem;
  font-weight: 500;
  background: var(--surface-default, #f9fafb);
  color: var(--text-default, #111827);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    transform 0.08s ease;
}

.lk-submissions-chip--active {
  background: var(--primary, #2563eb);
  border-color: var(--primary, #2563eb);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.3);
}

.lk-submissions-chip:hover,
.lk-submissions-chip:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
}

.lk-submissions__toolbar-right {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.6rem;
  margin-left: auto;
}

.lk-submissions-pill {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
  padding: 0.28rem 0.9rem;
  font-size: 0.84rem;
  font-weight: 500;
  background: var(--surface-default, #f9fafb);
  color: var(--text-default, #111827);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    transform 0.08s ease;
}

.lk-submissions-pill--active {
  background: var(--primary, #2563eb);
  border-color: var(--primary, #2563eb);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.3);
}

.lk-submissions-pill:hover,
.lk-submissions-pill:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
}

.lk-submissions__search {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 220px;
}

.lk-submissions__search-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #6b7280);
}

.lk-submissions__search-input {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.85));
  padding: 0.4rem 0.9rem;
  font-size: 0.9rem;
  background: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
}

/* Count */
.lk-submissions-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
  gap: 0.5rem;
}

.lk-submissions-count__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.18rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.03),
    rgba(37, 99, 235, 0.06)
  );
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted, #4b5563);
}

.lk-submissions-count__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, #22c55e, #16a34a);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18);
}

.lk-submissions-count__text {
  white-space: nowrap;
}

.lk-submissions-count__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.lk-submissions-count__chip--word {
  background: #ecfdf5;
  color: #047857;
  border-color: rgba(16, 185, 129, 0.4);
}

.lk-submissions-count__chip--verb {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: rgba(59, 130, 246, 0.4);
}

/* Liste + cartes */
.lk-submissions-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.lk-submissions-card__body {
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: var(--surface-elevated, #ffffff);
  padding: 0.8rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.lk-submissions-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.lk-submissions-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.lk-submissions-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
}

.lk-submissions-badge--word {
  background: #ecfdf5;
  color: #047857;
}

.lk-submissions-badge--verb {
  background: #eff6ff;
  color: #1d4ed8;
}

/* Statut pill */
.lk-submissions-status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
  border: 1px solid transparent;
}

.lk-submissions-status-pill--pending {
  background: #fef3c7;
  color: #92400e;
  border-color: #fde68a;
}

.lk-submissions-status-pill--approved {
  background: #ecfdf5;
  color: #166534;
  border-color: #bbf7d0;
}

.lk-submissions-status-pill--rejected {
  background: #fef2f2;
  color: #b91c1c;
  border-color: #fecaca;
}

.lk-submissions-card__date {
  font-size: 0.8rem;
  color: var(--text-muted, #6b7280);
}

/* Titre / lemme */
.lk-submissions-card__title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem;
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--text-default, #111827);
}

.lk-submissions-ku {
  font-size: 0.85rem;
  font-weight: 500;
  color: #6b7280;
}

.lk-submissions-lemma {
  color: var(--primary, #2563eb);
}

.lk-submissions-lemma-plural {
  color: var(--primary, #2563eb);
}

.lk-submissions-phonetic {
  font-size: 0.86rem;
  font-family: "Fira Code", Menlo, ui-monospace, SFMono-Regular, monospace;
  color: var(--text-muted, #6b7280);
}

/* Traductions */
.lk-submissions-translations {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin: 0.2rem 0 0;
}

.lk-submissions-translations__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.2rem 0.5rem;
  align-items: baseline;
}

.lk-submissions-translations__row dt {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.lk-submissions-translations__row dd {
  margin: 0;
  font-size: 0.9rem;
}

.translation-fr {
  color: #047857;
}

.translation-en {
  color: #b45309;
}

/* Footer */
.lk-submissions-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  gap: 0.5rem;
}

.lk-submissions-chip-small {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  font-size: 0.78rem;
  color: var(--text-muted, #6b7280);
}

/* Actions */
.lk-submissions-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: flex-end;
}

.lk-submissions-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.86rem;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  background: var(--surface-elevated, #ffffff);
  color: var(--text-default, #111827);
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    transform 0.08s ease;
}

.lk-submissions-btn--primary {
  background: var(--primary, #2563eb);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.3);
}

.lk-submissions-btn--primary:hover,
.lk-submissions-btn--primary:focus-visible {
  outline: none;
  background: var(--primary-hover, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.25);
}

.lk-submissions-btn--success {
  background: #16a34a;
  color: #ffffff;
  border-color: #16a34a;
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.3);
}

.lk-submissions-btn--success:hover,
.lk-submissions-btn--success:focus-visible {
  background: #15803d;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(22, 163, 74, 0.35);
}

.lk-submissions-btn--warning {
  background: #f59e0b;
  color: #ffffff;
  border-color: #f59e0b;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.lk-submissions-btn--warning:hover,
.lk-submissions-btn--warning:focus-visible {
  background: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(245, 158, 11, 0.35);
}

.lk-submissions-btn--danger {
  background: #b91c1c;
  color: #ffffff;
  border-color: #b91c1c;
  box-shadow: 0 8px 20px rgba(185, 28, 28, 0.3);
}

.lk-submissions-btn--danger:hover,
.lk-submissions-btn--danger:focus-visible {
  background: #991b1b;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(185, 28, 28, 0.35);
}

.lk-submissions-btn[disabled] {
  opacity: 0.6;
  cursor: default;
  box-shadow: none;
  transform: none;
}

/* Status global (info / error / empty) */
.lk-submissions-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
}

.lk-submissions-status--info {
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.35);
  color: var(--primary, #2563eb);
}

.lk-submissions-status--error {
  background: rgba(248, 113, 113, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.55);
  color: #b91c1c;
}

.lk-submissions-status--empty {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: var(--text-muted, #6b7280);
}

/* Pagination container */
.lk-submissions__pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 720px) {
  .lk-submissions__toolbar {
    align-items: stretch;
  }

  .lk-submissions__toolbar-right {
    width: 100%;
    justify-content: space-between;
  }

  .lk-submissions__search {
    flex: 1 1 auto;
  }

  .lk-submissions-card__body {
    padding: 0.75rem 0.8rem;
  }

  .lk-submissions-card__footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
}
</style>
