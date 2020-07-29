import { http as request } from '../../boot/axios'

export function getCollectionList (params) {
  return request({
    url: '/collections',
    method: 'get',
    params
  })
}

export function updateCollection (id,updateCollectionDto) {
  return request({
    url: `/collections/${id}`,
    method: 'put',
    data:updateCollectionDto
  })
}

export function deleteCollection (id) {
  return request({
    url: `/collections/${id}`,
    method: 'delete'
  })
}
