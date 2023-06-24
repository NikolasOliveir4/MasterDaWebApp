import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import CarrinhoView from '../views/CarrinhoView.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'carrinho',
    component: CarrinhoView
  },
  {
    path: '/admin',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
