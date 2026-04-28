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
          <div class="demo_accounts">
            <p>演示账号：点击可快速填充，用于查看不同角色的动态菜单</p>
            <el-button
              v-for="account in demoAccounts"
              :key="account.username"
              size="small"
              type="primary"
              plain
              @click="fillAccount(account)"
            >
              {{ account.label }}
            </el-button>
          </div>
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

const demoAccounts = [
  { label: "超级管理员 admin", username: "admin", password: "111111" },
  { label: "商品运营 product", username: "product", password: "111111" },
  { label: "只读用户 viewer", username: "viewer", password: "111111" },
];

const fillAccount = (account: { username: string; password: string }) => {
  loginForm.username = account.username;
  loginForm.password = account.password;
};

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
      padding: 20px 20px 10px;
      color: white;
      font-size: 40px;
    }
    .demo_accounts {
      padding: 0 20px 16px;
      color: #ffffff;
      p {
        margin-bottom: 10px;
        font-size: 14px;
        opacity: 0.9;
      }
      .el-button {
        margin: 0 8px 8px 0;
      }
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
