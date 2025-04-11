import { createApp } from "vue";
import App from "./app.vue";
import easyestplus from "easyestplus";
const app = createApp(App);
app.use(easyestplus)
app.mount("#app");