/**
 * Profile View
 * Student profile, vehicle data, mobility preferences and logout.
 */

import { getCurrentUser, updateProfile, logout } from '../services/auth.js';
import { showModal } from '../components/Modal.js';

export function renderProfileView() {
  const user = getCurrentUser();

  if (!user) {
    return `
      <div class="card" style="text-align:center; padding:3rem 1.5rem; max-width:600px; margin:2rem auto;">
        <div style="font-size:2.5rem; margin-bottom:1rem;">??</div>
        <h1 style="font-size:1.8rem; margin-bottom:0.75rem;">MEU PERFIL</h1>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem;">
          Faça login para ver e atualizar seus dados pessoais e de mobilidade.
        </p>
        <a href="#/login" class="btn btn-azul">Entrar agora</a>
      </div>
    `;
  }

  const veiculo = user.veiculo || { modelo: '', cor: '', placa: '' };
  const isMotorista = user.roles && user.roles.includes('motorista');
  const isPassageiro = user.roles && user.roles.includes('passageiro');
  const isCiclista = user.roles && user.roles.includes('ciclista');

  return `
    <div style="max-width:760px; margin:0 auto; display:flex; flex-direction:column; gap:1.5rem;">
      
      <!-- Profile Header Card -->
      <div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.25rem;">
        <div style="display:flex; align-items:center; gap:1.25rem;">
          <div style="width:72px; height:72px; border-radius:50%; background-image:url('${user.avatar}'); background-size:cover; background-position:center; border:3px solid var(--azul-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-title); font-size:1.5rem; color:#fff;">
            ${!user.avatar ? user.nome.slice(0, 2).toUpperCase() : ''}
          </div>
          <div>
            <h1 style="font-size:1.8rem; margin-bottom:0.2rem;">${user.nome}</h1>
            <p style="color:var(--text-secondary); font-size:1.05rem;">${user.curso} · ${user.periodo}</p>
            <div style="display:flex; gap:0.5rem; margin-top:0.35rem;">
              <span class="badge badge-verde">? ${user.avaliacoes || '5.0'} (${user.totalCaronas || 0} caronas)</span>
              <span class="badge badge-soft">${user.campus || 'Campus UNICEPLAC'}</span>
            </div>
          </div>
        </div>

        <button type="button" id="logoutBtn" class="btn btn-sm btn-outline" style="color:#d32f2f; border-color:rgba(211,47,47,0.3);">
          Sair da conta
        </button>
      </div>

      <!-- Profile Edit Form -->
      <div class="card" style="padding:2rem;">
        <h2 style="font-size:1.5rem; margin-bottom:1.25rem;">DADOS CADASTRAIS & PREFERÊNCIAS</h2>

        <form id="profileForm" style="display:flex; flex-direction:column; gap:1.25rem;">
          
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.25rem;">
            <div class="form-group">
              <label class="form-label" for="profileNome">Nome completo</label>
              <input type="text" id="profileNome" class="form-input" value="${user.nome}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="profileEmail">E-mail institucional</label>
              <input type="email" id="profileEmail" class="form-input" value="${user.email}" disabled style="opacity:0.75;">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1.25rem;">
            <div class="form-group">
              <label class="form-label" for="profileTelefone">Telefone / WhatsApp</label>
              <input type="tel" id="profileTelefone" class="form-input" value="${user.telefone || ''}">
            </div>

            <div class="form-group">
              <label class="form-label" for="profileCurso">Curso</label>
              <input type="text" id="profileCurso" class="form-input" value="${user.curso || ''}">
            </div>

            <div class="form-group">
              <label class="form-label" for="profilePeriodo">Período / Semestre</label>
              <input type="text" id="profilePeriodo" class="form-input" value="${user.periodo || ''}">
            </div>
          </div>

          <!-- Mobility Roles -->
          <div class="form-group">
            <label class="form-label">Como você se move no UniMove?</label>
            <div class="pill-selector">
              <label class="pill-option">
                <input type="checkbox" name="profileRole" value="motorista" ${isMotorista ? 'checked' : ''}>
                <span class="pill-label">?? Motorista</span>
              </label>
              <label class="pill-option">
                <input type="checkbox" name="profileRole" value="passageiro" ${isPassageiro ? 'checked' : ''}>
                <span class="pill-label">?? Passageiro</span>
              </label>
              <label class="pill-option">
                <input type="checkbox" name="profileRole" value="ciclista" ${isCiclista ? 'checked' : ''}>
                <span class="pill-label">?? Ciclista</span>
              </label>
            </div>
          </div>

          <!-- Vehicle Information -->
          <div style="background-color:var(--bg-primary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <h3 style="font-family:var(--font-subtitle); font-size:1.1rem; margin-bottom:0.75rem;">Informações do Veículo</h3>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
              <div>
                <label class="form-label" for="profileVeiculo">Modelo</label>
                <input type="text" id="profileVeiculo" class="form-input" placeholder="Ex: Onix 1.0" value="${veiculo.modelo || ''}">
              </div>

              <div>
                <label class="form-label" for="profileCor">Cor</label>
                <input type="text" id="profileCor" class="form-input" placeholder="Ex: Branco" value="${veiculo.cor || ''}">
              </div>

              <div>
                <label class="form-label" for="profilePlaca">Placa</label>
                <input type="text" id="profilePlaca" class="form-input" placeholder="Ex: ABC-1D23" value="${veiculo.placa || ''}">
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:0.5rem;">
            <button type="submit" class="btn btn-azul">Salvar perfil</button>
          </div>
        </form>
      </div>

    </div>
  `;
}

export function attachProfileEvents() {
  const form = document.getElementById('profileForm');
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      showModal({
        title: 'Sair da conta',
        message: 'Deseja realmente desconectar do UniMove?',
        confirmText: 'Sair',
        cancelText: 'Cancelar',
        isDanger: true,
        onConfirm: () => {
          logout();
          window.location.hash = '#/';
        }
      });
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const roles = Array.from(document.querySelectorAll('input[name="profileRole"]:checked')).map(el => el.value);

      const updated = {
        nome: document.getElementById('profileNome').value.trim(),
        telefone: document.getElementById('profileTelefone').value.trim(),
        curso: document.getElementById('profileCurso').value.trim(),
        periodo: document.getElementById('profilePeriodo').value.trim(),
        roles,
        veiculo: {
          modelo: document.getElementById('profileVeiculo').value.trim(),
          cor: document.getElementById('profileCor').value.trim(),
          placa: document.getElementById('profilePlaca').value.trim()
        }
      };

      updateProfile(updated);

      showModal({
        title: '? Perfil atualizado',
        message: 'Seus dados foram atualizados com sucesso.',
        confirmText: 'Ok',
        cancelText: '',
        onConfirm: () => {
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
      });
    });
  }
}
