<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" v-if="flag" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import useLayOutSettingStore from "@/store/modules/setting";
let layoutStore = useLayOutSettingStore();
import { watch, ref, nextTick } from "vue";
let flag = ref(true);
// 监听仓库内部分数据是否发生变化
watch(
  () => layoutStore.refsh,
  () => {
    flag.value = false;
    nextTick(() => {
      flag.value = true;
    });
  }
);
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
