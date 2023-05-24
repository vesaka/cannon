import { createApp } from 'vue';
import '$cn/style.css';
import App from './App.vue';

import pinia from './bootstrap/pinia';
import router from './bootstrap/router';

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app');