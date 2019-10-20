'use strict'

import store from '../store'
import axios from 'axios'

const state = {
  tags: [],
  categories: []
}

const getters = {
  getTags: (state) => {
    return state.tags
  },
  getCategories: (state) => {
    return state.categories
  }
}

const mutations = {
  setTags: (state, tags) => {
    state.tags = tags
  },
  setCategories: (state, categories) => {
    state.categories = categories
  }
}

const actions = {
  loadTags: ({ commit }, tagData) => {
    axios.get('', {
      params: {
        appid: store.state.config.XbAppID,
        type: 'data',
        request: 'km_tags'
      }
    }).then(tagResult => {
      if (tagResult.data) {
        let tags = JSON.parse(tagResult.data.data)
        commit('setTags', tags)
      }
    }).catch(error => {
      let errorResult = {}
      if (error.response) {
        errorResult = {
          show: true,
          message: error.response.data.message
        }
      } else {
        errorResult = {
          show: true,
          message: 'Unknown Error Loading Taga!'
        }
      }
      store.dispatch('showError', errorResult)
    })
  },
  loadCategories: ({ commit }, categoriesData) => {
    axios.get('', {
      params: {
        appid: store.state.config.XbAppID,
        type: 'data',
        request: 'km_categories'
      }
    }).then(categoriesResult => {
      if (categoriesResult.data) {
        let categories = JSON.parse(categoriesResult.data.data)
        commit('setCategories', categories)
      }
    }).catch(error => {
      let errorResult = {}
      if (error.response) {
        errorResult = {
          show: true,
          message: error.response.data.message
        }
      } else {
        errorResult = {
          show: true,
          message: 'Unknown Error Loading Categories!'
        }
      }
      let categories = []
      commit('setCategories', categories)
      store.dispatch('showError', errorResult)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
