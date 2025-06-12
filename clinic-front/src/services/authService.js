import api from './api'

export const register = data =>
  api.post('/auth/register', data)

export const login = credentials =>
  api.post('/auth/login', credentials)

export function fetchMe() {
  return api.get('/users/me')
}
