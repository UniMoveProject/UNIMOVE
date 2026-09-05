/**
 * Landing Page View
 * Institutional presentation directly matching the Brand Manual (pages 1-5).
 */

export function renderLandingView() {
  return `
    <div style="display:flex; flex-direction:column; gap:3.5rem;">
      
      <!-- Hero Section -->
      <section style="text-align:center; padding:3rem 1rem 2rem; max-width:850px; margin:0 auto;">
        <div style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(15,93,237,0.1); color:var(--azul-unimove); padding:0.4rem 1rem; border-radius:var(--radius-full); font-family:var(--font-subtitle); font-size:0.95rem; margin-bottom:1.5rem;">
          ?? Mobilidade Acadêmica & Carona Solidária
        </div>
        
        <h1 style="font-size:clamp(2.4rem, 6vw, 4rem); margin-bottom:1.25rem; color:var(--text-primary);">
          SUA ROTA ATÉ A FACULDADE, DIVIDIDA
        </h1>

        <p style="font-size:1.35rem; color:var(--text-secondary); max-width:700px; margin:0 auto 2.5rem; line-height:1.5;">
          O UniMove nasceu para aproximar estudantes que fazem o mesmo caminho até o campus. Menos carro andando vazio, menos gente esperando ônibus lotado, mais gente confiável dividindo o trajeto.
        </p>

        <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
          <a href="#/busca" class="btn btn-lg btn-azul">?? Buscar carona</a>
          <a href="#/oferecer" class="btn btn-lg btn-amarelo">?? Oferecer carona</a>
        </div>
      </section>

      <!-- Key Metrics (Manual pág 3) -->
      <section style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.5rem;">
        
        <div class="card" style="background-color:var(--preto-unimove); color:var(--bege-unimove); text-align:center; padding:2rem 1.5rem;">
          <div style="font-family:var(--font-title); font-size:2.8rem; color:var(--amarelo-unimove); margin-bottom:0.5rem;">1.240+</div>
          <div style="font-family:var(--font-subtitle); font-size:1.15rem; color:var(--bege-unimove);">caronas rodadas</div>
        </div>

        <div class="card" style="background-color:var(--azul-unimove); color:#FFFFFF; text-align:center; padding:2rem 1.5rem;">
          <div style="font-family:var(--font-title); font-size:2.8rem; color:var(--bege-unimove); margin-bottom:0.5rem;">R$ 38K</div>
          <div style="font-family:var(--font-subtitle); font-size:1.15rem; color:#FFFFFF;">economizados pela comunidade</div>
        </div>

        <div class="card" style="background-color:var(--verde-unimove); color:var(--preto-unimove); text-align:center; padding:2rem 1.5rem;">
          <div style="font-family:var(--font-title); font-size:2.8rem; color:var(--preto-unimove); margin-bottom:0.5rem;">4,8 ?</div>
          <div style="font-family:var(--font-subtitle); font-size:1.15rem; color:var(--preto-unimove);">avaliação média das caronas</div>
        </div>

      </section>

      <!-- How it Works (Manual pág 3) -->
      <section class="card" style="background:var(--bg-card); padding:2.5rem 2rem;">
        <h2 style="font-size:1.8rem; margin-bottom:1.5rem; text-align:center;">COMO FUNCIONA, EM TRÊS PARADAS</h2>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:2rem;">
          
          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            <div style="width:40px; height:40px; border-radius:50%; background-color:var(--azul-unimove); color:#FFF; display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:1.1rem;">1</div>
            <h3 style="font-family:var(--font-subtitle); font-size:1.25rem;">Conte sua rota</h3>
            <p style="color:var(--text-secondary); font-size:1.1rem;">Informe de onde você sai, seu horário de aula e seu destino no campus.</p>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            <div style="width:40px; height:40px; border-radius:50%; background-color:var(--amarelo-unimove); color:var(--preto-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:1.1rem;">2</div>
            <h3 style="font-family:var(--font-subtitle); font-size:1.25rem;">Encontre ou ofereça</h3>
            <p style="color:var(--text-secondary); font-size:1.1rem;">Veja colegas que fazem o mesmo trajeto ou abra vagas no seu próprio carro.</p>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            <div style="width:40px; height:40px; border-radius:50%; background-color:var(--verde-unimove); color:var(--preto-unimove); display:flex; align-items:center; justify-content:center; font-family:var(--font-subtitle); font-size:1.1rem;">3</div>
            <h3 style="font-family:var(--font-subtitle); font-size:1.25rem;">Embarque com confiança</h3>
            <p style="color:var(--text-secondary); font-size:1.1rem;">Sempre entre estudantes com e-mail institucional validado e avaliação mútua.</p>
          </div>

        </div>
      </section>

      <!-- 5 Sentimentos da Marca (Manual pág 4) -->
      <section style="display:flex; flex-direction:column; gap:1.5rem;">
        <div style="text-align:center;">
          <h2 style="font-size:2rem; margin-bottom:0.5rem;">CINCO SENTIMENTOS QUE GUIAM O UNIMOVE</h2>
          <p style="color:var(--text-secondary); font-size:1.15rem;">Cada detalhe existe para reforçar essas experiências em quem usa o app.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.25rem;">
          
          <div class="card" style="border-top:4px solid var(--azul-unimove);">
            <div style="font-size:1.8rem; margin-bottom:0.5rem;">???</div>
            <h3 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:0.35rem;">Segurança</h3>
            <p style="font-size:1rem; color:var(--text-secondary);">Perfil universitário verificado, avaliação em dois sentidos e combinado prévio de rota.</p>
          </div>

          <div class="card" style="border-top:4px solid var(--verde-unimove);">
            <div style="font-size:1.8rem; margin-bottom:0.5rem;">??</div>
            <h3 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:0.35rem;">Economia</h3>
            <p style="font-size:1rem; color:var(--text-secondary);">Dividir o combustível custa menos que o ônibus ou app de corrida.</p>
          </div>

          <div class="card" style="border-top:4px solid var(--amarelo-unimove);">
            <div style="font-size:1.8rem; margin-bottom:0.5rem;">??</div>
            <h3 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:0.35rem;">Amizade</h3>
            <p style="font-size:1rem; color:var(--text-secondary);">Colegas da mesma universidade indo para o mesmo lugar todos os dias.</p>
          </div>

          <div class="card" style="border-top:4px solid var(--azul-unimove);">
            <div style="font-size:1.8rem; margin-bottom:0.5rem;">?</div>
            <h3 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:0.35rem;">Praticidade</h3>
            <p style="font-size:1rem; color:var(--text-secondary);">Cadastrar a rota, encontrar carona e embarcar leva minutos. Direto ao ponto.</p>
          </div>

          <div class="card" style="border-top:4px solid var(--verde-unimove);">
            <div style="font-size:1.8rem; margin-bottom:0.5rem;">??</div>
            <h3 style="font-family:var(--font-subtitle); font-size:1.2rem; margin-bottom:0.35rem;">Liberdade</h3>
            <p style="font-size:1rem; color:var(--text-secondary);">Cada estudante escolhe sua rota, seu horário e com quem viaja.</p>
          </div>

        </div>
      </section>

    </div>
  `;
}
