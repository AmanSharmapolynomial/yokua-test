import { create } from 'axios'
import { getToken, removeToken, getRefreshToken, setToken, setRefreshToken } from './token'
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
  if (e.response.status === 401 && refreshFlag === 0) {
    const originalConfig = e.config
    if (originalConfig.url !== '/auth/login' && e.response) {
      // Access Token was expired
      if (!originalConfig._retry) {
        refreshFlag = 1
        originalConfig._retry = true
        try {
          console.log('inside TRY')
          const rs = await API.post('/auth/token/refresh/', {
            refresh: getRefreshToken(),
          })
          refreshFlag = 0
          const { access: accessToken, refresh: refreshToken } = rs.data
          setToken(accessToken)
          setRefreshToken(refreshToken)
          //toast.success('Token refreshed successfully')
          window.location.reload()
          return instance(originalConfig)
        } catch (err) {
          if (originalConfig.url == '/auth/token/refresh/') {
            toast.error('Session Expired')
            removeToken()
            window.location.href = '/auth/login'
          }
          return Promise.reject(err)
        }
      }
    } else {
      removeToken()
      window.location.href = '/auth/login'
    }
    //return Promise.reject(err)
  }

  if (Array.isArray(e.response.data?.message) && e.response.status !== 401) {
    toast.error(e.response.data?.message[0])
  } else if (e.response.data?.message && e.response.data?.message[0] && e.response.status !== 401) {
    toast.error(e.response.data?.message)
  } else {
    toast.success('Refreshing the Website')
  }
  if (Array.isArray(e.response.data?.email)) toast.error(e.response.data?.email[0])
  if (Array.isArray(e.response.data?.new_password2)) toast.error(e.response.data?.new_password2[0])
  if (Array.isArray(e.response.data?.new_password2)) toast.error(e.response.data?.new_password2[1])

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
