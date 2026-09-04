// ========================================
// CONFIGURAÇÕES
// ========================================

// Endereço que futuramente levará para a página de Minhas Caronas
const enderecoMinhasCaronas = "#";


// ========================================
// ID DA CARONA
// ========================================

// Pega o ID da carona pela URL
const parametros = new URLSearchParams(window.location.search);

const idCarona = Number(parametros.get("id"));


// ========================================
// MODELOS DE CARONA
// ========================================

// Dados de exemplo enquanto não existe banco de dados
let caronas = [
    {
        id: 1,

        origem: "Uniceplac",
        destino: "Terminal BRT",
        rota: "Avenida dos Alagados",

        data: "2026-08-29",
        horario: "18:00",

        vagas: 3,

        carro: "Honda Civic",
        placa: "ADD-4C10",
        cor: "Branco",

        perfilPassageiros: "todos",

        aceitaBagagens: true
    },

    {
        id: 2,

        origem: "Brasília - DF",
        destino: "Goiânia - GO",
        rota: "BR-060",

        data: "2026-08-30",
        horario: "19:30",

        vagas: 2,

        carro: "Chevrolet Onix",
        placa: "XYZ-4E56",
        cor: "Preto",

        perfilPassageiros: "mulheres",

        aceitaBagagens: false
    }
];


// ========================================
// CARONA SELECIONADA
// ========================================

// Procura a carona correspondente ao ID
const caronaSelecionada = caronas.find(
    carona => carona.id === idCarona
);


// ========================================
// CAMPOS DO FORMULÁRIO
// ========================================

const origem = document.getElementById("origem");

const destino = document.getElementById("destino");

const rota = document.getElementById("rota");

const data = document.getElementById("data");

const horario = document.getElementById("horario");

const vagas = document.getElementById("vagas");

const carro = document.getElementById("carro");

const placa = document.getElementById("placa");

const cor = document.getElementById("cor");

const perfilPassageiros = document.querySelectorAll(
    'input[name="perfilPassageiros"]'
);

const aceitaBagagens = document.getElementById("aceitaBagagens");

const formulario = document.getElementById("editarCaronaForm");


// ========================================
// PREENCHER FORMULÁRIO
// ========================================

if (caronaSelecionada) {

    origem.value = caronaSelecionada.origem;

    destino.value = caronaSelecionada.destino;

    rota.value = caronaSelecionada.rota;

    data.value = caronaSelecionada.data;

    horario.value = caronaSelecionada.horario;

    vagas.value = caronaSelecionada.vagas;

    carro.value = caronaSelecionada.carro;

    placa.value = caronaSelecionada.placa;

    cor.value = caronaSelecionada.cor;


    // Perfil de passageiros
    perfilPassageiros.forEach(opcao => {

        if (opcao.value === caronaSelecionada.perfilPassageiros) {

            opcao.checked = true;

        }

    });


    // Bagagens
    aceitaBagagens.checked = caronaSelecionada.aceitaBagagens;

}


// ========================================
// POPUP
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
// ENVIO DO FORMULÁRIO
// ========================================

formulario.addEventListener("submit", evento => {

    evento.preventDefault();

    abrirPopup();

});


// ========================================
// CANCELAR
// ========================================

cancelarPopup.addEventListener("click", () => {

    fecharPopupConfirmacao();

});


// ========================================
// BOTÃO X
// ========================================

fecharPopup.addEventListener("click", () => {

    fecharPopupConfirmacao();

});


// ========================================
// CLICAR FORA DO POPUP
// ========================================

popup.addEventListener("click", evento => {

    if (evento.target === popup) {

        fecharPopupConfirmacao();

    }

});


// ========================================
// TECLA ESC
// ========================================

document.addEventListener("keydown", evento => {

    if (evento.key === "Escape") {

        fecharPopupConfirmacao();

    }

});


// ========================================
// CONFIRMAR ALTERAÇÕES
// ========================================

confirmarPopup.addEventListener("click", () => {

    // Fecha o popup primeiro
    fecharPopupConfirmacao();


    // Verifica se existe uma carona selecionada
    if (!caronaSelecionada) {

        console.log("Nenhuma carona encontrada.");

        return;

    }


    // Atualiza os dados
    caronaSelecionada.origem = origem.value;

    caronaSelecionada.destino = destino.value;

    caronaSelecionada.rota = rota.value;

    caronaSelecionada.data = data.value;

    caronaSelecionada.horario = horario.value;

    caronaSelecionada.vagas = Number(vagas.value);

    caronaSelecionada.carro = carro.value;

    caronaSelecionada.placa = placa.value;

    caronaSelecionada.cor = cor.value;


    // Perfil de passageiros
    const perfilSelecionado = document.querySelector(
        'input[name="perfilPassageiros"]:checked'
    );

    if (perfilSelecionado) {

        caronaSelecionada.perfilPassageiros =
            perfilSelecionado.value;

    }


    // Aceita bagagens
    caronaSelecionada.aceitaBagagens =
        aceitaBagagens.checked;


    // ========================================
    // SIMULAÇÃO
    // ========================================

    console.log("Alterações da carona salvas!");

    console.log(caronaSelecionada);


    // ========================================
    // REDIRECIONAMENTO FUTURO
    // ========================================

    if (enderecoMinhasCaronas !== "#") {

        window.location.href = enderecoMinhasCaronas;

    }

});
