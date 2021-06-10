import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false
window.location.hash = 'home'
new Vue({
  render: h => h(App),
}).$mount('#app')
