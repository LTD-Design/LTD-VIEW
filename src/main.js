import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import DataV from '@kjgl77/datav-vue3'
import router from './router'
import App from './App.vue'

import './styles/variables.scss'
import './styles/editor.scss'
import './styles/animations.scss'
import '@kjgl77/datav-vue3/dist/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive)
app.use(DataV)

app.mount('#app')
