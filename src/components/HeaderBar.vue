<template>
  <div id="header">
    <el-row>
      <el-col :span="1" :offset="1">
        <el-image :src="require('@/assets/logo.png')" style="width: 60%; margin-top: 10px" />
      </el-col>
      <el-col :span="22">
        <h2 class="title">Data Visualization</h2>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "HeaderBar"
}
</script>

<style scoped>
#header {
  width: 100%;
  height: 60px;
  background: #000000;
}

.title {
  padding: 20px;
  display: block;
  color: #fff;
}
</style>