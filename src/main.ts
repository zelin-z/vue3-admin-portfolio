import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "@/App.vue";
import "./styles/index.scss";
//@ts-ignore
import { zhCn } from "element-plus/es/locales.mjs";
import "virtual:svg-icons-register";
import allGlobal from "./components/";
import router from "./router";
import pinia from "./store";
import "element-plus/theme-chalk/dark/css-vars.css";
// 路由鉴权
import "./permisstions";
import { isHasButton } from "@/directive/has";

const app = createApp(App);
isHasButton(app);

app.use(allGlobal);
app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount("#app");
