/**
 * My Rides View
 * Displays user rides offered as driver and rides joined as passenger (No emojis).
 */

import { getMyRides, deleteRide } from '../services/rides.js';
import { getCurrentUser } from '../services/auth.js';
import { renderRideCard } from '../components/RideCard.js';
import { showModal } from '../components/Modal.js';

export function renderMyRidesView() {
  const user = getCurrentUser();

  if (!user) {
    return `
      <div class="card" style="text-align:center; padding:3rem 1.5rem; max-width:600px; margin:2rem auto;">
        <h1 class="page-title" style="font-size:1.8rem; margin-bottom:0.75rem;">MINHAS CARONAS</h1>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem;">
          Faça login para visualizar e gerenciar as caronas que você oferece e suas vagas reservadas.
        </p>
        <a href="#/login" class="btn btn-azul">Entrar agora</a>
      </div>
    `;
  }

  return `
    <div style="display:flex; flex-direction:column; gap:2.5rem;">
      
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 class="page-title" style="font-size:2.2rem; margin-bottom:0.25rem;">MINHAS CARONAS</h1>
          <p style="color:var(--text-secondary); font-size:1.15rem;">
            Acompanhe suas rotas publicadas e viagens que você confirmou.
          </p>
        </div>

        <a href="#/oferecer" class="btn btn-amarelo">+ Oferecer nova carona</a>
      </div>

      <!-- Caronas que estou oferecendo (Motorista) -->
      <section>
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1.25rem;">
          <h2 style="font-family:var(--font-subtitle); font-size:1.4rem;">Caronas que ofereço</h2>
          <span class="badge badge-azul" id="offeredBadge">...</span>
        </div>

        <div id="offeredContainer" style="color:var(--text-secondary); padding:1rem 0;">
          Carregando suas caronas...
        </div>
      </section>

      <!-- Caronas que estou participando (Passageiro) -->
      <section>
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1.25rem;">
          <h2 style="font-family:var(--font-subtitle); font-size:1.4rem;">Viagens confirmadas</h2>
          <span class="badge badge-verde" id="bookedBadge">...</span>
        </div>

        <div id="bookedContainer" style="color:var(--text-secondary); padding:1rem 0;">
          Carregando reservas...
        </div>
      </section>

    </div>
  `;
}

export async function loadMyRidesData() {
  const offeredContainer = document.getElementById('offeredContainer');
  const bookedContainer = document.getElementById('bookedContainer');
  const offeredBadge = document.getElementById('offeredBadge');
  const bookedBadge = document.getElementById('bookedBadge');

  if (!offeredContainer || !bookedContainer) return;

  try {
    const res = await getMyRides();
    const offered = res?.offered || [];
    const booked = res?.booked || [];

    if (offeredBadge) offeredBadge.textContent = offered.length;
    if (bookedBadge) bookedBadge.textContent = booked.length;

    if (offered.length > 0) {
      offeredContainer.innerHTML = offered.map(r => renderRideCard(r, true)).join('');
    } else {
      offeredContainer.innerHTML = `
        <div class="card" style="text-align:center; padding:2rem 1rem;">
          <p style="color:var(--text-secondary); margin-bottom:1rem;">Você não tem nenhuma carona publicada no momento.</p>
          <a href="#/oferecer" class="btn btn-sm btn-outline">Publicar rota</a>
        </div>
      `;
    }

    if (booked.length > 0) {
      bookedContainer.innerHTML = booked.map(r => renderRideCard(r, false)).join('');
    } else {
      bookedContainer.innerHTML = `
        <div class="card" style="text-align:center; padding:2rem 1rem;">
          <p style="color:var(--text-secondary); margin-bottom:1rem;">Você ainda não solicitou vagas em nenhuma carona.</p>
          <a href="#/busca" class="btn btn-sm btn-azul">Buscar carona</a>
        </div>
      `;
    }

    attachDeleteEvents();
  } catch (err) {
    console.error('Erro ao carregar minhas caronas:', err);
    if (offeredContainer) offeredContainer.innerHTML = '<p style="color:var(--text-secondary);">Erro ao carregar dados.</p>';
    if (bookedContainer) bookedContainer.innerHTML = '<p style="color:var(--text-secondary);">Erro ao carregar dados.</p>';
  }
}

function attachDeleteEvents() {
  document.querySelectorAll('.btn-delete-ride').forEach(btn => {
    btn.addEventListener('click', () => {
      const rideId = btn.dataset.id;
      showModal({
        title: 'Excluir carona',
        message: 'Tem certeza que deseja cancelar e excluir esta carona? Colegas que reservaram serão notificados.',
        confirmText: 'Sim, excluir',
        cancelText: 'Voltar',
        isDanger: true,
        onConfirm: async () => {
          await deleteRide(rideId);
          loadMyRidesData();
        }
      });
    });
  });
}

export function attachMyRidesEvents() {
  loadMyRidesData();
}