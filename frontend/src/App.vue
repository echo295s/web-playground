<template>
  <Chat v-if="isLoggedIn" />
  <Login
    v-else-if="!isRegisterMode"
    @login-success="isLoggedIn = true"
    @go-register="isRegisterMode = true"
  />
  <Register v-else @go-login="isRegisterMode = false" />
</template>

<script setup>
import { ref } from 'vue'
import Chat from './components/Chat.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'

const isLoggedIn = ref(!!localStorage.getItem('token'))
const isRegisterMode = ref(false)
</script>

