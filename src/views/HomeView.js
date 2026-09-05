/**
 * Home View (Feed Principal)
 * Direct representation of Page 8 & 10 of the Brand Manual.
 */

import { getAllRides } from '../services/rides.js';
import { renderRideCard } from '../components/RideCard.js';
import { getCurrentUser } from '../services/auth.js';

export function renderHomeView() {
  const user = getCurrentUser();
  const rides = getAllRides().slice(0, 5);

  return `
    <div style="display:flex; flex-direction:column; gap:2rem;">
      
      <!-- Top Greetings & Hero Card (Manual pág 10) -->
      <section class="card" style="background:var(--bg-card); border-left:6px solid var(--amarelo-unimove); padding:1.75rem 2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem;">
          <div>
            <div style="font-family:var(--font-title); font-size:1.1rem; color:var(--azul-unimove); letter-spacing:0.02em;">
              ROTA DE HOJE · 07:40
            </div>
            <h1 style="font-size:clamp(1.8rem, 4vw, 2.5rem); margin:0.35rem 0 0.25rem; color:var(--text-primary);">
              EMBARQUE COM CONFIANÇA
            </h1>
            <p style="color:var(--text-secondary); font-size:1.15rem;">
              Rhian conduz hoje saindo do <strong>Terminal Jardim ABC</strong> até o <strong>Campus UNICEPLAC</strong>, com 2 vagas disponíveis por <strong>R$ 6,00</strong>.
            </p>
          </div>

          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="#/busca" class="btn btn-azul">Buscar carona</a>
            <a href="#/oferecer" class="btn btn-amarelo">Oferecer carona</a>
          </div>
        </div>

        <div style="display:flex; gap:1.5rem; flex-wrap:wrap; border-top:1px solid var(--border-color); padding-top:1rem; font-family:var(--font-subtitle); font-size:0.95rem;">
          <span style="color:var(--text-secondary);">?? Origem: <strong style="color:var(--text-primary);">Setor Bela Vista</strong></span>
          <span style="color:var(--text-secondary);">?? Encontro: <strong style="color:var(--text-primary);">Terminal Jardim ABC</strong></span>
          <span style="color:var(--text-secondary);">?? Destino: <strong style="color:var(--azul-unimove);">Campus UNICEPLAC (08:15)</strong></span>
          <span class="badge badge-verde">2 vagas abertas</span>
        </div>
      </section>

      <!-- Quick Route Search Bar -->
      <section class="card" style="padding:1.5rem;">
        <h2 style="font-size:1.4rem; margin-bottom:1rem;">PARA ONDE VOCÊ VAI HOJE?</h2>
        <form id="quickSearchForm" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)) 120px; gap:1rem; align-items:flex-end;">
          <div>
            <label class="form-label" for="quickOrigem">De onde você sai?</label>
            <input type="text" id="quickOrigem" class="form-input" placeholder="Ex: Setor Bela Vista, Asa Sul...">
          </div>
          <div>
            <label class="form-label" for="quickDestino">Qual campus/destino?</label>
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
          <h2 style="font-size:1.6rem;">CARONAS DISPONÍVEIS</h2>
          <a href="#/busca" style="font-family:var(--font-subtitle); color:var(--azul-unimove); font-size:0.95rem;">Ver todas ?</a>
        </div>

        <div id="homeRidesList">
          ${rides.map(r => renderRideCard(r, user && user.id === r.motoristaId)).join('')}
        </div>
      </section>

    </div>
  `;
}

export function attachHomeEvents() {
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
