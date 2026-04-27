import type { App } from "vue";
import pinia from "@/store";
import useUserStore from "@/store/modules/user";

export const isHasButton = (app: App) => {
  app.directive("has", {
    mounted(el, options) {
      const userStore = useUserStore(pinia);
      const permissionCode = options.value;
      if (permissionCode && !userStore.buttons.includes(permissionCode)) {
        el.parentNode?.removeChild(el);
      }
    },
  });
};
