import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';
import Chat from '../components/Chat.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AppSelection from '../components/AppSelection.vue';
import DummyApp1 from '../components/DummyApp1.vue';
import DummyApp2 from '../components/DummyApp2.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/apps', component: AppSelection, meta: { requiresAuth: true } },
  { path: '/chat', component: Chat, meta: { requiresAuth: true } },
  { path: '/dummy1', component: DummyApp1, meta: { requiresAuth: true } },
  { path: '/dummy2', component: DummyApp2, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.isLoggedIn) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && store.state.isLoggedIn) {
    next('/apps');
  } else {
    next();
  }
});

export default router;
