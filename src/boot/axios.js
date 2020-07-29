import axios from 'axios'
import { getToken } from 'src/utils/auth'
import { Notify } from 'quasar'

export const http = axios.create({
  baseURL: process.env.API,
  timeout: 50000
})

export default ({ app, router, store }) => {
  // response interceptor
  http.interceptors.response.use(
    res => {
      return res
    },
    err => {
      if (err.response.data.message) {
        if (err.response.status === 401) {
          Notify.create({
            message: '请先登录',
            color: 'red',
            icon: 'error',
            position: 'center'
          })
          router.push('/login')
        } else if (err.response.status === 500) {
          Notify.create({
            message: '服务器异常，请稍后再试',
            color: 'red',
            icon: 'error',
            position: 'center'
          })
        } else {
          Notify.create({
            message: err.response.data.message,
            type: 'negative',
            position: 'center'
          })
        }
      }
      return Promise.reject(err)
    }
  )

  // request interceptor
  http.interceptors.request.use(
    config => {
      // do something before request is sent

      if (store.getters['user/token']) {
        // let each request carry token
        config.headers.Authorization = 'Bearer ' + getToken() || ''
      }
      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )
}
