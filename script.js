// Header com efeito vidro
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

// Fade ao aparecer na tela
const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      entry.target.classList.add("active");
    }
  });
},{
  threshold:0.15
});

document.querySelectorAll(".reveal").forEach((el)=>{
  observer.observe(el);
});

// Contador animado
const counters = document.querySelectorAll(".counter");

counters.forEach(counter=>{

  const target = Number(counter.dataset.target);
  let value = 0;

  const update = ()=>{

    value += Math.ceil(target/70);

    if(value < target){
      counter.innerText = value.toLocaleString("pt-BR");
      requestAnimationFrame(update);
    }else{
      counter.innerText = target.toLocaleString("pt-BR")+"+";
    }

  }

  update();

});

// Ripple nos botões
document.querySelectorAll(".btn").forEach(button=>{

  button.addEventListener("click",(e)=>{

    const circle = document.createElement("span");

    const diameter = Math.max(button.clientWidth,button.clientHeight);

    circle.style.width = circle.style.height = `${diameter}px`;

    circle.style.left = `${e.offsetX-diameter/2}px`;
    circle.style.top = `${e.offsetY-diameter/2}px`;

    circle.classList.add("ripple");

    button.appendChild(circle);

    setTimeout(()=>circle.remove(),600);

  });

});