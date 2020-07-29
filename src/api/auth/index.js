import { http as request } from '../../boot/axios'

export function login (userLoginDto) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: userLoginDto
  })
}

export function getInfo () {
  return request({
    url: '/auth/admin',
    method: 'get'
  })
}

export function changePwd (chgPasswordDto) {
  return request({
    url: '/auth/chgPassword',
    method: 'put',
    data: chgPasswordDto
  })
}
