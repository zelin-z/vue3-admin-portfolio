<template>
  <div class="box2">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
let charts = ref();
onMounted(() => {
  let mychart = echarts.init(charts.value);
  let option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "40",
      right: 30,
      orient: "vertical",
      textStyle: {
        color: "white",
        fontSize: 14,
      },
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inside",
          color: "white",
        },

        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "10岁以下" },
          { value: 735, name: "10-18岁" },
          { value: 580, name: "18-30岁" },
          { value: 484, name: "30-40岁" },
          { value: 300, name: "40-60岁" },
        ],
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        },
      },
    ],
  };
  mychart.setOption(option);
});
</script>

<style scoped lang="scss">
.box2 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    flex: 1; /* 自动撑满剩余空间 */
    width: 100%; /* 必须确保有宽度 */
    min-height: 200px; /* 或者给一个固定高度进行测试 */
  }
}
</style>
