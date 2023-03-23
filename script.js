//  cart representa o carrinho de compras, tudo oq for selecionado vai ser adicionado aqui
let cart = [];
let modalQt = 1;
//  variavel usada para identificar qual pizza foi aberta no modal, vai ganhar valores ao longo da seleção
let modalKey = 0;

//  Constante que pega o querySelector do parametro indicado
const c = (el) => document.querySelector(el);
//  retorna um array com os itens encontrados 
const cs = (el) => document.querySelectorAll(el);

//  Listagem das Pizzas
//  mapeando o prórprio JSON e os index dos itens
pizzaJson.map((item, index) => {
    // clonando itens / parametro true para pega o item e tudo o que houver nele
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //  Armazena na variavel a pizza o qual o usuario clicou e mostra na tela de selecao
    //  prefixo DATA indica algo sobre a informação especifica a qual se faz referencia
    pizzaItem.setAttribute('data-key', index);
    //  preencher as informações em pizzaitem (adicionar pizzas)
    //  seleciona o atributo img da tag / altera o SRC
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    //  toFixed usado para determinar quantas casas mostra depois da vírgula
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    //  Evento de click para exibir informações sobre cada pizza / parametro recebe o Evento em si (e)
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        //  previne a ação padrão, ou seja, remove a ação padrão de clicar na tag 'a' onde a pagina recarrega
        e.preventDefault();
        //  adicionando o nome da pizza no modal / parametro é o próprio elemento
        //  closest pega o parâmetro mais proximo que contenha a div mencionada
        //  valor setado no 'data-key' é mostrado aqui
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        //  reseta a quantidade
        modalQt = 1;
        //  ao abrir o modal, não se sabe a pizza selecionada, para isso usaremos o modalKey
        modalKey = key;

        //  substituindo as informações '---' pelo nome da pizza de forma dinamica
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        //  Tira a seleção automatica da pizza grande para o qual o usuário escolher;
        c('.pizzaInfo--size.selected').classList.remove('selected');

        //  Tamanho da pizza de forma dinamica
        /*  
            'forEach' função que roda algo para cada um dos itens 
            1º parametro recebe o próprio item nomeado de 'size' 
            2º parametro index para saber qual item está selecionado
        */
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            //  Desceleciona os tamanhos de pequeno e médio ao clicar fora, retornarndo a seleção da grande;
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];      
        });

        //  configurando quantidade de pizza selecionadas do modal
        c('.pizzaInfo--qt').innerHTML = modalQt;

        //  programando a janela
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        //  espera 200ms para ativar o estado de opacidade 1
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        },200);
    });

    c('.pizza-area').append(pizzaItem);
});

//  Eventos do Modal

//  fechar modal
function closeModal(){
    //  deixa o modal invisível mas ainda está lá
    c('.pizzaWindowArea').style.opacity = 0;
    //  aguarda 0,5s e exclui o modal
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    },500);
}

//  aplicando as funções de fechar modal nos botões
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    //  condição para caso ser menor do que 1, não executa
    if(modalQt > 1){
        modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    }
 
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    //  adiciona a quantidade de pizzas no modal
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });      
});

//  botão 'adicionar carrinho'
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //  Qual a pizza (modal key vai buscar na lista)
    //  Qual o tamanho (data-key é a classe dos botões de tamanho)
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    //  Quantas pizzas (é o próprio modalQt)

    //  Identificador que verifica o tamanho e id das pizzas e mantém em um só objeto as equivalências
    let identifier = pizzaJson[modalKey].id+'@'+size;

    //  Verificando se o identificador ja existe (se no carrinho aquela pizza ja foi escolhida)
    //  se ja existir, adiciona o pedido no mesmo carrinho / identifier
    //  '==' realiza verificação / '=' realiza atribuição
    let key = cart.findIndex((item)=>{
        return item.identifier == identifier
    });

    //  caso exista no carrinho, adicione / SENÃO existir, crie (.push)
    if(key > -1){
        cart[key].qt += modalQt;
    } else{
    //  adicionando no carrinho
    //  ao executar o 'cart' no console, ele cria um array com as informações desse objeto de acordo com a pizza escolhida
    cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt
    });
    }
    //  função para atualizar o carrinho antes de fechar o modal
    updateCart();
    //  fechando modal após inserir no carrinho
    closeModal();

});

//  evento de click no botão de carrinho mobile
c('.menu-openner').addEventListener('click', () => {
    //  condição para abrir o carrinho se houver 1 ou mais pizzas
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

//  atribuindo ação para o botão de fechar o carrinho no mobile
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

//  criando a janela do carrinho
function updateCart(){

    //  configurando carrinho no mobile
    c('.menu-openner span').innerHTML = cart.length;


    //  caso tenha mais de um item, remove o display none da tag 'aside' (carrinho)
    if(cart.length > 0){
        c('aside').classList.add('show');
        //  zerando para depois mostrar
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        //  pegando cada item pra exibir no carrinho
        for(let i in cart){
            //  busca o ID do item, verifica com os IDs do Json e retorna o item que coincidir
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            //  Exibindo o tamanho no carrinho
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1: 
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    //  se qt for menor que 1, tira o item do carrinho
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            c('.cart').append(cartItem);
            
            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


        }
    } else {
        c('aside').classList.remove('show');
        //  efeito de fechar modal quando estiver com 0 pizzas NO MODO MOBILE
        c('aside').style.left = '100vw';
    }
};