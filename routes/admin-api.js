require('dotenv').config()
const sha256 = require('js-sha256').sha256
const express = require('express')
const passport = require('passport')
const createCsv = require('csv-writer').createObjectCsvStringifier
const sgMail = require('@sendgrid/mail')
const generateCheckpoint = require('../public-checkpoint/generate-checkpoint')
const Checkpoint = require('../models/checkpoint')
const User = require('../models/user')
const Location = require('../models/location')
const ResetToken = require('../models/reset-token')

const checkpointKeyLength = Number(process.env['CHECKPOINT_KEY_LENGTH'])
const adminDomain = process.env['ADMIN_DOMAIN']
const adminEmailFrom = process.env['ADMIN_EMAIL_FROM']
const appName = process.env['APP_NAME']
sgMail.setApiKey(process.env['SENDGRID_API_KEY'])

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

adminApiRouter.get('/api/status', function (req, res) {
  const canUploadCheckpoints = req.user && req.user.canUploadCheckpoints
  const canCreateCheckpoints = req.user && req.user.canCreateCheckpoints
  const canManageUsers = req.user && req.user.canManageUsers
  const canAccessReports = req.user && req.user.canAccessReports
  const id = req.user && req.user._id
  const username = req.user && req.user.username
  res.send({
    isLoggedIn: req.isAuthenticated(),
    user: {
      canUploadCheckpoints,
      canCreateCheckpoints,
      canManageUsers,
      canAccessReports,
      id,
      username
    }
  })
})

adminApiRouter.get('/logout', function (req, res) {
  req.logout()
  res.redirect(`${adminDomain}/admin/login`)
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
  res.redirect('/admin/login')
})

adminApiRouter.put('/api/account', function (req, res) {
  const { username, currentPassword, newPassword } = req.body
  const id = req.user._id
  User.findOne({ _id: id }, function (err, user) {
    if (err || !user) {
      res.send({ error: true })
    } else {
      if (currentPassword && newPassword) {
        user.changePassword(currentPassword, newPassword, (err) => {
          res.send({ error: Boolean(err) })
        })
      } else if (username) {
        user.username = username
        user.save((err) => {
          if (err) {
            console.error(err)
            res.send({ error: true })
          } else {
            res.send({ error: false })
          }
        })
      } else {
        res.send({ error: true })
      }
    }
  })
})

adminApiRouter.post('/api/users', ensureAuthenticated, function (req, res) {
  if (req.user.canManageUsers) {
    const newUser = {
      username: req.body.username,
      canUploadCheckpoints: Boolean(req.body.canUploadCheckpoints),
      canCreateCheckpoints: Boolean(req.body.canCreateCheckpoints),
      canManageUsers: Boolean(req.body.canManageUsers),
      canAccessReports: Boolean(req.body.canAccessReports)
    }
    const tempPass = generatePassword()
    User.register(newUser, tempPass, async function (err) {
      if (err) {
        console.error(err)
        res.send({ error: true })
      } else {
        let hasError = false
        const msg = {
          to: newUser.username,
          from: adminEmailFrom, // Use the email address or domain you verified above
          subject: `Your login for ${appName} Admin`,
          text: `You have been registered as an admin for ${appName}. You may login with the information below.\n\nLogin page: ${adminDomain}/admin\nEmail: ${newUser.username}\nTemporary password: ${tempPass}`
        }
        try {
          await sgMail.send(msg)
        } catch (error) {
          console.error(error)
          if (error.response) {
            console.error(error.response.body)
          }
          hasError = true
        }
        res.send({
          error: hasError,
          user: hasError
            ? undefined
            : {
              username: newUser.username,
              canUploadCheckpoints: newUser.canUploadCheckpoints,
              canCreateCheckpoints: newUser.canCreateCheckpoints,
              canManageUsers: newUser.canManageUsers,
              canAccessReports: newUser.canAccessReports
            }
        })
      }
    })
  } else {
    res.send({ error: true, authorized: false })
  }
})

adminApiRouter.post('/api/users/reset-password-request', function (req, res) {
  const username = req.body.username
  User.findOne({ username }, async function (err, user) {
    if (err || !user) {
      if (err) {
        console.error(err)
      }
      res.send({ error: true })
    } else {
      const token = generatePassword()
      const resetToken = {
        username,
        token,
        timestamp: Date.now()
      }
      ResetToken.create(resetToken, async function (err) {
        if (err) {
          console.error(err)
          res.send({ error: true })
        } else {
          let hasError = false
          const msg = {
            to: user.username,
            from: adminEmailFrom, // Use the email address or domain you verified above
            subject: `Password reset for ${appName} Admin`,
            text: `We received a request to reset your password for ${appName} Admin. You may reset your password using the link below.\n\nReset your password: ${adminDomain}/admin/reset-password?token=${token}\n\nThis link will expire in 24 hours.`
          }
          try {
            await sgMail.send(msg)
          } catch (error) {
            console.error(error)
            if (error.response) {
              console.error(error.response.body)
            }
            hasError = true
          }
          res.send({ error: hasError })
        }
      })
    }
  })
})

adminApiRouter.post('/api/users/reset-password', function (req, res) {
  const { token, newPassword } = req.body
  ResetToken.findOne({ token }, async function (err, resetToken) {
    if (err || !resetToken) {
      if (err) {
        console.error(err)
      }
      res.send({ error: true })
    } else {
      const oneDay = 1000 * 60 * 60 * 24
      if (Date.now() - resetToken.timestamp > oneDay) {
        res.send({ error: true })
      } else {
        User.findOne({ username: resetToken.username }, async function (err, user) {
          if (err || !user) {
            if (err) {
              console.error(err)
            }
            res.send({ error: true })
          } else {
            await user.setPassword(newPassword)
            await user.save()
            ResetToken.deleteOne({ token }, function (err) {
              if (err) {
                console.error(err)
              }
              res.send({ error: false })
            })
          }
        })
      }
    }
  })
})

adminApiRouter.put('/api/users/:id', ensureAuthenticated, function (req, res) {
  if (req.user.canManageUsers) {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err || !user) {
        if (err) {
          console.error(err)
        }
        res.send({ error: true })
      } else {
        user.canUploadCheckpoints = Boolean(req.body.canUploadCheckpoints)
        user.canCreateCheckpoints = Boolean(req.body.canCreateCheckpoints)
        user.canManageUsers = Boolean(req.body.canManageUsers)
        user.canAccessReports = Boolean(req.body.canAccessReports)
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
    res.sendStatus(403)
  }
})

adminApiRouter.delete('/api/users/:id', ensureAuthenticated, function (req, res) {
  if (req.user.canManageUsers) {
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
  if (req.user.canManageUsers) {
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
            canUploadCheckpoints: user.canUploadCheckpoints,
            canCreateCheckpoints: user.canCreateCheckpoints,
            canManageUsers: user.canManageUsers,
            canAccessReports: user.canAccessReports
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
  if (req.user.canUploadCheckpoints) {
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
  } else {
    res.sendStatus(403)
  }
})

adminApiRouter.post('/api/location', ensureAuthenticated, async (req, res) => {
  if (req.user.canCreateCheckpoints) {
    const { latitude, longitude, name, phone, email } = req.body
    const checkpointHash = sha256(String(Math.random())).substring(0, checkpointKeyLength)
    const checkpointKey = checkpointHash
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
  if (req.user.canCreateCheckpoints) {
    const { checkpointKey } = req.params
    generateCheckpoint(checkpointKey, res)
  } else {
    res.sendStatus(403)
  }
})

adminApiRouter.get('/api/checkpoints/locations', ensureAuthenticated, async (req, res) => {
  if (req.user.canAccessReports) {
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
  if (req.user.canAccessReports) {
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

adminApiRouter.use('/static/', express.static('admin/build/static'))
adminApiRouter.get('/*', function (req, res) {
  res.sendfile('admin/build/index.html')
})

module.exports = adminApiRouter
