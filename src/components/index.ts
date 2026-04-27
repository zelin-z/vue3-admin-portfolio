// 引入项目的全局组件
import SvgIcon from "./Svglcon/index.vue";
import Pagi from "./Pagi/index.vue";
import Category from "./Category/index.vue";
import type { App, Component } from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 全局对象
const allGlobalComponents: Record<string, Component> = {
  SvgIcon,
  Pagi,
  Category,
};

export default {
  install(app: App) {
    Object.entries(allGlobalComponents).forEach(([name, comp]) => {
      app.component(name, comp);
    });
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
