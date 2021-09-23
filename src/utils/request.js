import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  timeout: 2000 // 请求超时
})

// request interceptor  请求拦截
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 得到当前的token 并直接添加到请求头中， 以便后端得到当前登录的信息
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor  响应拦截
service.interceptors.response.use(
  response => {
    const res = response
    // console.log(res)
    // 后端接口成功的返回值 
    if (res.data.ret == 400) {
      Message({
        message: res.data.code || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message + ' 请求超时，服务器未响应',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
// 将 axios的实例导出
export default service
