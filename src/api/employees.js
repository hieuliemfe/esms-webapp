import request from '@/utils/request'
export function getWarningList(query) {
  return request({
    url: '/employees',
    method: 'get',
    params: query
  })
}
export function getSessionHistory(query) {
  return request({
    url: '/sessions',
    method: 'get',
    params: query
  })
}
export function getGCSUrl(query) {
  return request({
    url: '/videos',
    method: 'get',
    params: query
  })
}
export function suspendEmployee(code, body) {
  return request({
    url: `/employees/${code}/suspend`,
    method: 'post',
    data: body
  })
}
