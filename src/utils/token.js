// write export const to get ,set ,delete token from local storage
export const getToken = () => {
  return localStorage.getItem('token')
}
export const getUserRoles = () => {
  return localStorage.getItem('userRole')
}
export const setToken = token => {
  return localStorage.setItem('token', token)
}

export const setUserRole = role => {
  return localStorage.setItem('userRole', role)
}
export const removeToken = () => {
  return localStorage.removeItem('token')
}
export const removeUserRole = role => {
  return localStorage.removeItem('userRole', role)
}
export const getRefreshToken = () => {
  return localStorage.getItem('refreshtoken')
}

export const setRefreshToken = refreshToken => {
  return localStorage.setItem('refreshtoken', refreshToken)
}

export const removeRefreshToken = () => {
  return localStorage.removeItem('refreshtoken')
}

export const setUserEmail = email => {
  return localStorage.setItem('userEmail', email)
}

export const getUserEmail = () => {
  return localStorage.getItem('userEmail')
}

export const removeUserEmail = () => {
  return localStorage.removeItem('userEmail')
}
