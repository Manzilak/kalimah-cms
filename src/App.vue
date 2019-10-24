<template>
  <div id="app">
    <Head v-if="userLogged"/>
    <router-view/>
    <Foot v-if="userLogged"/>
  </div>
</template>

<script>
// Get users logged status
import { mapGetters } from 'vuex'

// Get header and footer components
import Head from './components/Head'
import Foot from './components/Foot'

export default {
  name: 'app',
  components: {
    Head,
    Foot
  },
  beforeCreate () {
    this.$store.dispatch('loadConfig')
  },
  computed: {
    ...mapGetters({
      userLogged: 'getLogged'
    })
  }
}
</script>
