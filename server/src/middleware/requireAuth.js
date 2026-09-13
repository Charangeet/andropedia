const { verifyToken } = require('../lib/session')

const COOKIE_NAME = 'andropedia_session'

function parseCookies(header) {
  const out = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim())
  }
  return out
}

function isAuthenticated(req) {
  const cookies = parseCookies(req.headers.cookie)
  return verifyToken(cookies[COOKIE_NAME])
}

function getActor(req) {
  return isAuthenticated(req) ? 'coordinator' : 'public'
}

function requireAuth(req, res, next) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}

module.exports = { requireAuth, isAuthenticated, getActor, parseCookies, COOKIE_NAME }
