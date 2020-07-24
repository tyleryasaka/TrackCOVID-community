const express = require('express')
const Checkpoint = require('../models/checkpoint')

const oneDay = 1000 * 60 * 60 * 24
const estimatedDiagnosisDelay = Number(process.env['QUARANTINE_DAYS']) * oneDay

const apiRouter = express.Router()

apiRouter.get('/checkpoints', (req, res) => {
  const startSearchTimestamp = Date.now() - estimatedDiagnosisDelay
  Checkpoint.find({ timestamp: { $gte: startSearchTimestamp } }, function (err, checkpoints) {
    if (err || !checkpoints) {
      if (err) {
        console.error(err)
      }
      res.send({ error: true })
    } else {
      res.send({ error: false, checkpoints })
    }
  })
})

module.exports = apiRouter
