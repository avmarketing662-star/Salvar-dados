// ======================================
// GERADOR DE PRODUTOS.JSON
// ======================================


// Lista de produtos

const listaProdutos = [

    {
        categoria:"Mercearia",
        prefixo:"Merc",
        quantidade:6
    },

    {
        categoria:"Bebidas",
        prefixo:"Beb",
        quantidade:6
    },

    {
        categoria:"Açougue",
        prefixo:"Aco",
        quantidade:6
    },

    {
        categoria:"Higiene",
        prefixo:"Hig",
        quantidade:6
    },

    {
        categoria:"Padaria",
        prefixo:"Pad",
        quantidade:6
    }

];



let produtos = [];



// ======================================
// CRIAR CAMPOS DOS PRODUTOS
// ======================================


function criarProdutos(){


    const area =
    document.getElementById("produtos");


    listaProdutos.forEach(grupo=>{


        const titulo =
        document.createElement("h2");


        titulo.innerHTML =
        "📦 " + grupo.categoria;


        area.appendChild(titulo);



        for(let i=1;i<=grupo.quantidade;i++){


            const id =
            grupo.prefixo + i;



            produtos.push({

                id:id,
                nome:"",
                valor:"",
                imagem:"",
                imagemJornal:""

            });



            const card =
            document.createElement("div");


            card.className =
            "produto-card";



            card.innerHTML = `

                <h3>${id}</h3>


                <div class="campo">

                    <label>ID</label>

                    <input 
                    class="id"
                    value="${id}"
                    readonly>

                </div>


                <div class="campo">

                    <label>Nome</label>

                    <input
                    class="nome">

                </div>


                <div class="campo">

                    <label>Valor</label>

                    <input
                    class="valor">

                </div>


                <div class="campo">

                    <label>Imagem (URL)</label>

                    <input
                    class="imagem">

                </div>


                <div class="campo">

                    <label>Arquivo da imagem</label>

                    <input
                    type="file"
                    class="arquivoImagem"
                    accept="image/*">

                </div>


                <div class="campo">

                    <label>Imagem Jornal</label>


                    <select class="imagemJornal">

                        <option value="">
                            Nenhuma
                        </option>

                        <option value="pagfrente">
                            Página Frente
                        </option>


                        <option value="pagverso">
                            Página Verso
                        </option>


                    </select>

                </div>


            `;



            area.appendChild(card);


        }


    });


}



// ======================================
// CONVERTER IMAGEM
// ======================================


function converterImagem(arquivo){


    return new Promise(resolve=>{


        if(!arquivo){

            resolve("");

            return;

        }


        const leitor =
        new FileReader();



        leitor.onload=()=>{

            resolve(leitor.result);

        };


        leitor.readAsDataURL(arquivo);


    });


}




// ======================================
// PEGAR PRODUTOS
// ======================================


async function pegarProdutos(){


    const cards =
    document.querySelectorAll(".produto-card");



    produtos=[];



    for(const card of cards){


        const arquivo =
        card.querySelector(".arquivoImagem").files[0];


        let imagem =
        card.querySelector(".imagem").value;



        if(arquivo){

            imagem =
            await converterImagem(arquivo);

        }



        produtos.push({

            id:
            card.querySelector(".id").value,


            nome:
            card.querySelector(".nome").value,


            valor:
            card.querySelector(".valor").value,


            imagem:imagem,


            imagemJornal:
            card.querySelector(".imagemJornal").value


        });


    }


}



// ======================================
// GERAR JSON
// ======================================


document
.getElementById("btnGerar")
.addEventListener("click",async()=>{


    await pegarProdutos();



    const json={


        produtos:produtos,


        jornal:{


            pagfrente:
            document.getElementById("pagfrente").value,


            pagverso:
            document.getElementById("pagverso").value


        },


        destaque:{


            imgDestaque:
            document.getElementById("imgDestaque").value,


            nomeDestaque:
            document.getElementById("nomeDestaque").value,


            descricaoDestaque:
            document.getElementById("descricaoDestaque").value,


            valorDestaque:
            document.getElementById("valorDestaque").value


        }


    };



    baixarJSON(json);


});



// ======================================
// BAIXAR ARQUIVO
// ======================================


function baixarJSON(dados){


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
            type:"application/json"
        }
    );



    const link =
    document.createElement("a");


    link.href =
    URL.createObjectURL(blob);



    link.download =
    "dados.json";


    link.click();


}



// Iniciar

criarProdutos();