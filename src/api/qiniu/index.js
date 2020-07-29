import { http as request } from "../../boot/axios";

export function deleteSgFile(filekey) {
  return request({
    url: "/qiniu/deleteSingleFile",
    method: "delete",
    params: { filekey }
  });
}
