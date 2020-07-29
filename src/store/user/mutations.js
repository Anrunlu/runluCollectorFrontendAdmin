import { getToken } from '../../utils/auth'

function getDefaultState () {
  return {
    token: getToken(),
    username: '',
    nickname: '',
    userlevel: -1,
    id: '',
  }
}

export function RESET_STATE (state) {
  Object.assign(state, getDefaultState())
}

export function SET_TOKEN (state, token) {
  state.token = token
}

export function SET_ID (state, id) {
  state.id = id
}

export function SET_USERNAME (state, username) {
  state.username = username
}

export function SET_NICKNAME (state, nickname) {
  state.nickname = nickname
}

export function SET_USERLEVEL (state, userlevel) {
  state.userlevel = userlevel
}
