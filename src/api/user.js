import request from '@/utils/request'

export function Login(data) {
  return request({
    url: '/api/v1/user/accounts/login',
    method: 'post',
    data
  })
}

export function GetYzm() {
  return request({
    url: '/api/v1/user/accounts/code',
    method: 'get',
    responseType: "blob",
  })
}

export function Uerlist() {
  return request({
    url: '/api/v1/console/user/account/',
    method: 'get',
  })
}
