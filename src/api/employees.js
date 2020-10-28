import request from '@/utils/request'

// export function bulkRegister(file) {
//   return request({
//     url: '/login',
//     method: 'post'
//   })
// }

export function getWarningList(query) {
  return request({
    url: '/employees',
    method: 'get',
    params: query
  })
}

