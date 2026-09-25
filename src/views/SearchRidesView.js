/**
 * Search Rides View
 * Search and list available rides with interactive booking (No emojis).
 */

import { searchRides, bookRide } from '../services/rides.js';
import { renderRideCard } from '../components/RideCard.js';
import { getCurrentUser } from '../services/auth.js';
import { showModal } from '../components/Modal.js';

export function renderSearchRidesView(queryString = '') {
  const params = new URLSearchParams(queryString);
  const initialOrigem = params.get('origem') || '';
  const initialDestino = params.get('destino') || '';

  return `
    <div style="display:flex; flex-direction:column; gap:2rem;">
      
      <!-- Search Filters Card -->
      <section class="card" style="padding:1.75rem;">
        <h1 class="page-title" style="font-size:1.8rem; margin-bottom:1.25rem;">BUSCAR CARONA</h1>
        
        <form id="searchFilterForm" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
          <div>
            <label class="form-label" for="searchOrigem">Origem / Bairro</label>
            <input type="text" id="searchOrigem" class="form-input" placeholder="Ex: Valparaíso, Asa Sul, Ceilândia" value="${initialOrigem}">
          </div>

          <div>
            <label class="form-label" for="searchDestino">Destino</label>
            <input type="text" id="searchDestino" class="form-input" placeholder="Ex: Campus UNICEPLAC" value="${initialDestino}">
          </div>

          <div>
            <label class="form-label" for="searchHorario">A partir de</label>
            <input type="time" id="searchHorario" class="form-input" value="06:00">
          </div>

          <div>
            <label class="form-label" for="searchVagas">Vagas mínimas</label>
            <select id="searchVagas" class="form-select">
              <option value="1">1 vaga</option>
              <option value="2">2 vagas</option>
              <option value="3">3 vagas</option>
            </select>
          </div>

          <div style="grid-column: 1 / -1; display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.5rem;">
            <button type="button" id="clearFiltersBtn" class="btn btn-outline btn-sm">Limpar filtros</button>
            <button type="submit" class="btn btn-azul btn-sm">Filtrar resultados</button>
          </div>
        </form>
      </section>

      <!-- Results Section -->
      <section>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h2 style="font-family:var(--font-subtitle); font-size:1.4rem;" id="resultsTitle">Resultados encontrados (...)</h2>
        </div>

        <div id="ridesContainer" style="color:var(--text-secondary); padding:1rem 0;">
          Buscando caronas disponíveis...
        </div>
      </section>

    </div>
  `;
}

export function attachSearchRidesEvents() {
  const form = document.getElementById('searchFilterForm');
  const clearBtn = document.getElementById('clearFiltersBtn');
  const container = document.getElementById('ridesContainer');
  const title = document.getElementById('resultsTitle');

  async function updateResults() {
    if (!container) return;

    const origem = document.getElementById('searchOrigem')?.value.trim() || '';
    const destino = document.getElementById('searchDestino')?.value.trim() || '';
    const horario = document.getElementById('searchHorario')?.value || '';
    const vagasMinimas = document.getElementById('searchVagas')?.value || '1';

    try {
      const results = (await searchRides({ origem, destino, horario, vagasMinimas })) || [];
      const user = getCurrentUser();

      if (title) title.textContent = `Resultados encontrados (${results.length})`;

      if (results.length > 0) {
        container.innerHTML = results.map(r => renderRideCard(r, user && user.id === r.motoristaId)).join('');
        attachBookingEvents();
      } else {
        container.innerHTML = `
          <div class="card" style="text-align:center; padding:3rem 1.5rem;">
            <h3 style="font-family:var(--font-subtitle); font-size:1.35rem; margin-bottom:0.5rem;">Nenhuma carona encontrada</h3>
            <p style="color:var(--text-secondary); max-width:480px; margin:0 auto 1.5rem;">
              Nenhuma carona por aqui ainda. Que tal oferecer a sua rota até a faculdade para ajudar outros colegas?
            </p>
            <a href="#/oferecer" class="btn btn-amarelo">Oferecer carona agora</a>
          </div>
        `;
      }
    } catch (err) {
      console.error('Erro ao buscar caronas:', err);
      container.innerHTML = '<p style="color:var(--text-secondary);">Erro ao carregar os resultados da busca.</p>';
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      updateResults();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      form.reset();
      updateResults();
    });
  }

  function attachBookingEvents() {
    document.querySelectorAll('.btn-pedir-carona').forEach(btn => {
      btn.addEventListener('click', () => {
        const rideId = btn.dataset.id;
        const user = getCurrentUser();
        if (!user) {
          window.location.hash = '#/login';
          return;
        }

        showModal({
          title: 'Confirmar solicitação de vaga',
          message: 'Você deseja confirmar seu embarque nesta carona? Seu nome e curso serão compartilhados no grupo da viagem.',
          confirmText: 'Confirmar embarque',
          onConfirm: async () => {
            const res = await bookRide(rideId);
            if (res.success) {
              showModal({
                title: 'Sua carona está confirmada',
                message: `Você agora faz parte da rota com ${res.ride?.motoristaNome || 'o motorista'}. Acesse o chat do grupo para combinar os detalhes.`,
                confirmText: 'Ir para o chat',
                cancelText: 'Fechar',
                onConfirm: () => {
                  window.location.hash = `#/chat/${rideId}`;
                }
              });
              updateResults();
            } else {
              alert(res.error);
            }
          }
        });
      });
    });
  }

  // Load initial results
  updateResults();
}