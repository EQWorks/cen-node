const { computeHash } = require('./utils')


const _hasParams = target => (...params) => (req, _, next) => {
  for (const param of params) {
    if (!req[target][param]) {
      return next(new Error(`Missing '${param}' in ${target}`))
    }
  }
  return next()
}

// for POST /cenreport
// expect body-parser for JSON is registered
const postReportReq = _hasParams('body')('report')
const postReport = (req, _, next) => {
  // expect postReportReq middleware is used before this one
  const { report, cenKeys } = req.body

  let reportId
  try {
    reportId = computeHash(report)
    const keys = Array.isArray(cenKeys) ? cenKeys : cenKeys.split(',').filter(k => k)
    // populate req._cen
    req._cen = {
      report,
      cenKeys: keys,
      reportId,
      reportTimestamp: Math.round(new Date() / 1000),
      ver: keys.length > 0 ? 'v3' : 'v4',
    }
  } catch(err) {
    return next(err)
  }

  return next()
}

module.exports = {
  postReportReq,
  postReport,
  postCENReportReq: postReportReq,
  postCENReport: postReport,
}