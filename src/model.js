import { action, thunk } from 'easy-peasy'
import axios from 'axios'

const model = {
  userDetails: [],
  // thunks
  fetchLogin: thunk(async (actions, payload) => {
    const data = await axios.post(
      'https://yokogawa-flow-center.herokuapp.com/auth/register/',
      payload
    )
    actions.registerUser(data)
  }),

  fetchRegister: thunk(async (actions, payload) => {
    const data = await axios.post('https://yokogawa-flow-center.herokuapp.com/auth/login/', payload)
    actions.loginUser(data)
  }),

  // actions
  loginUser: action((state, data) => {
    state.userDetails.push(data)
  }),
  registerUser: action((state, data) => {
    state.userDetails.push(data)
  }),
}

export default model
