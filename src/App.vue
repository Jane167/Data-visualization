<template>
  <div class="app">
    <HeaderBar></HeaderBar>

    <el-container
        style="height: auto;
      border: 1px solid #eee;
      margin: 0;
      border: 0;
      padding: 0;">
      <el-aside style="width: 200px;">
        <AsideBar></AsideBar>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import AsideBar from '@/components/AsideBar'
import HeaderBar from "@/components/HeaderBar";

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
  margin: 0;
}

.el-card {
  overflow: visible !important;
  margin-top: 15px;
}

.el-card__header {
  width: calc(100% - 30px);
  background: #4caf50;
  top: -15px;
  left: 15px;
  position: relative;
  border-radius: 5px;
  font-weight: bold;
  color: #f6f6f6;
  box-shadow: #ccc 5px 5px 5px;
}
</style>
