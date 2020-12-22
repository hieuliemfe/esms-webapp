import request from '@/utils/request'
export function getCounters() {
  return request({
    url: '/counters/{id}',
    method: 'get'
  })
}
export function getEmployees() {
  return request({
    url: '/employees',
    method: 'get'
  })
}
export function addEmployee(body) {
  return request({
    url: '/register',
    method: 'post',
    data: body
  })
}
export function updateEmployee(body) {
  return request({
    url: '/employees',
    method: 'put',
    data: body
  })
}
export function deleteEmployee(employeeCode) {
  return request({
    url: `/employees/${employeeCode}`,
    method: 'delete'
  })
}
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
export function updateSuspendEmployee(code, body) {
  return request({
    url: `/employees/${code}/suspend`,
    method: 'put',
    data: body
  })
}
export function getConfigs() {
  return request({
    url: `/configs`,
    method: 'get'
  })
}
export function getReport(query) {
  return request({
    url: `/reports`,
    method: 'get',
    params: query
  })
}
export function exportReport(query) {
  return request({
    url: `/reports`,
    method: 'get',
    params: query
  })
}
export function getSessionMinDate() {
  return request({
    url: `/sessions/mindate`,
    method: 'get'
  })
}
export function emailAction(body) {
  return request({
    url: `/emails/action`,
    method: 'post',
    data: body
  })
}
export function addAppointment(query) {
  return request({
    url: `/employees/add-appointment`,
    method: 'put',
    params: query
  })
}
export function getShifts() {
  return request({
    url: `/shifts`,
    method: 'get'
  })
}
export function getCategories() {
  return request({
    url: `/categories`,
    method: 'get'
  })
}
export function getServices() {
  return request({
    url: `/services`,
    method: 'get'
  })
}
