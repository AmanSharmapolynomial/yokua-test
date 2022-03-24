import { create } from 'axios'
import { getToken, removeToken } from './token'
import { toast } from 'react-toastify'
const API = create({ baseURL: 'https://yokogawa-flow-center.herokuapp.com/' })

API.interceptors.request.use(
  config => {
    const token = getToken()

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

  console.log(e.response)

  if (e.response.status === 401) {
    // alert('Please login again')
    removeToken()
    window.location.href = '/auth/login'
  }

  if (Array.isArray(e.response.data?.message)) {
    toast.error(e.response.data?.message[0])
  } else if (e.response.data?.message[0]) {
    toast.error(e.response.data?.message)
  }
  toast.error(e.response.data?.email[0])
  toast.error(e.response.data?.new_password2[0])
  toast.error(e.response.data?.new_password2[1])

  if (e.response.status == 400) {
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
