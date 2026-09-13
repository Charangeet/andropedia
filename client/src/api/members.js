import client from './client'

export const listMembers = (params) => client.get('/members', { params }).then((r) => r.data)
export const getMember = (id) => client.get(`/members/${id}`).then((r) => r.data)
export const createMember = (data) => client.post('/members', data).then((r) => r.data)
export const getMemberScore = (id, params) =>
  client.get(`/members/${id}/score`, { params }).then((r) => r.data)
export const getInactiveMembers = (params) =>
  client.get('/members/inactive', { params }).then((r) => r.data)
export const getLeaderboard = (params) =>
  client.get('/members/leaderboard', { params }).then((r) => r.data)
