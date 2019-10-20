<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-field label="Title">
          <b-input v-model="title" placeholder="Website title"></b-input>
        </b-field>
        <b-field label="Website">
          <b-input v-model="url" placeholder="URL" type="url"></b-input>
        </b-field>
        <b-field label="Description">
          <b-input v-model="description" type="textarea" minlength="10" maxlength="250" placeholder="Website description..."></b-input>
        </b-field>
      </div>
      <div class="column">
        <b-field label="Posts per request">
          <b-input v-model="pagination" placeholder="Number of posts per page" type="number" min="3" max="50"></b-input>
        </b-field>
      </div>
    </div>
    <b-field>
      <button class="button is-primary" @click.prevent="submitSettings">Save</button>
    </b-field>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: null,
      title: null,
      description: null,
      url: null,
      pagination: 3
    }
  },
  created () {
    this.getSettings()
  },
  methods: {
    getSettings: function () {
      var params = {
        appid: this.$store.state.config.XbAppID,
        type: 'data',
        request: 'km_settings'
      }
      this.XbortGetRequest('', params, result => {
        if (result.result) {
          for (let settings in result.data) {
            if (result.data[settings]._id && result.data[settings].hasOwnProperty('settings')) {
              this.id = result.data[settings]._id
              if (result.data[settings].settings.title) {
                this.title = result.data[settings].settings.title
              }
              if (result.data[settings].settings.description) {
                this.description = result.data[settings].settings.description
              }
              if (result.data[settings].settings.url) {
                this.url = result.data[settings].settings.url
              }
              if (result.data[settings].settings.pagination) {
                this.pagination = result.data[settings].settings.pagination
              }
            } else {
              this.errorMessage('No data was retrieved!')
            }
          }
        } else {
          this.loadWait = 1
          this.errorMessage(result.data)
        }
      })
    },
    submitSettings: function () {
      if (this.id !== null) {
        let settingsData = {
          settings: {}
        }
        if (this.title !== null) {
          settingsData.settings.title = this.title
        }
        if (this.url !== null) {
          settingsData.settings.url = this.url
        }
        if (this.description !== null) {
          settingsData.settings.description = this.description
        }
        if (this.pagination > 3) {
          settingsData.settings.pagination = this.pagination
        } else {
          settingsData.settings.pagination = 3
        }
        let params = {
          appid: this.$store.state.config.XbAppID,
          type: 'data',
          request: 'km_settings',
          id: this.id,
          data: JSON.stringify(settingsData)
        }
        this.XbortRequest('', 'put', params, result => {
          if (result.result) {
            this.successSave()
            this.getSettings()
          } else {
            this.errorMessage(result.data)
          }
        })
      }
    }
  }
}
</script>
