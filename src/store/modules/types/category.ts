// 商品分类全局组件的小仓库
import { reqC1, reqC2, reqC3 } from "@/api/product/attr";
import { defineStore } from "pinia";
import type { CategoryResponseData } from "@/api/product/attr/type";
import type { CategoryState } from "./type";
let useCategoryStore = defineStore("Category", {
  state: (): CategoryState => {
    return {
      // 存储一级分类数据
      c1Arr: [],
      c1Id: "",
      c2Arr: [],
      c2Id: "",
      c3Arr: [],
      c3Id: "",
    };
  },
  actions: {
    async getC1() {
      let result: CategoryResponseData = await reqC1();
      if (result.code == 200) {
        this.c1Arr = result.data;
      }
    },
    async getC2() {
      let result: CategoryResponseData = await reqC2(this.c1Id);
      if (result.code == 200) {
        this.c2Arr = result.data;
      }
    },
    async getC3() {
      let result: CategoryResponseData = await reqC3(this.c2Id);
      if (result.code == 200) {
        this.c3Arr = result.data;
      }
    },
  },
  getters: {},
});

export default useCategoryStore;
