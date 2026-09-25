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
      <!-- Menu Drawer Overlay (clique para fechar) -->
      <div id="drawerOverlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:998; backdrop-filter:blur(2px);"></div>

      <!-- Drawer Menu Lateral -->
      <nav id="landingDrawer" style="
        position:fixed; top:0; right:0; width:280px; height:100vh;
        background-color:var(--bg-card);
        border-left:2px solid var(--border-color);
        box-shadow:var(--shadow-lg);
        z-index:999;
        display:flex; flex-direction:column;
        padding:2rem 1.5rem;
        gap:0.5rem;
        transform:translateX(100%);
        transition:transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      ">
        <!-- Drawer Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <img src="/logo.png" alt="UniMove" style="width:28px; height:32px; object-fit:contain;">
            <span class="brand-title" style="font-size:1.3rem;">UNIMOVE</span>
          </div>
          <button id="drawerCloseBtn" style="background:none; border:none; cursor:pointer; color:var(--text-primary); padding:0.4rem;" aria-label="Fechar menu">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Nav Links -->
        <a href="javascript:void(0)" class="landing-nav-link drawer-nav-link" data-scroll="hero-top" style="display:flex; align-items:center; gap:0.75rem; padding:0.85rem 1rem; border-radius:var(--radius-md); font-family:var(--font-subtitle); font-size:1.1rem; color:var(--text-primary); text-decoration:none; transition:background 0.2s;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Início
        </a>
        <a href="javascript:void(0)" class="landing-nav-link drawer-nav-link" data-scroll="como-funciona" style="display:flex; align-items:center; gap:0.75rem; padding:0.85rem 1rem; border-radius:var(--radius-md); font-family:var(--font-subtitle); font-size:1.1rem; color:var(--text-primary); text-decoration:none; transition:background 0.2s;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Como funciona
        </a>
        <a href="javascript:void(0)" class="landing-nav-link drawer-nav-link" data-scroll="calculadora" style="display:flex; align-items:center; gap:0.75rem; padding:0.85rem 1rem; border-radius:var(--radius-md); font-family:var(--font-subtitle); font-size:1.1rem; color:var(--text-primary); text-decoration:none; transition:background 0.2s;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Simular economia
        </a>
        <a href="javascript:void(0)" class="landing-nav-link drawer-nav-link" data-scroll="vantagens" style="display:flex; align-items:center; gap:0.75rem; padding:0.85rem 1rem; border-radius:var(--radius-md); font-family:var(--font-subtitle); font-size:1.1rem; color:var(--text-primary); text-decoration:none; transition:background 0.2s;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Vantagens
        </a>
        <a href="javascript:void(0)" class="landing-nav-link drawer-nav-link" data-scroll="faq" style="display:flex; align-items:center; gap:0.75rem; padding:0.85rem 1rem; border-radius:var(--radius-md); font-family:var(--font-subtitle); font-size:1.1rem; color:var(--text-primary); text-decoration:none; transition:background 0.2s;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          FAQ
        </a>

        <!-- Divider -->
        <div style="height:1px; background:var(--border-color); margin:1rem 0;"></div>

        <!-- Auth Buttons -->
        <a href="#/login" class="btn btn-outline btn-block" style="margin-bottom:0.5rem;">Entrar na plataforma</a>
        <a href="#/cadastro" class="btn btn-azul btn-block">Criar conta grátis</a>
      </nav>

      <!-- Header Bar -->
      <header class="site-header">
        <div class="header-inner">
          <a href="#/" class="brand-logo-link" title="UniMove - Mobilidade Acadêmica">
            <img src="/logo.png" alt="UniMove Logo" class="brand-shield-img">
            <span class="brand-title">UNIMOVE</span>
          </a>

          <!-- Desktop Nav (visible on wide screens) -->
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

            <!-- Desktop auth buttons -->
            <a href="#/login" class="btn btn-sm btn-outline landing-desktop-only">Entrar</a>
            <a href="#/cadastro" class="btn btn-sm btn-azul landing-desktop-only">Criar conta</a>

            <!-- Mobile hamburger -->
            <button type="button" class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Abrir menu">
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

  // 3. PLATAFORMA APP HEADER (Topbar)
  return `
    <header class="app-topbar">
      <div class="header-inner">
        <a href="#/home" class="brand-logo-link" title="UniMove - Plataforma">
          <img src="/logo.png" alt="UniMove Logo" class="brand-shield-img">
          <span class="brand-title">UNIMOVE</span>
        </a>

        <!-- No middle nav for platform, handled by Sidebar/BottomBar -->
        <div style="flex:1"></div>

        <div class="header-actions">
          <button type="button" class="theme-toggle-btn" id="themeToggleBtn" title="Alternar modo claro / escuro" aria-label="Modo Claro/Escuro">
            ${isDark ? SUN_ICON : MOON_ICON}
          </button>

          ${user ? `
            <a href="#/perfil" class="user-profile-badge" title="Meu Perfil">
              <div class="user-avatar-circle" style="${(user.avatar || user.avatar_url) && user.avatar !== 'undefined' ? `background-image:url('${user.avatar || user.avatar_url}')` : ''}">
                ${!(user.avatar || user.avatar_url) || user.avatar === 'undefined' ? (user.nome || 'U').slice(0, 2).toUpperCase() : ''}
              </div>
              <span style="font-size:0.95rem; display:none; @media(min-width: 768px){display:inline;}">${(user.nome || 'Usuario').split(' ')[0]}</span>
            </a>
          ` : `
            <a href="#/login" class="btn btn-sm btn-azul">Entrar</a>
          `}
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

  // ── Landing Drawer (Slide-in menu) ─────────────────────────────
  const drawer = document.getElementById('landingDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    if (!drawer || !overlay) return;
    overlay.style.display = 'block';
    requestAnimationFrame(() => {
      drawer.style.transform = 'translateX(0)';
    });
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.style.transform = 'translateX(100%)';
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (mobileBtn) mobileBtn.addEventListener('click', openDrawer);
  if (closeBtn)  closeBtn.addEventListener('click', closeDrawer);
  if (overlay)   overlay.addEventListener('click', closeDrawer);

  // ── Scroll smooth para todas as nav links (header + drawer) ────
  document.querySelectorAll('.landing-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.scroll;
      if (targetId === 'hero-top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetEl = document.getElementById(targetId);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      closeDrawer();
    });
  });

  // Highlight drawer links on hover
  document.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.background = 'rgba(15,93,237,0.08)';
      link.style.color = 'var(--azul-unimove)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.background = '';
      link.style.color = 'var(--text-primary)';
    });
  });
}