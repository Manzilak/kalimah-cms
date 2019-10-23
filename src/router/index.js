import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "km-home-page" */ '@/views/Home.vue'),
    beforeEnter (to, from, next) {
      if (store.state.login.account.logged) {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import(/* webpackChunkName: "km-all-posts" */ '@/views/Posts.vue'),
    beforeEnter (to, from, next) {
      if (store.state.login.account.logged) {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/new',
    name: 'new',
    component: () => import(/* webpackChunkName: "km-new-post" */ '@/views/New.vue'),
    beforeEnter (to, from, next) {
      if (store.state.login.account.logged) {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: () => import(/* webpackChunkName: "km-edit-post" */ '@/views/Edit.vue'),
    beforeEnter (to, from, next) {
      if (store.state.login.account.logged) {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/control',
    component: () => import(/* webpackChunkName: "km-control-page" */ '@/views/Control.vue'),
    beforeEnter (to, from, next) {
      if (store.state.login.account.logged) {
        next()
      } else {
        next('/login')
      }
    },
    children: [
      {
        path: '',
        name: 'Settings',
        component: () => import(/* webpackChunkName: "km-control-settings" */ '@/components/Settings.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "km-control-profile" */ '@/components/Profile.vue')
      },
      {
        path: 'menus',
        name: 'Menus',
        component: () => import(/* webpackChunkName: "km-control-menus" */ '@/components/Menus.vue')
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import(/* webpackChunkName: "km-control-categories" */ '@/components/Categories.vue')
      },
      {
        path: 'tags',
        name: 'Tags',
        component: () => import(/* webpackChunkName: "km-control-tags" */ '@/components/Tags.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "km-login-page" */ '@/views/Login.vue')
  },
  {
    path: '*',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/views/Error.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
