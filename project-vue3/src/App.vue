<template>
  <div class="app">
    <!-- 头部 -->
    <HeaderBar></HeaderBar>

    <el-container
        style="height: 100vh;
      border: 1px solid #eee;
      margin: 0;
      border: 0;
      padding: 0;">
      <!-- 侧边栏 -->
      <el-aside style="width: 200px;">
        <AsideBar></AsideBar>
      </el-aside>
      <!-- 主页面 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import AsideBar  from '@/components/AsideBar'
import HeaderBar  from "@/components/HeaderBar";
export default {
  name: 'App',
  components: {
    AsideBar,
    HeaderBar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  margin: 0 auto;
}
</style>
