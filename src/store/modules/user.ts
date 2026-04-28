// 创建用户小仓库
import { defineStore } from "pinia";
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from "@/api/user/type";
import type { UserState } from "./types/type";
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from "@/utils/token";
import router from "@/router";
// 引入路由
import { constantRoute, asnycRoute, anyRoute } from "@/router/routes";
//@ts-ignore
import cloneDeep from "lodash/cloneDeep";

function collectRouteNames(routes: any[]): string[] {
  return routes.reduce((names: string[], route: any) => {
    if (route.name) names.push(route.name);
    if (route.children?.length) names.push(...collectRouteNames(route.children));
    return names;
  }, []);
}

const dynamicRouteNames = collectRouteNames([...asnycRoute, ...anyRoute]);

function resetDynamicRoutes() {
  dynamicRouteNames.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name);
    }
  });
}

function filterAsyncRoute(asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes);
      }
      return true;
    }
  });
}

let userStore = defineStore("User", {
  // 存储数据的地方
  // src/store/modules/user.ts 的 state 部分
  state: (): UserState => {
    return {
      token: localStorage.getItem("TOKEN"), // 💡 直接用原生 API 替代 GET_TOKEN()
      menuRoutes: constantRoute,
      username: "",
      avatar: "",
      buttons: [],
    };
  },
  actions: {
    // 用户登录方法

    async userLogin(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data);

      if (result.code == 200 || result.code == 0) {
        const token = (result.data as any).token || (result.data as string);
        if (token) {
          this.token = token;
          localStorage.setItem("TOKEN", token);
          return "ok";
        }
      }
      return Promise.reject(new Error(result.message || "登录失败"));
    },
    // 获取用户信息方法
    async userInfo() {
      let result: userInfoReponseData = await reqUserInfo();

      if (result.code == 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        this.buttons = result.data.buttons;
        // 每次根据当前用户权限重新生成动态路由，避免切换账号后保留上一个账号的路由。
        resetDynamicRoutes();
        let userAsyncRoute = filterAsyncRoute(
          cloneDeep(asnycRoute),
          result.data.routes
        );
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute];
        [...userAsyncRoute, ...anyRoute].forEach((route: any) => {
          if (!router.hasRoute(route.name)) {
            router.addRoute(route);
          }
        });
        return "ok";
      } else {
        return Promise.reject("获取用户信息失败");
      }
    },
    // 退出登录
    async userLogout() {
      try {
        await reqLogout();
      } catch (e) {
        console.warn("调用退出接口失败，但仍然清空本地登录状态：", e);
      }

      this.token = "";
      this.username = "";
      this.avatar = "";
      this.buttons = [];
      this.menuRoutes = constantRoute;
      resetDynamicRoutes();
      REMOVE_TOKEN();
    },
  },
});

export default userStore;
