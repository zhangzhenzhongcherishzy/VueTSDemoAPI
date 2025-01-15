<template>
  <div id="wrap">
    <h1>状态管理</h1>
    <img :src="imgSrc" alt="" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'StatePage',
}
</script>

<script lang="ts" setup>
import imgSrc from '@/assets/images/7.png'
</script>

<style lang="scss">
#wrap {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

