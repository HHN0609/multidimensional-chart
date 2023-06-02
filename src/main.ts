import { createApp } from 'vue'
import './index.less'
import App from './App.vue'
import router from "@/router";
import pinia from "@/stores/store";
import "ant-design-vue/dist/antd.css";

createApp(App)
.use(pinia)
.use(router)
.mount('#app')
