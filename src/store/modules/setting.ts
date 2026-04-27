// 小仓库:layout组件相关配置库
import { defineStore } from "pinia";

let useLayOutSettingStore = defineStore("SettingStore", {
  state: () => {
    return {
      fold: false,
      refsh: false,
    };
  },
});

export default useLayOutSettingStore;
