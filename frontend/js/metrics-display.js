// Shastra Platform - Phase 3: Student Dashboard
// metrics-display.js – circular progress SVGs and metric card rendering

'use strict';

const METRIC_META = {
  concentration: { sanskrit: 'Dharana',    color: '#e07020', label: 'Concentration' },
  selfReliance:  { sanskrit: 'Swavalamban', color: '#c8941a', label: 'Self-Reliance'  },
  perseverance:  { sanskrit: 'Dhairya',    color: '#6b1a2a', label: 'Perseverance'   },
  confidence:    { sanskrit: 'Vishwas',    color: '#0f6e8c', label: 'Confidence'     },
  character:     { sanskrit: 'Charitra',   color: '#2d6e45', label: 'Character'      }
};

/* ── Color coding by score ──────────────────────────────────────────────── */
function scoreColor(score) {
  if (score >= 75) return '#2d6e45';   // green
  if (score >= 50) return '#b87a00';   // amber
  return '#c0402a';                    // red
}

function scoreLabel(score) {
  if (score >= 75) return 'Strong';
  if (score >= 50) return 'Growing';
  return 'Needs work';
}

/* ── SVG circular progress ──────────────────────────────────────────────── */
function buildCircle(score, color, size = 120) {
  const R   = (size / 2) - 10;
  const C   = 2 * Math.PI * R;
  const pct = Math.max(0, Math.min(100, score));
  const id  = `grad-${Math.random().toString(36).slice(2)}`;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="${color}" />
          <stop offset="100%" stop-color="#c8941a"  />
        </linearGradient>
      </defs>
      <!-- Track -->
      <circle
        cx="${size/2}" cy="${size/2}" r="${R}"
        fill="none" stroke="#e2e8f0" stroke-width="8"
      />
      <!-- Progress – animated via CSS class -->
      <circle
        class="progress-ring"
        cx="${size/2}" cy="${size/2}" r="${R}"
        fill="none"
        stroke="url(#${id})"
        stroke-width="8"
        stroke-linecap="round"
        stroke-dasharray="${C}"
        stroke-dashoffset="${C}"
        data-target="${C - (pct / 100) * C}"
        transform="rotate(-90 ${size/2} ${size/2})"
        style="transition: stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1);"
      />
      <!-- Score label -->
      <text x="${size/2}" y="${size/2 - 4}"
        text-anchor="middle" dominant-baseline="middle"
        font-family="Outfit, sans-serif" font-size="22" font-weight="800"
        fill="${scoreColor(score)}"
      >${pct}</text>
      <text x="${size/2}" y="${size/2 + 16}"
        text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, sans-serif" font-size="10" font-weight="500"
        fill="#94a3b8"
      >/100</text>
    </svg>
  `;
}

/* ── Trigger animation once element is visible ──────────────────────────── */
function animateRings() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.progress-ring').forEach((ring) => {
        ring.style.strokeDashoffset = ring.dataset.target;
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.metric-card').forEach((card) => observer.observe(card));
}

/* ── Render a single metric card ────────────────────────────────────────── */
function buildMetricCard(key, data, trend) {
  const meta   = METRIC_META[key] || { sanskrit: key, color: '#e07020', label: key };
  const score  = typeof data === 'number' ? data : (data?.total ?? 0);
  const delta  = trend?.[key] ?? 0;
  const arrow  = delta >= 0 ? '↑' : '↓';
  const tClass = delta >= 0 ? 'trend-up' : 'trend-down';

  return `
    <article class="metric-card reveal" data-metric="${key}">
      <div class="metric-card-top">
        <div class="metric-circle">${buildCircle(score, meta.color)}</div>
        <div class="metric-info">
          <p class="metric-sanskrit">${meta.sanskrit}</p>
          <h3 class="metric-name">${meta.label}</h3>
          <span class="metric-status" style="color:${scoreColor(score)}">${scoreLabel(score)}</span>
          <p class="metric-trend ${tClass}">
            ${arrow} ${Math.abs(delta)} pts from last week
          </p>
        </div>
      </div>
    </article>
  `;
}

/* ── Public render function called by dashboard.js ─────────────────────── */
function renderMetrics(metricsData) {
  const grid = document.getElementById('metrics-grid');
  if (!grid) return;

  const trend = metricsData.weeklyTrend || {};
  const keys  = ['concentration', 'selfReliance', 'perseverance', 'confidence'];

  grid.innerHTML = keys.map((k) => buildMetricCard(k, metricsData[k], trend)).join('');

  // Character card (full width)
  const charGrid = document.getElementById('character-card');
  if (charGrid) {
    const score = metricsData.character || 0;
    const meta  = METRIC_META.character;
    charGrid.innerHTML = `
      <div class="character-inner">
        <div class="character-circle">${buildCircle(score, meta.color, 140)}</div>
        <div class="character-text">
          <p class="metric-sanskrit">${meta.sanskrit}</p>
          <h3 class="metric-name">Character</h3>
          <p class="character-desc">
            The composite of all four qualities —
            your overall measure of inner excellence.
          </p>
          <span class="metric-status" style="color:${scoreColor(score)};font-size:1rem;">
            ${scoreLabel(score)}
          </span>
        </div>
      </div>
    `;
  }

  // Kick off animations after DOM injection
  requestAnimationFrame(() => {
    animateRings();
    document.querySelectorAll('.reveal').forEach((el) =>
      setTimeout(() => el.classList.add('visible'), 50)
    );
  });
}

window.ShastraMetrics = { renderMetrics };
