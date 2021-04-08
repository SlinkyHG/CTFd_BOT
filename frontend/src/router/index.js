import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Top from '../views/Top.vue'
import Hints from '../views/Hints.vue'
import FirstBlood from '../views/FirstBlood.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/top/:nb',
    name: 'Top',
    component: Top
  },
  {
    path: '/firstblood',
    name: 'FirstBlood',
    component: FirstBlood
  },
  {
    path: '/hints',
    name: 'Hints',
    component: Hints
  },
]

const router = new VueRouter({
  routes
})

export default router
