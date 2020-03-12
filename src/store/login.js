import router from '../router'

const state = {
  account: {
    token: sessionStorage.getItem('XbToken'),
    refresh: sessionStorage.getItem('XbRefresh'),
    logged: sessionStorage.getItem('XbLogged'),
    user: sessionStorage.getItem('XbUser'),
    email: sessionStorage.getItem('XbEmail')
  }
}

const getters = {
  getToken: (state) => {
    return state.account.token
  },
  getRefresh: (state) => {
    return state.account.refresh
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
  clearAccount: ({ commit }) => {
    // Remove sessions before procceding
    // to make sure user has loggedout
    sessionStorage.removeItem('XbToken')
    sessionStorage.removeItem('XbRefresh')
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
