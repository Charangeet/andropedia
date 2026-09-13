import client from './client'

export const listRsvps = (params) => client.get('/rsvps', { params }).then((r) => r.data)
export const submitRsvp = (data) => client.post('/rsvps', data).then((r) => r.data)
