<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="default"
              class="login_btn"
              @click="login"
              :loading="loading"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import useUserStore from "@/store/modules/user";
import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus";
import { getTime } from "@/utils/time";
// 用户小仓库
let userStore = useUserStore();
let $router = useRouter();
let $route = useRoute();
let loading = ref(false);
// 收集账号密码的数据
let loginForm = reactive({
  username: "admin",
  password: "111111",
});

const loginForms = ref();

const login = async () => {
  await loginForms.value.validate();
  loading.value = true;
  try {
    await userStore.userLogin(loginForm);
    let redirect: any = $route.query.redirect;
    $router.push({ path: redirect || "/" });
    ElNotification({
      type: "success",
      message: "登录成功",
      title: `HI,${getTime()}好`,
    });
  } catch (error) {
    loading.value = false;
    ElNotification({
      type: "error",
      message: (error as Error).message,
    });
  }
};
// 定义表单校验需要配置对象
const rules = {
  username: [
    {
      required: true,
      min: 5,
      max: 10,
      message: "账号长度至少五位",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      min: 6,
      max: 10,
      message: "密码长度至少6位",
      trigger: "change",
    },
  ],
};
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    h1 {
      padding: 20px;
      color: white;
      font-size: 40px;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
