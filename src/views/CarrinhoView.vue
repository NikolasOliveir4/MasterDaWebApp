<template>
<div>
  <Carrinho/>
  <div class="abas">
    <router-link class="aba" to="/admin">Ir para Admin</router-link>
  </div>

</div>
</template>

<script>
import Carrinho from '../components/Carrinho'
export default {
  name: 'CarrinhoView',
  components: {
    Carrinho
  }
}
</script>
