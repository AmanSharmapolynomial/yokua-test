import API from '../utils/api'
import catchAsync from '../utils/catchAsync'

export const fetchUserList = catchAsync(async payload => {
  const { data } = await API.get('admin/list_users/', payload)
})
