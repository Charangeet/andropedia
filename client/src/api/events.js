import client from './client'

export const listEvents = (params) => client.get('/events', { params }).then((r) => r.data)
export const createEvent = (data) => client.post('/events', data).then((r) => r.data)
export const getEventByToken = (token) => client.get(`/events/checkin/${token}`).then((r) => r.data)
export const checkinToEvent = (token, memberId) =>
  client.post(`/events/checkin/${token}`, { memberId }).then((r) => r.data)
