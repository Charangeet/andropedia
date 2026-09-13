import client from './client'

export const login = (password) => client.post('/auth/login', { password }).then((r) => r.data)
export const logout = () => client.post('/auth/logout').then((r) => r.data)
export const getSession = () => client.get('/auth/session').then((r) => r.data)
