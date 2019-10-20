import Vue from 'vue'
import Vuex from 'vuex'

// Kalimah Store Modules
import config from './config'
import messages from './messages'
import login from './login'
import posts from './posts'
import taxonomies from './taxonomies'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    config,
    messages,
    login,
    posts,
    taxonomies
  }
})
