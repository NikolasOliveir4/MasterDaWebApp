<template>
    <b-modal id="modal-1" v-model="openModal" size="xl" footer-class="d-none" v-on:hidden="$emit('closeModal')">
       <div>
        <h2>DETALHES</h2>
            <b-table :items="dados" :fields="fields" striped hover>
                 <template #cell(preco_unitario)="row">
                    <div>{{ formatarMoeda(row.item.preco_unitario) }}</div>
                </template>
                 <template #cell(subtotal)="row">
                    <div>{{ formatarMoeda(row.item.subtotal) }}</div>
                </template>
            </b-table>
            <div>
                TOTAL PEDIDO: {{formatarMoeda(total)}}
            </div>
        </div>
    </b-modal>
</template>
<script>
import axios from "axios";

export default {
    name: 'CardPedido',
    props:{
        showModal: {
            type: Boolean,
            default: false,
        },
        customer: { type: Array },
        isView: { type: Boolean }
    },
    data(){
        return{
            openModal: this.showModal || false,
            pedido: this.customer,
            dados:[],
            fields: [
                { key: "nome", label: "Produto" },
                { key: "quantidade", label: "Quantidade" },
                { key: "preco_unitario", label: "Preço Unitário" },
                { key: "subtotal", label: "Total" },
            ],
            total: 0,
        };
    },
    mounted(){
        // console.log(this.pedido,'eu aqui he')
        this.getExpecProduct(this.pedido);
        this.total = this.calculaTotal(this.pedido)
        // this.today = this.getToday()
        // this.getVacinas()
    },
    methods: {

        async getExpecProduct(pedido){
            const dados = [];
        //    var pedido_produtos =  Object.values(pedido);
        //    console.log(pedido_produtos)

    
            for (let i = 0; i < Object.values(pedido).length; i++) {
                const produtoId = pedido[i].produto_id;
                
                try {
                const response = await axios.get(`http://localhost:8000/produtos/${produtoId}`);
                const produto = response.data.produto;

                    // console.log(produto,'PRODUTO AQUI')
                    const dado = {
                        nome: produto.nome,
                        quantidade: pedido[i].quantidade,
                        preco_unitario: pedido[i].preco_unitario,
                        subtotal: pedido[i].subtotal
                    };
                    
                    dados.push(dado);
                    
            
                
                } catch (error) {
                console.error(`Erro ao obter dados do produto com ID ${produtoId}:`, error);
                }
            }

            this.dados = dados;
            
            return dados;
        },
        formatarMoeda(valor) {
            const valorNumerico = Number(valor);
            return 'R$ ' + valorNumerico.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        },

        closeModal() {
            this.$emit('closeModal');
        },
        calculaTotal(pedido) {
            console.log(this.pedido,'calcul')
            // pedido.preco
            let total = 0;
            for (let produto of pedido) {
                total += parseFloat(produto.preco_unitario) * parseFloat(produto.quantidade);
                console.log(pedido.preco);
            }
             // Exibe o valor total no console
            return total
         },
    },
};
</script>

<style lang="scss" scoped>

.comorbidade-label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

</style>



