/**
 * Economy Card Component (Item 13)
 * Displays dynamic university ride-sharing savings comparison:
 * 1. Valor da passagem de ônibus (R$ 5,50)
 * 2. Valor da carona solidária (até R$ 6,00)
 * 3. Economia gerada (por viagem e projeção mensal)
 */

import { calculateEconomyData } from '../services/rides.js';

export function renderEconomyCard(specificRidePrice = null, isCompact = false) {
  const data = calculateEconomyData(specificRidePrice);

  if (isCompact) {
    return `
      <div class="economy-badge" style="display:inline-flex; align-items:center; gap:0.5rem; background:#ecfdf5; border:1px solid #a7f3d0; padding:0.35rem 0.65rem; border-radius:var(--radius-md); font-size:0.85rem; color:#065f46;">
        <span style="font-weight:bold;">💰 Economia:</span>
        <span>R$ ${data.economiaPorViagem.toFixed(2)} vs ônibus (R$ ${data.tarifaOnibus.toFixed(2)})</span>
      </div>
    `;
  }

  return `
    <div class="card economy-panel" style="background:linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%); border:1px solid #bbf7d0; padding:1.5rem; margin-bottom:1.5rem; border-radius:var(--radius-lg, 16px); position:relative; overflow:hidden;">
      
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.25rem;">
        <div>
          <span style="font-family:var(--font-subtitle); font-size:0.8rem; font-weight:700; color:#15803d; letter-spacing:0.05em; text-transform:uppercase;">
            PAINEL DE ECONOMIA SOLIDÁRIA
          </span>
          <h3 style="font-family:var(--font-subtitle); font-size:1.35rem; margin:0.2rem 0 0; color:var(--text-primary);">
            Quanto você economiza dividindo a carona
          </h3>
        </div>
        <span class="badge" style="background:#dcfce7; color:#15803d; font-size:0.85rem; padding:0.4rem 0.8rem; font-weight:700;">
          Teto solidário: até R$ 6,00
        </span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
        
        <!-- 1. Valor da passagem de ônibus -->
        <div style="background:#ffffff; padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); text-align:center;">
          <div style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:0.25rem;">
            🚌 Passagem de Ônibus
          </div>
          <div style="font-size:1.45rem; font-weight:700; color:#dc2626;">
            R$ ${data.tarifaOnibus.toFixed(2)}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">
            Tarifa pública média (DF/Entorno)
          </div>
        </div>

        <!-- 2. Valor da carona UniMove -->
        <div style="background:#ffffff; padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); text-align:center;">
          <div style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:0.25rem;">
            🚗 Carona UniMove
          </div>
          <div style="font-size:1.45rem; font-weight:700; color:var(--azul-unimove);">
            R$ ${data.valorCarona.toFixed(2)}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">
            ${specificRidePrice !== null ? 'Valor desta carona' : 'Média das caronas ativas'}
          </div>
        </div>

        <!-- 3. Economia calculada -->
        <div style="background:#ecfdf5; padding:1rem; border-radius:var(--radius-md); border:1px solid #86efac; text-align:center;">
          <div style="font-size:0.8rem; color:#15803d; text-transform:uppercase; font-weight:600; margin-bottom:0.25rem;">
            ✨ Sua Economia
          </div>
          <div style="font-size:1.45rem; font-weight:800; color:#16a34a;">
            R$ ${data.economiaPorViagem.toFixed(2)} <span style="font-size:0.85rem; font-weight:normal;">/ viagem</span>
          </div>
          <div style="font-size:0.78rem; color:#166534; font-weight:600; margin-top:0.25rem;">
            Até R$ ${data.economiaMensal.toFixed(2)}/mês economizados
          </div>
        </div>

      </div>

      <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:1rem; text-align:center;">
        * Estimativa baseada em 20 dias letivos (40 viagens/mês) no trajeto universitário, sem baldeações e com embarque rápido.
      </div>

    </div>
  `;
}
