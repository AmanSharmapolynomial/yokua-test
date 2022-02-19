import { action, thunk, useStoreState } from 'easy-peasy'
import axios from 'axios'

const model = {
  userDetails: [],
  registeredUser: [],
  // thunks
  fetchLogin: thunk(async (actions, payload) => {
    try {
      const data = await axios.post(
        'https://yokogawa-flow-center.herokuapp.com/auth/login/',
        payload
      )
      actions.loginUser(data)
    } catch (error) {
      actions.loginUser({ error })
    }
  }),

  fetchRegister: thunk(async (actions, payload, config) => {
    try {
      const data = await axios.post(
        'https://yokogawa-flow-center.herokuapp.com/auth/registration/',
        payload,
        config
      )
      actions.registerUser(data)
    } catch (error) {
      actions.registerUser({ error })
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
}

export default model
