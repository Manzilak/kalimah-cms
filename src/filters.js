'use strict'

import Vue from 'vue'
import he from 'he'

Vue.filter('formatDate', function (value) {
  if (value) {
    let date = new Date(value)
    return date.toDateString()
  }
})

Vue.filter('joinValues', function (value) {
  if (value) {
    return value.join(', ')
  }
})

Vue.filter('htmlParse', function (value) {
  if (value) {
    return he.decode(value)
  }
})
