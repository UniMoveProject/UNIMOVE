import { showUserProfileModal } from './UserProfileModal.js';
import { TARIFA_ONIBUS_DF } from '../services/rides.js';

export function renderRideCard(ride, isOwner = false) {
  const precoNum = parseFloat(ride.preco) || 0;
  const economia = Math.max(0, TARIFA_ONIBUS_DF - precoNum);

  return `
    <article class="card ride-card parallax-fade-up" id="ride-${ride.id}" style="margin-bottom:1.25rem; animation-delay: 0.15s;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
        
        <!-- Driver Info (Item 10: Perfil Clicável) -->
        <div class="driver-profile-trigger" data-driver-id="${ride.motoristaId}" style="display:flex; align-items:center; gap:0.85rem; cursor:pointer;" title="Clique para visualizar o perfil completo do motorista">
          ${ride.fotoVeiculo ? `<img src="${ride.fotoVeiculo}" alt="Foto do carro" style="width:80px; height:56px; object-fit:cover; border-radius:8px; border:1px solid var(--border-color); flex-shrink:0;">` : ''}
          <div style="width:48px; height:48px; border-radius:50%; background-image:url('${ride.motoristaFoto}'); background-size:cover; background-position:center; border:2px solid var(--azul-unimove); background-color:var(--azul-unimove); flex-shrink:0;"></div>
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
              <h3 style="font-family:var(--font-subtitle); font-size:1.15rem; text-transform:none; margin:0; color:var(--text-primary);">
                ${ride.motoristaNome}
              </h3>
              <span class="badge badge-amarelo" style="font-size:0.8rem;">Nota ${(ride.motoristaAvaliacao || 5.0).toFixed(1)} ★</span>
              <span style="font-size:0.75rem; color:var(--azul-unimove); font-weight:600;">Ver perfil</span>
            </div>
            <p style="font-size:0.92rem; color:var(--text-muted); margin:0;">${ride.motoristaCurso} · ${ride.veiculo || 'Veículo'} (${ride.cor || '-'})${ride.placa ? ' · Placa ' + ride.placa : ''}</p>
          </div>
        </div>

        <!-- Price & Seats Badge & Economia (Item 13) -->
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.35rem;">
          <div style="display:flex; align-items:center; gap:0.65rem;">
            <span class="badge badge-verde" style="font-size:0.9rem; padding:0.35rem 0.85rem;">
              ${ride.vagasDisponiveis > 0 ? `${ride.vagasDisponiveis} vagas` : 'Lotado'}
            </span>
            <div class="price-tag" style="font-family:var(--font-subtitle); font-size:1.25rem; color:var(--text-primary);">
              ${ride.preco > 0 ? `R$ ${ride.preco.toFixed(2).replace('.', ',')}` : 'Grátis'}
            </div>
          </div>
          ${economia > 0 ? `
            <span style="font-size:0.78rem; font-weight:600; color:#15803d; background:#ecfdf5; border:1px solid #bbf7d0; padding:0.15rem 0.5rem; border-radius:var(--radius-sm);">
              Economiza R$ ${economia.toFixed(2)} vs ônibus
            </span>
          ` : ''}
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

export function attachRideCardEvents(container = document) {
  const triggers = container.querySelectorAll('.driver-profile-trigger');
  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const driverId = btn.getAttribute('data-driver-id');
      if (driverId) {
        showUserProfileModal(driverId);
      }
    });
  });
}