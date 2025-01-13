<template>
  <div class="common-layout" :class="{ dark: isDark }">
    <el-container>
      <!-- 切换主题按钮 -->
      <el-header>
        <el-row class="row-bg" justify="space-between">
          <el-col :span="6">
            <el-button type="primary" @click="toggleDarkMode">切换暗黑模式</el-button>
          </el-col>
          <el-col :span="6">
            <el-button :icon="Search" circle />
            <el-button type="primary" :icon="Edit" circle />
            <el-button type="success" :icon="Check" circle />
            <el-button type="info" :icon="Message" circle />
            <el-button type="warning" :icon="Star" circle />
            <el-button type="danger" :icon="Delete" circle />
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <!-- 侧边菜单栏 -->
        <el-aside width="200px">
          <!-- 侧边滚动条 -->
          <el-scrollbar>
            <!-- 侧边菜单栏 -->
            <el-menu
              :default-openeds="['1']"
              class="el-menu-vertical-demo"
              default-active="2"
              router
            >
              <!-- 使用路由渲染模拟菜单栏 -->
              <template v-for="item in routerLists">
                <!-- 没有子路由的菜单栏显示情况 -->
                <template v-if="!item.children">
                  <el-menu-item :index="item.path" :key="item.name">
                    <el-icon><setting /></el-icon>
                    <!-- item!.meta?.title: 访问 item.meta 中的 title 属性，用于显示菜单项的标题。  如果 item.meta.title 不存在，则显示 item.name   使用 TypeScript 的非空断言运算符，确保 item 不为空 -->
                    <template #title>{{ item!.meta?.title || item.name }}</template>
                  </el-menu-item>
                </template>
                <!-- 有子菜单栏的显示情况 -->
                <template v-else>
                  <el-sub-menu :index="item.path" :key="item.name">
                    <template #title>
                      <el-icon><setting /></el-icon>
                      {{ item!.meta?.title || item.name }}
                    </template>
                    <el-menu-item
                      :index="`${item.path}/${sonItem.path}`"
                      v-for="sonItem in item.children"
                      :key="sonItem.name"
                    >
                      {{ sonItem!.meta?.title || sonItem.name }}
                    </el-menu-item>
                  </el-sub-menu>
                </template>
              </template>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <!-- 主题main部分和页脚部分 -->
        <el-container>
          <el-main>
            <el-scrollbar>
              <router-view>
                <template #default="{ Component, route }">
                  <transition
                    enter-active-class="animate__animated.animate__fadeInRight"
                    mode="out-in"
                  >
                    <component :is="Component" :key="route.path" />
                  </transition>
                </template>
              </router-view>
            </el-scrollbar>
          </el-main>
          <el-footer :class="{ 'el-footer-dark': isDark }">
            <div>@copy by 年后就暴富班 ©️2025</div>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SetPage',
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
//组合式函数库
import { useDark } from '@vueuse/core'
//侧边菜单栏
import { Setting } from '@element-plus/icons-vue'

// 导入动态内容组件
import { routerList } from '@/router/index'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routerLists = ref<any>(routerList[0].children)
console.log(routerLists)
// 使用路由做侧边导航栏
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// import { routerList } from '@/router/index'
// const routerLists = ref<any[]>(routerList)

//切换主题
const isDark = useDark() // 是否处于暗模式
const toggleDarkMode = () => {
  isDark.value = !isDark.value
}

// 引入路由对象
const router = useRouter()

// 在组件加载时进行跳转
onMounted(() => {
  router.push({ name: 'RolePage' }) // 默认跳转到角色管理页面
})
</script>

<style lang="scss" scoped>
.animate__animated.animate__fadeInRight {
  --animate-duration: 0.2s;
}
.common-layout {
  width: 100%;
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  padding: 0.25rem;
}
.el-menu-item {
  width: 100%;
}
.el-menu {
  height: calc(100vh - 60px);
}
.el-scrollbar {
  height: calc(100vh - 60px);
}
.el-main {
  padding: 10px;
  height: calc(100vh - 120px);
}
.el-footer {
  padding: 0 10px;
  display: grid;
  place-items: center;
}
.el-row {
  align-items: center;
  width: 100%;
  height: 100%;
}
.el-col {
  flex: none;
}
</style>
