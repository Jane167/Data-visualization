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


      <el-menu-item index="/home" route="/home">
        <el-icon>
          <icon-menu/>
        </el-icon>
        <span>Home</span>
      </el-menu-item>
      <el-menu-item index="/hello" route="/hello">
        <el-icon>
          <document/>
        </el-icon>
        <span>Hello</span>
      </el-menu-item>

    </el-menu>

  </div>
</template>

<script setup>
// export default {
//   name: "AsideBar"
// }
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<style scoped>

</style>