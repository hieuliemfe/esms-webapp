import request from '@/utils/request'

export function getCriterias() {
  return request({
    url: '/managers/negative-criterias',
    method: 'get'
  })
}

export function addCriterias(data) {
  return request({
    url: '/managers/negative-criterias',
    method: 'post',
    data
  })
}
export function updateCriterias(id) {
  return request({
    url: '/managers/negative-criterias/' + id,
    method: 'put'
  })
}
export function deteleCriterias(id) {
  return request({
    url: '/managers/negative-criterias/' + id,
    method: 'delete'
  })
}
