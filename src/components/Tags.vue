<template>
  <div>
    <div class="columns">
      <div class="column is-two-thirds">
        <table class="table is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th class="t_n_w">#</th>
              <th>Tag</th>
              <th class="t_o_w">Options</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in tags" :key="key">
              <td class="t_n_w">{{ key + 1 }}</td>
              <td>{{ value.tag_name }}</td>
              <td class="t_o_w">
                <div class="buttons">
                  <button class="button is-small is-rounded is-transparent" @click="postPanel(value)"><font-awesome-icon icon="list" /></button>
                  <button class="button is-small is-rounded is-danger" @click="deleteTag(value._id)"><font-awesome-icon icon="trash" /></button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th class="t_n_w">#</th>
              <th>Tag</th>
              <th class="t_o_w">Options</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="column">
        <b-field label="New tag">
          <b-input v-model="tag" minlength="2" maxlength="64" placeholder="Tag name"></b-input>
        </b-field>
        <b-field class="is-pulled-right">
          <button class="button is-primary" @click.prevent="addTag">Save</button>
        </b-field>
      </div>
    </div>
    <tag-posts :show="showPanel" :tag="selected" />
    <div @click="postPanel" id="postPre"></div>
    {{getTag}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tagposts from './Tagposts.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faList } from '@fortawesome/free-solid-svg-icons'
library.add(faTrash, faList)

export default {
  data () {
    return {
      tags: [],
      tag: null,
      showPanel: false,
      selected: null
    }
  },
  components: {
    'tag-posts': Tagposts
  },
  created () {
    this.$store.dispatch('loadTags')
  },
  methods: {
    allTags: function () {
      this.tags = this.getTags
    },
    addTag: function () {
      if (this.tag) {
        let params = {
          appid: this.$store.state.config.XbAppID,
          type: 'data',
          request: 'km_tags',
          data: JSON.stringify({
            tag_name: this.tag,
            tag_link: this.tag.toString().toLowerCase().trim().replace(/\W+/g, '_')
          })
        }
        this.XbortRequest('', 'post', params, result => {
          if (result.result) {
            this.$store.dispatch('loadTags')
            this.successSave()
            this.tag = null
          } else {
            this.errorMessage(result.data)
          }
        })
      }
    },
    deleteTag: function (tag) {
      this.$dialog.confirm({
        title: 'Deleting Tag!',
        message: 'Are you sure you want to <b>delete</b> this tag? This action cannot be undone.',
        confirmText: 'Delete Tag',
        type: 'is-danger',
        onConfirm: () => {
          let params = {
            appid: this.$store.state.config.XbAppID,
            type: 'data',
            request: 'km_posts',
            getby: `postTags-_id:${tag}`
          }
          this.XbortGetRequest('', params, result => {
            if (result.result) {
              if (result.data.length === 0) {
                let params = {
                  appid: this.$store.state.config.XbAppID,
                  type: 'data',
                  request: 'km_tags',
                  id: tag
                }
                this.XbortRequest('', 'delete', params, result => {
                  if (result.result) {
                    this.$store.dispatch('loadTags')
                    this.successSave()
                  } else {
                    this.errorMessage(result.data)
                  }
                })
              } else {
                this.errorMessage('Tag is used by one or more posts!')
              }
            } else {
              this.errorMessage(result.data)
            }
          })
        }
      })
    },
    postPanel: function (category) {
      this.showPanel = !this.showPanel
      let ele = document.getElementById('postPre')
      if (this.showPanel) {
        ele.style.display = 'block'
        this.selected = category
      } else {
        ele.style.display = 'none'
        this.selected = null
      }
    }
  },
  computed: {
    ...mapGetters([
      'getTags'
    ]),
    getTag: function () {
      return this.allTags()
    }
  }
}
</script>
