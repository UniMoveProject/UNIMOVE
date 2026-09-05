/**
 * Reusable Modal Dialog Component
 */

export function showModal({ title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, isDanger = false }) {
  const existing = document.getElementById('appModalOverlay');
  if (existing) existing.remove();

  const modalHtml = `
    <div class="modal-overlay active" id="appModalOverlay">
      <div class="modal-card">
        <h3 style="font-family:var(--font-subtitle); font-size:1.35rem; margin-bottom:0.75rem; color:var(--text-primary);">${title}</h3>
        <div style="font-size:1.05rem; color:var(--text-secondary); margin-bottom:1.5rem; line-height:1.5;">${message}</div>
        <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-sm btn-outline" id="modalCancelBtn">${cancelText}</button>
          <button type="button" class="btn btn-sm ${isDanger ? 'btn-outline' : 'btn-azul'}" id="modalConfirmBtn" style="${isDanger ? 'background-color:#d32f2f; color:#fff; border:none;' : ''}">
            ${confirmText}
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const overlay = document.getElementById('appModalOverlay');
  const cancelBtn = document.getElementById('modalCancelBtn');
  const confirmBtn = document.getElementById('modalConfirmBtn');

  function closeModal() {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 250);
  }

  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  confirmBtn.addEventListener('click', () => {
    if (onConfirm) onConfirm();
    closeModal();
  });
}
