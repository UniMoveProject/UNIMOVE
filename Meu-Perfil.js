/* =========================================
   FOTO DE PERFIL
========================================= */

const inputFotoPerfil = document.getElementById("Input-Foto-Perfil");
const fotoPerfil = document.getElementById("fotoPerfil");

inputFotoPerfil.addEventListener("change", function () {

    const arquivo = this.files[0];

    if (!arquivo) {
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        console.log("O arquivo selecionado não é uma imagem.");
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (evento) {
        fotoPerfil.src = evento.target.result;

        console.log("Foto de perfil alterada no front-end.");
    };

    leitor.readAsDataURL(arquivo);
});


/* =========================================
   ELEMENTOS DAS PREFERÊNCIAS
========================================= */

const motorista = document.getElementById("Motorista");
const dadosVeiculo = document.querySelector(".Dados-Veiculo");


/* =========================================
   MOSTRAR / ESCONDER DADOS DO VEÍCULO
========================================= */

function atualizarSecoes() {

    if (motorista.checked) {
        dadosVeiculo.style.display = "block";
    } else {
        dadosVeiculo.style.display = "none";
    }

}


motorista.addEventListener("change", atualizarSecoes);


/* Estado inicial */

atualizarSecoes();


/* =========================================
   POPUP DE CONFIRMAÇÃO
========================================= */

const popupOverlay = document.getElementById("popupOverlay");
const popupFechar = document.getElementById("popupFechar");
const popupCancelar = document.getElementById("popupCancelar");
const popupConfirmar = document.getElementById("popupConfirmar");
const popupMensagem = document.getElementById("popupMensagem");


let tipoAtualizacao = null;


/* =========================================
   MENSAGENS DO POPUP
========================================= */

const mensagensConfirmacao = {
    dados: "Tem certeza que deseja atualizar seus dados pessoais?",
    senha: "Tem certeza que deseja alterar sua senha?",
    veiculo: "Tem certeza que deseja atualizar os dados do veículo?"
};


/* =========================================
   ABRIR POPUP
========================================= */

function abrirPopup(tipo) {

    tipoAtualizacao = tipo;

    popupMensagem.textContent =
        mensagensConfirmacao[tipo] ||
        "Tem certeza que deseja salvar essas alterações?";

    popupOverlay.classList.add("ativo");

}


/* =========================================
   FECHAR POPUP
========================================= */

function fecharPopup() {

    popupOverlay.classList.remove("ativo");

    tipoAtualizacao = null;

}


/* =========================================
   BOTÕES DE ATUALIZAÇÃO
========================================= */

const botoesConfirmacao = document.querySelectorAll(
    "[data-confirmacao]"
);


botoesConfirmacao.forEach(function (botao) {

    botao.addEventListener("click", function (evento) {

        /*
         * Os formulários de dados pessoais e senha
         * não serão enviados de verdade enquanto
         * não existir um back-end.
         */

        if (botao.type === "submit") {
            evento.preventDefault();
        }

        const tipo = botao.dataset.confirmacao;

        abrirPopup(tipo);

    });

});


/* =========================================
   CONFIRMAR ATUALIZAÇÃO
========================================= */

popupConfirmar.addEventListener("click", function () {

    switch (tipoAtualizacao) {

        case "dados":

            console.log("Dados pessoais atualizados!");

            break;


        case "senha":

            console.log("Senha atualizada!");

            break;


        case "veiculo":

            console.log("Dados do veículo atualizados!");

            break;


        default:

            console.log("Alterações atualizadas!");

    }


    fecharPopup();

});


/* =========================================
   CANCELAR
========================================= */

popupCancelar.addEventListener("click", function () {

    fecharPopup();

});


/* =========================================
   BOTÃO X
========================================= */

popupFechar.addEventListener("click", function () {

    fecharPopup();

});


/* =========================================
   CLICAR FORA DO POPUP
========================================= */

popupOverlay.addEventListener("click", function (evento) {

    if (evento.target === popupOverlay) {
        fecharPopup();
    }

});


/* =========================================
   TECLA ESC
========================================= */

document.addEventListener("keydown", function (evento) {

    if (evento.key === "Escape") {
        fecharPopup();
    }

});
