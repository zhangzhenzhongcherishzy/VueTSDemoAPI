<!--
!举例说明
假设当前路由的 query 是：{ redirect: '/dashboard?user=admin&token=123' }
!解析过程：
1、query.redirect 是 '/dashboard?user=admin&token=123'
2、使用 URL 构造函数解析为：
  2-1、path：'/dashboard'
  2-2、查询参数：user=admin 和 token=123
3、返回结果：
  {
    path: '/dashboard',
    queryParams: {
      user: 'admin',
      token: '123'
    }
  }
-->
<template>
  <div id="wrap">
    <el-form id="RegisterBox" label-width="auto" :model="formData" style="max-width: 600px">
      <el-form-item class="el-form-wrap">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="formData.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loginHandler"> 登录 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LoginPage',
}
</script>
<script setup lang="ts">
import { reactive } from 'vue'
import { type IUserLoginInfo, apiLogin } from '@/service/utils'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQuery } from 'vue-router'

const router = useRouter()
const route = useRoute()

const formData: IUserLoginInfo = reactive({
  username: 'admin',
  password: '123456',
})

// 执行登录
const loginHandler = async () => {
  try {
    const resData = await apiLogin(formData)
    console.log(resData.data)
    if (resData.code !== '2000' || !resData.data) {
      throw new Error(resData.msg || '未知错误')
    }
    // 登录成功
    localStorage.setItem('token', resData.data)
    setTimeout(() => {
      const { path, queryParams } = parseRedirect()
      router.push({ path: path, query: queryParams })
    }, 12)
  } catch (e: unknown) {
    if (e instanceof Error) {
      alert(e.message)
    } else {
      alert('未知错误') // 对于非 Error 类型的处理
    }
  }
}

/*解析 redirect字符串为path和queryParams */
function parseRedirect(): {
  path: string
  queryParams: Record<string, string>
} {
  //从 vue-router 提供的 route.query 中提取查询参数
  const query: LocationQuery = route.query
  console.log(query)

  //尝试从 query 中获取名为 redirect 的参数值   如果 redirect 不存在或是 null/undefined，则使用 '/' 作为默认值
  const redirect = (query.redirect as string) ?? '/'
  console.log(redirect)

  //创建一个 URL 对象，用于解析 redirect    1、redirect：是目标路径或 URL   2、window.location.origin：是当前网页的域名部分
  const url = new URL(redirect, window.location.origin)
  console.log(url)

  //作用：从 URL 对象中获取路径部分（例如 /dashboard）
  const path = url.pathname
  console.log(path)

  //创建一个空对象，用于存储 URL 中的查询参
  const queryParams: Record<string, string> = {}
  console.log(queryParams)

  //遍历 URL 对象的查询参数（searchParams）。将每个参数的键值对存储到 queryParams 对象中。
  console.log(url.searchParams)

  url.searchParams.forEach((value, key) => {
    queryParams[key] = value
  })

  return { path, queryParams }
}
</script>

<style lang="scss" scoped>
#wrap {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  .el-form {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30rem;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(15px);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    .el-form-item {
      width: 100%;
      height: 3rem;
      margin: 2rem 0;
      .el-input {
        height: 100%;
        margin: auto;
      }
      .el-input::before{
        font-size: 1.2rem;
        line-height: 3rem;
        font-weight: bold;
        color: #409eff;
      }
      .el-input:nth-child(1)::before{
        content: '账号：';
      }
      .el-input:nth-child(2)::before{
        content: '密码：';
      }
      .el-button {
        font-size: 1.2rem;
        margin: auto;
        width: 50%;
        height: 100%;
      }
    }
  }
}
#wrap::before {
  z-index: -1;
  top: 0;
  left: 0;
  content: '';
  display: block;
  width: 100%;
  min-height: 100vh;
  filter: blur(9px);
  background: url('@/assets/images/6.png') center center/cover no-repeat;
  position: fixed;
}
</style>
