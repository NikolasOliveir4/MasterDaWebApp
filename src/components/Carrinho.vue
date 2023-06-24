<template>
  <div>
    <section class="container">
      <img src="https://www.masterdaweb.com/images/logo-white-blue.png" alt="" style="max-width: 500px;">
      <div class="box">
        <h1>LISTA DE PRODUTOS</h1>
        <div class="linha"></div>
        <p v-if="produtos.length > 0">Escolha uma das opções abaixo</p>
        <div v-else>
            <p>Não há produtos cadastrados,<router-link to="/admin">Clique aqui para cadastrar</router-link></p>
            <!-- <a href="#" class="btn btn-primry btn-sm">Cadastrar produtos</a> -->
        </div>

     <div class="product-list">
        <div class="product-card" v-for="product in produtos" :key="product.id">
        <img src="https://via.placeholder.com/200x200" alt="Product Image" class="product-image">
        <!-- {{product}} -->
            <div class="product-details">
                <div class="product-info">
                    <div style="display: flex; align-items: center; justify-content: center">
                        <button class="add-button" @click="inserePedido(product)">+</button>
                        <div class="product-name">{{ product.nome }}</div>
                    </div>
                    <div>
                    {{ formatarMoeda(product.preco) }}
                    </div>
                </div>
            </div>
        </div>
    </div>

        <h1>CHECKOUT</h1>
        <div class="linha"></div>
        <p>Resumo da compra</p>
        <p>TOTAL: {{formatarMoeda(pedido.total)}}</p>
        <!-- {{pedido.produtos}} -->
        <div class="resumo">
          <div class="horizontal" >
            <table class="table">
              <thead>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Ações</th>
              </thead>
              <tbody>
                <tr v-for="(produto, index) in pedido.produtos" :key="index">
                  <td class="text-center">{{ produto.nome }}</td>
                  <td class="text-center">{{ produto.quantidade }}</td>
                  <td class="text-center">
                    <b-button v-if="produto.quantidade > 1" variant="danger" class="delete-button me-2" @click="removerUnidade(index)">
                      -1
                    </b-button>
                    <b-button variant="danger" class="delete-button" @click="removerProduto(index)">
                      <b-icon-trash></b-icon-trash>
                    </b-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- <div class="quantidade-e-produtos">
              <div class="quantidade">{{ produto.quantidade }}</div>
              <div class="linha-vert"></div>
              <div class="nome-produto">{{ produto.nome }}</div>
            </div> -->
            <!-- <b-table :items="pedido.produtos" :fields="fields" striped hover>
                <template #cell(actions)="row">
                    <a class="btn btn-danger me-2" @click="removerProduto(index)"><b-icon icon="trash-fill"></b-icon></a>
                    <a v-if="produto.quantidade > 1" class="btn btn-danger" @click="removerUnidade(index)"> -1</a>
                </template>
            </b-table> -->
            
          </div>
        </div>

        <b-button variant="primary" class="cart-button fechar-pedido" @click="createPedido(pedido)">
            <b-icon-cart-fill></b-icon-cart-fill>
            FECHAR PEDIDO
          </b-button>
      </div>
      <div class="copyright">
        <p style="color: white; margin-top: 1rem;">Copyright 2023 - Master da Web</p>
      </div>
    </section>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: 'Carrinho',
  data() {
    return {
      slide: 0,
      produtos: [],
      pedido: {
          total: 0,
          produtos: []
        },
      fields: [
        { key: "nome", label: "Produto" },
        { key: "quantidade", label: "Quantidade" },
        { key: "actions", label: "Ações" },
      ],
    };
  },
  mounted(){

    this.getProdutos();
  },
  methods: {
    removerProduto(index) {
      this.pedido.produtos.splice(index, 1);
      this.calculaTotal();
    },
    removerUnidade(index){
        this.pedido.produtos[index].quantidade--;
        this.calculaTotal()
    },
    async getProdutos(){
        // console.log('AQUI ESTOU')
        try {
          const res = await axios.get("http://localhost:8000/produtos");
        //   console.log(res);
        //   console.log(res.data.produtos);
          res.data.produtos.map((value)=>{
            
          })
          this.produtos = res.data.produtos;
          } catch (error) {
            console.log(error)
        }
            
    },
     calculaTotal() {
        let total = 0;
        for (let produto of this.pedido.produtos) {
            total += parseFloat(produto.preco) * parseFloat(produto.quantidade);
        }
        this.pedido.total = total; // Atribui o valor total calculado à propriedade 'total' do objeto 'pedido'
        console.log(total); // Exibe o valor total no console
        return this.pedido.total;
    },
    
    formatarMoeda(valor) {
      const valorNumerico = Number(valor);
      return 'R$ ' + valorNumerico.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    async inserePedido(produto) {
        // Verifica se o produto já existe no pedido pelo ID
        const produtoExistente = this.pedido.produtos.find(p => p.id === produto.id);

        if (produtoExistente) {
            // Se o produto já existe, incrementa a quantidade
            produtoExistente.quantidade++;
        } else {
            // Se o produto não existe, adiciona no array de produtos com quantidade igual a 1
            produto.quantidade = 1;
            this.pedido.produtos.push(produto);
        }

        this.calculaTotal();
    },

    async createPedido(pedido) {

        if(pedido.produtos.length > 0){
            pedido.status = "analise"
            pedido.cliente_id = 1
            console.log(JSON.stringify(pedido),'pedido');
    
          try { 
            const res = await axios.post('http://localhost:8000/pedidos',pedido);
            if(res.status == 200){
              this.pedido = {
                total: 0,
                produtos:[]
              };
              const result = await this.$swal("Pedido efetuado", "", "success");
              console.log(res.data.pedidos);
            }
          } catch (error) {
            //Silent error
          }
        }else{
              const result = await this.$swal("Não há produtos no carrinho", "", "warning");
        }
    },
  }
};
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

    * {
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Roboto', sans-serif;
        background-color: blueviolet;
    }

    h1 {
        font-weight: bold;
        letter-spacing: 4px;
    }

    p {
        color: #808080;
        font-variant: all-small-caps;
        letter-spacing: 2px;
        font-size: larger;
    }

    .product-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    }

    .product-card {
    width: 200px;
    height: 300px;
    background-color: #f1f1f1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    }

    .product-image {
    width: 200px;
    height: 200px;
    object-fit: cover;
    }

    .product-details {
    display: flex;
    align-items: flex-end;
    }

    .product-info {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 0.5rem;
    }

    .add-button {
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    background-color: blueviolet;
    color: white;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    }

    .product-name {
    font-weight: bold;
    font-size: 1rem;
    margin-left: 0.5rem;
    }
    .linha {
        background-color: blueviolet;
        width: 15%;
        height: 5px;
        margin-bottom: .5rem;
        border-radius: 20px;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .box {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #f0f0f0;
        width: 100%;
        max-width: 700px;
        border-radius: 10px;
        box-shadow: 0px 1px 20px -5px black;
        margin-top: 2rem;
        padding: 2rem;
    }

    #carouselExampleControls {
        width: 100%;
        margin-bottom: 2rem;
    }

    .carousel-inner {
        background-color: white;
        padding: 0rem 1rem;
        height: 300px;
        border-radius: 10px;
    }

    .produto-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .produto-imagem {
        width: 90%;
        height: 200px;
        background: url("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/1022px-Placeholder_view_vector.svg.png");
        background-size: cover;
        background-position-y: center;
        background-position-x: center;
        background-repeat: no-repeat;
    }

    .produto {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90%;
        height: 100px;
    }

    .carousel-control-next, .carousel-control-prev {
        width: 10%;
        background: #f0f0f0;
        opacity: 1;
    }

    .carousel-control-next:focus, .carousel-control-next:hover, .carousel-control-prev:focus, .carousel-control-prev:hover {
        opacity: 1;
    }

    .carousel-control-next {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    .carousel-control-prev {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    .adicionar-item {
        height: 1.5rem;
        width: 1.5rem;
        background-color: blueviolet;
        border: none;
        border-radius: 5px;
        color: white;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        margin-right: .3rem;
    }

    .resumo {
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: #d0d0d0;
    }

    .apagar {
        height: 1.5rem;
        width: 1.5rem;
        background-color: red;
        border: none;
        border-radius: 5px;
        color: white;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: .7rem;
    }

    .fechar-pedido {
        width: 100%;
        background-color: white;
        padding: .8rem;
        color: #808080;
        letter-spacing: 1px;
        font-weight: bold;
        border: none;
    }

    .fechar-pedido:hover {
        background-color: blueviolet;
        color: white;
    }

    .horizontal {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        padding: .5rem;
    }

    .quantidade-e-produtos {
        display: flex;
        flex-direction: row;
    }

    .linha-vert {
        background-color: #808080;
        width: 1px;
        height: 2.5rem;
        margin: -.5rem 1rem -1rem 1rem;
    }

    .quantidade {
        margin-left: .5rem;
    }
</style>
