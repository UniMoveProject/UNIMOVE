const data = document.getElementById("data");

const hoje = new Date();

const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dia = String(hoje.getDate()).padStart(2, "0");

data.value = `${ano}-${mes}-${dia}`;


// ========================================
// FORMULÁRIO DE OFERECER CARONA
// ========================================

const formulario = document.getElementById("oferecerCaronaForm");


// ========================================
// POPUP DE CONFIRMAÇÃO
// ========================================

const popup = document.getElementById("popup-confirmacao");

const fecharPopup = document.getElementById("popup-fechar");

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

formulario.addEventListener("submit", (evento) => {

    evento.preventDefault();


    // ========================================
    // DADOS DA CARONA
    // ========================================

    const dadosCarona = {

        origem: document.getElementById("origem").value,

        destino: document.getElementById("destino").value,

        rota: document.getElementById("rota").value,

        data: document.getElementById("data").value,

        horario: document.getElementById("horario").value,

        vagas: document.getElementById("vagas").value,

        carro: document.getElementById("carro").value,

        placa: document.getElementById("placa").value,

        cor: document.getElementById("cor").value,

        apenasMulheres: document.getElementById("apenasMulheres").checked,

        aceitaBagagens: document.getElementById("aceitaBagagens").checked

    };


    // ========================================
    // TESTE
    // ========================================

    console.log("Carona cadastrada:");

    console.log(dadosCarona);


    // ========================================
    // ABRIR POPUP
    // ========================================

    abrirPopup();

});


// ========================================
// BOTÃO FECHAR
// ========================================

fecharPopup.addEventListener("click", () => {

    fecharPopupConfirmacao();

});


// ========================================
// BOTÃO CONTINUAR
// ========================================

confirmarPopup.addEventListener("click", () => {

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
