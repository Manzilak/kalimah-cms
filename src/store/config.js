'use strict'

import axios from 'axios'
import store from '../store'

import { kmSettings } from '../../public/settings'

const state = {
  XbUrl: kmSettings.XbUrl,
  XbPath: kmSettings.XbPath,
  XbUser: kmSettings.XbUser,
  XbProject: kmSettings.XbProject,
  XbDirectory: kmSettings.XbDirectory,
  XbProfiles: kmSettings.XbProfiles,
  XbAppID: kmSettings.XbAppID,
  XbSettings: {}
}

const getters = {
  getSettings: (state) => {
    return state.XbSettings
  }
}

const mutations = {
  setSettings: (state, settings) => {
    state.XbSettings = settings
  }
}

const actions = {
  loadConfig: ({ commit }) => {
    axios.get('', {
      params: {
        appid: store.state.config.XbAppID,
        type: 'data',
        request: 'km_settings'
      }
    }).then(tagResult => {
      if (tagResult.data) {
        let settings = JSON.parse(tagResult.data.data)
        commit('setSettings', settings[0].settings)
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
