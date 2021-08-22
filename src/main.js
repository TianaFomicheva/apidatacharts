import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './custom-reset.css'
import './assets/scss/reset.scss'

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
