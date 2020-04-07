const crypto = require('crypto')


// ref: https://github.com/Co-Epi/cen-server/blob/58a50fa/backend/backend.go#L163
module.exports.makeCENKeyString = (len = 32) => crypto.randomBytes(len / 2).toString('hex')

// ref: https://github.com/Co-Epi/cen-server/blob/58a50fa/backend/backend.go#L152
const _hash = (algorithm = 'sha256') => (payload) => {
  const hash = crypto.createHash(algorithm)
  hash.update(typeof payload === 'string' ? payload : JSON.stringify(payload))
  return hash.digest('hex')
}
module.exports.computeHash = _hash()
