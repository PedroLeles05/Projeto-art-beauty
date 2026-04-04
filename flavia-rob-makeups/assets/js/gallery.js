const fotos = [
    {url: "./assets/images/Circo.jpg", categoria: "corporal"},
    {url: "./assets/images/neon.jpg", categoria: "neon"},
    {url: "./assets/images/garoto.jpg", categoria: "efeitos"},
    {url: "./assets/images/rosto 1.jpg", categoria: "beauty"},
    {url: "./assets/images/rosto 2.jpg", categoria: "beauty"},
    {url: "./assets/images/rosto 3.jpg", categoria: "beauty"},
    {url: "./assets/images/rosto 4.jpg", categoria: "beauty"},
    {url: "./assets/images/about.png", categoria: "beauty"},
    {url: "./assets/images/mcm.jpg", categoria: "corporal"},
];

const botaoFiltro = document.querySelectorAll('.btn-filtro');
const moldura = document.querySelectorAll('.moldura');
const foto = document.querySelectorAll('.foto');
const btnVerMais = document.getElementById('vermais');
const imgLightBox = document.getElementById('img-lightbox');
const lightBox = document.getElementById('lightbox');
const body = document.querySelector('body')
const close = document.getElementById('close');
const prev = document.getElementById('btn-prev');
const next = document.getElementById('btn-next');

let categoriaAtual = 'todas';
let index = 0;

function filtrarCategoria() {
    botaoFiltro.forEach(botao =>{
        botao.addEventListener('click', () =>{
            document.querySelectorAll('.moldura-extra').forEach(el => el.remove());
            btnVerMais.classList.remove('hidden');

            document.querySelector('.btn-ativo')?.classList.remove('btn-ativo', 'border', 'border-white', 'px-4', 'py-2.5', 'text-white/90');
            botao.classList.add('btn-ativo', 'text-white/90', 'border', 'border-white', 'px-4', 'py-2.5');

            categoriaAtual = botao.getAttribute('data-categoria');
            const categoriaFiltrada = categoriaAtual == 'todas'
            ? fotos
            : fotos.filter(f => f.categoria == categoriaAtual)
            filtrarGaleria(categoriaFiltrada); 
            verificar(categoriaFiltrada); 
        });
    });
}

function filtrarGaleria(categoriaFiltrada) {
    moldura.forEach((moldura, index) =>{
        const fotoData = categoriaFiltrada[index];
        const img = foto[index];

        if(fotoData) {
            moldura.classList.remove("hidden");
            
            if(img.src.indexOf(fotoData.url) === -1) {
                img.src = fotoData.url;
                img.style.opacity = "0";
                setTimeout(() => img.style.opacity = "1", 100);
            }

        }else {
            moldura.classList.add("hidden");
        }
    });
}

// função do botão de ver mais
function verMais() {
    const container = document.getElementById('galeria-fotos');
    const linksAtuais = Array.from(foto).map(img => img.src);

    const fotosParaAdicionar = fotos.filter(imagem =>{
        const trueCategoria = (imagem.categoria == categoriaAtual || categoriaAtual == 'todas');
        const trueJanela = linksAtuais.some(link => link.includes(imagem.url));
        return trueCategoria && !trueJanela;
    });

    fotosParaAdicionar.forEach((imagem) =>{
        const novaMoldura = document.createElement('div');
        
        novaMoldura.className = `moldura-extra relative hover:scale-105 transition cursor-pointer overflow-hidden ${gerarTamanhos()}`;
        novaMoldura.innerHTML = `
        <img class="foto w-full h-full object-cover" src="${imagem.url}" alt="imagem da maquiagem">
        <div class="absolute z-10 inset-0 bg-black/30 hover:bg-black/0 transition"></div>
        `;

        container.appendChild(novaMoldura);

        novaMoldura.addEventListener("click", () => {
            const fotosVisiveis = Array.from(document.querySelectorAll('.foto')).filter(img => {
                const pai = img.closest('.moldura, .moldura-extra');
                return pai && !pai.classList.contains('hidden');
            });

            const imgClicada = novaMoldura.querySelector('.foto');
            i = fotosVisiveis.indexOf(imgClicada);

            imgLightBox.src = imgClicada.src;
            openLightBox();
        });
    });

    btnVerMais.classList.add('hidden');
}

// função que gera tamanhos aleatorios para cada imagem
function gerarTamanhos() {
    const tipos = [
        "col-span-1 row-span-1",
        "col-span-1 row-span-1",
        "col-span-1 row-span-1",
        "col-span-2 row-span-1",
        "col-span-1 row-span-2",
    ];
    return tipos[Math.floor(Math.random() * tipos.length)];
}

// função para verificar se tem imagem o suficiente para aparecer o ver mais
function verificar(categoriaFiltrada) {
    if(categoriaAtual.length <= moldura.length){
        btnVerMais.classList.add('hidden');
    }else if(categoriaFiltrada.length <= moldura.length){
        btnVerMais.classList.add('hidden');
    }
}


function openLightBox() {
    body.classList.add('overflow-y-hidden');

    lightBox.classList.remove('hidden');
    lightBox.classList.add('flex');
}

function closeLightBox() {
    body.classList.remove('overflow-y-hidden');

    lightBox.classList.remove('flex');
    lightBox.classList.add('hidden');
}

let i = 0;
function carrossel(direcao) {
    const fotosVisiveis = Array.from(document.querySelectorAll('.foto')).filter(img => {
        const molduraPai = img.closest('.moldura, .moldura-extra');
        return molduraPai && !molduraPai.classList.contains('hidden');
    });
    i += direcao;
    
    if (i >= fotosVisiveis.length) {
        i = 0;
    } else if (i < 0) {
        i = fotosVisiveis.length - 1;
    }

    imgLightBox.src = fotosVisiveis[i].src;
}

next.addEventListener('click', () => carrossel(1));
prev.addEventListener('click', () => carrossel(-1));

close.addEventListener("click", () =>{
    closeLightBox();
});

moldura.forEach((m) => {
    m.addEventListener("click", () => {
        const fotosVisiveis = Array.from(document.querySelectorAll('.foto')).filter(img => {
            const pai = img.closest('.moldura, .moldura-extra');
            return pai && !pai.classList.contains('hidden');
        });

        const imgClicada = m.querySelector('.foto');
        
        // Sincroniza o índice global 'i' com a posição da foto na lista visível
        i = fotosVisiveis.indexOf(imgClicada);
        
        imgLightBox.src = imgClicada.src;
        openLightBox();
    });
});
 
verificar();