<template>
  <footer class="footer">
    <div class="container">
      <div class="content has-text-centered">
        <p>
          <strong>Kalimah&copy; CMS {{ kalimah }} </strong><br>
          By <a href="https://manzilak.com">Manzilak</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data () {
    return {
      kalimah: JSON.stringify(require('../../package.json').version)
    }
  }
}
</script>
