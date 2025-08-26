import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Chat from '../components/Chat.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/chat', component: Chat, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.isLoggedIn) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && store.state.isLoggedIn) {
    next('/chat')
  } else {
    next()
  }
})

export default router
