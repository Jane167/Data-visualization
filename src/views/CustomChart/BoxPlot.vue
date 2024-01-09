<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Box Plot</span>
      </div>
    </template>

    <div>
      <BoxPlotChart/>
    </div>
  </el-card>
</template>

<script>
import BoxPlotChart from "@/components/Chart/BoxPlotChart";

export default {
  name: "HistogramRect",
  components: {BoxPlotChart}
}
</script>

<style scoped>

</style>