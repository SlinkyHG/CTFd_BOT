<template>
  <div class="firstblood">
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      absolute
      centered
    >
      {{ notif.userName }} à flag en premier le challenge {{ notif.challName}}

    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'

const sound = new Audio(require('@/assets/sounds/First_Blood.mp3'))

export default {
  name: 'FirstBlood',
  data() {
    return {
      firstblood: [],
      notif: undefined,
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
      axios.get('/api/firstBloodQueue')
        .then((response, error)=> {
          if(!error){
            console.log(response.data)
            response.data.forEach((el) => {
              console.log(el)
              this.firstblood.push(el)
            })
          } else {
            console.warn(error)
          }
        })
    },
    displayNotif () {
      if(this.firstblood.length > 0){
        this.notif = this.firstblood.pop()
        this.snackbar = true
        this.timeout = 10000
        sound.play()
      }
    }
  }
}
</script>
