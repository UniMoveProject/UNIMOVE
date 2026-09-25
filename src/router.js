/**
 * SPA Router
 * Coordinates client-side routing, view rendering and lifecycle event attachments.
 */

import { renderHeader, attachHeaderEvents } from './components/Header.js';
import { renderFooter } from './components/Footer.js';

import { renderLandingView, attachLandingEvents } from './views/LandingView.js';
import { renderHomeView, attachHomeEvents } from './views/HomeView.js';
import { renderSearchRidesView, attachSearchRidesEvents } from './views/SearchRidesView.js';
import { renderOfferRideView, attachOfferRideEvents } from './views/OfferRideView.js';
import { renderMyRidesView, attachMyRidesEvents } from './views/MyRidesView.js';
import { renderEditRideView, attachEditRideEvents } from './views/EditRideView.js';
import { renderChatView, attachChatEvents } from './views/ChatView.js';
import { renderProfileView, attachProfileEvents } from './views/ProfileView.js';
import { renderLoginView, attachLoginEvents } from './views/LoginView.js';
import { renderRegisterView, attachRegisterEvents } from './views/RegisterView.js';

export function parseRoute() {
  let rawHash = window.location.hash.slice(1) || '/';
  
  // Tratar âncoras da Landing Page como rota Landing ('/')
  const landingAnchors = ['como-funciona', 'calculadora', 'vantagens', 'faq', 'hero-top', ''];
  if (landingAnchors.includes(rawHash) || rawHash === '/') {
    return { path: '/', queryString: '', anchor: rawHash };
  }

  if (!rawHash.startsWith('/')) {
    rawHash = '/' + rawHash;
  }

  const [path, queryString] = rawHash.split('?');
  return { path: path || '/', queryString: queryString || '', anchor: '' };
}

export function navigateTo(path) {
  window.location.hash = path;
}

export async function handleRoute() {
  const app = document.getElementById('app');
  if (!app) return;

  const { path, queryString, anchor } = parseRoute();

  let viewHtml = '';
  let attachEvents = () => {};

  if (path === '/' || path === '') {
    viewHtml = renderLandingView();
    attachEvents = attachLandingEvents;
  } else if (path === '/home') {
    viewHtml = renderHomeView();
    attachEvents = attachHomeEvents;
  } else if (path === '/busca') {
    viewHtml = renderSearchRidesView(queryString);
    attachEvents = attachSearchRidesEvents;
  } else if (path === '/oferecer') {
    viewHtml = renderOfferRideView();
    attachEvents = attachOfferRideEvents;
  } else if (path === '/minhas-caronas') {
    viewHtml = renderMyRidesView();
    attachEvents = attachMyRidesEvents;
  } else if (path.startsWith('/editar-carona/')) {
    const rideId = path.replace('/editar-carona/', '');
    viewHtml = renderEditRideView(rideId);
    attachEvents = attachEditRideEvents;
  } else if (path.startsWith('/chat/')) {
    const rideId = path.replace('/chat/', '');
    viewHtml = renderChatView(rideId);
    attachEvents = attachChatEvents;
  } else if (path === '/perfil') {
    viewHtml = renderProfileView();
    attachEvents = attachProfileEvents;
  } else if (path === '/login') {
    viewHtml = renderLoginView();
    attachEvents = attachLoginEvents;
  } else if (path === '/cadastro') {
    viewHtml = renderRegisterView();
    attachEvents = attachRegisterEvents;
  } else {
    // 404 fallback
    viewHtml = `
      <div class="card" style="text-align:center; padding:3rem 1.5rem; max-width:500px; margin:2rem auto;">
        <h1 class="page-title" style="font-size:2rem; margin-bottom:0.5rem;">404</h1>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem;">Página não encontrada no UniMove.</p>
        <a href="#/" class="btn btn-azul">Ir para a página inicial</a>
      </div>
    `;
  }

  // Marca dágua oficial do manual de marca
  const watermarkSvg = `
    <div class="brand-watermark-bg">
      <img src="/logo.png" alt="UniMove Shield" style="width:100%; height:auto; opacity:0.18; filter:grayscale(0.2);" />
    </div>
  `;

  // Render Full App Frame
  app.innerHTML = `
    <div class="app-container">
      ${watermarkSvg}
      ${renderHeader(path)}
      <main class="main-content">
        ${viewHtml}
      </main>
      ${renderFooter()}
    </div>
  `;

  // Attach interactive listeners
  attachHeaderEvents();
  await attachEvents();

  // Scroll logic
  if (anchor && anchor !== '' && anchor !== '/') {
    const el = document.getElementById(anchor);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
}


export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('authChanged', handleRoute);
  window.addEventListener('themeChanged', () => {});

  // Handle first load
  handleRoute();
}