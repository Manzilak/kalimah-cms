<template>
  <div>
    <div class="columns">
      <div class="column is-two-thirds">
        <table class="table is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th class="t_n_w">#</th>
              <th>Category</th>
              <th class="t_o_w">Options</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in categories" :key="key">
              <td class="t_n_w">{{ key + 1 }}</td>
              <td>{{ value.category_name }}</td>
              <td class="t_o_w">
                <div class="buttons">
                  <button class="button is-small is-rounded is-transparent" @click="postPanel(value)"><font-awesome-icon icon="list" /></button>
                  <button class="button is-small is-rounded is-danger" @click="deleteCategory(value._id)"><font-awesome-icon icon="trash" /></button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th class="t_n_w">#</th>
              <th>Category</th>
              <th class="t_o_w">Options</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="column">
        <b-field label="New category">
          <b-input v-model="category" minlength="6" maxlength="64" placeholder="Category name"></b-input>
        </b-field>
        <b-field class="is-pulled-right">
          <button class="button is-primary" @click.prevent="addCategory">Save</button>
        </b-field>
      </div>
    </div>
    <cat-posts :show="showPanel" :category="selected" />
    <div @click="postPanel" id="postPre"></div>
    {{getCats}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Catposts from './Catposts.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faList } from '@fortawesome/free-solid-svg-icons'
library.add(faTrash, faList)

export default {
  data () {
    return {
      categories: [],
      category: null,
      showPanel: false,
      selected: null
    }
  },
  components: {
    'cat-posts': Catposts
  },
  created () {
    this.$store.dispatch('loadCategories')
  },
  methods: {
    allCategories: function () {
      this.categories = this.getCategories
    },
    addCategory: function () {
      if (this.category) {
        let params = {
          appid: this.$store.state.config.XbAppID,
          type: 'data',
          request: 'km_categories',
          data: JSON.stringify({ category_name: this.category, category_link: this.category.toString().toLowerCase().trim().replace(/\W+/g, '_') })
        }
        this.XbortRequest('', 'post', params, result => {
          if (result.result) {
            this.$store.dispatch('loadCategories')
            this.successSave()
            this.category = null
          } else {
            this.errorMessage(result.data)
          }
        })
      }
    },
    deleteCategory: function (category) {
      this.$dialog.confirm({
        title: 'Deleting Category!',
        message: 'Are you sure you want to <b>delete</b> this category? This action cannot be undone.',
        confirmText: 'Delete Category',
        type: 'is-danger',
        onConfirm: () => {
          let params = {
            appid: this.$store.state.config.XbAppID,
            type: 'data',
            request: 'km_posts',
            getby: `postCategory-_id:${category}`
          }
          this.XbortGetRequest('', params, result => {
            if (result.result) {
              if (result.data.length === 0) {
                let params = {
                  appid: this.$store.state.config.XbAppID,
                  type: 'data',
                  request: 'km_categories',
                  id: category
                }
                this.XbortRequest('', 'delete', params, result => {
                  if (result.result) {
                    this.$store.dispatch('loadCategories')
                    this.successSave()
                  } else {
                    this.errorMessage(result.data)
                  }
                })
              } else {
                this.errorMessage('Category is used by one or more posts!')
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
      'getCategories'
    ]),
    getCats: function () {
      return this.allCategories()
    }
  }
}
</script>
