
import axios from 'axios'
import store from '../store'
import router from '../router'

axios.defaults.baseURL = `${store.state.config.XbUrl}/${store.state.config.XbPath}/${store.state.config.XbUser}/${store.state.config.XbProject}` // 'https://api02.xbuffer.net/v1/manage'

const isJson = (json) => {
  var str = json.toString()
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

axios.interceptors.response.use(response => {
  return response
}, error => {
  var message = {}
  if (isJson(error.response.data.message)) {
    message = JSON.parse(error.response.data.message)
  } else {
    message = error.response.data.message
  }
  const originalRequest = error.config
  var response = {}
  if (error.response.status === 401 && message.code !== 'MSAAUT3037') { // Change later to !== 'MSAAUT3036'
    store.dispatch('clearAccount')
    router.push({ path: '/login' })
    return Promise.reject(error)
  }
  if (error.response.status === 401 && message.code === 'MSAAUT3037') {
    // originalRequest._retry = true
    return axios.post(`${sessionStorage.getItem('XbUser')}/refresh`, null, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('XbRefresh')}`
      }
    }).then(result => {
      if (isJson(result.data.data)) {
        response = JSON.parse(result.data.data)
      } else {
        response = result.data.data
      }
      sessionStorage.setItem('XbToken', response.token)
      originalRequest.headers['Authorization'] = `Bearer ${response.token}`
      return axios(originalRequest)
    }).catch(error => {
      return Promise.reject(error)
    })
  }
  return Promise.reject(error)
})

const Xbuffer = (params, callback) => {
  let path = params.path || ''
  let method = params.method || 'get'
  let headers = {
    'Content-Type': 'application/json'
  }
  if (params.headers) {
    headers['Authorization'] = `Bearer ${sessionStorage.getItem('XbToken')}`
  }
  let sendRequest = {
    headers: headers,
    url: path,
    method: method
  }
  if (method === 'get' || method === 'delete') {
    sendRequest.params = params.data
  } else {
    sendRequest.data = params.data
  }
  sendRequest.onUploadProgress = function (progressEvent) {
    return Math.round((progressEvent.loaded / progressEvent.total) * 100)
  }
  axios(sendRequest)
    .then(result => {
      let response = {}
      if (result.data) {
        response = {
          result: true
        }
        if (typeof result.data.data === 'string') {
          if (isJson(result.data.data)) {
            response.data = JSON.parse(result.data.data)
          } else {
            response.data = result.data.data
          }
        } else if (typeof result.data.data === 'object') {
          response.data = result.data.data
        }
      } else {
        response = {
          result: false,
          data: null
        }
      }
      callback(response)
    })
    .catch(error => {
      let response = {}
      if (error.response) {
        response = {
          result: false
        }
        if (typeof error.response.data.message === 'string') {
          if (isJson(error.response.data.message)) {
            response.data = JSON.parse(error.response.data.message)
          } else {
            response.data = error.response.data.message
          }
        } else if (typeof error.response.data.message === 'object') {
          response.data = error.response.data.message
        }
      } else if (error.request) {
        response = {
          result: false,
          data: 'Connection Error!'
        }
      } else {
        response = {
          result: false,
          data: 'Connection Error!'
        }
      }
      callback(response)
    })
}

export default Xbuffer
