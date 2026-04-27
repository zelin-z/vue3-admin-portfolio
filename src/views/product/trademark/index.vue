<template>
  <el-card>
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button
      type="primary"
      size="default"
      icon="plus"
      @click="addTrademark"
      v-has="`btn.TradeMark.add`"
      >添加品牌</el-button
    >
    <!-- 表格组件：用于展示已有得平台数据 -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称">
        <template #="{ row, $index }">
          <pre style="color: black">{{ row.tmName }}</pre>
        </template>
      </el-table-column>
      <el-table-column label="品牌LOGO">
        <template #default="{ row }">
          <img
            :src="row.logoUrl"
            alt="logo"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
          ></el-button>
          <el-popconfirm
            :title="`您确定要删除${row.tmName}?`"
            width="260px"
            icon="delete"
            @confirm="removeTradeMark(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="changePageNo"
      :pager-count="9"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    />
  </el-card>
  <!-- 对话框组件：在添加品牌与修改已有品牌的业务时候使用结构 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input
          placeholder="请您输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          action="api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="uploadHeaders"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽:footer -->
    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="confirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from "@/api/product/trademark";
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from "@/api/product/trademark/type";
import { ElMessage, type UploadProps } from "element-plus";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();

const uploadHeaders = {
  token: userStore.token,
};
// 当前页面
let pageNo = ref<number>(1);
// 每一页展示多少条数据
let limit = ref<number>(3);
// 存储已有品牌的数据
let trademarkArr = ref<Records>([]);
// 存储已有品牌数据总数
let total = ref<number>(0);
let dialogFormVisible = ref<boolean>(false);
// 定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: "",
  logoUrl: "",
});
// 获取el-form组件实例
let formRef = ref();
// 获取已有品牌的接口封装为一个函数：在任何情况下获取数据，调用函数即可
const getHasTrademark = async (pager = 1) => {
  const result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value
  );

  if (result.code == 200 || result.code == 0) {
    total.value = result.data.total;
    trademarkArr.value = result.data.records;
  }
};
// 组件挂载完毕钩子---发一次请求，获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark();
});

// 分页器当前页码发生变化的时候会触发
const changePageNo = () => {
  getHasTrademark();
};

const sizeChange = () => {
  pageNo.value = 1;
  getHasTrademark();
};

const addTrademark = () => {
  dialogFormVisible.value = true;
  trademarkParams.id = 0;
  trademarkParams.tmName = "";
  trademarkParams.logoUrl = "";
  nextTick(() => {
    formRef.value.clearValidate("tmName");
    formRef.value.clearValidate("logoUrl");
  });
};

const updateTrademark = (row: TradeMark) => {
  // row为当前已有的品牌
  trademarkParams.id = row.id;
  trademarkParams.tmName = row.tmName;
  trademarkParams.logoUrl = row.logoUrl;
  dialogFormVisible.value = true;
  nextTick(() => {
    formRef.value.clearValidate("tmName");
    formRef.value.clearValidate("logoUrl");
  });
};

const cancel = () => {
  dialogFormVisible.value = false;
};

const confirm = async () => {
  // 在你发请求之前，要对于整个表单进行校验
  // 调用这个方法进行全部表单项校验，如果校验全部通过，再执行后面的语法
  await formRef.value.validate();
  formRef.value.validate();
  let result: any = await reqAddOrUpdateTrademark(trademarkParams);
  // 添加or修改品牌成功
  if (result.code == 200) {
    // 关闭对话框
    dialogFormVisible.value = false;
    // 弹出提示信息
    ElMessage({
      type: "success",
      message: trademarkParams.id ? "修改品牌成功" : "添加品牌成功",
    });
    // 再次发请求获取已有全部的品牌数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1);
  } else {
    // 添加品牌失败
    ElMessage({
      type: "error",
      message: trademarkParams.id ? "修改品牌失败" : "添加品牌失败",
    });
    //关闭对话框
    dialogFormVisible.value = false;
  }
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (
    rawFile.type == "image/png" ||
    rawFile.type == "image/jpeg" ||
    rawFile.type == "image/gif"
  ) {
    if (rawFile.size / 2014 / 2014 < 4) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传文件大小小于4M",
      });
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传文件类型务必为图片",
    });
  }
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  trademarkParams.logoUrl = response.data;
};

// 品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack();
  } else {
    callBack(new Error("品牌名称位数大于等于两位"));
  }
};

const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  // 如果图片上传
  if (value) {
    callBack();
  } else {
    callBack(new Error("LOGO图片务必上传"));
  }
};

// 表单校验规则对象
const rules = {
  tmName: [{ required: true, trigger: "blur", validator: validatorTmName }],
  logoUrl: [{ required: true, trigger: "change", validator: validatorLogoUrl }],
};

// 气泡确认框确定按钮的回调
const removeTradeMark = async (id: number) => {
  // 点击确定按钮删除已有品牌请求
  let result = await reqDeleteTrademark(id);
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: "删除品牌成功",
    });
    // 再次获取已有的品牌数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1
    );
  } else {
    ElMessage({
      type: "error",
      message: "删除品牌失败",
    });
  }
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
