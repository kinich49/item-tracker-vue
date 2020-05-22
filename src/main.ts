import Vue from 'vue'
import App from './App.vue'
import ShoppingList from './components/ShoppingList.vue'
import Home from './components/Home.vue'
import AnalyticsSearch from './components/AnalyticsSearch.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/shoppingList',
    component: ShoppingList
  },
  {
    path: '/analytics',
    component: AnalyticsSearch
  }

]

const router = new VueRouter({
  routes
});

Vue.config.productionTip = false

let vm = new Vue({
  render: h => h(App),
  router
}).$mount('#app')
