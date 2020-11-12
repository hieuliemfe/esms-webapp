import request from '@/utils/request'
export function getWarningList(query) {
  return request({
    url: '/employees',
    method: 'get',
    params: query
  })
}
export function getHistory(query) {
  return request({
    url: '/sessions',
    method: 'get',
    params: query
  })
}
