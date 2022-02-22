import { create } from 'axios'
// import { auth } from './firebase'

const API = create({ baseURL: 'https://yokogawa-flow-center.herokuapp.com/' })
// const API = create({ baseURL: 'https://birdfinv1.herokuapp.com/' })

API.interceptors.response.use(null, e => {
  if (!window.navigator.onLine) {
    toast.warning(
      "Looks like you're offline, please check your internet connection. Click on me to try refreshing the page",
      {
        onClick: () => window.location.reload(),
        toastId: 'error-no-internet',
      }
    )
    // window.location.href = '/offline.html'
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
