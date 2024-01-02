<template>
  <div class="aside" style="width: 100%;">
    <el-menu router style="min-height: 500px"
             active-text-color="#ffd04b"
             background-color="#545c64"
             class="el-menu-vertical-demo"
             default-active="2"
             text-color="#fff"
             @open="handleOpen"
             @close="handleClose"
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
        <el-menu-item index="1-2">item two</el-menu-item>
        <el-menu-item index="1-3">item three</el-menu-item>

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