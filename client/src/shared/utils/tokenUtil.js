export function getTokenFromLocalStorage() {
  return localStorage.getItem('token')
}

export function setTokenToLocalStorage(token) {
  localStorage.setItem('token', token)
}

export function removeTokenFromLocalStorage() {
  localStorage.removeItem('token')
}
