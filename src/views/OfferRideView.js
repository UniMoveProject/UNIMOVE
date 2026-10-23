/**
 * Offer Ride View
 * Form for registered students to publish a new ride route.
 * Includes reusable vehicle dropdown (Item 11) and R$ 6.00 price limit enforcement.
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

  // Obter veículos salvos no perfil
  const veiculos = Array.isArray(user.veiculos) && user.veiculos.length > 0
    ? user.veiculos
    : (user.veiculo_modelo ? [{
        id: 'veh_default',
        modelo: user.veiculo_modelo,
        cor: user.veiculo_cor || '',
        placa: user.veiculo_placa || '',
        vagas: user.vagas_padrao || 3
      }] : []);

  const defaultVehicle = veiculos[0] || { modelo: '', cor: '', placa: '', vagas: 3 };

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
              <input type="text" id="rideOrigem" class="form-input" placeholder="Ex: Setor Bela Vista - Valparaíso" maxlength="100" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="ridePontoEncontro">Ponto de encontro combinado</label>
              <input type="text" id="ridePontoEncontro" class="form-input" placeholder="Ex: Terminal Jardim ABC, Posto Ipiranga" maxlength="100">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;">
            <div class="form-group">
              <label class="form-label" for="rideDestino">Destino / Campus *</label>
              <input type="text" id="rideDestino" class="form-input" placeholder="Ex: Campus UNICEPLAC" value="Campus UNICEPLAC" maxlength="100" required>
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
              <input type="number" id="rideVagas" class="form-input" min="1" max="10" value="${defaultVehicle.vagas || 3}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="ridePreco">Ajuda de custo por vaga (R$ máx 6,00) *</label>
              <input type="number" id="ridePreco" class="form-input" min="0" max="6.00" step="0.50" value="5.00" required>
            </div>
          </div>

          <!-- ── Dados do Veículo (Reutilizável) ────────── -->
          <div style="background-color:var(--bg-primary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
              <h3 style="font-family:var(--font-subtitle); font-size:1.1rem; margin:0;">Dados do Veículo</h3>
              ${veiculos.length > 0 ? `
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <label for="rideVeiculoSelect" style="font-size:0.8rem; color:var(--text-secondary); font-weight:600;">Veículo salvo:</label>
                  <select id="rideVeiculoSelect" class="form-input" style="padding:0.35rem 0.6rem; font-size:0.85rem; width:auto;">
                    ${veiculos.map((v, i) => `
                      <option value="${i}" ${i === 0 ? 'selected' : ''}>
                        ${v.modelo} (${v.cor || 'Cor N/I'}) - ${v.placa || 'Sem placa'}
                      </option>
                    `).join('')}
                    <option value="novo">+ Cadastrar outro veículo...</option>
                  </select>
                </div>
              ` : ''}
            </div>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
              <div>
                <label class="form-label" for="rideVeiculo">Modelo *</label>
                <input type="text" id="rideVeiculo" class="form-input" placeholder="Ex: Onix, HB20, Gol" value="${defaultVehicle.modelo}" maxlength="50" required>
              </div>

              <div>
                <label class="form-label" for="rideCor">Cor *</label>
                <input type="text" id="rideCor" class="form-input" placeholder="Ex: Branco, Preto, Prata" value="${defaultVehicle.cor}" maxlength="30" required>
              </div>

              <div>
                <label class="form-label" for="ridePlaca">Placa *</label>
                <input type="text" id="ridePlaca" class="form-input" placeholder="Ex: ABC-1234" value="${defaultVehicle.placa}" maxlength="8" required>
             <div>
               <label class="form-label" for="rideFotoVeiculo">Foto do carro *</label>
               <input type="file" id="rideFotoVeiculo" class="form-input" accept="image/*" required>
             </div>
           </div>

            <div id="salvarVeiculoBox" style="${veiculos.length > 0 ? 'display:none;' : 'display:block;'} margin-top:0.75rem;">
              <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:var(--text-secondary); cursor:pointer;">
                <input type="checkbox" id="rideSalvarNoPerfil" checked style="width:16px; height:16px;">
                Salvar este veículo no meu perfil para reutilizar em próximas caronas
              </label>
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

  const selectVeiculo = document.getElementById('rideVeiculoSelect');
  const inputModelo = document.getElementById('rideVeiculo');
  const inputCor = document.getElementById('rideCor');
  const inputPlaca = document.getElementById('ridePlaca');
  const inputVagas = document.getElementById('rideVagas');
  const salvarBox = document.getElementById('salvarVeiculoBox');
  const salvarCheck = document.getElementById('rideSalvarNoPerfil');

  if (selectVeiculo) {
    selectVeiculo.addEventListener('change', () => {
      const val = selectVeiculo.value;
      if (val === 'novo') {
        inputModelo.value = '';
        inputCor.value = '';
        inputPlaca.value = '';
        if (salvarBox) salvarBox.style.display = 'block';
        if (salvarCheck) salvarCheck.checked = true;
        inputModelo.focus();
      } else {
        const idx = parseInt(val, 10);
        const v = veiculos[idx];
        if (v) {
          inputModelo.value = v.modelo || '';
          inputCor.value = v.cor || '';
          inputPlaca.value = v.placa || '';
          if (v.vagas && inputVagas) inputVagas.value = v.vagas;
          if (salvarBox) salvarBox.style.display = 'none';
          if (salvarCheck) salvarCheck.checked = false;
        }
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const preco = parseFloat(document.getElementById('ridePreco').value) || 0;
    if (preco > 6.00) {
      showModal({
        title: 'Ajuda de Custo Excedida',
        message: 'No UniMove, a ajuda de custo por vaga é limitada a R$ 6,00 para garantir a sustentabilidade solidária entre estudantes.',
        confirmText: 'Ajustar para R$ 6,00',
        onConfirm: () => {
          document.getElementById('ridePreco').value = '6.00';
        }
      });
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publicando...';
    }

    const fileInput = document.getElementById('rideFotoVeiculo');
    let fotoVeiculoUrl = '';
    if (fileInput && fileInput.files && fileInput.files[0] && isSupabaseConfigured) {
      const file = fileInput.files[0];
      const path = `car-${Date.now()}`;
      const { error: upErr } = await supabase.storage.from('car-photos').upload(path, file, { upsert: true });
      if (!upErr) {
        const { data: pub } = supabase.storage.from('car-photos').getPublicUrl(path);
        fotoVeiculoUrl = pub.publicUrl;
        showModal({ title: 'Imagem enviada', message: 'Foto do carro enviada com sucesso.', confirmText: 'Ok' });
      }
    }

    const rideData = {
      origem: document.getElementById('rideOrigem').value,
      pontoEncontro: document.getElementById('ridePontoEncontro').value,
      destino: document.getElementById('rideDestino').value,
      data: document.getElementById('rideData').value,
      horarioSaida: document.getElementById('rideHorarioSaida').value,
      horarioChegada: document.getElementById('rideHorarioChegada').value,
      vagas: document.getElementById('rideVagas').value,
      preco: preco,
      veiculo: document.getElementById('rideVeiculo').value.trim(),
      cor: document.getElementById('rideCor').value.trim(),
      placa: document.getElementById('ridePlaca').value.trim().toUpperCase(),
      fotoVeiculo: fotoVeiculoUrl,
      salvarNoPerfil: salvarCheck ? salvarCheck.checked : false
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
      showModal({
        title: 'Não foi possível publicar',
        message: res.error || 'Erro ao publicar carona. Tente novamente.',
        confirmText: 'Ok'
      });
    }
  });
}