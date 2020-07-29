import { login, getInfo } from '../../api/auth'
import { setToken, removeToken } from '../../utils/auth'

export function userLogin ({ commit }, userInfo) {
  const { email, password } = userInfo
  return new Promise((resolve, reject) => {
    login({ email: email.trim(), password: password }).then(response => {
      const { data } = response
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

export function getUserInfo ({ commit }, state) {
  return new Promise((resolve, reject) => {
    getInfo().then(response => {
      const { data } = response
      commit('SET_ID', data.id)
      commit('SET_USERNAME', data.username)
      commit('SET_NICKNAME', data.nickname)
      commit('SET_USERLEVEL', data.userlevel)
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

export function userLogout ({ commit }, state) {
  return new Promise((resolve, reject) => {
    removeToken()
    commit('RESET_STATE')
    resolve()
  })
}
