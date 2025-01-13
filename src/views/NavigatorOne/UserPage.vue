<template>
  <div id="wrap">
    <h1>用户管理</h1>
    <div>
      {{ userInfo }}
    </div>
    <el-button type="success" @click="sendGetUserInfo">发送请求</el-button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'UserPage',
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import 'element-plus/theme-chalk/el-message.css'

import { type IUsersMeData, apiUsersMe } from '@/service/utils'

const userInfo = ref<IUsersMeData>()

const sendGetUserInfo = async () => {
  try {
    const res = await apiUsersMe()

    if (res.code !== '2000') {
      throw new Error(res.msg)
    }
    userInfo.value = res.data
  } catch (e: any) {
    alert(e.message)
  }
}
</script>

<style lang="scss"></style>
