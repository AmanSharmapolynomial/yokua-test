import API from '../utils/api'
import catchAsync from '../utils/catchAsync'
import { setToken, getRefreshToken, getToken } from '../utils/token'
// auth/login/
export const login = catchAsync(async payload => {
  const {
    data: { user, access_token, refresh_token },
  } = await API.post('auth/login/', payload)
  setToken(access_token, refresh_token)
  console.log({ user, access_token, refresh_token })
  API.defaults.headers.common.Authorization = `Bearer ${token}`
  return user
})

// auth/register/
export const registerUser = catchAsync(async payload => {
  const data = await API.post(`/auth/registration/`, payload)
  return data
})
