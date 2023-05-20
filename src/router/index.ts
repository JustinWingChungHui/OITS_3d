import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( '../views/About.vue')
  },
  {
    path: '/animation/:urlBase64',
    name: 'Animation',
    component: () => import('../views/Animation.vue'),
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
