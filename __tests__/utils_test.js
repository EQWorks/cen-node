const { utils } = require('../index.js')


describe('utils', () => {
  test('utils.makeCENKeyString()', () => {
    const keyStr = utils.makeCENKeyString()
    expect(keyStr.length).toBe(32)
  })

  const reportRaw = 'severe fever,coughing,hard to breathe,头疼'
  const cenKeysArr = [...new Array(2)].map(() => utils.makeCENKeyString())

  test('utils.encodeReport()', () => {
    expect(utils.encodeReport(reportRaw)).not.toBe(reportRaw)
  })

  test('utils.decodeReport()', () => {
    const report = utils.encodeReport(reportRaw)
    expect(utils.decodeReport(report)).toBe(reportRaw)
  })

  test('utils.computeHash', () => {
    const report = utils.encodeReport(reportRaw)
    expect(utils.computeHash(report).length).toBe(64)
  })

  test('utils.unfoldReport', () => {
    const payload = {
      report: utils.encodeReport(reportRaw),
      cenKeys: cenKeysArr.join(','),
      reportTimeStamp: 1586297540,
    }
    const unfolded = utils.unfoldReport(payload)
    expect(unfolded.report).toBe(reportRaw)
    expect(unfolded.cenKeys).toEqual(cenKeysArr)
  })
})
