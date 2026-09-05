/**
 * Footer Component
 * Institutional collegiate footer.
 */

export function renderFooter() {
  return `
    <footer class="site-footer">
      <div style="max-width:1120px; margin:0 auto; display:flex; flex-direction:column; gap:0.5rem; align-items:center;">
        <div style="display:flex; align-items:center; gap:0.5rem; font-family:var(--font-title); font-size:1.1rem; letter-spacing:-0.05em; color:var(--text-primary);">
          <span>UNIMOVE</span>
          <span style="opacity:0.4;">·</span>
          <span style="font-family:var(--font-subtitle); font-size:0.9rem; font-weight:normal;">Mobilidade Acadêmica & Carona Solidária</span>
        </div>
        <p style="font-size:0.95rem; color:var(--text-muted);">
          A rota até a faculdade, dividida com quem já faz o mesmo caminho.
        </p>
        <p style="font-size:0.85rem; opacity:0.6; margin-top:0.25rem;">
          UNIMOVE · 2026
        </p>
      </div>
    </footer>
  `;
}
