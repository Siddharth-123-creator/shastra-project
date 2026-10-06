// Shastra Platform - Phase 1: Foundation
// homepage.js – interactions, animations, API health check

'use strict';

/* ── API health check ───────────────────────────────────────────────────── */
async function checkAPIHealth() {
  const el = document.getElementById('api-status');
  if (!el) return;

  const url = window.SHASTRA_CONFIG.API_BASE_URL + window.SHASTRA_CONFIG.ENDPOINTS.HEALTH;

  try {
    const res  = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
    const data = await res.json();
    console.info('[Shastra] API health:', data);
    el.classList.add('ok');
    el.querySelector('.status-label').textContent = `API connected · ${data.message}`;
  } catch (err) {
    console.warn('[Shastra] API unreachable:', err.message);
    el.classList.add('err');
    el.querySelector('.status-label').textContent = 'API offline – start backend on :5001';
  }
}

/* ── Render metric cards from config ────────────────────────────────────── */
function renderMetricCards() {
  const grid = document.getElementById('metrics-grid');
  if (!grid || !window.SHASTRA_CONFIG) return;

  grid.innerHTML = window.SHASTRA_CONFIG.METRICS.map((m, i) => `
    <article class="metric-card reveal reveal-delay-${i + 1}" role="listitem">
      <div class="metric-icon-wrap" aria-hidden="true">${m.icon}</div>
      <h3>${m.label}</h3>
      <p>${m.description}</p>
    </article>
  `).join('');

  // Trigger observer after DOM injection
  observeRevealElements();
}

/* ── Scroll-reveal (Intersection Observer) ──────────────────────────────── */
function observeRevealElements() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ── Mobile hamburger ───────────────────────────────────────────────────── */
function wireHamburger() {
  const btn   = document.getElementById('hamburger-btn');
  const links = document.getElementById('navbar-nav');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Smooth scroll for anchor nav links ─────────────────────────────────── */
function wireSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector('.navbar')?.offsetHeight || 70;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Navbar scroll shadow toggle ────────────────────────────────────────── */
function wireNavbarScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const update = () =>
    nav.style.boxShadow = window.scrollY > 10
      ? '0 1px 32px rgba(0,0,0,0.45)'
      : '0 1px 24px rgba(0,0,0,0.25)';

  window.addEventListener('scroll', update, { passive: true });
}

/* ── Init ────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderMetricCards();   // cards first so observer picks them up
  observeRevealElements();
  wireHamburger();
  wireSmoothScroll();
  wireNavbarScroll();
  checkAPIHealth();

  // Footer year
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();
});
