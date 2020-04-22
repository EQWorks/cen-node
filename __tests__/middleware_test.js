const supertest = require('supertest')
const express = require('express')

const { middleware } = require('../index.js')

describe('middleware', () => {
  const app = express()
  app.use(express.json())

  // send 500 for all errors
  // disabling eslint as Express error handler signature requires four params
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // TODO: revise error code
    return res.sendStatus(500)
  })

  describe('postReportReq', () => {
    // setup
    app.post('/postReportReq',
      middleware.postReportReq,
      (_, res) => {
        return res.sendStatus(200)
      },
    )

    test('with no body', () => {
      return supertest(app)
        .post('/postReportReq')
        .expect(500)
    })

    test('with body, no report', () => {
      return supertest(app)
        .post('/postReportReq')
        .send({})
        .expect(500)
    })

    test('with body, empty string report', () => {
      return supertest(app)
        .post('/postReportReq')
        .send({ report: '' })
        .expect(500)
    })

    test('with body and report', () => {
      return supertest(app)
        .post('/postReportReq')
        .send({ report: 'theMagicReport' })
        .expect(200)
    })
  })

  describe('postReport', () => {
    // setup
    let outerReq
    app.post('/postReport',
      middleware.postReportReq,
      middleware.postReport,
      (req, res) => {
        outerReq = req
        return res.sendStatus(200)
      },
    )
    beforeEach(() => outerReq = undefined)

    const cenReportAttached = () => {
      expect(outerReq._cen).toBeDefined()
    }

    const cenValues = ({ expReport, expCenKeys, expVer }) => () => {
      const { report, cenKeys, reportId, reportTimestamp, ver } = outerReq._cen || {}
      expect(report).toEqual(expReport)
      expect(cenKeys).toEqual(expCenKeys)
      expect(reportId).toBeTruthy()
      expect(reportTimestamp).toBeGreaterThan(0)
      expect(ver).toEqual(expVer)
    }

    test('with body, object report', () => {
      return supertest(app)
        .post('/postReport')
        .send({
          report: {},
        })
        .expect(cenReportAttached)
        .expect(cenValues({ expReport: {}, expCenKeys: [], expVer: 'v4' }))
        .expect(200)
    })

    test('with body, string report', () => {
      return supertest(app)
        .post('/postReport')
        .send({
          report: 'theReport',
        })
        .expect(cenReportAttached)
        .expect(cenValues({ expReport: 'theReport', expCenKeys: [], expVer: 'v4' }))
        .expect(200)
    })

    test('with body, sparse array of cenKeys', () => {
      return supertest(app)
        .post('/postReport')
        .send({
          report: 'theReport',
          cenKeys: [undefined, undefined, undefined, 'test1'],
        })
        .expect(cenReportAttached)
        .expect(cenValues({ expReport: 'theReport', expCenKeys: ['test1'], expVer: 'v3' }))
        .expect(200)
    })

    test('with body, string cenKeys', () => {
      return supertest(app)
        .post('/postReport')
        .send({
          report: 'theReport',
          cenKeys: '1, 4, , 5',
        })
        .expect(cenReportAttached)
        .expect(cenValues({ expReport: 'theReport', expCenKeys: ['1', '4', '5'], expVer: 'v3' }))
        .expect(200)
    })
  })
})
