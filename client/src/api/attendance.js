import client from './client'

export const listAttendance = (params) => client.get('/attendance', { params }).then((r) => r.data)
export const logAttendance = (data) => client.post('/attendance', data).then((r) => r.data)
