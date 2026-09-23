/**
 * Header Component
 * Adapts dynamically without any emojis (uses clean SVG icons and professional typography).
 */

import { getCurrentUser } from '../services/auth.js';
import { toggleTheme, getInitialTheme } from '../services/theme.js';

const MOON_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
const SUN_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const MENU_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;

export function renderHeader(currentPath = '/') {
  const user = getCurrentUser();
  const isDark = (document.documentElement.getAttribute('data-theme') || getInitialTheme()) === 'dark';
  
  const isLanding = (currentPath === '/' || currentPath === '');
  const isAuth = (currentPath === '/login' || currentPath === '/cadastro');

  // 1. LANDING PAGE HEADER
  if (isLanding) {
    return `
      <header class="site-header">
        <div class="header-inner">
          <a href="#/" class="brand-logo-link" title="UniMove - Mobilidade Acadêmica">
            <img src="/logo.png" alt="UniMove Logo" class="brand-shield-img">
            <span class="brand-title">UNIMOVE</span>
          </a>

          <nav class="header-nav" id="headerNav">
            <a href="javascript:void(0)" class="nav-link landing-nav-link" data-scroll="hero-top">Início</a>
            <a href="javascript:void(0)" class="nav-link landing-nav-link" data-scroll="como-funciona">Como funciona</a>
            <a href="javascript:void(0)" class="nav-link landing-nav-link" data-scroll="calculadora">Simular economia</a>
            <a href="javascript:void(0)" class="nav-link landing-nav-link" data-scroll="vantagens">Vantagens</a>
            <a href="javascript:void(0)" class="nav-link landing-nav-link" data-scroll="faq">FAQ</a>
          </nav>

          <div class="header-actions">
            <button type="button" class="theme-toggle-btn" id="themeToggleBtn" title="Alternar modo claro / escuro" aria-label="Modo Claro/Escuro">
              ${isDark ? SUN_ICON : MOON_ICON}
            </button>

            <a href="#/login" class="btn btn-sm btn-outline">Entrar</a>
            <a href="#/cadastro" class="btn btn-sm btn-azul">Criar conta</a>

            <button type="button" class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">
              ${MENU_ICON}
            </button>
          </div>
        </div>
      </header>
    `;
  }

  // 2. AUTH PAGES HEADER
  if (isAuth) {
    return `
      <header class="site-header">
        <div class="header-inner">
          <a href="#/" class="brand-logo-link" title="UniMove">
            <img src="/logo.png" alt="UniMove Logo" class="brand-shield-img">
            <span class="brand-title">UNIMOVE</span>
          </a>

          <nav class="header-nav">
            <a href="#/" class="nav-link">Voltar para o Início</a>
          </nav>

          <div class="header-actions">
            <button type="button" class="theme-toggle-btn" id="themeToggleBtn" title="Alternar modo claro / escuro" aria-label="Modo Claro/Escuro">
              ${isDark ? SUN_ICON : MOON_ICON}
            </button>
            ${currentPath === '/login' 
              ? `<a href="#/cadastro" class="btn btn-sm btn-azul">Criar conta</a>` 
              : `<a href="#/login" class="btn btn-sm btn-outline">Entrar</a>`
            }
          </div>
        </div>
      </header>
    `;
  }

  // 3. PLATAFORMA APP HEADER
  return `
    <header class="site-header">
      <div class="header-inner">
        <a href="#/home" class="brand-logo-link" title="UniMove - Plataforma">
          <img src="/logo.png" alt="UniMove Logo" class="brand-shield-img">
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
            ${isDark ? SUN_ICON : MOON_ICON}
          </button>

          ${user ? `
            <a href="#/perfil" class="user-profile-badge" title="Meu Perfil">
              <div class="user-avatar-circle" style="${user.avatar ? `background-image:url('${user.avatar}')` : ''}">
                ${!user.avatar ? user.nome.slice(0, 2).toUpperCase() : ''}
              </div>
              <span style="font-size:0.95rem;">${user.nome.split(' ')[0]}</span>
            </a>
          ` : `
            <a href="#/login" class="btn btn-sm btn-azul">Entrar</a>
          `}

          <button type="button" class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">
            ${MENU_ICON}
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
      themeBtn.innerHTML = next === 'dark' ? SUN_ICON : MOON_ICON;
    });
  }

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('headerNav');
  if (mobileBtn && nav) {
    mobileBtn.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });
  }

  document.querySelectorAll('.landing-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.scroll;
      if (targetId === 'hero-top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      if (nav && nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
      }
    });
  });
}