import client from './client'

export const getSummary = (params) => client.get('/analytics/summary', { params }).then((r) => r.data)
export const getEngagementTrend = (params) =>
  client.get('/analytics/engagement-trend', { params }).then((r) => r.data)
export const getAttendanceByEvent = (params) =>
  client.get('/analytics/attendance-by-event', { params }).then((r) => r.data)
