const express = require('express')
const sha256 = require('js-sha256').sha256
const Checkpoint = require('../models/checkpoint')
const pdf = require('html-pdf')
const fs = require('fs')
const path = require('path')

const checkpointKeyLength = Number(process.env['CHECKPOINT_KEY_LENGTH'])

const publicCheckpointApiRouter = express.Router()

publicCheckpointApiRouter.get('/', (req, res) => {
  const key = sha256(String(Math.random())).substring(0, checkpointKeyLength)
  const checkpoint = new Checkpoint({
    key,
    links: [],
    exposed: false
  })
  checkpoint.save(function (err, checkpoint) {
    if (err) {
      console.error(err)
      res.sendStatus(500)
    } else {
      const htmlTemplate = fs.readFileSync('./public-checkpoint/pdf.html', 'utf8')
      const htmlComplete = htmlTemplate.replace('{{checkpointKey}}', key)
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
    }
  })
})

module.exports = publicCheckpointApiRouter
