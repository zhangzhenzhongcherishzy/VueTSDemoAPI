<template>
  <div id="wrap">
    <h1>用户管理</h1>
    <el-table :data="userInfo" style="width: 100%" width="100%">
      <el-table-column fixed prop="id" label="用户ID" width="100" />
      <el-table-column prop="roleNames" label="权限登记" width="150" />
      <el-table-column prop="nickname" label="用户昵称" width="150" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="gender" label="用户性别" width="150" :formatter="genderFormatter" />
      <el-table-column prop="mobile" label="用户手机号" width="150" />
      <el-table-column prop="status" label="用户状态" width="100" :formatter="statusFormatter" />
      <el-table-column prop="createTime" label="创建时间" width="250" />
      <el-table-column prop="deptName" label="所属部门" width="100" />
      <el-table-column fixed="right" label="操作" width="150">
        <el-button link type="primary" size="small">删除</el-button>
        <el-button link type="primary" size="small">修改</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
export default {
  name: 'UserPage',
}
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { type IUsersMeData, getusers } from '@/service/utils'

const userInfo = ref<IUsersMeData[]>([])

const sendGetUserInfo = async () => {
  try {
    const res = await getusers()
    if (res.code !== '2000') {
      throw new Error(res.msg)
    }
    console.log(res.data.list)
    userInfo.value = res.data.list
  } catch (e: unknown) {
    if (e instanceof Error) {
      alert(e.message)
    } else {
      alert('未知错误') //对于非Error类型的处理
    }
  }
}
//用来转化用户性别的方法
const genderFormatter = (row: IUsersMeData, column: unknown, cellValue: string) => {
  if (cellValue === '1') return '男'
  if (cellValue === '2') return '女'
  if (cellValue === '0') return '保密'
  return '未知'
}

// 转化用户状态的方法
const statusFormatter = (row: IUsersMeData, column: unknown, cellValue: number) => {
  if (cellValue === 1) return '正常'
  if (cellValue === 0) return '停用'
  return '未知'
}

//在组件挂载后立刻请求更新数据
onMounted(() => {
  sendGetUserInfo()
})
</script>

<style lang="scss" scoped>
.el-table-column {
  text-align: center;
}
</style>
