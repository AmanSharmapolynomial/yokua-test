import { create } from 'axios'
import { getToken, removeToken } from './token'
import { toast } from 'react-toastify'
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
  // if ((e.response.status > 400 && e.response.status !== 401) || e.code === 'ECONNABORTED') {
  //   throw new Error(e)
  // }

  if (e.response.status === 401) {
    // alert('Please login again')
    removeToken()
    window.location.href = '/auth/login'
  }
  console.log(e.response)
  if (e.response.status === 400) {
    e.response.data.message?.forEach(message => {
      toast.error(message)
    })
    e.response.data.email?.forEach(email => {
      toast.error(email)
    })
    e.response.data.password1?.forEach(password1 => {
      toast.error(password1)
    })
    e.response.data.password2?.forEach(password2 => {
      toast.error(email)
    })
  }
  // window.location.href = '/offline.html'
  return e
})

export default API
