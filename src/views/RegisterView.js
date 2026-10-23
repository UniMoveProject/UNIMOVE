/**
 * Register View
 * Student onboarding form with input validation, masks, photo upload preview,
 * password strength evaluation, visibility toggles, character limits, and under-18 driver block.
 */

import { registerUser } from '../services/auth.js';
import { showModal } from '../components/Modal.js';

// SVG Icons para mostrar/ocultar senha
const EYE_OPEN_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const EYE_CLOSED_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

export function renderRegisterView() {
  return `
    <div style="max-width:700px; margin:2rem auto;">
      <div class="card" style="padding:2.25rem;">
        
        <div style="text-align:center; margin-bottom:1.75rem;">
          <img src="/logo.png" alt="UniMove Logo" style="width:54px; height:60px; object-fit:contain; margin-bottom:0.75rem;">
          <div style="font-family:var(--font-subtitle); font-size:0.95rem; color:var(--azul-unimove);">NOVO CADASTRO UNIVERSITÁRIO</div>
          <h1 class="page-title" style="font-size:2.2rem; margin:0.35rem 0 0.5rem;">CRIAR CONTA</h1>
          <p style="color:var(--text-secondary); font-size:1.05rem;">
            Junte-se à maior rede de caronas colaborativas da faculdade com segurança e privacidade.
          </p>
        </div>

        <div id="registerErrorMsg" class="form-error-msg" style="background-color:rgba(229,57,53,0.1); border:1px solid rgba(229,57,53,0.3); padding:0.65rem 1rem; border-radius:var(--radius-md); margin-bottom:1.25rem; text-align:center;">
        </div>

        <form id="registerForm" style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- ── Foto de Perfil ─────────────────────── -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;">
            <div id="regAvatarPreview" style="width:90px; height:90px; border-radius:50%; background-color:var(--bg-primary); border:2px dashed var(--azul-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove); cursor:pointer; background-size:cover; background-position:center;">
              Foto
            </div>
            <label for="regAvatarInput" style="font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove); cursor:pointer;">
              Adicionar foto de rosto nítido *
            </label>
            <input type="file" id="regAvatarInput" accept="image/*" style="display:none;">
          </div>

          <!-- ── Dados Básicos ──────────────────────── -->
          <fieldset style="border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem;">
            <legend style="font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove); padding:0 0.5rem;">DADOS PESSOAIS</legend>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regNome">Nome completo *</label>
                <input type="text" id="regNome" class="form-input" placeholder="Ex: Rhian Almeida" maxlength="100" required>
              </div>

              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regEmail">E-mail institucional *</label>
                <input type="email" id="regEmail" class="form-input" placeholder="aluno@uniceplac.edu.br" maxlength="100" required>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:1rem; margin-top:1rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regCpf">CPF *</label>
                <input type="text" id="regCpf" class="form-input" placeholder="000.000.000-00" maxlength="14" required>
              </div>

              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regIdade">Idade * <span style="font-size:0.75rem; color:var(--text-secondary);">(Mín. 18 p/ motorista)</span></label>
                <input type="number" id="regIdade" class="form-input" min="16" max="100" placeholder="Ex: 21" required>
              </div>

              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regTelefone">Celular / WhatsApp *</label>
                <input type="tel" id="regTelefone" class="form-input" placeholder="(61) 90000-0000" maxlength="15" required>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regSexo">Sexo *</label>
                <select id="regSexo" class="form-input" required>
                  <option value="">Selecione...</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro_nao_dizer">Prefiro não dizer</option>
                </select>
              </div>

              <!-- Preferência de Carona -->
              <div class="form-group" style="margin:0;" id="regPreferenciaCaronaGroup">
                <label class="form-label" for="regPreferenciaCarona">Preferência de Carona</label>
                <select id="regPreferenciaCarona" class="form-input">
                  <option value="indiferente">Indiferente (qualquer pessoa)</option>
                  <option value="mulher">Somente com mulheres</option>
                  <option value="homem">Somente com homens</option>
                </select>
              </div>
            </div>
          </fieldset>

          <!-- ── Acesso & Segurança de Senha ─────────── -->
          <fieldset style="border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem;">
            <legend style="font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove); padding:0 0.5rem;">ACESSO E SEGURANÇA</legend>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
              <!-- Campo Senha com botão de visualização -->
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regSenha">Senha de acesso *</label>
                <div style="position:relative; display:flex; align-items:center;">
                  <input type="password" id="regSenha" class="form-input" placeholder="Mínimo 8 caracteres" maxlength="64" required style="padding-right:2.8rem; width:100%;">
                  <button type="button" id="toggleRegSenhaBtn" title="Ver ou ocultar senha" aria-label="Ver senha" style="position:absolute; right:0.6rem; background:none; border:none; color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; justify-content:center; padding:4px;">
                    ${EYE_OPEN_SVG}
                  </button>
                </div>
              </div>

              <!-- Campo Confirmar Senha com botão de visualização -->
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regConfirmaSenha">Confirmar senha *</label>
                <div style="position:relative; display:flex; align-items:center;">
                  <input type="password" id="regConfirmaSenha" class="form-input" placeholder="Repita a senha digitada" maxlength="64" required style="padding-right:2.8rem; width:100%;">
                  <button type="button" id="toggleRegConfirmaSenhaBtn" title="Ver ou ocultar senha" aria-label="Ver confirmação de senha" style="position:absolute; right:0.6rem; background:none; border:none; color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; justify-content:center; padding:4px;">
                    ${EYE_OPEN_SVG}
                  </button>
                </div>
              </div>
            </div>

            <!-- Incentivo e Indicador de Força de Senha -->
            <div id="passwordSecurityBox" style="margin-top:1rem; background:var(--bg-primary); padding:0.9rem 1.1rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <span style="font-size:0.85rem; font-weight:600; color:var(--text-secondary);">Nível de segurança da senha:</span>
                <span id="passStrengthLabel" style="font-size:0.85rem; font-weight:700; color:#d32f2f;">Muito fraca</span>
              </div>
              
              <!-- Barra dinâmica -->
              <div style="width:100%; height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden; margin-bottom:0.75rem;">
                <div id="passStrengthBar" style="width:0%; height:100%; background:#d32f2f; transition:all 0.3s ease;"></div>
              </div>

              <!-- Checklist dos 4 Requisitos Obrigatórios -->
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.4rem; font-size:0.8rem;">
                <div id="reqLength" style="display:flex; align-items:center; gap:0.4rem; color:#94a3b8; transition:color 0.2s;">
                  <span class="req-icon" style="font-weight:bold;">✕</span> Mínimo de 8 caracteres
                </div>
                <div id="reqUpper" style="display:flex; align-items:center; gap:0.4rem; color:#94a3b8; transition:color 0.2s;">
                  <span class="req-icon" style="font-weight:bold;">✕</span> Letra maiúscula (A-Z)
                </div>
                <div id="reqLower" style="display:flex; align-items:center; gap:0.4rem; color:#94a3b8; transition:color 0.2s;">
                  <span class="req-icon" style="font-weight:bold;">✕</span> Letra minúscula (a-z)
                </div>
                <div id="reqNumber" style="display:flex; align-items:center; gap:0.4rem; color:#94a3b8; transition:color 0.2s;">
                  <span class="req-icon" style="font-weight:bold;">✕</span> Pelo menos um número (0-9)
                </div>
                <div id="reqSpecial" style="display:flex; align-items:center; gap:0.4rem; color:#94a3b8; transition:color 0.2s;">
                  <span class="req-icon" style="font-weight:bold;">✕</span> Caractere especial (!@#$...)
                </div>
              </div>

              <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:0.6rem; line-height:1.4;">
                🛡️ <strong>Incentivo à Segurança:</strong> Uma senha forte protege seus dados pessoais de contato, histórico de viagens e rotas universitárias.
              </div>
            </div>
          </fieldset>

          <!-- ── Função de Mobilidade (Ciclista REMOVIDO) ─────────────── -->
          <fieldset style="border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem;">
            <legend style="font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove); padding:0 0.5rem;">COMO VAI SE MOVER</legend>

            <div class="pill-selector">
              <label class="pill-option" id="labelRoleMotorista">
                <input type="checkbox" name="regRole" value="motorista" id="regRoleMotorista">
                <span class="pill-label">Motorista</span>
              </label>
              <label class="pill-option">
                <input type="checkbox" name="regRole" value="passageiro" checked>
                <span class="pill-label">Passageiro</span>
              </label>
            </div>
            <div id="motoristaAgeNotice" style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.5rem; display:none;">
              ⚠️ A função de motorista requer idade igual ou superior a 18 anos e posse de CNH válida.
            </div>
          </fieldset>

          <!-- ── Dados do Motorista (condicional) ────── -->
          <fieldset id="regMotoristaSectionFields" style="border:1px solid var(--azul-unimove); border-radius:var(--radius-md); padding:1.25rem; display:none;">
            <legend style="font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove); padding:0 0.5rem;">DADOS DO MOTORISTA</legend>

            <!-- Foto do carro -->
            <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; margin-bottom:1rem;">
              <div id="regCarroPreview" style="width:160px; height:100px; border-radius:var(--radius-md); background-color:var(--bg-primary); border:2px dashed var(--azul-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:0.85rem; color:var(--azul-unimove); cursor:pointer; background-size:cover; background-position:center; text-align:center; padding:0.5rem;">
                Foto do carro
              </div>
              <label for="regCarroInput" style="font-family:var(--font-subtitle); font-size:0.85rem; color:var(--azul-unimove); cursor:pointer;">
                Adicionar foto do veículo
              </label>
              <input type="file" id="regCarroInput" accept="image/*" style="display:none;">
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regVeiculoModelo">Modelo do carro</label>
                <input type="text" id="regVeiculoModelo" class="form-input" placeholder="Ex: Onix 1.0" maxlength="50">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regVeiculoCor">Cor</label>
                <input type="text" id="regVeiculoCor" class="form-input" placeholder="Ex: Branco" maxlength="30">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regVeiculoPlaca">Placa *</label>
                <input type="text" id="regVeiculoPlaca" class="form-input" placeholder="Ex: ABC-1D23" maxlength="8">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regCnh">CNH (número) * <span style="font-size:0.75rem; color:var(--text-secondary);">(máx. 15 números)</span></label>
                <input type="text" inputmode="numeric" id="regCnh" class="form-input" placeholder="Somente números (máx. 15 dígitos)" maxlength="15">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regVagas">Quantas pessoas comporta? *</label>
                <input type="number" id="regVagas" class="form-input" min="1" max="10" value="3">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regPrecoMedio">Preço médio por carona (R$)</label>
                <input type="number" id="regPrecoMedio" class="form-input" min="0" max="999" step="0.50" value="0" placeholder="0.00">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regTempoEspera">Tempo de espera por parada (min)</label>
                <input type="number" id="regTempoEspera" class="form-input" min="0" max="60" value="5">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regPortaMalas">Espaço no porta-malas (litros)</label>
                <input type="number" id="regPortaMalas" class="form-input" min="0" max="9999" placeholder="Ex: 300">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regPreferenciaPassageiros">Preferência de passageiros</label>
                <select id="regPreferenciaPassageiros" class="form-input">
                  <option value="mista">Mista (qualquer pessoa)</option>
                  <option value="mulher">Somente mulheres</option>
                  <option value="homem">Somente homens</option>
                </select>
              </div>
              <div class="form-group" style="margin:0; display:flex; align-items:center; gap:0.75rem; padding-top:1.5rem;">
                <input type="checkbox" id="regAcessivel" style="width:18px; height:18px; cursor:pointer;">
                <label for="regAcessivel" style="font-family:var(--font-subtitle); font-size:0.9rem; cursor:pointer;">Carro acessível para cadeirante</label>
              </div>
            </div>
          </fieldset>

          <button type="submit" class="btn btn-azul btn-block" style="margin-top:0.5rem;">
            Finalizar cadastro
          </button>
        </form>

        <div style="text-align:center; margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid var(--border-color); font-size:1rem; color:var(--text-secondary);">
          Já tem conta? <a href="#/login" style="color:var(--azul-unimove); font-family:var(--font-subtitle); font-weight:bold;">Entrar</a>
        </div>

      </div>
    </div>
  `;
}

export function attachRegisterEvents() {
  const form = document.getElementById('registerForm');
  const errorMsg = document.getElementById('registerErrorMsg');
  const avatarInput = document.getElementById('regAvatarInput');
  const avatarPreview = document.getElementById('regAvatarPreview');
  const carroInput = document.getElementById('regCarroInput');
  const carroPreview = document.getElementById('regCarroPreview');
  const cpfInput = document.getElementById('regCpf');
  const telInput = document.getElementById('regTelefone');
  const idadeInput = document.getElementById('regIdade');
  const cnhInput = document.getElementById('regCnh');
  const motoristaCheckbox = document.getElementById('regRoleMotorista');
  const motoristaFields = document.getElementById('regMotoristaSectionFields');
  const motoristaAgeNotice = document.getElementById('motoristaAgeNotice');

  const senhaInput = document.getElementById('regSenha');
  const confirmaSenhaInput = document.getElementById('regConfirmaSenha');
  const toggleSenhaBtn = document.getElementById('toggleRegSenhaBtn');
  const toggleConfirmaBtn = document.getElementById('toggleRegConfirmaSenhaBtn');

  const passStrengthBar = document.getElementById('passStrengthBar');
  const passStrengthLabel = document.getElementById('passStrengthLabel');
  const reqLength = document.getElementById('reqLength');
  const reqUpper = document.getElementById('reqUpper');
  const reqLower = document.getElementById('reqLower');
  const reqNumber = document.getElementById('reqNumber');
  const reqSpecial = document.getElementById('reqSpecial');

  let avatarDataUrl = '';
  let carroDataUrl = '';

  // ── Alternador de Visualização de Senha (Botão Ver Senha) ────
  if (toggleSenhaBtn && senhaInput) {
    toggleSenhaBtn.addEventListener('click', () => {
      const isPassword = senhaInput.type === 'password';
      senhaInput.type = isPassword ? 'text' : 'password';
      toggleSenhaBtn.innerHTML = isPassword ? EYE_CLOSED_SVG : EYE_OPEN_SVG;
    });
  }

  if (toggleConfirmaBtn && confirmaSenhaInput) {
    toggleConfirmaBtn.addEventListener('click', () => {
      const isPassword = confirmaSenhaInput.type === 'password';
      confirmaSenhaInput.type = isPassword ? 'text' : 'password';
      toggleConfirmaBtn.innerHTML = isPassword ? EYE_CLOSED_SVG : EYE_OPEN_SVG;
    });
  }

  // ── Avaliação e Checklist da Senha em Tempo Real ─────────────
  function evaluatePasswordSecurity(val) {
    const hasLength = val.length >= 8;
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(val);

    // Atualiza checklist visual
    updateReqItem(reqLength, hasLength);
    updateReqItem(reqUpper, hasUpper);
    updateReqItem(reqLower, hasLower);
    updateReqItem(reqNumber, hasNumber);
    updateReqItem(reqSpecial, hasSpecial);

    // Contagem de critérios atendidos
    const score = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    if (val.length === 0) {
      passStrengthBar.style.width = '0%';
      passStrengthBar.style.backgroundColor = '#d32f2f';
      passStrengthLabel.textContent = 'Muito fraca';
      passStrengthLabel.style.color = '#d32f2f';
    } else if (score <= 2) {
      passStrengthBar.style.width = '30%';
      passStrengthBar.style.backgroundColor = '#d32f2f';
      passStrengthLabel.textContent = 'Fraca';
      passStrengthLabel.style.color = '#d32f2f';
    } else if (score === 3 || score === 4) {
      passStrengthBar.style.width = '65%';
      passStrengthBar.style.backgroundColor = '#f59e0b';
      passStrengthLabel.textContent = 'Média / Quase lá';
      passStrengthLabel.style.color = '#f59e0b';
    } else {
      passStrengthBar.style.width = '100%';
      passStrengthBar.style.backgroundColor = '#16a34a';
      passStrengthLabel.textContent = 'Forte e segura';
      passStrengthLabel.style.color = '#16a34a';
    }
  }

  function updateReqItem(el, isValid) {
    if (!el) return;
    const icon = el.querySelector('.req-icon');
    if (isValid) {
      el.style.color = '#16a34a';
      if (icon) icon.textContent = '✓';
    } else {
      el.style.color = '#94a34a';
      if (icon) icon.textContent = '✕';
    }
  }

  if (senhaInput) {
    senhaInput.addEventListener('input', () => {
      evaluatePasswordSecurity(senhaInput.value);
    });
  }

  // ── Bloqueio de Menores de 18 Anos como Motorista ─────────────
  function checkAgeForMotorista() {
    const age = parseInt(idadeInput.value, 10);
    if (!isNaN(age) && age < 18) {
      if (motoristaAgeNotice) motoristaAgeNotice.style.display = 'block';
      if (motoristaCheckbox.checked) {
        motoristaCheckbox.checked = false;
        motoristaFields.style.display = 'none';
        errorMsg.textContent = 'Atenção: Menores de 18 anos só podem se cadastrar como Passageiro (exigência legal de CNH).';
        errorMsg.classList.add('show');
      }
    } else {
      if (motoristaAgeNotice) motoristaAgeNotice.style.display = 'none';
    }
  }

  if (idadeInput) {
    idadeInput.addEventListener('input', () => {
      // Limita a 3 dígitos numéricos
      if (idadeInput.value.length > 3) idadeInput.value = idadeInput.value.slice(0, 3);
      checkAgeForMotorista();
    });
  }

  if (motoristaCheckbox) {
    motoristaCheckbox.addEventListener('change', () => {
      const age = parseInt(idadeInput.value, 10);
      if (motoristaCheckbox.checked && (isNaN(age) || age < 18)) {
        motoristaCheckbox.checked = false;
        motoristaFields.style.display = 'none';
        errorMsg.textContent = 'Bloqueado: É obrigatório ter no mínimo 18 anos completos para se cadastrar como Motorista (exigência legal de CNH). Por favor, preencha sua idade ou cadastre-se como Passageiro.';
        errorMsg.classList.add('show');
        idadeInput.focus();
        return;
      }
      errorMsg.classList.remove('show');
      motoristaFields.style.display = motoristaCheckbox.checked ? 'block' : 'none';
    });
  }

  // ── Limite e Máscara Numérica da CNH (Máximo 15 números) ──────
  if (cnhInput) {
    cnhInput.addEventListener('input', () => {
      // Aceita apenas números e no máximo 15 dígitos
      cnhInput.value = cnhInput.value.replace(/\D/g, '').slice(0, 15);
    });
  }

  // ── Avatar de perfil ──────────────────────────────────────────
  avatarPreview.addEventListener('click', () => avatarInput.click());
  avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarDataUrl = e.target.result;
        avatarPreview.style.backgroundImage = `url('${avatarDataUrl}')`;
        avatarPreview.textContent = '';
      };
      reader.readAsDataURL(file);
    }
  });

  // ── Foto do carro ─────────────────────────────────────────────
  carroPreview.addEventListener('click', () => carroInput.click());
  carroInput.addEventListener('change', () => {
    const file = carroInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        carroDataUrl = e.target.result;
        carroPreview.style.backgroundImage = `url('${carroDataUrl}')`;
        carroPreview.textContent = '';
      };
      reader.readAsDataURL(file);
    }
  });

  // ── Máscara CPF ───────────────────────────────────────────────
  cpfInput.addEventListener('input', () => {
    let v = cpfInput.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpfInput.value = v;
  });

  // ── Máscara Telefone ──────────────────────────────────────────
  telInput.addEventListener('input', () => {
    let v = telInput.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    else if (v.length > 0) v = v.replace(/(\d{0,2})/, '($1');
    telInput.value = v;
  });

  // ── Submit do Cadastro ────────────────────────────────────────
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = document.getElementById('regNome').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const cpf = cpfInput.value.trim();
      const telefone = telInput.value.trim();
      const idade = idadeInput.value;
      const idadeNum = parseInt(idade, 10);
      const sexo = document.getElementById('regSexo').value;
      const preferencia_carona = document.getElementById('regPreferenciaCarona').value;
      const senha = senhaInput.value;
      const confirmaSenha = confirmaSenhaInput.value;

      const roles = Array.from(document.querySelectorAll('input[name="regRole"]:checked')).map(el => el.value);

      // Validações básicas
      if (!sexo) {
        errorMsg.textContent = 'Por favor, selecione seu sexo.';
        errorMsg.classList.add('show');
        return;
      }

      if (roles.length === 0) {
        errorMsg.textContent = 'Escolha pelo menos uma forma como você vai se mover: Motorista ou Passageiro.';
        errorMsg.classList.add('show');
        return;
      }

      // Validação Estrita de Maioridade para Motorista
      if (roles.includes('motorista')) {
        if (!idadeNum || idadeNum < 18) {
          errorMsg.textContent = 'Bloqueado: Menores de 18 anos não podem se cadastrar como motorista (exigência legal de CNH). Por favor, selecione apenas a opção Passageiro.';
          errorMsg.classList.add('show');
          return;
        }

        const cnhVal = cnhInput.value.trim();
        if (!cnhVal) {
          errorMsg.textContent = 'Por favor, informe o número da sua CNH para se cadastrar como motorista.';
          errorMsg.classList.add('show');
          return;
        }

        if (cnhVal.length > 15) {
          errorMsg.textContent = 'A CNH deve conter no máximo 15 números.';
          errorMsg.classList.add('show');
          return;
        }
      }

      // Validação Estrita dos Requisitos de Senha
      if (senha.length < 8) {
        errorMsg.textContent = 'A senha deve conter no mínimo 8 caracteres.';
        errorMsg.classList.add('show');
        return;
      }
      if (!/[A-Z]/.test(senha)) {
        errorMsg.textContent = 'A senha deve conter pelo menos uma letra maiúscula (A-Z).';
        errorMsg.classList.add('show');
        return;
      }
      if (!/[a-z]/.test(senha)) {
        errorMsg.textContent = 'A senha deve conter pelo menos uma letra minúscula (a-z).';
        errorMsg.classList.add('show');
        return;
      }
      if (!/[0-9]/.test(senha)) {
        errorMsg.textContent = 'A senha deve conter pelo menos um número (0-9).';
        errorMsg.classList.add('show');
        return;
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(senha)) {
        errorMsg.textContent = 'A senha deve conter pelo menos um caractere especial (!@#$%...).';
        errorMsg.classList.add('show');
        return;
      }
      if (senha !== confirmaSenha) {
        errorMsg.textContent = 'As senhas não conferem. Verifique a confirmação digitada.';
        errorMsg.classList.add('show');
        return;
      }

      const userData = {
        nome,
        email,
        cpf,
        telefone,
        idade: idadeNum,
        sexo,
        preferencia_carona,
        senha,
        roles,
        avatar: avatarDataUrl
      };

      // Campos do motorista
      if (roles.includes('motorista')) {
        userData.veiculo_modelo = document.getElementById('regVeiculoModelo').value.trim();
        userData.veiculo_cor = document.getElementById('regVeiculoCor').value.trim();
        userData.veiculo_placa = document.getElementById('regVeiculoPlaca').value.trim();
        userData.veiculo_foto_url = carroDataUrl || null;
        userData.cnh = cnhInput.value.trim();
        userData.vagas_padrao = document.getElementById('regVagas').value;
        userData.preco_medio = document.getElementById('regPrecoMedio').value;
        userData.tempo_espera_min = document.getElementById('regTempoEspera').value;
        userData.porta_malas_litros = document.getElementById('regPortaMalas')?.value || null;
        userData.preferencia_passageiros = document.getElementById('regPreferenciaPassageiros').value;
        userData.acessivel_cadeirante = document.getElementById('regAcessivel').checked;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Criando conta com segurança...';

      const res = await registerUser(userData);

      submitBtn.disabled = false;
      submitBtn.textContent = 'Finalizar cadastro';

      if (res.success) {
        errorMsg.classList.remove('show');
        showModal({
          title: 'Cadastro realizado com sucesso',
          message: `Bem-vindo(a) ao UniMove, ${nome.split(' ')[0]}! Seu perfil universitário foi criado e seus dados pessoais estão protegidos com criptografia.`,
          confirmText: 'Acessar o aplicativo',
          cancelText: '',
          onConfirm: () => {
            window.location.hash = '#/home';
          }
        });
      } else {
        errorMsg.textContent = res.error;
        errorMsg.classList.add('show');
      }
    });
  }
}