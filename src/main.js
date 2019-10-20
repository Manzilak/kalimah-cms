import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './mixins/xbort'
import './mixins/helpers'
import './filters'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './registerServiceWorker'

// CSS libraries
import Buefy from 'buefy'
import 'buefy/dist/buefy.min.css'
import './assets/css/kalimah.css'
Vue.use(Buefy, {
  defaultIconPack: 'fas'
})

Vue.component('font-awesome-icon', FontAwesomeIcon)

axios.defaults.baseURL = `${store.state.config.XbUrl}/${store.state.config.XbPath}/${store.state.config.XbUser}/${store.state.config.XbProject}`

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
