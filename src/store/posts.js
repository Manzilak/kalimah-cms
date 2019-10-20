'use strict'

const state = {
  post: {
    _id: null,
    title: null,
    slug: null,
    content: null,
    postStat: null,
    postPin: false,
    postDate: null,
    postExpire: null,
    postType: null,
    postOwner: null,
    postParent: [],
    comments: [],
    postImages: [],
    postMeta: [],
    postKeywords: []
  }
}

const getters = {
  getPosts: (state) => {
    return state.posts
  },
  getPost: (state) => {
    return state.post
  }
}

const mutations = {
  setPosts: (state, posts) => {
    state.posts = posts
  },
  setPost: (state, post) => {
    state.post = post
  }
}

const actions = {
  showPosts: ({ commit }, posts) => {
    commit('setPosts', posts)
  },
  showPost: ({ commit }, post) => {
    commit('setPost', post)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
