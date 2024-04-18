<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="card-title">Home</span>
        <p class="card-desc">Create a variety of customized visualizations using d3.js and Ant V. </p>

        <div class="mar-t-10">
          <el-tag v-for="item in tags" :key="item" class="mar-r-10" type="info">{{ item }}</el-tag>

        </div>
      </div>
    </template>
  </el-card>

</template>

<script setup>
import {reactive} from "vue";

const tags = reactive(['Customization', 'Data visualization', 'd3.js', 'Ant V', 'Dynamic'])
</script>

<style scoped>
.mar-r-10 {
  margin-right: 10px;
}

.mar-r-10 {
  margin-top: 10px;
}
</style>