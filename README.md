# Vue3 后台运营管理系统

这是一个基于 Vue 3 + TypeScript + Vite 的后台管理系统作品集项目，包含登录鉴权、动态路由、权限菜单、用户/角色/菜单管理、商品管理和 ECharts 数据大屏等模块。

## 技术栈

- Vue 3 / TypeScript / Vite
- Vue Router / Pinia / Axios
- Element Plus / ECharts / SCSS
- GitHub Actions / GitHub Pages

## 在线演示模式

为了方便部署到 GitHub Pages，本项目在生产环境默认开启 mock 数据：

```env
VITE_USE_MOCK = 'true'
```

所以部署后不需要同时启动后端服务，也可以直接演示主要页面。

演示账号：

```text
账号：admin
密码：111111
```

## 本地运行

```bash
npm install
npm run dev
```

## 本地构建

```bash
npm run build
npm run preview
```

## 主要功能

- 登录页与 Token 持久化
- 路由守卫与动态路由注册
- 基于角色的权限菜单
- 用户管理、角色管理、菜单管理
- 品牌管理、属性管理、SPU 管理
- Element Plus 表格、表单、弹窗、分页
- ECharts 数据大屏
- GitHub Pages 静态部署演示
