import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

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

createApp(App).use(vuetify).mount('#app')
