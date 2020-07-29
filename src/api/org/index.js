import { http as request } from '../../boot/axios'

export function getOrgList (params) {
  return request({
    url: '/orgs',
    method: 'get',
    params
  })
}

export function createOrg (data) {
  return request({
    url: '/orgs',
    method: 'post',
    data
  })
}

export function updateOrg (id,updateOrgDto) {
  return request({
    url: `/orgs/${id}`,
    method: 'put',
    data:updateOrgDto
  })
}

export function deleteOrg (id) {
  return request({
    url: `/orgs/${id}`,
    method: 'delete'
  })
}
