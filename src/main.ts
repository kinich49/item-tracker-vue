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

Vue.config.productionTip = false

const vm = new Vue({
  render: h => h(App),
  vuetify,
  router,
  created: function() {
    if (isCookieExistent("introduced")) {
      this.$router.push("/blankShoppingList");
    }
  }
}).$mount('#app')


function isCookieExistent(name: string): boolean {
  let allCookies = document.cookie
  let cookie = allCookies.split('; ').find(row => row.startsWith(name))
  return cookie ? true : false
}