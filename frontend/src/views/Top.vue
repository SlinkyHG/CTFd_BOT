<template>
  <div class="top" style="margin-left:.5em">
    <ol>
      <li v-for="(item) in top"
        :key="item.name" style="color:black">{{ item.name }}</li>
    </ol>
  </div>
</template>

<script>
import axios from 'axios'


export default {
  name: 'Top',
  data() {
    return {
      top: [],
      nb: this.$route.params.nb ? this.$route.params.nb : 3
    }
  },
  mounted: function() {
    this.updateData()
    setInterval(() => {
      this.updateData()
    }, 5000)
  },
  methods: {
    updateData () {
      axios.get('/api/top/' + this.nb)
        .then((response, error)=> {
          if(!error){
            this.top = response.data
            console.log(this.top)
          } else {
            console.warn(error)
          }
        })
    }
  }
}
</script>
