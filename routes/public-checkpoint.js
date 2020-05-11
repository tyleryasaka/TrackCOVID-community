require('dotenv').config()
const express = require('express')
const sha256 = require('js-sha256').sha256
const pdf = require('html-pdf')
const fs = require('fs')
const path = require('path')

const checkpointKeyLength = Number(process.env['CHECKPOINT_KEY_LENGTH'])

const publicCheckpointApiRouter = express.Router()

publicCheckpointApiRouter.get('/', (req, res) => {
  const checkpointKey = sha256(String(Math.random())).substring(0, checkpointKeyLength)
  const htmlTemplate = fs.readFileSync('./public-checkpoint/pdf.html', 'utf8')
  const htmlComplete = htmlTemplate
    .split('{{checkpointKey}}').join(checkpointKey)
    .split('{{appName}}').join(process.env.APP_NAME)
    .split('{{appUrl}}').join(process.env.APP_URL)
  const config = {
    format: 'Letter',
    base: `file://${path.resolve('.')}/public-checkpoint/`,
    'renderDelay': 1000
  }
  pdf.create(htmlComplete, config).toStream(function (err, stream) {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    } else {
      stream.on('end', () => {
        return res.end()
      })
      stream.pipe(res)
    }
  })
})

module.exports = publicCheckpointApiRouter
