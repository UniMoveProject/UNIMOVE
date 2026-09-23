/**
 * Complete Landing Page View
 * Professional collegiate layout strictly without emojis.
 */

export function renderLandingView() {
  return `
    <div style="display:flex; flex-direction:column; gap:4rem;">
      
      <!-- HERO SECTION -->
      <section style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:2.5rem; align-items:center; padding:1.5rem 0 2rem;">
        
        <!-- Left Hero Text -->
        <div>
          <div style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(15,93,237,0.1); color:var(--azul-unimove); padding:0.35rem 0.95rem; border-radius:var(--radius-full); font-family:var(--font-subtitle); font-size:0.9rem; margin-bottom:1.25rem;">
            Exclusivo para estudantes UNICEPLAC
          </div>

          <h1 class="hero-title" style="font-size:clamp(2.2rem, 5vw, 3.4rem); margin-bottom:1.15rem; color:var(--text-primary); line-height:1.05;">
            CARONAS SOLIDÁRIAS ENTRE ESTUDANTES
          </h1>

          <p style="font-size:1.25rem; color:var(--text-secondary); margin-bottom:2rem; line-height:1.5;">
            A rota até a faculdade dividida com quem já faz o mesmo caminho. Menos carro andando vazio, menos gente esperando ônibus lotado e mais amizade no trajeto.
          </p>

          <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:2rem;">
            <a href="#/login" class="btn btn-lg btn-azul">Entrar na plataforma</a>
            <a href="#/cadastro" class="btn btn-lg btn-amarelo">Criar conta</a>
            <button type="button" id="btnScrollCalc" class="btn btn-lg btn-outline">Simular economia</button>
          </div>

          <div style="display:flex; gap:2rem; font-family:var(--font-subtitle); font-size:0.95rem; color:var(--text-muted); flex-wrap:wrap;">
            <span>100% Universitário</span>
            <span>E-mail institucional</span>
            <span>Avaliação mútua</span>
          </div>
        </div>

        <!-- Right Hero Visual -->
        <div style="position:relative;">
          <div class="card" style="background:var(--preto-unimove); color:var(--bege-unimove); border:2px solid var(--amarelo-unimove); padding:2rem; border-radius:24px; position:relative; overflow:hidden; box-shadow:var(--shadow-lg);">
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
              <div style="display:flex; align-items:center; gap:0.65rem;">
                <img src="/logo.png" alt="UniMove Logo" style="width:32px; height:36px; object-fit:contain;">
                <span class="badge badge-amarelo">Rota ativa hoje</span>
              </div>
              <span class="time-tag" style="font-family:var(--font-subtitle); font-size:1.15rem; color:var(--bege-unimove);">07:40</span>
            </div>

            <!-- Route Nodes -->
            <div style="display:flex; flex-direction:column; gap:1.25rem; position:relative; margin-bottom:1.5rem; padding-left:1.5rem; border-left:3px dashed var(--azul-unimove);">
              <div>
                <span style="font-size:0.85rem; color:var(--amarelo-unimove); font-family:var(--font-subtitle);">EMBARQUE</span>
                <div style="font-family:var(--font-subtitle); font-size:1.2rem; color:#fff;">Setor Bela Vista · Valparaíso</div>
                <div style="font-size:0.9rem; opacity:0.8;">Terminal Jardim ABC</div>
              </div>

              <div>
                <span style="font-size:0.85rem; color:var(--verde-unimove); font-family:var(--font-subtitle);">DESTINO</span>
                <div style="font-family:var(--font-subtitle); font-size:1.2rem; color:#fff;">Campus UNICEPLAC · Gama</div>
                <div style="font-size:0.9rem; opacity:0.8;">Chegada prevista: 08:15</div>
              </div>
            </div>

            <!-- Driver Mini pill -->
            <div style="background:rgba(255,255,255,0.08); padding:0.85rem 1rem; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:0.65rem;">
                <div style="width:36px; height:36px; border-radius:50%; background-color:var(--azul-unimove); color:#fff; display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle);">RA</div>
                <div>
                  <div style="font-family:var(--font-subtitle); font-size:0.95rem; color:#fff;">Rhian Almeida</div>
                  <div style="font-size:0.8rem; opacity:0.75;">Administração · 4º período</div>
                </div>
              </div>
              <span class="badge badge-verde">2 vagas</span>
            </div>

          </div>
        </div>

      </section>

      <!-- MARQUEE STRIP -->
      <div class="marquee-strip">
        <div class="marquee-content">
          <span>100% SEGURO & UNIVERSITÁRIO</span>
          <span>·</span>
          <span>EXCLUSIVO UNICEPLAC</span>
          <span>·</span>
          <span>MENOS TRÂNSITO NO GAMA</span>
          <span>·</span>
          <span>DIVIDA O COMBUSTÍVEL</span>
          <span>·</span>
          <span>EMBARQUE COM CONFIANÇA</span>
          <span>·</span>
          <span>100% SEGURO & UNIVERSITÁRIO</span>
          <span>·</span>
          <span>EXCLUSIVO UNICEPLAC</span>
          <span>·</span>
          <span>MENOS TRÂNSITO NO GAMA</span>
        </div>
      </div>

      <!-- KEY STATS -->
      <section style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.5rem;">
        <div class="card" style="background-color:var(--preto-unimove); color:var(--bege-unimove); text-align:center; padding:2rem 1.5rem;">
          <div class="stat-number" style="font-family:var(--font-subtitle); font-size:2.8rem; color:var(--amarelo-unimove); margin-bottom:0.5rem;">1.240+</div>
          <div class="stat-title" style="font-family:var(--font-subtitle); font-size:1.15rem;">caronas rodadas</div>
        </div>

        <div class="card" style="background-color:var(--azul-unimove); color:#FFFFFF; text-align:center; padding:2rem 1.5rem;">
          <div class="stat-number" style="font-family:var(--font-subtitle); font-size:2.8rem; color:var(--bege-unimove); margin-bottom:0.5rem;">R$ 38K</div>
          <div class="stat-title" style="font-family:var(--font-subtitle); font-size:1.15rem;">economizados pela comunidade</div>
        </div>

        <div class="card" style="background-color:var(--verde-unimove); color:var(--preto-unimove); text-align:center; padding:2rem 1.5rem;">
          <div class="stat-number" style="font-family:var(--font-subtitle); font-size:2.8rem; color:var(--preto-unimove); margin-bottom:0.5rem;">4,8 / 5.0</div>
          <div class="stat-title" style="font-family:var(--font-subtitle); font-size:1.15rem;">avaliação média das caronas</div>
        </div>
      </section>

      <!-- COMO FUNCIONA -->
      <section id="como-funciona" class="card" style="padding:2.5rem 2rem;">
        <div style="text-align:center; max-width:650px; margin:0 auto 2.5rem;">
          <span style="font-family:var(--font-subtitle); font-size:0.95rem; color:var(--azul-unimove);">PRATICIDADE</span>
          <h2 class="section-title" style="font-size:2rem; margin-top:0.35rem;">Como funciona, em três paradas</h2>
          <p style="color:var(--text-secondary); font-size:1.15rem;">Simples de usar, barato de manter e seguro de confiar.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:2rem;">
          <div class="card" style="background-color:var(--bg-primary); border-top:4px solid var(--azul-unimove);">
            <div style="width:44px; height:44px; border-radius:50%; background-color:var(--azul-unimove); color:#FFF; display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:1.3rem; margin-bottom:1rem;">1</div>
            <h3 style="font-family:var(--font-subtitle); font-size:1.3rem; margin-bottom:0.5rem;">1. Conte sua rota</h3>
            <p style="color:var(--text-secondary); font-size:1.05rem;">Cadastre seu ponto de saída, horário das aulas e destino no campus UNICEPLAC.</p>
          </div>

          <div class="card" style="background-color:var(--bg-primary); border-top:4px solid var(--amarelo-unimove);">
            <div style="width:44px; height:44px; border-radius:50%; background-color:var(--amarelo-unimove); color:var(--preto-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:1.3rem; margin-bottom:1rem;">2</div>
            <h3 style="font-family:var(--font-subtitle); font-size:1.3rem; margin-bottom:0.5rem;">2. Encontre ou ofereça</h3>
            <p style="color:var(--text-secondary); font-size:1.05rem;">Descubra colegas que fazem o mesmo caminho ou abra as vagas livres do seu carro.</p>
          </div>

          <div class="card" style="background-color:var(--bg-primary); border-top:4px solid var(--verde-unimove);">
            <div style="width:44px; height:44px; border-radius:50%; background-color:var(--verde-unimove); color:var(--preto-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:1.3rem; margin-bottom:1rem;">3</div>
            <h3 style="font-family:var(--font-subtitle); font-size:1.3rem; margin-bottom:0.5rem;">3. Embarque com confiança</h3>
            <p style="color:var(--text-secondary); font-size:1.05rem;">Combine os detalhes no chat do grupo com alunos verificados da própria universidade.</p>
          </div>
        </div>
      </section>

      <!-- CALCULADORA DE ECONOMIA -->
      <section id="calculadora" class="card" style="padding:2.5rem 2rem; border-left:6px solid var(--verde-unimove);">
        <div style="max-width:680px; margin:0 auto; text-align:center;">
          <span class="badge badge-verde" style="margin-bottom:0.75rem;">Simulação Financeira</span>
          <h2 class="section-title" style="font-size:2rem; margin-bottom:0.5rem;">Calculadora de Economia</h2>
          <p style="color:var(--text-secondary); font-size:1.15rem; margin-bottom:2rem;">
            Veja quanto você pode economizar por semestre dividindo caronas no UniMove em vez de usar transporte individual ou ônibus caros.
          </p>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1.25rem; text-align:left; margin-bottom:2rem;">
            <div>
              <label class="form-label" for="calcGasto">Gasto diário estimado (R$)</label>
              <input type="number" id="calcGasto" class="form-input" value="18.00" min="1" step="1">
            </div>

            <div>
              <label class="form-label" for="calcDias">Dias de aula por semana</label>
              <input type="number" id="calcDias" class="form-input" value="5" min="1" max="7">
            </div>

            <div>
              <label class="form-label" for="calcSemanas">Semanas no semestre</label>
              <input type="number" id="calcSemanas" class="form-input" value="18" min="1" max="24">
            </div>
          </div>

          <div class="card" style="background:var(--preto-unimove); color:var(--bege-unimove); padding:1.5rem; text-align:center; border:2px solid var(--verde-unimove); margin-bottom:1.5rem;">
            <div style="font-size:1.05rem; opacity:0.85; margin-bottom:0.35rem;">Economia total estimada no semestre:</div>
            <div id="calcResultado" style="font-family:var(--font-subtitle); font-size:3rem; color:var(--verde-unimove);">
              R$ 1.620,00
            </div>
          </div>

          <a href="#/cadastro" class="btn btn-lg btn-verde">Começar a economizar agora</a>
        </div>
      </section>

      <!-- 5 SENTIMENTOS DA MARCA -->
      <section id="vantagens">
        <div style="text-align:center; margin-bottom:2.25rem;">
          <h2 class="section-title" style="font-size:2rem; margin-bottom:0.5rem;">Cinco sentimentos que guiam o UniMove</h2>
          <p style="color:var(--text-secondary); font-size:1.15rem;">Tudo construído para reforçar segurança e conexão entre alunos.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.25rem;">
          <div class="card" style="border-top:4px solid var(--azul-unimove);">
            <h3 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:0.35rem; color:var(--azul-unimove);">Segurança</h3>
            <p style="font-size:1rem; color:var(--text-secondary);">Perfil universitário verificado e avaliação em dois sentidos.</p>
          </div>

          <div class="card" style="border-top:4px solid var(--verde-unimove);">
            <h3 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:0.35rem; color:var(--verde-unimove);">Economia</h3>
            <p style="font-size:1rem; color:var(--text-secondary);">Dividir combustível custa menos que ônibus ou corridas por app.</p>
          </div>

          <div class="card" style="border-top:4px solid var(--amarelo-unimove);">
            <h3 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:0.35rem; color:var(--text-primary);">Amizade</h3>
            <p style="font-size:1rem; color:var(--text-secondary);">Colegas da mesma universidade compartilhando a rotina diária.</p>
          </div>

          <div class="card" style="border-top:4px solid var(--azul-unimove);">
            <h3 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:0.35rem; color:var(--azul-unimove);">Praticidade</h3>
            <p style="font-size:1rem; color:var(--text-secondary);">Cadastrar a rota, encontrar e embarcar leva minutos.</p>
          </div>

          <div class="card" style="border-top:4px solid var(--verde-unimove);">
            <h3 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:0.35rem; color:var(--verde-unimove);">Liberdade</h3>
            <p style="font-size:1rem; color:var(--text-secondary);">Cada estudante escolhe sua rota, horário e com quem viaja.</p>
          </div>
        </div>
      </section>

      <!-- FAQ ACCORDION -->
      <section id="faq" class="card" style="padding:2.5rem 2rem;">
        <div style="text-align:center; max-width:650px; margin:0 auto 2rem;">
          <span style="font-family:var(--font-subtitle); font-size:0.95rem; color:var(--azul-unimove);">TIRA-DÚVIDAS</span>
          <h2 class="section-title" style="font-size:2rem; margin-top:0.35rem;">Perguntas Frequentes</h2>
          <p style="color:var(--text-secondary); font-size:1.15rem;">Entenda como o UniMove funciona na prática.</p>
        </div>

        <div class="faq-list">
          <div class="faq-item">
            <button type="button" class="faq-q">
              <span>O UniMove é realmente exclusivo para estudantes da Uniceplac?</span>
              <span class="plus-icon">+</span>
            </button>
            <div class="faq-a">
              <p>Sim. Para se cadastrar e ter acesso às caronas, é obrigatório possuir e validar um e-mail institucional (@uniceplac.edu.br), garantindo que todos os participantes sejam alunos da instituição.</p>
            </div>
          </div>

          <div class="faq-item">
            <button type="button" class="faq-q">
              <span>É cobrado algum valor pelas caronas?</span>
              <span class="plus-icon">+</span>
            </button>
            <div class="faq-a">
              <p>O UniMove é uma plataforma solidária e colaborativa. Os motoristas podem definir apenas uma ajuda de custo simbólica voluntária para rateio de combustível, sem qualquer cobrança comercial.</p>
            </div>
          </div>

          <div class="faq-item">
            <button type="button" class="faq-q">
              <span>Como é garantida a segurança dos trajetos?</span>
              <span class="plus-icon">+</span>
            </button>
            <div class="faq-a">
              <p>Além da validação acadêmica obrigatória, todos os motoristas e passageiros possuem histórico com avaliação por notas, detalhes de curso/semestre e chat do grupo antes do embarque.</p>
            </div>
          </div>

          <div class="faq-item">
            <button type="button" class="faq-q">
              <span>Posso ser passageiro e motorista na mesma conta?</span>
              <span class="plus-icon">+</span>
            </button>
            <div class="faq-a">
              <p>Sim. No seu perfil você pode alternar livremente entre oferecer carona quando estiver de carro ou pedir carona nos dias em que precisar.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="card" style="background:var(--preto-unimove); color:var(--bege-unimove); text-align:center; padding:3.5rem 1.5rem; border:2px solid var(--azul-unimove);">
        <h2 style="font-family:var(--font-subtitle); font-size:clamp(1.8rem, 4vw, 2.5rem); margin-bottom:1rem; color:#fff;">
          Sua rota, dividida com confiança
        </h2>
        <p style="color:var(--bege-unimove); font-size:1.25rem; max-width:620px; margin:0 auto 2rem; opacity:0.9;">
          Cadastre-se hoje mesmo e comece a rodar junto com seus colegas de faculdade.
        </p>
        <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
          <a href="#/cadastro" class="btn btn-lg btn-amarelo">Criar minha conta gratuita</a>
          <a href="#/login" class="btn btn-lg btn-azul">Já tenho conta (Entrar)</a>
        </div>
      </section>

    </div>
  `;
}

export function attachLandingEvents() {
  const scrollCalcBtn = document.getElementById('btnScrollCalc');
  if (scrollCalcBtn) {
    scrollCalcBtn.addEventListener('click', () => {
      const calcEl = document.getElementById('calculadora');
      if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const calcGasto = document.getElementById('calcGasto');
  const calcDias = document.getElementById('calcDias');
  const calcSemanas = document.getElementById('calcSemanas');
  const calcResultado = document.getElementById('calcResultado');

  function calculate() {
    const gasto = parseFloat(calcGasto.value) || 0;
    const dias = parseFloat(calcDias.value) || 0;
    const semanas = parseFloat(calcSemanas.value) || 0;
    const total = gasto * dias * semanas;
    calcResultado.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  if (calcGasto && calcDias && calcSemanas) {
    [calcGasto, calcDias, calcSemanas].forEach(el => el.addEventListener('input', calculate));
  }

  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherAns = other.querySelector('.faq-a');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      item.classList.toggle('open');
      const ans = item.querySelector('.faq-a');
      if (ans) {
        if (!isOpen) {
          ans.style.maxHeight = ans.scrollHeight + 30 + 'px';
        } else {
          ans.style.maxHeight = null;
        }
      }
    });
  });
}