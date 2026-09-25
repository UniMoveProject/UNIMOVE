/**
 * Edit Ride View
 * Allows the driver to modify details of an active ride (No emojis).
 */

import { getRideById, updateRide } from '../services/rides.js';
import { getCurrentUser } from '../services/auth.js';
import { showModal } from '../components/Modal.js';

export function renderEditRideView(rideId) {
  const user = getCurrentUser();
  const ride = getRideById(rideId);

  if (!user || !ride || ride.motoristaId !== user.id) {
    return `
      <div class="card" style="text-align:center; padding:3rem 1.5rem; max-width:600px; margin:2rem auto;">
        <h1 class="page-title" style="font-size:1.8rem; margin-bottom:0.75rem;">ACESSO NÃO PERMITIDO</h1>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem;">
          Esta carona não existe ou você não tem permissão para editá-la.
        </p>
        <a href="#/minhas-caronas" class="btn btn-azul">Voltar para Minhas Caronas</a>
      </div>
    `;
  }

  return `
    <div style="max-width:760px; margin:0 auto;">
      <div class="card" style="padding:2.25rem;">
        
        <div style="margin-bottom:1.75rem;">
          <span style="font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove);">GERENCIAR ROTA</span>
          <h1 class="page-title" style="font-size:2rem; margin:0.35rem 0;">EDITAR CARONA</h1>
          <p style="color:var(--text-secondary); font-size:1.15rem;">
            Atualize o horário, vagas ou ajuda de custo da sua rota.
          </p>
        </div>

        <form id="editRideForm" data-id="${ride.id}" style="display:flex; flex-direction:column; gap:1.25rem;">
          
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;">
            <div class="form-group">
              <label class="form-label" for="editOrigem">Ponto de partida / Bairro *</label>
              <input type="text" id="editOrigem" class="form-input" value="${ride.origem}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="editPontoEncontro">Ponto de encontro combinado</label>
              <input type="text" id="editPontoEncontro" class="form-input" value="${ride.pontoEncontro || ''}">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;">
            <div class="form-group">
              <label class="form-label" for="editDestino">Destino / Campus *</label>
              <input type="text" id="editDestino" class="form-input" value="${ride.destino}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="editData">Data da carona *</label>
              <input type="date" id="editData" class="form-input" value="${ride.data || ''}" required>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1.25rem;">
            <div class="form-group">
              <label class="form-label" for="editHorarioSaida">Horário de Saída *</label>
              <input type="time" id="editHorarioSaida" class="form-input" value="${ride.horarioSaida}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="editHorarioChegada">Previsão de Chegada</label>
              <input type="time" id="editHorarioChegada" class="form-input" value="${ride.horarioChegada || ''}">
            </div>

            <div class="form-group">
              <label class="form-label" for="editVagas">Vagas disponíveis *</label>
              <input type="number" id="editVagas" class="form-input" min="1" max="6" value="${ride.vagasDisponiveis}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="editPreco">Ajuda de custo por vaga (R$)</label>
              <input type="number" id="editPreco" class="form-input" min="0" step="0.50" value="${ride.preco}">
            </div>
          </div>

          <div style="background-color:var(--bg-primary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <h3 style="font-family:var(--font-subtitle); font-size:1.1rem; margin-bottom:0.75rem;">Dados do Veículo</h3>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
              <div>
                <label class="form-label" for="editVeiculo">Modelo</label>
                <input type="text" id="editVeiculo" class="form-input" value="${ride.veiculo || ''}">
              </div>

              <div>
                <label class="form-label" for="editCor">Cor</label>
                <input type="text" id="editCor" class="form-input" value="${ride.cor || ''}">
              </div>

              <div>
                <label class="form-label" for="editPlaca">Placa</label>
                <input type="text" id="editPlaca" class="form-input" value="${ride.placa || ''}">
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:1rem;">
            <a href="#/minhas-caronas" class="btn btn-outline">Cancelar</a>
            <button type="submit" class="btn btn-azul">Salvar alterações</button>
          </div>
        </form>

      </div>
    </div>
  `;
}

export function attachEditRideEvents() {
  const form = document.getElementById('editRideForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rideId = form.dataset.id;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Salvando...'; }

    const updatedData = {
      origem: document.getElementById('editOrigem').value,
      pontoEncontro: document.getElementById('editPontoEncontro').value,
      destino: document.getElementById('editDestino').value,
      data: document.getElementById('editData').value,
      horarioSaida: document.getElementById('editHorarioSaida').value,
      horarioChegada: document.getElementById('editHorarioChegada').value,
      vagasDisponiveis: parseInt(document.getElementById('editVagas').value, 10),
      preco: parseFloat(document.getElementById('editPreco').value) || 0,
      veiculo: document.getElementById('editVeiculo').value,
      cor: document.getElementById('editCor').value,
      placa: document.getElementById('editPlaca').value
    };

    const res = await updateRide(rideId, updatedData);

    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Salvar alterações'; }

    if (res.success) {
      showModal({
        title: 'Alterações salvas',
        message: 'Os detalhes da carona foram atualizados com sucesso.',
        confirmText: 'Voltar para minhas caronas',
        cancelText: 'Continuar editando',
        onConfirm: () => {
          window.location.hash = '#/minhas-caronas';
        }
      });
    } else {
      alert(res.error || 'Erro ao salvar alterações.');
    }
  });
}