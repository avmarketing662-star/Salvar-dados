// ==========================================================
// EDITOR / GERADOR DO DADOS.JSON
// SUPERMERCADO AVENIDA
// ==========================================================
//
// Este arquivo:
// - Lê o dados.json existente
// - Mostra os dados no editor
// - Permite editar
// - Permite remover
// - Permite adicionar novos cards
// - Gera um novo dados.json
//
// NÃO altera o HTML do site.
// NÃO cria produtos automaticamente.
// ==========================================================


// ==========================================================
// DADOS PRINCIPAIS
// ==========================================================

let dados = {

    produtos: [],

    jornal: {
        pagfrente: "",
        pagverso: ""
    },

    destaques: [],

    receitas: [],

    clube: {

        tituloPequeno: "CLUBE AVENIDA",

        titulo: "Faça parte do Clube Avenida!",

        descricao:
            "Aproveite benefícios, ofertas especiais e vantagens exclusivas para nossos clientes.",

        infoTitulo:
            "Mais vantagens para você!",

        infoDescricao:
            "Cadastre-se no Clube Avenida e fique por dentro das nossas melhores ofertas e condições especiais.",

        botaoTexto:
            "Quero fazer parte",

        botaoLink:
            "#",

        cards: []

    },

    noticias: []

};


// ==========================================================
// CATEGORIAS
// ==========================================================

const categorias = [

    {
        nome: "Mercearia",
        prefixo: "Merc"
    },

    {
        nome: "Bebidas",
        prefixo: "Beb"
    },

    {
        nome: "Açougue",
        prefixo: "Aco"
    },

    {
        nome: "Higiene",
        prefixo: "Hig"
    },

    {
        nome: "Padaria",
        prefixo: "Pad"
    }

];


// ==========================================================
// INICIALIZAR ESTRUTURA
// ==========================================================

function normalizarDados(json) {

    const resultado = {

        produtos:
            Array.isArray(json.produtos)
                ? json.produtos
                : [],


        jornal: {

            pagfrente:
                json.jornal?.pagfrente || "",

            pagverso:
                json.jornal?.pagverso || ""

        },


        destaques: [],


        receitas:
            Array.isArray(json.receitas)
                ? json.receitas
                : [],


        clube: {

            tituloPequeno:
                json.clube?.tituloPequeno ||
                "CLUBE AVENIDA",

            titulo:
                json.clube?.titulo ||
                "Faça parte do Clube Avenida!",

            descricao:
                json.clube?.descricao ||
                "",

            infoTitulo:
                json.clube?.infoTitulo ||
                "",

            infoDescricao:
                json.clube?.infoDescricao ||
                "",

            botaoTexto:
                json.clube?.botaoTexto ||
                "Quero fazer parte",

            botaoLink:
                json.clube?.botaoLink ||
                "#",

            cards:
                Array.isArray(json.clube?.cards)
                    ? json.clube.cards
                    : []

        },


        noticias:
            Array.isArray(json.noticias)
                ? json.noticias
                : []

    };


    // ------------------------------------------------------
    // COMPATIBILIDADE COM JSON ANTIGO
    // ------------------------------------------------------

    // Seu JSON antigo tinha apenas:
    //
    // "destaque": {
    //
    // }
    //
    // O novo sistema usa:
    //
    // "destaques": [
    //
    // ]


    if (
        Array.isArray(json.destaques)
    ) {

        resultado.destaques =
            json.destaques;

    }

    else if (
        json.destaque &&
        typeof json.destaque === "object"
    ) {

        resultado.destaques = [

            json.destaque

        ];

    }


    return resultado;

}


// ==========================================================
// ABRIR JSON
// ==========================================================

document
    .getElementById("abrirJson")
    .addEventListener(
        "change",
        function (evento) {

            const arquivo =
                evento.target.files[0];


            if (!arquivo) {

                return;

            }


            const leitor =
                new FileReader();


            leitor.onload =
                function () {

                    try {

                        const json =
                            JSON.parse(
                                leitor.result
                            );


                        dados =
                            normalizarDados(
                                json
                            );


                        carregarEditor();


                        atualizarStatus(
                            "✅ JSON carregado com sucesso!"
                        );


                    }

                    catch (erro) {

                        console.error(
                            erro
                        );


                        atualizarStatus(
                            "❌ O arquivo não é um JSON válido."
                        );


                        alert(
                            "Não foi possível abrir o JSON."
                        );

                    }

                };


            leitor.readAsText(
                arquivo,
                "UTF-8"
            );

        }
    );


// ==========================================================
// CARREGAR EDITOR
// ==========================================================

function carregarEditor() {

    carregarProdutos();

    carregarJornal();

    carregarDestaques();

    carregarReceitas();

    carregarClube();

    carregarNoticias();

}


// ==========================================================
// STATUS
// ==========================================================

function atualizarStatus(texto) {

    const status =
        document.getElementById("status");


    if (status) {

        status.textContent =
            texto;

    }

}


// ==========================================================
// VALOR SEGURO
// ==========================================================

function valorOuVazio(valor) {

    if (
        valor === undefined ||
        valor === null
    ) {

        return "";

    }


    return String(valor);

}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

function escaparHTML(valor) {

    return valorOuVazio(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================================
// CONVERTER IMAGEM PARA BASE64
// ==========================================================

function converterImagem(arquivo) {

    return new Promise(
        function (resolve) {

            if (!arquivo) {

                resolve("");

                return;

            }


            const leitor =
                new FileReader();


            leitor.onload =
                function () {

                    resolve(
                        leitor.result
                    );

                };


            leitor.onerror =
                function () {

                    resolve("");

                };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


// ==========================================================
// PRODUTOS
// ==========================================================

function carregarProdutos() {

    categorias.forEach(
        function (categoria) {

            const area =
                document.getElementById(
                    "produtos-" +
                    categoria.nome
                );


            if (!area) {

                return;

            }


            area.innerHTML = "";


            const produtosCategoria =
                dados.produtos.filter(
                    function (produto) {

                        return produto.id &&
                            produto.id.startsWith(
                                categoria.prefixo
                            );

                    }
                );


            produtosCategoria.forEach(
                function (produto) {

                    criarCardProduto(
                        area,
                        produto
                    );

                }
            );

        }
    );

}


// ==========================================================
// CRIAR CARD DE PRODUTO
// ==========================================================

function criarCardProduto(
    area,
    produto
) {

    const card =
        document.createElement("div");


    card.className =
        "produto-card-editor";


    card.innerHTML = `

        <div class="card-topo">

            <h3>
                📦 Produto
            </h3>

            <button
                type="button"
                class="btn-remover"
            >
                🗑️ Remover
            </button>

        </div>


        <div class="campo">

            <label>
                ID
            </label>

            <input
                type="text"
                class="produto-id"
                value="${escaparHTML(produto.id)}"
            >

        </div>


        <div class="campo">

            <label>
                Nome
            </label>

            <input
                type="text"
                class="produto-nome"
                value="${escaparHTML(produto.nome)}"
            >

        </div>


        <div class="campo">

            <label>
                Valor
            </label>

            <input
                type="text"
                class="produto-valor"
                value="${escaparHTML(produto.valor)}"
                placeholder="Ex.: R$ 9,99"
            >

        </div>


        <div class="campo">

            <label>
                Imagem
            </label>

            <input
                type="text"
                class="produto-imagem"
                value="${escaparHTML(produto.imagem)}"
                placeholder="URL ou caminho da imagem"
            >

            <input
                type="file"
                class="produto-arquivo"
                accept="image/*"
            >

        </div>


        

    `;


    // ------------------------------------------------------
    // REMOVER PRODUTO
    // ------------------------------------------------------

    card
        .querySelector(".btn-remover")
        .addEventListener(
            "click",
            function () {

                if (
                    !confirm(
                        "Deseja remover este produto?"
                    )
                ) {

                    return;

                }


                const indice =
                    dados.produtos.indexOf(
                        produto
                    );


                if (indice !== -1) {

                    dados.produtos.splice(
                        indice,
                        1
                    );

                }


                card.remove();

            }
        );


    area.appendChild(card);

}


// ==========================================================
// ADICIONAR PRODUTO
// ==========================================================

function adicionarProduto(
    categoriaNome
) {

    const categoria =
        categorias.find(
            function (item) {

                return item.nome ===
                    categoriaNome;

            }
        );


    if (!categoria) {

        return;

    }


    const id =
        gerarId(
            categoria.prefixo,
            dados.produtos
        );


    const novoProduto = {

        id: id,

        nome: "",

        valor: "",

        imagem: "",


    };


    dados.produtos.push(
        novoProduto
    );


    const area =
        document.getElementById(
            "produtos-" +
            categoriaNome
        );


    criarCardProduto(
        area,
        novoProduto
    );

}


// ==========================================================
// GERAR ID
// ==========================================================

function gerarId(
    prefixo,
    produtosExistentes
) {

    let numero = 1;


    while (
        produtosExistentes.some(
            function (produto) {

                return produto.id ===
                    prefixo + numero;

            }
        )
    ) {

        numero++;

    }


    return prefixo + numero;

}


// ==========================================================
// BOTÕES DE ADICIONAR PRODUTO
// ==========================================================

document
    .querySelectorAll(".btn-adicionar[data-categoria]")
    .forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    adicionarProduto(
                        botao.dataset.categoria
                    );

                }
            );

        }
    );


// ==========================================================
// JORNAL
// ==========================================================

function carregarJornal() {

    const frente =
        document.getElementById(
            "pagfrente"
        );


    const verso =
        document.getElementById(
            "pagverso"
        );


    if (frente) {

        frente.value =
            dados.jornal.pagfrente;

    }


    if (verso) {

        verso.value =
            dados.jornal.pagverso;

    }

}


// ==========================================================
// DESTAQUES
// ==========================================================

function carregarDestaques() {

    const area =
        document.getElementById(
            "destaques"
        );


    if (!area) {

        return;

    }


    area.innerHTML = "";


    dados.destaques.forEach(
        function (destaque) {

            criarCardDestaque(
                area,
                destaque
            );

        }
    );

}


// ==========================================================
// CARD DESTAQUE
// ==========================================================

function criarCardDestaque(
    area,
    destaque
) {

    const card =
        document.createElement("div");


    card.className =
        "destaque-card-editor";


    card.innerHTML = `

        <div class="card-topo">

            <h3>
                ⭐ Produto Destaque
            </h3>

            <button
                type="button"
                class="btn-remover"
            >
                🗑️ Remover
            </button>

        </div>


        <div class="campo">

            <label>
                Imagem
            </label>

            <input
                type="text"
                class="destaque-imagem"
                value="${escaparHTML(destaque.imgDestaque)}"
                placeholder="URL ou caminho da imagem"
            >

            <input
                type="file"
                class="destaque-arquivo"
                accept="image/*"
            >

        </div>


        <div class="campo">

            <label>
                Nome
            </label>

            <input
                type="text"
                class="destaque-nome"
                value="${escaparHTML(destaque.nomeDestaque)}"
            >

        </div>


        <div class="campo">

            <label>
                Descrição
            </label>

            <textarea
                class="destaque-descricao"
                rows="4"
            >${escaparHTML(destaque.descricaoDestaque)}</textarea>

        </div>


        <div class="campo">

            <label>
                Valor
            </label>

            <input
                type="text"
                class="destaque-valor"
                value="${escaparHTML(destaque.valorDestaque)}"
                placeholder="Ex.: R$ 9,99"
            >

        </div>

    `;


    card
        .querySelector(".btn-remover")
        .addEventListener(
            "click",
            function () {

                const indice =
                    dados.destaques.indexOf(
                        destaque
                    );


                if (indice !== -1) {

                    dados.destaques.splice(
                        indice,
                        1
                    );

                }


                card.remove();

            }
        );


    area.appendChild(card);

}


// ==========================================================
// ADICIONAR DESTAQUE
// ==========================================================

function adicionarDestaque() {

    const novo = {

        imgDestaque: "",

        nomeDestaque: "",

        descricaoDestaque: "",

        valorDestaque: ""

    };


    dados.destaques.push(
        novo
    );


    criarCardDestaque(
        document.getElementById(
            "destaques"
        ),
        novo
    );

}


document
    .getElementById(
        "btnAdicionarDestaque"
    )
    .addEventListener(
        "click",
        adicionarDestaque
    );


// ==========================================================
// RECEITAS
// ==========================================================

function carregarReceitas() {

    const area =
        document.getElementById(
            "receitas"
        );


    if (!area) {

        return;

    }


    area.innerHTML = "";


    dados.receitas.forEach(
        function (receita) {

            criarCardReceita(
                area,
                receita
            );

        }
    );

}


// ==========================================================
// CARD RECEITA
// ==========================================================

function criarCardReceita(
    area,
    receita
) {

    const card =
        document.createElement("div");


    card.className =
        "receita-card-editor";


    card.innerHTML = `

        <div class="card-topo">

            <h3>
                🍳 Receita
            </h3>

            <button
                type="button"
                class="btn-remover"
            >
                🗑️ Remover
            </button>

        </div>


        <div class="campo">

            <label>
                Título
            </label>

            <input
                type="text"
                class="receita-titulo"
                value="${escaparHTML(receita.titulo)}"
            >

        </div>


        <div class="campo">

            <label>
                Descrição
            </label>

            <textarea
                class="receita-descricao"
                rows="5"
            >${escaparHTML(receita.descricao)}</textarea>

        </div>


        <div class="campo">

            <label>
                Imagem
            </label>

            <input
                type="text"
                class="receita-imagem"
                value="${escaparHTML(receita.imagem)}"
                placeholder="URL ou caminho da imagem"
            >

            <input
                type="file"
                class="receita-arquivo"
                accept="image/*"
            >

        </div>


        <div class="campo">

            <label>
                Link
            </label>

            <input
                type="text"
                class="receita-link"
                value="${escaparHTML(receita.link)}"
                placeholder="https://..."
            >

        </div>

    `;


    card
        .querySelector(".btn-remover")
        .addEventListener(
            "click",
            function () {

                const indice =
                    dados.receitas.indexOf(
                        receita
                    );


                if (indice !== -1) {

                    dados.receitas.splice(
                        indice,
                        1
                    );

                }


                card.remove();

            }
        );


    area.appendChild(card);

}


// ==========================================================
// ADICIONAR RECEITA
// ==========================================================

function adicionarReceita() {

    const nova = {

        titulo: "",

        descricao: "",

        imagem: "",

        link: ""

    };


    dados.receitas.push(
        nova
    );


    criarCardReceita(
        document.getElementById(
            "receitas"
        ),
        nova
    );

}


document
    .getElementById(
        "btnAdicionarReceita"
    )
    .addEventListener(
        "click",
        adicionarReceita
    );

// ==========================================================
// CLUBE AVENIDA
// ==========================================================

function carregarClube() {

    const clube = dados.clube || {};


    // ======================================================
    // INFORMAÇÕES PRINCIPAIS
    // ======================================================

    const tituloPequeno =
        document.getElementById(
            "clubeTituloPequeno"
        );

    const titulo =
        document.getElementById(
            "clubeTitulo"
        );

    const descricao =
        document.getElementById(
            "clubeDescricao"
        );

    const infoTitulo =
        document.getElementById(
            "clubeInfoTitulo"
        );

    const infoDescricao =
        document.getElementById(
            "clubeInfoDescricao"
        );


    if (tituloPequeno) {

        tituloPequeno.value =
            clube.tituloPequeno || "";

    }


    if (titulo) {

        titulo.value =
            clube.titulo || "";

    }


    if (descricao) {

        descricao.value =
            clube.descricao || "";

    }


    if (infoTitulo) {

        infoTitulo.value =
            clube.infoTitulo || "";

    }


    if (infoDescricao) {

        infoDescricao.value =
            clube.infoDescricao || "";

    }



    // ======================================================
    // CARDS DO CLUBE
    // ======================================================

    const area =
        document.getElementById(
            "clubeCardsEditor"
        );


    if (!area) {

        return;

    }


    area.innerHTML = "";


    // Garantir que cards seja um array

    if (!Array.isArray(clube.cards)) {

        clube.cards = [];

    }


    // Carregar cards existentes

    clube.cards.forEach(
        function (card) {

            criarCardClube(card);

        }
    );


    // Se não houver nenhum card,
    // cria um card inicial

    if (area.children.length === 0) {

        const novoCard = {

            tituloPequeno:
                "CLUBE AVENIDA",

            titulo:
                "Faça parte do Clube Avenida!",

            descricao:
                "Aproveite benefícios, ofertas especiais e vantagens exclusivas."

        };


        clube.cards.push(
            novoCard
        );


        criarCardClube(
            novoCard
        );

    }



    // ======================================================
    // BOTÃO
    // ======================================================

    const botaoTexto =
        document.getElementById(
            "clubeBotaoTexto"
        );

    const botaoLink =
        document.getElementById(
            "clubeBotaoLink"
        );


    if (botaoTexto) {

        botaoTexto.value =
            clube.botaoTexto ||
            "Quero fazer parte";

    }


    if (botaoLink) {

        botaoLink.value =
            clube.botaoLink ||
            "#";

    }

}

// ==========================================================
// CRIAR CARD DO CLUBE
// ==========================================================

function criarCardClube(item = {}) {

    const area =
        document.getElementById(
            "clubeCardsEditor"
        );

    if (!area) {

        return;

    }


    const card =
        document.createElement("div");

    card.className =
        "clube-card-editor";


    card.innerHTML = `

        <div class="card-topo">

            <h3>
                💙 Card do Clube
            </h3>

            <button
                type="button"
                class="btn-remover"
            >
                🗑️ Remover
            </button>

        </div>


        <div class="campo">

            <label>
                Título pequeno
            </label>

            <input
                type="text"
                class="clube-titulo-pequeno"
                value="${escaparHTML(
                    item.tituloPequeno || ""
                )}"
                placeholder="Ex.: CLUBE AVENIDA"
            >

        </div>


        <div class="campo">

            <label>
                Título
            </label>

            <input
                type="text"
                class="clube-card-titulo"
                value="${escaparHTML(
                    item.titulo || ""
                )}"
                placeholder="Ex.: Faça parte do Clube Avenida!"
            >

        </div>


        <div class="campo">

            <label>
                Descrição
            </label>

            <textarea
                class="clube-card-descricao"
                rows="5"
                placeholder="Digite a descrição..."
            >${escaparHTML(
                item.descricao || ""
            )}</textarea>

        </div>

    `;


    // ------------------------------------------------------
    // REMOVER CARD
    // ------------------------------------------------------

    card
        .querySelector(".btn-remover")
        .addEventListener(
            "click",
            function () {

                if (
                    !confirm(
                        "Deseja remover este card do Clube Avenida?"
                    )
                ) {

                    return;

                }


                // Descobre qual card foi removido
                const indice =
                    dados.clube.cards.indexOf(
                        item
                    );


                if (indice !== -1) {

                    dados.clube.cards.splice(
                        indice,
                        1
                    );

                }


                card.remove();

            }
        );


    area.appendChild(card);

}


// ==========================================================
// ADICIONAR NOVO CARD DO CLUBE
// ==========================================================

function adicionarCardClube() {

    const novoCard = {

        tituloPequeno:
            "",

        titulo:
            "",

        descricao:
            ""

    };


    dados.clube.cards.push(
        novoCard
    );


    criarCardClube(
        novoCard
    );


    // Colocar o cursor no primeiro campo
    const cards =
        document.querySelectorAll(
            "#clubeCardsEditor .clube-card-editor"
        );


    const ultimo =
        cards[cards.length - 1];


    if (ultimo) {

        ultimo
            .querySelector(
                ".clube-titulo-pequeno"
            )
            ?.focus();

    }

}




// ==========================================================
// NOTÍCIAS
// ==========================================================

function carregarNoticias() {

    const area =
        document.getElementById(
            "noticias"
        );


    if (!area) {

        return;

    }


    area.innerHTML = "";


    dados.noticias.forEach(
        function (noticia) {

            criarCardNoticia(
                area,
                noticia
            );

        }
    );

}


// ==========================================================
// CARD NOTÍCIA
// ==========================================================

function criarCardNoticia(
    area,
    noticia
) {

    const card =
        document.createElement("div");


    card.className =
        "noticia-card-editor";


    card.innerHTML = `

        <div class="card-topo">

            <h3>
                📰 Dica & Notícia
            </h3>

            <button
                type="button"
                class="btn-remover"
            >
                🗑️ Remover
            </button>

        </div>


        <div class="campo">

            <label>
                Categoria
            </label>

            <input
                type="text"
                class="noticia-categoria"
                value="${escaparHTML(noticia.categoria)}"
                placeholder="Ex.: NOVIDADES"
            >

        </div>


        <div class="campo">

            <label>
                Título
            </label>

            <input
                type="text"
                class="noticia-titulo"
                value="${escaparHTML(noticia.titulo)}"
            >

        </div>


        <div class="campo">

            <label>
                Descrição
            </label>

            <textarea
                class="noticia-descricao"
                rows="5"
            >${escaparHTML(noticia.descricao)}</textarea>

        </div>


        <div class="campo">

            <label>
                Imagem
            </label>

            <input
                type="text"
                class="noticia-imagem"
                value="${escaparHTML(noticia.imagem)}"
                placeholder="URL ou caminho da imagem"
            >

            <input
                type="file"
                class="noticia-arquivo"
                accept="image/*"
            >

        </div>


        <div class="campo">

            <label>
                Link
            </label>

            <input
                type="text"
                class="noticia-link"
                value="${escaparHTML(noticia.link)}"
                placeholder="https://..."
            >

        </div>

    `;


    card
        .querySelector(".btn-remover")
        .addEventListener(
            "click",
            function () {

                const indice =
                    dados.noticias.indexOf(
                        noticia
                    );


                if (indice !== -1) {

                    dados.noticias.splice(
                        indice,
                        1
                    );

                }


                card.remove();

            }
        );


    area.appendChild(card);

}


// ==========================================================
// ADICIONAR NOTÍCIA
// ==========================================================

function adicionarNoticia() {

    const nova = {

        categoria:
            "NOVIDADES",

        titulo: "",

        descricao: "",

        imagem: "",

        link: ""

    };


    dados.noticias.push(
        nova
    );


    criarCardNoticia(
        document.getElementById(
            "noticias"
        ),
        nova
    );

}


document
    .getElementById(
        "btnAdicionarNoticia"
    )
    .addEventListener(
        "click",
        adicionarNoticia
    );


// ==========================================================
// COLETAR PRODUTOS
// ==========================================================

async function coletarProdutos() {

    const cards =
        document.querySelectorAll(
            ".produto-card-editor"
        );


    const produtosNovos = [];


    for (
        const card of cards
    ) {

        const arquivo =
            card.querySelector(
                ".produto-arquivo"
            )?.files[0];


        let imagem =
            card.querySelector(
                ".produto-imagem"
            )?.value || "";


        if (arquivo) {

            imagem =
                await converterImagem(
                    arquivo
                );

        }


        produtosNovos.push({

            id:
                card.querySelector(
                    ".produto-id"
                )?.value || "",

            nome:
                card.querySelector(
                    ".produto-nome"
                )?.value || "",

            valor:
                card.querySelector(
                    ".produto-valor"
                )?.value || "",

            imagem:
                imagem
        });

    }


    dados.produtos =
        produtosNovos;

}


// ==========================================================
// COLETAR JORNAL
// ==========================================================


async function coletarJornal() {

    // ------------------------------------------------------
    // CAMPO DE TEXTO
    // ------------------------------------------------------

    const campoFrente =
        document.getElementById("pagfrente");

    const campoVerso =
        document.getElementById("pagverso");


    // ------------------------------------------------------
    // BOTÃO "ESCOLHER ARQUIVO"
    // ------------------------------------------------------

    const arquivoFrente =
        document.getElementById("filePagFrente")
            ?.files[0];

    const arquivoVerso =
        document.getElementById("filePagVerso")
            ?.files[0];


    // ------------------------------------------------------
    // FRENTE
    // ------------------------------------------------------

    let imagemFrente =
        campoFrente?.value || "";


    if (arquivoFrente) {

        imagemFrente =
            await converterImagem(
                arquivoFrente
            );

    }


    // ------------------------------------------------------
    // VERSO
    // ------------------------------------------------------

    let imagemVerso =
        campoVerso?.value || "";


    if (arquivoVerso) {

        imagemVerso =
            await converterImagem(
                arquivoVerso
            );

    }


    // ------------------------------------------------------
    // SALVAR
    // ------------------------------------------------------

    dados.jornal = {

        pagfrente:
            imagemFrente,

        pagverso:
            imagemVerso

    };

}

// ==========================================================
// COLETAR DESTAQUES
// ==========================================================

async function coletarDestaques() {

    const cards =
        document.querySelectorAll(
            ".destaque-card-editor"
        );


    const lista = [];


    for (
        const card of cards
    ) {

        const arquivo =
            card.querySelector(
                ".destaque-arquivo"
            )?.files[0];


        let imagem =
            card.querySelector(
                ".destaque-imagem"
            )?.value || "";


        if (arquivo) {

            imagem =
                await converterImagem(
                    arquivo
                );

        }


        lista.push({

            imgDestaque:
                imagem,

            nomeDestaque:
                card.querySelector(
                    ".destaque-nome"
                )?.value || "",

            descricaoDestaque:
                card.querySelector(
                    ".destaque-descricao"
                )?.value || "",

            valorDestaque:
                card.querySelector(
                    ".destaque-valor"
                )?.value || ""

        });

    }


    dados.destaques =
        lista;

}


// ==========================================================
// COLETAR RECEITAS
// ==========================================================

async function coletarReceitas() {

    const cards =
        document.querySelectorAll(
            ".receita-card-editor"
        );


    const lista = [];


    for (
        const card of cards
    ) {

        const arquivo =
            card.querySelector(
                ".receita-arquivo"
            )?.files[0];


        let imagem =
            card.querySelector(
                ".receita-imagem"
            )?.value || "";


        if (arquivo) {

            imagem =
                await converterImagem(
                    arquivo
                );

        }


        lista.push({

            titulo:
                card.querySelector(
                    ".receita-titulo"
                )?.value || "",

            descricao:
                card.querySelector(
                    ".receita-descricao"
                )?.value || "",

            imagem:
                imagem,

            link:
                card.querySelector(
                    ".receita-link"
                )?.value || ""

        });

    }


    dados.receitas =
        lista;

}


// ==========================================================
// COLETAR CLUBE
// ==========================================================

async function coletarClube() {

    // ======================================================
    // INFORMAÇÕES PRINCIPAIS
    // ======================================================

    dados.clube.tituloPequeno =
        document.getElementById(
            "clubeTituloPequeno"
        )?.value || "";


    dados.clube.titulo =
        document.getElementById(
            "clubeTitulo"
        )?.value || "";


    dados.clube.descricao =
        document.getElementById(
            "clubeDescricao"
        )?.value || "";


    dados.clube.infoTitulo =
        document.getElementById(
            "clubeInfoTitulo"
        )?.value || "";


    dados.clube.infoDescricao =
        document.getElementById(
            "clubeInfoDescricao"
        )?.value || "";



    // ======================================================
    // BOTÃO
    // ======================================================

    dados.clube.botaoTexto =
        document.getElementById(
            "clubeBotaoTexto"
        )?.value || "";


    dados.clube.botaoLink =
        document.getElementById(
            "clubeBotaoLink"
        )?.value || "";



    // ======================================================
    // CARDS
    // ======================================================

    const cards =
        document.querySelectorAll(
            "#clubeCardsEditor .clube-card-editor"
        );


    const lista = [];


    cards.forEach(
        function (card) {

            const tituloPequeno =
                card.querySelector(
                    ".clube-titulo-pequeno"
                );


            const titulo =
                card.querySelector(
                    ".clube-card-titulo"
                );


            const descricao =
                card.querySelector(
                    ".clube-card-descricao"
                );


            lista.push({

                tituloPequeno:
                    tituloPequeno?.value || "",

                titulo:
                    titulo?.value || "",

                descricao:
                    descricao?.value || ""

            });

        }
    );


    dados.clube.cards =
        lista;

}


// ==========================================================
// COLETAR NOTÍCIAS
// ==========================================================

async function coletarNoticias() {

    const cards =
        document.querySelectorAll(
            ".noticia-card-editor"
        );


    const lista = [];


    for (
        const card of cards
    ) {

        const arquivo =
            card.querySelector(
                ".noticia-arquivo"
            )?.files[0];


        let imagem =
            card.querySelector(
                ".noticia-imagem"
            )?.value || "";


        if (arquivo) {

            imagem =
                await converterImagem(
                    arquivo
                );

        }


        lista.push({

            categoria:
                card.querySelector(
                    ".noticia-categoria"
                )?.value || "",

            titulo:
                card.querySelector(
                    ".noticia-titulo"
                )?.value || "",

            descricao:
                card.querySelector(
                    ".noticia-descricao"
                )?.value || "",

            imagem:
                imagem,

            link:
                card.querySelector(
                    ".noticia-link"
                )?.value || ""

        });

    }


    dados.noticias =
        lista;

}


// ==========================================================
// COLETAR TUDO
// ==========================================================

async function coletarDados() {

    await coletarProdutos();

    await coletarJornal();

    await coletarDestaques();

    await coletarReceitas();

    await coletarClube();

    await coletarNoticias();

}


// ==========================================================
// GERAR JSON
// ==========================================================

async function gerarJSON() {

    try {

        await coletarDados();


        const texto =
            JSON.stringify(
                dados,
                null,
                2
            );


        const blob =
            new Blob(
                [texto],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "dados.json";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        setTimeout(
            function () {

                URL.revokeObjectURL(
                    url
                );

            },
            1000
        );


        atualizarStatus(
            "✅ dados.json atualizado e gerado com sucesso!"
        );


        alert(
            "dados.json gerado com sucesso!"
        );

    }

    catch (erro) {

        console.error(
            erro
        );


        atualizarStatus(
            "❌ Erro ao gerar o JSON."
        );


        alert(
            "Ocorreu um erro ao gerar o JSON."
        );

    }

}


// ==========================================================
// BOTÕES GERAR
// ==========================================================

document
    .getElementById(
        "btnGerar"
    )
    .addEventListener(
        "click",
        gerarJSON
    );


// ==========================================================
// INÍCIO
// ==========================================================
//
// O editor começa vazio.
//
// Para carregar os dados:
// 1. Clique em "Escolher arquivo"
// 2. Selecione seu dados.json
//
// Isso evita apagar os dados existentes.
// ==========================================================

atualizarStatus(
    "Nenhum arquivo carregado. Abra seu dados.json para começar."
);


// ==========================================================
// INICIALIZAR
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        transformarSectionsEmCards();

    }
);

// ==========================================================
// TRANSFORMAR SECTIONS EM CARDS RECOLHÍVEIS
// PRESERVANDO BOTÕES E CONTEÚDO
// ==========================================================

function ativarCardsSections() {

    const sections =
        document.querySelectorAll(
            "main > section.bloco"
        );


    sections.forEach(function(section) {

        // Evita executar duas vezes
        if (
            section.dataset.recolhivel === "true"
        ) {
            return;
        }


        section.dataset.recolhivel = "true";


        // ==================================================
        // IDENTIFICAR TÍTULO E DESCRIÇÃO
        // ==================================================

        let titulo = "";
        let descricao = "";


        const secaoHeader =
            section.querySelector(
                ":scope > .secao-header"
            );


        const h2Direto =
            section.querySelector(
                ":scope > h2"
            );


        const pDireto =
            section.querySelector(
                ":scope > p"
            );


        // --------------------------------------------------
        // SECTION COM .secao-header
        // --------------------------------------------------

        if (secaoHeader) {

            const h2 =
                secaoHeader.querySelector("h2");

            const p =
                secaoHeader.querySelector("p");


            if (h2) {

                titulo =
                    h2.textContent.trim();

            }


            if (p) {

                descricao =
                    p.textContent.trim();

            }

        }


        // --------------------------------------------------
        // SECTION COM H2 DIRETO
        // --------------------------------------------------

        else {

            if (h2Direto) {

                titulo =
                    h2Direto.textContent.trim();

            }


            if (pDireto) {

                descricao =
                    pDireto.textContent.trim();

            }

        }


        // ==================================================
        // CRIAR TEXTO ACIMA DA SECTION
        // ==================================================

        const identificacao =
            document.createElement("div");


        identificacao.className =
            "section-identificacao";


        identificacao.textContent =
            titulo || "Seção";


        section.parentNode.insertBefore(
            identificacao,
            section
        );


        // ==================================================
        // CRIAR HEADER RECOLHÍVEL
        // ==================================================

        const header =
            document.createElement("div");


        header.className =
            "bloco-toggle";


        // ==================================================
        // TEXTO DO HEADER
        // ==================================================

        const texto =
            document.createElement("div");


        texto.className =
            "bloco-toggle-conteudo";


        texto.innerHTML = `

            <h2>
                ${escaparHTML(titulo)}
            </h2>

            ${
                descricao
                    ? `
                        <p>
                            ${escaparHTML(descricao)}
                        </p>
                    `
                    : ""
            }

        `;


        // ==================================================
        // SETA
        // ==================================================

        const seta =
            document.createElement("div");


        seta.className =
            "bloco-seta";


        seta.innerHTML =
            "⌄";


        header.appendChild(
            texto
        );

        header.appendChild(
            seta
        );


        // ==================================================
        // CRIAR CONTEÚDO
        // ==================================================

        const conteudo =
            document.createElement("div");


        conteudo.className =
            "bloco-conteudo";


        // ==================================================
        // MOVER ELEMENTOS DA SECTION
        // ==================================================

        const elementos =
            Array.from(
                section.children
            );


        elementos.forEach(
            function(elemento) {

                // ------------------------------------------
                // NÃO MOVER O .secao-header INTEIRO
                // ------------------------------------------
                //
                // Em vez de simplesmente apagar o header,
                // vamos aproveitar os botões existentes.
                //

                if (
                    elemento === secaoHeader
                ) {

                    // --------------------------------------
                    // PEGAR OS BOTÕES DO HEADER
                    // --------------------------------------

                    const botoes =
                        Array.from(
                            secaoHeader.querySelectorAll(
                                "button"
                            )
                        );


                    // --------------------------------------
                    // MOVER OS BOTÕES PARA O NOVO HEADER
                    // --------------------------------------

                    botoes.forEach(
                        function(botao) {

                            botao.classList.add(
                                "botao-header-section"
                            );

                            header.appendChild(
                                botao
                            );

                        }
                    );


                    return;

                }


                // ------------------------------------------
                // NÃO MOVER H2 DIRETO
                // ------------------------------------------

                if (
                    elemento.tagName === "H2"
                ) {

                    return;

                }


                // ------------------------------------------
                // NÃO MOVER P USADO COMO DESCRIÇÃO
                // ------------------------------------------

                if (
                    elemento.tagName === "P" &&
                    h2Direto &&
                    elemento.previousElementSibling === h2Direto
                ) {

                    return;

                }


                // ------------------------------------------
                // MOVER TODO O RESTANTE
                // ------------------------------------------

                conteudo.appendChild(
                    elemento
                );

            }
        );


        // ==================================================
        // LIMPAR SECTION
        // ==================================================

        section.innerHTML = "";


        // ==================================================
        // INSERIR NOVA ESTRUTURA
        // ==================================================

        section.appendChild(
            header
        );


        section.appendChild(
            conteudo
        );


        // ==================================================
        // ABRIR / FECHAR
        // ==================================================

        header.addEventListener(
            "click",
            function(evento) {

                // ------------------------------------------
                // SE CLICOU EM UM BOTÃO,
                // NÃO ABRIR/FECHAR A SECTION
                // ------------------------------------------

                if (
                    evento.target.closest("button")
                ) {

                    return;

                }


                section.classList.toggle(
                    "aberto"
                );

            }
        );

    });

}

// ==========================================================
// INICIALIZAR SECTIONS
// ==========================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        ativarCardsSections
    );

}
else {

    ativarCardsSections();

}