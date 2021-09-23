import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/api/v1/console/role/',
    method: 'get'
  })
}

export function deleteRole(id) {
  return request({
    url: `/api/v1/console/role/${id}`,
    method: 'delete'
  })
}

export function addRole(data) {
  return request({
    url: '/api/v1/console/role/',
    method: 'post',
    data
  })
}