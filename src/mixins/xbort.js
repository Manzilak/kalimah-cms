'use strict'

import Vue from 'vue'
import store from '../store'
import axios from 'axios'

Vue.mixin({
  methods: {
    XbortGetRequest: function (path, params, callback) {
      path = path || ''
      // Axios base settings
      let headers = null
      let token = store.state.login.account.token
      if (token) {
        headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      } else {
        headers = {
          'Content-Type': 'application/json'
        }
      }
      axios({
        headers: headers,
        url: path,
        method: 'get',
        params: params
      }).then(getResponse => {
        let getResult = {}
        if (getResponse.data) {
          getResult = {
            result: true,
            data: JSON.parse(getResponse.data.data)
          }
        } else {
          getResult = {
            result: false,
            data: null
          }
        }
        callback(getResult)
      }).catch(getError => {
        let errorResult = {}
        if (getError.response) {
          let errorResponse = JSON.parse(getError.response.data.message)
          errorResult = {
            result: false,
            data: errorResponse.message
          }
          if (errorResponse.code && errorResponse.code === '[MSCIND3015]') {
            this.$store.dispatch('clearAccount')
            this.errorMessage(errorResult)
          } else {
            callback(errorResult)
          }
        }
      })
    },
    XbortGetMedia: function (file, size) {
      size = `&size=${size}` || ''
      if (file) {
        return `${store.state.config.XbUrl}/${store.state.config.XbPath}/${store.state.config.XbUser}/${store.state.config.XbProject}/?appid=${store.state.config.XbAppID}&type=media${size}&request=${file}`
      } else {
        return `https://api.adorable.io/avatars/200/${store.state.login.account.email}.png`
      }
    },
    XbortRequest: function (path, method, params, callback) {
      path = path || ''
      // Axios base settings
      let headers = null
      let token = store.state.login.account.token
      if (token) {
        headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      } else {
        headers = {
          'Content-Type': 'application/json'
        }
      }
      axios({
        headers: headers,
        url: path,
        method: method,
        data: params
      }).then(postResponse => {
        let postResult = {}
        if (postResponse.data) {
          postResult = {
            result: true,
            data: JSON.parse(postResponse.data.data)
          }
        } else {
          postResult = {
            result: false,
            data: null
          }
        }
        callback(postResult)
      }).catch(postError => {
        let errorResult = {}
        if (postError.response) {
          let errorResponse = JSON.parse(postError.response.data.message)
          errorResult = {
            result: false,
            data: errorResponse.message
          }
          if (errorResponse.code && errorResponse.code === '[MSCIND3015]') {
            this.$store.dispatch('clearAccount')
            this.errorMessage(errorResult)
          } else {
            callback(errorResult)
          }
        }
      })
    },
    XbortDeleteRequest: function (path, params, callback) {
      path = path || ''
      // Axios base settings
      let headers = null
      let token = store.state.login.account.token
      if (token) {
        headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      } else {
        headers = {
          'Content-Type': 'application/json'
        }
      }
      axios({
        headers: headers,
        url: path,
        method: 'delete',
        params: params
      }).then(getResponse => {
        let getResult = {}
        if (getResponse.data) {
          getResult = {
            result: true,
            data: JSON.parse(getResponse.data.data)
          }
        } else {
          getResult = {
            result: false,
            data: null
          }
        }
        callback(getResult)
      }).catch(getError => {
        let errorResult = {}
        if (getError.response) {
          let errorResponse = JSON.parse(getError.response.data.message)
          errorResult = {
            result: false,
            data: errorResponse.message
          }
          if (errorResponse.code && errorResponse.code === '[MSCIND3015]') {
            this.$store.dispatch('clearAccount')
            this.errorMessage(errorResult)
          } else {
            callback(errorResult)
          }
        }
      })
    }
  }
})
