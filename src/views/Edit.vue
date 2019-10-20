<template>
  <div>
    <div class="hero has-background-white-bis">
      <div class="hero-body">
        <div class="container">
          <div class="content">
            <div class="is-size-2-desktop is-size-3-mobile has-text-weight-bold" v-if="postData.postTitle">Editing <a @click="previewPost">{{ postData.postTitle }}</a></div>
            <p class="is-size-2-desktop has-text-weight-bold" v-else>Post Editing</p>
            <p v-if="Object.keys(postData.postCategory).length > 0" class="is-size-4-desktop">Filed under "{{ postData.postCategory.category_name }}"</p>
            <p v-if="postData.postTags.length > 0">
              <b-taglist>
                <b-tag><font-awesome-icon icon="tags" /></b-tag>
                <template v-for="(value, key) in postData.postTags">
                  <b-tag type="is-primary" :key="key" v-if="value.tag_name">{{ value.tag_name }}</b-tag>
                </template>
              </b-taglist>
            </p>
          </div>
        </div>
        <b-notification v-if="getError.show" type="is-danger">
          {{getError.message}}
        </b-notification>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-1 is-offset-1">
            <div class="sidenav">
              <div class="field fielder">
                <button class="button is-primary is-rounded" @click="upload"><font-awesome-icon icon="image" /></button>
              </div>
              <div class="field fielder">
                <b-dropdown hoverable>
                  <button class="button is-primary is-rounded" slot="trigger">
                    <font-awesome-icon icon="tag" />
                  </button>
                  <b-dropdown-item custom>
                    <b-field>
                      <b-taginput v-model="postData.postTags" :allow-new="allowNewTags" :data="getTags" autocomplete field="tag_name" placeholder="Type to add tags" @typing="getFilteredTags" @input="tagsChange">
                          <template slot-scope="props">
                            {{props.option.tag_name}}
                          </template>
                          <template slot="empty">
                              There are no items
                          </template>
                      </b-taginput>
                    </b-field>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <div class="field fielder">
                <b-dropdown hoverable>
                  <button class="button is-primary is-rounded" slot="trigger">
                    <font-awesome-icon icon="list" />
                  </button>
                  <b-dropdown-item custom>
                    <b-autocomplete v-model="categories" placeholder="e.g. Anne" :data="filteredDataArray" field="category_name" @select="option => { handleCategory(option) }">
                      <template slot="header">
                        <a @click="showAddCategory">
                          <span> Add new... </span>
                        </a>
                      </template>
                    </b-autocomplete>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <div class="field fielder switcher">
                <b-switch v-model="postData.postStatus"
                  true-value="Publish"
                  false-value="Draft">
                  <template v-if="postData.postStatus === 'Publish'"><font-awesome-icon icon="check-circle" class="has-text-success" /></template>
                  <template v-else><font-awesome-icon icon="circle" class="has-text-grey-light" /></template>
                </b-switch>
              </div>
              <div class="field fielder switcher">
                <b-switch v-model="postData.postPin"
                  true-value="Pin"
                  false-value="No" :disabled="pinLock === 1">
                  <template v-if="postData.postPin === 'Pin'"><font-awesome-icon icon="thumbtack" class="has-text-primary" /></template>
                  <template v-else><font-awesome-icon icon="thumbtack" class="has-text-grey-light" /></template>
                </b-switch>
              </div>
            </div>
          </div>
          <div class="column is-8">
            <div class="field">
              <div class="control">
                <input class="input is-size-2-desktop has-text-weight-bold" type="text" placeholder="Post title" v-model="postData.postTitle" @blur.prevent="titleChanged">
              </div>
            </div>
            <div class="field">
              <div class="content">
                <div id="editor">
                  {{ postData.postContent }}
                </div>
              </div>
            </div>
            <div class="field">
              <textarea class="textarea" v-model="postData.postBrief" placeholder="Optional post brief content" @blur.prevent="briefChanged"></textarea>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <button class="button is-primary" @click.prevent="submitPost">Save</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Media :image="postData.postImage" :media="postData.postMedia"></Media>
    <preview :post="postData" :preview="postPreview"></preview>
    <div @click="previewPost" id="postPre"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CKEditor from '@ckeditor/ckeditor5-build-balloon'
import Media from '../components/Media'
import Preview from '../components/Preview'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faImage, faList, faTag, faThumbtack, faCircle, faCheckCircle, faTags, faSave } from '@fortawesome/free-solid-svg-icons'
library.add(faImage, faList, faTag, faTags, faThumbtack, faCircle, faCheckCircle, faSave)

export default {
  data () {
    return {
      postData: {
        postTitle: null,
        postLink: null,
        postContent: null,
        postBrief: null,
        postStatus: 'Draft',
        postPin: 'No',
        postDate: new Date().getTime(),
        postImage: null,
        postMedia: [],
        postTags: [],
        postCategory: {},
        postType: 'article',
        postAuthor: this.getUser
      },
      filteredTags: this.getTags,
      allowNewTags: true,
      categories: '',
      pinLock: 1,
      content: {},
      postPreview: false
    }
  },
  components: {
    Media,
    Preview
  },
  beforeCreate () {
    this.$store.dispatch('loadTags')
    this.$store.dispatch('loadCategories')
  },
  created () {
    this.getPost()
  },
  mounted () {
    let setEditor = document.getElementById('editor')
    CKEditor.create(setEditor, {
      removePlugins: ['image'],
      toolbar: ['heading', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
      image: {
        toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
        styles: ['full', 'alignLeft', 'alignRight']
      }
    }).then(editor => {
      // if (this.postData.postStatus === 'Draft') {
      //   var typingStart
      //   var typingInterval = 5000
      //   editor.editing.view.document.on('blur', (evt, data) => {
      //     clearTimeout(typingStart)
      //   })
      //   editor.editing.view.document.on('keyup', (evt, data) => {
      //     clearTimeout(typingStart)
      //     typingStart = setTimeout(this.submitPost, typingInterval)
      //   })
      //   editor.editing.view.document.on('keydown', (evt, data) => {
      //     clearTimeout(typingStart)
      //   })
      // }
      // console.log( editor.ui );
      this.content = editor
    }).catch(error => {
      this.errorMessage(error)
    })
  },
  methods: {
    getPost: function () {
      let params = {
        appid: this.$store.state.config.XbAppID,
        type: 'data',
        request: 'km_posts'
      }
      if (this.$route.params) {
        params.id = this.$route.params.id
      }
      this.XbortGetRequest('', params, result => {
        this.$store.dispatch('showWaiting', true)
        if (result.result) {
          if (result.data[0].postTitle) {
            this.postData.postTitle = this.htmlParse(result.data[0].postTitle)
          }
          if (result.data[0].postContent) {
            const content = this.htmlParse(result.data[0].postContent)
            const viewFragment = this.content.data.processor.toView(content)
            const modelFragment = this.content.data.toModel(viewFragment)
            this.content.model.insertContent(modelFragment, this.content.model.document.selection)
            this.postData.postContent = this.htmlParse(result.data[0].postContent)
          }
          if (result.data[0].postBrief) {
            this.postData.postBrief = result.data[0].postBrief
          }
          this.postData.postStatus = result.data[0].postStatus
          this.postData.postPin = result.data[0].postPin
          this.postData.postDate = result.data[0].postDate
          if (result.data[0].postImage) {
            this.postData.postImage = result.data[0].postImage
          }
          if (result.data[0].postMedia && result.data[0].postMedia.length > 0) {
            this.postData.postMedia = result.data[0].postMedia
          }
          if (result.data[0].postTags && result.data[0].postTags.length > 0) {
            this.postData.postTags = result.data[0].postTags
          }
          if (result.data[0].postCategory) {
            this.postData.postCategory = result.data[0].postCategory
            this.categories = result.data[0].postCategory.category_name
          }
          this.postType = result.data[0].postType
          this.postAuthor = result.data[0].postAuthor
          this.$store.dispatch('showWaiting', false)
          this.$store.dispatch('showReload', false)
        }
      })
    },
    submitPost: function () {
      this.$store.dispatch('showLoader', true)
      if (this.postData.postTitle !== null) {
        this.postData.postTitle = this.htmlStrip(this.postData.postTitle)
        this.postData.postLink = this.htmlStrip(this.postData.postTitle.toString().toLowerCase().trim().replace(/\W+/g, '_'))
      }
      this.postData.postContent = this.htmlEscape(this.content.getData())
      if (this.postData.postBrief !== null) {
        this.postData.postBrief = this.htmlStrip(this.postData.postBrief)
      }
      if (typeof this.postData.postCategory !== 'object') {
        this.postData.postCategory = ''
      }
      let params = {
        appid: this.$store.state.config.XbAppID,
        type: 'data',
        request: 'km_posts',
        id: this.$route.params.id,
        data: JSON.stringify(this.postData)
      }
      this.XbortRequest('', 'put', params, result => {
        this.$store.dispatch('showLoader', false)
        if (result.result) {
          this.postData.postContent = this.htmlParse(this.postData.postContent)
          this.successSave()
        } else {
          this.errorMessage(result.data)
        }
      })
    },
    upload: function (data) {
      this.$store.dispatch('showForm', { show: true, name: 'media', data: data })
    },
    insertImage: function (imageUrl) {
      this.content.model.change(writer => {
        const imageElement = writer.createElement('image', {
          src: imageUrl
        })
        // Insert the image in the current selection location.
        this.content.model.insertContent(imageElement, this.content.model.document.selection)
        this.$store.dispatch('showForm', { show: false, name: null })
      })
    },
    getFilteredTags: function (text) {
      this.getTags.filter((option) => {
        return option.tag_name
          .toString()
          .toLowerCase()
          .indexOf(text.toLowerCase()) >= 0
      })
    },
    showAddCategory: function () {
      this.$dialog.prompt({
        message: `New Category`,
        inputAttrs: {
          placeholder: 'e.g. Computers',
          maxlength: 20,
          value: this.postData.postCategory.category_name
        },
        confirmText: 'Add',
        onConfirm: (value) => {
          let params = {
            appid: this.$store.state.config.XbAppID,
            type: 'data',
            request: 'km_categories',
            data: JSON.stringify({ category_name: value, category_link: value.toString().toLowerCase().trim().replace(/\W+/g, '_') })
          }
          this.XbortRequest('', 'post', params, result => {
            if (result.result) {
              this.$store.dispatch('loadCategories')
              if (this.postData.postStatus === 'Draft') {
                this.submitPost()
              }
            } else {
              this.errorMessage(result.data)
            }
          })
        }
      })
    },
    titleChanged: function () {
      if (this.postData.postTitle && this.postData.postTitle.length > 5 && this.postData.postStatus === 'Draft') {
        this.submitPost()
      }
    },
    tagsChange: function () {
      // if new tags are added
      // add them to DB
      let tags = this.postData.postTags
      let ifObj = false
      let noObj = ''
      for (let i = 0; i < tags.length; i++) {
        if (typeof tags[i] !== 'object') {
          ifObj = true
          noObj = tags[i]
        }
      }
      if (ifObj) {
        let params = {
          appid: this.$store.state.config.XbAppID,
          type: 'data',
          request: 'km_tags',
          data: JSON.stringify({ tag_name: noObj, tag_link: noObj.toString().toLowerCase().trim().replace(/\W+/g, '_') })
        }
        this.XbortRequest('', 'post', params, result => {
          if (result.result) {
            let params = {
              appid: this.$store.state.config.XbAppID,
              type: 'data',
              request: 'km_tags',
              id: result.data.affected_ID
            }
            this.XbortGetRequest('', params, tags => {
              if (tags.result) {
                this.postData.postTags.push(tags.data[0])
                let newTags = this.postData.postTags.filter(object => {
                  if (typeof object === 'object') {
                    return object
                  }
                })
                this.postData.postTags = newTags
                if (this.postData.postStatus === 'Draft') {
                  this.submitPost()
                }
                this.$store.dispatch('loadTags')
              } else {
                this.errorMessage(result.data)
              }
            })
          } else {
            this.$store.dispatch('showMessage', { show: true, type: 'error', message: result.data })
          }
        })
      } else {
        if (this.postData.postStatus === 'Draft') {
          this.submitPost()
        }
        this.$store.dispatch('loadTags')
      }
    },
    handleCategory: function (option) {
      this.returnCategory(option)
      this.categoryChange()
    },
    returnCategory: function (option) {
      this.postData.postCategory = option
    },
    categoryChange: function () {
      if (this.postData.postCategory.hasOwnProperty('category_name') && this.postData.postStatus === 'Draft') {
        this.submitPost()
      }
    },
    briefChanged: function () {
      if (this.postData.postBrief && this.postData.postBrief.length > 15 && this.postData.postStatus === 'Draft') {
        this.submitPost()
      }
    },
    previewPost: function () {
      this.postPreview = !this.postPreview
      let ele = document.getElementById('postPre')
      if (this.postPreview) {
        ele.style.display = 'block'
      } else {
        ele.style.display = 'none'
      }
    }
  },
  computed: {
    ...mapGetters([
      'getTags',
      'getCategories',
      'getUser',
      'getLoader',
      'getWaiting',
      'getError'
    ]),
    filteredDataArray: function () {
      return this.getCategories.filter((option) => {
        return option.category_name
          .toString()
          .toLowerCase()
          .indexOf(this.categories.toLowerCase()) >= 0
      })
    }
  },
  watch: {
    'postData.postStatus': function () {
      if (this.postData.postStatus === 'Draft') {
        this.pinLock = 1
        this.postData.postPin = 'No'
      } else if (this.postData.postStatus === 'Publish') {
        this.pinLock = 0
      }
    }
  }
}
</script>
<style scoped>
  .section {
    padding-bottom: 1rem;
    padding-top: 1rem;
  }
  .ck.ck-editor__editable:not(.ck-editor__nested__editable).ck-focused {
    box-shadow: none;
    border: 0;
    border-bottom: 1px solid lightgrey;
    /* font-family: 'Nunito Sans',sans-serif; */
  }
  .ck.ck-editor__editable {
    border: 0;
    border-bottom: 1px solid lightgrey;
    /* font-family: 'Nunito Sans',sans-serif; */
  }
  .ck-content h4 {
    color: lightgrey;
  }
</style>
