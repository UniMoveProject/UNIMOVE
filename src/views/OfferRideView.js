/**
 * Offer Ride View
 * Form for registered students to publish a new ride route (No emojis).
 */

import { getCurrentUser } from '../services/auth.js';
import { offerRide } from '../services/rides.js';
import { showModal } from '../components/Modal.js';

export function renderOfferRideView() {
  const user = getCurrentUser();

  if (!user) {
    return `
      <div class="card" style="text-align:center; padding:3rem 1.5rem; max-width:600px; margin:2rem auto;">
        <h1 class="page-title" style="font-size:1.8rem; margin-bottom:0.75rem;">ACESSO AO UNIMOVE</h1>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem;">
          Você precisa estar logado com seu perfil universitário para abrir vagas e oferecer caronas.
        </p>
        <a href="#/login" class="btn btn-azul">Entrar na minha conta</a>
      </div>
    `;
  }

  const userVehicle = user.veiculo || { modelo: '', cor: '', placa: '' };

  return `
    <div style="max-width:760px; margin:0 auto;">
      <div class="card" style="padding:2.25rem;">
        
        <div style="margin-bottom:1.75rem;">
          <span style="font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove);">MOTORISTA SOLIDÁRIO</span>
          <h1 class="page-title" style="font-size:2rem; margin:0.35rem 0;">OFERECER UMA CARONA</h1>
          <p style="color:var(--text-secondary); font-size:1.15rem;">
            Abra as vagas do seu carro para colegas da faculdade e divida os custos da rota.
          </p>
        </div>

        <form id="offerRideForm" style="display:flex; flex-direction:column; gap:1.25rem;">
          
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;">
            <div class="form-group">
              <label class="form-label" for="rideOrigem">Ponto de partida / Bairro *</label>
              <input type="text" id="rideOrigem" class="form-input" placeholder="Ex: Setor Bela Vista - Valparaíso" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="ridePontoEncontro">Ponto de encontro combinado</label>
              <input type="text" id="ridePontoEncontro" class="form-input" placeholder="Ex: Terminal Jardim ABC, Posto Ipiranga">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;">
            <div class="form-group">
              <label class="form-label" for="rideDestino">Destino / Campus *</label>
              <input type="text" id="rideDestino" class="form-input" placeholder="Ex: Campus UNICEPLAC" value="Campus UNICEPLAC" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="rideData">Data da carona *</label>
              <input type="date" id="rideData" class="form-input" required value="${new Date().toISOString().split('T')[0]}">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1.25rem;">
            <div class="form-group">
              <label class="form-label" for="rideHorarioSaida">Horário de Saída *</label>
              <input type="time" id="rideHorarioSaida" class="form-input" required value="07:40">
            </div>

            <div class="form-group">
              <label class="form-label" for="rideHorarioChegada">Previsão de Chegada</label>
              <input type="time" id="rideHorarioChegada" class="form-input" value="08:15">
            </div>

            <div class="form-group">
              <label class="form-label" for="rideVagas">Vagas disponíveis *</label>
              <input type="number" id="rideVagas" class="form-input" min="1" max="6" value="3" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="ridePreco">Ajuda de custo por vaga (R$)</label>
              <input type="number" id="ridePreco" class="form-input" min="0" step="0.50" value="6.00">
            </div>
          </div>

          <div style="background-color:var(--bg-primary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <h3 style="font-family:var(--font-subtitle); font-size:1.1rem; margin-bottom:0.75rem;">Dados do Veículo</h3>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
              <div>
                <label class="form-label" for="rideVeiculo">Modelo</label>
                <input type="text" id="rideVeiculo" class="form-input" placeholder="Ex: Onix, HB20, Gol" value="${userVehicle.modelo}">
              </div>

              <div>
                <label class="form-label" for="rideCor">Cor</label>
                <input type="text" id="rideCor" class="form-input" placeholder="Ex: Branco, Preto, Prata" value="${userVehicle.cor}">
              </div>

              <div>
                <label class="form-label" for="ridePlaca">Placa</label>
                <input type="text" id="ridePlaca" class="form-input" placeholder="Ex: ABC-1234" value="${userVehicle.placa}">
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:1rem;">
            <a href="#/home" class="btn btn-outline">Cancelar</a>
            <button type="submit" class="btn btn-azul">Publicar carona</button>
          </div>
        </form>

      </div>
    </div>
  `;
}

export function attachOfferRideEvents() {
  const form = document.getElementById('offerRideForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publicando...';
    }

    const rideData = {
      origem: document.getElementById('rideOrigem').value,
      pontoEncontro: document.getElementById('ridePontoEncontro').value,
      destino: document.getElementById('rideDestino').value,
      data: document.getElementById('rideData').value,
      horarioSaida: document.getElementById('rideHorarioSaida').value,
      horarioChegada: document.getElementById('rideHorarioChegada').value,
      vagas: document.getElementById('rideVagas').value,
      preco: document.getElementById('ridePreco').value,
      veiculo: document.getElementById('rideVeiculo').value,
      cor: document.getElementById('rideCor').value,
      placa: document.getElementById('ridePlaca').value
    };

    const res = await offerRide(rideData);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Publicar carona';
    }

    if (res.success) {
      showModal({
        title: 'Carona publicada com sucesso',
        message: 'Sua rota já está disponível para seus colegas da faculdade encontrarem e combinarem o trajeto.',
        confirmText: 'Ver minhas caronas',
        cancelText: 'Página inicial',
        onConfirm: () => {
          window.location.hash = '#/minhas-caronas';
        }
      });
    } else {
      alert(res.error || 'Erro ao publicar carona. Tente novamente.');
    }
  });
}