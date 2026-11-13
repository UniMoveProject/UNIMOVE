/**
 * User Profile Modal Component
 * Displays any driver or passenger's public profile (Item 10).
 * Accessible from ride cards, search listings, and chat.
 */

import { getUserById } from '../services/auth.js';
import { calculateDriverAveragePrice } from '../services/rides.js';
import { generateInitialsAvatar } from '../utils/image.js';

export async function showUserProfileModal(userIdOrUser) {
  let user = null;

  if (typeof userIdOrUser === 'string') {
    user = await getUserById(userIdOrUser);
  } else if (typeof userIdOrUser === 'object' && userIdOrUser !== null) {
    user = userIdOrUser;
    // Se o objeto estiver incompleto, busca dados adicionais
    if (user.id && (!user.curso || !user.telefone)) {
      const full = await getUserById(user.id);
      if (full) user = { ...full, ...user };
    }
  }

  if (!user) {
    alert('Perfil do usuário não encontrado.');
    return;
  }

  // Remove modal anterior se existir
  const existingModal = document.getElementById('userProfileModalOverlay');
  if (existingModal) existingModal.remove();

  const isMotorista = Array.isArray(user.roles) && user.roles.includes('motorista');
  const avatarUrl = user.avatar_url || user.avatar || generateInitialsAvatar(user.nome || 'Estudante', '#0056b3');
  const initials = (user.nome || 'UN').slice(0, 2).toUpperCase();
  const precoMedioCalculado = isMotorista ? calculateDriverAveragePrice(user.id) : 0;

  // Lista de veículos do motorista
  const veiculos = Array.isArray(user.veiculos) && user.veiculos.length > 0
    ? user.veiculos
    : (user.veiculo_modelo ? [{
        modelo: user.veiculo_modelo,
        cor: user.veiculo_cor || '',
        placa: user.veiculo_placa || '',
        foto_url: user.veiculo_foto_url || null
      }] : []);

  const modalHTML = `
    <div id="userProfileModalOverlay" class="modal-backdrop" style="position:fixed; inset:0; background:rgba(15,23,42,0.7); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:9999; padding:1rem; animation:fadeIn 0.2s ease;">
      <div class="card" style="max-width:540px; width:100%; max-height:90vh; overflow-y:auto; padding:2rem; position:relative; box-shadow:0 20px 25px -5px rgba(0,0,0,0.3); border-radius:var(--radius-lg, 16px);">
        
        <!-- Botão Fechar -->
        <button id="closeProfileModalBtn" aria-label="Fechar" style="position:absolute; top:1rem; right:1rem; background:none; border:none; font-size:1.5rem; color:var(--text-secondary); cursor:pointer; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
          &times;
        </button>

        <!-- Header com Foto e Dados Principais -->
        <div style="display:flex; flex-direction:column; align-items:center; text-align:center; padding-bottom:1.5rem; border-bottom:1px solid var(--border-color);">
          <div style="width:96px; height:96px; border-radius:50%; background-image:url('${avatarUrl}'); background-size:cover; background-position:center; border:3px solid var(--azul-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:2rem; color:#fff; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom:1rem; background-color:var(--azul-unimove);">
            ${!avatarUrl ? initials : ''}
          </div>

          <h2 style="font-family:var(--font-subtitle); font-size:1.5rem; margin:0 0 0.35rem 0; color:var(--text-primary);">
            ${user.nome || 'Estudante UNICEPLAC'}
          </h2>

          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; justify-content:center; margin-bottom:0.75rem;">
            <span class="badge badge-verde">Nota ${user.avaliacoes || '5.0'} ★</span>
            <span class="badge badge-soft">${user.total_caronas || user.totalCaronas || 0} caronas</span>
            ${isMotorista ? '<span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:600;">Motorista</span>' : ''}
            <span class="badge" style="background:#f1f5f9; color:#475569;">Passageiro</span>
          </div>

          <div style="color:var(--text-secondary); font-size:0.95rem;">
            <strong>${user.curso || 'Graduação'}</strong> ${user.periodo ? `· ${user.periodo}` : ''}
          </div>
          <div style="color:var(--text-muted); font-size:0.85rem; margin-top:0.25rem;">
            Campus UNICEPLAC
          </div>
        </div>

        <!-- Informações Pessoais & Preferências -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; padding:1.25rem 0; border-bottom:1px solid var(--border-color); font-size:0.9rem;">
          <div>
            <span style="color:var(--text-secondary); display:block; font-size:0.8rem; text-transform:uppercase;">Preferência de Carona</span>
            <strong>${user.preferencia_carona === 'mulher' ? 'Somente com mulheres' : (user.preferencia_carona === 'homem' ? 'Somente com homens' : 'Indiferente / Mista')}</strong>
          </div>
          <div>
            <span style="color:var(--text-secondary); display:block; font-size:0.8rem; text-transform:uppercase;">Idade</span>
            <strong>${user.idade ? `${user.idade} anos` : 'Não informada'}</strong>
          </div>
        </div>

        <!-- Se for Motorista: Dados do Veículo e Operação -->
        ${isMotorista ? `
          <div style="padding-top:1.25rem;">
            <h3 style="font-family:var(--font-subtitle); font-size:1.1rem; color:var(--azul-unimove); margin-bottom:0.75rem;">
              DADOS DO MOTORISTA
            </h3>

            <!-- Preço Médio Calculado (Item 12) -->
            <div style="background:var(--bg-primary); padding:0.85rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-size:0.8rem; color:var(--text-secondary); display:block;">PREÇO MÉDIO DAS CARONAS</span>
                <span style="font-size:1.15rem; font-weight:700; color:var(--verde-unimove, #16a34a);">
                  ${precoMedioCalculado > 0 ? `R$ ${precoMedioCalculado.toFixed(2)}` : 'R$ 5,00 (padrão)'}
                </span>
              </div>
              <span style="font-size:0.78rem; color:var(--text-muted); max-width:200px; text-align:right;">
                Calculado com base nas caronas oferecidas pelo motorista.
              </span>
            </div>

            <!-- Veículos Cadastrados (Item 11) -->
            <div style="margin-bottom:1rem;">
              <span style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; display:block; margin-bottom:0.4rem;">
                Veículos Cadastrados (${veiculos.length})
              </span>
              <div style="display:flex; flex-direction:column; gap:0.5rem;">
                ${veiculos.length > 0 ? veiculos.map(v => `
                  <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-primary); padding:0.65rem 0.85rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
                    <div>
                      <strong style="color:var(--text-primary);">${v.modelo}</strong>
                      <span style="color:var(--text-secondary); font-size:0.85rem;"> · ${v.cor}</span>
                    </div>
                    <span class="badge badge-soft" style="font-family:monospace; font-size:0.85rem;">${v.placa}</span>
                  </div>
                `).join('') : `
                  <div style="color:var(--text-muted); font-size:0.85rem;">Nenhum veículo detalhado.</div>
                `}
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.85rem;">
              <div style="background:var(--bg-primary); padding:0.6rem 0.8rem; border-radius:var(--radius-md);">
                <span style="color:var(--text-muted); display:block; font-size:0.75rem;">TEMPO DE ESPERA</span>
                <strong>Até ${user.tempo_espera_min || 5} min por parada</strong>
              </div>
              <div style="background:var(--bg-primary); padding:0.6rem 0.8rem; border-radius:var(--radius-md);">
                <span style="color:var(--text-muted); display:block; font-size:0.75rem;">PORTA-MALAS</span>
                <strong>${user.porta_malas_litros ? `${user.porta_malas_litros} Litros` : 'Capacidade padrão'}</strong>
              </div>
            </div>

            ${user.acessivel_cadeirante ? `
              <div style="margin-top:0.75rem; padding:0.5rem 0.75rem; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:var(--radius-md); color:#065f46; font-size:0.85rem; display:flex; align-items:center; gap:0.5rem;">
                <span>♿</span> <strong>Veículo adaptado para cadeirante</strong>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div style="margin-top:1.75rem; display:flex; justify-content:flex-end;">
          <button id="closeProfileModalBottomBtn" class="btn btn-azul" style="padding:0.65rem 1.75rem;">
            Fechar
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const overlay = document.getElementById('userProfileModalOverlay');
  const closeBtn = document.getElementById('closeProfileModalBtn');
  const closeBottomBtn = document.getElementById('closeProfileModalBottomBtn');

  const closeModal = () => {
    if (overlay) overlay.remove();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeBottomBtn) closeBottomBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }
}
