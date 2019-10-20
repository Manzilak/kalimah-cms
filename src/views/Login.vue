<template>
  <section class="hero is-light is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-one-third is-offset-4">
            <figure class="image is-128x128" style="margin: auto">
              <img src="../assets/logo.png">
            </figure>
            <h1 class="title">Login</h1>
            <div v-if="getError.show" class="notification is-danger">
              <button class="delete" @click="hideWarning"></button>
              {{getError.message.message}}
            </div>
            <ValidationObserver v-slot="{ valid }" tag="form" @submit.prevent="submitData">
              <div class="field">
                <p class="control has-icons-left">
                  <ValidationProvider rules="required|email" v-slot="{ errors, validate }">
                    <input v-model="formData.getEmail" type="email" class="input" placeholder="Email" @input="validate">
                    <span class="icon is-small is-left">
                      <font-awesome-icon icon="envelope" />
                    </span>
                    <span class="is-small has-text-danger">{{ errors[0] }}</span>
                  </ValidationProvider>
                </p>
              </div>
              <div class="field">
                <p class="control has-icons-left">
                  <ValidationProvider rules="required|min:6" v-slot="{ errors, validate }">
                    <input v-model="formData.getPassword" type="password" class="input" placeholder="Password" @input="validate">
                    <span class="icon is-small is-left">
                      <font-awesome-icon icon="lock" />
                    </span>
                    <span class="is-small has-text-danger">{{ errors[0] }}</span>
                  </ValidationProvider>
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <button class="button is-primary" type="submit" :class="{ 'is-loading': getLoader }" :disabled="!valid">
                    Login
                  </button>
                </p>
              </div>
            </ValidationObserver>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

// Vee validation
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate'
import { required, email, min } from 'vee-validate/dist/rules'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
library.add(faEnvelope)
library.add(faLock)

// Vee validate setup
extend('required', required)
extend('email', email)
extend('min', min)

// Vee validate lang locale
localize({
  en: {
    messages: {
      required: 'this field is required',
      email: 'this field must be a valid email',
      min: 'this field must have no less than {length} characters'
    }
  }
})

export default {
  data () {
    return {
      formData: {
        getEmail: null,
        getPassword: null
      },
      emailStat: false,
      passwordStat: false,
      getReady: false
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    submitData: function () {
      this.$store.dispatch('getAccount', this.formData)
    },
    hideWarning: function () {
      this.$store.dispatch('showError', { show: false, message: null })
    }
  },
  computed: {
    ...mapGetters([
      'getLoader',
      'getError'
    ])
  }
}
</script>
