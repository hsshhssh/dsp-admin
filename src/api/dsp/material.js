import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/material/list',
    method: 'POST',
    data: query,
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}
