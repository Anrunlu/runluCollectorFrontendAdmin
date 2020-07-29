import { http as request } from "../../boot/axios";

export function getNoticeList(params) {
  return request({
    url: "/notices",
    method: "get",
    params
  });
}

export function getNoticeDetail(id) {
  return request({
    url: `/notices/${id}`,
    method: "get",
  });
}

export function createNotice(data) {
  return request({
    url: "/notices",
    method: "post",
    data
  });
}

export function updateNotice(id, updateNoticeDto) {
  return request({
    url: `/notices/${id}`,
    method: "put",
    data: updateNoticeDto
  });
}

export function deleteNotice(id) {
  return request({
    url: `/notices/${id}`,
    method: "delete"
  });
}
