<template>
  <div>
    <div class="hero has-background-white-bis">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-mobile is-multiline is-centered">
            <div class="column is-narrow-mobile">
              <div class="is-size-2-desktop is-size-3-mobile has-text-weight-bold">All Posts</div>
            </div>
            <div class="column is-narrow-mobile">
              <div class="buttons is-pulled-right">
                <a class="button is-primary is-rounded" @click="getPosts()"><font-awesome-icon v-if="loadWait === 1" icon="sync-alt" size="sm" /><font-awesome-icon v-if="loadWait === 0" icon="spinner" size="sm" spin /> <span style="padding-left: 8px"> Reload</span></a>
                <router-link class="button is-primary is-rounded" :to="{ path: '/new' }"><font-awesome-icon icon="plus" size="sm" /> <span style="padding-left: 8px"> New Post</span></router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="grid">
          <div class="grid-item" v-for="(value, key) in posts" :key="key">
            <div class="card">
              <div class="card-image" v-if="value.postImage">
                <figure class="image">
                  <template v-if="value.postImage"><img :src="XbortGetMedia(value.postImage, 'medium')" /></template>
                  <template v-else><img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image"></template>
                </figure>
              </div>
              <div class="card-content">
                <p class="is-size-4-touch is-size-3-desktop">{{ value.postTitle | htmlParse }}</p>
                <div class="level">
                  <div class="level-left">
                    <p class="content is-small">
                      {{ value.postDate | formatDate }}
                    </p>
                  </div>
                  <div class="level-right">
                    <p class="content">
                      <template v-if="value.postStatus === 'Publish' && value.postPin === 'No'"><font-awesome-icon class="has-text-success" icon="check-circle" /></template>
                      <template v-else-if="value.postStatus === 'Draft'"><font-awesome-icon class="has-text-grey-light" icon="circle" /></template>
                      <template v-else-if="value.postPin === 'Pin'"><font-awesome-icon class="has-text-primary" icon="thumbtack" /></template>
                      <template v-else></template>
                    </p>
                  </div>
                </div>
                <div class="level">
                  <div class="level-left">
                    <router-link class="button is-primary is-rounded is-small" :to="{ path: `/edit/${value._id}` }"><font-awesome-icon icon="pencil-alt" /></router-link>
                    <a class="button is-danger is-rounded is-small" @click="deletePost(value._id)" style="margin-left: 8px;"><font-awesome-icon icon="trash" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav class="level">
          <a class="level-item has-text-info" v-if="!gotPosts"><font-awesome-icon class="has-text-link" icon="spinner" size="lg" spin /></a>
          <a @click="morePosts" class="level-item has-text-info" v-if="gotPosts" >
            <font-awesome-icon class="has-text-link" icon="chevron-circle-down" size="lg" />
          </a>
        </nav>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'
import { faPlus, faSyncAlt, faCircle, faCheckCircle, faThumbtack, faSpinner, faChevronCircleDown, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
library.add(faSyncAlt, faPlus, faCircle, faCheckCircle, faThumbtack, faSpinner, faChevronCircleDown, faPencilAlt, faTrash)

export default {
  data () {
    return {
      loadWait: 1,
      posts: [],
      post: null,
      offset: 0,
      gotPosts: false,
      max: 0
    }
  },
  created () {
    this.getPosts()
  },
  updated () {
    this.max = this.settings.pagination
    this.postsGrid()
  },
  methods: {
    getPosts: function (offset, load) {
      this.loadWait = load || 0
      this.offset = offset || 0
      var params = {
        appid: this.$store.state.config.XbAppID,
        type: 'data',
        request: 'km_posts',
        getby: 'postType:article',
        offset: this.offset,
        max: this.max
      }
      this.XbortGetRequest('', params, result => {
        if (result.result) {
          if (result.data.length > 0 && this.offset > 0) {
            for (let i = 0; i < result.data.length; i++) {
              this.posts.push(result.data[i])
            }
          } else if (this.offset === 0) {
            this.posts = result.data
          }
          this.$store.dispatch('showWaiting', false)
          this.$store.dispatch('showReload', false)
          this.loadWait = 1
          this.gotPosts = true
        } else {
          this.loadWait = 1
          this.errorMessage(result.data.message)
        }
      })
    },
    postsGrid: function () {
      let grid = document.querySelector('.grid')
      if (grid) {
        let masonry = new Masonry('.grid', {
          itemSelector: '.grid-item',
          columnWidth: '.grid-item',
          gutter: 35,
          horizontalOrder: true,
          percentPosition: true
        })
        imagesLoaded(grid).on('progress', function () {
          // layout Masonry after each image loads
          masonry.layout()
        })
      }
    },
    deletePost: function (post) {
      this.$dialog.confirm({
        title: 'Deleting Post!',
        message: 'Are you sure you want to <b>delete</b> this post? This action cannot be undone.',
        confirmText: 'Delete Post',
        type: 'is-danger',
        onConfirm: () => {
          let params = {
            appid: this.$store.state.config.XbAppID,
            type: 'data',
            request: 'km_posts',
            id: post
          }
          this.XbortRequest('', 'delete', params, result => {
            if (result.result) {
              this.getPosts(this.offset, this.loadWait)
              this.$toast.open({ message: 'Post deleted!', type: 'is-success' })
            } else {
              this.errorMessage(result.data)
            }
          })
        }
      })
    },
    morePosts: function () {
      this.gotPosts = false
      let newOffset = this.offset + 6
      this.getPosts(newOffset, 1)
    }
  },
  computed: {
    ...mapGetters({
      settings: 'getSettings'
    })
  }
}
</script>

<style scoped>
.buttons {
  margin-top: 10px;
}
@media screen and (min-width: 800px) {
  .grid-item {
    width: 31.5%;
  }
}
@media screen and (max-width: 799px) {
  .grid-item {
    width: 100%;
  }
}
.grid-item {
  float: left;
  margin-bottom: 30px;
}
.card {
  border: 0;
  -webkit-box-shadow: 0px 0px 20px 8px rgba(59, 59, 59, 0.15), 0 0 0 0px rgba(59, 59, 59, 0.15);
  -moz-box-shadow: 0px 0px 20px 8px rgba(59, 59, 59, 0.15), 0 0 0 0px rgba(59, 59, 59, 0.15);
  box-shadow: 0px 0px 20px 8px rgba(125, 125, 125, 0.15), 0 0 0 0px rgba(125, 125, 125, 0.15);
  border-radius: 10px;
}
.image img {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
