'use strict'

import router from '../router'
import store from '../store'
import axios from 'axios'

const state = {
  account: {
    token: sessionStorage.getItem('XbToken'),
    logged: sessionStorage.getItem('XbLogged'),
    user: sessionStorage.getItem('XbUser'),
    email: sessionStorage.getItem('XbEmail')
  }
}

const getters = {
  getToken: (state) => {
    return state.account.token
  },
  getLogged: (state) => {
    return state.account.logged
  },
  getUser: (state) => {
    return state.account.user
  },
  getEmail: (state) => {
    return state.account.email
  }
}

const mutations = {
  setAccount: (state, account) => {
    state.account = account
  }
}

const actions = {
  getAccount: ({ commit }, loginData) => {
    let account = {}
    let sendLogin = {
      appid: store.state.config.XbAppID,
      email: loginData.getEmail,
      password: loginData.getPassword
    }
    // Start the waiting loader until result get back
    store.dispatch('showLoader', true)
    axios.post('auth', sendLogin)
      .then(loginResult => {
        let getLogin = JSON.parse(loginResult.data.data)
        account = {
          token: getLogin.token,
          logged: true,
          user: getLogin.user,
          email: getLogin.email
        }
        // Store sessions when correct
        sessionStorage.setItem('XbToken', account.token)
        sessionStorage.setItem('XbLogged', account.logged)
        sessionStorage.setItem('XbUser', account.user)
        sessionStorage.setItem('XbEmail', account.email)
        // Commit changes with stored session
        // hide login modal
        // redirect to account page
        // then remove the waiting loader
        commit('setAccount', account)
        store.dispatch('showLogin', false)
        router.push({ path: '/' })
        store.dispatch('showLoader', false)
      })
      .catch(error => {
        if (error.response) {
          account = {
            show: true,
            message: error.response.data.message
          }
        } else {
          account = {
            show: true,
            message: 'Unknown Error!'
          }
        }
        console.log(error)
        // dispatch error message handler to show error
        store.dispatch('showError', account)
        store.dispatch('showLoader', false)
      })
  },
  clearAccount: ({ commit }) => {
    // Remove sessions before procceding
    // to make sure user has loggedout
    sessionStorage.removeItem('XbToken')
    sessionStorage.removeItem('XbLogged')
    sessionStorage.removeItem('XbUser')
    sessionStorage.removeItem('XbEmail')
    let account = {
      token: null,
      logged: false,
      user: null,
      email: null
    }
    commit('setAccount', account)
    router.push({ path: '/login' })
    store.dispatch('showWaiting', false)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
