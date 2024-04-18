<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Histogram Rect</span>
      </div>
    </template>

    <div>
      <HistogramRectChart/>
    </div>
  </el-card>
</template>

<script setup>
import HistogramRectChart from "@/components/Chart/HistogramRectChart";
</script>

<style scoped>

</style>