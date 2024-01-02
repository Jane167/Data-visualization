<template>
  <div id="header">
    <el-row>
      <el-col :span="1" style="text-align: right">
        <el-image :src="require('@/assets/logo.png')" style="width: 30px; margin-top: 20px; " />
      </el-col>
      <el-col :span="20">
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
  border-bottom: 1px solid #dedede;
  box-shadow: #999 5px 5px 5px;
}

.title {
  padding: 20px;
  display: block;
  color: #fff;
}
</style>