<template>
  <div id="app">
    <Header/>
    <router-view/>
  </div>
</template>



<script>
import Header from './components/Header'
import Home from './views/Home'
import CarrinhoView from './views/CarrinhoView'
export default {
  components:{
    Header,
    Home,
    CarrinhoView
  }
}
</script>

<style lang="scss">
@import './assets/styles/styles.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

