<template>
  <nav class="navbar has-shadow is-white">
    <div class="container">
        <div class="navbar-brand">
          <router-link class="navbar-item" :to="{ path: '/' }">
            <img src="../assets/logo.png" :alt="title">
          </router-link>
          <div id="burger" class="navbar-burger" @click="openMenu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div id="menu" class="navbar-menu">
          <div class="navbar-start">
            <router-link class="navbar-item" active-class="is-active" :to="{ path: '/' }" exact>posts</router-link>
            <!-- <router-link class="navbar-item" active-class="is-active" :to="{ path: '/posts' }" exact>posts</router-link> -->
            <router-link class="navbar-item" active-class="is-active" :to="{ path: '/control' }">control</router-link>
          </div>
          <div class="navbar-end">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-item">
                <font-awesome-icon icon="user" class="has-text-primary" />
                <div class="navbar-dropdown is-boxed">
                  <router-link class="navbar-item" active-class="is-active" :to="{ path: '/control/profile' }">Profile</router-link>
                  <hr class="navbar-divider">
                  <a class="navbar-item"  @click="clearAccount">Logout</a>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
  </nav>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser } from '@fortawesome/free-solid-svg-icons'
library.add(faUser)

export default {
  data () {
    // From API
    return {
      title: 'Kalimah'
    }
  },
  methods: {
    openMenu: function () {
      var burger = document.getElementById('burger')
      var menu = document.getElementById('menu')
      burger.classList.toggle('is-active')
      menu.classList.toggle('is-active')
    },
    clearAccount: function () {
      this.$store.dispatch('clearAccount')
    }
  }
}
</script>
