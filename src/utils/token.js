// write export const to get ,set ,delete token from local storage
export const getToken = () => {
  return localStorage.getItem('token')
}
export const setToken = (token, refreshtoken) => {
  localStorage.setItem('refreshtoken', refreshtoken)
  return localStorage.setItem('token', token)
}
export const removeToken = () => {
  localStorage.removeItem('refreshtoken')
  return localStorage.removeItem('token')
}
export const getRefreshToken = () => {
  return localStorage.getItem('refreshtoken')
}
