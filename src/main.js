/**
 * UniMove Application Entrypoint
 */

import './styles/main.css';
import { initStorage } from './services/storage.js';
import { initTheme } from './services/theme.js';
import { initRouter } from './router.js';

// Initialize global stores and theme
initStorage();
initTheme();

// Start SPA client router
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
});
