import request from '@/utils/request'

export function getRoles(params) {
  return request({
    url: '/api/v1/console/role/page',
    method: 'get',
    params
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

export function selectRole(id) {
  return request({
    url: `/api/v1/console/role/${id}`,
    method: 'get',
  })
}
  
export function updateRole(data) {
  return request({
    url: '/api/v1/console/role/',
    method: 'put',
    data
  })
}

export function getRolesMenu() {
  return request({
    url: '/api/v1/console/menu/',
    method: 'get',
  })
}