// write export const to get ,set ,delete token from local storage
export const getToken = () => {
  return localStorage.getItem('token')
}
export const setToken = token => {
  return localStorage.setItem('token', token)
}
export const removeToken = () => {
  return localStorage.removeItem('token')
}
export const getRefreshToken = () => {
  return localStorage.getItem('refreshtoken')
}
