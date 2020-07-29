import { http as request } from '../../boot/axios'

export function getGroupList (params) {
  return request({
    url: '/groups',
    method: 'get',
    params
  })
}

export function updateGroup (id,updateGroupDto) {
  return request({
    url: `/groups/${id}`,
    method: 'put',
    data:updateGroupDto
  })
}

export function deleteGroup (id) {
  return request({
    url: `/groups/${id}`,
    method: 'delete'
  })
}
