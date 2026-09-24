/**
 * Register View
 * Student onboarding form with input validation, masks and photo upload preview.
 */

import { registerUser } from '../services/auth.js';
import { showModal } from '../components/Modal.js';

export function renderRegisterView() {
  return `
    <div style="max-width:700px; margin:2rem auto;">
      <div class="card" style="padding:2.25rem;">
        
        <div style="text-align:center; margin-bottom:1.75rem;">
          <img src="/logo.png" alt="UniMove Logo" style="width:54px; height:60px; object-fit:contain; margin-bottom:0.75rem;">
          <div style="font-family:var(--font-subtitle); font-size:0.95rem; color:var(--azul-unimove);">NOVO CADASTRO UNIVERSITÁRIO</div>
          <h1 class="page-title" style="font-size:2.2rem; margin:0.35rem 0 0.5rem;">CRIAR CONTA</h1>
          <p style="color:var(--text-secondary); font-size:1.05rem;">
            Junte-se à maior rede de caronas colaborativas da faculdade.
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
                <input type="text" id="regNome" class="form-input" placeholder="Ex: Rhian Almeida" required>
              </div>

              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regEmail">E-mail institucional *</label>
                <input type="email" id="regEmail" class="form-input" placeholder="aluno@uniceplac.edu.br" required>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:1rem; margin-top:1rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regCpf">CPF *</label>
                <input type="text" id="regCpf" class="form-input" placeholder="000.000.000-00" maxlength="14" required>
              </div>

              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regIdade">Idade *</label>
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

              <!-- Preferência de Carona — aparece para todos (pode filtrar quem quer que embarque) -->
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

          <!-- ── Acesso ─────────────────────────────── -->
          <fieldset style="border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem;">
            <legend style="font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove); padding:0 0.5rem;">ACESSO</legend>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regSenha">Senha de acesso * <span style="font-weight:normal; color:var(--text-secondary);">(mín. 6 caracteres)</span></label>
                <input type="password" id="regSenha" class="form-input" placeholder="Mínimo 6 caracteres" required>
              </div>

              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regConfirmaSenha">Confirmar senha *</label>
                <input type="password" id="regConfirmaSenha" class="form-input" placeholder="Repita a senha" required>
              </div>
            </div>
          </fieldset>

          <!-- ── Função de Mobilidade ───────────────── -->
          <fieldset style="border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem;">
            <legend style="font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove); padding:0 0.5rem;">COMO VAI SE MOVER</legend>

            <div class="pill-selector">
              <label class="pill-option">
                <input type="checkbox" name="regRole" value="motorista" id="regRoleMotorista">
                <span class="pill-label">Motorista</span>
              </label>
              <label class="pill-option">
                <input type="checkbox" name="regRole" value="passageiro" checked>
                <span class="pill-label">Passageiro</span>
              </label>
              <label class="pill-option">
                <input type="checkbox" name="regRole" value="ciclista">
                <span class="pill-label">Ciclista</span>
              </label>
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
                <input type="text" id="regVeiculoModelo" class="form-input" placeholder="Ex: Onix 1.0">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regVeiculoCor">Cor</label>
                <input type="text" id="regVeiculoCor" class="form-input" placeholder="Ex: Branco">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regVeiculoPlaca">Placa *</label>
                <input type="text" id="regVeiculoPlaca" class="form-input" placeholder="Ex: ABC-1D23" maxlength="8">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regCnh">CNH (número)</label>
                <input type="text" id="regCnh" class="form-input" placeholder="Número da CNH">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regVagas">Quantas pessoas comporta? *</label>
                <input type="number" id="regVagas" class="form-input" min="1" max="10" value="3">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regPrecoMedio">Preço médio por carona (R\$)</label>
                <input type="number" id="regPrecoMedio" class="form-input" min="0" step="0.50" value="0" placeholder="0.00">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regTempoEspera">Tempo de espera por parada (min)</label>
                <input type="number" id="regTempoEspera" class="form-input" min="0" max="60" value="5">
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="regPortaMalas">Espaço no porta-malas (litros)</label>
                <input type="number" id="regPortaMalas" class="form-input" min="0" placeholder="Ex: 300">
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
  const motoristaCheckbox = document.getElementById('regRoleMotorista');
  const motoristaFields = document.getElementById('regMotoristaSectionFields');

  let avatarDataUrl = '';
  let carroDataUrl = '';

  // ── Avatar de perfil ────────────────────────────────
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

  // ── Foto do carro ───────────────────────────────────
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

  // ── Máscara CPF ─────────────────────────────────────
  cpfInput.addEventListener('input', () => {
    let v = cpfInput.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpfInput.value = v;
  });

  // ── Máscara Telefone ────────────────────────────────
  telInput.addEventListener('input', () => {
    let v = telInput.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    else if (v.length > 0) v = v.replace(/(\d{0,2})/, '($1');
    telInput.value = v;
  });

  // ── Mostrar / Ocultar campos do Motorista ───────────
  motoristaCheckbox.addEventListener('change', () => {
    motoristaFields.style.display = motoristaCheckbox.checked ? 'block' : 'none';
  });

  // ── Submit ──────────────────────────────────────────
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = document.getElementById('regNome').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const cpf = cpfInput.value.trim();
      const telefone = telInput.value.trim();
      const idade = document.getElementById('regIdade').value;
      const sexo = document.getElementById('regSexo').value;
      const preferencia_carona = document.getElementById('regPreferenciaCarona').value;
      const senha = document.getElementById('regSenha').value;
      const confirmaSenha = document.getElementById('regConfirmaSenha').value;

      const roles = Array.from(document.querySelectorAll('input[name="regRole"]:checked')).map(el => el.value);

      // Validações
      if (!sexo) {
        errorMsg.textContent = 'Por favor, selecione seu sexo.';
        errorMsg.classList.add('show');
        return;
      }

      if (roles.length === 0) {
        errorMsg.textContent = 'Escolha pelo menos uma forma como você vai se mover (Motorista, Passageiro ou Ciclista).';
        errorMsg.classList.add('show');
        return;
      }

      if (senha.length < 6) {
        errorMsg.textContent = 'A senha deve conter pelo menos 6 caracteres.';
        errorMsg.classList.add('show');
        return;
      }

      if (senha !== confirmaSenha) {
        errorMsg.textContent = 'As senhas não conferem. Tente novamente.';
        errorMsg.classList.add('show');
        return;
      }

      const userData = {
        nome,
        email,
        cpf,
        telefone,
        idade,
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
        userData.cnh = document.getElementById('regCnh').value.trim();
        userData.vagas_padrao = document.getElementById('regVagas').value;
        userData.preco_medio = document.getElementById('regPrecoMedio').value;
        userData.tempo_espera_min = document.getElementById('regTempoEspera').value;
        userData.porta_malas_litros = document.getElementById('regPortaMalas').value || null;
        userData.preferencia_passageiros = document.getElementById('regPreferenciaPassageiros').value;
        userData.acessivel_cadeirante = document.getElementById('regAcessivel').checked;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Criando conta...';

      const res = await registerUser(userData);

      submitBtn.disabled = false;
      submitBtn.textContent = 'Finalizar cadastro';

      if (res.success) {
        errorMsg.classList.remove('show');
        showModal({
          title: 'Cadastro realizado com sucesso',
          message: `Bem-vindo(a) ao UniMove, ${nome.split(' ')[0]}! Seu perfil universitário já está ativo.`,
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