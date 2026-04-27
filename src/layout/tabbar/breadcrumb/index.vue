<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="settingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包动态展示路由名字与标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 图标 -->
      <el-icon style="margin: 0px 2px">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示匹配路由的标题 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayOutSettingStore from "@/store/modules/setting";
import { useRoute } from "vue-router";
//获取layout配置相关的仓库
let settingStore = useLayOutSettingStore();
// 获取路由对象
let $route = useRoute();

const changeIcon = () => {
  // 图标进行切换
  settingStore.fold = !settingStore.fold;
};
</script>

<style scoped></style>
