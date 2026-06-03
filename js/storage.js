/**
 * storage.js — EtiketFarma Auth System
 * Utilitas data user via localStorage (namespace: isset/)
 *
 * CATATAN: Ini hanya sistem demo frontend.
 * Jangan digunakan untuk produksi tanpa backend + hashing server-side.
 */



const STORE = {
  USERS:   'isset/users',
  SESSION: 'isset/session',
};

/* ── Raw helpers ──────────────────────────────────────────── */
function _storeGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function _storeSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; }
}
function _storeDel(key) { localStorage.removeItem(key); }

/* ── Hash password (SHA-256 via SubtleCrypto) ─────────────── */
async function hashPassword(password) {
  const enc = new TextEncoder();
  const data = enc.encode(password + ':etf-auth-v2');
  const buf  = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

/* ── Users ────────────────────────────────────────────────── */
function getUsers() {
  return _storeGet(STORE.USERS) || [];
}

function saveUsers(users) {
  _storeSet(STORE.USERS, users);
}

function findUserByUsername(username) {
  if (!username) return null;
  const u = username.trim().toLowerCase();
  return getUsers().find(x => x.username.toLowerCase() === u) || null;
}

function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

function updateUser(userId, updates) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx < 0) return false;
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return true;
}

function deleteUser(userId) {
  const users = getUsers().filter(u => u.id !== userId);
  saveUsers(users);
}

function getActiveUsers() {
  return getUsers().filter(u => u.status === 'aktif');
}

function getPasswordRequests() {
  return getUsers().filter(u => u.requestGantiPassword === true);
}

/* ── Session ──────────────────────────────────────────────── */
function getCurrentUser() {
  return _storeGet(STORE.SESSION);
}

function setCurrentUser(userData) {
  _storeSet(STORE.SESSION, userData);
}

function clearCurrentUser() {
  _storeDel(STORE.SESSION);
}
