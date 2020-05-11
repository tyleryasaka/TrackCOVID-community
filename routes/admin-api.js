const express = require('express')
const passport = require('passport')
const Checkpoint = require('../models/checkpoint')
const User = require('../models/user')

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

module.exports = adminApiRouter
