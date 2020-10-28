import request from '@/utils/request'

export function getSessionList(query) {
  return request({
    url: '/sessions',
    method: 'get',
    params: query
  })
}
export function getSession(id) {
  return request({
    url: '/sessions/${id}',
    method: 'get'
  })
}
