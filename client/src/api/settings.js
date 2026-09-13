import client from './client'

export const getWeights = () => client.get('/settings/weights').then((r) => r.data)
export const updateWeights = (data) => client.put('/settings/weights', data).then((r) => r.data)
