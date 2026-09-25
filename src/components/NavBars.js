/**
 * App Navigation Bars (Sidebar & Bottom Bar)
 * Renders the responsive navigation structure for the logged-in platform.
 */

const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  offer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`
};

export function renderSidebar(currentPath) {
  return `
    <aside class="app-sidebar">
      <div style="font-family:var(--font-subtitle); font-size:0.85rem; color:var(--text-muted); padding:0.5rem 1rem; margin-top:1rem;">MENU PRINCIPAL</div>
      <a href="#/home" class="app-nav-link ${currentPath === '/home' ? 'active' : ''}">
        ${ICONS.home} <span>Início</span>
      </a>
      <a href="#/busca" class="app-nav-link ${currentPath === '/busca' ? 'active' : ''}">
        ${ICONS.search} <span>Buscar Carona</span>
      </a>
      <a href="#/oferecer" class="app-nav-link ${currentPath === '/oferecer' ? 'active' : ''}">
        ${ICONS.offer} <span>Oferecer Carona</span>
      </a>
      <a href="#/minhas-caronas" class="app-nav-link ${currentPath === '/minhas-caronas' ? 'active' : ''}">
        ${ICONS.list} <span>Minhas Caronas</span>
      </a>
      
      <div style="flex: 1;"></div>
      
      <div style="padding: 1rem; margin-top: 1rem; background-color: var(--bg-primary); border-radius: var(--radius-md); text-align: center;">
        <span style="font-family: var(--font-subtitle); font-size: 0.9rem; color: var(--text-secondary);">UniMove v1.0</span>
      </div>
    </aside>
  `;
}

export function renderBottomBar(currentPath) {
  return `
    <nav class="app-bottom-bar">
      <a href="#/home" class="app-bottom-link ${currentPath === '/home' ? 'active' : ''}">
        ${ICONS.home} <span>Início</span>
      </a>
      <a href="#/busca" class="app-bottom-link ${currentPath === '/busca' ? 'active' : ''}">
        ${ICONS.search} <span>Buscar</span>
      </a>
      <a href="#/oferecer" class="app-bottom-link ${currentPath === '/oferecer' ? 'active' : ''}">
        ${ICONS.offer} <span>Oferecer</span>
      </a>
      <a href="#/minhas-caronas" class="app-bottom-link ${currentPath === '/minhas-caronas' ? 'active' : ''}">
        ${ICONS.list} <span>Caronas</span>
      </a>
    </nav>
  `;
}
