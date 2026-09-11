/**
 * Register View
 * Student onboarding form with input validation, masks and photo upload preview.
 */

import { registerUser } from '../services/auth.js';
import { showModal } from '../components/Modal.js';

export function renderRegisterView() {
  return `
    <div style="max-width:680px; margin:2rem auto;">
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

        <form id="registerForm" style="display:flex; flex-direction:column; gap:1.25rem;">
          
          <!-- Avatar Preview & Upload -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;">
            <div id="regAvatarPreview" style="width:84px; height:84px; border-radius:50%; background-color:var(--bg-primary); border:2px dashed var(--azul-unimove); display:flex; align-items:center; justify-content:center; font-size:2rem; cursor:pointer; background-size:cover; background-position:center;">
              📷
            </div>
            <label for="regAvatarInput" style="font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove); cursor:pointer;">
              Adicionar foto de perfil
            </label>
            <input type="file" id="regAvatarInput" accept="image/*" style="display:none;">
          </div>

          <!-- Basic Data -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="regNome">Nome completo *</label>
              <input type="text" id="regNome" class="form-input" placeholder="Ex: Rhian Almeida" required>
            </div>

            <div class="form-group" style="margin:0;">
              <label class="form-label" for="regEmail">E-mail institucional *</label>
              <input type="email" id="regEmail" class="form-input" placeholder="aluno@uniceplac.edu.br" required>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:1.25rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="regCpf">CPF *</label>
              <input type="text" id="regCpf" class="form-input" placeholder="000.000.000-00" maxlength="14" required>
            </div>

            <div class="form-group" style="margin:0;">
              <label class="form-label" for="regTelefone">Telefone / WhatsApp *</label>
              <input type="tel" id="regTelefone" class="form-input" placeholder="(61) 90000-0000" maxlength="15" required>
            </div>

            <div class="form-group" style="margin:0;">
              <label class="form-label" for="regIdade">Idade *</label>
              <input type="number" id="regIdade" class="form-input" min="16" max="100" placeholder="Ex: 21" required>
            </div>
          </div>

          <!-- Academic Data -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.25rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="regCurso">Curso</label>
              <input type="text" id="regCurso" class="form-input" placeholder="Ex: Administração, Direito..." value="Administração">
            </div>

            <div class="form-group" style="margin:0;">
              <label class="form-label" for="regCampus">Campus</label>
              <input type="text" id="regCampus" class="form-input" placeholder="Ex: Campus UNICEPLAC" value="Campus UNICEPLAC">
            </div>
          </div>

          <!-- Passwords -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.25rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="regSenha">Senha de acesso *</label>
              <input type="password" id="regSenha" class="form-input" placeholder="Mínimo 8 caracteres" required>
            </div>

            <div class="form-group" style="margin:0;">
              <label class="form-label" for="regConfirmaSenha">Confirmar senha *</label>
              <input type="password" id="regConfirmaSenha" class="form-input" placeholder="Repita a senha" required>
            </div>
          </div>

          <!-- Mobility Roles -->
          <div class="form-group" style="margin:0;">
            <label class="form-label">Como você pretende se mover no UniMove? (pode marcar mais de uma)</label>
            <div class="pill-selector">
              <label class="pill-option">
                <input type="checkbox" name="regRole" value="motorista">
                <span class="pill-label">🚗 Motorista</span>
              </label>
              <label class="pill-option">
                <input type="checkbox" name="regRole" value="passageiro" checked>
                <span class="pill-label">🎒 Passageiro</span>
              </label>
              <label class="pill-option">
                <input type="checkbox" name="regRole" value="ciclista">
                <span class="pill-label">🚲 Ciclista</span>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-azul btn-block" style="margin-top:0.75rem;">
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
  const cpfInput = document.getElementById('regCpf');
  const telInput = document.getElementById('regTelefone');

  let avatarDataUrl = '';

  // Photo preview
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

  // CPF Mask
  cpfInput.addEventListener('input', () => {
    let v = cpfInput.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpfInput.value = v;
  });

  // Telefone Mask
  telInput.addEventListener('input', () => {
    let v = telInput.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    else if (v.length > 0) v = v.replace(/(\d{0,2})/, '($1');
    telInput.value = v;
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.getElementById('regNome').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const cpf = cpfInput.value.trim();
      const telefone = telInput.value.trim();
      const idade = document.getElementById('regIdade').value;
      const curso = document.getElementById('regCurso').value.trim();
      const campus = document.getElementById('regCampus').value.trim();
      const senha = document.getElementById('regSenha').value;
      const confirmaSenha = document.getElementById('regConfirmaSenha').value;

      const roles = Array.from(document.querySelectorAll('input[name="regRole"]:checked')).map(el => el.value);

      if (roles.length === 0) {
        errorMsg.textContent = '⚠ Escolha pelo menos uma forma como você vai se mover (Motorista, Passageiro ou Ciclista).';
        errorMsg.classList.add('show');
        return;
      }

      if (senha.length < 6) {
        errorMsg.textContent = '⚠ A senha deve conter pelo menos 6 caracteres.';
        errorMsg.classList.add('show');
        return;
      }

      if (senha !== confirmaSenha) {
        errorMsg.textContent = '⚠ As senhas não conferem. Tente novamente.';
        errorMsg.classList.add('show');
        return;
      }

      const res = registerUser({
        nome,
        email,
        cpf,
        telefone,
        idade,
        curso,
        campus,
        senha,
        roles,
        avatar: avatarDataUrl
      });

      if (res.success) {
        errorMsg.classList.remove('show');
        showModal({
          title: '🎉 Cadastro realizado com sucesso!',
          message: `Bem-vindo(a) ao UniMove, ${nome.split(' ')[0]}! Seu perfil universitário já está ativo.`,
          confirmText: 'Acessar o aplicativo',
          cancelText: '',
          onConfirm: () => {
            window.location.hash = '#/home';
          }
        });
      } else {
        errorMsg.textContent = `⚠ ${res.error}`;
        errorMsg.classList.add('show');
      }
    });
  }
}