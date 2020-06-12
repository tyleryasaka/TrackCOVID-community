require('dotenv').config()
const sha256 = require('js-sha256').sha256
const PDFDocument = require('pdfkit')
const QRCode = require('qrcode')
const express = require('express')
const passport = require('passport')
const createCsv = require('csv-writer').createObjectCsvStringifier
const Checkpoint = require('../models/checkpoint')
const User = require('../models/user')
const Location = require('../models/location')

const checkpointKeyLength = Number(process.env['CHECKPOINT_KEY_LENGTH'])

const adminApiRouter = express.Router()

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/admin')
  }
}

function generatePassword () {
  const length = 8
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let pw = ''
  for (var i = 0, n = charset.length; i < length; ++i) {
    pw += charset.charAt(Math.floor(Math.random() * n))
  }
  return pw
}

async function getCheckpointLocations (onSuccess, onErr) {
  Checkpoint.find({}, async function (err, checkpoints) {
    if (err || !checkpoints) {
      if (err) {
        console.error(err)
      }
      onErr(err)
    } else {
      const checkpointData = await Promise.all(checkpoints.map(checkpoint => {
        return new Promise((resolve, reject) => {
          Location.findOne({ checkpoint: checkpoint.key }, function (err, location) {
            if (err || !location) {
              resolve(undefined)
            } else {
              resolve({
                key: checkpoint.key,
                timestamp: checkpoint.timestamp,
                location: location
              })
            }
          })
        })
      }))
      onSuccess(checkpointData.filter(checkpoint => checkpoint !== undefined))
    }
  })
}

adminApiRouter.use('/static/', express.static('admin/build/static'))
adminApiRouter.get('/', function (req, res) {
  res.sendfile('admin/build/index.html')
})

adminApiRouter.get('/api/status', function (req, res) {
  const privilege = req.user && req.user.privilege
  const id = req.user && req.user._id
  const username = req.user && req.user.username
  res.send({
    isLoggedIn: req.isAuthenticated(),
    user: {
      privilege,
      id,
      username
    }
  })
})

adminApiRouter.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/admin')
})

adminApiRouter.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return res.send({ isLoggedIn: false })
    }
    if (!user) {
      return res.send({ isLoggedIn: false })
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.send({ isLoggedIn: false })
      }
      res.send({ isLoggedIn: true })
    })
  })(req, res, next)
})

adminApiRouter.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/admin')
})

adminApiRouter.put('/api/account', function (req, res) {
  const { currentPassword, newPassword } = req.body
  const id = req.user._id
  User.findOne({ _id: id }, function (err, user) {
    if (err || !user) {
      res.send({ error: true })
    } else {
      user.changePassword(currentPassword, newPassword, (err) => {
        res.send({ error: Boolean(err) })
      })
    }
  })
})

adminApiRouter.post('/api/users', ensureAuthenticated, function (req, res) {
  if (req.user.privilege === 1) {
    const newUser = {
      username: req.body.username,
      privilege: Number(req.body.privilege)
    }
    const tempPass = generatePassword()
    User.register(newUser, tempPass, function (err) {
      if (err) {
        console.error(err)
        res.send({ error: true })
      } else {
        res.send({
          error: false,
          user: {
            username: newUser.username,
            privilege: newUser.privilege,
            password: tempPass
          }
        })
      }
    })
  } else {
    res.send({ error: true, authorized: false })
  }
})

adminApiRouter.put('/api/users/:id', ensureAuthenticated, function (req, res) {
  if (req.user.privilege === 1) {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err || !user) {
        if (err) {
          console.error(err)
        }
        res.send({ error: true })
      } else {
        user.privilege = Number(req.body.privilege)
        user.save((err) => {
          if (err) {
            console.error(err)
            res.send({ error: true })
          } else {
            res.send({ error: false })
          }
        })
      }
    })
  } else {
    res.send({ error: true, authorized: false })
  }
})

adminApiRouter.delete('/api/users/:id', ensureAuthenticated, function (req, res) {
  if (req.user.privilege === 1) {
    User.deleteOne({ _id: req.params.id }, function (err) {
      if (err) {
        console.error(err)
        res.send({ error: true })
      } else {
        res.send({ error: false })
      }
    })
  } else {
    res.send({ error: true, authorized: false })
  }
})

adminApiRouter.get('/api/users', ensureAuthenticated, function (req, res) {
  if (req.user.privilege === 1) {
    User.find({}, function (err, users) {
      if (err || !users) {
        if (err) {
          console.error(err)
        }
        res.send({ error: true })
      } else {
        const usersData = users.map(user => {
          return {
            id: user._id,
            username: user.username,
            privilege: user.privilege
          }
        })
        res.send({ error: false, users: usersData })
      }
    })
  } else {
    res.send({ error: true, authorized: false })
  }
})

adminApiRouter.post('/api/checkpoints', ensureAuthenticated, (req, res) => {
  const { checkpoints } = req.body
  const checkpointsForDb = checkpoints.map(checkpoint => {
    return { key: checkpoint.key, timestamp: checkpoint.timestamp }
  })
  Checkpoint.create(checkpointsForDb, function (err, checkpoints) {
    if (err) {
      console.error(err)
      res.send({ error: true })
    } else {
      res.send({ error: false })
    }
  })
})

adminApiRouter.post('/api/location', ensureAuthenticated, async (req, res) => {
  if (req.user.privilege === 1) {
    const { latitude, longitude, name, phone, email } = req.body
    const checkpointKey = sha256(String(Math.random())).substring(0, checkpointKeyLength)
    Location.create({
      checkpoint: checkpointKey,
      latitude,
      longitude,
      name,
      phone,
      email
    }, function (err) {
      if (err) {
        console.error(err)
        res.send({ error: true })
      }
    })
    res.send({ error: false, checkpointKey })
  } else {
    res.sendStatus(403)
  }
})

adminApiRouter.get('/generate/:checkpointKey/checkpoint.pdf', ensureAuthenticated, async (req, res) => {
  if (req.user.privilege === 1) {
    const { checkpointKey } = req.params
    Location.findOne({ checkpoint: checkpointKey }, async function (err, location) {
      const doc = new PDFDocument()
      const appDomain = process.env.APP_DOMAIN
      const checkpointLink = `${appDomain}?checkpoint=${checkpointKey}`
      const checkpointQrCodeUrl = await QRCode.toDataURL(checkpointLink, { margin: 0, scale: 20 })
      const checkpointQrCodeImg = Buffer.from(checkpointQrCodeUrl.replace('data:image/png;base64,', ''), 'base64')
      const websiteLink = process.env.ABOUT_URL
      const websiteQRCodeUrl = await QRCode.toDataURL(websiteLink, { margin: 0, scale: 4 })
      const websiteQrCodeImg = Buffer.from(websiteQRCodeUrl.replace('data:image/png;base64,', ''), 'base64')
      doc.image('./public-checkpoint/track-covid.png', 0, 0, { width: 600 })
      doc.image(checkpointQrCodeImg, 55, 325, { width: 300 })
      doc.image(websiteQrCodeImg, 378, 668.5, { width: 37 })
      if (!err && location) {
        doc.fontSize(18)
        doc.text(location.name, 55, 660)
        const coords = [
          { x: 55, y: 685 },
          { x: 55, y: 700 }
        ]
        let numLines = 0
        if (location.phone) {
          doc.fontSize(12)
          doc.text(location.phone, coords[numLines].x, coords[numLines].y)
          numLines++
        }
        if (location.email) {
          doc.fontSize(12)
          doc.text(location.email, coords[numLines].x, coords[numLines].y)
          numLines++
        }
      }
      doc.pipe(res)
      doc.end()
    })
  } else {
    res.sendStatus(403)
  }
})

adminApiRouter.get('/api/checkpoints/locations', ensureAuthenticated, async (req, res) => {
  if (req.user.privilege === 1) {
    getCheckpointLocations(
      (checkpointData) => res.send({ error: false, checkpoints: checkpointData }),
      (err) => {
        console.log(err)
        res.send({ error: true })
      }
    )
  } else {
    res.sendStatus(403)
  }
})

adminApiRouter.get('/hotspots.csv', ensureAuthenticated, async (req, res) => {
  if (req.user.privilege === 1) {
    getCheckpointLocations(
      (checkpointData) => {
        const csvObj = createCsv({
          header: [
            { id: 'location', title: 'Location' },
            { id: 'phone', title: 'Phone' },
            { id: 'email', title: 'Email' },
            { id: 'latitude', title: 'Latitude' },
            { id: 'longitude', title: 'Longitude' },
            { id: 'time', title: 'Time of scan' },
            { id: 'checkpoint', title: 'Checkpoint' }
          ]
        })
        const records = checkpointData.map(checkpoint => {
          return {
            location: checkpoint.location.name,
            phone: checkpoint.location.phone,
            email: checkpoint.location.email,
            latitude: checkpoint.location.latitude,
            longitude: checkpoint.location.longitude,
            time: new Date(checkpoint.timestamp),
            checkpoint: checkpoint.key
          }
        })
        const csvString = csvObj.getHeaderString() + csvObj.stringifyRecords(records)
        res.attachment('hotspots.csv')
        res.status(200).send(csvString)
      },
      (err) => {
        console.log(err)
        res.send({ error: true })
      }
    )
  } else {
    res.sendStatus(403)
  }
})

module.exports = adminApiRouter
