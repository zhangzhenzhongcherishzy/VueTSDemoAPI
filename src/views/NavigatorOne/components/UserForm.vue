<template>
  <div id="wrap">
    <h1>用户权限</h1>
    <img :src="imgSrc" alt="" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'UserForm',
}
</script>

<script lang="ts" setup>
import imgSrc from '@/assets/images/6.png'
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
