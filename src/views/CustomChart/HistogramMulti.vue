<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Multiple Histogram</span>
      </div>
    </template>

    <div>
      <HistogramMultiChart/>
    </div>
  </el-card>
</template>

<script>
import HistogramMultiChart from "@/components/Chart/HistogramMultiChart";

export default {
  name: "HistogramMulti",
  components: {HistogramMultiChart}
}
</script>

<style scoped>

</style>