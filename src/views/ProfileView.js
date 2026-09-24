/**
 * Profile View
 * Student profile with full Standard and Motorista sections.
 */

import { getCurrentUser, updateProfile, logout } from '../services/auth.js';
import { showModal } from '../components/Modal.js';

export function renderProfileView() {
  const user = getCurrentUser();

  if (!user) {
    return `
      <div class="card" style="text-align:center; padding:3rem 1.5rem; max-width:600px; margin:2rem auto;">
        <h1 class="page-title" style="font-size:1.8rem; margin-bottom:0.75rem;">MEU PERFIL</h1>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem;">
          Faça login para ver e atualizar seus dados pessoais e de mobilidade.
        </p>
        <a href="#/login" class="btn btn-azul">Entrar agora</a>
      </div>
    `;
  }

  const isMotorista = user.roles && user.roles.includes('motorista');
  const avatarSrc = user.avatar_url || user.avatar || '';
  const avatarInitials = user.nome ? user.nome.slice(0, 2).toUpperCase() : 'UN';

  // Mapa de labels amigáveis
  const sexoLabel = { masculino: 'Masculino', feminino: 'Feminino', outro: 'Outro', prefiro_nao_dizer: 'Prefiro não dizer' };
  const prefCarLabel = { homem: 'Somente com homens', mulher: 'Somente com mulheres', indiferente: 'Indiferente' };
  const prefPassLabel = { homem: 'Somente homens', mulher: 'Somente mulheres', mista: 'Mista (qualquer pessoa)' };

  return `
    <div style="max-width:780px; margin:0 auto; display:flex; flex-direction:column; gap:1.5rem;">

      <!-- ── Header Card ──────────────────────────────── -->
      <div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.25rem;">
        <div style="display:flex; align-items:center; gap:1.25rem;">
          <div style="width:72px; height:72px; border-radius:50%; ${avatarSrc ? `background-image:url('${avatarSrc}');` : 'background-color:var(--azul-unimove);'} background-size:cover; background-position:center; border:3px solid var(--azul-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:1.5rem; color:#fff; flex-shrink:0;">
            ${!avatarSrc ? avatarInitials : ''}
          </div>
          <div>
            <h1 class="page-title" style="font-size:1.8rem; margin-bottom:0.2rem;">${user.nome}</h1>
            <p style="color:var(--text-secondary); font-size:1rem;">${user.email}</p>
            <div style="display:flex; gap:0.5rem; margin-top:0.35rem; flex-wrap:wrap;">
              <span class="badge badge-verde">Nota ${user.avaliacoes || '5.0'} — ${user.total_caronas || 0} caronas</span>
              ${isMotorista ? '<span class="badge badge-soft">Motorista</span>' : ''}
              ${user.roles && user.roles.includes('passageiro') ? '<span class="badge badge-soft">Passageiro</span>' : ''}
              ${user.roles && user.roles.includes('ciclista') ? '<span class="badge badge-soft">Ciclista</span>' : ''}
            </div>
          </div>
        </div>

        <button type="button" id="logoutBtn" class="btn btn-sm btn-outline" style="color:#d32f2f; border-color:rgba(211,47,47,0.3);">
          Sair da conta
        </button>
      </div>

      <!-- ── Formulário de Edição ─────────────────────── -->
      <form id="profileForm" style="display:flex; flex-direction:column; gap:1.5rem;">

        <!-- ── Seção: Dados Pessoais ─────────────────── -->
        <div class="card" style="padding:2rem;">
          <h2 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:1.25rem; color:var(--azul-unimove);">DADOS PESSOAIS</h2>

          <!-- Avatar upload -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; margin-bottom:1.25rem;">
            <div id="profileAvatarPreview" style="width:84px; height:84px; border-radius:50%; ${avatarSrc ? `background-image:url('${avatarSrc}');` : 'background-color:var(--bg-primary);'} background-size:cover; background-position:center; border:2px dashed var(--azul-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:1.4rem; color:var(--azul-unimove); cursor:pointer;">
              ${!avatarSrc ? avatarInitials : ''}
            </div>
            <label for="profileAvatarInput" style="font-family:var(--font-subtitle); font-size:0.85rem; color:var(--azul-unimove); cursor:pointer;">
              Alterar foto de rosto
            </label>
            <input type="file" id="profileAvatarInput" accept="image/*" style="display:none;">
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileNome">Nome completo *</label>
              <input type="text" id="profileNome" class="form-input" value="${user.nome || ''}" required>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileEmail">E-mail institucional</label>
              <input type="email" id="profileEmail" class="form-input" value="${user.email || ''}" disabled style="opacity:0.65;">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:1rem; margin-top:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileCpf">CPF</label>
              <input type="text" id="profileCpf" class="form-input" value="${user.cpf || ''}" maxlength="14" placeholder="000.000.000-00">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileIdade">Idade</label>
              <input type="number" id="profileIdade" class="form-input" min="16" max="100" value="${user.idade || ''}">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileTelefone">Celular / WhatsApp</label>
              <input type="tel" id="profileTelefone" class="form-input" value="${user.telefone || ''}" maxlength="15" placeholder="(61) 90000-0000">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileSexo">Sexo</label>
              <select id="profileSexo" class="form-input">
                <option value="">Selecione...</option>
                <option value="masculino" ${user.sexo === 'masculino' ? 'selected' : ''}>Masculino</option>
                <option value="feminino" ${user.sexo === 'feminino' ? 'selected' : ''}>Feminino</option>
                <option value="outro" ${user.sexo === 'outro' ? 'selected' : ''}>Outro</option>
                <option value="prefiro_nao_dizer" ${user.sexo === 'prefiro_nao_dizer' ? 'selected' : ''}>Prefiro não dizer</option>
              </select>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profilePreferenciaCarona">Preferência de carona</label>
              <select id="profilePreferenciaCarona" class="form-input">
                <option value="indiferente" ${(user.preferencia_carona || 'indiferente') === 'indiferente' ? 'selected' : ''}>Indiferente (qualquer pessoa)</option>
                <option value="mulher" ${user.preferencia_carona === 'mulher' ? 'selected' : ''}>Somente com mulheres</option>
                <option value="homem" ${user.preferencia_carona === 'homem' ? 'selected' : ''}>Somente com homens</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin-top:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileCurso">Curso</label>
              <input type="text" id="profileCurso" class="form-input" value="${user.curso || ''}" placeholder="Ex: Administração">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profilePeriodo">Período / Semestre</label>
              <input type="text" id="profilePeriodo" class="form-input" value="${user.periodo || ''}" placeholder="Ex: 3º período">
            </div>
          </div>

          <!-- Funções de mobilidade -->
          <div class="form-group" style="margin-top:1rem;">
            <label class="form-label">Como você se move no UniMove?</label>
            <div class="pill-selector">
              <label class="pill-option">
                <input type="checkbox" name="profileRole" value="motorista" id="profileRoleMotorista" ${user.roles && user.roles.includes('motorista') ? 'checked' : ''}>
                <span class="pill-label">Motorista</span>
              </label>
              <label class="pill-option">
                <input type="checkbox" name="profileRole" value="passageiro" ${user.roles && user.roles.includes('passageiro') ? 'checked' : ''}>
                <span class="pill-label">Passageiro</span>
              </label>
              <label class="pill-option">
                <input type="checkbox" name="profileRole" value="ciclista" ${user.roles && user.roles.includes('ciclista') ? 'checked' : ''}>
                <span class="pill-label">Ciclista</span>
              </label>
            </div>
          </div>
        </div>

        <!-- ── Seção: Motorista ──────────────────────── -->
        <div class="card" id="profileMotoristaSectionCard" style="padding:2rem; ${isMotorista ? '' : 'display:none;'}">
          <h2 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:1.25rem; color:var(--azul-unimove);">DADOS DO MOTORISTA</h2>

          <!-- Foto do carro -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; margin-bottom:1.25rem;">
            <div id="profileCarroPreview" style="width:200px; height:120px; border-radius:var(--radius-md); ${user.veiculo_foto_url ? `background-image:url('${user.veiculo_foto_url}');` : 'background-color:var(--bg-primary);'} background-size:cover; background-position:center; border:2px dashed var(--azul-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:0.85rem; color:var(--azul-unimove); cursor:pointer; text-align:center; padding:0.5rem;">
              ${!user.veiculo_foto_url ? 'Foto do veículo' : ''}
            </div>
            <label for="profileCarroInput" style="font-family:var(--font-subtitle); font-size:0.85rem; color:var(--azul-unimove); cursor:pointer;">
              Alterar foto do veículo
            </label>
            <input type="file" id="profileCarroInput" accept="image/*" style="display:none;">
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileVeiculoModelo">Modelo do carro</label>
              <input type="text" id="profileVeiculoModelo" class="form-input" value="${user.veiculo_modelo || ''}" placeholder="Ex: Onix 1.0">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileVeiculoCor">Cor</label>
              <input type="text" id="profileVeiculoCor" class="form-input" value="${user.veiculo_cor || ''}" placeholder="Ex: Branco">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileVeiculoPlaca">Placa</label>
              <input type="text" id="profileVeiculoPlaca" class="form-input" value="${user.veiculo_placa || ''}" placeholder="Ex: ABC-1D23" maxlength="8">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileCnh">CNH (número)</label>
              <input type="text" id="profileCnh" class="form-input" value="${user.cnh || ''}" placeholder="Número da CNH">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileVagas">Capacidade de passageiros</label>
              <input type="number" id="profileVagas" class="form-input" min="1" max="10" value="${user.vagas_padrao || 3}">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profilePrecoMedio">Preço médio por carona (R\$)</label>
              <input type="number" id="profilePrecoMedio" class="form-input" min="0" step="0.50" value="${user.preco_medio || 0}">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileTempoEspera">Tempo de espera por parada (min)</label>
              <input type="number" id="profileTempoEspera" class="form-input" min="0" max="60" value="${user.tempo_espera_min || 5}">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profilePortaMalas">Espaço no porta-malas (litros)</label>
              <input type="number" id="profilePortaMalas" class="form-input" min="0" value="${user.porta_malas_litros || ''}" placeholder="Ex: 300">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profilePreferenciaPassageiros">Preferência de passageiros</label>
              <select id="profilePreferenciaPassageiros" class="form-input">
                <option value="mista" ${(user.preferencia_passageiros || 'mista') === 'mista' ? 'selected' : ''}>Mista (qualquer pessoa)</option>
                <option value="mulher" ${user.preferencia_passageiros === 'mulher' ? 'selected' : ''}>Somente mulheres</option>
                <option value="homem" ${user.preferencia_passageiros === 'homem' ? 'selected' : ''}>Somente homens</option>
              </select>
            </div>
            <div class="form-group" style="margin:0; display:flex; align-items:center; gap:0.75rem; padding-top:1.5rem;">
              <input type="checkbox" id="profileAcessivel" ${user.acessivel_cadeirante ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer;">
              <label for="profileAcessivel" style="font-family:var(--font-subtitle); font-size:0.9rem; cursor:pointer;">Carro acessível para cadeirante</label>
            </div>
          </div>
        </div>

        <!-- ── Botão Salvar ──────────────────────────── -->
        <div style="display:flex; justify-content:flex-end; gap:1rem;">
          <button type="submit" class="btn btn-azul">Salvar perfil</button>
        </div>

      </form>
    </div>
  `;
}

export function attachProfileEvents() {
  const form = document.getElementById('profileForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const profileRoleMotorista = document.getElementById('profileRoleMotorista');
  const motoCard = document.getElementById('profileMotoristaSectionCard');
  const avatarInput = document.getElementById('profileAvatarInput');
  const avatarPreview = document.getElementById('profileAvatarPreview');
  const carroInput = document.getElementById('profileCarroInput');
  const carroPreview = document.getElementById('profileCarroPreview');
  const cpfInput = document.getElementById('profileCpf');
  const telInput = document.getElementById('profileTelefone');

  let newAvatarDataUrl = '';
  let newCarroDataUrl = '';

  // ── Logout ──────────────────────────────────────────
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

  // ── Foto de perfil ──────────────────────────────────
  if (avatarPreview && avatarInput) {
    avatarPreview.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', () => {
      const file = avatarInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newAvatarDataUrl = e.target.result;
          avatarPreview.style.backgroundImage = `url('${newAvatarDataUrl}')`;
          avatarPreview.textContent = '';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ── Foto do carro ───────────────────────────────────
  if (carroPreview && carroInput) {
    carroPreview.addEventListener('click', () => carroInput.click());
    carroInput.addEventListener('change', () => {
      const file = carroInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newCarroDataUrl = e.target.result;
          carroPreview.style.backgroundImage = `url('${newCarroDataUrl}')`;
          carroPreview.textContent = '';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ── Máscara CPF ─────────────────────────────────────
  if (cpfInput) {
    cpfInput.addEventListener('input', () => {
      let v = cpfInput.value.replace(/\D/g, '').slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      cpfInput.value = v;
    });
  }

  // ── Máscara Telefone ────────────────────────────────
  if (telInput) {
    telInput.addEventListener('input', () => {
      let v = telInput.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      else if (v.length > 0) v = v.replace(/(\d{0,2})/, '($1');
      telInput.value = v;
    });
  }

  // ── Toggle seção motorista ──────────────────────────
  if (profileRoleMotorista && motoCard) {
    profileRoleMotorista.addEventListener('change', () => {
      motoCard.style.display = profileRoleMotorista.checked ? 'block' : 'none';
    });
  }

  // ── Submit ──────────────────────────────────────────
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const roles = Array.from(document.querySelectorAll('input[name="profileRole"]:checked')).map(el => el.value);

      const updated = {
        nome: document.getElementById('profileNome').value.trim(),
        cpf: document.getElementById('profileCpf').value.trim(),
        idade: document.getElementById('profileIdade').value,
        telefone: document.getElementById('profileTelefone').value.trim(),
        sexo: document.getElementById('profileSexo').value,
        preferencia_carona: document.getElementById('profilePreferenciaCarona').value,
        curso: document.getElementById('profileCurso').value.trim(),
        periodo: document.getElementById('profilePeriodo').value.trim(),
        roles,
      };

      // Atualizar foto de perfil se nova imagem foi selecionada
      if (newAvatarDataUrl) updated.avatar_url = newAvatarDataUrl;

      // Campos do motorista
      if (roles.includes('motorista')) {
        updated.veiculo_modelo = document.getElementById('profileVeiculoModelo').value.trim();
        updated.veiculo_cor = document.getElementById('profileVeiculoCor').value.trim();
        updated.veiculo_placa = document.getElementById('profileVeiculoPlaca').value.trim();
        updated.cnh = document.getElementById('profileCnh').value.trim();
        updated.vagas_padrao = document.getElementById('profileVagas').value;
        updated.preco_medio = document.getElementById('profilePrecoMedio').value;
        updated.tempo_espera_min = document.getElementById('profileTempoEspera').value;
        updated.porta_malas_litros = document.getElementById('profilePortaMalas').value || null;
        updated.preferencia_passageiros = document.getElementById('profilePreferenciaPassageiros').value;
        updated.acessivel_cadeirante = document.getElementById('profileAcessivel').checked;
        if (newCarroDataUrl) updated.veiculo_foto_url = newCarroDataUrl;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Salvando...';

      const result = await updateProfile(updated);

      submitBtn.disabled = false;
      submitBtn.textContent = 'Salvar perfil';

      showModal({
        title: result.success ? 'Perfil atualizado' : 'Erro ao salvar',
        message: result.success
          ? 'Seus dados foram atualizados com sucesso.'
          : (result.error || 'Erro ao salvar. Tente novamente.'),
        confirmText: 'Ok',
        cancelText: '',
        onConfirm: () => {
          if (result.success) window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
      });
    });
  }
}