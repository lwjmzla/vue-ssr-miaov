import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import about from '@/components/about'

Vue.use(Router)

export default () => {
  return new Router({
    mode:'history',
    base:'/',
    routes: [
      {
        path: '/',
        name: 'home',
        component: home
      },
      {
        path: '/about',
        name: 'about',
        component: about
      }
    ]
  })
}
