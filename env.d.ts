/// <reference types="vite/client" />
/*-------------新增以vue文件结尾的文件声明文件配置start------------*/
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >
  export default component
}
/*-------------新增以vue文件结尾的文件声明文件配置end------------*/
