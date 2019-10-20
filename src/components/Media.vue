<template>
  <b-modal v-if="getForm.name === 'media'" class="modal" :active.sync="getForm.show">
    <div class="modal-card" style="width: auto">
      <section class="modal-card-body">
        <b-tabs type="is-boxed" v-model="setTap">
          <b-tab-item label="Upload">
            <b-field>
              <b-upload v-model="dropFiles" multiple drag-drop>
                <section class="section">
                  <div class="content has-text-centered">
                    <font-awesome-icon icon="upload" size="lg" />
                    <p>Drop your files here or click to upload</p>
                  </div>
                </section>
              </b-upload>
            </b-field>
            <div class="tags">
              <span v-for="(file, index) in dropFiles" :key="index" class="tag is-primary" >
                {{file.name}}
                <button class="delete is-small" type="button" @click="deleteDropFile(index)">
                </button>
              </span>
            </div>
            <progress v-if="progress > 0" class="progress is-primary" :value="progress" max="100">{{ progress }}%</progress>
            <button v-if="setTap === 0 || $parent.postData.postMedia.length === 0" class="button is-primary" @click="upload">Upload</button>
          </b-tab-item>
          <b-tab-item label="Attached" v-if="$route.name === 'edit'">
            <div class="columns is-multiline">
              <div class="column is-4" v-for="(value, key) in media" :key="key">
                <div class="card">
                  <div class="card-image">
                    <div class="image media-image">
                      <img class="radius-image" :src="XbortGetMedia(value, 'small')" alt="">
                      <div class="is-overlay overlaped">
                        <b-field class="block">
                          <button class="button is-danger is-small is-rounded" @click.prevent="deleteImage(value)"><font-awesome-icon icon="trash" /></button>
                        </b-field>
                      </div>
                    </div>
                  </div>
                  <footer class="card-footer is-small">
                      <a class="card-footer-item">
                        <b-field class="block">
                          <b-radio-button v-model="featured" size="is-small" :native-value="value" @input="featuredImage"><font-awesome-icon icon="thumbtack" /></b-radio-button>
                          <button class="button is-small is-rounded" style="margin-left: 8px" @click.prevent="insertImage(XbortGetMedia(value, 'small'))">S</button>
                          <button class="button is-small is-rounded" style="margin-left: 8px" @click.prevent="insertImage(XbortGetMedia(value, 'medium'))">M</button>
                          <button class="button is-small is-rounded" style="margin-left: 8px" @click.prevent="insertImage(XbortGetMedia(value, 'large'))">L</button>
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
import { mapGetters } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faThumbtack, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
library.add(faThumbtack, faTrash, faUpload)

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
      this.$parent.postData.postImage = this.featured
      if (this.$parent.postData.postStatus === 'Draft') {
        this.$parent.submitPost()
      }
    },
    deleteDropFile (index) {
      this.dropFiles.splice(index, 1)
    },
    upload: function () {
      if (this.dropFiles.length > 0) {
        this.$store.dispatch('showLoader', true)
        let sendData = new FormData()
        sendData.append('appid', this.$store.state.config.XbAppID)
        sendData.append('request', this.$store.state.config.XbDirectory)
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
          if (getResponse.data) {
            let filesResponse = JSON.parse(getResponse.data.data)
            filesResponse.files.forEach(file => {
              this.$parent.postData.postMedia.push(file)
            })
            this.$parent.postData.postMedia = [...new Set(this.$parent.postData.postMedia)]
            this.dropFiles = []
            this.$parent.submitPost()
            this.progress = 0
            this.setTap = 1
          }
        }).catch(getError => {
          if (getError.response) {
            console.log(getError.response)
            let errorResponse = JSON.parse(getError.response.data)
            this.$parent.errorSave(errorResponse.message)
          }
        })
      }
    },
    insertImage: function (imageUrl) {
      this.$parent.insertImage(imageUrl)
    },
    deleteImage: function (imageUrl) {
      var params = {
        appid: this.$store.state.config.XbAppID,
        type: 'media',
        request: imageUrl
      }
      this.XbortRequest('', 'delete', params, result => {
        if (result.result) {
          if (imageUrl === this.$parent.postData.postImage) {
            this.$parent.postData.postImage = ''
          }
          this.$parent.postData.postMedia.splice(this.$parent.postData.postMedia.indexOf(imageUrl), 1)
          this.$parent.submitPost()
          this.$store.dispatch('showWaiting', false)
          this.$store.dispatch('showReload', false)
        } else {
          this.errorSave(result.data.message)
        }
      })
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
