<template>
  <div id="wrap">
    <h1>修改器</h1>
    <img :src="imgSrc" alt="" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'ModifierPage',
}
</script>

<script lang="ts" setup>
import imgSrc from '@/assets/images/5.jpg'
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

