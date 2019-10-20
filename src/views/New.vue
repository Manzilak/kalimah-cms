<template>
  <div>
    <div class="hero has-background-white-bis">
      <div class="hero-body">
        <div class="container">
          <div class="content">
            <div class="is-size-2-desktop is-size-3-mobile has-text-weight-bold">New Post</div>
          </div>
          <b-notification v-if="getError.show" type="is-danger">
            {{getError.message}}
          </b-notification>
        </div>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-1">
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
                    <b-field>
                      <b-autocomplete v-model="categories" placeholder="e.g. Anne" :data="filteredDataArray" field="category_name" @select="option => postData.postCategory = option">
                        <template slot="header">
                          <a @click="showAddCategory">
                            <span> Add new... </span>
                          </a>
                        </template>
                      </b-autocomplete>
                    </b-field>
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
          <div class="column">
            <div class="field">
              <div class="control">
                <input id="post_title" class="input is-large has-text-weight-bold km_input" type="text" placeholder="Post title" v-model="postData.postTitle" @blur.prevent="titleChanged">
              </div>
            </div>
            <div class="field">
              <div class="content">
                <div id="editor">
                  {{ postData.postContent }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Media :image="postData.postImage" :media="postData.postMedia"></Media>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CKEditor from '@ckeditor/ckeditor5-build-balloon'
import Media from '../components/Media'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faImage, faList, faTag, faThumbtack, faCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
library.add(faImage, faList, faTag, faThumbtack, faCircle, faCheckCircle)

export default {
  data () {
    return {
      loadWait: false,
      postData: {
        postTitle: '',
        postContent: '',
        postBrief: '',
        postStatus: 'Draft',
        postPin: 'No',
        postDate: new Date().getTime(),
        postImage: '',
        postMedia: [],
        postTags: [],
        postCategory: {},
        postType: 'article',
        postAuthor: ''
      },
      filteredTags: this.getTags,
      allowNewTags: true,
      categories: '',
      pinLock: 1,
      content: {}
    }
  },
  components: {
    Media
  },
  beforeCreate () {
    this.$store.dispatch('loadTags')
    this.$store.dispatch('loadCategories')
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
      editor.setData('Post Content...')
      editor.model.document.on('change:data', () => {
        if (editor.getData().length > 55) {
          this.submitPost()
        }
      })
      this.content = editor
    }).catch(error => {
      this.errorMessage(error)
    })
  },
  methods: {
    submitPost: function () {
      this.$store.dispatch('showLoader', true)
      if (this.postData.postTitle !== null) {
        this.postData.postTitle = this.htmlEscape(this.postData.postTitle)
        this.postData.postLink = this.htmlEscape(this.postData.postTitle.toString().toLowerCase().replace(/\W+/g, '_'))
      }
      this.postData.postContent = this.htmlEscape(this.content.getData())
      this.postData.postAuthor = this.getUser
      let params = {
        appid: this.$store.state.config.XbAppID,
        type: 'data',
        request: 'km_posts',
        data: JSON.stringify(this.postData)
      }
      this.XbortRequest('', 'post', params, result => {
        this.$store.dispatch('showLoader', false)
        if (result.result) {
          this.formData = {}
          this.$router.push({ path: `/edit/${result.data.affected_ID}` })
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
            data: JSON.stringify({ category_name: value, category_link: value.toString().toLowerCase().replace(/\W+/g, '_') })
          }
          this.XbortRequest('', 'post', params, result => {
            if (result.result) {
              this.submitPost()
            } else {
              this.errorMessage(result.data)
            }
          })
        }
      })
    },
    titleChanged: function () {
      if (this.postData.postTitle.length > 5) {
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
                this.submitPost()
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
        this.submitPost()
        this.$store.dispatch('loadTags')
      }
    }
  },
  computed: {
    ...mapGetters([
      'getTags',
      'getCategories',
      'getUser',
      'getLoader',
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
  .km_input, .km_input:focus {
    box-shadow: none;
    border: 0;
    border-bottom: 1px solid lightgrey;
    border-radius: 0;
  }
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
