/**
 * Chat View
 * Real-time ride group conversation with passenger list.
 */

import { getRideWithPassengers } from '../services/rides.js';
import { getChatMessages, sendMessage } from '../services/chat.js';
import { getCurrentUser } from '../services/auth.js';
import { showModal } from '../components/Modal.js';

export function renderChatView(rideId) {
  // Render a loading skeleton — data is loaded async in attachChatEvents
  return `
    <div style="max-width:860px; margin:0 auto;" id="chatRoot" data-ride-id="${rideId}">
      <div style="text-align:center; padding:4rem; color:var(--text-secondary);">
        Carregando chat da carona...
      </div>
    </div>
  `;
}

function buildChatHTML(ride, messages, user) {
  if (!ride) {
    return `
      <div class="card" style="text-align:center; padding:3rem 1.5rem; max-width:600px; margin:2rem auto;">
        <h1 class="page-title" style="font-size:1.8rem; margin-bottom:0.75rem;">CHAT NÃO ENCONTRADO</h1>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem;">
          Esta conversa não está disponível ou a carona foi encerrada.
        </p>
        <a href="#/busca" class="btn btn-azul">Ver caronas ativas</a>
      </div>
    `;
  }

  const vagasOcupadas = ride.vagasOcupadas ?? (ride.vagasTotais - ride.vagasDisponiveis);
  const vagasPct = ride.vagasTotais > 0 ? Math.round((vagasOcupadas / ride.vagasTotais) * 100) : 0;

  // Build passenger avatars
  const passageirosHTML = (ride.passageiros || []).map(p => {
    const initials = (p.nome || 'U').slice(0, 2).toUpperCase();
    const avatarStyle = p.avatar_url
      ? `background-image:url('${p.avatar_url}'); background-size:cover; background-position:center;`
      : `background-color:var(--azul-unimove);`;
    return `
      <div title="${p.nome}" style="width:36px; height:36px; border-radius:50%; ${avatarStyle} display:inline-flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:0.75rem; color:#fff; border:2px solid var(--bg-card); flex-shrink:0;">
        ${!p.avatar_url ? initials : ''}
      </div>
    `;
  }).join('');

  const nenhum = ride.passageiros && ride.passageiros.length === 0;

  return `
    <div style="display:flex; flex-direction:column; gap:1rem;">

      <!-- ── Banner da Carona ─────────────────────────── -->
      <div class="card" style="padding:1.25rem 1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-family:var(--font-subtitle); font-size:0.9rem; color:var(--azul-unimove); margin-bottom:0.2rem;">
              CHAT DA CARONA · ${ride.horarioSaida || ''}
            </div>
            <div style="font-family:var(--font-subtitle); font-size:1.2rem; color:var(--text-primary); margin-bottom:0.2rem;">
              ${ride.origem} → ${ride.destino}
            </div>
            <div style="font-size:0.9rem; color:var(--text-muted);">
              Motorista: <strong>${ride.motoristaNome}</strong>
              ${ride.veiculo ? ` · ${ride.veiculo}` : ''}
              ${ride.placa ? ` (${ride.placa})` : ''}
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
            <span class="badge ${ride.vagasDisponiveis > 0 ? 'badge-verde' : 'badge-soft'}">${ride.vagasDisponiveis} vaga${ride.vagasDisponiveis !== 1 ? 's' : ''} livre${ride.vagasDisponiveis !== 1 ? 's' : ''}</span>
            <a href="#/busca" class="btn btn-sm btn-outline">Voltar</a>
          </div>
        </div>

        <!-- ── Barra de Vagas ─────────────────────────── -->
        <div style="margin-top:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span style="font-family:var(--font-subtitle); font-size:0.85rem; color:var(--text-secondary);">
              Ocupação: ${vagasOcupadas} de ${ride.vagasTotais} vagas
            </span>
            <span style="font-family:var(--font-subtitle); font-size:0.85rem; color:var(--azul-unimove);">${vagasPct}%</span>
          </div>
          <div style="width:100%; height:8px; background:var(--bg-primary); border-radius:99px; overflow:hidden;">
            <div style="height:100%; width:${vagasPct}%; background:var(--azul-unimove); border-radius:99px; transition:width 0.4s ease;"></div>
          </div>
        </div>

        <!-- ── Passageiros Confirmados ────────────────── -->
        <div style="margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--border-color);">
          <div style="font-family:var(--font-subtitle); font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.5rem;">
            PASSAGEIROS CONFIRMADOS (${ride.passageiros ? ride.passageiros.length : 0})
          </div>
          ${nenhum
            ? `<p style="font-size:0.9rem; color:var(--text-muted);">Nenhum passageiro confirmado ainda. Seja o primeiro!</p>`
            : `<div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">${passageirosHTML}</div>`
          }
        </div>
      </div>

      <!-- ── Container do Chat ──────────────────────── -->
      <div class="chat-container">
        
        <!-- Messages Area -->
        <div class="chat-messages" id="chatMessagesArea">
          ${messages.length > 0 ? messages.map(msg => buildMessageHTML(msg, user)).join('') : `
            <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
              <p>Nenhuma mensagem ainda.</p>
              <p style="font-size:0.95rem;">Envie uma mensagem para combinar o ponto de encontro com o grupo.</p>
            </div>
          `}
        </div>

        <!-- Input Footer -->
        <form class="chat-footer" id="chatInputForm" data-ride-id="${ride.id}">
          <input type="text" id="chatTextInput" class="form-input" placeholder="Escreva uma mensagem para o grupo..." autocomplete="off" required>
          <button type="submit" class="btn btn-azul" style="padding:0.75rem 1.5rem;">
            Enviar
          </button>
        </form>

      </div>
    </div>
  `;
}

function buildMessageHTML(msg, user) {
  const isSelf = user && user.id === msg.senderId;
  const avatarStyle = msg.senderAvatar
    ? `background-image:url('${msg.senderAvatar}'); background-size:cover; background-position:center;`
    : '';
  const initials = (msg.senderNome || 'U').slice(0, 2).toUpperCase();

  return `
    <div class="chat-msg-row ${isSelf ? 'self' : ''}">
      <div class="user-avatar-circle chat-avatar"
           data-name="${msg.senderNome}"
           data-role="${msg.senderRole}"
           data-course="${msg.senderCourse || 'Estudante'}"
           data-rating="${msg.senderRating || '5.0'}"
           style="cursor:pointer; flex-shrink:0; ${avatarStyle}">
        ${!msg.senderAvatar ? initials : ''}
      </div>
      <div class="chat-bubble">
        <div style="font-family:var(--font-subtitle); font-size:0.85rem; opacity:0.85; margin-bottom:0.2rem;">
          ${isSelf ? 'Você' : msg.senderNome} (${msg.senderRole})
        </div>
        <div class="chat-msg-text">${msg.text}</div>
        <span class="chat-time">${msg.time}</span>
      </div>
    </div>
  `;
}

export async function attachChatEvents() {
  const root = document.getElementById('chatRoot');
  if (!root) return;

  const rideId = root.dataset.rideId;
  const user = getCurrentUser();

  // Load ride and messages in parallel
  const [ride, messages] = await Promise.all([
    getRideWithPassengers(rideId),
    getChatMessages(rideId),
  ]);

  // Render everything
  root.innerHTML = buildChatHTML(ride, messages, user);

  const form = document.getElementById('chatInputForm');
  const messagesArea = document.getElementById('chatMessagesArea');
  const input = document.getElementById('chatTextInput');

  // Scroll to bottom
  if (messagesArea) messagesArea.scrollTop = messagesArea.scrollHeight;

  // Avatar click — mini profile popup
  attachAvatarEvents();

  // Send message
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      if (!user) {
        window.location.hash = '#/login';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      const res = await sendMessage(rideId, text);

      submitBtn.disabled = false;

      if (res.success && res.message) {
        input.value = '';
        const msgHtml = buildMessageHTML(res.message, user);
        messagesArea.insertAdjacentHTML('beforeend', msgHtml);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        // Re-attach avatar events for new bubble
        attachAvatarEvents();
      } else if (res.error) {
        console.error('Erro ao enviar mensagem:', res.error);
      }
    });
  }
}

function attachAvatarEvents() {
  document.querySelectorAll('.chat-avatar').forEach(av => {
    // Remove previous listener by cloning
    const clone = av.cloneNode(true);
    av.parentNode.replaceChild(clone, av);
    clone.addEventListener('click', () => {
      showModal({
        title: `Perfil de ${clone.dataset.name}`,
        message: `
          <div style="display:flex; flex-direction:column; gap:0.4rem;">
            <div><strong>Função:</strong> ${clone.dataset.role}</div>
            <div><strong>Curso:</strong> ${clone.dataset.course}</div>
            <div><strong>Avaliação:</strong> Nota ${clone.dataset.rating}</div>
            <div style="margin-top:0.5rem; font-size:0.95rem; color:var(--verde-unimove); font-weight:bold;">
              Aluno verificado na instituição
            </div>
          </div>
        `,
        confirmText: 'Fechar',
        cancelText: '',
        onConfirm: () => {}
      });
    });
  });
}