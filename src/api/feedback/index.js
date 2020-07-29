import { http as request } from "../../boot/axios";

export function getFeedbackList() {
  return request({
    url: "/feedbacks",
    method: "get",
  });
}

export function getFeedbackDetail(id) {
  return request({
    url: `/feedbacks/${id}`,
    method: "get",
  });
}

export function updateFeedback(id, updateFeedbackDto) {
  return request({
    url: `/feedbacks/${id}`,
    method: "put",
    data: updateFeedbackDto
  });
}

export function deleteFeedback(id) {
  return request({
    url: `/feedbacks/${id}`,
    method: "delete"
  });
}
