/**
 * Theme Service
 * Controls Light / Dark mode conforming to the UniMove Brand Manual:
 * - Default: Light Mode (Branco-bege #FFF4CC)
 * - Optional: Dark Mode (Preto UniMove #131313)
 */

const THEME_KEY = 'unimove_theme';

export function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  // Manual de Marca: "O app abre sempre no modo claro, acolhedor em branco-bege."
  return 'light';
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  
  // Dispatch custom event for UI updates
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || getInitialTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function initTheme() {
  const initial = getInitialTheme();
  applyTheme(initial);
}
