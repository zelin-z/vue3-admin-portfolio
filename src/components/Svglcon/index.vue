<template>
  <div>
    <svg :width="props.width" :height="props.heiht">
      <use :href="`#${props.prefix}${props.name}`"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  name: { type: String, required: true },
  prefix: { type: String, default: "icon-" },
  width: { type: [String, Number], default: "16px" },
  heiht: { type: [String, Number], default: "16px" },
});
</script>

<style scoped></style>
