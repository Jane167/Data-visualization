<template>
  <div id="app">
    <HeaderBar />

    <el-container
        style="height: auto;
        border: 1px solid #eee;
        margin: 0;
        border: 0;
        padding: 0;">
      <el-aside style="width: 200px;">
        <AsideBar/>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import AsideBar from '@/components/AsideBar'
import HeaderBar from "@/components/HeaderBar";

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
html {
  font-size: 16px;
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

.card-title {
  font-size: 1.2rem;
  line-height: 1.6rem;
}
.card-desc {
  font-size: 0.9rem;
  font-weight: lighter;
  color: #000;
}


</style>
