<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Histogram Line</span>
      </div>
    </template>

    <div>
      <HistogramLineChart/>
    </div>
  </el-card>
</template>

<script setup>
import HistogramLineChart from "@/components/Chart/HistogramLineChart.vue";
</script>

<style scoped>

</style>