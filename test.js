const assert = require('assert')

const cen = require('.')


const keyStr = cen.makeCENKeyString()
assert.equal(keyStr.length, 32)

const payload = {
  report: Buffer.from('severe fever,coughing,hard to breathe').toString('base64'),
  cenKeys: [...new Array(2)].map(() => cen.makeCENKeyString()).join(','),
  reportTimeStamp: 1586297540,
}
// payload in Object form
const reportID = cen.computeHash(payload)
assert.equal(reportID.length, 64)
// behavior: payload in JSON string form should have consistent
// hash generated from Object payload input ^
assert.equal(cen.computeHash(JSON.stringify(payload)), reportID)
