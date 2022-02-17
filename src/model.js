import { action, thunk, useStoreState } from 'easy-peasy'
import axios from 'axios'

const model = {
  userDetails: [],
  // thunks
  fetchLogin: thunk(async (actions, payload) => {
    const data = await axios.post('https://yokogawa-flow-center.herokuapp.com/auth/login/', payload)
    actions.registerUser(data)
  }),

  fetchRegister: thunk(async (actions, payload, config) => {
    const data = await axios.post(
      'https://yokogawa-flow-center.herokuapp.com/auth/registration/',
      payload,
      config
    )
    actions.registerUser(data)
  }),

  // actions
  loginUser: action((state, data) => {
    state.userDetails.push(data)
  }),
  registerUser: action((state, data) => {
    state.userDetails.push(data)
  }),
  logoutUser: action(state => {
    state.userDetails = []
  }),
}

export default model
