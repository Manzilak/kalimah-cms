<template>
  <div>
    <section class="hero has-background-white-bis">
        <div class="hero-body">
          <div class="container">
            <h1 class="is-size-1-desktop">
              {{ this.$route.name }}
            </h1>
          </div>
        </div>
        <div class="hero-footer">
          <div class="container">
            <div class="tabs is-boxed">
              <ul>
                <router-link tag="li" active-class="is-active" :to="{ path: '/control/' }" exact><a>Settings</a></router-link>
                <router-link tag="li" active-class="is-active" :to="{ path: '/control/profile' }"><a>Profile</a></router-link>
                <!-- <router-link tag="li" active-class="is-active" :to="{ path: '/control/menus' }"><a>Menus</a></router-link> -->
                <router-link tag="li" active-class="is-active" :to="{ path: '/control/categories' }"><a>Categories</a></router-link>
                <router-link tag="li" active-class="is-active" :to="{ path: '/control/tags' }"><a>Tags</a></router-link>
              </ul>
            </div>
          </div>
        </div>
    </section>
    <section class="section">
      <div class="container">
        <router-view/>
      </div>
    </section>
  </div>
</template>
