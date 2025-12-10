<!-- components/UserList.vue -->
<template>
  <section class="admin-users">
    <!-- Barre de recherche + compteur -->
    <header class="admin-users__toolbar">
      <div class="admin-users__search">
        <label
          class="admin-users__search-label"
          for="admin-users-search"
        >
          {{ t('admin.users.search.label') }}
        </label>
        <input
          id="admin-users-search"
          v-model="search"
          type="search"
          class="admin-users__search-input"
          :placeholder="t('admin.users.search.placeholder')"
          autocomplete="off"
        />
      </div>

      <div
        v-if="usersLength"
        class="admin-users__meta"
      >
        <p
          class="admin-users-count-chip"
          aria-live="polite"
        >
          <span
            class="admin-users-count-chip__dot"
            aria-hidden="true"
          />
          <span class="admin-users-count-chip__text">
  {{ t('admin.users.search.count', { count: usersLength }) }}
</span>

        </p>
      </div>
    </header>

    <!-- État : chargement -->
    <div
      v-if="isLoading"
      class="admin-users__status"
      role="status"
      aria-live="polite"
    >
      {{ t('admin.users.states.loading') }}
    </div>

    <!-- État : erreur -->
    <p
      v-else-if="error"
      class="admin-users__error"
      role="alert"
    >
      {{ error }}
    </p>

    <!-- État : vide -->
    <p
      v-else-if="!paginatedUsers.length"
      class="admin-users__empty"
      aria-live="polite"
    >
      {{ search.trim()
        ? t('admin.users.states.emptySearch')
        : t('admin.users.states.emptyAll') }}
    </p>

    <!-- Tableau -->
    <div
      v-else
      class="admin-users__table-wrapper"
    >
      <table
        class="admin-users__table"
        role="table"
        aria-describedby="admin-users-table-caption"
      >
        <colgroup>
          <col style="width: 6%;" />
          <col style="width: 18%;" />
          <col style="width: 26%;" />
          <col style="width: 16%;" />
          <col style="width: 18%;" />
          <col style="width: 16%;" />
        </colgroup>

        <caption
          id="admin-users-table-caption"
          class="admin-users__caption"
        >
          {{ t('admin.users.table.caption') }}
        </caption>

        <thead>
          <tr>
            <th scope="col">
              {{ t('admin.users.table.columns.id') }}
            </th>
            <th scope="col">
              {{ t('admin.users.table.columns.username') }}
            </th>
            <th scope="col">
              {{ t('admin.users.table.columns.email') }}
            </th>
            <th scope="col">
              {{ t('admin.users.table.columns.role') }}
            </th>
            <th scope="col">
              {{ t('admin.users.table.columns.createdAt') }}
            </th>
            <th scope="col">
              {{ t('admin.users.table.columns.verified') }}
            </th>
          </tr>
        </thead>

        <tbody>
         <tr
  v-for="user in paginatedUsers"
  :key="user.user_id"
  class="admin-users__row"
  tabindex="0"
  role="button"
  :aria-label="t('admin.users.table.rowAria', { username: user.username || '#' + user.user_id })"
  @click="goToUserDetails(user)"
  @keydown.enter.prevent="goToUserDetails(user)"
  @keydown.space.prevent="goToUserDetails(user)"
>
  <td class="admin-users__cell admin-users__cell--id">
    #{{ user.user_id }}
  </td>
            

            <td class="admin-users__cell admin-users__cell--username">
              <span class="admin-users__username">
                {{ user.username || '—' }}
              </span>
            </td>

            <td class="admin-users__cell admin-users__cell--email">
              <span class="admin-users__email">
                {{ user.email || '—' }}
              </span>
            </td>

            <td class="admin-users__cell admin-users__cell--role">
              <span class="admin-users-role-chip">
                {{ displayRole(user) }}
              </span>
            </td>

            <td class="admin-users__cell admin-users__cell--created">
              <span class="admin-users__created">
                {{ formatDate(user.created_at) }}
              </span>
            </td>

            <td class="admin-users__cell admin-users__cell--verified">
              <span
                class="admin-users-verified-chip"
                :data-verified="user.email_verified === 1 || user.email_verified === true"
              >
                <i
                  v-if="user.email_verified === 1 || user.email_verified === true"
                  class="fas fa-check-circle"
                  aria-hidden="true"
                />
                <i
                  v-else
                  class="fas fa-times-circle"
                  aria-hidden="true"
                />
                <span class="admin-users-verified-chip__text">
                  {{
                    user.email_verified === 1 || user.email_verified === true
                      ? t('admin.users.table.verified.yes')
                      : t('admin.users.table.verified.no')
                  }}
                </span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="admin-users__pagination"
    >
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @pageChange="changePage"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Pagination from '@/components/Pagination.vue';

const { t } = useI18n();
const router = useRouter();

const users = ref([]);
const isLoading = ref(false);
const error = ref(null);

const currentPage = ref(1);
const pageSize = 5;
const search = ref('');

// longueur totale (pour le chip)
const usersLength = computed(() =>
  Array.isArray(users.value) ? users.value.length : 0
);

// Fetch users
const fetchUsers = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // nouvelle route admin
    const res = await fetch('/api/admin/users');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    // on reste compatible : on attend toujours un tableau simple
    if (!Array.isArray(data)) {
      throw new Error('Unexpected payload format (expected Array)');
    }

    users.value = data;
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs :', err);
   error.value = t('admin.users.states.error');

  } finally {
    isLoading.value = false;
  }
};


// Filtrage simple (username / email / rôle)
const filteredUsers = computed(() => {
  const list = Array.isArray(users.value) ? users.value : [];
  const q = search.value.trim().toLowerCase();
  if (!q) return list;

  return list.filter((user) => {
    const username = (user.username || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const role =
      Array.isArray(user.roles)
        ? user.roles.join(',').toLowerCase()
        : (user.role || '').toLowerCase();

    return (
      username.includes(q) ||
      email.includes(q) ||
      role.includes(q)
    );
  });
});

// Pagination
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredUsers.value.slice(start, start + pageSize);
});

const totalPages = computed(() => {
  const total = filteredUsers.value.length || 0;
  if (!total) return 1;
  return Math.ceil(total / pageSize);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Même helper que sur la home / autres pages
function usernameToSlug(username = '') {
  if (typeof username !== 'string' || !username) return 'utilisateur';
  const safe = username
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')     // remplace tout ce qui n'est pas [a-z0-9] par -
    .replace(/^-+|-+$/g, '');        // trim les tirets au début/fin
  return safe || 'utilisateur';
}

// Navigation vers la fiche utilisateur admin
const goToUserDetails = (user) => {
  if (!user || !user.user_id) {
    console.error('User manquant pour la redirection admin.', user);
    return;
  }

  const slugPart = usernameToSlug(user.username || '');
  // ex: /admin/user/12-jane-doe
  router.push(`/admin/user/${user.user_id}-${slugPart}`);
};


// Affichage du rôle (string ou array)
const displayRole = (user) => {
  if (Array.isArray(user.roles) && user.roles.length) {
    return user.roles.join(', ');
  }
  if (user.role) {
    return user.role;
  }
  return t('admin.users.table.role.none');
};

// Format de date FR
const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

onMounted(() => {
  if (!users.value.length) {
    fetchUsers();
  }
});
</script>
<style scoped>
.admin-users {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.9rem;
}

/* ───────────────── Toolbar (recherche + compteur) ───────────────── */

.admin-users__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.9rem;
  background: var(--surface-default, #ffffff);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.4));
}

.admin-users__search {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 220px;
}

.admin-users__search-label {
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--text-muted, #6b7280);
}

.admin-users__search-input {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.5));
  padding: 0.45rem 0.9rem;
  background: var(--surface-elevated, #f9fafb);
  color: var(--text-default, #0f172a);
  outline: none;
  font-size: 0.9rem;
}

.admin-users__search-input::placeholder {
  color: var(--text-muted, #9ca3af);
}

.admin-users__search-input:focus-visible {
  border-color: var(--primary, #2563eb);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.55);
}

/* compteur */

.admin-users__meta {
  display: flex;
  align-items: center;
}

.admin-users-count-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  background: var(--surface-elevated, #f3f4f6);
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
  font-size: 0.8rem;
  color: var(--text-muted, #6b7280);
}

.admin-users-count-chip__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--primary, #2563eb);
}

/* ───────────────── États ───────────────── */

.admin-users__status,
.admin-users__error,
.admin-users__empty {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted, #6b7280);
}

/* ───────────────── Tableau ───────────────── */

.admin-users__table-wrapper {
  border-radius: 1rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.45));
  background: var(--surface-elevated, #f9fafb);
  overflow: hidden;
}

.admin-users__table {
  width: 100%;
  border-collapse: collapse;
}

.admin-users__caption {
  caption-side: top;
  padding: 0.6rem 0.9rem;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted, #6b7280);
}

/* header */

.admin-users__table thead tr {
  background: linear-gradient(
    to right,
    var(--surface-elevated, #f3f4f6),
    rgba(191, 219, 254, 0.7)
  );
}

.admin-users__table th {
  padding: 0.55rem 0.65rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-default, #0f172a);
  border-bottom: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
}

/* lignes */

.admin-users__row {
  cursor: pointer;
  transition:
    background-color 0.12s ease,
    transform 0.08s ease,
    box-shadow 0.15s ease;
}

.admin-users__row:nth-child(even) {
  background-color: var(--surface-default, #ffffff);
}

.admin-users__row:nth-child(odd) {
  background-color: var(--surface-elevated, #f9fafb);
}

.admin-users__row:hover,
.admin-users__row:focus-visible {
  background-color: rgba(191, 219, 254, 0.45);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.15);
  transform: translateY(-1px);
}

.admin-users__cell {
  padding: 0.5rem 0.65rem;
  border-bottom: 1px solid var(--border-subtle, rgba(209, 213, 219, 0.8));
  font-size: 0.9rem;
  color: var(--text-default, #111827);
  white-space: nowrap;
}

.admin-users__cell--id {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.85rem;
  color: var(--text-muted, #6b7280);
}

.admin-users__username {
  font-weight: 500;
}

.admin-users__email {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.86rem;
  color: var(--text-default, #0f172a);
}

/* pagination conteneur */

.admin-users__pagination {
  margin-top: 0.9rem;
  display: flex;
  justify-content: flex-end;
}

/* ───────────────── Badge rôle ───────────────── */

.admin-users-role-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.16rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  text-transform: lowercase;
  background: rgba(59, 130, 246, 0.12);
  color: var(--primary, #2563eb);
}

/* ───────────────── Badge “email vérifié” ───────────────── */

.admin-users-verified-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.18rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
  border: 1px solid transparent;
}

/* ✅ lisible en clair ET sombre grâce aux vars, avec fallback corrects */
.admin-users-verified-chip[data-verified="true"] {
  background: var(
    --badge-success-bg,
    linear-gradient(
      to right,
      rgba(22, 163, 74, 0.12),
      rgba(21, 128, 61, 0.2)
    )
  );
  border-color: var(--badge-success-border, rgba(34, 197, 94, 0.7));
  color: var(--badge-success-text, #166534);
}

.admin-users-verified-chip[data-verified="false"] {
  background: var(
    --badge-danger-bg,
    linear-gradient(
      to right,
      rgba(248, 113, 113, 0.12),
      rgba(185, 28, 28, 0.2)
    )
  );
  border-color: var(--badge-danger-border, rgba(248, 113, 113, 0.8));
  color: var(--badge-danger-text, #b91c1c);
}

.admin-users-verified-chip i {
  font-size: 0.9rem;
}

/* ───────────────── Responsive ───────────────── */

@media (max-width: 768px) {
  .admin-users__toolbar {
    padding-inline: 0.7rem;
  }

  .admin-users__table-wrapper {
    border-radius: 0.8rem;
  }

  .admin-users__cell {
    padding-inline: 0.45rem;
  }
}
</style>
