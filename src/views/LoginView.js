/**
 * Login View
 * University authentication screen with error feedback and demo credentials (No emojis).
 */

import { login } from '../services/auth.js';

export function renderLoginView() {
  return `
    <div style="max-width:460px; margin:2rem auto;">
      <div class="card" style="padding:2.25rem;">
        
        <div style="text-align:center; margin-bottom:1.75rem;">
          <img src="/logo.png" alt="UniMove Logo" style="width:54px; height:60px; object-fit:contain; margin-bottom:0.75rem;">
          <div style="font-family:var(--font-subtitle); font-size:0.95rem; color:var(--azul-unimove);">BEM-VINDO DE VOLTA</div>
          <h1 class="page-title" style="font-size:2.2rem; margin:0.35rem 0 0.5rem;">ENTRAR</h1>
          <p style="color:var(--text-secondary); font-size:1.05rem;">
            Acesse sua conta para continuar dividindo caronas com segurança.
          </p>
        </div>

        <div id="loginErrorMsg" class="form-error-msg" style="background-color:rgba(229,57,53,0.1); border:1px solid rgba(229,57,53,0.3); padding:0.65rem 1rem; border-radius:var(--radius-md); margin-bottom:1.25rem; text-align:center;">
          E-mail institucional ou senha incorretos.
        </div>

        <form id="loginForm" style="display:flex; flex-direction:column; gap:1.15rem;">
          
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="loginEmail">E-mail institucional</label>
            <input type="email" id="loginEmail" class="form-input" placeholder="seu.nome@uniceplac.edu.br" required>
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="loginSenha">Senha</label>
            <input type="password" id="loginSenha" class="form-input" placeholder="Digite sua senha" required>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.95rem;">
            <label style="display:flex; align-items:center; gap:0.4rem; cursor:pointer;">
              <input type="checkbox" checked> Lembrar de mim
            </label>
            <a href="javascript:void(0)" id="forgotPasswordBtn" style="color:var(--azul-unimove); font-family:var(--font-subtitle);">Esqueceu a senha?</a>
          </div>

          <button type="submit" class="btn btn-azul btn-block" style="margin-top:0.5rem;">
            Entrar no UniMove
          </button>
        </form>

        <div style="text-align:center; margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid var(--border-color); font-size:1rem; color:var(--text-secondary);">
          Ainda não tem conta? <a href="#/cadastro" style="color:var(--azul-unimove); font-family:var(--font-subtitle); font-weight:bold;">Cadastre-se</a>
        </div>

      </div>
    </div>
  `;
}

export function attachLoginEvents() {
  const form = document.getElementById('loginForm');
  const errorMsg = document.getElementById('loginErrorMsg');
  const forgotBtn = document.getElementById('forgotPasswordBtn');

  if (forgotBtn) {
    forgotBtn.addEventListener('click', () => {
      alert('Enviamos um link de redefinição para o seu e-mail institucional cadastrado.');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const senha = document.getElementById('loginSenha').value;

      const res = await login(email, senha);
      if (res.success) {
        errorMsg.classList.remove('show');
        window.location.hash = '#/home';
      } else {
        errorMsg.textContent = res.error;
        errorMsg.classList.add('show');
      }
    });
  }
}