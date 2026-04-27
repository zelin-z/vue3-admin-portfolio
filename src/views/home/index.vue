<template>
  <el-card>
    <div class="box">
      <img :src="store.avatar" alt="" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好呀{{ store.username }}</h3>
        <p class="subtitle">硅谷甄选运营平台</p>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import userStore from "@/store/modules/user";
let store = userStore();
import { getTime } from "@/utils/time";
</script>

<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }
    .subtitle {
      font-style: italic;
      color: gainsboro;
    }
  }
}
</style>
