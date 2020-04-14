const supertest = require('supertest')
const express = require('express')

const { middleware } = require('../index.js')


describe('middleware', () => {
  const app = express()
  app.use(express.json())

  app.post('/report',
    middleware.postReportReq,
    middleware.postReport,
    (_, res) => {
      return res.sendStatus(200)
    },
  )

  app.use((err, req, res) => {
    // TODO: revise error code
    return res.sendStatus(res.statusCode)
  })

  test('middleware.postReportReq - with no body', () => {
    return supertest(app)
      .post('/report')
      .expect(500)
  })
})
