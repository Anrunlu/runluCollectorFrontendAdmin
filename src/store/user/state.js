import { getToken } from '../../utils/auth'

export default function () {
  return {
    token: getToken(),
    username: '',
    nickname: '',
    userlevel: -1,
    id: '',
  }
}
