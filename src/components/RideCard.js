/**
 * RideCard Component
 * Displays ride information according to the Brand Manual specifications (No emojis).
 */

export function renderRideCard(ride, isOwner = false) {
  return `
    <article class="card ride-card" id="ride-${ride.id}" style="margin-bottom:1.25rem;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
        
        <!-- Driver Info -->
        <div style="display:flex; align-items:center; gap:0.85rem;">
          <div style="width:48px; height:48px; border-radius:50%; background-image:url('${ride.motoristaFoto}'); background-size:cover; background-position:center; border:2px solid var(--azul-unimove);"></div>
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <h3 style="font-family:var(--font-subtitle); font-size:1.15rem; text-transform:none; margin:0;">${ride.motoristaNome}</h3>
              <span class="badge badge-amarelo" style="font-size:0.8rem;">Nota ${ride.motoristaAvaliacao.toFixed(1)}</span>
            </div>
            <p style="font-size:0.92rem; color:var(--text-muted); margin:0;">${ride.motoristaCurso} · ${ride.veiculo} (${ride.cor})</p>
          </div>
        </div>

        <!-- Price & Seats Badge -->
        <div style="display:flex; align-items:center; gap:0.65rem; text-align:right;">
          <span class="badge badge-verde" style="font-size:0.9rem; padding:0.35rem 0.85rem;">
            ${ride.vagasDisponiveis > 0 ? `${ride.vagasDisponiveis} vagas` : 'Lotado'}
          </span>
          <div class="price-tag" style="font-family:var(--font-subtitle); font-size:1.25rem; color:var(--text-primary);">
            ${ride.preco > 0 ? `R$ ${ride.preco.toFixed(2).replace('.', ',')}` : 'Grátis'}
          </div>
        </div>
      </div>

      <!-- Route Timeline -->
      <div style="background-color:var(--bg-primary); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:1.15rem;">
        <div style="font-family:var(--font-subtitle); font-size:0.92rem; color:var(--text-muted); margin-bottom:0.4rem; letter-spacing:0.02em;">
          ROTA · SAÍDA ${ride.horarioSaida} ${ride.horarioChegada ? `· CHEGADA ${ride.horarioChegada}` : ''}
        </div>
        <div style="display:flex; align-items:center; gap:0.65rem; font-family:var(--font-subtitle); font-size:1.05rem; flex-wrap:wrap;">
          <span style="color:var(--text-primary);"><strong style="font-size:0.85rem; color:var(--text-muted);">DE:</strong> ${ride.origem}</span>
          ${ride.pontoEncontro ? `<span style="color:var(--text-muted); font-size:0.95rem;">(${ride.pontoEncontro})</span>` : ''}
          <span style="color:var(--azul-unimove); font-weight:bold;">→</span>
          <span style="color:var(--azul-unimove);"><strong style="font-size:0.85rem; color:var(--azul-unimove);">PARA:</strong> ${ride.destino}</span>
        </div>
      </div>

      <!-- Actions -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
        <div style="display:flex; gap:0.5rem;">
          <a href="#/chat/${ride.id}" class="btn btn-sm btn-outline" title="Abrir chat da carona">
            Chat do grupo
          </a>
        </div>

        <div style="display:flex; gap:0.5rem;">
          ${isOwner ? `
            <a href="#/editar-carona/${ride.id}" class="btn btn-sm btn-outline">Editar</a>
            <button type="button" class="btn btn-sm btn-outline btn-delete-ride" data-id="${ride.id}" style="color:#d32f2f; border-color:rgba(211,47,47,0.3);">Excluir</button>
          ` : `
            <button type="button" class="btn btn-sm btn-azul btn-pedir-carona" data-id="${ride.id}" ${ride.vagasDisponiveis <= 0 ? 'disabled' : ''}>
              ${ride.vagasDisponiveis > 0 ? 'Pedir carona' : 'Esgotado'}
            </button>
          `}
        </div>
      </div>
    </article>
  `;
}