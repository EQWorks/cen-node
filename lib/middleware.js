const { computeHash } = require('./utils')


const _hasParams = target => (...params) => (req, _, next) => {
  for (const param of params) {
    if (!req[target][param]) {
      return next(new Error(`Missing '${param}' in ${target}`))
    }
  }
  return next()
}

// ref: https://github.com/Co-Epi/cen-server/blob/58a50fa/server/server.go#L117
// for POST /cenreport
// expect body-parser for JSON is registered
module.exports.postCENReportReq = _hasParams('body')('report', 'reportMimeType')
module.exports.postCENReport = (req, _, next) => {
  // expect postCENReportReq middleware is used before this one
  const report = { ...req.body }
  // TODO: verify if POST allows reportID field
  // for now, override it as in reference CEN-server
  let reportID
  try {
    delete report.reportID
    reportID = computeHash(report)
  } catch(err) {
    return next(err)
  }
  // TODO: verify if POST mandates reportTimeStamp
  // for now, generate one (UNIX epoch in seconds) if client doesn't supply one
  report.reportTimeStamp = report.reportTimeStamp || Math.round(new Date() / 1000)
  // populate req._cen with report Object and reportID
  req._cen = { report, reportID }

  return next()
}
