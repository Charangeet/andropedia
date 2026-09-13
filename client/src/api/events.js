import client from './client'

export const listEvents = (params) => client.get('/events', { params }).then((r) => r.data)
export const createEvent = (data) => client.post('/events', data).then((r) => r.data)
