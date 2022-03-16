import API from '../utils/api'
import catchAsync from '../utils/catchAsync'
import { setToken, getRefreshToken, getToken } from '../utils/token'
// auth/login/
export const fetchUserList = catchAsync(async payload => {
  const { data } = await API.get('admin/list_users/', payload)
  console.log(data)
  //   return data
})
