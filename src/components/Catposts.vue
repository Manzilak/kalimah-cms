<template>
  <div class="slideout" :class="{active: show}">
    <div class="panel">
      <div>
        <a type="button" class="delete is-larg" @click="$parent.postPanel">close</a>
      </div>
      <section class="section" v-if="category">
        <div class="content">
          <h1>Posts filed under {{ category.category_name }}</h1>
          <table class="table is-striped is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th class="t_n_w">#</th>
                <th>Post</th>
                <th class="has-text-centered">Status</th>
                <th class="t_o_w">Options</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) in posts" :key="key">
                <td class="t_n_w">{{ key + 1 }}</td>
                <td>{{ value.postTitle }}</td>
                <td class="has-text-centered">
                  <template v-if="value.postStatus === 'Publish' && value.postPin === 'No'"><font-awesome-icon class="has-text-success" icon="check-circle" /></template>
                  <template v-else-if="value.postStatus === 'Draft'"><font-awesome-icon class="has-text-grey-light" icon="circle" /></template>
                  <template v-else-if="value.postPin === 'Pin'"><font-awesome-icon class="has-text-primary" icon="thumbtack" /></template>
                  <template v-else></template>
                </td>
                <td class="t_o_w">
                  <div class="buttons">
                    <router-link class="button is-small is-rounded is-transparent" :to="{ path: '/edit/' + value._id }"><font-awesome-icon icon="pencil-alt" /></router-link>
                  </div>
                </td>
              </tr>
              <tr v-if="posts.length === 0">
                <td colspan="4" class="has-text-centered">Nop posts!</td>
              </tr>
            </tbody>
          </table>
          <p class="has-text-centered" v-if="loadWait === 1">
            <a class="level-item has-text-info" v-if="!gotPosts"><font-awesome-icon class="has-text-link" icon="spinner" size="lg" spin /></a>
            <a @click="morePosts" class="level-item has-text-info" v-if="gotPosts" >
              <font-awesome-icon class="has-text-link" icon="chevron-circle-down" size="lg" />
            </a>
          </p>
        </div>
      </section>
    </div>
    {{ allPosts }}
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faCheckCircle, faThumbtack, faTrash, faPencilAlt, faSpinner, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons'
library.add(faCircle, faCheckCircle, faThumbtack, faTrash, faPencilAlt, faSpinner, faChevronCircleDown)

export default {
  data () {
    return {
      posts: [],
      loadWait: 1,
      offset: 0,
      gotPosts: false
    }
  },
  props: [
    'show',
    'category'
  ],
  methods: {
    getPosts: function (offset, load) {
      this.loadWait = load || 0
      this.offset = offset || 0
      var params = {
        appid: this.$store.state.config.XbAppID,
        type: 'data',
        request: 'km_posts',
        getby: `postType:article,postCategory-_id:${this.category._id}`,
        offset: this.offset,
        max: 6
      }
      this.XbortGetRequest('', params, result => {
        if (result.result) {
          if (result.data.length > 0 && this.offset > 0) {
            for (let i = 0; i < result.data.length; i++) {
              this.posts.push(result.data[i])
            }
          } else if (result.data.length > 0 && this.offset === 0) {
            this.posts = result.data
          } else if (result.data.length === 0 && this.offset > 0) {
            this.posts = this.posts
          } else {
            this.posts = []
          }
          this.loadWait = 1
          this.gotPosts = true
        } else {
          this.loadWait = 1
          this.errorMessage(result.data.message)
        }
      })
    },
    resetPosts: function () {
      this.offset = 0
      this.loadWait = 1
    },
    morePosts: function () {
      this.gotPosts = false
      let newOffset = this.offset + 6
      this.getPosts(newOffset, 1)
    }
  },
  computed: {
    allPosts: function () {
      if (this.$parent.showPanel) {
        return this.getPosts(this.offset, this.loadWait)
      } else {
        return this.resetPosts()
      }
    }
  }
}
</script>
