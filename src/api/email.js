import request from '@/utils/request'

export function typeMail() {
  return request({
    url: '/emails/types',
    method: 'get'
  })
}

export function sendMail(data) {
  return request({
    url: '/emails/action',
    method: 'post',
    data
  })
}
