import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
//@ts-ignore
import VueTypewriterEffect from 'vue-typewriter-effect';

const options = {
  // Setting the global default position
  position: 'top-left',
  icon: true,
  toastClassName: 'my-custom-toast-class',
};
const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(Toast, options);
app.component('vue-typewriter-effect', VueTypewriterEffect);
app.mount('#app');

// @ts-ignore
window.store = pinia;
