// Shastra Platform - Phase 1: Foundation
// homepage.js – interactions and API connectivity for the homepage

'use strict';

/* ── API health check ─────────────────────────────────────────────────────── */

/**
 * checkAPIHealth
 * Fetches /api/health on page load to verify the backend is reachable.
 * Updates the #api-status badge in the hero with a live result.
 */
async function checkAPIHealth() {
  const badge = document.getElementById('api-status');
  if (!badge) return;

  const url = window.SHASTRA_CONFIG.API_BASE_URL + window.SHASTRA_CONFIG.ENDPOINTS.HEALTH;

  try {
    const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
    const data = await response.json();

    console.log('[Shastra] API health check:', data);

    badge.classList.add('ok');
    badge.innerHTML = `<span class="dot"></span> API Connected – ${data.message || 'OK'}`;
  } catch (err) {
    console.warn('[Shastra] API health check failed:', err.message);

    badge.classList.add('error');
    badge.innerHTML = `<span class="dot"></span> API Offline – start the backend on :5000`;
  }
}

/* ── Smooth scroll to features ─────────────────────────────────────────────── */

/**
 * Wire the "Get Started" button so it scrolls to the features section
 * instead of navigating before the login page exists.
 */
function wireGetStartedBtn() {
  const btn = document.getElementById('btn-get-started');
  const features = document.getElementById('features');
  if (!btn || !features) return;

  btn.addEventListener('click', (e) => {
    // If the login page exists, let the default href navigate there.
    // Otherwise scroll to features (Phase 1 behaviour).
    const loginPage = document.querySelector('link[rel="prefetch"][href*="login"]');
    if (!loginPage) {
      e.preventDefault();
      features.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ── Navbar hamburger (mobile) ──────────────────────────────────────────────── */

function wireHamburger() {
  const hamburger = document.getElementById('navbar-hamburger');
  const links     = document.getElementById('navbar-links');
  if (!hamburger || !links) return;

  hamburger.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ── Feature cards – render from config ────────────────────────────────────── */

/**
 * renderFeatureCards
 * Dynamically builds the five metric cards from SHASTRA_CONFIG.METRICS
 * so the config is the single source of truth for labels and icons.
 */
function renderFeatureCards() {
  const grid = document.getElementById('features-grid');
  if (!grid || !window.SHASTRA_CONFIG) return;

  grid.innerHTML = window.SHASTRA_CONFIG.METRICS.map((m) => `
    <div class="feature-card" data-metric="${m.key}">
      <span class="feature-icon" aria-hidden="true">${m.icon}</span>
      <h3>${m.label}</h3>
      <p>${m.description}</p>
    </div>
  `).join('');
}

/* ── Om symbol glow (fallback animation restart on low-power devices) ──────── */

function ensureOmAnimation() {
  const om = document.querySelector('.om-symbol');
  if (!om) return;
  // Restart CSS animation when the tab becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      om.style.animation = 'none';
      // Trigger a reflow so the animation restarts cleanly
      void om.offsetWidth;
      om.style.animation = '';
    }
  });
}

/* ── Init ─────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  checkAPIHealth();
  wireGetStartedBtn();
  wireHamburger();
  renderFeatureCards();
  ensureOmAnimation();
});
