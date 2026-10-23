/**
 * Profile View
 * Student profile with full Standard and Motorista sections.
 */

import { getCurrentUser, updateProfile, logout } from '../services/auth.js';
import { showModal } from '../components/Modal.js';
import { compressImage } from '../utils/image.js';
import { calculateDriverAveragePrice } from '../services/rides.js';

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
  const driverAvgPrice = calculateDriverAveragePrice(user.id);
  const savedVeiculos = Array.isArray(user.veiculos) && user.veiculos.length > 0
    ? user.veiculos
    : (user.veiculo_modelo ? [{
        id: 'veh_primary',
        modelo: user.veiculo_modelo,
        cor: user.veiculo_cor || '',
        placa: user.veiculo_placa || '',
        foto_url: user.veiculo_foto_url || null,
        vagas: user.vagas_padrao || 3
      }] : []);

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
              Alterar foto de rosto (obrigatória)
            </label>
            <input type="file" id="profileAvatarInput" accept="image/*" style="display:none;">
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileNome">Nome completo *</label>
              <input type="text" id="profileNome" class="form-input" value="${user.nome || ''}" maxlength="100" required>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileEmail">E-mail institucional</label>
              <input type="email" id="profileEmail" class="form-input" value="${user.email || ''}" maxlength="100" disabled style="opacity:0.65;">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:1rem; margin-top:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileCpf">CPF</label>
              <input type="text" id="profileCpf" class="form-input" value="${user.cpf || ''}" maxlength="14" placeholder="000.000.000-00">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileIdade">Idade</label>
              <input type="number" id="profileIdade" class="form-input" min="16" max="120" maxlength="3" value="${user.idade || ''}">
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
              <input type="text" id="profileCurso" class="form-input" value="${user.curso || ''}" maxlength="80" placeholder="Ex: Administração">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profilePeriodo">Período / Semestre</label>
              <input type="text" id="profilePeriodo" class="form-input" value="${user.periodo || ''}" maxlength="30" placeholder="Ex: 3º período">
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
            </div>
            <div id="profileMotoristaAgeNotice" style="display:none; color:#c62828; font-size:0.85rem; margin-top:0.35rem;">
              Apenas maiores de 18 anos podem ativar o modo motorista.
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
              <label class="form-label" for="profileVeiculoModelo">Modelo do carro principal</label>
              <input type="text" id="profileVeiculoModelo" class="form-input" value="${user.veiculo_modelo || ''}" maxlength="50" placeholder="Ex: Onix 1.0">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileVeiculoCor">Cor</label>
              <input type="text" id="profileVeiculoCor" class="form-input" value="${user.veiculo_cor || ''}" maxlength="30" placeholder="Ex: Branco">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileVeiculoPlaca">Placa</label>
              <input type="text" id="profileVeiculoPlaca" class="form-input" value="${user.veiculo_placa || ''}" placeholder="Ex: ABC-1D23" maxlength="8">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileCnh">CNH (máximo 15 números)</label>
              <input type="text" id="profileCnh" class="form-input" value="${user.cnh || ''}" placeholder="Apenas números da CNH" maxlength="15" inputmode="numeric">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileVagas">Capacidade de passageiros</label>
              <input type="number" id="profileVagas" class="form-input" min="1" max="10" value="${user.vagas_padrao || 3}">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label">Preço médio por carona (automático)</label>
              <div style="padding:0.7rem 0.9rem; background:rgba(0,196,140,0.1); border:1px solid rgba(0,196,140,0.3); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; height:46px; box-sizing:border-box;">
                <div>
                  <span style="font-family:var(--font-title); font-size:1.15rem; font-weight:800; color:var(--verde-unimove);">
                    R$ ${driverAvgPrice > 0 ? driverAvgPrice.toFixed(2).replace('.', ',') : '0,00'}
                  </span>
                </div>
                <span class="badge badge-verde" style="font-size:0.75rem;">Média do sistema</span>
              </div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profileTempoEspera">Tempo de espera por parada (min)</label>
              <input type="number" id="profileTempoEspera" class="form-input" min="0" max="60" value="${user.tempo_espera_min || 5}">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="profilePortaMalas">Espaço no porta-malas (litros)</label>
              <input type="number" id="profilePortaMalas" class="form-input" min="0" max="9999" value="${user.porta_malas_litros || ''}" placeholder="Ex: 300">
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

          <!-- ── Meus Veículos Reutilizáveis (Item 11) ────────── -->
          <div style="margin-top:1.5rem; border-top:1px solid var(--border-color); padding-top:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <h3 style="font-family:var(--font-subtitle); font-size:1.05rem; margin:0; color:var(--azul-unimove);">MEUS VEÍCULOS</h3>
                <p style="font-size:0.8rem; color:var(--text-secondary); margin:0.15rem 0 0 0;">
                  Cadastre seus carros uma vez para reutilizá-los diretamente em qualquer carona.
                </p>
              </div>
              <button type="button" id="btnToggleNovoVeiculo" class="btn btn-sm btn-outline" style="font-size:0.8rem;">
                + Adicionar outro veículo
              </button>
            </div>

            <!-- Formulário Inline para Adicionar Outro Veículo -->
            <div id="novoVeiculoFormWrapper" style="display:none; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1rem; margin-bottom:1rem;">
              <h4 style="font-family:var(--font-subtitle); font-size:0.9rem; margin-bottom:0.75rem; color:var(--azul-unimove);">ADICIONAR NOVO VEÍCULO</h4>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.75rem;">
                <div class="form-group" style="margin:0;">
                  <label class="form-label" style="font-size:0.75rem;" for="novoVehModelo">Modelo *</label>
                  <input type="text" id="novoVehModelo" class="form-input" placeholder="Ex: Ka 1.0" maxlength="50">
                </div>
                <div class="form-group" style="margin:0;">
                  <label class="form-label" style="font-size:0.75rem;" for="novoVehCor">Cor *</label>
                  <input type="text" id="novoVehCor" class="form-input" placeholder="Ex: Prata" maxlength="30">
                </div>
                <div class="form-group" style="margin:0;">
                  <label class="form-label" style="font-size:0.75rem;" for="novoVehPlaca">Placa *</label>
                  <input type="text" id="novoVehPlaca" class="form-input" placeholder="Ex: BRA2E19" maxlength="8">
                </div>
                <div class="form-group" style="margin:0;">
                  <label class="form-label" style="font-size:0.75rem;" for="novoVehVagas">Vagas</label>
                  <input type="number" id="novoVehVagas" class="form-input" min="1" max="10" value="3">
                </div>
              </div>
              <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.75rem;">
                <button type="button" id="btnCancelarNovoVeiculo" class="btn btn-sm btn-outline">Cancelar</button>
                <button type="button" id="btnSalvarNovoVeiculo" class="btn btn-sm btn-azul">Salvar veículo</button>
              </div>
            </div>

            <!-- Lista de Veículos Salvos -->
            <div id="veiculosListaContainer" style="display:flex; flex-direction:column; gap:0.75rem;">
              ${savedVeiculos.length === 0 ? `
                <p style="font-size:0.85rem; color:var(--text-secondary); text-align:center; padding:1rem; border:1px dashed var(--border-color); border-radius:var(--radius-md);">
                  Preencha o veículo principal acima ou adicione outro para salvar em seu perfil.
                </p>
              ` : savedVeiculos.map((v, idx) => `
                <div class="saved-veh-item" style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.75rem 1rem;">
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <div style="width:36px; height:36px; border-radius:var(--radius-sm); background:rgba(0,44,142,0.1); color:var(--azul-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:0.8rem; font-weight:700;">
                      ${(v.modelo || 'CAR').slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">${v.modelo} (${v.cor || 'Cor não informada'})</div>
                      <div style="font-size:0.8rem; color:var(--text-secondary);">Placa: ${v.placa || 'Sem placa'} &bull; ${v.vagas || 3} vagas</div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline btn-remover-veiculo" data-index="${idx}" style="color:#d32f2f; border-color:rgba(211,47,47,0.3); font-size:0.75rem; padding:0.25rem 0.5rem;">
                    Remover
                  </button>
                </div>
              `).join('')}
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

  const user = getCurrentUser() || {};
  let newAvatarDataUrl = '';
  let newCarroDataUrl = '';

  // Gestão de veículos reutilizáveis (Item 11)
  let veiculosList = Array.isArray(user.veiculos) && user.veiculos.length > 0
    ? [...user.veiculos]
    : (user.veiculo_modelo ? [{
        id: 'veh_primary',
        modelo: user.veiculo_modelo,
        cor: user.veiculo_cor || '',
        placa: user.veiculo_placa || '',
        foto_url: user.veiculo_foto_url || null,
        vagas: user.vagas_padrao || 3
      }] : []);

  const btnToggleNovoVeiculo = document.getElementById('btnToggleNovoVeiculo');
  const novoVeiculoFormWrapper = document.getElementById('novoVeiculoFormWrapper');
  const btnCancelarNovoVeiculo = document.getElementById('btnCancelarNovoVeiculo');
  const btnSalvarNovoVeiculo = document.getElementById('btnSalvarNovoVeiculo');
  const veiculosListaContainer = document.getElementById('veiculosListaContainer');

  function renderVeiculosLista() {
    if (!veiculosListaContainer) return;
    if (veiculosList.length === 0) {
      veiculosListaContainer.innerHTML = `
        <p style="font-size:0.85rem; color:var(--text-secondary); text-align:center; padding:1rem; border:1px dashed var(--border-color); border-radius:var(--radius-md);">
          Preencha o veículo principal acima ou adicione outro para salvar em seu perfil.
        </p>
      `;
      return;
    }

    veiculosListaContainer.innerHTML = veiculosList.map((v, idx) => `
      <div class="saved-veh-item" style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.75rem 1rem;">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div style="width:36px; height:36px; border-radius:var(--radius-sm); background:rgba(0,44,142,0.1); color:var(--azul-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:0.8rem; font-weight:700;">
            ${(v.modelo || 'CAR').slice(0, 3).toUpperCase()}
          </div>
          <div>
            <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">${v.modelo} (${v.cor || 'Cor não informada'})</div>
            <div style="font-size:0.8rem; color:var(--text-secondary);">Placa: ${v.placa || 'Sem placa'} &bull; ${v.vagas || 3} vagas</div>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-outline btn-remover-veiculo" data-index="${idx}" style="color:#d32f2f; border-color:rgba(211,47,47,0.3); font-size:0.75rem; padding:0.25rem 0.5rem;">
          Remover
        </button>
      </div>
    `).join('');

    attachRemoverEvents();
  }

  function attachRemoverEvents() {
    if (!veiculosListaContainer) return;
    veiculosListaContainer.querySelectorAll('.btn-remover-veiculo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(btn.dataset.index, 10);
        veiculosList.splice(idx, 1);
        renderVeiculosLista();
      });
    });
  }

  if (btnToggleNovoVeiculo && novoVeiculoFormWrapper) {
    btnToggleNovoVeiculo.addEventListener('click', () => {
      novoVeiculoFormWrapper.style.display = novoVeiculoFormWrapper.style.display === 'none' ? 'block' : 'none';
    });
  }

  if (btnCancelarNovoVeiculo && novoVeiculoFormWrapper) {
    btnCancelarNovoVeiculo.addEventListener('click', () => {
      novoVeiculoFormWrapper.style.display = 'none';
      document.getElementById('novoVehModelo').value = '';
      document.getElementById('novoVehCor').value = '';
      document.getElementById('novoVehPlaca').value = '';
    });
  }

  if (btnSalvarNovoVeiculo && novoVeiculoFormWrapper) {
    btnSalvarNovoVeiculo.addEventListener('click', () => {
      const modelo = document.getElementById('novoVehModelo')?.value.trim();
      const cor = document.getElementById('novoVehCor')?.value.trim();
      const placa = document.getElementById('novoVehPlaca')?.value.trim().toUpperCase();
      const vagas = parseInt(document.getElementById('novoVehVagas')?.value || '3', 10);

      if (!modelo || !placa) {
        showModal({
          title: 'Dados incompletos',
          message: 'Por favor, informe pelo menos o modelo e a placa do veículo.',
          confirmText: 'Ok'
        });
        return;
      }

      veiculosList.push({
        id: 'veh_' + Date.now(),
        modelo,
        cor: cor || 'Não informada',
        placa,
        vagas: vagas || 3,
        criado_em: new Date().toISOString()
      });

      // Limpar formulário e ocultar
      document.getElementById('novoVehModelo').value = '';
      document.getElementById('novoVehCor').value = '';
      document.getElementById('novoVehPlaca').value = '';
      novoVeiculoFormWrapper.style.display = 'none';

      renderVeiculosLista();
    });
  }

  attachRemoverEvents();

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

  // ── Foto de perfil (Comprimida e Obrigatória) ─────────
  if (avatarPreview && avatarInput) {
    avatarPreview.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', async () => {
      const file = avatarInput.files[0];
      if (file) {
        try {
          newAvatarDataUrl = await compressImage(file, 400, 400, 0.82);
          avatarPreview.style.backgroundImage = `url('${newAvatarDataUrl}')`;
          avatarPreview.textContent = '';
        } catch (err) {
          console.error('Erro ao processar foto:', err);
        }
      }
    });
  }

  // ── Foto do carro (Comprimida) ───────────────────────
  if (carroPreview && carroInput) {
    carroPreview.addEventListener('click', () => carroInput.click());
    carroInput.addEventListener('change', async () => {
      const file = carroInput.files[0];
      if (file) {
        try {
          newCarroDataUrl = await compressImage(file, 600, 400, 0.82);
          carroPreview.style.backgroundImage = `url('${newCarroDataUrl}')`;
          carroPreview.textContent = '';
        } catch (err) {
          console.error('Erro ao processar foto do carro:', err);
        }
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

  // ── CNH Máscara / Limite 15 números ────────────────
  const cnhInput = document.getElementById('profileCnh');
  if (cnhInput) {
    cnhInput.addEventListener('input', () => {
      cnhInput.value = cnhInput.value.replace(/\D/g, '').slice(0, 15);
    });
  }

  // ── Validação Idade e Motorista ─────────────────────
  const idadeInput = document.getElementById('profileIdade');
  const ageNotice = document.getElementById('profileMotoristaAgeNotice');

  function checkMotoristaAge() {
    const ageVal = parseInt(idadeInput?.value || '0', 10);
    if (ageVal > 0 && ageVal < 18) {
      if (profileRoleMotorista && profileRoleMotorista.checked) {
        profileRoleMotorista.checked = false;
        if (motoCard) motoCard.style.display = 'none';
      }
      if (ageNotice) ageNotice.style.display = 'block';
    } else {
      if (ageNotice) ageNotice.style.display = 'none';
    }
  }

  if (idadeInput) {
    idadeInput.addEventListener('input', () => {
      idadeInput.value = idadeInput.value.replace(/\D/g, '').slice(0, 3);
      checkMotoristaAge();
    });
  }

  // ── Toggle seção motorista ──────────────────────────
  if (profileRoleMotorista) {
    profileRoleMotorista.addEventListener('change', () => {
      const ageVal = parseInt(idadeInput?.value || '0', 10);
      if (profileRoleMotorista.checked && ageVal > 0 && ageVal < 18) {
        profileRoleMotorista.checked = false;
        if (motoCard) motoCard.style.display = 'none';
        if (ageNotice) ageNotice.style.display = 'block';
        showModal({
          title: 'Ação não permitida',
          message: 'Apenas maiores de 18 anos podem se cadastrar ou atuar como motoristas.',
          confirmText: 'Entendi'
        });
        return;
      }
      if (motoCard) motoCard.style.display = profileRoleMotorista.checked ? 'block' : 'none';
    });
  }

  // ── Submit ──────────────────────────────────────────
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Foto de perfil obrigatória (Item 9)
      const hasExistingAvatar = Boolean(user.avatar_url || user.avatar);
      if (!hasExistingAvatar && !newAvatarDataUrl) {
        showModal({
          title: 'Foto de Perfil Obrigatória',
          message: 'Por favor, adicione uma foto de perfil nítida. É uma exigência de segurança para todos os usuários do UniMove.',
          confirmText: 'Escolher foto'
        });
        avatarPreview?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const roles = Array.from(document.querySelectorAll('input[name="profileRole"]:checked')).map(el => el.value);
      const idadeNum = parseInt(document.getElementById('profileIdade').value || '0', 10);

      if (roles.includes('motorista')) {
        if (idadeNum < 18) {
          showModal({
            title: 'Ação não permitida',
            message: 'Apenas maiores de 18 anos podem ser motoristas no UniMove.',
            confirmText: 'Corrigir'
          });
          return;
        }

        const cnhVal = (document.getElementById('profileCnh')?.value || '').replace(/\D/g, '');
        if (!cnhVal) {
          showModal({
            title: 'CNH obrigatória',
            message: 'Por favor, informe o número da sua CNH para ativar o perfil de motorista.',
            confirmText: 'Corrigir'
          });
          return;
        }

        if (cnhVal.length > 15) {
          showModal({
            title: 'CNH inválida',
            message: 'A CNH deve conter no máximo 15 números.',
            confirmText: 'Corrigir'
          });
          return;
        }
      }

      const updated = {
        nome: document.getElementById('profileNome').value.trim(),
        cpf: document.getElementById('profileCpf').value.trim(),
        idade: idadeNum || null,
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
        const primaryModelo = document.getElementById('profileVeiculoModelo')?.value.trim() || '';
        const primaryCor = document.getElementById('profileVeiculoCor')?.value.trim() || '';
        const primaryPlaca = document.getElementById('profileVeiculoPlaca')?.value.trim().toUpperCase() || '';

        updated.veiculo_modelo = primaryModelo;
        updated.veiculo_cor = primaryCor;
        updated.veiculo_placa = primaryPlaca;
        updated.cnh = document.getElementById('profileCnh').value.trim();
        updated.vagas_padrao = document.getElementById('profileVagas').value;
        updated.tempo_espera_min = document.getElementById('profileTempoEspera').value;
        updated.porta_malas_litros = document.getElementById('profilePortaMalas').value || null;
        updated.preferencia_passageiros = document.getElementById('profilePreferenciaPassageiros').value;
        updated.acessivel_cadeirante = document.getElementById('profileAcessivel').checked;
        if (newCarroDataUrl) updated.veiculo_foto_url = newCarroDataUrl;

        // Se tem veículo primário e a lista de veículos está vazia, sincroniza
        if (primaryModelo && primaryPlaca) {
          const exists = veiculosList.some(v => v.placa === primaryPlaca);
          if (!exists) {
            veiculosList.unshift({
              id: 'veh_primary',
              modelo: primaryModelo,
              cor: primaryCor,
              placa: primaryPlaca,
              foto_url: newCarroDataUrl || user.veiculo_foto_url || null,
              vagas: parseInt(updated.vagas_padrao, 10) || 3
            });
          }
        }
        updated.veiculos = veiculosList;
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