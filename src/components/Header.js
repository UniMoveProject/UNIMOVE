/**
 * Header Component
 * Adapts dynamically between:
 * 1. Landing Page Header (only landing page in-page smooth-scroll section links, login/register CTA, theme switch)
 * 2. Auth Page Header (clean header with link back to landing page)
 * 3. Platform App Header (internal app navigation: Início, Buscar carona, Oferecer carona, Minhas caronas, Perfil)
 */

import { getCurrentUser } from '../services/auth.js';
import { toggleTheme, getInitialTheme } from '../services/theme.js';

export function renderHeader(currentPath = '/') {
  const user = getCurrentUser();
  const isDark = (document.documentElement.getAttribute('data-theme') || getInitialTheme()) === 'dark';
  
  const isLanding = (currentPath === '/' || currentPath === '');
  const isAuth = (currentPath === '/login' || currentPath === '/cadastro');

  // 1. LANDING PAGE HEADER (Exclusivo da Landing Page, com scroll suave entre as seções)
  if (isLanding) {
    return `
      <header class="site-header">
        <div class="header-inner">
          <!-- Logo Oficial -->
          <a href="#/" class="brand-logo-link" title="UniMove - Mobilidade Acadêmica">
            <img src="/logo.png" alt="UniMove Logo" class="brand-shield-img">
            <span class="brand-title">UNIMOVE</span>
          </a>

          <!-- Links de Seções da Própria Landing Page -->
          <nav class="header-nav" id="headerNav">
            <a href="javascript:void(0)" class="nav-link landing-nav-link" data-scroll="hero-top">Início</a>
            <a href="javascript:void(0)" class="nav-link landing-nav-link" data-scroll="como-funciona">Como funciona</a>
            <a href="javascript:void(0)" class="nav-link landing-nav-link" data-scroll="calculadora">Simular economia</a>
            <a href="javascript:void(0)" class="nav-link landing-nav-link" data-scroll="vantagens">Vantagens</a>
            <a href="javascript:void(0)" class="nav-link landing-nav-link" data-scroll="faq">FAQ</a>
          </nav>

          <!-- Ações da Landing Page (Entrar / Criar conta) -->
          <div class="header-actions">
            <button type="button" class="theme-toggle-btn" id="themeToggleBtn" title="Alternar modo claro / escuro" aria-label="Modo Claro/Escuro">
              ${isDark ? '🌙' : '☀️'}
            </button>

            <a href="#/login" class="btn btn-sm btn-outline">Entrar</a>
            <a href="#/cadastro" class="btn btn-sm btn-azul">Criar conta</a>

            <button type="button" class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">
              ☰
            </button>
          </div>
        </div>
      </header>
    `;
  }

  // 2. AUTH PAGES HEADER (Login / Cadastro)
  if (isAuth) {
    return `
      <header class="site-header">
        <div class="header-inner">
          <a href="#/" class="brand-logo-link" title="UniMove">
            <img src="/logo.png" alt="UniMove Logo" class="brand-shield-img">
            <span class="brand-title">UNIMOVE</span>
          </a>

          <nav class="header-nav">
            <a href="#/" class="nav-link">← Voltar para o Início</a>
          </nav>

          <div class="header-actions">
            <button type="button" class="theme-toggle-btn" id="themeToggleBtn" title="Alternar modo claro / escuro" aria-label="Modo Claro/Escuro">
              ${isDark ? '🌙' : '☀️'}
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

  // 3. PLATAFORMA APP HEADER (Pós-login: Home, Busca, Oferecer, Minhas Caronas, Perfil, Chat)
  return `
    <header class="site-header">
      <div class="header-inner">
        <a href="#/home" class="brand-logo-link" title="UniMove - Plataforma">
          <img src="/logo.png" alt="UniMove Logo" class="brand-shield-img">
          <span class="brand-title">UNIMOVE</span>
        </a>

        <!-- Links Internos da Plataforma -->
        <nav class="header-nav" id="headerNav">
          <a href="#/home" class="nav-link ${currentPath === '/home' ? 'active' : ''}">Início</a>
          <a href="#/busca" class="nav-link ${currentPath === '/busca' ? 'active' : ''}">Buscar carona</a>
          <a href="#/oferecer" class="nav-link ${currentPath === '/oferecer' ? 'active' : ''}">Oferecer carona</a>
          <a href="#/minhas-caronas" class="nav-link ${currentPath === '/minhas-caronas' ? 'active' : ''}">Minhas caronas</a>
        </nav>

        <div class="header-actions">
          <button type="button" class="theme-toggle-btn" id="themeToggleBtn" title="Alternar modo claro / escuro" aria-label="Modo Claro/Escuro">
            ${isDark ? '🌙' : '☀️'}
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
            ☰
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
      themeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('headerNav');
  if (mobileBtn && nav) {
    mobileBtn.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });
  }

  // Smooth scroll para links da Landing Page
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