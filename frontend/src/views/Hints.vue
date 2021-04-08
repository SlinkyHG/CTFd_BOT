<template>
  <div class="hints">
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      absolute
      centered
    >
      {{ notif.content }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
const sounds = [ new Audio(require('@/assets/sounds/hints/1.mp3')), new Audio(require('@/assets/sounds/hints/2.mp3'))]

export default {
  name: 'Hints',
  data() {
    return {
      hints: [],
      notif: { content: null, title: null, id: null},
      snackbar: false,
      timeout: 10000,
    }
  },
  mounted: function() {
    this.updateData()
    setInterval(() => {
      this.updateData()
    }, 5000)

    setInterval(() => {
      this.displayNotif()
    }, 12000)
  },
  methods: {
    updateData () {
      axios.get('/api/hintsQueue')
        .then((response, error)=> {
          if(!error){
            console.log(response.data)
            response.data.forEach((el) => {
              console.log(el)
              this.hints.push(el)
            })
          } else {
            console.warn(error)
          }
        })
    },
    displayNotif () {
      if(this.hints.length > 0){
        this.notif = this.hints.pop()
        this.snackbar = true
        this.timeout = 10000
        sounds[Math.floor(Math.random() * sounds.length)].play()
      }
    }
  }
}
</script>
