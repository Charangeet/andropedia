const crypto = require('crypto')

const SECRET = process.env.SESSION_SECRET || 'dev-insecure-secret-change-me'
const MAX_AGE_MS = 24 * 60 * 60 * 1000

function sign(value) {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex')
}

function createToken() {
  const expiresAt = String(Date.now() + MAX_AGE_MS)
  return `${expiresAt}.${sign(expiresAt)}`
}

function verifyToken(token) {
  if (!token) return false
  const [expiresAt, signature] = token.split('.')
  if (!expiresAt || !signature) return false
  if (sign(expiresAt) !== signature) return false
  return Number(expiresAt) > Date.now()
}

module.exports = { createToken, verifyToken, MAX_AGE_MS }
