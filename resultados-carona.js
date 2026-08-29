
const enderecoBusca = "#"; //endereço da pagina que irá retornao ao clicar no botão
const enderecoCarona = "#"; //leva o usuário até o chat do carona
const resultados = document.getElementById("resultados"); //seção onde irão aparecer os resultados
const minhaOrigem = "Uniceplac"; //origem que vai vir de acordo com o formulário

let numCaronas = false; // Variavel para saber se tem resultados ou não de caronas

// Modelos prontos de carona
let caronas = [
    {
        foto: "https://i.pravatar.cc/150?img=5",
        nome: "Maria dos computer",
        avaliacoes: 4.5,
        caronas: 50,
        origem: "Uniceplac",
        destino: "Terminal BRT",
        rota: "Avenida dos Alagados",
        horario: "18:00",
        vagas: 3,
        carro: "Honda Civic",
        placa: "ADD-4C10",
        cor: "Branco"
    },
    {
        foto: "https://i.pravatar.cc/150?img=23",
        nome: "Juju do Pix",
        avaliacoes: 4.5,
        caronas: 50,
        origem: "Uniceplac",
        destino: "Terminal BRT",
        rota: "Avenida dos Alagados",
        horario: "18:00",
        vagas: 3,
        carro: "Honda Civic",
        placa: "ADD-4C10",
        cor: "Branco"
    },

    {
        foto: "https://i.pravatar.cc/150?img=33",
        nome: "Cleiton Rasta",
        avaliacoes: 4.8,
        caronas: 18,
        origem: "Brasília - DF",
        destino: "Goiânia - GO",
        rota: "BR-060",
        horario: "19:30",
        vagas: 2,
        carro: "Chevrolet Onix",
        placa: "XYZ-4E56",
        cor: "Preto"
    },
    {
        foto: "https://i.pravatar.cc/150?img=63",
        nome: "Flavin do Drift",
        avaliacoes: 4.8,
        caronas: 18,
        origem: "Brasília - DF",
        destino: "Goiânia - GO",
        rota: "BR-060",
        horario: "19:30",
        vagas: 2,
        carro: "Chevrolet Onix",
        placa: "XYZ-4E56",
        cor: "Preto"
    }
];

// função para cria um novo elemento para cada carona encontrada
function novosResultados(
    foto,
    nome,
    avaliacoes,
    quantidadeCaronas,
    origem,
    destino,
    rota,
    horario,
    vagas,
    carro,
    placa,
    cor
) {

    resultados.insertAdjacentHTML("beforeend", `

        <article class="carona-card">

            <img
                class="motorista-foto"
                src="${foto}"
                alt="Foto de motorista ${nome}"
            >


            <div class="carona-conteudo">

                <div class="motorista-header">

                    <h2>${nome}</h2>

                    <div class="motorista-avaliacao">
                        <span>★</span>
                        <strong>${avaliacoes}</strong>
                    </div>

                    <div class="motorista-caronas">
                        <strong>${quantidadeCaronas}</strong>
                        <span>caronas</span>
                    </div>

                </div>


                <div class="viagem-info">

                    <div class="viagem-item">
                        <span>Origem</span>
                        <strong>${origem}</strong>
                    </div>

                    <div class="viagem-item">
                        <span>Destino</span>
                        <strong>${destino}</strong>
                    </div>

                    <div class="viagem-item">
                        <span>Rota</span>
                        <strong>${rota}</strong>
                    </div>

                    <div class="viagem-item">
                        <span>Horário</span>
                        <strong>${horario}</strong>
                    </div>

                    <div class="viagem-item">
                        <span>Vagas</span>
                        <strong>${vagas} disponíveis</strong>
                    </div>

                    <div class="viagem-item">
                        <span>Carro</span>
                        <strong>${carro}</strong>
                    </div>

                    <div class="viagem-item">
                        <span>Placa</span>
                        <strong>${placa}</strong>
                    </div>

                    <div class="viagem-item">
                        <span>Cor</span>
                        <strong>${cor}</strong>
                    </div>

                </div>

            </div>


            <div class="carona-acoes">

                            <a
                class="abrir-chat"
                href="${enderecoCarona}"
                title="Conversar com ${nome}"
            >
                <i class="fa-solid fa-comments"></i>
                <span>Chat</span>
            </a>


                <button
                    class="pedir-carona"
                    type="button"
                >
                    <i class="fa-solid fa-car-side"></i>
                    Pedir carona
                </button>

            </div>

        </article>

    `);
}


// Percorre todas caronas registradas, se bater com o filtro aparece
caronas.forEach(carona => {

    if (carona.origem == minhaOrigem) {
        novosResultados(
            carona.foto,
            carona.nome,
            carona.avaliacoes,
            carona.caronas,
            carona.origem,
            carona.destino,
            carona.rota,
            carona.horario,
            carona.vagas,
            carona.carro,
            carona.placa,
            carona.cor
        );
        numCaronas = true;
    }

});

// tela caso não tiver resultados
if (!numCaronas) {
    resultados.innerHTML = `<section class="sem-resultados">

            <div class="sem-resultados-conteudo">

                <i class="fa-solid fa-car-side"></i>

                <h2>Nenhuma carona encontrada</h2>

                <p>
                    Não encontramos nenhuma carona disponível
                    para os critérios selecionados.
                </p>

                <a href="${enderecoBusca}" class="btn-voltar-busca">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    Nova busca
                </a>

            </div>

        </section>`;
}

// Área para o Pop-up


// ========================================
// POPUP DE CONFIRMAÇÃO
// ========================================

const popup = document.getElementById("popup-confirmacao");
const fecharPopup = document.getElementById("popup-fechar");
const cancelarPopup = document.getElementById("popup-cancelar");
const confirmarPopup = document.getElementById("popup-confirmar");


// ========================================
// ABRIR POPUP
// ========================================

function abrirPopup() {
    popup.classList.add("ativo");

    document.body.style.overflow = "hidden";
}


// ========================================
// FECHAR POPUP
// ========================================

function fecharPopupConfirmacao() {
    popup.classList.remove("ativo");

    document.body.style.overflow = "";
}


// ========================================
// BOTÕES "PEDIR CARONA"
// ========================================

const botoesPedirCarona = document.querySelectorAll(".pedir-carona");

botoesPedirCarona.forEach(botao => {

    botao.addEventListener("click", () => {

        abrirPopup();

    });

});


// ========================================
// CANCELAR
// ========================================

cancelarPopup.addEventListener("click", () => {

    fecharPopupConfirmacao();

});


// ========================================
// X
// ========================================

fecharPopup.addEventListener("click", () => {

    fecharPopupConfirmacao();

});


// ========================================
// CLICAR FORA DO POPUP
// ========================================

popup.addEventListener("click", (evento) => {

    if (evento.target === popup) {

        fecharPopupConfirmacao();

    }

});


// ========================================
// TECLA ESC
// ========================================

document.addEventListener("keydown", (evento) => {

    if (evento.key === "Escape") {

        fecharPopupConfirmacao();

    }

});


// ========================================
// CONFIRMAR PEDIDO
// ========================================

confirmarPopup.addEventListener("click", () => {

    // Aqui futuramente você poderá enviar
    // o pedido para o banco de dados.

    console.log("Pedido de carona confirmado!");

    fecharPopupConfirmacao();

});
