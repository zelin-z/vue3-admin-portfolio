<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                title="删除SPU"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
    </el-card>
    <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="Spu"></SpuForm>
    <SkuForm v-show="scene == 2"></SkuForm>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { HasSpuResponseData, Records } from "@/api/product/spu/type";
import { reqHasSpu } from "@/api/product/spu";
import useCategoryStore from "@/store/modules/types/category";
import SkuForm from "./skuForm.vue";
import SpuForm from "./spuForm.vue";
import type { SpuData } from "@/api/product/spu/type";
let categoryStore = useCategoryStore();
let scene = ref<number>(0);
let pageNo = ref<number>(1);
let pageSize = ref<number>(3);
let records = ref<Records>([]);
let total = ref<number>(0);
let Spu = ref<any>();
watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) return;
    getHasSpu();
  }
);

// 此方法执行:可以获取某一个三级分类下全部已有的SPU
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager;
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id
  );
  if (result.code == 200) {
    records.value = result.data.records;
    total.value = result.data.total;
  }
};

const changeSize = () => {
  getHasSpu();
};

const addSpu = () => {
  scene.value = 1;
};

const changeScene = (num: number) => {
  scene.value = num;
};

const updateSpu = (row: SpuData) => {
  scene.value = 1;
  Spu.value.initHasSpuData(row);
};
</script>

<style scoped></style>
