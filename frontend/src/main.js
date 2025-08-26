import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          background: '#121212',
          primary: '#1976D2',
          secondary: '#424242',
          'on-background': '#e0e0e0',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(store)
app.use(vuetify)
app.mount('#app')
