import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getProfile() {
  return request({
    url: '/profile',
    method: 'get'
  })
}

// export function register(data) {
//   return request({
//     url: '/register',
//     method: 'post',
//     data
//   })
// }
