import API from '../utils/api'
import catchAsync from '../utils/catchAsync'
import { setToken, getRefreshToken, getToken } from '../utils/token'
// auth/login/
export const login = catchAsync(async payload => {
  const {
    data: { user, access_token },
  } = await API.post('auth/login/', payload)
  setToken(access_token)
  console.log({ user, access_token })
  return user
})

// auth/register/
export const registerUser = catchAsync(async payload => {
  const data = await API.post(`/auth/registration/`, payload)
  return data
})
