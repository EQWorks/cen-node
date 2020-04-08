const assert = require('assert')

const { utils } = require('.')


const keyStr = utils.makeCENKeyString()
assert.equal(keyStr.length, 32)

const reportRaw = 'severe fever,coughing,hard to breathe,头疼'
const cenKeysArr = [...new Array(2)].map(() => utils.makeCENKeyString())
const payload = {
  report: utils.encodeReport(reportRaw),
  cenKeys: cenKeysArr.join(','),
  reportTimeStamp: 1586297540,
}
assert.equal(utils.decodeReport(payload.report), reportRaw)
// payload in Object form
const reportID = utils.computeHash(payload)
assert.equal(reportID.length, 64)
// behavior: payload in JSON string form should have consistent
// hash generated from Object payload input ^
assert.equal(utils.computeHash(JSON.stringify(payload)), reportID)

const unfolded = utils.unfoldReport(payload)
assert.equal(unfolded.report, reportRaw)
assert.deepEqual(unfolded.cenKeys, cenKeysArr)
