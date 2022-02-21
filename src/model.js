import { action, thunk, useStoreState } from 'easy-peasy'
import axios from 'axios'

const url = 'https://yokogawa-flow-center.herokuapp.com'

const model = {
  // states
  userDetails: [],
  registeredUser: [],
  userList: [],

  // thunks
  fetchLogin: thunk(async (actions, payload) => {
    // auth/login/
    try {
      const data = await axios.post(`${url}/auth/login/`, payload)
      actions.loginUser(data)
    } catch (error) {
      actions.loginUser({ error })
    }
  }),

  fetchRegister: thunk(async (actions, payload, config) => {
    // auth/registration/
    try {
      const data = await axios.post(`${url}/auth/registration/`, payload, config)
      actions.registerUser(data)
    } catch (error) {
      actions.registerUser({ error })
    }
  }),

  fetchUserList: thunk(async (actions, { payload, config }) => {
    //  admin/list_users
    try {
      const data = await axios.get(
        `https://yokogawa-flow-center.herokuapp.com/admin/list_users/`,
        payload,
        config
      )
      actions.listUser(data)
    } catch (error) {
      actions.listUser({ error })
    }
  }),

  // actions
  loginUser: action((state, data) => {
    state.userDetails.push(data)
  }),
  registerUser: action((state, data) => {
    state.registeredUser.push(data)
  }),
  logoutUser: action(state => {
    state.userDetails = []
  }),
  listUser: action((state, data) => {
    state.userList.push(data)
  }),
}

export default model
