/**
 * Header Component
 * Contains Logo, Navigation Links, Theme Toggle and User Status.
 */

import { getCurrentUser } from '../services/auth.js';
import { toggleTheme, getInitialTheme } from '../services/theme.js';

export function renderHeader(currentPath = '/') {
  const user = getCurrentUser();
  const isDark = (document.documentElement.getAttribute('data-theme') || getInitialTheme()) === 'dark';

  return `
    <header class="site-header">
      <div class="header-inner">
        <a href="#/" class="brand-logo-link" title="UniMove - Início">
          <div class="brand-shield-icon">
            <svg viewBox="0 0 100 120" width="34" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5 L88 22 L88 65 C88 92 50 115 50 115 C50 115 12 92 12 65 L12 22 Z" 
                    fill="var(--bg-card)" stroke="var(--amarelo-unimove)" stroke-width="8" stroke-linejoin="round"/>
              <path d="M34 40 V65 C34 74 42 80 50 80 C58 80 66 74 66 65 V45 M66 45 L56 55 M66 45 L76 55" 
                    stroke="var(--azul-unimove)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="brand-title">UNIMOVE</span>
        </a>

        <nav class="header-nav" id="headerNav">
          <a href="#/home" class="nav-link ${currentPath === '/home' ? 'active' : ''}">Início</a>
          <a href="#/busca" class="nav-link ${currentPath === '/busca' ? 'active' : ''}">Buscar carona</a>
          <a href="#/oferecer" class="nav-link ${currentPath === '/oferecer' ? 'active' : ''}">Oferecer carona</a>
          <a href="#/minhas-caronas" class="nav-link ${currentPath === '/minhas-caronas' ? 'active' : ''}">Minhas caronas</a>
        </nav>

        <div class="header-actions">
          <button type="button" class="theme-toggle-btn" id="themeToggleBtn" title="Alternar modo claro / escuro" aria-label="Modo Claro/Escuro">
            ${isDark ? '??' : '??'}
          </button>

          ${user ? `
            <a href="#/perfil" class="user-profile-badge" title="Meu Perfil">
              <div class="user-avatar-circle" style="${user.avatar ? `background-image:url('${user.avatar}')` : ''}">
                ${!user.avatar ? user.nome.slice(0, 2).toUpperCase() : ''}
              </div>
              <span style="font-family:var(--font-subtitle); font-size:0.95rem;">${user.nome.split(' ')[0]}</span>
            </a>
          ` : `
            <a href="#/login" class="btn btn-sm btn-azul">Entrar</a>
          `}

          <button type="button" class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">
            ?
          </button>
        </div>
      </div>
    </header>
  `;
}

export function attachHeaderEvents() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = toggleTheme();
      themeBtn.textContent = next === 'dark' ? '??' : '??';
    });
  }

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('headerNav');
  if (mobileBtn && nav) {
    mobileBtn.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });
  }
}
