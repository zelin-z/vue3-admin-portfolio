// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { viteMockServe } from "vite-plugin-mock";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default defineConfig(({ command, mode }) => {
  const isDev = command === "serve";
  const env = loadEnv(mode, process.cwd());
  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];

  return {
    // GitHub Pages 项目站点通常是 https://username.github.io/repository-name/
    // 本地开发不受影响；在 GitHub Actions 中会自动读取仓库名作为 base。
    base: repositoryName ? `/${repositoryName}/` : "./",
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      viteMockServe({
        mockPath: "mock",
        enable: isDev,
        watchFiles: true,
      }),
    ],
    resolve: {
      alias: { "@": path.resolve("./src") },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variable.scss" as *;',
        },
      },
    },
    server: {
      proxy: {
        [env.VITE_APP_BASE_API || "/api"]: {
          target: env.VITE_SERVE || "http://127.0.0.1:10086",
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
        },
      },
    },
  };
});
