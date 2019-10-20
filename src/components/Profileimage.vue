<template>
  <b-modal v-if="getForm.name === 'profile'" class="modal" :active.sync="getForm.show">
    <div class="modal-card" style="width: auto">
      <section class="modal-card-body">
        <b-tabs type="is-boxed" v-model="setTap">
          <b-tab-item label="Upload">
            <b-field class="file">
              <b-upload v-model="dropFiles">
                <a class="button is-primary">
                  <font-awesome-icon icon="upload" />
                  <span style="padding-left: 15px">Click to upload</span>
                </a>
              </b-upload>
            </b-field>
            <progress v-if="progress > 0" class="progress is-primary" :value="progress" max="100">{{ progress }}%</progress>
            <button v-if="setTap === 0 || $parent.userMedia.length === 0" :class="{ 'is-loading': getLoader }" class="button is-primary" @click="upload">Upload</button>
          </b-tab-item>
          <b-tab-item label="Attached">
            <div class="columns is-multiline">
              <div class="column is-4" v-for="(value, key) in media" :key="key">
                <div class="card">
                  <div class="card-image">
                    <div class="image media-image">
                      <img id="avatar" class="radius-image" :src="XbortGetMedia(value, 'small')" alt="">
                    </div>
                  </div>
                  <footer class="card-footer is-small">
                      <a class="card-footer-item">
                        <b-field class="block">
                          <b-radio-button v-model="featured" size="is-small" :native-value="value" @input="featuredImage"><font-awesome-icon icon="thumbtack" /></b-radio-button>
                          <button class="button is-danger is-small" @click.prevent="deleteImage(value)"><font-awesome-icon icon="trash" /></button>
                        </b-field>
                      </a>
                  </footer>
              </div>
              </div>
            </div>
          </b-tab-item>
        </b-tabs>
      </section>
    </div>
  </b-modal>
</template>

<script>
import axios from 'axios'
// import croppie from 'croppie'
import { mapGetters } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faThumbtack, faTrash, faCamera, faUpload } from '@fortawesome/free-solid-svg-icons'
library.add(faThumbtack, faTrash, faCamera, faUpload)

export default {
  data () {
    return {
      setTap: 0,
      dropFiles: [],
      featured: this.image,
      progress: 0
    }
  },
  updated () {
    this.featured = this.image
  },
  methods: {
    featuredImage: function () {
      this.$parent.userImage = this.featured
      this.$parent.updateProfile()
    },
    deleteDropFile (index) {
      this.dropFiles.splice(index, 1)
    },
    upload: function () {
      if (this.dropFiles.length > 0 && this.$parent.userMedia.length < 4) {
        this.$store.dispatch('showLoader', true)
        let sendData = new FormData()
        sendData.append('appid', this.$store.state.config.XbAppID)
        sendData.append('request', this.$store.state.config.XbProfiles)
        sendData.append('resize', true)
        for (let i = 0; i < this.dropFiles.length; i++) {
          sendData.append('files', this.dropFiles[i])
        }
        const self = this
        // Axios base settings
        let headers = null
        let token = this.$store.state.login.account.token
        if (token) {
          headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
          }
        } else {
          headers = {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios({
          method: 'post',
          headers: headers,
          data: sendData,
          onUploadProgress: function (progressEvent) {
            self.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          }
        }).then(getResponse => {
          this.$store.dispatch('showLoader', false)
          if (getResponse.data) {
            let filesResponse = JSON.parse(getResponse.data.data)
            filesResponse.files.forEach(file => {
              this.$parent.userMedia.push(file)
            })
            this.$parent.userMedia = [...new Set(this.$parent.userMedia)]
            this.dropFiles = []
            this.$parent.updateProfile()
            this.progress = 0
            this.setTap = 1
          }
        }).catch(getError => {
          this.$store.dispatch('showLoader', false)
          if (getError.response) {
            console.log(getError.response)
            let errorResponse = JSON.parse(getError.response.data)
            this.$parent.errorSave(errorResponse.message)
          }
        })
      }
    },
    deleteImage: function (imageUrl) {
      var params = {
        appid: this.$store.state.config.XbAppID,
        type: 'media',
        request: imageUrl
      }
      this.XbortRequest('', 'delete', params, result => {
        if (result.result) {
          if (imageUrl === this.$parent.userImage) {
            this.$parent.userImage = ''
          }
          this.$parent.userMedia.splice(this.$parent.userMedia.indexOf(imageUrl), 1)
          this.$parent.submitPost()
          this.$store.dispatch('showWaiting', false)
          this.$store.dispatch('showReload', false)
        } else {
          this.errorSave(result.data.message)
        }
      })
    },
    readFile: function () {
      // Type
      // Size
      // Total size
      // Total files
      let allFiles = document.getElementById('allFiles').files
      let fileSize = []
      let fileTotal = (total, value) => {
        return total + value
      }
      if (allFiles.length > 10) {
        this.$store.dispatch('showMessage', {
          show: true,
          type: 'error',
          message: 'You have 10 files limit per upload!'
        })
        return
      } else if (fileTotal && fileSize.reduce(fileTotal) > 10000000) {
        this.$store.dispatch('showMessage', {
          show: true,
          type: 'error',
          message: 'You have 10MB total limit per upload!'
        })
        return
      } else {
        this.files = allFiles
      }
      let ul = document.getElementById('ul')
      ul.innerHTML = ''
      for (let i = 0; i < 10; i++) {
        if (allFiles[i]) {
          let fileType = allFiles[i].type
          if (fileType.search('image/') >= 0) {
            fileSize.push(allFiles[i].size)
            var reader = new FileReader()
            reader.onload = function (e) {
              let li = document.createElement('li')
              let img = document.createElement('img')
              img.src = e.target.result
              ul.appendChild(li)
              li.appendChild(img)
            }
            reader.readAsDataURL(allFiles[i])
          } else {
            fileSize.push(allFiles[i].size)
            let li = document.createElement('li')
            li.setAttribute('class', 'has-text-centered')
            li.innerHTML =
              '<div style="margin: 5px"><i class="fa fa-file-text-o fa-5x" aria-hidden="true"></i></div>'
            ul.appendChild(li)
          }
        }
      }
    },
    close: function () {
      this.$store.dispatch('showForm', { show: false, name: null })
    }
  },
  props: [
    'image',
    'media'
  ],
  computed: {
    ...mapGetters([
      'getForm',
      'getLoader',
      'getError'
    ])
  }
}
</script>

<style>
  .card {
    border: 0;
    -webkit-box-shadow: 0px 0px 20px 8px rgba(59, 59, 59, 0.15), 0 0 0 0px rgba(59, 59, 59, 0.15);
    -moz-box-shadow: 0px 0px 20px 8px rgba(59, 59, 59, 0.15), 0 0 0 0px rgba(59, 59, 59, 0.15);
    box-shadow: 0px 0px 20px 8px rgba(125, 125, 125, 0.15), 0 0 0 0px rgba(125, 125, 125, 0.15);
    border-radius: 10px;
  }
  .media-image {
    position: relative;
    height: 120px;
    overflow: hidden;
    width: 100%;
  }
  .media-image img {
    min-height: 100%;
    min-width: 100%;
    top: -9999px;
    bottom: -9999px;
    left: -9999px;
    right: -9999px;
    margin: auto;
  }
  .radius-image {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .overlaped {
    right: 5px;
    bottom: auto;
    left: auto;
    top: 5px;
  }
</style>
