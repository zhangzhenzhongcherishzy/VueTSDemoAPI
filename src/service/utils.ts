//!导入所需模块
import axios, {
  type InternalAxiosRequestConfig, //内部请求配置类型（axios 提供）
  type AxiosError, //定义 axios 请求错误类型
  type AxiosRequestConfig, //axios 请求配置的标准类型
} from 'axios'
//!扩展配置项: 为 AxiosRequestConfig 增加 donNotShowLoading 字段，用于控制是否显示加载提示。
interface AxiosRequestConfigEx extends AxiosRequestConfig {
  donNotShowLoading?: boolean
}
//!ResType: 通用返回格式，包含 code（状态码）、data（数据体）和 msg（消息）
export type ResType<T = unknown> = {
  code: string
  data: T
  msg: string
}
//!PageDataType: 用于分页数据类型，例如：列表、分页信息
export type PageDataType<T> = {
  list: T[]
  pageNum: number
  pageSize: number
  total: number
}
//!RolesType: 定义角色实体字段，例如 id、name、status 等
export type RolesType = {
  code: string
  createTime?: string
  id?: number
  name: string
  sort: number
  status: number
}
//!创建 Axios 实例
const instance = axios.create({
  //baseURL: 基础 URL，使用本地localhost。
  baseURL: 'http://localhost:8989',
  //请求超时时间，单位毫秒
  timeout: 2000,
})

//!http request 请求拦截器----request.use: 请求前的拦截逻辑
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //设置请求头
    config.headers.set('Content-Type', 'application/json')

    // 从localStore 里获取 token 设置到header头
    const token = localStorage.getItem('token')
    config.headers.set('Authorization', token)

    return config
  },
  (error: AxiosError) => {
    //如果请求配置发生错误，将错误抛出
    Promise.reject(error)
  },
)
//!http response 响应拦截器----response.use: 响应后的拦截逻辑
instance.interceptors.response.use(
  (response) => {
    // 响应成功时做一些处理
    return response
  },
  (error) => {
    // 统一处理错误信息
    if (error.response.status === 401) {
      // 如果是 401 错误，可能是未授权，跳转到登录页面
      window.location.href = '/LoginView'
    } else if (error.response.status === 500) {
      // 服务器错误
      console.error('服务器错误')
    }
    return Promise.reject(error)
  },
)

//!axios实例请求封装
export const service = <T = unknown>(config: AxiosRequestConfigEx): Promise<ResType<T>> => {
  return instance
    .request<ResType<T>>(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error(error)
      throw error
    })
}

//!get角色分页列表
interface GetRolesPageParams {
  pageNum: number
  pageSize: number
}
export const requestGetRolesPage = (params: GetRolesPageParams) => {
  return service<PageDataType<RolesType>>({
    method: 'get', // 指定请求方法
    url: '/roles/page', // 请求的 URL
    params, // 查询参数,
  })
}

//!post添加角色
export const addRole = (data: Omit<RolesType, 'id' | 'createTime'>) => {
  return service({
    method: 'post',
    url: '/roles',
    data,
  })
}

//!put修改角色的数据
export const editRole = (roleId: string, data: Partial<RolesType>) => {
  return service({
    method: 'put',
    url: `/roles/${roleId}`,
    data,
  })
}

//!patch修改角色的状态
export const editRoleStaus = (roleId: string, status: number) => {
  return service({
    method: 'patch',
    url: `/roles/${roleId}/status`,
    params: { status },
  })
}

//!delete删除角色
export const delRole = (ids: string) => {
  return instance
    .request({
      method: 'delete',
      url: `/roles/${ids}`,
    })
}

//!post账号验证登录
//用户密码用户名接口
export interface IUserLoginInfo {
  password: string
  username: string
}
export const apiLogin = (data: IUserLoginInfo) => {
  return service<string>({
    method: 'post',
    url: '/auth/login',
    data,
  })
}

//!注册用户账号接口
export interface IUsersMeData {
  //头像
  avatar: string
  create_by: number
  dept_id: number
  //邮箱
  email: string
  //性别
  gender: number
  id: number
  is_deleted: number
  //手机号
  mobile: string
  //昵称
  nickname: string
  //密码
  password: string
  //状态
  status: number
  update_by: number
  //用户名
  username: string
}

//!get获取登录权限
export const apiUsersMe = () => {
  return service<IUsersMeData>({
    method: 'get',
    url: '/users/me',
  })
}

//!get登录获取用户列表信息
export const getusers = () => {
  return service<IUsersMeData>({
    method: 'get',
    url: '/users/page?pageNum=1&pageSize=10',
  })
}
