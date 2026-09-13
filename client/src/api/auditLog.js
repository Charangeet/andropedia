import client from './client'

export const listAuditLog = (params) => client.get('/audit-log', { params }).then((r) => r.data)
