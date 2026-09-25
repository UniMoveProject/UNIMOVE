/**
 * UniMove Application Entrypoint
 */

import './styles/main.css';
import { initStorage } from './services/storage.js';
import { initTheme } from './services/theme.js';
import { initRouter } from './router.js';
import { showSplashScreen } from './components/SplashScreen.js';

// Show motion splash screen on page restore / load
showSplashScreen();

// Initialize global stores and theme
initStorage();
initTheme();

// Start SPA client router
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  
  // Registrar Service Worker para PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registrado com sucesso:', registration.scope);
        })
        .catch(err => {
          console.log('Falha ao registrar SW:', err);
        });
    });
  }
});
