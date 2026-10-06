// Shastra Platform - Phase 3: Student Dashboard
// dashboard.js – data loading, activity feed, auto-refresh

'use strict';

const API = () => window.SHASTRA_CONFIG?.API_BASE_URL || 'http://localhost:5001/api';
const token = () => localStorage.getItem('shastraToken');
const storedUser = () => { try { return JSON.parse(localStorage.getItem('shastraUser')); } catch { return null; } };

/* ── Auth guard ──────────────────────────────────────────────────────────── */
function guardAuth() {
  if (!token()) {
    window.location.href = '../pages/login.html';
    return false;
  }
  return true;
}

/* ── Fetch wrapper ───────────────────────────────────────────────────────── */
async function apiFetch(path) {
  const res = await fetch(API() + path, {
    headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' }
  });
  if (res.status === 401) {
    localStorage.removeItem('shastraToken');
    localStorage.removeItem('shastraUser');
    window.location.href = '../pages/login.html';
    throw new Error('Session expired');
  }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

/* ── Populate header ─────────────────────────────────────────────────────── */
function populateHeader(user) {
  const firstName = (user.name || 'Student').split(' ')[0];
  const el = document.getElementById('welcome-name');
  if (el) el.textContent = `Welcome back, ${firstName}!`;

  document.querySelectorAll('.sidebar-user-name').forEach(e => e.textContent = user.name);
  document.querySelectorAll('.sidebar-user-role').forEach(e => e.textContent = user.role === 'teacher' ? 'Teacher' : 'Student');

  const today = document.getElementById('today-date');
  if (today) today.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

/* ── Activity feed ───────────────────────────────────────────────────────── */
function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m || 1}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const ACTIVITY_ICONS = {
  task_completed:      '📝',
  login:               '🔐',
  achievement_unlocked:'🏆',
  metric_updated:      '📊'
};

function renderActivity(activities) {
  const list = document.getElementById('activity-list');
  if (!list) return;

  if (!activities?.length) {
    list.innerHTML = '<p class="activity-empty">No activity yet. Complete a task to get started!</p>';
    return;
  }

  list.innerHTML = activities.map(a => `
    <div class="activity-item">
      <span class="activity-icon">${ACTIVITY_ICONS[a.type] || '📌'}</span>
      <div class="activity-body">
        <p class="activity-title">${a.title}</p>
        <p class="activity-meta">${a.description || ''}</p>
      </div>
      <div class="activity-right">
        ${a.points ? `<span class="activity-points">+${a.points} pts</span>` : ''}
        <span class="activity-time">${timeAgo(a.timestamp)}</span>
      </div>
    </div>
  `).join('');
}

/* ── Progress stats ──────────────────────────────────────────────────────── */
function renderProgress(progress) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('stat-tasks',    progress?.thisWeek?.tasksCompleted ?? 0);
  set('stat-points',   progress?.allTime?.totalPoints    ?? 0);
  set('stat-monthly',  progress?.thisMonth?.tasksCompleted ?? 0);
  set('stat-total',    progress?.allTime?.tasksCompleted  ?? 0);
}

/* ── Show error banner ───────────────────────────────────────────────────── */
function showError(msg) {
  const el = document.getElementById('dashboard-error');
  if (el) { el.textContent = msg; el.hidden = false; }
  console.error('[Dashboard]', msg);
}

/* ── Logout ──────────────────────────────────────────────────────────────── */
function wireLogout() {
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('shastraToken');
      localStorage.removeItem('shastraUser');
      window.location.href = '../index.html';
    });
  });
}

/* ── Sidebar mobile toggle ───────────────────────────────────────────────── */
function wireSidebar() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!toggle || !sidebar) return;

  const open  = () => { sidebar.classList.add('open'); overlay?.classList.add('visible'); };
  const close = () => { sidebar.classList.remove('open'); overlay?.classList.remove('visible'); };

  toggle.addEventListener('click', () => sidebar.classList.contains('open') ? close() : open());
  overlay?.addEventListener('click', close);
}

/* ── Main load ───────────────────────────────────────────────────────────── */
async function loadDashboard() {
  if (!guardAuth()) return;

  // Show cached user immediately so page feels instant
  const cached = storedUser();
  if (cached) populateHeader(cached);

  const userId = cached?.id;
  if (!userId) { showError('Session data missing. Please log in again.'); return; }

  try {
    const [student, metrics, activity, progress] = await Promise.allSettled([
      apiFetch(`/students/${userId}`),
      apiFetch(`/metrics/${userId}`),
      apiFetch(`/students/${userId}/activity?limit=5`),
      apiFetch(`/students/${userId}/progress`)
    ]);

    if (student.status === 'fulfilled') populateHeader(student.value);
    if (metrics.status  === 'fulfilled') window.ShastraMetrics?.renderMetrics(metrics.value);
    else showError('Could not load metrics. Is the backend running with a database?');
    if (activity.status === 'fulfilled') renderActivity(activity.value);
    if (progress.status === 'fulfilled') renderProgress(progress.value);

  } catch (err) {
    if (err.message !== 'Session expired') showError('Failed to load dashboard data.');
  }
}

/* ── Auto-refresh every 30 s ─────────────────────────────────────────────── */
let refreshTimer;
function startAutoRefresh() {
  refreshTimer = setInterval(loadDashboard, 30000);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(refreshTimer);
    else startAutoRefresh();
  });
}

/* ── Init ────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  wireSidebar();
  wireLogout();
  loadDashboard();
  startAutoRefresh();

  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();
});
