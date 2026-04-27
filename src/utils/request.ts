// 二次封装 axios
import axios from "axios";
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import useUserStore from "@/store/modules/user";
import { mockRequest } from "@/mock/demoData";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

const mockAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  const data = mockRequest(config);
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
    request: {},
  };
};

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
  adapter: useMock ? mockAdapter : undefined,
});

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.token = userStore.token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response.data);
  },
  (error) => {
    let message = "";
    const status = error.response?.status;
    switch (status) {
      case 401:
        message = "未登录";
        break;
      case 403:
        message = "登录过期，请重新登录";
        break;
      case 404:
        message = "网络请求不存在";
        break;
      case 500:
        message = "服务器出现问题";
        break;
      default:
        message = error.response?.data?.message || "网络请求失败";
        break;
    }
    ElMessage({
      type: "error",
      message,
    });
    return Promise.reject(error);
  }
);

export default request;
