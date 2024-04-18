<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Volcano Plot</span>
      </div>
    </template>
    <div>
      <VolcanoPlot/>
    </div>
  </el-card>
</template>

<script setup>
import VolcanoPlot from "@/components/Chart/VolcanoPlot";

</script>

<style scoped>

</style>