import client from './client'

export const listContributions = (params) =>
  client.get('/contributions', { params }).then((r) => r.data)
export const createContribution = (data) => client.post('/contributions', data).then((r) => r.data)
