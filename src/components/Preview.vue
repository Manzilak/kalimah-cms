<template>
  <div class="slideout" :class="{active: preview}">
    <div class="panel">
      <div>
        <a type="button" class="delete is-larg" @click="$parent.previewPost">close</a>
      </div>
      <div class="content">
        <section class="section">
          <div class="image post-image" v-if="post.postImage">
            <img class="main-image" :src="XbortGetMedia(post.postImage, 'large')" />
          </div>
          <h1 class="is-size-1-desktop">{{ post.postTitle }}</h1>
          <div class="level">
            <div class="levl-left">
              <div class="level-item">
                <p class="subtitle">{{ post.postCategory.category_name }}</p>
              </div>
            </div>
            <div class="levl-left">
              <div class="level-item">
                <span class="tag is-white">{{ post.postDate | formatDate }} </span>
              </div>
            </div>
          </div>
          <hr />
          <p v-html="post.postContent"></p>
        </section>
        <section class="section" v-if="post.postTags.length > 0">
          <b-taglist>
            <template v-for="(value, key) in post.postTags">
              <b-tag type="is-primary" :key="key" v-if="value.tag_name">{{ value.tag_name }}</b-tag>
            </template>
          </b-taglist>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'post',
    'preview'
  ]
}
</script>

<style>
.post-image {
  position: relative;
  height: 280px;
  overflow: hidden;
  width: 100%;
}
.post-image img {
  min-height: 100%;
  min-width: 100%;
  position: absolute;
  top: -9999px;
  bottom: -9999px;
  left: -9999px;
  right: -9999px;
  margin: auto;
}
.image-style-align-left {
  float: left;
}
.image-style-align-right {
  float: right;
}
.content figure:not(:last-child) {
    margin-bottom: 1em;
}
.content figure:not(:first-child) {
    margin-bottom: 1em;
}
</style>
