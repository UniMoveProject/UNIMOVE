/**
 * Home View (Feed Principal da Plataforma)
 * Conforming strictly to the Brand Manual (pages 8 & 10) without emojis.
 */

import { getAllRides } from '../services/rides.js';
import { renderRideCard } from '../components/RideCard.js';
import { getCurrentUser } from '../services/auth.js';

export function renderHomeView() {
  return `
    <div style="display:flex; flex-direction:column; gap:2rem;">
      
      <!-- Hero Card -->
      <section class="card parallax-fade-up" style="background:var(--bg-card); border-left:6px solid var(--amarelo-unimove); padding:1.75rem 2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem;">
          <div>
            <div style="font-family:var(--font-subtitle); font-size:1.05rem; color:var(--azul-unimove); letter-spacing:0.02em;">
              BEM-VINDO AO UNIMOVE
            </div>
            <h1 class="page-title" style="font-size:clamp(1.8rem, 4vw, 2.5rem); margin:0.35rem 0 0.25rem; color:var(--text-primary);">
              EMBARQUE COM CONFIANCA
            </h1>
            <p style="color:var(--text-secondary); font-size:1.15rem;">
              Encontre ou ofereca caronas para o <strong>Campus UNICEPLAC</strong> de forma segura e economica.
            </p>
          </div>

          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="#/busca" class="btn btn-azul">Buscar carona</a>
            <a href="#/oferecer" class="btn btn-amarelo">Oferecer carona</a>
          </div>
        </div>
      </section>

      <!-- Quick Route Search Bar -->
      <section class="card parallax-fade-up" style="padding:1.5rem; animation-delay: 0.1s;">
        <h2 style="font-family:var(--font-subtitle); font-size:1.4rem; margin-bottom:1rem;">Para onde voce vai hoje?</h2>
        <form id="quickSearchForm" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)) 120px; gap:1rem; align-items:flex-end;">
          <div>
            <label class="form-label" for="quickOrigem">De onde voce sai?</label>
            <input type="text" id="quickOrigem" class="form-input" placeholder="Ex: Setor Bela Vista, Asa Sul, Gama...">
          </div>
          <div>
            <label class="form-label" for="quickDestino">Qual campus ou destino?</label>
            <input type="text" id="quickDestino" class="form-input" placeholder="Ex: Campus UNICEPLAC">
          </div>
          <button type="submit" class="btn btn-azul" style="height:48px; border-radius:var(--radius-md);">
            Buscar
          </button>
        </form>
      </section>

      <!-- Available Rides List -->
      <section>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
          <h2 style="font-family:var(--font-subtitle); font-size:1.5rem;">Caronas disponiveis</h2>
          <a href="#/busca" style="font-family:var(--font-subtitle); color:var(--azul-unimove); font-size:0.95rem;">Ver todas</a>
        </div>

        <div id="homeRidesList" style="color:var(--text-secondary); padding:1rem 0;">
          Carregando caronas...
        </div>
      </section>

    </div>
  `;
}

export async function loadHomeRides() {
  const user = getCurrentUser();
  const container = document.getElementById('homeRidesList');
  if (!container) return;

  try {
    const rides = await getAllRides();
    const recent = rides.slice(0, 6);
    if (recent.length === 0) {
      container.innerHTML = '<p style="color:var(--text-secondary);">Nenhuma carona disponivel no momento.</p>';
    } else {
      container.innerHTML = recent.map(r => renderRideCard(r, user && user.id === r.motoristaId)).join('');
    }
  } catch (err) {
    container.innerHTML = '<p style="color:var(--text-secondary);">Erro ao carregar caronas. Tente novamente.</p>';
  }
}

export function attachHomeEvents() {
  loadHomeRides();

  const form = document.getElementById('quickSearchForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const origem = document.getElementById('quickOrigem').value.trim();
      const destino = document.getElementById('quickDestino').value.trim();
      const params = new URLSearchParams();
      if (origem) params.set('origem', origem);
      if (destino) params.set('destino', destino);
      window.location.hash = `#/busca?${params.toString()}`;
    });
  }
}
