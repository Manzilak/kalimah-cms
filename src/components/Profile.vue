<template>
  <div>
    <div class="columns">
      <div class="column is-2">
        <figure class="image is-128x128">
          <img class="is-rounded" :src="XbortGetMedia(userImage, 'medium')">
          <div class="is-overlay center_down has-text-centered">
            <button class="button is-outline is-primary" @click="changeImage"><font-awesome-icon icon="camera" /></button>
          </div>
        </figure>
      </div>
      <div class="column">
        <b-field label="Full name">
          <b-input v-model="userName" minlength="6" maxlength="64" placeholder="Your name..."></b-input>
        </b-field>
        <b-field class="is-pulled-right">
          <button class="button is-primary" @click.prevent="updateProfile">Save</button>
        </b-field>
      </div>
    </div>
    <Media :image="userImage" :media="userMedia"></Media>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Media from './Profileimage'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
library.add(faCamera)

export default {
  data () {
    return {
      userId: null,
      userEmail: null,
      userName: null,
      userLink: null,
      userImage: null,
      userMedia: []
    }
  },
  components: {
    Media
  },
  created () {
    this.getProfile()
  },
  methods: {
    getProfile: function () {
      let params = {
        appid: this.$store.state.config.XbAppID,
        type: 'data',
        request: 'km_profiles',
        getby: `userId:${this.getUser},userEmail:${this.getEmail}`
      }
      this.XbortGetRequest('', params, result => {
        if (result.result) {
          if (result.data.length === 0) {
            let params = {
              appid: this.$store.state.config.XbAppID,
              type: 'data',
              request: 'km_profiles',
              data: JSON.stringify({ userId: this.getUser, userEmail: this.getEmail })
            }
            this.XbortRequest('', 'post', params, result => {
              if (result.result) {
                this.getProfile()
              } else {
                this.errorMessage(result.data)
              }
            })
          } else {
            this.userId = result.data[0]._id
            this.userEmail = result.data[0].userEmail
            this.userName = result.data[0].userName ? result.data[0].userName : ''
            this.userLink = result.data[0].userLink ? result.data[0].userLink : ''
            this.userImage = result.data[0].userImage ? result.data[0].userImage : ''
            this.userMedia = result.data[0].userMedia ? result.data[0].userMedia : []
          }
        } else {
          this.errorMessage(result.data)
        }
      })
    },
    updateProfile: function () {
      let userData = {
        userId: this.getUser,
        userEmail: this.getEmail
      }
      if (this.userImage !== null) {
        userData.userImage = this.userImage
      }
      if (this.userMedia.length > 0) {
        userData.userMedia = this.userMedia
      }
      if (this.userName !== null) {
        userData.userName = this.userName
        userData.userLink = this.userName.toString().toLowerCase().trim().replace(/\W+/g, '_')
      }
      let params = {
        appid: this.$store.state.config.XbAppID,
        type: 'data',
        request: 'km_profiles',
        id: this.userId,
        data: JSON.stringify(userData)
      }
      this.XbortRequest('', 'put', params, result => {
        if (result.result) {
          this.getProfile()
        } else {
          this.errorMessage(result.data)
        }
      })
    },
    changeImage: function () {
      this.$store.dispatch('showForm', { show: true, name: 'profile' })
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getEmail',
      'getLoader',
      'getError'
    ])
  }
}
</script>

<style>
  .is-overlay {
    margin: 0 auto;
    top: auto;
    bottom: 0;
    right: auto;
    left: auto;
  }
</style>
