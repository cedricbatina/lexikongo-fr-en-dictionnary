<template>
  <footer
    class="lk-footer"
    aria-labelledby="lk-footer-title"
  >
    <div class="lk-footer__inner">
      <!-- Brand + tagline -->
      <section class="lk-footer__brand">
        <div class="lk-footer__logo-wrap">
          <LogoSlogan class="lk-footer__logo" />
        </div>
        <p
          id="lk-footer-title"
          class="lk-footer__tagline"
        >
          {{ t('footer.tagline') }}
        </p>
      </section>

      <!-- Grille de liens -->
      <nav
        class="lk-footer__nav"
        aria-label="Liens de bas de page"
      >
        <!-- Col 1 : Découvrir -->
        <section class="lk-footer__col">
          <h2 class="lk-footer__heading">
            {{ t('footer.sections.discover') }}
          </h2>
          <ul class="lk-footer__list">
            <li>
              <NuxtLink
                to="/"
                class="lk-footer__link"
              >
                {{ t('footer.links.home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/search/words"
                class="lk-footer__link"
              >
                {{ t('footer.links.searchWords') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/search/verbs"
                class="lk-footer__link"
              >
                {{ t('footer.links.searchVerbs') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/expressions"
                class="lk-footer__link"
              >
                {{ t('footer.links.expressions') }}
              </NuxtLink>
            </li>
          </ul>
        </section>

        <!-- Col 2 : Communauté -->
        <section class="lk-footer__col">
          <h2 class="lk-footer__heading">
            {{ t('footer.sections.community') }}
          </h2>
          <ul class="lk-footer__list">
            <li>
              <NuxtLink
                to="/contributor"
                class="lk-footer__link"
              >
                {{ t('footer.links.contribute') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/profile"
                class="lk-footer__link"
              >
                {{ t('footer.links.memberArea') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/documentation"
                class="lk-footer__link"
              >
                {{ t('footer.links.documentation') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/faqs"
                class="lk-footer__link"
              >
                {{ t('footer.links.faq') }}
              </NuxtLink>
            </li>
          </ul>
        </section>

        <!-- Col 3 : Légal -->
        <section class="lk-footer__col">
          <h2 class="lk-footer__heading">
            {{ t('footer.sections.legal') }}
          </h2>
          <ul class="lk-footer__list">
            <li>
              <NuxtLink
                to="/privacy"
                class="lk-footer__link"
              >
                {{ t('footer.links.privacy') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/terms"
                class="lk-footer__link"
              >
                {{ t('footer.links.terms') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="lk-footer__link"
              >
                {{ t('footer.links.contact') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin"
                class="lk-footer__link"
              >
                {{ t('footer.links.admin') }}
              </NuxtLink>
            </li>
          </ul>
        </section>

        <!-- Col 4 : Réseaux -->
        <section class="lk-footer__col">
          <h2 class="lk-footer__heading">
            {{ t('footer.sections.social') }}
          </h2>
          <p class="lk-footer__text">
            {{ t('footer.socialText') }}
          </p>
          <div class="lk-footer__social">
            <a
              href="https://www.facebook.com/100063622961242/"
              target="_blank"
              rel="noopener noreferrer"
              class="lk-footer__social-btn"
              aria-label="Facebook"
            >
              <i class="fab fa-facebook-f" aria-hidden="true" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="lk-footer__social-btn"
              aria-label="Twitter / X"
            >
              <i class="fab fa-twitter" aria-hidden="true" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="lk-footer__social-btn"
              aria-label="YouTube"
            >
              <i class="fab fa-youtube" aria-hidden="true" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="lk-footer__social-btn"
              aria-label="LinkedIn"
            >
              <i class="fab fa-linkedin-in" aria-hidden="true" />
            </a>
          </div>
        </section>
      </nav>

      <!-- Bandeau bas -->
      <div class="lk-footer__bottom">
        <p class="lk-footer__copy">
          &copy; {{ currentYear }}
          <a
            href="https://www.lexikongo.fr"
            class="lk-footer__brand-link"
          >
            Lexikongo
          </a>
          · {{ t('footer.rights') }}
        </p>

        <p class="lk-footer__credit">
          {{ t('footer.madeBy') }}
          <a
            href="https://www.artfulbatina.com"
            target="_blank"
            rel="noopener noreferrer"
            class="lk-footer__brand-link"
          >
            Artful Batina Creative Studios
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import LogoFooter from "@/components/LogoFooter.vue";

const { t } = useI18n();
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.lk-footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  margin-top: 2.5rem;
}

.lk-footer__inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 2rem 1.25rem 1.5rem;
}

/* Brand */
.lk-footer__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1.75rem;
}

.lk-footer__logo-wrap {
  width: min(220px, 60%);
  margin-bottom: 0.75rem;
}

.lk-footer__logo {
  width: 100%;
  height: auto;
  display: block;
}

.lk-footer__tagline {
  margin: 0;
  font-size: 0.92rem;
  color: var(--color-text-muted, #6b7280);
}

/* Grid de liens */
.lk-footer__nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.75rem 2rem;
  margin-bottom: 2rem;
}

.lk-footer__col {
  min-width: 0;
}

.lk-footer__heading {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--primary, #0d6efd);
}

.lk-footer__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.lk-footer__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: var(--color-text, #111827);
  text-decoration: none;
  padding: 0.2rem 0;
  position: relative;
  transition:
    color 0.15s ease,
    transform 0.12s ease;
}

.lk-footer__link::before {
  content: "•";
  font-size: 0.6rem;
  color: var(--primary, #0d6efd);
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.lk-footer__link:hover,
.lk-footer__link:focus-visible {
  color: var(--primary, #0d6efd);
  transform: translateX(2px);
}

.lk-footer__link:hover::before,
.lk-footer__link:focus-visible::before {
  opacity: 1;
  transform: translateX(0);
}

.lk-footer__text {
  margin: 0 0 0.65rem;
  font-size: 0.9rem;
  color: var(--color-text-muted, #6b7280);
}

/* Social */
.lk-footer__social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.lk-footer__social-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid var(--primary, #0d6efd);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: var(--primary, #0d6efd);
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.lk-footer__social-btn:hover,
.lk-footer__social-btn:focus-visible {
  background: var(--primary, #0d6efd);
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
  transform: translateY(-1px);
}

/* Bottom bar */
.lk-footer__bottom {
  border-top: 1px solid var(--color-border);
  padding-top: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--color-text-muted, #6b7280);
}

.lk-footer__copy,
.lk-footer__credit {
  margin: 0;
}

.lk-footer__brand-link {
  color: var(--primary, #0d6efd);
  text-decoration: none;
  font-weight: 600;
}

.lk-footer__brand-link:hover,
.lk-footer__brand-link:focus-visible {
  text-decoration: underline;
}

/* Responsive */
@media (min-width: 640px) {
  .lk-footer__brand {
    align-items: flex-start;
    text-align: left;
  }

  .lk-footer__logo-wrap {
    width: 380px;
    margin-left: 0;
  }
}

@media (min-width: 768px) {
  .lk-footer__nav {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .lk-footer__bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
