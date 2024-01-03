<template>
  <div class="aside" style="width: 100%;">
    <el-menu router style="min-height: 800px"
             active-text-color="#4caf50"
             background-color="#000000"
             class="el-menu-vertical-demo"
             default-active="2"
             text-color="#fff"
             @open="handleOpen"
             @close="handleClose"
             :collapse="false"
    >
      <el-menu-item index="home">
        <el-icon>
          <HomeFilled/>
        </el-icon>
        <span>Home</span>
      </el-menu-item>
      <el-sub-menu index="1">
        <template #title>
          <el-icon>
            <Menu/>
          </el-icon>
          <span>Custom Chart</span>
        </template>
        <el-menu-item index="pie&groupedColumn">Pie & Grouped Column</el-menu-item>
        <el-menu-item index="histogramRect">Histogram ( rect )</el-menu-item>
        <el-menu-item index="histogramLine">Histogram ( line )</el-menu-item>
        <el-menu-item index="histogramMulti">Histogram ( multiple )</el-menu-item>


      </el-sub-menu>

    </el-menu>

  </div>
</template>

<script>
import {HomeFilled, Menu} from '@element-plus/icons-vue'

export default {
  name: "AsideBar",
  components: {Menu, HomeFilled},
  setup() {
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath)
    }
    return {
      handleOpen,
      handleClose
    }
  }
}


</script>

<style scoped>

</style>