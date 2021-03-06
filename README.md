# CEN-node

TCN (CEN) API implementation in Node.js.

WIP, referencing [https://github.com/Co-Epi/coepi-backend-aws](https://github.com/Co-Epi/coepi-backend-aws)

```shell
% yarn add @eqworks/cen-node

# or

% npm install @eqworks/cen-node
```

## utils

## middleware

Express.js compatible HTTP middleware

```js
const express = require('express')
const { postReportReq, postReport } = require('@eqworks/cen-node')

// your own report persistence implementation
const { saveReport } = require('./db')

const app = express()
app.use(express.json())

app.post(['/tcnreport', '/cenreport'],
  // middleware to perform preliminary validations
  postReportReq,
  // middleware to populate req._cen
  // with a body of { report, reportID }
  postReport,
  // your own report persistence routine and response handler
  (req, res, next) => {
    saveReport(req._cen)
      .then(() => res.sendStatus(200))
      .catch(next)
  }
)
```
