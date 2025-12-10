<!-- components/BankTransfer.vue -->
<template>
  <section class="bank">
    <p class="bank__intro">
      {{ t('contribute.bank.intro') }}
    </p>

    <dl class="bank-list">
      <div class="bank-list__row">
        <dt>{{ t('contribute.bank.beneficiaryLabel') }}</dt>
        <dd>{{ t('contribute.bank.beneficiaryValue') }}</dd>
      </div>

      <div class="bank-list__row">
        <dt>{{ t('contribute.bank.ibanLabel') }}</dt>
        <dd class="bank-list__value-with-btn">
          <span class="bank__code">{{ iban }}</span>
          <button
            type="button"
            class="bank__copy-btn"
            @click="copyToClipboard(iban, 'iban')"
          >
            {{ t('contribute.bank.copyIban') }}
          </button>
        </dd>
      </div>

      <div class="bank-list__row">
        <dt>{{ t('contribute.bank.bicLabel') }}</dt>
        <dd class="bank-list__value-with-btn">
          <span class="bank__code">{{ bic }}</span>
          <button
            type="button"
            class="bank__copy-btn"
            @click="copyToClipboard(bic, 'bic')"
          >
            {{ t('contribute.bank.copyBic') }}
          </button>
        </dd>
      </div>

      <div class="bank-list__row">
        <dt>{{ t('contribute.bank.referenceLabel') }}</dt>
        <dd>{{ t('contribute.bank.referenceValue') }}</dd>
      </div>
    </dl>

    <p v-if="copiedKey" class="bank__copied" aria-live="polite">
      {{ copiedMessage }}
    </p>

    <p class="bank__after">
      <span v-html="afterTransferHtml" />
    </p>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Tu pourras plus tard mettre ça dans runtimeConfig si tu veux
const iban = 'FR76 1741 8000 0100 0083 0001 392';
const bic = 'SNNNFR22XXX';

const copiedKey = ref('');
const copiedMessage = ref('');

const afterTransferHtml = computed(() => {
  const email = 'info@lexikongo.fr';
  // on remplace {email} dans la string par le lien mailto
  const template = t('contribute.bank.afterTransfer').replace(
    '{email}',
    `<a href="mailto:${email}">${email}</a>`
  );
  return template;
});

const copyToClipboard = (text, key) => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    console.error('Clipboard API non disponible');
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      copiedKey.value = key;
      copiedMessage.value =
        key === 'iban'
          ? t('contribute.bank.copiedIban')
          : t('contribute.bank.copiedBic');

      setTimeout(() => {
        copiedKey.value = '';
        copiedMessage.value = '';
      }, 2000);
    })
    .catch((err) => {
      console.error('Erreur de copie :', err);
    });
};
</script>

<style scoped>
.bank {
  font-size: 0.95rem;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bank__intro {
  margin: 0;
  color: var(--text-muted, #4b5563);
}

/* Liste */
.bank-list {
  margin: 0.25rem 0 0;
  padding: 0.7rem 0.8rem;
  border-radius: 0.9rem;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
  background: var(--surface-default, #ffffff);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.bank-list__row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.35rem;
}

.bank-list__row dt {
  font-weight: 500;
  color: var(--text-default, #0f172a);
}

.bank-list__row dd {
  margin: 0;
  color: var(--text-muted, #4b5563);
}

.bank-list__value-with-btn {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.bank__code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace;
  font-size: 0.9rem;
  color: var(--primary, #2563eb);
  word-break: break-all;
}

.bank__copy-btn {
  border-radius: 999px;
  border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.9));
  background: var(--surface-elevated, #f9fafb);
  padding: 0.2rem 0.7rem;
  font-size: 0.8rem;
  cursor: pointer;
  color: var(--text-default, #0f172a);
}

.bank__copy-btn:hover {
  background: rgba(37, 99, 235, 0.06);
  border-color: var(--primary, #2563eb);
}

.bank__copied {
  margin: 0;
  font-size: 0.85rem;
  color: #15803d;
}

.bank__after {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted, #4b5563);
}

.bank__after a {
  color: var(--primary, #2563eb);
  text-decoration: none;
}

.bank__after a:hover {
  text-decoration: underline;
}
</style>
