import { Login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password, code } = userInfo
    return new Promise((resolve, reject) => {
      // 发送给接口的数据
      Login({ account: username, password: password, verifyCode: code }).then(response => {        
        const token = response.data.data
        // token放入vuex里 , 方便获取
        commit("SET_TOKEN", token);
        // token写入到cookie中 以便我们每次请求都可以带上这个 cookie , 并且能够解析出当前登录的用户
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit }) {
    const data = {
      name: "admin",
      avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
    };
    commit("SET_NAME", data.name);
    commit("SET_AVATAR", data.avatar);
  },

  logout() {
    removeToken();
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
