import { action, thunk, useStoreState } from 'easy-peasy'
import API from './utils/api'

const model = {
  // states
  user: null,
  // actions
  setUser: action((state, payload) => {
    console.log(payload, 'payload')
    state.user = payload
  }),
}

export default model
