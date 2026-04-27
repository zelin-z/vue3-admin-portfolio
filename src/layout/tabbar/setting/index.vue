<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefresh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>

  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
          @change="setColor"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          size="small"
          active-icon="MoonNight"
          inactive-icon="Sunny"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button
        size="small"
        icon="Setting"
        circle
        style="margin-right: 10px"
      ></el-button>
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayOutSettingStore from "@/store/modules/setting";
import useUserStore from "@/store/modules/user";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
let dark = ref<boolean>(false);
const color = ref("rgba(255, 69, 0, 0.68)");
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);
let $router = useRouter();
let $route = useRoute();
let userStore = useUserStore();
let layoutStore = useLayOutSettingStore();
const updateRefresh = () => {
  layoutStore.refsh = !layoutStore.refsh;
};
const fullScreen = () => {
  let full = document.fullscreenElement;
  if (!full) {
    // 切换全屏模式
    document.documentElement.requestFullscreen();
  } else {
    // 退出全屏模式
    document.exitFullscreen();
  }
};
// 退出登录
const logout = async () => {
  await userStore.userLogout();
  console.log("after logout store token:", userStore.token);
  console.log("localStorage TOKEN:", localStorage.getItem("TOKEN"));
  $router.push({ path: "/login", query: { redirect: $route.path } });
};

const changeDark = () => {
  let html = document.documentElement;
  dark.value ? (html.className = "dark") : (html.className = "");
};

const setColor = () => {
  const html = document.documentElement;
  html.style.setProperty("--el-color-primary", color.value);
};
</script>

<style scoped></style>
