import request from '@/utils/request'
export function getWarningList(query) {
  return request({
    url: '/employees',
    method: 'get',
    params: query
  })
}
// export function getEmployeeById(empCode) {
//   return request({
//     url: '/employees/' + empCode,
//     method: 'get'
//   })
// }
