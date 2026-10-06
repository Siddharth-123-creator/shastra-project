// Shastra Platform - Phase 2: Authentication
// auth.js – token management and API calls used by login.html

'use strict';

const TOKEN_KEY = 'shastraToken';
const USER_KEY  = 'shastraUser';

/* ── Token helpers ──────────────────────────────────────────────────────── */
const getToken        = ()        => localStorage.getItem(TOKEN_KEY);
const setToken        = (t)       => localStorage.setItem(TOKEN_KEY, t);
const setUser         = (u)       => localStorage.setItem(USER_KEY, JSON.stringify(u));
const getUser         = ()        => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } };
const clearAuth       = ()        => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); };
const isAuthenticated = ()        => Boolean(getToken());

/* ── API base URL from config ───────────────────────────────────────────── */
const apiBase = () => (window.SHASTRA_CONFIG?.API_BASE_URL || 'http://localhost:5001/api');

/* ── Core fetch wrapper ─────────────────────────────────────────────────── */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch(apiBase() + endpoint, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status, data });
  return data;
}

/* ── Auth actions ───────────────────────────────────────────────────────── */
async function handleLogin(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  setToken(data.token);
  setUser(data.user);
  return data;
}

async function handleRegister(name, email, password, role = 'student') {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role })
  });
}

async function verifyToken() {
  if (!getToken()) return { valid: false };
  try   { return await apiFetch('/auth/verify'); }
  catch { clearAuth(); return { valid: false }; }
}

function logout() {
  clearAuth();
  window.location.href = '/index.html';
}

/* ── Login form controller ──────────────────────────────────────────────── */
function initLoginForm() {
  const form        = document.getElementById('login-form');
  const emailInput  = document.getElementById('login-email');
  const passInput   = document.getElementById('login-password');
  const submitBtn   = document.getElementById('login-submit');
  const errorBox    = document.getElementById('login-error');
  const successBox  = document.getElementById('login-success');
  const togglePass  = document.getElementById('toggle-password');

  if (!form) return;

  // Redirect if already logged in
  if (isAuthenticated()) {
    window.location.href = '/pages/dashboard.html';
    return;
  }

  /* Password show/hide */
  if (togglePass) {
    togglePass.addEventListener('click', () => {
      const isText = passInput.type === 'text';
      passInput.type = isText ? 'password' : 'text';
      togglePass.textContent = isText ? '👁' : '🙈';
      togglePass.setAttribute('aria-label', isText ? 'Show password' : 'Hide password');
    });
  }

  /* Clear errors on input */
  [emailInput, passInput].forEach((el) => {
    el?.addEventListener('input', () => { showError(''); el.classList.remove('input-error'); });
  });

  /* Form submit */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = emailInput.value.trim();
    const password = passInput.value;

    // Frontend validation
    if (!email) return showError('Please enter your email.', emailInput);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Please enter a valid email address.', emailInput);
    if (!password) return showError('Please enter your password.', passInput);
    if (password.length < 6) return showError('Password must be at least 6 characters.', passInput);

    setLoading(true);
    showError('');

    try {
      await handleLogin(email, password);
      showSuccess('Login successful! Redirecting…');
      setTimeout(() => { window.location.href = '/pages/dashboard.html'; }, 800);
    } catch (err) {
      showError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  });

  /* Helpers */
  function showError(msg, inputEl) {
    if (errorBox) {
      const span = errorBox.querySelector('span:last-child') || errorBox;
      span.textContent = msg;
      errorBox.hidden = !msg;
    }
    if (successBox) successBox.hidden = true;
    if (inputEl)    inputEl.classList.add('input-error');
  }

  function showSuccess(msg) {
    if (successBox) {
      const span = successBox.querySelector('span:last-child') || successBox;
      span.textContent = msg;
      successBox.hidden = false;
    }
    if (errorBox) errorBox.hidden = true;
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Signing in…' : 'Sign In';
    submitBtn.classList.toggle('btn-loading', loading);
  }
}

/* ── Register form controller ───────────────────────────────────────────── */
function initRegisterForm() {
  const form       = document.getElementById('register-form');
  const errorBox   = document.getElementById('register-error');
  const successBox = document.getElementById('register-success');
  const submitBtn  = document.getElementById('register-submit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name     = document.getElementById('reg-name')?.value.trim();
    const email    = document.getElementById('reg-email')?.value.trim();
    const password = document.getElementById('reg-password')?.value;
    const role     = document.getElementById('reg-role')?.value || 'student';

    if (!name || !email || !password) return showErr('All fields are required.');
    if (password.length < 6) return showErr('Password must be at least 6 characters.');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account…';
    showErr('');

    try {
      await handleRegister(name, email, password, role);
      if (successBox) { successBox.textContent = 'Account created! You can now log in.'; successBox.hidden = false; }
      setTimeout(() => { window.location.href = '/pages/login.html'; }, 1500);
    } catch (err) {
      showErr(err.message || 'Registration failed.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });

  function showErr(msg) {
    if (errorBox) { errorBox.textContent = msg; errorBox.hidden = !msg; }
  }
}

/* ── Auto-init on DOM ready ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initRegisterForm();
});

/* ── Exports for other scripts ──────────────────────────────────────────── */
window.ShastraAuth = { getToken, getUser, isAuthenticated, logout, verifyToken };
