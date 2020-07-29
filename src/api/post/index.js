import { http as request } from "../../boot/axios";

export function getPostList(params) {
  return request({
    url: "/posts",
    method: "get",
    params
  });
}

export function updatePost(id, updatePostDto) {
  return request({
    url: `/posts/${id}`,
    method: "put",
    data: updatePostDto
  });
}

export function deletePost(id) {
  return request({
    url: `/Posts/${id}`,
    method: "delete"
  });
}
