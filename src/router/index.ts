import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// 定义路由表
const routesday20250113: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: '主页' },
    children: [
      {
        path: '/SetPage',
        name: 'SetPage',
        component: () => import('@/views/SetPage.vue'),
        meta: { title: '系统管理' },
        children: [
          {
            path: 'UserPage',
            name: 'UserPage',
            component: () => import('@/views/NavigatorOne/UserPage.vue'),
            meta: { title: '用户管理' },
          },
          {
            path: 'RolePage',
            name: 'RolePage',
            component: () => import('@/views/NavigatorOne/RolePage.vue'),
            meta: { title: '角色管理' },
          },
        ],
      },
      {
        path: '/AboutPage',
        name: 'AboutPage',
        component: () => import('@/views/AboutPage.vue'),
        meta: { title: '关于我们' },
      },
    ],
  },
  {
    path: '/LoginPage',
    name: 'LoginPage',
    component: () => import('@/views/LoginPage.vue'),
    meta: { title: '登录管理' },
  },
]
//使用展开运算符管理路由表
export const routerList = [...routesday20250113]

//注册路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routerList,
})

// 配置全局守卫
router.beforeEach((to, from, next) => {
  const istrue = localStorage.getItem('token')
  if (istrue) {
    //已经登录
    if (to.path === '/LoginPage') {
      next()
    } else {
      next()
    }
  } else {
    //没有登录情况
    if (to.path === '/LoginPage') {
      next()
    } else {
      alert('未登录，请先登录账号')
      next('/LoginPage')
    }
  }
})
export default router
