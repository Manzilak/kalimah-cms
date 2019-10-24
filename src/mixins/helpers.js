'use strict'

import Vue from 'vue'
import he from 'he'

Vue.mixin({
  methods: {
    htmlEscape: function (html) {
      return he.encode(html)
    },
    htmlParse: function (html) {
      return he.decode(html)
    },
    htmlStrip: function (html) {
      // Create a new div element
      var temporalDivElement = document.createElement('div')
      // Set the HTML content with the providen
      temporalDivElement.innerHTML = html
      // Retrieve the text property of the element (cross-browser support)
      return temporalDivElement.textContent || temporalDivElement.innerText || ''
    },
    successSave: function () {
      this.$buefy.toast.open({
        message: 'Saved!',
        type: 'is-success'
      })
    },
    errorMessage: function (error) {
      this.$buefy.toast.open({
        duration: 5000,
        message: `Error! ${error}`,
        type: 'is-danger'
      })
    }
  }
})
