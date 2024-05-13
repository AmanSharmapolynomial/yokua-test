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
// const API = create({ baseURL: 'https://yokogawa-flow-center.herokuapp.com/' })
const API = create({ baseURL: 'https://rota.eu/backend/' })

API.interceptors.request.use(
  config => {
    const token = getToken()
    console.log('Entered')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(config)
    return config
  },
  error => {
    console.log('Error entered')
    return Promise.reject(error)
  }
)
let isRefreshing = false // Flag to track if token refresh is in progress
let refreshSubscribers = [] // Array to hold pending requests while token is being refreshed

API.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config
    if (error.response.status === 401) {
      if (originalRequest.url === '/auth/token/refresh/') {
        removeToken()
        removeUserEmail()
        removeUserRole()
        window.location.href = '/auth/login'
        return Promise.reject(error)
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true
        if (!isRefreshing) {
          isRefreshing = true
          try {
            const rs = await API.post('/auth/token/refresh/', {
              refresh: getRefreshToken(),
            })
            const { access, refresh } = rs.data
            setToken(access)
            setRefreshToken(refresh)
            toast.success('Refreshing  Website') // Display success message once
            // Retry the original request after token refresh
            refreshSubscribers.forEach(cb => cb(access))
            refreshSubscribers = []
            return API(originalRequest)
          } catch (refreshError) {
            toast.error('Session Expired, Login Again')
            removeToken()
            removeUserEmail()
            removeUserRole()
            window.location.href = '/auth/login'
            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }
        } else {
          // If token refresh is already in progress, add the request to the array of pending requests
          return new Promise(resolve => {
            refreshSubscribers.push(access => {
              originalRequest.headers.Authorization = `Bearer ${access}`
              resolve(API(originalRequest))
            })
          })
        }
      }
    }

    // Handle other error responses
    if (error.response) {
      const responseData = error.response.data
      if (Array.isArray(responseData?.message)) {
        responseData.message.forEach(message => toast.error(message))
      } else if (responseData?.message) {
        toast.error(responseData.message)
      }
      if (responseData?.email) {
        toast.error(responseData.email[0])
      }
      if (responseData?.new_password2) {
        toast.error(responseData.new_password2[0])
        toast.error(responseData.new_password2[1])
      }
      if (error.response.status === 400) {
        const { data } = error.response
        if (Array.isArray(data?.message)) {
          data.message.forEach(message => toast.error(message))
        }
        if (Array.isArray(data?.email)) {
          data.email.forEach(email => toast.error(email))
        }
        if (Array.isArray(data?.password1)) {
          data.password1.forEach(password1 => toast.error(password1))
        }
        if (Array.isArray(data?.password2)) {
          data.password2.forEach(password2 => toast.error(password2))
        }
      }
    } else if (error.request) {
      // Handle request error
      console.error('Request error:', error.request)
    } else {
      // Handle other errors
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default API
