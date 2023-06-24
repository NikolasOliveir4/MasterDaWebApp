
<template>
  <div>
    <div class="w-100 abas">
      <a href="#" class="aba" @click="AltAba('pedido')">Pedidos</a>
      <a href="#" class="aba" @click="AltAba('produto')">Produtos</a>
      <router-link class="aba" to="/">Voltar para Carrinho  <b-icon-cart-fill></b-icon-cart-fill></router-link>
    </div>

   <div>
      <div  v-if="tipo_aba == 'pedido'" style="width: 20%" class="m-3">
        <input class="w-100 mb-2" type="text" name="search_name" id="search_name" v-model="search_name" @keyup="searchInput" placeholder="Filtrar por Pedido">

      </div>
      <div  v-if="tipo_aba == 'produto'" style="width: 20%" class="m-3">
        <input class="w-100 mb-2" type="text" name="search_name" id="search_name" v-model="search_name" @keyup="searchInput_produto" placeholder="Filtrar por Nome ou Preço">
        <a href="#" class="btn btn-success d-flex justify-content-start" @click="isEdit_produto = false, showModal_produto = true, ProdutoSelected = null">Cadastrar Produto</a>
      </div>

   </div>

    <b-table  v-if="tipo_aba == 'pedido'" striped hover :items="pedidos" :fields="fields">
      <template #cell(total)="row">
        <div>{{ formatarMoeda(row.item.total) }}</div>
      </template>

      <template #cell(actions)="row">
        <a href="#" class="btn btn-primary me-2" @click="viewPedido(row.item)"><b-icon icon="eye"></b-icon> Detalhes</a>
        <a href="#" class="btn btn-danger" @click="deletePedido(row.item.id,row.index)"><b-icon icon="trash-fill" aria-hidden="true"></b-icon> Deletar</a>
      </template>

    </b-table>
    <b-table  v-if="tipo_aba == 'produto'" striped hover :items="produtos" :fields="fields_produto">


      <template #cell(preco)="row">
        <div>{{ formatarMoeda(row.item.preco) }}</div>
      </template>
     
      <template #cell(actions)="row">
        <a href="#" class="btn btn-warning me-2" @click="editProduto(row.item)"><b-icon icon="tools"></b-icon> Editar</a>
        <a href="#" class="btn btn-danger" @click="deleteProduto(row.item.id,row.index)"><b-icon icon="trash-fill" aria-hidden="true"></b-icon> Deletar</a>
      </template>

    </b-table>
    <CardPedido 
      v-if="showModal"
      v-bind:showModal="showModal"
      v-bind:customer="PedidoSelected"
      v-bind:isView="isView"
      v-on:closeModal="showModal = false"
      v-on:createPedido="createPedido($event)"
    />
    <CardProduto 
      v-if="showModal_produto"
      v-bind:showModal_produto="showModal_produto"
      v-bind:customer="ProdutoSelected"
      v-bind:isEdit_produto="isEdit_produto"
      v-on:closeModal_produto="showModal_produto = false"
      v-on:updateProduto="updateProduto($event)"
      v-on:createProduto="createProduto($event)"
    />
  </div>
</template>

<script>
import axios from "axios";
import CardPedido from "./CardPedido"
import CardProduto from "./CardProduto"
  export default{
    name: 'Table',
    components:{
      CardPedido,
      CardProduto,
    },
    data() {
      return {
        pedidos: [],
        produtos: [],
        search_name: "",
        tipo_aba: 'produto',
        timeout: null,
        showModal: false,
        showModal_produto: false,
        PedidoSelected: null,
        ProdutoSelected: null,
        isView: null,
        isEdit_produto: null,
         fields: [
          {
            key: 'id',
            label: '#Pedido',
            sortable: true
          },
          {
            key: 'cliente_id',
            sortable: true
          },
          {
            key: 'status',
            sortable: true
          },
          {
            key: 'total',
            sortable: true
            // Variant applies to the whole column, including the header and footer
          },
           {
            key: 'actions',
            label: 'Ações',
            // Variant applies to the whole column, including the header and footer
          }
        ],
         fields_produto: [
          {
            key: 'nome',
            sortable: true
          },
          {
            key: 'descricao',
            label: 'Descrição',
            sortable: true
          },
          {
            key: 'preco',
            label: 'Preço',
            // Variant applies to the whole column, including the header and footer
          },
          {
            key: 'actions',
            label: 'Ações',
            // Variant applies to the whole column, including the header and footer
          }
        ],
      }
    },

  mounted(){
    this.getPedidos();
    this.getProdutos();
  },

  methods: {
    async AltAba(tipo){
        this.tipo_aba = tipo
        console.log(this.tipo_aba);
    },

   async getPedidos(){
    try {
     const res = await axios.get("http://localhost:8000/pedidos");
      // console.log(res.data.pedidos);
      res.data.pedidos.map((value)=>{

      })
      this.pedidos = res.data.pedidos;
    } catch (error) {
      //Silent error
    }
      
    },

     async getProdutos(){
        try {
          const res = await axios.get("http://localhost:8000/produtos");
          // console.log(res.data.produtos);
          res.data.produtos.map((value)=>{
            
          })
          this.produtos = res.data.produtos;
          } catch (error) {
          //Silent error
        }
            
    },

    async deletePedido(id, k){
      console.log(k)
      const result = await this.$swal("Deletar Pedido", "Você tem certeza?", "warning");
      if (!result.isConfirmed) return;
      try { 
        const res = await axios.delete(`http://localhost:8000/pedidos/delete/${id}`);
        if(res.status == 200){
          const deleted = await this.$swal("Pedido excluído", "", "success");
          this.pedidos.splice(k,1);
        }
      } catch (error) {
        //Silent error
      }
    },
    async createPedido(pedido) {
        console.log(pedido,'pedido');

      try { 
        const res = await axios.post('http://localhost:8000/pedidos',pedido);
        if(res.status == 200){
          this.pedidos = res.data.pedidos;
          const result = await this.$swal("Funcionário inserido", "", "success");
          console.log(res.data.pedidos);
        }
      } catch (error) {
        //Silent error
      }
    },
    async deleteProduto(id, k){
      console.log(k)
      const result = await this.$swal("Excluir Produto", "Você tem certeza?", "warning");
      if (!result.isConfirmed) return;
      try { 
        const res = await axios.delete(`http://localhost:8000/produtos/delete/${id}`);
        if(res.status == 200){
          const deleted = await this.$swal("Produto excluído", "", "success");
          this.produtos.splice(k,1);
        }
      } catch (error) {
        //Silent error
      }
    },
    async createProduto(produto) {
        // console.log(produto.preco,'produto');
        produto.preco = produto.preco.replace(/[^0-9]/g, "").replace(/(\d{2})$/, ".$1");
      try { 
        const res = await axios.post('http://localhost:8000/produtos',produto);
        if(res.status == 200){
          this.produtos = res.data.produtos;
          const result = await this.$swal("Produto inserido", "", "success");
          console.log(res.data.produtos);
        }
      } catch (error) {
        //Silent error
      }
    },
    async updateProduto(produtos) {
      // console.log(produtos);
      // console.log('CHEGUEI NO UPDATE')
      produtos.preco = produtos.preco.replace(/[^0-9]/g, "").replace(/(\d{2})$/, ".$1");
      try { 
        const res = await axios.put(`http://localhost:8000/produtos/${produtos.id}`,produtos);
        if(res.status == 200){
          this.produtos = res.data.produtos;
          const result = await this.$swal("Produto atualizado", "", "success");
          console.log(this.produtos);
        }
      } catch (error) {
        //Silent error
      }
    },

    async viewPedido(e) {
      // console.log(e)
      try { 
          const res = await axios.get(`http://localhost:8000/pedido_produtos/${e.id}`);
        if(res.status == 200){
           this.PedidoSelected = res.data.pedido_produtos;
           this.isView = true;
           this.showModal = true;


          // console.log(this.PedidoSelected);
        }
      } catch (error) {
        //Silent error
      }

      
      // this.PedidoSelected = e;
    },
    editProduto(e) {
      console.log(e)
      this.showModal_produto = true;
      this.isEdit_produto = true;
      this.ProdutoSelected = e;
    },
    searchInput({target}) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(async ()=>{
        try {
          const res = await axios.get(`http://localhost:8000/pedidos/search?q=${target.value}`);
          console.log(res);
          this.pedidos = res.data.pedidos;
        } catch (err) {
        	//Silent error
        }
      }, 300);
    },
    searchInput_produto({target}) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(async ()=>{
        try {
          const res = await axios.get(`http://localhost:8000/produtos/search?q=${target.value}`);
          console.log(res);
          this.produtos = res.data.produtos;
        } catch (err) {
        	//Silent error
        }
      }, 300);
    },

    formatarMoeda(valor) {
      const valorNumerico = Number(valor);
      return 'R$ ' + valorNumerico.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

  }
}
</script>

<style scoped lang="scss">
  ::v-deep .sr-only {
    display: none;
  }
  table {
    width: 100%;
  }

  
</style>