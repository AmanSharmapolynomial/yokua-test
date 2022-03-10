import { toast } from 'react-toastify'
import API from '../utils/api'
import catchAsync from '../utils/catchAsync'
import { setToken, getRefreshToken, getToken, setUserRole } from '../utils/token'

// auth/login/
export const login = catchAsync(async payload => {
  const {
    data: { user, access_token },
  } = await API.post('auth/login/', payload)
  setToken(access_token)
  setUserRole(user.role)
  console.log({ user, access_token })
  return user
})

// auth/register/
export const registerUser = catchAsync(async payload => {
  const data = await API.post(`/auth/registration/`, payload)
  console.log(data)
  if (data.status == 200) {
    toast.success(data.data.message)
  } else {
    console.log(data.data.email[0])
    toast.error(data.data.email[0])
  }
  return data
})
