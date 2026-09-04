// ========================================
// ENDEREÇOS DAS PÁGINAS
// ========================================

// Endereço da página de adicionar uma nova carona.
// Futuramente basta trocar o "#" pelo endereço correto.
const enderecoAdicionarCarona = "#";

// Endereço da página de editar uma carona.
// Futuramente será utilizado para abrir o formulário preenchido.
const enderecoEditarCarona = "#";


// ========================================
// ELEMENTOS DA PÁGINA
// ========================================

const resultados = document.getElementById("resultados");

const adicionarCarona = document.getElementById("adicionar-carona");


// ========================================
// CONFIGURAÇÃO DOS BOTÕES
// ========================================

adicionarCarona.href = enderecoAdicionarCarona;


// ========================================
// CARONAS CADASTRADAS
// ========================================

// Exemplos de caronas cadastradas pelo motorista.
//
// Futuramente esse array será substituído pelos dados
// vindos do banco de dados.

let caronas = [

    {
        id: 1,

        foto: "https://i.pravatar.cc/150?img=12",

        nome: "Maria dos computer",

        avaliacoes: 4.5,

        quantidadeCaronas: 50,

        origem: "Uniceplac",

        destino: "Terminal BRT",

        rota: "Avenida dos Alagados",

        data: "30/08/2026",

        horario: "18:00",

        vagas: 3,

        carro: "Honda Civic",

        placa: "ADD-4C10",

        cor: "Branco",

        apenasMulheres: true,

        aceitaBagagem: true
    },


    {
        id: 2,

        foto: "https://i.pravatar.cc/150?img=32",

        nome: "Juju do Pix",

        avaliacoes: 4.7,

        quantidadeCaronas: 35,

        origem: "Uniceplac",

        destino: "Taguatinga",

        rota: "EPNB",

        data: "31/08/2026",

        horario: "19:30",

        vagas: 2,

        carro: "Chevrolet Onix",

        placa: "XYZ-4E56",

        cor: "Preto",

        apenasMulheres: false,

        aceitaBagagem: true
    },


    {
        id: 3,

        foto: "https://i.pravatar.cc/150?img=47",

        nome: "Cleiton Rasta",

        avaliacoes: 4.8,

        quantidadeCaronas: 18,

        origem: "Brasília - DF",

        destino: "Goiânia - GO",

        rota: "BR-060",

        data: "01/09/2026",

        horario: "19:30",

        vagas: 4,

        carro: "Volkswagen Polo",

        placa: "ABC-1D23",

        cor: "Cinza",

        apenasMulheres: false,

        aceitaBagagem: false
    }

];


// ========================================
// CRIAR CARD
// ========================================

function novosResultados(carona) {

    resultados.insertAdjacentHTML("beforeend", `

        <article class="carona-card">

            <img
                class="motorista-foto"
                src="${carona.foto}"
                alt="Foto de motorista ${carona.nome}"
            >


            <div class="carona-conteudo">

                <div class="motorista-header">

                    <h2>${carona.nome}</h2>

                    <div class="motorista-avaliacao">

                        <span>★</span>

                        <strong>
                            ${carona.avaliacoes}
                        </strong>

                    </div>

                    <div class="motorista-caronas">

                        <strong>
                            ${carona.quantidadeCaronas}
                        </strong>

                        <span>
                            caronas
                        </span>

                    </div>

                </div>


                <div class="viagem-info">

                    <div class="viagem-item">

                        <span>
                            Origem
                        </span>

                        <strong>
                            ${carona.origem}
                        </strong>

                    </div>


                    <div class="viagem-item">

                        <span>
                            Destino
                        </span>

                        <strong>
                            ${carona.destino}
                        </strong>

                    </div>


                    <div class="viagem-item">

                        <span>
                            Rota
                        </span>

                        <strong>
                            ${carona.rota}
                        </strong>

                    </div>


                    <div class="viagem-item">

                        <span>
                            Data
                        </span>

                        <strong>
                            ${carona.data}
                        </strong>

                    </div>


                    <div class="viagem-item">

                        <span>
                            Horário
                        </span>

                        <strong>
                            ${carona.horario}
                        </strong>

                    </div>


                    <div class="viagem-item">

                        <span>
                            Vagas
                        </span>

                        <strong>
                            ${carona.vagas} disponíveis
                        </strong>

                    </div>


                    <div class="viagem-item">

                        <span>
                            Carro
                        </span>

                        <strong>
                            ${carona.carro}
                        </strong>

                    </div>


                    <div class="viagem-item">

                        <span>
                            Placa
                        </span>

                        <strong>
                            ${carona.placa}
                        </strong>

                    </div>


                    <div class="viagem-item">

                        <span>
                            Cor
                        </span>

                        <strong>
                            ${carona.cor}
                        </strong>

                    </div>


                    <div class="viagem-item">

                        <span>
                            Perfil de passageiros
                        </span>

                        <strong>
                            ${carona.apenasMulheres ? "Apenas mulheres" : "Todos"}
                        </strong>

                    </div>


                    <div class="viagem-item">

                        <span>
                            Bagagem
                        </span>

                        <strong>
                            ${carona.aceitaBagagem ? "Aceita" : "Não aceita"}
                        </strong>

                    </div>

                </div>

            </div>


            <div class="carona-acoes">

                <button
                    class="editar-carona"
                    type="button"
                    data-id="${carona.id}"
                >

                    <i class="fa-solid fa-pen"></i>

                    <span>
                        Editar
                    </span>

                </button>


                <button
                    class="excluir-carona"
                    type="button"
                    data-id="${carona.id}"
                >

                    <i class="fa-solid fa-trash"></i>

                    <span>
                        Excluir
                    </span>

                </button>

            </div>

        </article>

    `);

}


// ========================================
// MOSTRAR CARONAS
// ========================================

function mostrarCaronas() {

    resultados.innerHTML = "";


    if (caronas.length === 0) {

        resultados.innerHTML = `

            <section class="sem-resultados">

                <div class="sem-resultados-conteudo">

                    <i class="fa-solid fa-car-side"></i>

                    <h2>
                        Você não possui caronas
                    </h2>

                    <p>
                        Cadastre uma carona para começar
                        a oferecer viagens aos passageiros.
                    </p>

                </div>

            </section>

        `;

        return;
    }


    caronas.forEach(carona => {

        novosResultados(carona);

    });


    configurarBotoes();

}


// ========================================
// CONFIGURAR BOTÕES DOS CARDS
// ========================================

function configurarBotoes() {

    const botoesEditar =
        document.querySelectorAll(".editar-carona");


    const botoesExcluir =
        document.querySelectorAll(".excluir-carona");


    // Botões editar

    botoesEditar.forEach(botao => {

        botao.addEventListener("click", () => {

            const id =
                Number(botao.dataset.id);


            editarCarona(id);

        });

    });


    // Botões excluir

    botoesExcluir.forEach(botao => {

        botao.addEventListener("click", () => {

            const id =
                Number(botao.dataset.id);


            abrirPopupExcluir(id);

        });

    });

}


// ========================================
// EDITAR CARONA
// ========================================

function editarCarona(id) {

    const carona =
        caronas.find(carona => carona.id === id);


    if (!carona) {
        return;
    }


    // Por enquanto apenas deixamos preparado.
    //
    // Futuramente essa parte poderá:
    //
    // 1. Salvar o ID da carona.
    // 2. Abrir o formulário de cadastro.
    // 3. Preencher todos os campos com os dados dessa carona.
    // 4. Alterar o objeto após o envio.

    console.log("Editar carona:", carona);

    console.log(
        "Futuramente abrir formulário de edição."
    );

}


// ========================================
// POPUP DE EXCLUSÃO
// ========================================

const popupExcluir =
    document.getElementById("popup-excluir");

const fecharPopup =
    document.getElementById("popup-fechar");

const cancelarPopup =
    document.getElementById("popup-cancelar");

const confirmarPopup =
    document.getElementById("popup-confirmar");


// Guarda temporariamente qual carona
// o usuário deseja excluir.

let caronaParaExcluir = null;


// ========================================
// ABRIR POPUP
// ========================================

function abrirPopupExcluir(id) {

    caronaParaExcluir = id;

    popupExcluir.classList.add("ativo");

    document.body.style.overflow = "hidden";

}


// ========================================
// FECHAR POPUP
// ========================================

function fecharPopupExcluir() {

    popupExcluir.classList.remove("ativo");

    document.body.style.overflow = "";

    caronaParaExcluir = null;

}


// ========================================
// BOTÃO CANCELAR
// ========================================

cancelarPopup.addEventListener("click", () => {

    fecharPopupExcluir();

});


// ========================================
// BOTÃO FECHAR
// ========================================

fecharPopup.addEventListener("click", () => {

    fecharPopupExcluir();

});


// ========================================
// CLICAR FORA DO POPUP
// ========================================

popupExcluir.addEventListener("click", (evento) => {

    if (evento.target === popupExcluir) {

        fecharPopupExcluir();

    }

});


// ========================================
// TECLA ESC
// ========================================

document.addEventListener("keydown", (evento) => {

    if (evento.key === "Escape") {

        fecharPopupExcluir();

    }

});


// ========================================
// CONFIRMAR EXCLUSÃO
// ========================================

confirmarPopup.addEventListener("click", () => {

    if (caronaParaExcluir === null) {
        return;
    }


    const id = caronaParaExcluir;


    // Remove a carona do array

    caronas =
        caronas.filter(carona => carona.id !== id);


    // Mostra novamente os cards

    mostrarCaronas();


    console.log(
        "Carona excluída com sucesso!"
    );


    fecharPopupExcluir();

});


// ========================================
// INICIAR PÁGINA
// ========================================

mostrarCaronas();
