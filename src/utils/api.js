import { create } from 'axios'
import { getToken } from './token'

const API = create({ baseURL: 'https://yokogawa-flow-center.herokuapp.com/' })

API.interceptors.request.use(
  config => {
    const token = getToken()
    // console.log(token)

    if (token) {
      // API.defaults.headers.common.Authorization =
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
API.interceptors.response.use(null, e => {
  //   if (!window.navigator.onLine) {
  //     toast.warning(
  //       "Looks like you're offline, please check your internet connection. Click on me to try refreshing the page",
  //       {
  //         onClick: () => window.location.reload(),
  //         toastId: 'error-no-internet',
  //       }
  //     )
  //     // window.location.href = '/offline.html'
  //     return null
  //   }

  // if ((e.response.status > 400 && e.response.status !== 401) || e.code === 'ECONNABORTED') {
  //   throw new Error(e)
  // }
  if (e.response.status === 401) {
    alert('Please login again')
    window.location.href = '/auth/login'
  }
  return e
})

export default API
