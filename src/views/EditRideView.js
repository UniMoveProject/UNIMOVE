/**
 * Edit Ride View
 * Allows the driver to modify details of an active ride.
 * Includes reusable vehicle selector and R$ 6.00 price limit.
 */

import { getRideById, updateRide, getAllRides } from '../services/rides.js';
import { isSupabaseConfigured } from '../services/supabaseClient.js';
import { supabase } from '../services/supabaseClient.js';
import { getCurrentUser } from '../services/auth.js';
import { showModal } from '../components/Modal.js';

export async function renderEditRideView(rideId) {
  const user = getCurrentUser();
  let ride = null;
  if (isSupabaseConfigured) {
    const rides = await getAllRides();
    ride = (rides || []).find(r => r.id === rideId) || null;
  } else {
    ride = getRideById(rideId);
  }

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

  const veiculos = Array.isArray(user.veiculos) && user.veiculos.length > 0
    ? user.veiculos
    : (user.veiculo_modelo ? [{
        id: 'veh_default',
        modelo: user.veiculo_modelo,
        cor: user.veiculo_cor || '',
        placa: user.veiculo_placa || '',
        vagas: user.vagas_padrao || 3
      }] : []);

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

        <form id="editRideForm" data-id="${ride.id}" data-foto="${ride.fotoVeiculo || ''}" style="display:flex; flex-direction:column; gap:1.25rem;">
          
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;">
            <div class="form-group">
              <label class="form-label" for="editOrigem">Ponto de partida / Bairro *</label>
              <input type="text" id="editOrigem" class="form-input" value="${ride.origem}" maxlength="100" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="editPontoEncontro">Ponto de encontro combinado</label>
              <input type="text" id="editPontoEncontro" class="form-input" value="${ride.pontoEncontro || ''}" maxlength="100">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;">
            <div class="form-group">
              <label class="form-label" for="editDestino">Destino / Campus *</label>
              <input type="text" id="editDestino" class="form-input" value="${ride.destino}" maxlength="100" required>
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
              <input type="number" id="editVagas" class="form-input" min="1" max="10" value="${ride.vagasDisponiveis}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="editPreco">Ajuda de custo por vaga (R$ máx 6,00) *</label>
              <input type="number" id="editPreco" class="form-input" min="0" max="6.00" step="0.50" value="${Math.min(6, parseFloat(ride.preco) || 5.00).toFixed(2)}" required>
            </div>
          </div>

          <!-- ── Dados do Veículo ───────────────────────── -->
          <div style="background-color:var(--bg-primary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
              <h3 style="font-family:var(--font-subtitle); font-size:1.1rem; margin:0;">Dados do Veículo</h3>
              ${veiculos.length > 0 ? `
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <label for="editVeiculoSelect" style="font-size:0.8rem; color:var(--text-secondary); font-weight:600;">Veículo salvo:</label>
                  <select id="editVeiculoSelect" class="form-input" style="padding:0.35rem 0.6rem; font-size:0.85rem; width:auto;">
                    <option value="">-- Selecionar veículo salvo --</option>
                    ${veiculos.map((v, i) => `
                      <option value="${i}">
                        ${v.modelo} (${v.cor || 'Cor N/I'}) - ${v.placa || 'Sem placa'}
                      </option>
                    `).join('')}
                  </select>
                </div>
              ` : ''}
            </div>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
              <div>
                <label class="form-label" for="editVeiculo">Modelo *</label>
                <input type="text" id="editVeiculo" class="form-input" value="${ride.veiculo || ''}" maxlength="50" required>
              </div>

              <div>
                <label class="form-label" for="editCor">Cor *</label>
                <input type="text" id="editCor" class="form-input" value="${ride.cor || ''}" maxlength="30" required>
              </div>

              <div>
                <label class="form-label" for="editPlaca">Placa *</label>
                <input type="text" id="editPlaca" class="form-input" value="${ride.placa || ''}" maxlength="8" required>
               <div>
                 <label class="form-label" for="editFotoVeiculo">Foto do carro</label>
                 <input type="file" id="editFotoVeiculo" class="form-input" accept="image/*">
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

  const user = getCurrentUser() || {};
  const veiculos = Array.isArray(user.veiculos) && user.veiculos.length > 0
    ? user.veiculos
    : (user.veiculo_modelo ? [{
        id: 'veh_default',
        modelo: user.veiculo_modelo,
        cor: user.veiculo_cor || '',
        placa: user.veiculo_placa || '',
        vagas: user.vagas_padrao || 3
      }] : []);

  const selectVeiculo = document.getElementById('editVeiculoSelect');
  const inputModelo = document.getElementById('editVeiculo');
  const inputCor = document.getElementById('editCor');
  const inputPlaca = document.getElementById('editPlaca');

  if (selectVeiculo) {
    selectVeiculo.addEventListener('change', () => {
      const idx = parseInt(selectVeiculo.value, 10);
      if (!isNaN(idx) && veiculos[idx]) {
        const v = veiculos[idx];
        inputModelo.value = v.modelo || '';
        inputCor.value = v.cor || '';
        inputPlaca.value = v.placa || '';
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rideId = form.dataset.id;

    const preco = parseFloat(document.getElementById('editPreco').value) || 0;
    if (preco > 6.00) {
      showModal({
        title: 'Ajuda de Custo Excedida',
        message: 'No UniMove, a ajuda de custo por vaga é limitada a R$ 6,00.',
        confirmText: 'Ajustar para R$ 6,00',
        onConfirm: () => {
          document.getElementById('editPreco').value = '6.00';
        }
      });
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Salvando...'; }

    const fileInput = document.getElementById('editFotoVeiculo');
    let fotoVeiculoUrl = form.dataset.foto || '';
    if (fileInput && fileInput.files && fileInput.files[0] && isSupabaseConfigured) {
      const file = fileInput.files[0];
      const path = `car-${rideId}-${Date.now()}`;
      const { error: upErr } = await supabase.storage.from('car-photos').upload(path, file, { upsert: true });
      if (!upErr) {
        const { data: pub } = supabase.storage.from('car-photos').getPublicUrl(path);
        fotoVeiculoUrl = pub.publicUrl;
      }
    }

    const updatedData = {
      origem: document.getElementById('editOrigem').value,
      pontoEncontro: document.getElementById('editPontoEncontro').value,
      destino: document.getElementById('editDestino').value,
      data: document.getElementById('editData').value,
      horarioSaida: document.getElementById('editHorarioSaida').value,
      horarioChegada: document.getElementById('editHorarioChegada').value,
      vagasDisponiveis: parseInt(document.getElementById('editVagas').value, 10),
      preco: preco,
      veiculo: document.getElementById('editVeiculo').value.trim(),
      cor: document.getElementById('editCor').value.trim(),
       placa: document.getElementById('editPlaca').value.trim().toUpperCase(),
       fotoVeiculo: fotoVeiculoUrl
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
      showModal({
        title: 'Erro ao salvar',
        message: res.error || 'Não foi possível salvar as alterações.',
        confirmText: 'Ok'
      });
    }
  });
}