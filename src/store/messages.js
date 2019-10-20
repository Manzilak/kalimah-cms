'use strict'

const state = {
  waiting: false,
  loader: false,
  error: false,
  form: {
    show: false,
    name: null,
    data: null
  },
  message: {
    show: false,
    type: null,
    message: null
  },
  login: false,
  signup: false,
  reload: false
}

const getters = {
  getWaiting: (state) => {
    return state.waiting
  },
  getLoader: (state) => {
    return state.loader
  },
  getError: (state) => {
    return state.error
  },
  getForm: (state) => {
    return state.form
  },
  getMessage: (state) => {
    return state.message
  },
  getLogin: (state) => {
    return state.login
  },
  getSignup: (state) => {
    return state.signup
  },
  getReload: (state) => {
    return state.reload
  }
}

const mutations = {
  setWaiting: (state, waiting) => {
    state.waiting = waiting
  },
  setLoader: (state, loader) => {
    state.loader = loader
  },
  setError: (state, error) => {
    state.error = error
  },
  setForm: (state, form) => {
    state.form = form
  },
  setMessage: (state, message) => {
    switch (message.type) {
      case 'error':
        message['class'] = 'is-danger'
        break
      case 'warning':
        message['class'] = 'is-warning'
        break
      case 'success':
        message['class'] = 'is-success'
        break
      default:
        message['class'] = 'is-danger'
        break
    }
    state.message = message
  },
  setLogin: (state, login) => {
    state.login = login
  },
  setSignup: (state, signup) => {
    state.signup = signup
  },
  setReload: (state, reload) => {
    state.reload = reload
  }
}

const actions = {
  showWaiting: ({ commit }, waiting) => {
    commit('setWaiting', waiting)
  },
  showLoader: ({ commit }, loader) => {
    commit('setLoader', loader)
  },
  showError: ({ commit }, error) => {
    commit('setError', error)
  },
  showForm: ({ commit }, form) => {
    commit('setForm', form)
  },
  showMessage: ({ commit }, message) => {
    commit('setMessage', message)
  },
  showLogin: ({ commit }, login) => {
    commit('setLogin', login)
  },
  showSignup: ({ commit }, signup) => {
    commit('setLogin', signup)
  },
  showReload: ({ commit }, reload) => {
    commit('setReload', reload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
