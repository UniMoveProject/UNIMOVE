const data = document.getElementById("data");

const hoje = new Date();
hoje.setDate(hoje.getDate());

const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dia = String(hoje.getDate()).padStart(2, "0");

data.value = `${ano}-${mes}-${dia}`;
