import { create } from 'axios'
import {
  getToken,
  removeToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  removeUserEmail,
  removeUserRole,
} from './token'
import { toast } from 'react-toastify'
const API = create({ baseURL: 'https://yokogawa-flow-center.herokuapp.com/' })

let refreshFlag = 0

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

API.interceptors.response.use(null, async e => {
  if (e.response.status === 401 && e.config.url !== '/auth/login' && refreshFlag === 0) {
    try {
      console.log('Inside TRY')
      refreshFlag = 1
      const rs = await API.post('/auth/token/refresh/', {
        refresh: getRefreshToken(),
      })
      const { access, refresh } = rs.data
      toast.success('Refreshing Website')
      setToken(access)
      setRefreshToken(refresh)
      window.location.reload()
    } catch (error) {
      toast.error('Session Expired, Login Again')
      console.log('Inside CATCH')
      removeToken()
      removeUserEmail()
      removeUserRole()
      window.location.href = '/auth/login'
    }
  }

  if (Array.isArray(e.response.data?.message) && e.response.status !== 401) {
    toast.error(e.response.data?.message[0])
  } else if (e.response.data?.message && e.response.data?.message[0] && e.response.status !== 401) {
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
      toast.error(password2)
    })
  }
  return e
})

export default API
