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
module.exports.postCENReportReq = _hasParams('body')('report', 'cenKeys')
module.exports.postCENReport = (req, _, next) => {
  // expect postCENReportReq middleware is used before this one
  const { report, cenKeys } = req.body

  let reportId
  try {
    reportId = computeHash(report)
    // populate req._cen
    req._cen = {
      report,
      cenKeys: Array.isArray(cenKeys) ? cenKeys : cenKeys.split(',').filter(k => k),
      reportId,
      reportTimestamp: Math.round(new Date() / 1000),
    }
  } catch(err) {
    return next(err)
  }

  if (!req._cen.cenKeys.length) {
    return next(new Error('Empty cenKeys'))
  }

  return next()
}
