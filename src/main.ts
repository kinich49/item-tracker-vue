import Vue from 'vue'
import App from './App.vue'
import BlankShoppingList from './components/BlankShoppingList.vue'
import Home from './components/Home.vue'
import AnalyticsSearch from './components/AnalyticsSearch.vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import vuetify from './plugins/vuetify';

Vue.use(VueRouter);
Vue.use(VueMeta);

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/blankShoppingList',
    component: BlankShoppingList
  },
  {
    path: '/analytics',
    component: AnalyticsSearch
  }
]

const router = new VueRouter({
  routes
});

router.beforeEach
Vue.config.productionTip = false

const vm = new Vue({
  render: createElement => createElement(App),
  vuetify,
  router
}).$mount('#app')
