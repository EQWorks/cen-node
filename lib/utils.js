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

// util for report encode/decode between base64 and UTF8 string
module.exports.decodeReport = (aes) => Buffer.from(aes, 'base64').toString('utf8')
module.exports.encodeReport = (raw) => Buffer.from(raw).toString('base64')

module.exports.makeStringArray = (input) => {
  // to array
  return (Array.isArray(input) ? input : (input || '').split(','))
    // string + trimmed or false
    .map(k => typeof k === 'string' && k.trim())
    // remove false items
    .filter(k => k)
}

// unfold report to be more digestable
module.exports.unfoldReport = (payload) => {
  // shallow copy, assuming payload is flat JSON (no nested struct)
  const data = { ...payload }
  data.report = this.decodeReport(data.report)
  data.cenKeys = this.makeStringArray(data.cenKeys)
  return data
}
