import router from "@/router";
import nprogress from "nprogress";
// 进度条样式
import "nprogress/nprogress.css";
nprogress.configure({ showSpinner: false });
// 获取用户相关的小仓库内部token数据，去判断用户是否登录成功
import useUserStore from "./store/modules/user";
import pinia from "./store";
let userStore = useUserStore(pinia);
// 获取用户名字
let username = userStore.username;

router.beforeEach(async (to: any, from: any, next: any) => {
  //to:你将要访问的那个路由
  //from:你从哪个路由而来
  //next:路由的放行函数
  document.title = to.meta.title;
  nprogress.start();
  // 获取token，去判断用户登录还是未登录
  let token = userStore.token;
  let username = userStore.username;
  if (token) {
    // 登录成功
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if (username) {
        next();
      }
      try {
        // 如果没有用户信息,在守卫这里发请求获取到了用户信息再放行
        await userStore.userInfo();
        next({ ...to });
      } catch (error) {
        // token过期:获取不到用户信息了
        // 用户手动修改本地存储token
        // 退出登录->用户相关的数据清空
        await userStore.userLogout();
        next({ path: "/login", query: { redirect: to.path } });
      }
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next({ path: "/login", query: { redirect: to.path } });
    }
  }
});

router.afterEach((to: any, from: any) => {
  nprogress.done();
});
