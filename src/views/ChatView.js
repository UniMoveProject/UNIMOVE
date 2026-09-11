/**
 * Chat View
 * Real-time ride group conversation matching the Brand Manual guidelines.
 */

import { getRideById } from '../services/rides.js';
import { getChatMessages, sendMessage } from '../services/chat.js';
import { getCurrentUser } from '../services/auth.js';
import { showModal } from '../components/Modal.js';

export function renderChatView(rideId) {
  const user = getCurrentUser();
  const ride = getRideById(rideId);

  if (!ride) {
    return `
      <div class="card" style="text-align:center; padding:3rem 1.5rem; max-width:600px; margin:2rem auto;">
        <div style="font-size:2.5rem; margin-bottom:1rem;">🔍</div>
        <h1 class="page-title" style="font-size:1.8rem; margin-bottom:0.75rem;">CHAT NÃO ENCONTRADO</h1>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem;">
          Esta conversa não está disponível ou a carona foi encerrada.
        </p>
        <a href="#/busca" class="btn btn-azul">Ver caronas ativas</a>
      </div>
    `;
  }

  const messages = getChatMessages(rideId);

  return `
    <div style="max-width:820px; margin:0 auto;">
      
      <!-- Top Ride Summary Banner -->
      <div class="card" style="margin-bottom:1rem; padding:1rem 1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
        <div>
          <div style="font-family:var(--font-subtitle); font-size:0.95rem; color:var(--azul-unimove);">
            CHAT DA CARONA · ${ride.horarioSaida}
          </div>
          <div style="font-family:var(--font-subtitle); font-size:1.15rem; color:var(--text-primary);">
            ${ride.origem} ➔ ${ride.destino}
          </div>
          <div style="font-size:0.92rem; color:var(--text-muted);">
            Motorista: <strong>${ride.motoristaNome}</strong> · ${ride.veiculo} (${ride.placa})
          </div>
        </div>

        <div style="display:flex; gap:0.5rem; align-items:center;">
          <span class="badge badge-verde">${ride.vagasDisponiveis} vagas livres</span>
          <a href="#/busca" class="btn btn-sm btn-outline">Voltar</a>
        </div>
      </div>

      <!-- Chat Container -->
      <div class="chat-container">
        
        <!-- Messages Area -->
        <div class="chat-messages" id="chatMessagesArea">
          ${messages.length > 0 ? messages.map(msg => `
            <div class="chat-msg-row ${user && user.id === msg.senderId ? 'self' : ''}">
              <div class="user-avatar-circle chat-avatar" 
                   data-name="${msg.senderNome}" 
                   data-role="${msg.senderRole}" 
                   data-course="${msg.senderCourse || 'Estudante'}" 
                   data-rating="${msg.senderRating || '5.0'}"
                   style="cursor:pointer; flex-shrink:0; ${msg.senderAvatar ? `background-image:url('${msg.senderAvatar}')` : ''}">
                ${!msg.senderAvatar ? msg.senderNome.slice(0, 2).toUpperCase() : ''}
              </div>

              <div class="chat-bubble">
                <div style="font-family:var(--font-subtitle); font-size:0.85rem; opacity:0.85; margin-bottom:0.2rem;">
                  ${msg.senderNome} (${msg.senderRole})
                </div>
                <div class="chat-msg-text">${msg.text}</div>
                <span class="chat-time">${msg.time}</span>
              </div>
            </div>
          `).join('') : `
            <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
              <div style="font-size:2rem; margin-bottom:0.5rem;">💬</div>
              <p>Nenhuma mensagem enviada ainda.</p>
              <p style="font-size:0.95rem;">Envie uma mensagem para combinar o ponto de encontro com o grupo!</p>
            </div>
          `}
        </div>

        <!-- Chat Input Footer -->
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

export function attachChatEvents() {
  const form = document.getElementById('chatInputForm');
  const messagesArea = document.getElementById('chatMessagesArea');
  const input = document.getElementById('chatTextInput');

  if (messagesArea) {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  // Mini Profile on avatar click
  document.querySelectorAll('.chat-avatar').forEach(av => {
    av.addEventListener('click', () => {
      const name = av.dataset.name;
      const role = av.dataset.role;
      const course = av.dataset.course;
      const rating = av.dataset.rating;

      showModal({
        title: `👤 ${name}`,
        message: `
          <div style="display:flex; flex-direction:column; gap:0.4rem;">
            <div><strong>Função:</strong> ${role}</div>
            <div><strong>Curso:</strong> ${course}</div>
            <div><strong>Avaliação na comunidade:</strong> ⭐ ${rating}</div>
            <div style="margin-top:0.5rem; font-size:0.95rem; color:var(--verde-unimove); font-weight:bold;">
              ✓ Aluno verificado na instituição
            </div>
          </div>
        `,
        confirmText: 'Fechar',
        cancelText: '',
        onConfirm: () => {}
      });
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      const rideId = form.dataset.rideId;
      const user = getCurrentUser();

      if (!user) {
        window.location.hash = '#/login';
        return;
      }

      if (!text) return;

      const res = sendMessage(rideId, text);
      if (res.success) {
        input.value = '';
        const msg = res.message;
        const msgHtml = `
          <div class="chat-msg-row self">
            <div class="user-avatar-circle chat-avatar" 
                 data-name="${msg.senderNome}" 
                 data-role="${msg.senderRole}" 
                 data-course="${msg.senderCourse}" 
                 data-rating="${msg.senderRating}"
                 style="cursor:pointer; flex-shrink:0; ${msg.senderAvatar ? `background-image:url('${msg.senderAvatar}')` : ''}">
              ${!msg.senderAvatar ? msg.senderNome.slice(0, 2).toUpperCase() : ''}
            </div>

            <div class="chat-bubble">
              <div style="font-family:var(--font-subtitle); font-size:0.85rem; opacity:0.85; margin-bottom:0.2rem;">
                Você (${msg.senderRole})
              </div>
              <div class="chat-msg-text">${msg.text}</div>
              <span class="chat-time">${msg.time}</span>
            </div>
          </div>
        `;
        messagesArea.insertAdjacentHTML('beforeend', msgHtml);
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }
    });
  }
}