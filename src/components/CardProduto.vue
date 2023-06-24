<template>
   <b-modal id="modal-2" v-model="openModal_produto" size="xl" footer-class="d-none" v-on:hidden="$emit('closeModal_produto')">
        <h1 v-if="isEdit_produto" class="d-flex justify-content-center" style="color: #2196f3">Atualizar dados</h1>
        <h1 v-else class="d-flex justify-content-center" style="color: #2196f3">Cadastrar Produto</h1>
        <div class="container">
            <div class="produtos">
                <div class="campo">
                    <p>Nome</p>
                    <input type="text" class="nome_produto" id="nome_produto" v-model="produto.nome" placeholder="Nome..."> 
                </div>
                <div class="campo">
                    <p>Descrição</p>
                    <input type="text" class="descricao_produto" id="descricao_produto"  v-model="produto.descricao" placeholder="Descrição produto..."> <!-- INPUT LOTE -->
                </div>
                <div class="campo">
                    <p>Preço</p>
                    <input type="text" id="preco_produto" class="preco_produto" v-model="produto.preco" placeholder="R$0,00" @input="formatarValor" @keypress="validarNumeros"> <!-- INPUT DATA DE VALIDADE -->
                </div>
            </div>
             <div class="break"></div>
            <div class="enviar" style="display: flex; justify-content: space-between; gap: 80px">
                <input v-if="isEdit_produto" @click="validation('edit')" type="button" value="SALVAR">
                <input v-else @click="validation('create')" type="button" value="SALVAR">
                <input @click="closeModal_produto" type="button" value="CANCELAR">
            </div>
        </div>
    </b-modal>
</template>
<script>
import axios from "axios";

export default {
    name: 'CardProduto',
    props:{
        showModal_produto: {
            type: Boolean,
            default: false,
        },
        customer: { type: Object },
        isEdit_produto: { type: Boolean }
    },
    data(){
        return{
            openModal_produto: this.showModal_produto || false,
            produto: {...this.customer} || {id:0,nome:'',descricao:'',preco:10.00},
            message: "",
            today: null,
        };
    },
    mounted(){
        // console.log(this.produto,'EU')
    },
    methods: {

        
        closeModal_produto() {
            this.$emit('closeModal_produto');
        },
        sendData(type) {
            
            if(type == 'edit'){
                
                this.$emit('updateProduto',this.produto);
            }else{
                this.$emit('createProduto',this.produto);
            }
            this.$emit('closeModal_produto');
            

        },
        async validation(type) {
            let erro = "";
            let erro_nome = [];
            

            if(!this.produto.nome){
                erro+= '<br>Preencha o Nome'
            }
            if(!this.produto.descricao){
                erro+= '<br>Preencha a Descrição'
            }
            if(!this.produto.preco){
                erro+= '<br>Preencha o Preço'    
            }
                

            if(erro != "") {
                    const result = this.$swal("Atenção!", erro, "warning");

                } else {
                    this.sendData(type)
                }
            
        },

        formatarValor() {
            if (this.produto.preco !== "") {
                this.produto.preco = this.produto.preco.replace(/\D/g, "");
                const valorNumerico = Number(this.produto.preco) / 100;
                this.produto.preco = valorNumerico.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
                });
            }
        },
        validarNumeros(event) {
            const key = String.fromCharCode(event.keyCode);
            const regex = /[0-9]|\./;
            if (!regex.test(key)) {
                event.preventDefault();
            }
        }

    },
};
</script>

<style>

</style>