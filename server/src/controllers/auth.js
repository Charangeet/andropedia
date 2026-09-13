const { createToken, MAX_AGE_MS } = require('../lib/session')
const { isAuthenticated, COOKIE_NAME } = require('../middleware/requireAuth')

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: MAX_AGE_MS,
    path: '/',
  }
}

async function login(req, res) {
  const { password } = req.body
  if (!password || password !== process.env.COORDINATOR_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' })
  }
  res.cookie(COOKIE_NAME, createToken(), cookieOptions())
  res.json({ authenticated: true })
}

async function logout(_req, res) {
  res.clearCookie(COOKIE_NAME, { path: '/' })
  res.json({ authenticated: false })
}

async function session(req, res) {
  res.json({ authenticated: isAuthenticated(req) })
}

module.exports = { login, logout, session }
