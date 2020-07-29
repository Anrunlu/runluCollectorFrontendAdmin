import { http as request } from '../../boot/axios'

export function findUsers (filters) {
  return request({
    url: '/users',
    method: 'get',
    params:filters
  })
}

export function updateUser (id,updateUserDto) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data:updateUserDto
  })
}

export function createManyUser (createManyUserDto) {
  return request({
    url: `/users/createMany`,
    method: 'post',
    data:createManyUserDto
  })
}

export function deleteUser (id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}
