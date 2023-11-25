import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
  // Setting the global default position
  position: "bottom-left",
};
const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(Toast, options);
app.mount("#app");

// @ts-ignore
window.store = pinia;
