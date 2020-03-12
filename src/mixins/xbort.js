'use strict'

import Vue from 'vue'
import store from '../store'
import Xbuffer from './xbuffer'

Vue.mixin({
  methods: {
    XbortMedia: function (file, size) {
      size = `&size=${size}` || ''
      if (file) {
        return `${store.state.config.XbUrl}/${store.state.config.XbPath}/${store.state.config.XbUser}/${store.state.config.XbProject}/?appid=${store.state.config.XbAppID}&type=media${size}&request=${file}`
      } else {
        return `https://api.adorable.io/avatars/200/${sessionStorage.getItem('XbEmail')}.png`
      }
    },
    XbortRequest: function (path, method, params, headers, callback) {
      path = path || ''
      method = method || 'get'
      let loginParamas = {
        data: params,
        path: path,
        method: method,
        headers: headers
      }
      console.log(loginParamas)
      Xbuffer(loginParamas, result => {
        callback(result)
      })
    }
  }
})
