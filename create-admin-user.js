require('dotenv').config()
const readline = require('readline')
const Writable = require('stream').Writable
var mongoose = require('mongoose')
const User = require('./models/user')

const mutableStdout = new Writable({
  write: function (chunk, encoding, callback) {
    if (!this.muted) {
      process.stdout.write(chunk, encoding)
    }
    callback()
  }
})

const rl = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
})

mutableStdout.muted = false

rl.question('\nEnter your production mongodb url (e.g. mongodb://user:pass@mongodb0.example.com:27017)\n', function (mongodbUri) {
  mongoose.connect(mongodbUri, { useNewUrlParser: true })
  const db = mongoose.connection
  db.once('open', function () {
    rl.question('\nEnter your new admin username\n', function (newUsername) {
      rl.question('\nEnter your new admin password\n', function (newPass) {
        mutableStdout.muted = false
        const newUser = new User({
          username: newUsername,
          canUploadCheckpoints: true,
          canCreateCheckpoints: true,
          canManageUsers: true,
          canAccessReports: true
        })
        User.register(newUser, newPass, function () {
          rl.write(`\nRegistered user ${newUsername} successfully\n`)
          process.exit()
        })
      })
      mutableStdout.muted = true
    })
  })
})
