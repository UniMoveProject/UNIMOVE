/**
 * Footer Component
 * Institutional collegiate footer.
 */

export function renderFooter() {
  return `
    <footer class="site-footer">
      <div style="max-width:1120px; margin:0 auto; display:flex; flex-direction:column; gap:0.5rem; align-items:center;">
        <div style="display:flex; align-items:center; gap:0.6rem; font-family:var(--font-subtitle); font-size:1.15rem; color:var(--text-primary);">
          <img src="/logo.png" alt="UniMove Logo" style="width:24px; height:28px; object-fit:contain;">
          <span>UNIMOVE</span>
          <span style="opacity:0.4;">·</span>
          <span style="font-weight:normal; font-size:0.95rem;">Mobilidade Acadêmica & Carona Solidária</span>
        </div>
        <p style="font-size:0.95rem; color:var(--text-muted); margin:0;">
          A rota até a faculdade, dividida com quem já faz o mesmo caminho.
        </p>
        <p style="font-size:0.85rem; opacity:0.6; margin-top:0.25rem;">
          UNIMOVE · 2026
        </p>
      </div>
    </footer>
  `;
}