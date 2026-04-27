<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请你输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select style="width: 240px">
        <el-option
          v-for="(item, index) in AllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请你输入SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select style="width: 240px">
        <el-option label="华为" value="huawei"></el-option>
        <el-option label="oppo" value="oppo"></el-option>
        <el-option label="vivo" value="vivo"></el-option>
      </el-select>
      <el-button
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        >添加属性值</el-button
      >
      <el-table border style="margin: 10px 0px">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="销售属性名字" width="120px"></el-table-column>
        <el-table-column label="销售属性值"></el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
let $emit = defineEmits(["changeScene"]);
import type { SpuData } from "@/api/product/spu/type";
import { ref } from "vue";
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from "@/api/product/spu";
import type {
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
} from "@/api/product/spu/type";
const cancel = () => {
  $emit("changeScene", 0);
};
let AllTradeMark = ref<Trademark[]>([]);
let imgList = ref<SpuImg[]>([]);
let saleAttr = ref<SaleAttr[]>([]);
let allSaleAttr = ref<HasSaleAttr[]>([]);
let SpuParams = ref<SpuData>({
  category3Id: "",
  spuName: "",
  description: "",
  tmId: "",
  spuImageList: [],
  spuSaleAttrList: [],
});
const initHasSpuData = async (spu: SpuData) => {
  SpuParams.value = spu;
  let result: AllTradeMark = await reqAllTradeMark();
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number);
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number);
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr();
  AllTradeMark.value = result.data;
  imgList.value = result1.data;
  imgList.value = (result1.data || []).map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl || item.url,
    };
  });
  saleAttr.value = result2.data;
  allSaleAttr.value = result3.data;
};
defineExpose({ initHasSpuData });
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
