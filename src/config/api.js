import { create } from 'axios'

const API = create({ baseURL: 'https://yokogawa-flow-center.herokuapp.com/' })

API.interceptors.response.use(null, e => {
  if (!window.navigator.onLine) {
    toast.warning('You are offline, please check your internet connection and refresh the page', {
      onClick: () => window.location.reload(),
      toastId: 'error-no-internet',
    })
    return null
  }
  if (e.response.status === 403) {
    if (e.response?.data?.data?.error?.code === 'auth/id-token-expired') {
      return auth.currentUser.getIdToken(true).then(token => {
        API.defaults.headers.common.authtoken = token
        e.config.headers.authtoken = token
        return API.request(e.config)
      })
    }
  } else if ((e.response.status > 400 && e.response.status !== 403) || e.code === 'ECONNABORTED') {
    throw new Error(e)
  }
  return e
})

export default API
