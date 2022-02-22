import { create } from 'axios'
import { getToken } from './token'

const API = create({ baseURL: 'https://yokogawa-flow-center.herokuapp.com/' })
const token = getToken()
if (token) {
  API.defaults.headers.common.Authorization = `Bearer ${token}`
}
// API.interceptors.response.use(null, e => {
//   //   if (!window.navigator.onLine) {
//   //     toast.warning(
//   //       "Looks like you're offline, please check your internet connection. Click on me to try refreshing the page",
//   //       {
//   //         onClick: () => window.location.reload(),
//   //         toastId: 'error-no-internet',
//   //       }
//   //     )
//   //     // window.location.href = '/offline.html'
//   //     return null
//   //   }

//   if ((e.response.status > 400 && e.response.status !== 401) || e.code === 'ECONNABORTED') {
//     throw new Error(e)
//   }
//   return e
// })

export default API
