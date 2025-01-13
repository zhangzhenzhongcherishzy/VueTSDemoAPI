import './assets/main.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//!完全导入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//!导入element-plus icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//!导入使用element-plus样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/element/dark/css-vars.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
//!使用element-plus
app.use(ElementPlus)
//!导入使用element-plus icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
